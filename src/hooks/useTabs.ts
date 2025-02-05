import { Tab } from "@/models/tab.model";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/constants/queryKeys";
import { get, put } from "@/api/http";
import { useState } from "react";
import { UpdateContentsRequest } from "@/app/api/contents/route";

export const useTabs = (userid: string) => {
  const queryClient = useQueryClient();

  const [localTabs, setLocalTabs] = useState<Tab[] | null>(null);
  const [currentTab, setCurrentTab] = useState<Tab | null>(null);

  const { data: serverTabs = [] } = useQuery<Tab[]>({
    queryKey: queryKeys.tabs({ userid }),
    queryFn: () => get<Tab[]>(`/tabs?userid=${userid}`),
  });

  const tabs = localTabs ?? serverTabs;

  const { mutate: updateTabsMutation } = useMutation({
    mutationFn: (newTabs: Tab[]) => put<Tab[]>(`/tabs`, newTabs),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tabs({ userid }) });
      setLocalTabs(null);
    },
    onError: (error) => {
      alert("탭 저장 중 오류가 발생했습니다. 다시 시도해 주세요.");
      console.error("탭 저장 오류:", error);
    },
  });

  const { mutate: updateContentsMutation } = useMutation({
    mutationFn: (updateContentsRequest: UpdateContentsRequest) =>
      put(`/contents`, updateContentsRequest),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tabs({ userid }) });
    },
    onError: (error) => {
      alert("탭 내용 저장 중 오류가 발생했습니다. 다시 시도해 주세요.");
      console.error("내용 저장 오류:", error);
    },
  });

  const addTab = (newTabName: string) => {
    if (!newTabName || newTabName.trim() === "") {
      alert("새 탭 이름을 입력하세요.");
      return;
    }

    const newTab: Tab = {
      userid,
      tid: generateUniqueTid(tabs),
      tname: newTabName,
      torder: tabs.length,
      contents: null,
    };

    setLocalTabs([...tabs, newTab]);
  };

  const deleteTab = (tid: number) => {
    const confirm = window.confirm(
      "정말 삭제하시겠습니까? 탭 속 내용도 함께 삭제됩니다.",
    );
    if (!confirm) return;

    const _tabs = tabs.filter((tab) => tab.tid !== tid);
    const reindexed = _tabs.map((tab, index) => ({
      ...tab,
      torder: index,
    }));

    setLocalTabs(reindexed);
  };

  const renameTab = (tid: number) => {
    const newTabName = window.prompt("새 탭 이름을 입력하세요.");
    if (!newTabName) return;
    setLocalTabs(
      tabs.map((tab) =>
        tab.tid === tid ? { ...tab, tname: newTabName } : tab,
      ),
    );
  };

  const saveTabs = () => {
    if (localTabs) {
      updateTabsMutation(localTabs);
    }
  };

  const updateContents = ({
    tid,
    newContent,
  }: {
    tid: number;
    newContent: string;
  }) => {
    const updateContentsRequest: UpdateContentsRequest = {
      userid,
      tid,
      contents: newContent,
    };
    updateContentsMutation(updateContentsRequest);
  };

  return {
    tabs,
    setLocalTabs,
    addTab,
    deleteTab,
    renameTab,
    saveTabs,
    updateContents,
    currentTab,
    setCurrentTab,
  };
};

const generateUniqueTid = (existingTabs: Tab[]): number => {
  const existingTids = new Set(existingTabs.map((tab) => tab.tid));
  let newTid: number;

  do {
    newTid = Math.floor(Math.random() * 999999) + 1;
  } while (existingTids.has(newTid));

  return newTid;
};

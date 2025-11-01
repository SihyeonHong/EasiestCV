import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { queryKeys } from "@/constants/queryKeys";
import { useTabs } from "@/hooks/useTabs";
import { Tab, SaveStatus } from "@/types/tab";
import { put } from "@/utils/http";

export const useTabManager = (userid: string) => {
  const queryClient = useQueryClient();
  const tMessage = useTranslations("message");
  const tError = useTranslations("error");
  const tAdmin = useTranslations("admin");

  const { tabs: serverTabs } = useTabs(userid);
  const [localTabs, setLocalTabs] = useState<Tab[] | null>(null);

  const tabs = localTabs ?? serverTabs;

  // 탭 전체 업데이트
  const { mutate: updateTabsMutation, isPending: isSaving } = useMutation({
    mutationFn: (newTabs: Tab[]) => put<Tab[]>(`/tabs`, newTabs),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: queryKeys.tabs({ userid }) });
      setLocalTabs(null);
      alert(tMessage("saveSuccess"));
    },
    onError: (error) => {
      alert(tError("saveFail"));
      console.error("탭 저장 오류:", error);
    },
  });

  // 저장 상태 계산
  const getSaveStatus = (): SaveStatus => {
    if (isSaving) return "saving";
    if (!localTabs) return "saved";

    // 서버 데이터와 로컬 데이터 비교
    const isDataEqual =
      JSON.stringify(serverTabs) === JSON.stringify(localTabs);
    if (isDataEqual) return "saved";

    return "unsaved";
  };

  const saveStatus = getSaveStatus();

  const addTab = (newTabName: string) => {
    if (!newTabName || newTabName.trim() === "") {
      alert(tAdmin("noTabName"));
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
    const confirm = window.confirm(tAdmin("deleteConfirm"));
    if (!confirm) return;

    const _tabs = tabs.filter((tab) => tab.tid !== tid);
    const reindexed = _tabs.map((tab, index) => ({
      ...tab,
      torder: index,
    }));

    setLocalTabs(reindexed);
  };

  const renameTab = (tid: number, newTabName: string) => {
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

  const resetTabs = () => {
    setLocalTabs(null);
  };

  return {
    tabs,
    localTabs,
    setLocalTabs,
    addTab,
    deleteTab,
    renameTab,
    saveTabs,
    resetTabs,
    saveStatus,
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

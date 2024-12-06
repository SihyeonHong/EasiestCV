import { useEffect, useState } from "react";
import { fetchTabs, updateTabs } from "../api/tap.api";
import { Tab } from "../models/tab.model";

export const useTabs = (userid: string) => {
  const [tabs, setTabs] = useState<Tab[]>([]);

  useEffect(() => {
    fetchTabs(userid).then((data) => setTabs(data));
  }, []);

  const addTab = (newTabName: string) => {
    if (!newTabName || newTabName.trim() === "") {
      alert("새 탭 이름을 입력하세요.");
      return;
    }

    const newTab = {
      userid,
      tid: Math.floor(Math.random() * 1000000),
      tname: newTabName,
      torder: tabs.length,
    };

    setTabs([...tabs, newTab]);
  };

  const deleteTab = (tid: number) => {
    const confirm = window.confirm(
      "정말 삭제하시겠습니까? 탭 속 내용도 함께 삭제됩니다."
    );
    if (!confirm) return;

    const _tabs = tabs.filter((tab) => tab.tid !== tid);
    const reindexed = _tabs.map((tab, index) => ({
      ...tab,
      torder: index,
    }));
    setTabs(reindexed);
  };

  const renameTab = (tid: number) => {
    const newTabName = window.prompt("새 탭 이름을 입력하세요.");
    if (!newTabName) return;
    setTabs(
      tabs.map((tab) => (tab.tid === tid ? { ...tab, tname: newTabName } : tab))
    );
  };

  const saveTabs = () => {
    updateTabs(tabs);
    fetchTabs(userid).then((data) => setTabs(data));
  };

  return { tabs, setTabs, addTab, deleteTab, renameTab, saveTabs };
};

"use client";

import { InfoIcon, PlusIcon, RotateCcwIcon, SaveIcon, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { MdDragIndicator } from "react-icons/md";

import NeedSaveDescription from "@/app/components/admin/NeedSaveDescription";
import SaveStatusIndicator from "@/app/components/admin/SaveStatusIndicator";
import { Button } from "@/app/components/common/Button";
import { Input } from "@/app/components/common/Input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/common/Table";
import { useTabManager } from "@/hooks/useTabManager";

interface TabManagerProps {
  userid: string;
}

export default function TabManager({ userid }: TabManagerProps) {
  const tAdmin = useTranslations("admin");
  const tButton = useTranslations("button");

  const {
    tabs,
    setLocalTabs,
    addTab,
    deleteTab,
    renameTab,
    saveTabs,
    resetTabs,
    saveStatus,
  } = useTabManager(userid);
  const [newTabName, setNewTabName] = useState<string>("");
  const [editingTabNames, setEditingTabNames] = useState<
    Record<number, string>
  >({});

  // save reference for dragItem and dragOverItem
  const dragItem = useRef<number | null>(null); // 내가 드래그중인 아이템
  const dragOverItem = useRef<number | null>(null); // 내가 드래그하고 있는 아이템이 들어갈 위치

  // handle drag sorting
  const handleSort = () => {
    if (dragItem.current === null || dragOverItem.current === null) return;

    let _tabs = [...tabs];

    //remove and save the dragged item content
    const draggedItemContent = _tabs.splice(dragItem.current, 1)[0];

    //switch the position
    _tabs.splice(dragOverItem.current, 0, draggedItemContent);

    // update torder based on the current index
    _tabs = _tabs.map((item, index) => ({
      ...item,
      torder: index,
    }));

    //reset the position ref
    dragItem.current = null;
    dragOverItem.current = null;

    //update the actual array
    setLocalTabs(_tabs);
  };

  // 모바일 터치 지원을 위한 핸들러들
  const handleTouchStart = (index: number) => {
    dragItem.current = index;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault(); // 스크롤 방지

    const touch = e.touches[0];
    const elementBelow = document.elementFromPoint(
      touch.clientX,
      touch.clientY,
    );

    // 드래그 오버 중인 아이템 찾기
    const dragOverElement = elementBelow?.closest("[data-drag-index]");
    if (dragOverElement) {
      const overIndex = parseInt(
        dragOverElement.getAttribute("data-drag-index") || "0",
      );
      dragOverItem.current = overIndex;
    }
  };

  const handleTouchEnd = () => {
    handleSort();
  };

  const handleTabNameChange = (tid: number, value: string) => {
    setEditingTabNames((prev) => ({
      ...prev,
      [tid]: value,
    }));
  };

  const handleTabNameBlur = (tid: number) => {
    const newName = editingTabNames[tid];
    const currentTab = tabs.find((tab) => tab.tid === tid);

    if (newName !== undefined && newName !== currentTab?.tname) {
      renameTab(tid, newName);
    }

    setEditingTabNames((prev) => {
      const updated = { ...prev };
      delete updated[tid];
      return updated;
    });
  };

  const getDragHandlers = (index: number) => ({
    // 마우스 이벤트 (기존)
    draggable: true,
    onDragStart: () => (dragItem.current = index),
    onDragEnter: () => (dragOverItem.current = index),
    onDragEnd: handleSort,
    onDragOver: (e: React.DragEvent) => e.preventDefault(),

    // 터치 이벤트 (모바일)
    onTouchStart: () => handleTouchStart(index),
    onTouchMove: (e: React.TouchEvent) => handleTouchMove(e),
    onTouchEnd: handleTouchEnd,

    // 데이터 속성 (터치 이벤트에서 사용)
    "data-drag-index": index,
  });

  return (
    <section id="tab-section" className="space-y-3">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold">{tAdmin("tabManager")}</h1>
        <NeedSaveDescription />
      </header>

      <div className="flex flex-col gap-8 sm:flex-row">
        {/* 테이블 섹션 */}
        <div className="border-b border-zinc-200 dark:border-zinc-800 sm:w-2/3 sm:border-b-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8"></TableHead>
                <TableHead className="whitespace-nowrap">
                  {tAdmin("tabOrder")}
                </TableHead>
                <TableHead className="w-full">{tAdmin("tabName")}</TableHead>
                <TableHead className="w-auto">{tAdmin("actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tabs.map((tab, idx) => (
                <TableRow key={idx} {...getDragHandlers(idx)}>
                  <TableCell className="w-8">
                    <MdDragIndicator />
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {tab.torder + 1}
                  </TableCell>
                  <TableCell className="w-full">
                    <Input
                      value={editingTabNames[tab.tid] ?? tab.tname}
                      onChange={(e) =>
                        handleTabNameChange(tab.tid, e.target.value)
                      }
                      onBlur={() => handleTabNameBlur(tab.tid)}
                    />
                  </TableCell>
                  <TableCell className="inline-flex w-auto items-center gap-1">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteTab(tab.tid)}
                    >
                      <X />
                      {tButton("delete")}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* 컨트롤 패널 섹션 */}
        <aside className="flex flex-col items-end justify-between gap-4 sm:w-1/3 sm:flex-col-reverse">
          {/* 새 탭 추가 */}
          <form
            className="mb-2 flex w-full flex-row gap-1"
            onSubmit={(e) => {
              e.preventDefault();
              addTab(newTabName);
              setNewTabName("");
            }}
          >
            <Input
              type="text"
              value={newTabName}
              required
              onChange={(e) => setNewTabName(e.target.value)}
              placeholder={tAdmin("newTabNamePlaceholder")}
              className="flex-1"
            />
            <Button variant="default" type="submit">
              <PlusIcon className="size-4" />
              {tAdmin("addTab")}
            </Button>
          </form>

          {/* 팁 */}
          <div className="w-full rounded-md bg-zinc-50 p-1 text-sm dark:bg-zinc-800">
            <header className="inline-flex items-center gap-1">
              <InfoIcon className="text-muted size-4" />
              <h3 className="text-md text-muted font-semibold">Tips</h3>
            </header>
            <ul className="list-inside list-disc">
              <li className="text-muted">{tAdmin("tabManagerDescription")}</li>
              <li className="text-muted sm:hidden">
                {tAdmin("tabManagerDescriptionMobile")}
              </li>
            </ul>
          </div>

          {/* 저장 */}
          <div className="flex gap-2">
            <SaveStatusIndicator status={saveStatus} />
            <Button variant="secondary" onClick={() => resetTabs()}>
              <RotateCcwIcon className="size-4" />
              {tButton("reset")}
            </Button>
            <Button variant="default" onClick={() => saveTabs()}>
              <SaveIcon className="size-4" />
              {tButton("save")}
            </Button>
          </div>
        </aside>
      </div>
    </section>
  );
}

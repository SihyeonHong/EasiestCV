"use client";

import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { MdDragIndicator } from "react-icons/md";

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
    <div className="flex flex-col gap-2">
      <h1 className="mb-2 text-2xl font-bold">{tAdmin("tabManager")}</h1>

      <div className="flex flex-col gap-4 sm:flex-row">
        {/* 컨트롤 패널 섹션 */}
        <div className="flex flex-col gap-4 sm:w-1/2">
          <div className="text-muted text-sm">
            <p>{tAdmin("tabManagerDescription")}</p>
            <p>{tAdmin("tabManagerDescriptionMobile")}</p>
          </div>

          <form
            className="flex flex-row gap-1"
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
            />
            <Button variant="default" type="submit">
              {tAdmin("addTab")}
            </Button>
          </form>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button variant="secondary" onClick={() => resetTabs()}>
              {tButton("reset")}
            </Button>
            <Button variant="default" onClick={() => saveTabs()}>
              {tButton("save")}
            </Button>
          </div>
        </div>

        {/* 세로 구분선 */}
        <div className="hidden w-px self-stretch bg-zinc-200 dark:bg-zinc-800 sm:block" />

        {/* 테이블 섹션 */}
        <div className="sm:w-1/2">
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
      </div>
    </div>
  );
}

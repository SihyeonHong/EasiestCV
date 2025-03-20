"use client";

import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { MdDragIndicator } from "react-icons/md";

import TabCancel from "@/app/components/admin/TabCancel";
import { Button } from "@/app/components/common/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/common/Dialog";
import { Input } from "@/app/components/common/Input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/common/Table";
import { useTabs } from "@/hooks/useTabs";

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
  } = useTabs(userid);
  const [newTabName, setNewTabName] = useState<string>("");

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

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost">{tAdmin("tabManager")}</Button>
      </DialogTrigger>

      <DialogContent
        onPointerDownOutside={(e) => e.preventDefault()} // 외부 클릭 시 닫힘 방지
        onEscapeKeyDown={() => {}} // ESC 키 눌렀을 때 닫힘 방지
      >
        <DialogHeader>
          <DialogTitle>{tAdmin("tabManager")}</DialogTitle>
          <DialogDescription>
            {tAdmin("tabManagerDescription")}
          </DialogDescription>
        </DialogHeader>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>{tAdmin("tabOrder")}</TableHead>
              <TableHead>{tAdmin("tabName")}</TableHead>
              <TableHead>{tAdmin("actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tabs.map((tab, idx) => (
              <TableRow
                key={idx}
                draggable
                onDragStart={() => {
                  dragItem.current = idx;
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  dragOverItem.current = idx;
                }}
                onDragEnd={handleSort}
              >
                <TableCell>
                  <MdDragIndicator />
                </TableCell>
                <TableCell>{tab.torder + 1}</TableCell>
                <TableCell>{tab.tname}</TableCell>
                <TableCell className="inline-flex items-center gap-1">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => renameTab(tab.tid)}
                  >
                    {tButton("rename")}
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => deleteTab(tab.tid)}
                  >
                    {tButton("delete")}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

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
            {tButton("addTab")}
          </Button>
        </form>

        <DialogFooter>
          <TabCancel resetTabs={resetTabs} />
          <Button variant="default" onClick={() => saveTabs()}>
            {tButton("save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

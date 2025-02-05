"use client";

import { Modal, Button, Table } from "react-bootstrap";
import { useRef, useState } from "react";
import { useTabs } from "@/hooks/useTabs";

interface TabModalProps {
  userid: string;
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
}

export default function TabModal({
  userid,
  isModalOpen,
  setIsModalOpen,
}: TabModalProps) {
  const { tabs, setLocalTabs, addTab, deleteTab, renameTab, saveTabs } =
    useTabs(userid);

  const [newTabName, setNewTabName] = useState<string>("New Tab");

  // save reference for dragItem and dragOverItem
  const dragItem = useRef<any>(null); // 내가 드래그중인 아이템
  const dragOverItem = useRef<any>(null); // 내가 드래그하고 있는 아이템이 들어갈 위치

  // handle drag sorting
  const handleSort = () => {
    //duplicate items
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

  const handleSave = () => {
    saveTabs();
    setIsModalOpen(false);
  };

  return (
    <Modal
      show={isModalOpen}
      onHide={() => setIsModalOpen(false)}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>Tab Settings</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>위아래로 드래그하면 탭의 순서를 바꿀 수 있습니다.</p>
        <p>Drag up and down to change the order of tabs.</p>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Index</th>
              <th>Tab Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tabs?.map((tab, idx) => (
              <tr
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
                <td>{tab.torder + 1}</td>
                <td>{tab.tname}</td>
                <td>
                  <Button variant="dark" onClick={() => renameTab(tab.tid)}>
                    RENAME
                  </Button>
                  <Button variant="light" onClick={() => deleteTab(tab.tid)}>
                    DELETE
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <input
          type="text"
          placeholder="New Tab Name"
          value={newTabName}
          onChange={(e) => setNewTabName(e.target.value)}
        />
        <Button variant="dark" onClick={() => addTab(newTabName)}>
          Add Tab
        </Button>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="light" onClick={() => setIsModalOpen(false)}>
          Reset
        </Button>
        <Button variant="dark" onClick={handleSave}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

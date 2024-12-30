"use client";

import axios from "axios";
import { Nav, Container, Row, Modal, Button, Table } from "react-bootstrap";
import { useState, useRef } from "react";
import AdminHome from "./AdminHome";
import AdminEditor from "./AdminEditor";
import Footer from "../Footer";
import Body from "../Body";
import { useHome } from "@/hooks/useHome";
import { useTabs } from "@/hooks/useTabs";

interface Props {
  userid: string;
}

export default function AdminPage({ userid }: Props) {
  const { tabs, setLocalTabs, addTab, deleteTab, renameTab, saveTabs } =
    useTabs(userid);
  const { homeData, setHomeData } = useHome(userid);

  const [activeKey, setActiveKey] = useState<number>(0);
  const [show, setShow] = useState(false);

  const [newTabName, setNewTabName] = useState<string>("New Tab");
  const [selectedPDF, setSelectedPDF] = useState<File | null>(null);

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
    setShow(false);
  };

  const handlePDFUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedPDF(e.target.files[0]);
      const formData = new FormData();
      formData.append("file", e.target.files[0]);
      formData.append("userid", userid);
      const res = axios
        .post("/api/post/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          alert("PDF 파일이 업로드되었습니다.");
          if (res.data.pdfUrl) {
            setHomeData({ ...homeData, pdf: res.data.pdfUrl });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <div>
      <Container>
        <Row>
          <Nav
            variant="underline"
            className="nav justify-content-center"
            activeKey={activeKey}
          >
            <Nav.Item>
              <Nav.Link
                eventKey={0}
                onClick={() => {
                  setActiveKey(0);
                }}
              >
                Home
              </Nav.Link>
            </Nav.Item>
            {tabs.map((tab, idx) => (
              <Nav.Item key={tab.tid}>
                <Nav.Link
                  eventKey={tab.tid}
                  onClick={() => {
                    setActiveKey(tab.tid);
                  }}
                >
                  {tab.tname}
                </Nav.Link>
              </Nav.Item>
            ))}
            <Nav.Item>
              <div className="nav-pdf">
                PDF{"  "}
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handlePDFUpload}
                />
              </div>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link onClick={() => setShow(true)}>탭 관리</Nav.Link>
              <Modal
                show={show}
                onHide={() => setShow(false)}
                backdrop="static"
                keyboard={false}
              >
                <Modal.Header closeButton>
                  <Modal.Title>탭 관리</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  위아래로 드래그하면 탭의 순서를 바꿀 수 있습니다.
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Index</th>
                        <th>Tab Name</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tabs &&
                        tabs.map((tab, idx) => (
                          <tr
                            key={idx}
                            draggable
                            onDragStart={(e) => {
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
                              <Button
                                variant="dark"
                                onClick={() => renameTab(tab.tid)}
                              >
                                RENAME
                              </Button>
                              <Button
                                variant="light"
                                onClick={() => deleteTab(tab.tid)}
                              >
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
                    탭 추가
                  </Button>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="light" onClick={() => setShow(false)}>
                    초기화
                  </Button>
                  <Button variant="dark" onClick={handleSave}>
                    이대로 저장하기
                  </Button>
                </Modal.Footer>
              </Modal>
            </Nav.Item>
          </Nav>
        </Row>
        <Body>
          {activeKey === 0 ? (
            <AdminHome userid={userid} />
          ) : (
            <AdminEditor userid={userid} tid={activeKey} />
          )}
        </Body>
        <Row>
          <Footer />
        </Row>
      </Container>
    </div>
  );
}

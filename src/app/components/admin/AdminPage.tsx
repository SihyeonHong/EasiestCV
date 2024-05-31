"use client";

import axios from "axios";
import { Nav, Container, Row, Modal, Button, Table } from "react-bootstrap";
import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../redux/store";
import AdminHome from "./AdminHome";
import { setUserInfo } from "../../../redux/store";
import AdminEditor from "./AdminEditor";
import Footer from "../Footer";
import { Tab } from "../../../models/tab.model";

export default function AdminPage() {
  // from Redux store
  const userinfo = useSelector((state: RootState) => state.userinfo);
  const userid = useSelector((state: RootState) => state.userinfo.userid);
  const tabs = useSelector((state: RootState) => state.tabs);
  const dispatch = useDispatch<AppDispatch>();

  // from local state
  const [tabstate, setTabstate] = useState<Tab[]>(tabs);
  const [activeKey, setActiceKey] = useState<number>(0);
  const [show, setShow] = useState(false);
  const [newTabName, setNewTabName] = useState<string>("New Tab");
  const [selectedPDF, setSelectedPDF] = useState<File | null>(null);

  // button handlers
  const handleClose = () => {
    setTabstate(tabs);
    setShow(false);
  };
  const handleShow = () => {
    setTabstate(tabs);
    setShow(true);
  };
  const addTab = () => {
    setTabstate([
      ...tabstate,
      {
        userid,
        tid: Math.random() * 1000000,
        tname: newTabName,
        torder: tabstate.length,
      },
    ]);
  };
  const deleteTab = (tid: number) => {
    const confirm = window.confirm(
      "정말 삭제하시겠습니까? 탭 속 내용도 함께 삭제됩니다."
    );
    if (!confirm) return;
    const newTabstate = tabstate.filter((tab) => tab.tid !== tid);
    const reindex = newTabstate.map((tab, index) => ({
      ...tab,
      torder: index,
    }));
    setTabstate(reindex);
  };
  const updateTab = (tid: number, newTabName: string) => {
    setTabstate(
      tabstate.map((tab) =>
        tab.tid === tid ? { ...tab, tname: newTabName } : tab
      )
    );
  };

  //save reference for dragItem and dragOverItem
  const dragItem = useRef<any>(null); // 내가 드래그중인 아이템
  const dragOverItem = useRef<any>(null); // 내가 드래그하고 있는 아이템이 들어갈 위치

  //const handle drag sorting
  const handleSort = () => {
    //duplicate items
    let _tabstate = [...tabstate];

    //remove and save the dragged item content
    const draggedItemContent = _tabstate.splice(dragItem.current, 1)[0];

    //switch the position
    _tabstate.splice(dragOverItem.current, 0, draggedItemContent);

    // update torder based on the current index
    _tabstate = _tabstate.map((item, index) => ({
      ...item,
      torder: index,
    }));

    //reset the position ref
    dragItem.current = null;
    dragOverItem.current = null;

    //update the actual array
    setTabstate(_tabstate);
  };

  const renameTab = (tid: number) => {
    const newTabName = window.prompt("새 탭 이름을 입력하세요.");
    if (!newTabName) return;
    updateTab(tid, newTabName);
  };

  const saveTab = () => {
    // TODO: save tabstate to redux
    dispatch({ type: "tabs/setTabs", payload: tabstate });
    const res = axios
      .put("/api/put/tabs", tabstate)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
    handleClose();
  };

  const handlePDFUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedPDF(e.target.files[0]);
      const formData = new FormData();
      formData.append("file", e.target.files[0]);
      formData.append("userid", userinfo.userid);
      const res = axios
        .post("/api/post/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          alert("PDF 파일이 업로드되었습니다.");
          if (res.data.pdfUrl) {
            dispatch(setUserInfo({ ...userinfo, pdf: res.data.pdfUrl }));
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
                  //   navigate("/" + userid);
                  setActiceKey(0);
                }}
              >
                Home
              </Nav.Link>
            </Nav.Item>
            {tabs &&
              tabs.map((tab, idx) => (
                <Nav.Item key={tab.tid}>
                  <Nav.Link
                    eventKey={tab.tid}
                    onClick={() => {
                      setActiceKey(tab.tid);
                      //   navigate(currentPath + "/" + tab);
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
              <Nav.Link onClick={handleShow}>탭 관리</Nav.Link>
              <Modal
                show={show}
                onHide={handleClose}
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
                      {tabstate.map((tab, idx) => (
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
                  <Button variant="dark" onClick={addTab}>
                    탭 추가
                  </Button>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="light" onClick={handleClose}>
                    초기화
                  </Button>
                  <Button variant="dark" onClick={saveTab}>
                    이대로 저장하기
                  </Button>
                </Modal.Footer>
              </Modal>
            </Nav.Item>
          </Nav>
        </Row>
        <Row>
          {activeKey === 0 ? <AdminHome /> : <AdminEditor tid={activeKey} />}
        </Row>
        <Row>
          <Footer />
        </Row>
      </Container>
    </div>
  );
}

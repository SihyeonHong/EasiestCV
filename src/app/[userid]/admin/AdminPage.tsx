"use client";

import { Nav, Container, Row, Modal, Button, Table } from "react-bootstrap";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../redux/store";
import AdminHome from "./AdminHome";
import AdminTab from "./AdminTab";

export default function AdminPage() {
  const userid = useSelector((state: RootState) => state.userinfo.userid);
  const tabs = useSelector((state: RootState) => state.tabs);

  const [activeKey, setActiceKey] = useState<number>(0);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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
            <Nav.Item style={{ color: "white" }}>
              PDF{"  "}
              <input
                type="file"
                accept="application/pdf"
                style={{ color: "white" }}
              />
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
                  I will not close if you click outside me. Don not even try to
                  press escape key.
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Index</th>
                        <th>Tab Name</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tabs.map((tab, idx) => (
                        <tr key={idx}>
                          <td>{tab.tid}</td>
                          <td>{tab.tname}</td>
                          <td>삭제</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleClose}>
                    Close
                  </Button>
                  <Button variant="primary">Understood</Button>
                </Modal.Footer>
              </Modal>
            </Nav.Item>
          </Nav>
        </Row>
        <Row className="page-body">
          {activeKey === 0 ? (
            <AdminHome />
          ) : (
            <AdminTab userid={userid} tid={activeKey} />
          )}
        </Row>
      </Container>
    </div>
  );
}

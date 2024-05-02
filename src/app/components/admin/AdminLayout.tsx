"use client";

import {
  ButtonGroup,
  Button,
  Container,
  Row,
  Col,
  Modal,
  Form,
} from "react-bootstrap";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../pages/redux/store";
import { setUserInfo, setTabs } from "../../../pages/redux/store";
import axios from "axios";
import AdminPage from "./AdminPage";

export default function AdminLayout({ userid }: { userid: string }) {
  const [isUserExist, setIsUserExist] = useState(false);
  const redux = useSelector((state: RootState) => state);
  const dispatch = useDispatch<AppDispatch>();
  //   console.log("redux", redux);

  const [show, setShow] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [changePW, setChangePW] = useState(false); // [false, true]
  const [currentPW, setCurrentPW] = useState("");
  const [newPW, setNewPW] = useState("");
  const [confirmPW, setConfirmPW] = useState("");

  const getUser = async () => {
    const res = await axios.get(`/api/get/user?userid=${userid}`);
    // console.log(res.data);
    setUsername(res.data[0].username);
    setEmail(res.data[0].email);
  };

  const getUserInfo = async () => {
    const res = await axios.get(`/api/get/userinfo?userid=${userid}`);
    // console.log(res.data); // [ {img: null,  intro: "Hello!", pdf: null, userid: "testid"} ] or []

    if (res.data.length > 0) {
      setIsUserExist(true);
      dispatch(setUserInfo(res.data[0])); // save into redux
    }
  };
  const getTabs = async () => {
    const res = await axios.get(`/api/get/tabs?userid=${userid}`);
    // console.log(res.data); // [ {tid: 1,  tname: "Tab1", userid: "test2"} ] or []

    if (res.data.length > 0) {
      dispatch(setTabs(res.data)); // save into redux
    }
  };

  const handleLogout = () => {
    // delete session
    sessionStorage.removeItem("userid");
    sessionStorage.removeItem("token");
    window.location.href = `/${userid}`;
  };

  const handleClose = () => setShow(false);
  const handleOpen = () => {
    getUser();
    setShow(true);
  };

  const handleSave = () => {
    const data = {
      userid: userid,
      username: username,
      email: email,
      currentPW: currentPW,
      newPW: newPW,
    };

    if (changePW) {
      if (currentPW === "") {
        alert("현재 비밀번호를 입력해주세요.");
        return;
      }
      if (newPW === "") {
        alert("새 비밀번호를 입력해주세요.");
        return;
      }
      if (confirmPW === "") {
        alert("새 비밀번호를 다시 입력해주세요.");
        return;
      }
      if (newPW !== confirmPW) {
        alert("새 비밀번호가 일치하지 않습니다.");
        return;
      }

      axios
        .put("/api/put/password", data)
        .then((res) => {
          alert("회원정보가 수정되었습니다.");
        })
        .catch((err) => {
          alert(err.response.data.message);
          console.log(err);
        });
    } else {
      axios
        .put("/api/put/user", data)
        .then((res) => {
          alert("회원정보가 수정되었습니다.");
        })
        .catch((err) => {
          alert(err.response.data.message);
          console.log(err);
        });
    }
  };

  useEffect(() => {
    getUser();
    getUserInfo();
    getTabs();
  }, []);

  return (
    <Container>
      <Row style={{ textAlign: "right" }}>
        <Col>
          <ButtonGroup>
            <Button variant="dark" onClick={handleLogout}>
              로그아웃
            </Button>
            <Button variant="light" onClick={handleOpen}>
              회원정보수정
            </Button>
          </ButtonGroup>
        </Col>
        <Modal
          show={show}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>회원정보수정</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ textAlign: "left" }}>
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Your Name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <br></br>
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Your Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Form.Text className="text-muted">
              If you forget your password, you will receive email here.
            </Form.Text>
          </Modal.Body>
          <br></br>
          <Button
            variant="dark"
            onClick={() => setChangePW(!changePW)}
            style={{ marginLeft: "2vw", marginRight: "2vw" }}
          >
            Change Password?
          </Button>
          <Modal.Body
            className={changePW ? "" : "change-pw-hidden"}
            style={{ textAlign: "left" }}
          >
            <Form.Text className="text-muted">
              If you don't want to change your password, click the button above
              again.
            </Form.Text>
            <br></br>
            <br></br>
            <Form.Label>Current Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Current Password"
              value={currentPW}
              onChange={(e) => setCurrentPW(e.target.value)}
            />
            <br></br>
            <Form.Label>New Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="New Password"
              value={newPW}
              onChange={(e) => setNewPW(e.target.value)}
            />
            <br></br>
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="New Password Again"
              value={confirmPW}
              onChange={(e) => setConfirmPW(e.target.value)}
            />
            <br></br>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="light" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="dark" onClick={handleSave}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>
      </Row>
      <Row>
        <h1 className="title">
          {username ? username.toUpperCase() : userid.toUpperCase()}
        </h1>
      </Row>
      <Row>
        <AdminPage />
      </Row>
    </Container>
  );
}

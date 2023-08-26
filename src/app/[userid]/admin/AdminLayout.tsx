"use client";

import { ButtonGroup, Button, Container, Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../redux/store";
import { setUserInfo, setTabs } from "../../../redux/store";
import axios from "axios";
import AdminPage from "./AdminPage";

export default function AdminLayout({ userid }: { userid: string }) {
  const [isUserExist, setIsUserExist] = useState(false);
  const redux = useSelector((state: RootState) => state);
  const dispatch = useDispatch<AppDispatch>();
  //   console.log("redux", redux);

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

  const handleTest = () => {
    console.log(redux);
  };

  useEffect(() => {
    getUserInfo();
    getTabs();
  }, []);

  return (
    <Container>
      <Row style={{ textAlign: "right" }}>
        <Col>
          <ButtonGroup>
            <Button variant="dark" onClick={handleLogout}>
              저장하고 로그아웃
            </Button>
            <Button variant="light" onClick={handleTest}>
              회원정보수정
            </Button>
          </ButtonGroup>
        </Col>
      </Row>
      <Row>
        <h1 className="title">{userid.toUpperCase()}</h1>
      </Row>
      <Row>
        <AdminPage />
      </Row>
    </Container>
  );
}

"use client";

import { ButtonGroup, Button, Container, Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";
import axios from "axios";
import AdminPage from "./AdminPage";

export default function AdminLayout({ userid }: { userid: string }) {
  const [userinfo, setUserInfo] = useState({
    userid: "",
    intro: "",
    img: "",
    pdf: "",
  });
  const [isUserExist, setIsUserExist] = useState(false);
  const [activeKey, setActiceKey] = useState("home");
  const [tabs, setTabs] = useState(["Tab1"]);
  const getUserInfo = async () => {
    const res = await axios.get(`/api/get/userinfo?userid=${userid}`);
    console.log(res.data); // [ {img: null,  intro: "Hello!", pdf: null, userid: "testid"} ] or []

    if (res.data.length > 0) {
      setUserInfo(res.data[0]);
      setIsUserExist(true);
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <Container>
      <Row style={{ textAlign: "right" }}>
        <Col>
          <ButtonGroup>
            <Button variant="dark">저장하고 로그아웃</Button>
            <Button variant="light">회원정보수정</Button>
          </ButtonGroup>
        </Col>
      </Row>
      <Row>
        <h1 className="title">{userid.toUpperCase()}</h1>
      </Row>
      <Row>
        <AdminPage userinfo={userinfo} />
      </Row>
    </Container>
  );
}

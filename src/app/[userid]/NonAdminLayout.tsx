"use client";

import { Nav, Button, Container, Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import NonAdminPage from "./NonAdminPage";
import NoUserPage from "./NoUserPage";

export default function NonAdminLayout({ userid }: { userid: string }) {
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
          <Link href="/">
            <Button variant="dark">Log In | Sign Up</Button>
          </Link>
        </Col>
      </Row>
      <Row>
        <h1 className="title">{userid.toUpperCase()}</h1>
      </Row>
      <Row>
        {isUserExist ? <NonAdminPage userinfo={userinfo} /> : <NoUserPage />}
      </Row>
    </Container>
  );
}

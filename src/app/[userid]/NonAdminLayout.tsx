"use client";

// import styled from "styled-components";
import { Nav, Button, Container, Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import Link from "next/link";
import axios from "axios";
import NonAdminPage from "./NonAdminPage";
import NoUserPage from "./NoUserPage";
import LoadingPage from "./LoadingPage";

export default function NonAdminLayout({ userid }: { userid: string }) {
  const redux = useSelector((state: RootState) => state);
  const [userinfo, setUserInfo] = useState({
    userid: "",
    intro: "",
    img: "",
    pdf: "",
  });
  const [loading, setLoading] = useState(true);
  const [isUserExist, setIsUserExist] = useState(false);
  const [activeKey, setActiceKey] = useState("home");
  const [tabs, setTabs] = useState(["Tab1"]);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const getUser = async () => {
    const res = await axios.get(`/api/get/user?userid=${userid}`);
    // console.log(res.data);
    if (res.data.length > 0) {
      setUsername(res.data[0].username);
      setEmail(res.data[0].email);
    }
  };
  const getUserInfo = async () => {
    const res = await axios.get(`/api/get/userinfo?userid=${userid}`);
    // console.log(res.data); // [ {img: null,  intro: "Hello!", pdf: null, userid: "testid"} ] or []

    if (res.data.length > 0) {
      setUserInfo(res.data[0]);
      setIsUserExist(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    getUser();
    getUserInfo();
  }, []);

  return (
    <Container style={{ padding: "0px" }}>
      <Row style={{ textAlign: "right" }}>
        <Col>
          <Link href="/">
            <Button variant="dark">Log In | Sign Up</Button>
          </Link>
        </Col>
      </Row>
      <Row>
        <h1 className="title">
          {username ? username.toUpperCase() : userid.toUpperCase()}
        </h1>
      </Row>
      <Row>
        {loading ? (
          <LoadingPage />
        ) : isUserExist ? (
          <NonAdminPage userinfo={userinfo} />
        ) : (
          <NoUserPage />
        )}
      </Row>
    </Container>
  );
}

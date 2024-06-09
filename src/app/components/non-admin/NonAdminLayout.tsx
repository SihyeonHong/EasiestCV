"use client";

import { Button, Container, Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../redux/store";
import { setUserInfo } from "../../../redux/store";
import Link from "next/link";
import axios from "axios";
import NonAdminPage from "./NonAdminPage";
import NoUserPage from "../NoUserPage";
import LoadingPage from "../LoadingPage";
import Title from "../Title";

export default function NonAdminLayout({ userid }: { userid: string }) {
  const dispatch = useDispatch<AppDispatch>();
  const userinfo = useSelector((state: RootState) => state.userinfo);
  const [loading, setLoading] = useState(true);
  const [isUserExist, setIsUserExist] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const getUser = async () => {
    const res = await axios.get(`/api/get/user?userid=${userid}`);
    if (res.data.length > 0) {
      setUsername(res.data[0].username);
      setEmail(res.data[0].email);
    }
  };
  const getUserInfo = async () => {
    const res = await axios.get(`/api/get/userinfo?userid=${userid}`);

    if (res.data.length > 0) {
      dispatch(setUserInfo(res.data[0]));
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
      <Title title={username ? username : userid}></Title>
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

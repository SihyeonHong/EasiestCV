"use client";

import { Button, Container, Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import NonAdminPage from "./NonAdminPage";
import NoUserPage from "../NoUserPage";
import LoadingPage from "../LoadingPage";
import Title from "../Title";

export default function NonAdminLayout({ userid }: { userid: string }) {
  const [loading, setLoading] = useState(true);
  const [isUserExist, setIsUserExist] = useState(false);
  const [username, setUsername] = useState("");

  const getUser = async () => {
    const res = await axios.get(`/api/get/user?userid=${userid}`);
    if (res.data.length > 0) {
      setUsername(res.data[0].username);
      setIsUserExist(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    getUser();
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
          <NonAdminPage userid={userid} />
        ) : (
          <NoUserPage />
        )}
      </Row>
    </Container>
  );
}

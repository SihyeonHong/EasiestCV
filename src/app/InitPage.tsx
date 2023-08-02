"use client";
import { useState } from "react";
import { Container, Row, Nav } from "react-bootstrap";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import axios from "axios";

export default function InitPage() {
  const [showLogin, setShowLogin] = useState(true);
  const handleLoginOpen = () => setShowLogin(true);
  const handleSignupOpen = () => setShowLogin(false);

  const getTest = async () => {
    axios.get("/api/test").then((res) => {
      console.log(res.data);
    });
  };

  return (
    <Container>
      <h1 className="title">Easiest CV</h1>
      <Nav
        variant="underline"
        defaultActiveKey="login"
        className="justify-content-center"
      >
        <Nav.Item>
          <Nav.Link eventKey="login" onClick={handleLoginOpen}>
            Log In
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="signup" onClick={handleSignupOpen}>
            Sign Up
          </Nav.Link>
        </Nav.Item>
      </Nav>
      <Row>{showLogin ? <LoginForm /> : <RegisterForm />}</Row>
      <Row>
        <button onClick={() => getTest()}>test</button>
      </Row>
    </Container>
  );
}

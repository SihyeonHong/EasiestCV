"use client";

import { useState } from "react";
import { Container, Row, Nav } from "react-bootstrap";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

export default function InitPage() {
  const [showLogin, setShowLogin] = useState(true);
  const handleLoginOpen = () => setShowLogin(true);
  const handleSignupOpen = () => setShowLogin(false);

  return (
    <Container>
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
    </Container>
  );
}

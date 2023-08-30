"use client";
import { useState } from "react";
import { Container, Row, Nav, Button, Form } from "react-bootstrap";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
// import axios from "axios";

export default function InitPage() {
  const [showLogin, setShowLogin] = useState(true);
  const handleLoginOpen = () => setShowLogin(true);
  const handleSignupOpen = () => setShowLogin(false);

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
    </Container>
  );
}

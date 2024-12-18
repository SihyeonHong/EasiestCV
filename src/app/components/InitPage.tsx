"use client";

import { useState } from "react";
import { Container, Row, Nav } from "react-bootstrap";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import styled from "styled-components";

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
      <Row>
        <DemoText>
          Want to try? Use this demo account{" "}
          <DemoCredentials>ID: tutorial / PW: easiestcv</DemoCredentials> or
          check out{" "}
          <DemoLink
            href="https://easiest-cv.vercel.app/tutorial"
            target="_blank"
            rel="noopener noreferrer"
          >
            Professor John Doe's CV →
          </DemoLink>
        </DemoText>
      </Row>
    </Container>
  );
}
const DemoText = styled.p`
  text-align: center;
  margin: 1.5rem 0;
  color: #666;
  background-color: rgb(250, 250, 247);
  padding: 1rem;
  border-radius: 4px;
`;

const DemoLink = styled.a`
  color: #0066cc;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const DemoCredentials = styled.span`
  background-color: #f8f9fa;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-family: monospace;
`;

"use client";

import { Button, Col, Container, Row } from "react-bootstrap";
import Link from "next/link";

export default function ToInitBtn() {
  return (
    <Container>
      <Row style={{ textAlign: "right" }}>
        <Col>
          <Link href="/">
            <Button variant="dark">Log In | Sign Up</Button>
          </Link>
        </Col>
      </Row>
    </Container>
  );
}

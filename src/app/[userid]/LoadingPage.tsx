"use client";

import { Container, Row } from "react-bootstrap";

export default function NoUserPage() {
  return (
    <Container className="tabBody">
      <Row style={{ textAlign: "center" }}>
        <h1>Loading...</h1>
      </Row>
    </Container>
  );
}

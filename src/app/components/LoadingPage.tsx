"use client";

import { Container, Row } from "react-bootstrap";

export default function NoUserPage() {
  return (
    <Container className="tabBody">
      <Row style={{ textAlign: "center" }}>
        <h2>Loading...</h2>
      </Row>
    </Container>
  );
}

"use client";

import { Container, Row } from "react-bootstrap";

export default function NoUserPage() {
  return (
    <Container className="tabBody">
      <Row style={{ textAlign: "center" }}>
        <h2>No Such User</h2>
      </Row>
    </Container>
  );
}

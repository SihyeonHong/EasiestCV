"use client";

import { Nav, Container, Row, Col } from "react-bootstrap";

export default function NonAdminHome({ tid }: { tid: number | string }) {
  return (
    <div>
      <Col>
        <h1> {tid} </h1>
        <div> test </div>
      </Col>
    </div>
  );
}

"use client";

import { Nav, Button, Container, Row, Col } from "react-bootstrap";
import { useState } from "react";

export default function AdminHome({
  userid,
  intro,
}: {
  userid: string;
  intro: string;
}) {
  const [introduction, setIntroduction] = useState<string>(intro);

  return (
    <Container className="page-body">
      <Row>
        <Col style={{ textAlign: "center" }}>
          <h5>프로필 사진 첨부</h5>
          <input type="file" accept="image/*" />
        </Col>
        <Col>
          <textarea
            className="intro-textarea"
            value={introduction}
            onChange={(e) => setIntroduction(e.target.value)}
            placeholder="자기소개를 입력하세요. 오른쪽 아래 모서리를 당기면 입력 상자를 아래로 늘릴 수 있습니다. "
          />
        </Col>
      </Row>
    </Container>
  );
}

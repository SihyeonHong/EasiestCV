"use client";

import { Row, Col } from "react-bootstrap";

export default function NonAdminHome({
  img,
  intro,
}: {
  img: string;
  intro: string;
}) {
  return (
    <Row>
      <Col>
        {/* <img src={img} alt="profile" /> */}
        <img
          className="profile-img"
          src={"/blank-profile-picture-973460_1920.png"}
        />
      </Col>
      <Col>
        <p>{intro}</p>
      </Col>
    </Row>
  );
}

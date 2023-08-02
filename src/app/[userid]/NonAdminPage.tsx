"use client";

import { Nav, Container, Row, Col } from "react-bootstrap";
import axios from "axios";

export default function NonAdminPage({
  userinfo,
}: {
  userinfo: { userid: string; intro: string; img: string; pdf: string };
}) {
  const getTabs = async () => {
    const res = await axios.get(`/api/get/tabs?userid=${userinfo.userid}`);
    console.log(res.data); // [ {img: null,  intro: "Hello!", pdf: null, userid: "testid"} ] or []
  };

  return (
    <div>
      <h1>Non Admin Page : nav부터 시작</h1>
      <h2>{userinfo.userid}</h2>
      <h2>{userinfo.intro}</h2>
      <h2>{userinfo.img}</h2>
      <h2>{userinfo.pdf}</h2>
      <h1>여기 nav 들어가야 함</h1>
      <Container className="page-body">
        <Row>
          <Col style={{ textAlign: "center" }}>
            <img
              className="profileImage"
              src={"/blank-profile-picture-973460_1920.png"}
            />
          </Col>
          <Col>{userinfo.intro}</Col>
        </Row>
      </Container>
    </div>
  );
}

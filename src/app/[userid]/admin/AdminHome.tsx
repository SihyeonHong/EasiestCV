"use client";

import { Container, Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../redux/store";
import { setUserInfo } from "../../../redux/store";

export default function AdminHome() {
  const dispatch = useDispatch();
  const userinfo = useSelector((state: RootState) => state.userinfo); // {userid, username, intro, img, pdf}

  const handleIntro = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = e.target.value;
    // 여기서 inputValue를 사용하여 원하는 작업을 수행하면 됩니다.
    dispatch(setUserInfo({ ...userinfo, intro: inputValue }));
  };

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
            value={userinfo.intro}
            onChange={handleIntro}
            placeholder="자기소개를 입력하세요. 오른쪽 아래 모서리를 당기면 입력 상자를 아래로 늘릴 수 있습니다. "
          />
        </Col>
      </Row>
    </Container>
  );
}

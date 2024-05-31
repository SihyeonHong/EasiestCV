"use client";

import axios from "axios";
import styled from "styled-components";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../redux/store";
import { setUserInfo } from "../../../redux/store";
import AdminEditor from "./AdminEditor";

export default function AdminHome() {
  const dispatch = useDispatch<AppDispatch>();
  const userinfo = useSelector((state: RootState) => state.userinfo); // {userid, username, intro, img, pdf}

  const [selectedImg, setSelectedImg] = useState<File | null>(null);

  const handleImgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImg(e.target.files[0]);
      const formData = new FormData();
      formData.append("file", e.target.files[0]);
      formData.append("userid", userinfo.userid);
      const res = axios
        .post("/api/post/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          alert("이미지가 업로드되었습니다.");
          if (res.data.imageURL) {
            dispatch(setUserInfo({ ...userinfo, img: res.data.imageURL }));
          }
          window.location.reload();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <Container>
      <Row>
        <Col>
          <h5>프로필 사진 첨부</h5>
          <input type="file" accept="image/*" onChange={handleImgUpload} />
          <img className="profile-img" src={userinfo.img} />
        </Col>
        <Col>
          <AdminEditor tid={0} />
        </Col>
      </Row>
    </Container>
  );
}

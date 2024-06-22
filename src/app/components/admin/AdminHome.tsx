"use client";

import axios from "axios";
import styled from "styled-components";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useState } from "react";
import AdminEditor from "./AdminEditor";
import { useHome } from "../../../hooks/useHome";

interface Props {
  userid: string;
}
export default function AdminHome({ userid }: Props) {
  const { homeData, setHomeData } = useHome(userid);
  const [selectedImg, setSelectedImg] = useState<File | null>(null);

  const handleImgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImg(e.target.files[0]);
      const formData = new FormData();
      formData.append("file", e.target.files[0]);
      formData.append("userid", userid);
      const res = axios
        .post("/api/post/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          alert("이미지가 업로드되었습니다.");
          if (res.data.imageURL) {
            setHomeData({ ...homeData, img: res.data.imageURL });
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
          <img className="profile-img" src={homeData?.img} alt="profile-img" />
        </Col>
        <Col>
          <AdminEditor userid={userid} tid={0} />
        </Col>
      </Row>
    </Container>
  );
}

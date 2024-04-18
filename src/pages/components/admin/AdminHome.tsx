"use client";

import axios from "axios";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import { setUserInfo } from "../../redux/store";

export default function AdminHome() {
  const dispatch = useDispatch<AppDispatch>();
  const userinfo = useSelector((state: RootState) => state.userinfo); // {userid, username, intro, img, pdf}

  const [selectedImg, setSelectedImg] = useState<File | null>(null);
  const textarea = useRef<HTMLTextAreaElement>(null);

  const handleIntro = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (textarea.current) {
      textarea.current.style.height = "auto"; // height 초기화
      textarea.current.style.height = textarea.current.scrollHeight + "px";
    }

    const inputValue = e.target.value;
    dispatch(setUserInfo({ ...userinfo, intro: inputValue }));
  };

  const handleSaveBtn = async () => {
    // update redux into db
    const res = await axios
      .put("/api/put/home", userinfo)
      .then((res) => {
        alert("자기소개가 저장되었습니다.");
      })
      .catch((err) => {
        console.log(err);
      });
  };

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
          // console.log(res.data.imageURL);
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

  useEffect(() => {
    if (textarea.current) {
      textarea.current.style.height = "auto";
      textarea.current.style.height = `${textarea.current.scrollHeight}px`;
    }
  }, [userinfo]);

  return (
    <Container className="page-body">
      <Row>
        <Col style={{ textAlign: "right" }}>
          <h5>프로필 사진 첨부</h5>
          <input type="file" accept="image/*" onChange={handleImgUpload} />
        </Col>
        <Col style={{ textAlign: "right" }}>
          <Button variant="dark" onClick={handleSaveBtn}>
            SAVE INTRO
          </Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <img className="profile-img" src={userinfo.img} />
        </Col>
        <Col>
          <textarea
            className="textarea"
            ref={textarea}
            value={userinfo.intro}
            onChange={handleIntro}
            placeholder="자기소개를 입력하세요. 오른쪽 아래 모서리를 당기면 입력 상자를 아래로 늘릴 수 있습니다. "
          />
        </Col>
      </Row>
    </Container>
  );
}

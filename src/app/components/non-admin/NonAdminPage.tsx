"use client";

import { Nav, Container, Row } from "react-bootstrap";
import axios from "axios";
import { useState, useEffect } from "react";
import NonAdminHome from "./NonAdminHome";
import NonAdminTab from "./NonAdminTab";
import Footer from "../Footer";

export default function NonAdminPage({
  userinfo,
}: {
  userinfo: { userid: string; intro: string; img: string; pdf: string };
}) {
  const [tabs, setTabs] = useState<{ tid: number; tname: string }[]>([]);
  const [activeKey, setActiceKey] = useState<number>(0);

  const getTabs = async () => {
    const res = await axios.get(`/api/get/tabs?userid=${userinfo.userid}`);
    console.log(res.data); // [ {tid: 1,  tname: "Tab1", userid: "test2"} ] or []
    setTabs(res.data);
  };

  const handlePDF = async () => {
    if (userinfo.pdf) {
      window.open(userinfo.pdf, "_blank");
    } else {
      alert("PDF 파일이 없습니다.");
    }
  };

  useEffect(() => {
    getTabs();
  }, []);

  return (
    <div>
      <Container>
        <Row>
          <Nav
            variant="underline"
            className="nav justify-content-center"
            activeKey={activeKey}
          >
            <Nav.Item>
              <Nav.Link
                eventKey={0}
                onClick={() => {
                  //   navigate("/" + userid);
                  setActiceKey(0);
                }}
              >
                Home
              </Nav.Link>
            </Nav.Item>
            {tabs &&
              tabs.map((tab, idx) => (
                <Nav.Item key={tab.tid}>
                  <Nav.Link
                    eventKey={tab.tid}
                    onClick={() => {
                      setActiceKey(tab.tid);
                      //   navigate(currentPath + "/" + tab);
                    }}
                  >
                    {tab.tname}
                  </Nav.Link>
                </Nav.Item>
              ))}
            <Nav.Item>
              <Nav.Link onClick={handlePDF}>PDF</Nav.Link>
            </Nav.Item>
          </Nav>
        </Row>
        <Row>
          {activeKey === 0 ? (
            <NonAdminHome img={userinfo.img} intro={userinfo.intro} />
          ) : (
            <NonAdminTab userid={userinfo.userid} tid={activeKey} />
          )}
        </Row>
        <Row>
          <Footer />
        </Row>
      </Container>
    </div>
  );
}

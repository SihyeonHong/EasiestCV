"use client";

import { Nav, Container, Row } from "react-bootstrap";
import axios from "axios";
import { useState, useEffect } from "react";
import NonAdminHome from "./NonAdminHome";
import NonAdminTab from "./NonAdminTab";
import Footer from "../Footer";
import Body from "../Body";
import { useHome } from "../../../hooks/useHome";

interface Props {
  userid: string;
}

export default function NonAdminPage({ userid }: Props) {
  const { homeData } = useHome(userid);

  const [tabs, setTabs] = useState<{ tid: number; tname: string }[]>([]);
  const [activeKey, setActiceKey] = useState<number>(0);

  const getTabs = async () => {
    // const res = await axios.get(`/api/get/tabs?userid=${userid}`);
    const res = await axios.get(`/api/tabs?userid=${userid}`);
    setTabs(res.data);
  };

  const handlePDF = async () => {
    if (homeData.pdf) {
      window.open(homeData.pdf, "_blank");
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
        <Body>
          {activeKey === 0 ? (
            <NonAdminHome userid={userid} />
          ) : (
            <NonAdminTab userid={userid} tid={activeKey} />
          )}
        </Body>
        <Row>
          <Footer />
        </Row>
      </Container>
    </div>
  );
}

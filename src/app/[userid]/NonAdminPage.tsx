"use client";

import { Nav, Container, Row } from "react-bootstrap";
import axios from "axios";
import { useState, useEffect } from "react";
import NonAdminHome from "./NonAdminHome";
import NonAdminTab from "./NonAdminTab";

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
              <Nav.Link disabled>PDF</Nav.Link>
            </Nav.Item>
          </Nav>
        </Row>
        <Row className="page-body">
          {activeKey === 0 ? (
            <NonAdminHome img={userinfo.img} intro={userinfo.intro} />
          ) : (
            <NonAdminTab tid={activeKey} />
          )}
        </Row>
      </Container>
    </div>
  );
}

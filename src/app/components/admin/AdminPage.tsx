"use client";

import axios from "axios";
import { Nav, Container, Row } from "react-bootstrap";
import { useState } from "react";
import AdminHome from "@/app/components/admin/AdminHome";
import AdminEditor from "@/app/components/admin/AdminEditor";
import Footer from "@/app/components/common/Footer";
import Body from "../Body";
import { useHome } from "@/hooks/useHome";
import { useTabs } from "@/hooks/useTabs";
import TabModal from "@/app/components/admin/TabModal";

interface Props {
  userid: string;
}

export default function AdminPage({ userid }: Props) {
  const { tabs, setCurrentTab } = useTabs(userid);
  const { homeData, setHomeData } = useHome(userid);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeKey, setActiveKey] = useState<number>(0);
  const [selectedPDF, setSelectedPDF] = useState<File | null>(null);

  const handlePDFUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedPDF(e.target.files[0]);
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
          alert("PDF 파일이 업로드되었습니다.");
          if (res.data.pdfUrl) {
            setHomeData({ ...homeData, pdf: res.data.pdfUrl });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

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
                  setActiveKey(0);
                  setCurrentTab(null);
                }}
              >
                Home
              </Nav.Link>
            </Nav.Item>
            {tabs.map((tab, idx) => (
              <Nav.Item key={tab.tid}>
                <Nav.Link
                  eventKey={tab.tid}
                  onClick={() => {
                    setActiveKey(tab.tid);
                    setCurrentTab(tab);
                  }}
                >
                  {tab.tname}
                </Nav.Link>
              </Nav.Item>
            ))}
            <Nav.Item>
              <div className="nav-pdf">
                PDF{"  "}
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handlePDFUpload}
                />
              </div>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link onClick={() => setIsModalOpen(true)}>
                Tab Settings
              </Nav.Link>
              <TabModal
                userid={userid}
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
              />
            </Nav.Item>
          </Nav>
        </Row>
        <Body>
          {activeKey === 0 ? (
            <AdminHome userid={userid} />
          ) : (
            <AdminEditor userid={userid} tid={activeKey} />
          )}
        </Body>
        <Row>
          <Footer />
        </Row>
      </Container>
    </div>
  );
}

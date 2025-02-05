"use client";

import { Nav } from "react-bootstrap";
import { useState } from "react";
import NonAdminHome from "@/app/components/non-admin/NonAdminHome";
import NonAdminTab from "@/app/components/non-admin/NonAdminTab";
import Footer from "@/app/components/common/Footer";
import { useHome } from "@/hooks/useHome";
import { useTabs } from "@/hooks/useTabs";

interface Props {
  userid: string;
}

export default function NonAdminPage({ userid }: Props) {
  const { homeData } = useHome(userid);
  const { tabs } = useTabs(userid);
  const [activeKey, setActiceKey] = useState<number>(0);

  const handlePDF = async () => {
    if (homeData.pdf) {
      window.open(homeData.pdf, "_blank");
    } else {
      alert("PDF 파일이 없습니다.");
    }
  };

  return (
    <div className="mx-4 flex w-full max-w-full flex-col break-words sm:mx-6 md:mx-auto md:w-[85%] md:max-w-[850px] lg:w-[1024px] lg:max-w-[1024px]">
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
      <div className="p-8">
        {activeKey === 0 ? (
          <NonAdminHome userid={userid} />
        ) : (
          <NonAdminTab userid={userid} tid={activeKey} />
        )}
      </div>
      <Footer />
    </div>
  );
}

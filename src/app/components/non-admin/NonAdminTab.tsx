"use client";

import { useTabs } from "@/hooks/useTabs";
import styled from "styled-components";

interface Props {
  userid: string;
  tid: number;
}

export default function NonAdminTab({ userid, tid }: Props) {
  const { tabs } = useTabs(userid);

  return (
    <>
      {tabs.find((tab) => tab.tid === tid)?.contents && (
        <NonAdminPageStyle
          dangerouslySetInnerHTML={{
            __html: tabs.find((tab) => tab.tid === tid)?.contents!,
          }}
        ></NonAdminPageStyle>
      )}
    </>
  );
}

const NonAdminPageStyle = styled.div`
  color: #333;
  font-size: 16px;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

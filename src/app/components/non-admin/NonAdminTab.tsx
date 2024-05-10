"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import styled from "styled-components";

interface Props {
  userid: string;
  tid: number;
}

export default function NonAdminPage({ userid, tid }: Props) {
  const [contents, setContents] = useState();

  const getPages = async () => {
    const res = await axios.get(
      `/api/get/tabpages?userid=${userid}&tid=${tid}`
    );
    setContents(res.data);
  };

  useEffect(() => {
    getPages();
  }, [tid]);

  return (
    <>
      {contents && (
        <NonAdminPageStyle
          dangerouslySetInnerHTML={{ __html: contents }}
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

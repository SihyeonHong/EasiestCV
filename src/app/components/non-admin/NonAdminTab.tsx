"use client";

import axios from "axios";
import { useState, useEffect } from "react";

interface Props {
  userid: string;
  tid: number;
}

export default function NonAdminHome({ userid, tid }: Props) {
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
      {contents && <div dangerouslySetInnerHTML={{ __html: contents }}></div>}
    </>
  );
}

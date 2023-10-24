"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import { Col } from "react-bootstrap";
import { TabContent } from "@/redux/store";

export default function NonAdminHome({
  userid,
  tid,
}: {
  userid: string;
  tid: number | string;
}) {
  console.log(tid);
  const [contents, setContents] = useState<TabContent[]>([]);

  const getContents = async () => {
    const res = await axios.get(
      `/api/get/contents?userid=${userid}&tid=${tid}`
    );
    console.log(res.data); // [{userid: 'testid', tid: 1, cid: 1, type: 'title', ccontent: 'Title1'}, ] or []
    setContents(res.data);
  };

  useEffect(() => {
    getContents();
  }, [tid]);

  return (
    <div>
      <Col>
        {contents &&
          contents.map((content: TabContent) => {
            return content.type === "title" ? (
              <h1>{content.ccontent}</h1>
            ) : (
              <pre className="pre">{content.ccontent}</pre>
            );
          })}
      </Col>
    </div>
  );
}

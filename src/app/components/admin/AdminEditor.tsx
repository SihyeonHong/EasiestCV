import dynamic from "next/dynamic";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import axios from "axios";
import { useHome } from "../../../hooks/useHome";
import { useTabs } from "../../../hooks/useTabs";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

interface Props {
  userid: string;
  tid: number;
}

export default function AdminEditor({ userid, tid }: Props) {
  const { homeData } = useHome(userid);
  const [value, setValue] = useState("");
  const { tabs } = useTabs(userid);

  useEffect(() => {
    if (tid === 0) {
      setValue(homeData.intro || "");
    } else {
      const tab = tabs.find((t) => t.tid === tid);
      setValue(tab?.contents || "");
    }
  }, [tid, homeData.intro]);

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link"],
      [{ align: [] }, { color: [] }, { background: [] }],
      ["clean"],
    ],
  };
  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "indent",
    "link",
    "align",
    "color",
    "background",
    "clean",
  ];

  const updateContents = async () => {
    if (tid === 0) {
      const data = { ...homeData, intro: value };
      const res = await axios
        .put("/api/put/home", data)
        .then((res) => {
          alert("자기소개가 저장되었습니다.");
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      const data = {
        userid: homeData.userid,
        tid: tid,
        contents: value,
      };

      axios
        .put("/api/put/tabpages", data)
        .then((res) => {
          alert("저장되었습니다.");
        })
        .catch((err) => {
          alert(err);
          console.log(err);
        });
    }
  };

  return (
    <AdminTabEditorStyle>
      <Button variant="dark" onClick={updateContents}>
        저장
      </Button>
      <div>
        <ReactQuill
          style={{ height: "400px" }}
          theme="snow"
          modules={modules}
          formats={formats}
          value={value}
          onChange={setValue}
        />
      </div>
    </AdminTabEditorStyle>
  );
}

const AdminTabEditorStyle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  button {
    width: fit-content;
    align-self: flex-end;
  }

  div {
    background-color: white;
  }
`;

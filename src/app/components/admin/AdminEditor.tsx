import styled from "styled-components";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

interface Props {
  tid: number;
}

export default function AdminEditor({ tid }: Props) {
  const [value, setValue] = useState("value");
  const userinfo = useSelector((state: RootState) => state.userinfo);

  const getContents = async () => {
    if (tid === 0) {
      setValue(userinfo.intro ?? "");
    } else {
      const res = await axios.get(
        `/api/get/tabpages?userid=${userinfo.userid}&tid=${tid}`
      );
      setValue(res.data);
    }
  };

  useEffect(() => {
    getContents();
  }, [tid]);

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
      ["link", "image"],
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
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "align",
    "color",
    "background",
    "clean",
  ];

  const updateContents = async () => {
    if (tid === 0) {
      const data = { ...userinfo, intro: value };
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
        userid: userinfo.userid,
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
  justify-content: space-between;
  background-color: white;

  button {
    width: fit-content;
    align-self: flex-end;
  }
`;

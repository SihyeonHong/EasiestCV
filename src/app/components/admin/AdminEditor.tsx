import styled from "styled-components";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import axios from "axios";

interface Props {
  userid: string;
  tid: number;
}

export default function AdminEditor({ userid, tid }: Props) {
  const [value, setValue] = useState("value");

  const getPages = async () => {
    console.log(userid, tid);
    const res = await axios.get(
      `/api/get/tabpages?userid=${userid}&tid=${tid}`
    );
    setValue(res.data);
  };

  useEffect(() => {
    getPages();
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

  const addColumn = () => {
    const data = {
      userid: userid,
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
  };

  return (
    <AdminTabEditorStyle>
      <div>
        <ReactQuill
          style={{ height: "600px" }}
          theme="snow"
          modules={modules}
          formats={formats}
          value={value}
          onChange={setValue}
        />
      </div>
      <br />
      <Button variant="dark" onClick={addColumn} className="save-btn">
        SAVE
      </Button>
    </AdminTabEditorStyle>
  );
}

const AdminTabEditorStyle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  padding: 20px;

  .save-btn {
    margin-top: 20px;
  }
`;

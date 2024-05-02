import React, { createRef } from "react";
import { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Table, Button } from "react-bootstrap";
import axios from "axios";
import { TabContent } from "../../../redux/store";

export default function AdminTab({
  userid,
  tid,
}: {
  userid: string;
  tid: number;
}) {
  //   const userid = useSelector((state: RootState) => state.userinfo.userid);
  const [contents, setContents] = useState<TabContent[]>([]);
  const textareaRefs = useRef<React.RefObject<HTMLTextAreaElement>[]>([]);

  const adjustTextareaHeight = (textarea: HTMLTextAreaElement | null) => {
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };
  const getContents = async () => {
    const res = await axios.get(
      `/api/get/contents?userid=${userid}&tid=${tid}`
    );
    // console.log(res.data); // [{userid: 'testid', tid: 1, cid: 1, type: 'title', ccontent: 'Title1'}, ] or []
    setContents(res.data);
    textareaRefs.current = res.data.map(() =>
      React.createRef<HTMLTextAreaElement>()
    );
  };
  useEffect(() => {
    getContents();
  }, [tid]);
  useEffect(() => {
    if (
      contents.length > 0 &&
      textareaRefs.current.length === contents.length
    ) {
      textareaRefs.current.forEach((ref) => adjustTextareaHeight(ref.current));
    }
  }, [contents]);

  const handleSaveBtn = () => {
    let _contents = [...contents];
    // 모든 content에 대해 corder: index
    _contents = _contents.map((content, index) => ({
      ...content,
      corder: index,
    }));
    _contents.sort((a: TabContent, b: TabContent) => a.corder - b.corder); // corder 순으로 정렬
    setContents(_contents);

    // update into db
    axios
      .put("/api/put/contents", _contents)
      .then((res) => {
        alert("저장되었습니다.");
      })
      .catch((err) => {
        alert(err);
        console.log(err);
      });
  };

  const handleType = (e: any, cid: number) => {
    // console.log(e.target.value); // = title or description
    setContents(
      contents.map((content) =>
        content.cid === cid ? { ...content, type: e.target.value } : content
      )
    );
  };

  const handleContents = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    cid: number,
    index: number
  ) => {
    const currentTextarea = textareaRefs.current[index]?.current;
    if (currentTextarea) {
      currentTextarea.style.height = "auto"; // height 초기화
      currentTextarea.style.height = currentTextarea.scrollHeight + "px";
    }

    setContents(
      contents.map((content) =>
        content.cid === cid ? { ...content, ccontent: e.target.value } : content
      )
    );
  };

  const addColumn = () => {
    setContents([
      ...contents,
      {
        userid,
        tid,
        cid: Math.floor(Math.random() * 10000000),
        type: "title",
        ccontent: "",
        corder: contents.length,
      },
    ]);
  };

  const deleteColumn = (cid: number) => {
    const confirm = window.confirm("정말 삭제하시겠습니까?");
    if (!confirm) return;
    const newContents = contents.filter((content) => content.cid !== cid);
    const reindex = newContents.map((content, index) => ({
      ...content,
      corder: index,
    }));
    setContents(reindex);
  };

  //save reference for dragItem and dragOverItem
  const dragItem = useRef<any>(null); // 내가 드래그중인 아이템
  const dragOverItem = useRef<any>(null); // 내가 드래그하고 있는 아이템이 들어갈 위치

  //const handle drag sorting
  const handleSort = () => {
    //duplicate items
    let _contents = [...contents];

    //remove and save the dragged item content
    const draggedItemContent = _contents.splice(dragItem.current, 1)[0];

    //switch the position
    _contents.splice(dragOverItem.current, 0, draggedItemContent);

    //reset the position ref
    dragItem.current = null;
    dragOverItem.current = null;

    //update the actual array
    setContents(_contents);
  };

  return (
    <Container className="tabBody">
      <Row>
        <Col>위아래로 드래그하면 문단의 순서를 바꿀 수 있습니다.</Col>
        <Col style={{ textAlign: "right", marginBottom: "2vh" }}>
          <Button
            variant="dark"
            onClick={handleSaveBtn}
            style={{ marginLeft: "2vw" }}
          >
            SAVE
          </Button>
        </Col>
      </Row>
      <Row>
        <Table>
          <thead>
            <tr>
              <th className="options-column">Type</th>
              <th className="contents-column">Contents</th>
              <th className="options-column">Actions</th>
            </tr>
          </thead>
          <tbody>
            {contents.map((content, index) => (
              <tr
                key={content.cid}
                draggable
                onDragStart={(e) => (dragItem.current = index)}
                onDragOver={(e) => {
                  e.preventDefault();
                  dragOverItem.current = index;
                }}
                onDragEnd={handleSort}
              >
                <td className="options-column">
                  <select
                    value={content.type}
                    onChange={(e) => handleType(e, content.cid)}
                  >
                    <option value="title">title</option>
                    <option value="description">description</option>
                  </select>
                </td>
                <td className="contents-column">
                  <textarea
                    ref={textareaRefs.current[index]}
                    className="textarea"
                    placeholder="오른쪽 아래 모서리를 당기면 칸이 늘어납니다."
                    value={content.ccontent}
                    onChange={(e) => {
                      handleContents(e, content.cid, index);
                    }}
                  />
                </td>
                <td className="option-column">
                  <Button
                    variant="light"
                    onClick={() => deleteColumn(content.cid)}
                  >
                    DELETE
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Row>
      <Row>
        <Col style={{ textAlign: "right" }}>
          <Button variant="dark" onClick={addColumn}>
            New Column
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

import React, { useState } from "react";
import { Container, Table, Button } from "react-bootstrap";
// import { useSelector } from "react-redux";
// import { RootState } from "../../../redux/store";

export default function AdminTab({ tid }: { tid: number }) {
  //   const userid = useSelector((state: RootState) => state.userinfo.userid);
  const [tables, setTables] = useState<
    {
      key: number;
      index: number;
      options: string;
      contents: string;
    }[]
  >([
    {
      key: Math.random(),
      index: 1,
      options: "title",
      contents: "lorem ipsum dolor sit amet",
    },
  ]);

  const handleOptions = (e: any, key: number) => {
    // console.log(e.target.value); // = title or description
    setTables(
      tables.map((table) =>
        table.key === key ? { ...table, options: e.target.value } : table
      )
    );
  };

  const handleContents = (e: any, key: number) => {
    // console.log(e.target.value); // = contents
    setTables(
      tables.map((table) =>
        table.key === key ? { ...table, contents: e.target.value } : table
      )
    );
  };

  const addTable = (index: number) => {
    setTables([
      ...tables,
      {
        key: Math.random(),
        index: index + 1,
        options: "description",
        contents: "",
      },
    ]);
  };

  const deleteTable = (key: number) => {
    console.log(key);
    const newTable = tables.filter((table) => table.key !== key);
    const reindex = newTable.map((table, index) => ({
      ...table,
      index: index + 1,
    }));
    setTables(reindex);
  };

  return (
    <Container className="tabBody">
      <Table>
        <thead>
          <tr>
            <th className="options-column">Options</th>
            <th className="contents-column">Contents</th>
            <th className="actions-column">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tables.map((table) => (
            <tr key={table.key}>
              <td className="options-column">
                <select
                  value={table.options}
                  onChange={(e) => handleOptions(e, table.key)}
                >
                  <option value="title">title</option>
                  <option value="description">description</option>
                </select>
              </td>
              <td className="contents-column">
                <textarea
                  placeholder="오른쪽 아래 모서리를 당기면 칸이 늘어납니다."
                  value={table.contents}
                  onChange={(e) => {
                    handleContents(e, table.key);
                  }}
                />
              </td>
              <td className="actions-column">
                <Button variant="light" onClick={() => addTable(table.index)}>
                  +
                </Button>{" "}
                <Button variant="light" onClick={() => deleteTable(table.key)}>
                  -
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

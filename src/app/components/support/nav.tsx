import { Tabs, TabsList, TabsTrigger } from "../common/Tabs";

export default function Nav() {
  return (
    <div>
      <Tabs>
        <TabsList defaultValue="dashboard">
          <TabsTrigger value="dashboard">대시보드</TabsTrigger>
          <TabsTrigger value="notice">공지사항</TabsTrigger>
          <TabsTrigger value="qna">문의게시판</TabsTrigger>
          <TabsTrigger value="info">운영자 정보</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}

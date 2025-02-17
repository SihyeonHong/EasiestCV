import { useTabs } from "@/hooks/useTabs";
import Button from "@/app/components/common/Button";
import { useEffect, useState } from "react";
import AdminEditor from "./AdminEditor";

interface AdminTabProps {
  userid: string;
  tid: number;
}

export default function AdminTab({ userid, tid }: AdminTabProps) {
  const { updateContents, currentTab } = useTabs(userid);
  const [content, setContent] = useState("");

  useEffect(() => {
    if (currentTab?.contents) {
      setContent(currentTab.contents);
    } else {
      setContent("");
    }
  }, [currentTab]);

  const handleSave = () => {
    updateContents({ tid, newContent: content });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p>{currentTab ? currentTab.tname : tid}</p>
        <Button onClick={handleSave}>Save</Button>
      </div>
      <AdminEditor userid={userid} tid={tid} />
    </div>
  );
}

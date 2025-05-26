import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { Button } from "@/app/components/common/Button";
import { useHome } from "@/hooks/useHome";
import { useTabs } from "@/hooks/useTabs";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

interface Props {
  userid: string;
  tid: number;
}

export default function AdminEditor({ userid, tid }: Props) {
  const t = useTranslations("button");

  const { homeData, mutateUploadIntro } = useHome(userid);
  const { tabs, updateContents } = useTabs(userid);
  const [value, setValue] = useState("");

  useEffect(() => {
    if (tid === 0) {
      setValue(homeData?.intro || "");
    } else {
      const tab = tabs.find((t) => t.tid === tid);
      setValue(tab?.contents || "");
    }
  }, [tid, homeData, tabs]);

  const handleUpdate = () => {
    if (tid === 0) {
      mutateUploadIntro(value);
    } else {
      updateContents({
        tid: tid,
        newContent: value,
      });
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4">
      <Button size="sm" onClick={handleUpdate} className="self-end">
        {t("save")}
      </Button>
      <ReactQuill
        className="bg-white dark:bg-[hsl(var(--background))]"
        theme="snow"
        modules={modules}
        formats={formats}
        value={value}
        onChange={setValue}
      />
    </div>
  );
}

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, false] }],
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

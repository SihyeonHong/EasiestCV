import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";

import EditorToolbar from "@/app/components/admin/EditorToolbar";
import ImageUploader from "@/app/components/admin/ImageUploader";
import { useAutoSave } from "@/hooks/useAutoSave";
import { useEditor } from "@/hooks/useEditor";
import { useHome } from "@/hooks/useHome";
import { useTabs } from "@/hooks/useTabs";
import { Tab } from "@/models/tab.model";

const ReactQuillComponent = dynamic(() => import("react-quill"), {
  ssr: false,
});

interface Props {
  userid: string;
  tid: number;
}

export default function AdminEditor({ userid, tid }: Props) {
  const tError = useTranslations("error");
  const tQuillTooltips = useTranslations("quillTooltips");

  const { homeData, mutateUploadIntro, revertIntro } = useHome(userid);
  const { tabs, updateContents, revertContents } = useTabs(userid);

  const [value, setValue] = useState("");
  const [currentTab, setCurrentTab] = useState<Tab | null>(
    tabs.find((t) => t.tid === tid) || null,
  );
  const [isImageUploaderOpen, setIsImageUploaderOpen] = useState(false);

  const { saveStatus, setSaveStatus, handleRevert, handleContentChange } =
    useAutoSave({
      userid,
      tid,
      mutateUploadIntro,
      updateContents,
      revertIntro,
      revertContents,
    });

  const { wrapperRef, modules, formats, insertImage } = useEditor({
    onImageClick: () => setIsImageUploaderOpen(true),
    tQuillTooltips,
  });

  useEffect(() => {
    setCurrentTab(tabs.find((t) => t.tid === tid) || null);
  }, [tid, tabs]);

  useEffect(() => {
    if (tid === 0) {
      setValue(homeData?.intro || "");
    } else {
      setValue(currentTab?.contents || "");
    }
    setSaveStatus("saved");
  }, [tid, homeData, currentTab, setSaveStatus]);

  const handleValueChange = (newValue: string) => {
    setValue(newValue);
    handleContentChange(newValue);
  };

  const handleImageInsert = (imageUrl: string) => {
    insertImage(imageUrl, (errorKey: string) => {
      alert(tError(errorKey));
    });
  };

  return (
    <div className="flex flex-1 flex-col gap-4">
      <EditorToolbar saveStatus={saveStatus} onRevert={handleRevert} />

      <div ref={wrapperRef}>
        <ReactQuillComponent
          className="bg-white dark:bg-[hsl(var(--background))]"
          theme="snow"
          modules={modules}
          formats={formats}
          value={value}
          onChange={handleValueChange}
        />
      </div>

      <ImageUploader
        userid={userid}
        isOpen={isImageUploaderOpen}
        onClose={() => setIsImageUploaderOpen(false)}
        onImageInsert={handleImageInsert}
      />
    </div>
  );
}

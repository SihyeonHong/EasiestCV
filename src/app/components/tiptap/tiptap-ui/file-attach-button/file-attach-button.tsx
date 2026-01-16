"use client";

import type { Editor } from "@tiptap/react";
import { FileUp } from "lucide-react";
import * as React from "react";
import { useRef } from "react";

import type { ButtonProps } from "@/app/components/tiptap/tiptap-ui-primitive/button";
import { Button } from "@/app/components/tiptap/tiptap-ui-primitive/button";
import { useTiptapEditor } from "@/hooks/tiptap/use-tiptap-editor";
import { useTabContents } from "@/hooks/useTabContents";

export interface FileAttachButtonProps
  extends Omit<ButtonProps, "type" | "onClick"> {
  /**
   * The editor instance
   */
  editor?: Editor | null;
  /**
   * User ID for file upload
   */
  userid: string;
  /**
   * Callback when file is attached
   */
  onFileAttached?: () => void;
}

/**
 * File attach button component for Tiptap editors.
 * Allows users to attach PDF files which are uploaded to GCS and inserted as links.
 */
export const FileAttachButton = React.forwardRef<
  HTMLButtonElement,
  FileAttachButtonProps
>(
  (
    {
      editor: providedEditor,
      userid,
      onFileAttached,
      children,
      disabled,
      ...buttonProps
    },
    ref,
  ) => {
    const { editor } = useTiptapEditor(providedEditor);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { uploadPdfToGCS } = useTabContents(userid);
    const [isUploading, setIsUploading] = React.useState(false);

    const handleClick = React.useCallback(() => {
      fileInputRef.current?.click();
    }, []);

    const handleFileChange = React.useCallback(
      async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !editor) return;

        // PDF 파일인지 확인
        if (file.type !== "application/pdf") {
          alert("PDF 파일만 첨부할 수 있습니다.");
          // input 초기화
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
          return;
        }

        setIsUploading(true);

        try {
          // FormData 생성
          const formData = new FormData();
          formData.append("file", file);
          formData.append("userid", userid);

          // 파일 업로드
          const result = await uploadPdfToGCS(formData);
          const pdfUrl = result?.pdfUrl;

          if (!pdfUrl) {
            console.error("파일 업로드 응답에 pdfUrl이 없습니다:", result);
            return;
          }

          // 선택 상태 확인
          const { selection } = editor.state;
          const isEmpty = selection.empty;

          // 파일명 추출 (확장자 제외)
          const fileName = file.name.replace(/\.pdf$/i, "");

          // 링크 삽입 (LinkPopover와 동일한 로직)
          let chain = editor.chain().focus();

          // 먼저 링크 마크 범위를 확장하고 링크 설정
          chain = chain.extendMarkRange("link").setLink({ href: pdfUrl });

          // 선택이 비어있으면 파일명을 텍스트로 삽입
          if (isEmpty) {
            chain = chain.insertContent({ type: "text", text: fileName });
          }

          chain.run();

          onFileAttached?.();
        } catch (error) {
          console.error("파일 업로드 실패:", error);
          // useTabContents 훅에서 이미 alert를 표시하므로 여기서는 추가 알림 불필요
        } finally {
          setIsUploading(false);
          // input 초기화
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        }
      },
      [editor, uploadPdfToGCS, userid, onFileAttached],
    );

    // 에디터가 없거나 업로드 중이면 비활성화
    const isDisabled = disabled || !editor || isUploading;

    return (
      <>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
        <Button
          type="button"
          data-style="ghost"
          role="button"
          tabIndex={-1}
          aria-label="파일 첨부"
          tooltip="PDF 파일 첨부"
          disabled={isDisabled}
          onClick={handleClick}
          {...buttonProps}
          ref={ref}
        >
          {children ?? (
            <FileUp
              className="tiptap-button-icon"
              style={{
                opacity: isUploading ? 0.5 : 1,
              }}
            />
          )}
        </Button>
      </>
    );
  },
);

FileAttachButton.displayName = "FileAttachButton";

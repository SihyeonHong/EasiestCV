import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";

import { Button } from "@/app/components/common/Button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/common/Dialog";
import { Input } from "@/app/components/common/Input";
import { useTabContents } from "@/hooks/useTabContents";

interface ImageUploaderProps {
  userid: string;
  isOpen: boolean;
  onClose: () => void;
  onImageInsert: (imgTag: string) => void;
}

export default function ImageUploader({
  userid,
  isOpen,
  onClose,
  onImageInsert,
}: ImageUploaderProps) {
  const tButton = useTranslations("button");
  const tEditor = useTranslations("editor");
  const tError = useTranslations("error");

  const { uploadImgToGCS } = useTabContents(userid);

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    // cleanup function: previewImage가 변경되기 전 URL 정리
    return () => {
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  const handleImageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    const fileUrl = URL.createObjectURL(file);
    setPreviewImage(fileUrl);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!previewImage) {
      alert(tError("noImgToUpload"));
      return;
    }

    const formData = new FormData();
    const fileInput = document.getElementById(
      "imageUpload",
    ) as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      formData.append("file", fileInput.files[0]);
    }
    formData.append("userid", userid);

    try {
      const result = await uploadImgToGCS(formData);
      onImageInsert(result.imageUrl);
    } catch {
      // alert는 위 로직 안에 다 있음
    } finally {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="mx-auto max-w-[calc(100vw-2rem)] rounded-lg md:max-w-lg">
        <DialogHeader>
          <DialogTitle>{tEditor("imgUploader")}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-4">
          <Input
            id="imageUpload"
            type="file"
            accept="image/*"
            onChange={handleImageInput}
          />

          {previewImage && (
            <Image
              src={previewImage}
              alt="preview image"
              width={0}
              height={0}
              className="max-h-64 w-auto rounded-lg object-contain"
              unoptimized
            />
          )}
        </div>

        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>
            {tButton("cancel")}
          </Button>

          {/* {changePWStatus === "pending" ? (
                <Button disabled>
                  <Loader2Icon className="animate-spin" />
                  {tButton("pending")}
                </Button>
              ) : ( */}
          <Button onClick={handleSubmit}>{tButton("confirm")}</Button>
          {/* )} */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

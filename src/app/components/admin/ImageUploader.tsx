import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "@/app/components/common/Button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/common/Dialog";
import { Input } from "@/app/components/common/Input";

interface ImageUploaderProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ImageUploader({ isOpen, onClose }: ImageUploaderProps) {
  const tButton = useTranslations("button");

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleImageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    const fileUrl = URL.createObjectURL(file);
    setPreviewImage(fileUrl);

    // 메모리 누수 방지를 위해 기존 URL 해제 (옵션)
    return () => {
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
      }
    };
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="mx-auto max-w-[calc(100vw-2rem)] rounded-lg md:max-w-lg">
        <DialogHeader>
          <DialogTitle>Image Uploader</DialogTitle>
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
          <Button type="submit">{tButton("confirm")}</Button>
          {/* )} */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

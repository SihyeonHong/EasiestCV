import { useTranslations } from "next-intl";

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
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    alert(`Selected file: ${file.name}`);
    console.log("Selected file:", file);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Image Uploader</DialogTitle>
        </DialogHeader>

        <Input
          id="imageUpload"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
        />

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

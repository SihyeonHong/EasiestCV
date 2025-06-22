import { useTranslations } from "next-intl";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/app/components/common/AlertDialog";
import { Button } from "@/app/components/common/Button";
import { DialogClose } from "@/app/components/common/Dialog";

export default function TabCancel({ resetTabs }: { resetTabs: () => void }) {
  const tMessage = useTranslations("message");
  const tButton = useTranslations("button");

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button variant="secondary">{tButton("cancel")}</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>{tMessage("cancelConfirm")}</AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{tButton("cancel")}</AlertDialogCancel>
          <AlertDialogAction asChild onClick={() => resetTabs()}>
            <DialogClose>{tButton("confirm")}</DialogClose>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

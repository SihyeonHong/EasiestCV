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
  const tAdmin = useTranslations("admin");
  const tButton = useTranslations("button");

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button variant="secondary">{tAdmin("cancel")}</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>{tAdmin("cancelConfirm")}</AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{tButton("no")}</AlertDialogCancel>
          <AlertDialogAction asChild onClick={() => resetTabs()}>
            <DialogClose>{tButton("yes")}</DialogClose>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

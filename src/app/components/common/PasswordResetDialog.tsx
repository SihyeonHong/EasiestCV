import { Dialog, DialogContent, DialogTrigger } from "@radix-ui/react-dialog";
// import { useTranslations } from "next-intl";

export default function PasswordResetDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="ml-auto inline-block text-sm underline-offset-4 hover:underline">
          {/* {t("showResetForm")} */}
          wow
        </button>
      </DialogTrigger>
      <DialogContent></DialogContent>
    </Dialog>
  );
}

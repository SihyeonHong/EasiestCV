import { useTranslations } from "next-intl";

import SaveStatusIndicator from "@/app/components/admin/SaveStatusIndicator";
import { Button } from "@/app/components/common/Button";
import { SaveStatus } from "@/hooks/useAutoSave";

interface EditorPanelProps {
  saveStatus: SaveStatus;
  onRevert: () => void;
}

export default function EditorPanel({
  saveStatus,
  onRevert,
}: EditorPanelProps) {
  const tEditor = useTranslations("editor");

  return (
    <div className="flex items-end justify-between gap-1">
      <div className="flex items-end gap-2">
        <Button variant="destructive" size="sm" onClick={onRevert}>
          {tEditor("revert")}
        </Button>
        <p className="prose prose-slate text-sm">{tEditor("autoSaveInfo")}</p>
      </div>

      <SaveStatusIndicator status={saveStatus} />
    </div>
  );
}

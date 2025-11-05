import { X } from "lucide-react";
import { useState } from "react";

import { Card, CardContent, CardFooter } from "@/app/components/common/Card";
import { Checkbox } from "@/app/components/common/checkbox";

interface AlertBannerProps {
  message: string;
}

export default function AlertBanner({ message }: AlertBannerProps) {
  const [visible, setVisible] = useState(
    !localStorage.getItem("hideBannerToday"),
  );
  const [checked, setChecked] = useState(false);

  const handleClose = () => {
    const today = new Date().toDateString();
    if (checked) localStorage.setItem("hideBannerToday", today);
    setVisible(false);
  };

  // 다음날 다시 보이게 하려면 날짜 비교 로직 추가
  const hiddenForToday =
    localStorage.getItem("hideBannerToday") === new Date().toDateString();
  if (!visible || hiddenForToday) return null;

  return (
    <Card className="fixed bottom-4 right-4 z-50 w-auto max-w-sm space-y-2">
      <CardContent>
        <p className="text-sm">{message}</p>
      </CardContent>
      <CardFooter className="gap-2">
        <Checkbox
          id="hideBannerToday"
          checked={checked}
          onCheckedChange={(checked) => setChecked(checked === true)}
        />
        <label
          htmlFor="hideBannerToday"
          className="flex-1 cursor-pointer text-sm"
        >
          오늘 하루 보지 않기
        </label>
        <X
          className="size-5 cursor-pointer hover:opacity-70"
          onClick={handleClose}
        />
      </CardFooter>
    </Card>
  );
}

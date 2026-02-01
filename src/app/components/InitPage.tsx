"use client";

import { useTranslations } from "next-intl";

import { Card } from "@/app/components/common/Card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/common/Tabs";
import { CopyableCredential } from "@/app/components/CopyableCredential";
import LoginCard from "@/app/components/LoginCard";
import PWResetCard from "@/app/components/PWResetCard";
import SignUpCard from "@/app/components/SignUpCard";

export default function InitPage() {
  const t = useTranslations("initpage");

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-4 p-2 md:max-w-xl">
      <Tabs defaultValue="login" className="mx-0 w-full max-w-none md:mx-0">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="login">{t("login")}</TabsTrigger>
          <TabsTrigger value="signup">{t("signup")}</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Card>
            <LoginCard />
            <PWResetCard />
          </Card>
        </TabsContent>
        <TabsContent value="signup">
          <SignUpCard />
        </TabsContent>
      </Tabs>

      {/* 테스트 계정 안내 */}
      <div>
        <p className="mb-1 text-sm text-muted">{t("demoLoginDescription")}</p>
        <div className="flex gap-3">
          <CopyableCredential
            label={t("demoIdLabel")}
            value={t("demoIdValue")}
            copyText={t("copy")}
            copiedText={t("copied")}
          />
          <CopyableCredential
            label={t("demoPWLabel")}
            value={t("demoPWValue")}
            copyText={t("copy")}
            copiedText={t("copied")}
          />
        </div>
      </div>
    </div>
  );
}

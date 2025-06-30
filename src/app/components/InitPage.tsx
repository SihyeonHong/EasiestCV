"use client";

import { useTranslations } from "next-intl";

import { Card } from "@/app/components/common/Card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/common/Tabs";
import LoginCard from "@/app/components/LoginCard";
import PWResetCard from "@/app/components/PWResetCard";
import SignUpCard from "@/app/components/SignUpCard";
import UsageGuide from "@/app/components/UsageGuide";

export default function InitPage() {
  const tInitPage = useTranslations("initpage");

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-4 p-2 md:max-w-xl">
      <Tabs defaultValue="login" className="mx-0 w-full max-w-none md:mx-0">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="login">{tInitPage("login")}</TabsTrigger>
          <TabsTrigger value="signup">{tInitPage("signup")}</TabsTrigger>
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
      <UsageGuide />
    </div>
  );
}

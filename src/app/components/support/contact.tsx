"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "@/app/components/common/Button";
import { Input } from "@/app/components/common/Input";
import { Textarea } from "@/app/components/common/Textarea";
import useContact from "@/hooks/useContact";
import { ContactRequest } from "@/types/support";

export default function Contact() {
  const t = useTranslations("contact");
  const [form, setForm] = useState<ContactRequest>({
    name: "",
    email: "",
    subject: "",
    content: "",
  });
  const { sendContact } = useContact();

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    sendContact(form, {
      onSuccess: () => {
        setForm({
          name: "",
          email: "",
          subject: "",
          content: "",
        });
      },
    });
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          name="name"
          placeholder={t("name")}
          value={form.name}
          onChange={handleChange}
          required
        />
        <Input
          type="email"
          name="email"
          placeholder={t("email")}
          value={form.email}
          onChange={handleChange}
          required
        />
        <Input
          name="subject"
          placeholder={t("subject")}
          value={form.subject}
          onChange={handleChange}
          required
        />
        <Textarea
          name="content"
          placeholder={t("content")}
          value={form.content}
          onChange={handleChange}
          rows={4}
          required
          autoResize
        />
        <Button type="submit">{t("send")}</Button>
      </form>
    </div>
  );
}

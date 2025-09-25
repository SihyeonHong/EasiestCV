"use client";

import { useTheme } from "next-themes";
import { useEffect } from "react";

import "@/style/quill.css";
import "react-quill/dist/quill.snow.css";

export const useEditorStyles = () => {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    // 기존 highlight.js 스타일 제거
    const existingHighlightLink = document.querySelector(
      "link[data-highlight-theme]",
    );
    if (existingHighlightLink) {
      existingHighlightLink.remove();
    }

    // 테마에 맞는 highlight.js CSS CDN으로 동적 로드
    const highlightLink = document.createElement("link");
    highlightLink.rel = "stylesheet";
    highlightLink.setAttribute(
      "data-highlight-theme",
      resolvedTheme || "light",
    );

    if (resolvedTheme === "dark") {
      highlightLink.href =
        "https://unpkg.com/@highlightjs/cdn-assets@11.9.0/styles/github-dark.min.css";
    } else {
      highlightLink.href =
        "https://unpkg.com/@highlightjs/cdn-assets@11.9.0/styles/github.min.css";
    }

    document.head.appendChild(highlightLink);
  }, [resolvedTheme]);
};

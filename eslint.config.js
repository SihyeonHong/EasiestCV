import globals from "globals";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import prettier from "eslint-config-prettier";

/** @type {import("eslint").FlatConfig[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    ignores: [
      "node_modules/",
      "dist/",
      "build/",
      ".next/",
      "src/pages/",
      "public/",
    ],
    languageOptions: { globals: globals.browser },
  },

  // JavaScript 기본 규칙
  js.configs.recommended,

  // TypeScript 규칙 (전개 연산자 없이 객체로 추가)
  ...tseslint.configs.recommended,

  // React 관련 규칙 (Flat Config 형식으로 수정)
  //   ...react.configs.recommended,
  {
    plugins: { react }, // 플러그인 객체로 추가
    settings: {
      react: {
        version: "detect", // 자동으로 React 버전 감지
      },
    },
    rules: {
      "prefer-const": "warn",
      "no-unused-vars": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "react/react-in-jsx-scope": "off", // JSX 사용 시 React 임포트 강제하지 않음
      ...react.configs.recommended.rules, // rules 속성만 적용
    },
  },

  // Prettier + ESLint 충돌 방지 (Prettier가 코드 스타일을 담당하도록 설정)
  prettier,
];

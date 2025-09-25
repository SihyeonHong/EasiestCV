"use client";

import hljs from "highlight.js";
import React, { useEffect } from "react";

import { useEditorStyles } from "@/hooks/useEditorStyles";

export default function TestViewer() {
  useEditorStyles();

  useEffect(() => {
    // 아직 하이라이팅되지 않은 코드 블록만 처리
    const codeBlocks = document.querySelectorAll("pre code:not(.hljs)");
    codeBlocks.forEach((block) => {
      hljs.highlightElement(block as HTMLElement);
    });
  }, []);

  const codeExamples = {
    javascript: `function greeting(name) {
  console.log('Hello, ' + name + '!');
  return name.toUpperCase();
}

const user = 'World';
greeting(user);`,

    python: `def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# 피보나치 수열의 첫 10개 숫자
for i in range(10):
    print(f"F({i}) = {fibonacci(i)}")`,

    css: `.container {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  padding: 20px;
}`,
  };

  return (
    <div>
      <h1>Highlight.js 테스트</h1>

      <div>
        <div>
          <h2>JavaScript 코드</h2>
          <pre>
            <code className="language-javascript">
              {codeExamples.javascript}
            </code>
          </pre>
        </div>

        <div>
          <h2>Python 코드</h2>
          <pre>
            <code className="language-python">{codeExamples.python}</code>
          </pre>
        </div>

        <div>
          <h2>CSS 코드</h2>
          <pre>
            <code className="language-css">{codeExamples.css}</code>
          </pre>
        </div>

        <div>
          <h2>자동 언어 감지</h2>
          <pre>
            <code>
              {`const arr = [1, 2, 3, 4, 5];
const doubled = arr.map(x => x * 2);
console.log(doubled);`}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
}

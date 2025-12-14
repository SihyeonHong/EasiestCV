import DOMPurify from "isomorphic-dompurify";

/**
 * Tiptap 에디터에서 생성된 HTML을 public 페이지에서 안전하게 렌더링하기 위한 sanitize 함수
 *
 * 허용하는 태그와 속성은 Tiptap 에디터에서 사용하는 것과 일치시킵니다:
 * - 기본 텍스트 포맷팅: p, br, strong, em, u, s, code, pre, mark, sub, sup
 * - 헤딩: h1, h2, h3, h4, h5, h6
 * - 리스트: ul, ol, li (일반 리스트 및 TaskList 포함)
 * - TaskList: label, input (checkbox용)
 * - 기타: blockquote, hr, div, span
 * - 미디어: img (src, alt만 허용)
 * - 링크: a (href만 허용, javascript: 프로토콜 차단)
 */
export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      // 기본 텍스트 구조
      "p",
      "br",
      // 헤딩
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      // 텍스트 포맷팅
      "strong",
      "b",
      "em",
      "i",
      "u",
      "s",
      "strike",
      "code",
      "pre",
      "mark",
      "sub",
      "sup",
      // 리스트
      "ul",
      "ol",
      "li",
      // TaskList 관련
      "label",
      "input",
      "div",
      // 기타
      "blockquote",
      "hr",
      "a",
      "img",
      "span",
    ],
    ALLOWED_ATTR: [
      // 링크용
      "href",
      "target",
      "rel",
      // 이미지용
      "src",
      "alt",
      "width",
      "height",
      // TaskList용
      "data-type",
      "data-checked",
      "type",
      // 스타일링용
      "style",
      "class",
    ],
    // javascript: 프로토콜 차단, 허용된 프로토콜만 허용
    ALLOWED_URI_REGEXP:
      /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
    // 이벤트 핸들러 차단
    FORBID_ATTR: [
      "onerror",
      "onload",
      "onclick",
      "onmouseover",
      "onfocus",
      "onblur",
      "onchange",
      "onsubmit",
    ],
    // data-* 속성 차단 (보안상 위험할 수 있음)
    ALLOW_DATA_ATTR: false,
  });
}

/**
 * HTML 템플릿 파일의 불필요한 공백을 제거하여
 * tiptap 에디터에서 직접 작성한 것과 동일한 형식으로 정규화
 *
 * 템플릿 파일은 가독성을 위해 들여쓰기/줄바꿈이 포함되어 있지만,
 * 이를 DB에 저장할 때는 태그 사이의 공백을 제거하여
 * tiptap 에디터에서 복사/붙여넣기 시 발생하는 공백 문제를 방지합니다.
 *
 * - 블록 요소(li, ul, ol, p, h1-h6 등) 태그 사이의 공백/줄바꿈 제거
 * - 실제 텍스트 내용의 공백은 유지
 */
export function normalizeHtmlWhitespace(html: string): string {
  let normalized = html;

  // 1. 태그 사이의 모든 공백/줄바꿈 제거
  normalized = normalized.replace(/>\s+</g, "><");

  // 2. 블록 요소 태그 뒤의 공백/줄바꿈 제거 (태그와 텍스트 사이)
  // <p>, <h1-h6>, <li>, <ul>, <ol>, <div>, <blockquote> 등
  normalized = normalized.replace(
    /<(p|h[1-6]|li|ul|ol|div|blockquote)[^>]*>\s+/g,
    "<$1>",
  );

  // 3. 블록 요소 태그 앞의 공백/줄바꿈 제거 (텍스트와 태그 사이)
  normalized = normalized.replace(
    /\s+<\/(p|h[1-6]|li|ul|ol|div|blockquote)>/g,
    "</$1>",
  );

  // 4. 텍스트 내부의 줄바꿈을 공백으로 변환 (Prettier가 자동으로 넣은 줄바꿈 처리)
  // 태그 사이 공백을 이미 제거했으므로, 남은 줄바꿈은 텍스트 내부의 줄바꿈
  normalized = normalized.replace(/\n/g, " ");

  // 5. 연속된 공백을 하나로 정리 (줄바꿈을 공백으로 바꾼 후 생길 수 있는 연속 공백)
  normalized = normalized.replace(/\s+/g, " ");

  // 6. 앞뒤 공백 제거
  return normalized.trim();
}

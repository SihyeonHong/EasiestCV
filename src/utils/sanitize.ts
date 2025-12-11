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

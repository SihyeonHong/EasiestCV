import { RefObject } from "react";

// ReactQuill 툴바에 tooltip 추가하는 함수
export const addTooltips = (
  wrapperRef: RefObject<HTMLDivElement>,
  t: TQuillTooltipsFunction,
): void => {
  if (!wrapperRef.current) return;

  // div wrapper에서 ReactQuill 툴바 찾기
  const toolbar = wrapperRef.current.querySelector(
    ".ql-toolbar",
  ) as HTMLElement;
  if (!toolbar) return;

  // 툴바에 relative와 overflow-visible 클래스 추가
  toolbar.classList.add("relative", "overflow-visible");

  // 모든 툴바 버튼에 tooltip 추가
  Object.entries(tooltipSelectors).forEach(([key, selector]) => {
    const tooltipText = t(key as keyof typeof tooltipSelectors);
    const elements = toolbar.querySelectorAll(
      selector,
    ) as NodeListOf<HTMLElement>;
    elements.forEach((element: HTMLElement) => {
      // 이미 tooltip이 추가되어 있으면 스킵
      if (element.hasAttribute("data-tooltip-added")) return;

      // picker 요소인지 확인
      const isPicker =
        element.classList.contains("ql-picker") ||
        element.closest(".ql-picker");

      // tooltip 요소 생성
      const tooltip = document.createElement("div");
      tooltip.className =
        "quill-tooltip fixed px-2 py-1 text-xs text-white bg-gray-900 rounded whitespace-nowrap opacity-0 pointer-events-none transition-opacity duration-200 z-[9999] shadow-lg";
      tooltip.textContent = tooltipText;

      // 화살표 요소 생성
      const arrow = document.createElement("div");
      arrow.className =
        "absolute top-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900";
      tooltip.appendChild(arrow);

      // body에 tooltip 추가 (overflow 문제 해결)
      document.body.appendChild(tooltip);

      // hover 이벤트 추가
      const showTooltip = () => {
        // 다른 tooltip들 숨기기
        document.querySelectorAll(".quill-tooltip").forEach((tip) => {
          tip.classList.remove("opacity-100");
          tip.classList.add("opacity-0");
        });

        const rect = element.getBoundingClientRect();

        // picker-item인지 확인해서 위치 조정
        const isPickerItem = selector.includes(".ql-picker-item");

        if (isPickerItem) {
          // picker-item들은 오른쪽에 tooltip 표시
          tooltip.style.left = `${rect.right + 8}px`;
          tooltip.style.top = `${rect.top + rect.height / 2}px`;
          tooltip.style.transform = "translateY(-50%)";

          // 화살표 방향도 변경 (왼쪽 화살표)
          arrow.className =
            "absolute right-full top-1/2 transform -translate-y-1/2 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900";
        } else {
          tooltip.style.left = `${rect.left + rect.width / 2}px`;
          tooltip.style.top = `${rect.top - tooltip.offsetHeight - 8}px`;
          tooltip.style.transform = "translateX(-50%)";
        }

        tooltip.classList.remove("opacity-0");
        tooltip.classList.add("opacity-100");
      };

      const hideTooltip = () => {
        tooltip.classList.remove("opacity-100");
        tooltip.classList.add("opacity-0");
      };

      element.addEventListener("mouseenter", showTooltip);
      element.addEventListener("mouseleave", hideTooltip);

      // picker의 경우 부모 요소에도 이벤트 추가
      if (isPicker) {
        const pickerParent = element.closest(".ql-picker") as HTMLElement;
        if (pickerParent && pickerParent !== element) {
          pickerParent.addEventListener("mouseenter", showTooltip);
          pickerParent.addEventListener("mouseleave", hideTooltip);
        }
      }

      element.setAttribute("data-tooltip-added", "true");
    });
  });
};

// 툴바 버튼 셀렉터 키 정의
const tooltipSelectors = {
  header: ".ql-header .ql-picker-label",
  bold: ".ql-bold",
  italic: ".ql-italic",
  underline: ".ql-underline",
  strike: ".ql-strike",
  blockquote: ".ql-blockquote",
  listOrdered: '.ql-list[value="ordered"]',
  listBullet: '.ql-list[value="bullet"]',
  indentDecrease: '.ql-indent[value="-1"]',
  indentIncrease: '.ql-indent[value="+1"]',
  image: ".ql-image",
  align: ".ql-align .ql-picker-label",
  alignLeft: ".ql-align .ql-picker-item:not([data-value])",
  alignCenter: '.ql-align .ql-picker-item[data-value="center"]',
  alignRight: '.ql-align .ql-picker-item[data-value="right"]',
  alignJustify: '.ql-align .ql-picker-item[data-value="justify"]',
  color: ".ql-color .ql-picker-label",
  background: ".ql-background .ql-picker-label",
} as const;

// 번역 함수 타입 정의
export type TQuillTooltipsFunction = (
  key: keyof typeof tooltipSelectors,
) => string;

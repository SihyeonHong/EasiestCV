import { RefObject } from "react";

// 툴바 버튼별 tooltip 텍스트 정의
export const tooltipTexts = {
  ".ql-header .ql-picker-label": "제목 스타일",
  ".ql-bold": "굵게",
  ".ql-italic": "기울임",
  ".ql-underline": "밑줄",
  ".ql-strike": "취소선",
  ".ql-blockquote": "인용문",
  '.ql-list[value="ordered"]': "번호 목록",
  '.ql-list[value="bullet"]': "글머리 기호",
  '.ql-indent[value="-1"]': "들여쓰기 줄이기",
  '.ql-indent[value="+1"]': "들여쓰기 늘리기",
  ".ql-image": "이미지 삽입",
  ".ql-align .ql-picker-label": "텍스트 정렬",
  ".ql-align .ql-picker-item:not([data-value])": "왼쪽 정렬",
  '.ql-align .ql-picker-item[data-value="center"]': "가운데 정렬",
  '.ql-align .ql-picker-item[data-value="right"]': "오른쪽 정렬",
  '.ql-align .ql-picker-item[data-value="justify"]': "양쪽 정렬",
  ".ql-color .ql-picker-label": "글자 색상",
  ".ql-background .ql-picker-label": "배경 색상",
};

// ReactQuill 툴바에 tooltip 추가하는 함수
export const addTooltips = (wrapperRef: RefObject<HTMLDivElement>): void => {
  if (!wrapperRef.current) return;

  // div wrapper에서 ReactQuill 툴바 찾기
  const toolbar = wrapperRef.current.querySelector(
    ".ql-toolbar",
  ) as HTMLElement;
  if (!toolbar) return;

  // 툴바에 relative와 overflow-visible 클래스 추가
  toolbar.classList.add("relative", "overflow-visible");

  // 모든 툴바 버튼에 tooltip 추가
  Object.entries(tooltipTexts).forEach(([selector, tooltipText]) => {
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
          const rect = element.getBoundingClientRect();
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

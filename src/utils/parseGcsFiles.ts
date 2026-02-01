/**
 * HTML에서 GCS 파일 URL을 모두 추출합니다.
 * 이미지 src, 링크 href 등 모든 속성에서 GCS URL을 찾아 파일명을 반환합니다.
 */
export const parseGcsFiles = (htmlString: string): string[] => {
  // GCS URL 패턴: https://storage.googleapis.com/easiest-cv/파일명
  const gcsUrlRegex =
    /https:\/\/storage\.googleapis\.com\/easiest-cv\/([^"'\s>]+)/g;

  const fileList: string[] = [];
  let match;

  while ((match = gcsUrlRegex.exec(htmlString)) !== null) {
    const fileName = match[1];
    if (fileName) {
      fileList.push(fileName);
    }
  }

  // 중복 제거
  return Array.from(new Set(fileList));
};

export const parseImgSrc = (htmlString: string): string[] => {
  const imgRegex = /<img[^>]+src="?([^">]+)"?/g;

  const srcList: string[] = [];
  let match;
  while ((match = imgRegex.exec(htmlString)) !== null) {
    const fileName = match[1].split("/").pop() as string; // Date까지 포함한 유니크파일네임
    srcList.push(fileName);
  }

  return srcList;
};

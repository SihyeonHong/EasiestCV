// const uniqueFilename = `${file.name}-${Date.now()}`;
// const imageUrl = `https://storage.googleapis.com/easiest-cv/${uniqueFilename}`;
// 이렇게 만들어진 문자열에서 역으로 파일명 추출하는 함수

export default function extractFileName(url: string): string {
  try {
    const decodedUrl = decodeURIComponent(url);
    const lastSlashIndex = decodedUrl.lastIndexOf("/");
    const fullName = decodedUrl.substring(lastSlashIndex + 1); // file.name-Date.now()
    const lastDashIndex = fullName.lastIndexOf("-");
    const filename = fullName.substring(0, lastDashIndex);
    return filename;
  } catch {
    // If decoding fails, fallback to standard extraction
    const lastSlashIndex = url.lastIndexOf("/");
    const fullName = url.substring(lastSlashIndex + 1);
    const lastDashIndex = fullName.lastIndexOf("-");
    return fullName.substring(0, lastDashIndex);
  }
}

import { Storage } from "@google-cloud/storage";

const storage = new Storage({
  credentials: JSON.parse(process.env.GCS_CREDENTIALS ?? ""),
  projectId: "easiest-cv",
});

const bucket = storage.bucket("easiest-cv");

// 이하 함수들에서 parameter로 받는 filename은 모두
// `${file.name}-${Date.now()}` 형식

export const uploadFile = async (
  filename: string,
  buffer: Buffer,
  type: "image" | "pdf",
) => {
  const file = bucket.file(filename);
  const stream = file.createWriteStream({
    metadata: {
      contentType: type === "image" ? "image/*" : "application/pdf",
    },
  });

  stream.on("error", (err) => {
    console.error("File upload error:", err);
  });

  stream.on("finish", () => {
    console.log(`File ${filename} uploaded successfully.`);
  });

  stream.end(buffer);
};

export const downloadFile = async (filename: string): Promise<Buffer> => {
  const file = bucket.file(filename);

  return new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = [];

    file
      .createReadStream()
      .on("data", (chunk: Uint8Array) => chunks.push(chunk))
      .on("error", (err) => reject(err))
      .on("end", () => {
        // Uint8Array를 Buffer로 변환
        const totalLength = chunks.reduce(
          (sum, chunk) => sum + chunk.length,
          0,
        );
        const result = new Uint8Array(totalLength);
        let offset = 0;

        for (const chunk of chunks) {
          result.set(chunk, offset);
          offset += chunk.length;
        }

        resolve(Buffer.from(result));
      });
  });
};

export const deleteFile = async (filename: string) => {
  try {
    const file = bucket.file(filename);
    await file.delete();
    console.log(`File ${filename} deleted successfully.`);
  } catch (error) {
    console.error(`Failed to delete file ${filename}.`, error);
    throw error;
  }
};

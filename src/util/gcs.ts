import { Storage } from "@google-cloud/storage";

const storage = new Storage({
  keyFilename: "easiest-cv-5889be812d3a.json",
  projectId: "easiest-cv",
});

const bucket = storage.bucket("easiest-cv");

export const uploadFile = async (
  filename: string,
  buffer: Buffer,
  type: "image" | "pdf"
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

export const downloadFile = async (filename: string) => {
  const file = bucket.file(filename);

  return new Promise((resolve, reject) => {
    let chunks: Buffer[] = [];
    file
      .createReadStream()
      .on("data", (chunk) => chunks.push(chunk))
      .on("error", (err) => reject(err))
      .on("end", () => resolve(Buffer.concat(chunks)));
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

// import { NextApiRequest, NextApiResponse } from "next";
import { query } from "@/pages/util/database";
import multer from "multer";
import { deleteFile, uploadFile } from "@/pages/util/gcs";

// Disable Next.js's built-in body parser to allow multer to handle the form data
export const config = {
  api: {
    bodyParser: false,
  },
};
const fileFilter = (req: any, file: any, cb: any) => {
  // 허용되는 mime types
  const allowedTypes = [
    "image/jpg",
    "image/jpeg",
    "image/png",
    "image/gif",
    "application/pdf",
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // 파일을 허용
  } else {
    cb(null, false); // 파일을 거부
    cb(
      new Error(
        "Invalid file type. Only JPG, JPEG, PNG, GIF and PDF are allowed."
      )
    );
  }
};
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: fileFilter,
}).single("file");

export default function handler(req: any, res: any) {
  if (req.method === "POST") {
    upload(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        console.error("Multer error:", err);
        return res.status(500).json({ error: "Multer error." });
      } else if (err) {
        console.error("Unknown error:", err);
        return res.status(500).json({ error: "Unknown error during upload." });
      }
      let url = "https://storage.googleapis.com/easiest-cv/";

      console.log(req.file);

      // Upload the file to GCS
      try {
        let uniqueFilename = `${Date.now()}-${req.file.originalname}`;
        url = url + uniqueFilename;

        if (req.file.mimetype === "application/pdf") {
          // delete old file
          const result = await query(
            "SELECT pdf FROM userinfo WHERE userid = $1",
            [req.body.userid]
          );
          console.log("result", result);
          if (result[0] && result[0].pdf) {
            await deleteFile(result[0].pdf);
          }

          // upload new file
          await uploadFile(uniqueFilename, req.file.buffer, "pdf");
          const result2 = await query(
            "UPDATE userinfo SET pdf = $1 WHERE userid = $2",
            [url, req.body.userid]
          );
          console.log("result2", result2);
          res.status(200).json({ pdfUrl: url });
          return;
        } else {
          // image

          try {
            await uploadFile(uniqueFilename, req.file.buffer, "image");
          } catch (error) {
            console.error("Failed to upload image to GCS:", error);
            return res
              .status(500)
              .json({ error: "Failed to upload image to GCS." });
          }

          let prevImageUrl;
          try {
            const result = await query(
              "SELECT img FROM userinfo WHERE userid = $1",
              [req.body.userid]
            );
            prevImageUrl = result[0]?.img;
          } catch (error) {
            console.error("Failed to fetch previous image URL:", error);
            return res
              .status(500)
              .json({ error: "Failed to fetch previous image URL." });
          }

          if (prevImageUrl) {
            try {
              await deleteFile(prevImageUrl);
            } catch (error) {
              console.error("Failed to delete previous image from GCS:", error);
            }
          }

          try {
            await query("UPDATE userinfo SET img = $1 WHERE userid = $2", [
              url,
              req.body.userid,
            ]);
          } catch (error) {
            console.error("Failed to update image URL in database:", error);
            return res
              .status(500)
              .json({ error: "Failed to update image URL in database." });
          }
          res.status(200).json({ imageUrl: url });
        }
      } catch (gcsError) {
        console.error("Failed to upload image to GCS:", gcsError);
        res.status(500).json({ error: "Failed to upload image to GCS." });
        return;
      }
    });
  } else {
    res.status(405).json({ error: "Method not allowed" }); // Only POST method is allowed
  }
}

/* 
console.log(imageFile);
{
  fieldname: 'image',
  originalname: 'MVC.png',
  encoding: '7bit',
  mimetype: 'image/png',
  buffer: <Buffer 89 50 4e 47 0d 0a 1a 0a 00 00 00 0d 49 48 44 52 00 00 03 02 00 00 02 3d 08 06 00 00 00 89 e7 cf 74 00 00 00 04 67 41 4d 41 00 00 b1 8f 0b fc 61 05 00 ... 25199 more bytes>,
  size: 25249
}
*/

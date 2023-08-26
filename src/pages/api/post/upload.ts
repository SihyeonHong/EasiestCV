import { NextApiRequest, NextApiResponse } from "next";
import { query } from "../../../util/database";
import multer from "multer";
import { uploadFile } from "@/util/gcs";
// import { useDispatch, useSelector } from "react-redux";
// import { RootState, AppDispatch } from "../../../redux/store";
// import { setUserInfo } from "../../../redux/store";

// Disable Next.js's built-in body parser to allow multer to handle the form data
export const config = {
  api: {
    bodyParser: false,
  },
};

const upload = multer({ storage: multer.memoryStorage() }).single("image");

export default function handler(req: any, res: any) {
  if (req.method === "POST") {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(500).json({ error: "Image upload failed." });
      }

      // Access the image file here
      const imageFile = req.file;

      //   console.log(imageFile);
      // Upload the image to GCS
      try {
        const uniqueFilename = `${Date.now()}-${imageFile.originalname}`; // To ensure filename is unique
        await uploadFile(uniqueFilename, imageFile.buffer, "image");

        // Construct the public URL for the uploaded image
        const imageUrl = `https://storage.googleapis.com/easiest-cv/${uniqueFilename}`;

        // save this url to DB
        // const dispatch = useDispatch();
        // const userinfo = useSelector((state: RootState) => state.userinfo);
        // dispatch(setUserInfo({ ...userinfo, img: imageUrl }));
        const result = await query(
          "UPDATE `easiest-cv`.userinfo SET img = ? WHERE userid = ?",
          [imageUrl, "testid"]
        );
        console.log("upload img: ", result);
        res.status(200).json({ imageUrl: imageUrl });
        return;
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

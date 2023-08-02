import { NextApiRequest, NextApiResponse } from "next";
import { query } from "./../../util/database";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const result = await query("SELECT * FROM `easiest-cv`.users");

  res.json(result);
}

import { handleApiError } from "@/utils/api-error";
import { ApiSuccess } from "@/utils/api-success";
import { query } from "@/utils/database";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userid");
    const tid = searchParams.get("tid");

    const result = await query<{ contents: string }>(
      "SELECT contents FROM tabs WHERE userid = $1 AND tid = $2",
      [userId, tid],
    );

    return ApiSuccess.data(result.length > 0 ? result[0].contents : "");
  } catch (error: unknown) {
    return handleApiError(error, "콘텐츠 조회 실패");
  }
}

export interface UpdateContentsRequest {
  userid: string;
  tid: number;
  contents: string;
}

export async function PUT(request: Request) {
  try {
    const body: UpdateContentsRequest = await request.json();
    const { userid, tid, contents } = body;

    await query(
      "UPDATE tabs SET contents = $1 WHERE userid = $2 and tid = $3",
      [contents, userid, tid],
    );

    return ApiSuccess.updated();
  } catch (error: unknown) {
    return handleApiError(error, "콘텐츠 업데이트 실패");
  }
}

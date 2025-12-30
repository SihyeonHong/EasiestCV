import { handleApiError } from "@/utils/api-error";
import { ApiSuccess } from "@/utils/api-success";
import { query } from "@/utils/database";
import { deleteFile } from "@/utils/gcs";
import { validateMissingFields } from "@/utils/validateMissingFields";

export async function DELETE(request: Request) {
  try {
    const { userid, tid, newList } = await request.json();

    // 검증
    const errorResponse = validateMissingFields({
      userid,
      tid,
      newList,
    });
    if (errorResponse) {
      return errorResponse;
    }

    // old list 지우기
    const oldListResult = await query<{ files: string[] }>(
      "SELECT files FROM attachments WHERE userid = $1 and tid = $2",
      [userid, tid],
    );

    if (!oldListResult || oldListResult.length === 0) {
      // 파일 리스트가 없음
      await query(
        "INSERT INTO attachments (userid, tid, files) VALUES ($1, $2, $3)",
        [userid, tid, newList],
      );

      return ApiSuccess.created({
        message: "Success to Insert New File List.",
      });
    } else {
      // 기존 파일 리스트 존재
      const oldList = oldListResult[0].files;

      const filesToDelete = oldList.filter((file) => !newList.includes(file));

      if (filesToDelete.length === 0) {
        // 삭제할 파일이 없는 경우
        await query(
          "UPDATE attachments SET files = $1 WHERE userid = $2 and tid = $3",
          [newList, userid, tid],
        );

        return ApiSuccess.updated(
          undefined,
          "No files to delete. List updated.",
        );
      }

      const failedList: string[] = [];

      // 파일 삭제를 병렬로 처리하되 결과를 기다림
      const deletePromises = filesToDelete.map(async (file) => {
        try {
          await deleteFile(file);
          return { file, success: true };
        } catch {
          console.error(`파일 삭제 실패: ${file}`);
          return { file, success: false };
        }
      });

      const results = await Promise.all(deletePromises);

      // 실패한 파일들을 failedList에 추가
      results.forEach(({ file, success }) => {
        if (!success) {
          failedList.push(file);
        }
      });

      // 실패한 파일들은 다시 추가하여 DB에 유지
      const finalList =
        failedList.length > 0 ? [...newList, ...failedList] : newList;

      await query(
        "UPDATE attachments SET files = $1 WHERE userid = $2 and tid = $3",
        [finalList, userid, tid],
      );

      const message =
        failedList.length > 0
          ? `Failed to delete ${failedList.length} files.`
          : "Success to delete all orphan files.";

      return ApiSuccess.updated({
        message,
        deletedCount: filesToDelete.length - failedList.length,
        failedCount: failedList.length,
        failedFiles: failedList.length > 0 ? failedList : undefined,
      });
    }
  } catch (error: unknown) {
    return handleApiError(error, "파일 삭제 API 실패");
  }
}

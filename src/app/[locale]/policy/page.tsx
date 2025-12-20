import Title from "@/app/components/common/Title";

export default function PolicyPage() {
  return (
    <div className="flex flex-col items-center">
      <Title title="서비스 이용약관 및 개인정보 처리방침" />

      <div className="w-full max-w-body px-4 pb-8">
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
            본 문서는 사용자가 <strong>Easiest CV</strong>을 이용함에 있어
            알아두어야 할 규칙과, 소중한 개인정보를 어떻게 관리하는지
            설명합니다.
          </p>

          <hr className="my-8 border-gray-300 dark:border-gray-700" />

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
              1. 서비스 이용약관
            </h2>

            <div className="mb-6">
              <h3 className="mb-3 text-xl font-semibold text-gray-800 dark:text-gray-200">
                제1조 (콘텐츠의 저작권과 책임)
              </h3>
              <ol className="ml-6 list-decimal space-y-2 text-gray-700 dark:text-gray-300">
                <li>
                  사용자가 서비스 내에 게시한 글, 이미지, 링크 등 모든 콘텐츠의
                  저작권은 <strong>작성자 본인</strong>에게 있습니다.
                </li>
                <li>
                  사용자가 게시한 내용으로 인해 발생하는 명예훼손, 저작권 침해
                  등 모든 법적 책임은 <strong>게시자 본인</strong>에게 있으며,
                  플랫폼은 이에 대한 책임을 지지 않습니다.
                </li>
                <li>
                  타인의 권리를 침해하거나 부적절한 게시물은 운영자의 판단에
                  따라 예고 없이 삭제되거나 노출이 제한될 수 있습니다.
                </li>
              </ol>
            </div>

            <div className="mb-6">
              <h3 className="mb-3 text-xl font-semibold text-gray-800 dark:text-gray-200">
                제2조 (계정 관리)
              </h3>
              <ol className="ml-6 list-decimal space-y-2 text-gray-700 dark:text-gray-300">
                <li>
                  본 서비스는 비밀번호 재설정을 위해 이메일 정보를 수집합니다.
                  이메일 오기입으로 인한 계정 분실의 책임은 사용자에게 있습니다.
                </li>
                <li>
                  타인의 정보를 도용하여 가입하는 경우 서비스 이용이 중단될 수
                  있습니다.
                </li>
              </ol>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
              2. 개인정보 처리방침
            </h2>

            <p className="mb-6 text-base leading-relaxed text-gray-700 dark:text-gray-300">
              <strong>Easiest CV</strong>는 사이트 운영에 필요한 최소한의
              정보만을 수집하며, 사용자의 동의 없이 정보를 제3자에게 제공하지
              않습니다.
            </p>

            <div className="mb-6">
              <h3 className="mb-3 text-lg font-semibold text-gray-800 dark:text-gray-200">
                ① 수집하는 개인정보 항목
              </h3>
              <ul className="ml-6 list-disc space-y-2 text-gray-700 dark:text-gray-300">
                <li>
                  <strong>필수 항목</strong>: 아이디(userid), 비밀번호, 닉네임,
                  이메일 주소
                </li>
                <li>
                  <strong>선택 항목</strong>: 텍스트, 이미지, 파일 등 사용자가
                  직접 입력한 정보
                </li>
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="mb-3 text-lg font-semibold text-gray-800 dark:text-gray-200">
                ② 개인정보의 이용 목적
              </h3>
              <ul className="ml-6 list-disc space-y-2 text-gray-700 dark:text-gray-300">
                <li>회원 가입 확인 및 본인 식별</li>
                <li>비밀번호 분실 시 임시 비밀번호 발송</li>
                <li>해당 사용자의 계정 내 공개 콘텐츠 구성</li>
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="mb-3 text-lg font-semibold text-gray-800 dark:text-gray-200">
                ③ 개인정보의 보유 및 파기
              </h3>
              <ul className="ml-6 list-disc space-y-2 text-gray-700 dark:text-gray-300">
                <li>
                  사용자가 회원 탈퇴를 요청할 경우, 수집된 개인정보는 지체 없이
                  파기됩니다.
                </li>
                <li>
                  단, 서비스 부정이용 방지를 위해 일부 데이터는 일정 기간 보관될
                  수 있습니다.
                </li>
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="mb-3 text-lg font-semibold text-gray-800 dark:text-gray-200">
                ④ 개인정보 보호 책임자
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                문의:{" "}
                <a
                  href="mailto:admin@easiest-cv.com"
                  className="text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  admin@easiest-cv.com
                </a>
              </p>
            </div>
          </section>

          <hr className="my-8 border-gray-300 dark:border-gray-700" />

          <div className="mt-8 text-sm text-gray-600 dark:text-gray-400">
            <p>
              <strong>공고일자</strong>: 2025년 12월 20일
            </p>
            <p>
              <strong>시행일자</strong>: 2025년 12월 20일
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

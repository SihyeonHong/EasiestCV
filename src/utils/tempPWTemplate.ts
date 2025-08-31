import { Locale } from "@/i18n/routing";

interface TempPWTemplateProps {
  tempPassword: string;
  locale: Locale;
}

export const tempPWTemplate = ({
  tempPassword,
  locale,
}: TempPWTemplateProps): string => {
  const t = translations[locale];

  return `
<!DOCTYPE html>
<html lang="${locale}">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<link
			rel="preconnect"
			href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
		/>
		<style>
			@import url("https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css");

			body {
				margin: 0;
				padding: 0;
				font-family: "Pretendard", -apple-system, BlinkMacSystemFont, system-ui,
					Roboto, "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo",
					"Noto Sans KR", "Malgun Gothic", "Apple Color Emoji", "Segoe UI Emoji",
					"Segoe UI Symbol", sans-serif;
				background-color: #faf9f6;
			}
		</style>
	</head>
	<body>
		<div
			style="
				max-width: 600px;
				margin: 40px auto;
				background-color: #ffffff;
				border: 1px solid #e9ecef;
				border-radius: 8px;
				overflow: hidden;
			"
		>
			<!-- Header -->
			<div
				style="
					background-color: #090a0b;
					padding: 32px 40px;
					text-align: center;
				"
			>
				<h1
					style="
						margin: 0;
						color: #ffffff;
						font-size: 28px;
						font-weight: 600;
						letter-spacing: -0.02em;
					"
				>
					Easiest CV
				</h1>
			</div>

			<!-- Content -->
			<div style="padding: 40px">
				<p
					style="
						margin: 0 0 24px 0;
						font-size: 16px;
						color: #0b0a09;
						line-height: 1.6;
					"
				>
					${t.greeting},
				</p>

				<p
					style="
						margin: 0 0 32px 0;
						font-size: 16px;
						color: #0b0a09;
						line-height: 1.6;
					"
				>
					${t.description}
				</p>

				<!-- Temporary Password Box -->
				<div
					style="
						background-color: #f8f9fa;
						border: 2px solid #dee2e6;
						border-radius: 6px;
						padding: 24px;
						text-align: center;
						margin: 32px 0;
					"
				>
					<div
						style="
							font-size: 24px;
							font-weight: 600;
							color: #212529;
							letter-spacing: 2px;
							font-family: 'Courier New', monospace;
						"
					>
						${tempPassword}
					</div>
				</div>

				<p
					style="
						margin: 0 0 32px 0;
						font-size: 16px;
						color: #0b0a09;
						line-height: 1.6;
					"
				>
					${t.changePassword}
				</p>

				<!-- CTA Button -->
				<div style="text-align: center; margin: 40px 0">
					<a
						href="https://www.easiest-cv.com/"
						style="
							display: inline-block;
							background-color: #090a0b;
							color: #ffffff;
							text-decoration: none;
							padding: 16px 32px;
							border-radius: 6px;
							font-size: 16px;
							font-weight: 500;
							letter-spacing: -0.01em;
						"
						>${t.loginButton}</a
					>
				</div>

				<!-- Divider -->
				<div style="border-top: 1px solid #e9ecef; margin: 40px 0"></div>

				<!-- Footer Notice -->
				<div
					style="
						background-color: #f8f9fa;
						padding: 24px;
						border-radius: 6px;
						border-left: 4px solid #6c757d;
					"
				>
					<p
						style="
							margin: 0 0 12px 0;
							font-size: 14px;
							color: #0b0a09;
							line-height: 1.5;
						"
					>
						${t.noticeTitle}:
					</p>
					<ul
						style="
							margin: 0;
							padding-left: 20px;
							font-size: 14px;
							color: #0b0a09;
							line-height: 1.5;
						"
					>
						<li>${t.noticeReply}</li>
						<li>
							<a
								href="https://www.easiest-cv.com/"
								style="color: #0b0a09; text-decoration: underline"
								>${t.noticeVisit}</a
							>${t.noticeVisitAction}
						</li>
					</ul>
				</div>
			</div>

			<!-- Footer -->
			<div
				style="
					background-color: #f8f9fa;
					padding: 24px 40px;
					border-top: 1px solid #e9ecef;
					text-align: center;
				"
			>
				<p style="margin: 0; font-size: 12px; color: #6c757d; line-height: 1.4">
					© 2023 Easiest CV. All rights reserved.<br />
					${t.footerAuto}
				</p>
			</div>
		</div>
	</body>
</html>
`;
};

const translations = {
  ko: {
    greeting: "안녕하세요",
    description:
      "임시 비밀번호가 발급되었습니다. 아래 비밀번호를 사용하여 로그인해 주세요:",
    changePassword: "로그인 후 비밀번호를 변경하실 수 있습니다.",
    loginButton: "지금 로그인하기",
    noticeTitle: "본인이 요청하지 않은 경우이거나 문의사항이 있으시면",
    noticeReply: "이 이메일에 답장으로 문의해 주시거나",
    noticeVisit: "저희 사이트",
    noticeVisitAction: "를 방문하여 확인해 주세요",
    footerAuto: "이 이메일은 자동으로 발송되었습니다.",
  },
  en: {
    greeting: "Hello",
    description:
      "A temporary password has been issued. Please use the following password to log in:",
    changePassword: "You can change your password after logging in.",
    loginButton: "Log In Now",
    noticeTitle: "If you did not request this or have any questions",
    noticeReply: "Reply to this email to contact us, or",
    noticeVisit: "visit our site",
    noticeVisitAction: " to check",
    footerAuto: "This email was sent automatically.",
  },
};

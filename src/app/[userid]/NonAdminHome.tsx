import { Row, Col } from "react-bootstrap";

export default function NonAdminHome({
  img,
  intro,
}: {
  img: string;
  intro: string;
}) {
  const convertedIntro = convertTextToLinks(intro);
  return (
    <Row>
      <Col>
        <img className="profile-img" src={img} />
      </Col>
      <Col>
        <div
          className="pre"
          dangerouslySetInnerHTML={{ __html: convertedIntro }}
        ></div>
      </Col>
    </Row>
  );
}
function convertTextToLinks(text: string) {
  // URL 검출을 위한 정규 표현식
  const urlRegex = /https?:\/\/[^\s]+/g;

  return text.replace(urlRegex, function (url) {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
  });
}

import { Row, Col } from "react-bootstrap";

export default function NonAdminHome({
  img,
  intro,
}: {
  img: string;
  intro: string;
}) {
  return (
    <Row>
      <Col>
        <img className="profile-img" src={img} />
      </Col>
      <Col>
        <p>{intro}</p>
      </Col>
    </Row>
  );
}

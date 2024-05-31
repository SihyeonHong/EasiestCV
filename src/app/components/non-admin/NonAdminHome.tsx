import { Row, Col } from "react-bootstrap";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

export default function NonAdminHome() {
  const userinfo = useSelector((state: RootState) => state.userinfo);
  console.log(userinfo);

  return (
    <Row>
      <Col>
        <img className="profile-img" src={userinfo.img} />
      </Col>
      <Col>
        <div dangerouslySetInnerHTML={{ __html: userinfo.intro ?? "" }}></div>
      </Col>
    </Row>
  );
}

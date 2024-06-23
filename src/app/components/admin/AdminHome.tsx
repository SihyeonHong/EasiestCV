import { Container, Row, Col } from "react-bootstrap";
import AdminEditor from "./AdminEditor";
import { useHome } from "../../../hooks/useHome";

interface Props {
  userid: string;
}
export default function AdminHome({ userid }: Props) {
  const { homeData, uploadImg } = useHome(userid);

  return (
    <Container>
      <Row>
        <Col>
          <h5>프로필 사진 첨부</h5>
          <input type="file" accept="image/*" onChange={uploadImg} />
          <img className="profile-img" src={homeData?.img} alt="profile-img" />
        </Col>
        <Col>
          <AdminEditor userid={userid} tid={0} />
        </Col>
      </Row>
    </Container>
  );
}

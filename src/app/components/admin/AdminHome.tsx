import AdminEditor from "./AdminEditor";
import { useHome } from "../../../hooks/useHome";
import styled from "styled-components";

interface Props {
  userid: string;
}
export default function AdminHome({ userid }: Props) {
  const { homeData, uploadImg } = useHome(userid);

  return (
    <AdminHomeStyle>
      <ImgContainer>
        <h5>프로필 사진 첨부</h5>
        <input type="file" accept="image/*" onChange={uploadImg} />
        <img className="profile-img" src={homeData?.img} alt="profile-img" />
      </ImgContainer>
      <AdminEditor userid={userid} tid={0} />
    </AdminHomeStyle>
  );
}

const AdminHomeStyle = styled.div`
  display: flex;
  gap: 1rem;
`;

const ImgContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;

  img {
    object-fit: contain;
    width: 100%;
  }
`;

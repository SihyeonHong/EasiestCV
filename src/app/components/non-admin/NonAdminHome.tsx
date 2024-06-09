import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import styled from "styled-components";

export default function NonAdminHome() {
  const userinfo = useSelector((state: RootState) => state.userinfo);

  return (
    <NonAdminHomeStyle>
      <img className="profile-img" src={userinfo.img} />
      <IntroText dangerouslySetInnerHTML={{ __html: userinfo.intro ?? "" }} />
    </NonAdminHomeStyle>
  );
}

const NonAdminHomeStyle = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;

  img {
    flex: 1;
    max-width: 100%;
    height: auto;
    padding: 0 2rem;
  }

  @media (max-width: 768px) {
    flex-direction: column;

    img {
      width: 100%;
      margin-right: 0;
      margin-bottom: 2rem;
    }
  }
`;

const IntroText = styled.div`
  flex: 1;
`;

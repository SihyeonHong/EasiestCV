import { FaSpinner } from "react-icons/fa";
import styled from "styled-components";

export const LoadingIcon = () => {
  return (
    <LoadingStyle>
      <FaSpinner />
    </LoadingStyle>
  );
};

const LoadingStyle = styled.div`
  text-align: center;

  @keyframes rotate {
    100% {
      transform: rotate(360deg);
    }
  }
  svg {
    fill: #ccc;
    animation: rotate 1s linear infinite;
  }
`;

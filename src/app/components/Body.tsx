import { ReactNode } from "react";
import styled from "styled-components";

interface Props {
  children: ReactNode;
}

export default function Body({ children }: Props) {
  return <BodyStyle>{children}</BodyStyle>;
}

const BodyStyle = styled.div`
  /* background-color: white; */
  padding: 2rem;
`;

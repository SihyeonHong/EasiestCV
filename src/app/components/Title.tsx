"use client";

import Link from "next/link";
import styled from "styled-components";

interface Props {
  title: string;
}

export default function Title({ title = "" }: Props) {
  return (
    <TitleStyle>
      <Link href={`/${title}`}>{title.toUpperCase()}</Link>
    </TitleStyle>
  );
}

const TitleStyle = styled.h1`
  margin: 50px auto;
  text-align: center;

  a {
    color: black;
    text-decoration: none;
  }
`;

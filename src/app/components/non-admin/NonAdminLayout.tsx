"use client";

import { Button } from "react-bootstrap";
import Link from "next/link";
import NonAdminPage from "./NonAdminPage";
import NoUserPage from "../NoUserPage";
import LoadingPage from "../LoadingPage";
import styled from "styled-components";
import { useUser } from "../../../hooks/useUser";

export default function NonAdminLayout({ userid }: { userid: string }) {
  const { user, isUserExist, loading } = useUser(userid);

  return (
    <NonAdminLayoutStyle>
      <Header>
        <Link href="/">
          <Button variant="dark">Log In | Sign Up</Button>
        </Link>
      </Header>
      <h1 className="title">
        {user && user.username
          ? user.username.toUpperCase()
          : userid.toUpperCase()}
      </h1>
      <div>
        {loading ? (
          <LoadingPage />
        ) : isUserExist ? (
          <NonAdminPage userid={userid} />
        ) : (
          <NoUserPage />
        )}
      </div>
    </NonAdminLayoutStyle>
  );
}

const NonAdminLayoutStyle = styled.div`
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Header = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
`;

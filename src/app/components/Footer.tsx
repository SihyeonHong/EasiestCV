import styled from "styled-components";

export default function Footer() {
  return (
    <FooterStyle>
      <p>copyright(c), 2023, Easiest CV</p>
    </FooterStyle>
  );
}

const FooterStyle = styled.footer`
  margin: 30px 0;
  font-size: 0.8rem;
  text-align: right;
`;

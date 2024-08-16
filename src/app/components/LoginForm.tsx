import axios from "axios";
import { useState } from "react";
import { Button, Form, Container, Row } from "react-bootstrap";
import useAuth from "../../hooks/useAuth";
import { LoadingIcon } from "./LoadingIcon";

export default function LoginForm() {
  const [userid, setUserid] = useState("");
  const [password, setPassword] = useState("");

  const [showForgot, setShowForgot] = useState(false);
  const [userid2, setUserid2] = useState("");
  const [email, setEmail] = useState("");

  const { login, loading, setLoading } = useAuth();

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const data = {
      userid: userid,
      password: password,
    };
    login(data);
  };

  const handleReset = () => {
    const data = {
      userid: userid2,
      email: email,
    };
    axios
      .put("/api/put/resetPW", data)
      .then((res) => {
        if (res.status === 200) {
          alert("비밀번호 재설정 성공");
        } else {
          alert(res.data.message);
        }
      })
      .catch((err) => {
        alert(err.response.data.message);
        console.log(err);
      });
  };

  return (
    <Container>
      <Row>
        <Form className="body-init" onSubmit={handleLogin}>
          <Form.Group controlId="formID">
            <Form.Label>ID</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter ID"
              value={userid}
              onChange={(e) => setUserid(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <Button variant="dark" type="submit" style={{ marginRight: "1vw" }}>
            {loading ? <LoadingIcon /> : "Log In"}
          </Button>
          <Button variant="light" onClick={() => setShowForgot(!showForgot)}>
            I forgot my password:(
          </Button>
        </Form>
      </Row>
      <Row>
        <Form className={showForgot ? "body-init" : "change-pw-hidden"}>
          <Form.Group controlId="formID">
            <Form.Label>ID</Form.Label>
            <Form.Control
              type="text"
              placeholder="your id"
              value={userid2}
              onChange={(e) => setUserid2(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formPassword">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          <Form.Text>
            If you click this button below, your password will be reset and the
            temporary password will be sent to your email.
          </Form.Text>
          <br></br>
          <Button variant="dark" type="button" onClick={handleReset}>
            Reset Password
          </Button>
        </Form>
      </Row>
    </Container>
  );
}

import axios from "axios";
import { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";

export default function RegisterForm() {
  const [userid, setUserid] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPW] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const handleRegister = () => {
    const data = {
      userid: userid,
      username: username,
      email: email,
      password: password,
    };
    if (!confirmed) {
      alert("Password is not confirmed!");
    } else {
      //   console.log(data);
      axios
        .post("/api/post/register", data)
        .then((res) => {
          //   console.log(res); //{data: {…}, status: 200, statusText: 'OK', headers: AxiosHeaders, config: {…}, …}
          if (res.status === 200) {
            alert("Register Success! Please login.");
          }
        })
        .catch((err) => {
          alert("Register Failed!");
          console.log(err);
        });
    }
  };

  useEffect(() => {
    setConfirmed(password === confirmPassword);
  }, [password, confirmPassword]);

  return (
    <Form className="body-init">
      <Form.Group controlId="formID">
        <Form.Label>Your ID</Form.Label>
        <div className="form-id">
          <div className="form-id-child1">https://easiest-cv.com/</div>
          <div className="form-id-child2">
            <Form.Control
              type="text"
              placeholder="your_id"
              style={{ marginLeft: "10px" }}
              value={userid}
              onChange={(e) => setUserid(e.target.value)}
            />
          </div>
        </div>
        <Form.Text className="text-muted">
          This ID will be your domain. You CANNOT change it later.
        </Form.Text>
      </Form.Group>
      <Form.Group controlId="formName">
        <Form.Label>Your Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Your Name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </Form.Group>
      <Form.Group controlId="formEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control
          type="email"
          placeholder="if you forget your password, you will receive email here"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Form.Text className="text-muted">
          If you forget your password, you will receive email here.
        </Form.Text>
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

      <Form.Group controlId="formConfirmPassword">
        <Form.Label>Confirm Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPW(e.target.value)}
          className={confirmed ? "" : "unconfirmed"}
        />
      </Form.Group>

      <Button variant="dark" type="button" onClick={handleRegister}>
        Register
      </Button>
    </Form>
  );
}

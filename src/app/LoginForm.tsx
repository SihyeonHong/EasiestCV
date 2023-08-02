"use client";
import axios from "axios";
import { useState } from "react";
import { Button, Form } from "react-bootstrap";

export default function LoginForm() {
  const [userid, setUserid] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    const data = {
      userid: userid,
      password: password,
    };
    console.log(data);
  };
  return (
    <Form className="body-init">
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
      <Button variant="dark" type="button" onClick={handleLogin}>
        Log In
      </Button>
    </Form>
  );
}

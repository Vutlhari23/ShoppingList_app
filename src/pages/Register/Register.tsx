import React, { useState } from "react";
import { ContentContainer } from "../../components/ContentContainer/ContentContainer";
import styles from "../Register/Register.module.css";
import { Text } from "../../components/Text/Text";
import { TextInput } from "../../components/TextInput/TextInput";

import {Link} from "react-router-dom"
export const Register = () => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cellNo, setCellNo] = useState("");

  const handleRegisterSubmit = async () => {
    const data = await fetch(`http://localhost:3000/register`, {
      method: "POST",
      headers: { "Content-Type": "application/Json" },
      body: JSON.stringify({
        email: "vutlhari2m@gmail.com",
        password: "vutlhari@23D",
      }),
    });
    if (!data.ok) {
      throw new Error("Https Error");
    }
  };

  return (
    <ContentContainer className={styles["register-container"]}>
      <ContentContainer className={styles["register-content"]}>
        <h1  className={styles.heading}>Register</h1>
        <label>Name</label>
        <input
          className={styles.input}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        ></input>
        <br />
        <label>Surname</label>
        <input
        className={styles.input}
          type="text"
          value={surname}
          onChange={(e) => setSurname(e.target.value)}
        ></input>
        <br />
        <label>Email</label>
        <input
        className={styles.input}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        ></input>
        <br />
        <label> Password</label>
        <input
        className={styles.input}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        ></input>
        <br />
        <label>Cell Number</label>
        <input
        className={styles.input}
          type="cellno"
          value={cellNo}
          onChange={(e) => setCellNo(e.target.value)}
        ></input>
        <br />

        <button className={styles.btn} onClick={handleRegisterSubmit}>Submit</button>
             <Text 
             className={styles.text}
             variant='h5'>Already have an account?  <Link to="/login">Login</Link></Text>
      </ContentContainer>
    </ContentContainer>
  );
};

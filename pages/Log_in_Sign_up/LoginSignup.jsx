import React from "react";
import { useState } from "react";
import style from "./LoginSignup.module.css";
import axios from "axios";
import { useUser } from "../../components/UserContext";
import { useRouter } from "next/router";

const LoginSignup = () => {
  const [action, setAction] = useState("Login");

  const { loginUser } = useUser();

  const router = useRouter();

  const [_name, setname] = useState("");
  const [_email, setemail] = useState("");
  const [_pass, setpass] = useState("");

  const [wrong, setwrong] = useState("");

  async function handleLogin() {
    try {
      const response = await axios.get("http://localhost:3001/api/users", {
        params: {
          nameoremail: _email,
          pass: _pass,
        },
      });

      if (response.data) {
        loginUser(response.data);
        router.push("/");
      } else {
        setwrong("wronge email or password");
      }
    } catch (error) {
      console.error("Error log in", error);
      alert("Error log in");
    }
  }

  async function handleSignup() {
    try {
      const response = await axios.post("http://localhost:3001/api/users", {
        name: _name,
        email: _email,
        pass: _pass,
      });

      if (response.data) {
        loginUser(response.data);
        router.push("/");
      } else {
        setwrong("cant create user");
      }
    } catch (error) {
      console.error("Error creating user", error);
      alert("Error creating user server cant reach");
    }
  }

  return (
    <>
      <div className={style.body}>
        <div className={style.container}>
          <div className={style.header}>
            <div className={style.text}>{action}</div>
            <div className={style.underline}></div>
          </div>

          <div className={style.inputs}>
            {action == "Login" ? (
              <div></div>
            ) : (
              <div className={style.input}>
                <img src="/person.png" alt="user icon" />
                <input
                  type="text"
                  placeholder="Username"
                  onChange={(e) => setname(e.target.value)}
                />
              </div>
            )}

            <div className={style.input}>
              <img src="/email.png" alt="email icon" />
              <input
                type="email"
                placeholder={action == "Login" ? "Email/Username" : "Email"}
                onChange={(e) => setemail(e.target.value)}
              />
            </div>

            <div className={style.input}>
              <img src="/password.png" alt="password icon" />
              <input
                type="password"
                placeholder="Password"
                onChange={(e) => setpass(e.target.value)}
              />
            </div>
          </div>
          {action == "Sign Up" ? (
            <div></div>
          ) : (
            <div className={style.forgot_password}>
              Lost Password? <span>click here!</span>
            </div>
          )}
          {wrong == "" ? (
            <div></div>
          ) : (
            <div className={style.wrong}>{wrong}</div>
          )}

          <div className={style.submit_container}>
            <div
              className={action == "Login" ? style.gray : style.submit}
              onClick={() => {
                if (action == "Login") {
                  setAction("Sign Up");
                  setwrong("");
                } else {
                  handleSignup();
                }
              }}
            >
              Sign Up
            </div>
            <div
              className={action == "Sign Up" ? style.gray : style.submit}
              onClick={() => {
                if (action == "Sign Up") {
                  setAction("Login");
                  setwrong("");
                } else {
                  handleLogin();
                }
              }}
            >
              Log in
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginSignup;

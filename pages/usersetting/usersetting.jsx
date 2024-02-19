import React, { useEffect, useState } from "react";
import { useUser } from "../../components/UserContext";
import { useRouter } from "next/router";
import axios from "axios";
import style from "./usersetting.module.css";
import Navbar from "../../components/Navbar/navbar";

function UserSettings() {
  const { user, loginUser } = useUser();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [picture, setPicture] = useState("");

  const [changepicture, setChangePicture] = useState(false);
  const [gifs, setGifs] = useState(null);
  const [gifserach, setGifSearch] = useState("");

  async function handleSubmit() {
    try {
      const response = await axios.patch(
        `http://localhost:3001/api/users/update/${user._id}`,
        {
          name: name,
          email: email,
          pass: password,
          image: picture,
        }
      );

      if (response.data) {
        if (
          response.data == "There is already a user with this name or email."
        ) {
          alert(response.data);
        } else {
          loginUser({
            ...user,
            name: name,
            email: email,
            pass: password,
            image: picture,
          });
          router.push("/");
        }
      } else {
        alert("cant change bro");
      }
    } catch (error) {
      console.error("Error log in", error);
      alert("Error log in");
    }
  }

  useEffect(() => {
    let usea = null;
    try {
      const storedUser = sessionStorage.getItem("user");

      if (!(storedUser == "null" || storedUser == null)) {
        loginUser(JSON.parse(storedUser));
        usea = JSON.parse(storedUser);
      } else {
        router.push("/Log_in_Sign_up/LoginSignup");
      }
    } catch (error) {
      console.error("Error getting user", error);
    }

    if (usea) {
      setName(usea.name);
      setEmail(usea.email);
      setPassword(usea.pass);
      setPicture(usea.image);
    }
  }, []);

  async function getgifs(search) {
    let gifs = await axios.get(
      `http://localhost:3001/api/posts/getgifs/${search}`
    );
    setGifs(gifs.data);
  }

  function pickedgif(gif) {
    setPicture(gif);
    setChangePicture(false);
  }

  async function deleteacc() {
    if (window.confirm("are you sure you want to delete your account?")) {
      await axios.delete(`http://localhost:3001/api/users/delete/${user._id}`);
      sessionStorage.setItem("user", null);
      loginUser(null);
      router.push("/");
    }
  }

  return (
    <>
      {changepicture == true && (
        <>
          <div className={style.header}>
            <input type="text" onChange={(e) => setGifSearch(e.target.value)} />
            <button onClick={() => getgifs(gifserach)}>search</button>
          </div>
          <div className={style.allgifs}>
            {gifs != null && gifs.length == 0 && <h1>no gifs found</h1>}

            {gifs != null &&
              gifs.map((thegif) => {
                return (
                  <img
                    className={style.gifs}
                    src={thegif}
                    alt="gif"
                    onClick={() => pickedgif(thegif)}
                  />
                );
              })}
          </div>
        </>
      )}

      {changepicture == false && (
        <div>
          <Navbar />
          <h1>User Settings</h1>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div>
              <center>
                <div className={style.coolinput}>
                  <label for="input" className={style.text}>
                    Name:
                  </label>
                  <input
                    type="text"
                    placeholder="name"
                    name="input"
                    value={name}
                    className={style.input}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <br />

                <div className={style.coolinput}>
                  <label for="input" className={style.text}>
                    email:
                  </label>
                  <input
                    className={style.input}
                    type="email"
                    placeholder="name"
                    name="input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <br />

                <div className={style.coolinput}>
                  <label for="input" className={style.text}>
                    password:
                  </label>
                  <input
                    className={style.input}
                    type="text"
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </center>
            </div>

            <br />
            <br />

            <center>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  padding: "10px",
                }}
              >
                Profile Picture:
                <img src={picture} alt="profile picture" />
                <button
                  onClick={() => setChangePicture(true)}
                  className={style.changepic}
                >
                  change gif
                </button>
              </div>
            </center>
          </div>

          <br />
          <center>
            <button onClick={() => handleSubmit()} className={style.savebtn}>
              Save
            </button>

            <button onClick={() => deleteacc()} className={style.deletebtn}>
              delete account
            </button>
          </center>
        </div>
      )}
    </>
  );
}

export default UserSettings;

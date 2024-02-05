import React from "react";
import style from "./AddPost.module.css";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useUser } from "../../components/UserContext";

export default function AddPost() {
  const [selectgif, setselectgif] = useState(false);
  const [selectedpicture, setSelectedPicture] = useState(null);
  const [gifs, setGifs] = useState(null);
  const [gifserach, setGifSearch] = useState("");

  const [caption, setCaption] = useState("");

  const [user, setuser] = useState(null);

  const router = useRouter();
  const { loginUser } = useUser();

  const handlepost = async () => {
    if (selectedpicture == null) {
      alert("select a gif");
      return;
    } else if (caption == "") {
      alert("must write something");
      return;
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          console.log(latitude, longitude);

          try {
            //got the location
            const handlePost = async () => {
              const post = await axios.post(
                "http://localhost:3001/api/posts/addpost",
                {
                  caption: caption,
                  author: user._id,
                  gif: selectedpicture,
                  location: [latitude, longitude],
                }
              );
              if (post.data) {
                alert("post added");
                setSelectedPicture(null);
                setCaption("");
                router.push("/");
              } else {
                alert("error adding post");
              }
            };

            handlePost();
          } catch (error) {
            console.error("Error adding post", error);
          }
        },
        (error) => {
          console.error(error);
          alert("cant get your location");
        }
      );
    }
  };

  async function getgifs(search) {
    let gifs = await axios.get(
      `http://localhost:3001/api/posts/getgifs/${search}`
    );
    setGifs(gifs.data);
  }

  function pickedgif(gif) {
    setSelectedPicture(gif);
    setselectgif(!selectgif);
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
      setuser(usea);
    }
  }, []);

  return (
    <>
      {selectgif == true && (
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

      {selectgif == false && (
        <div>
          <center>
            <h1>Add Post</h1>
          </center>

          <div className={style.container}>
            <div className={style.selectgif}>
              <img className={style.thegif} src={selectedpicture}></img>
              <button onClick={() => setselectgif(!selectgif)}>
                select gif
              </button>
            </div>

            <div className={style.inputs}>
              <input
                onChange={(e) => setCaption(e.target.value)}
                className={style.caption}
                type="text"
                placeholder="caption"
              />
            </div>

            <button onClick={() => handlepost()}>Submit</button>
          </div>
        </div>
      )}
    </>
  );
}

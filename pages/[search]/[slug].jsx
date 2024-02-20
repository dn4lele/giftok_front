import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import style from "./search.module.css";
import Navbar from "../../components/Navbar/navbar";
import Post from "../../components/posts/posts";
import { useUser } from "../../components/UserContext";

export default function Search() {
  const router = useRouter();
  const { search, slug } = router.query;

  const [data, setData] = useState([]);
  const { user, loginUser } = useUser();

  useEffect(() => {
    let usea = null;
    try {
      const storedUser = sessionStorage.getItem("user");

      if (!(storedUser == "null" || storedUser == null)) {
        loginUser(JSON.parse(storedUser));
        usea = JSON.parse(storedUser);
      }
    } catch (error) {
      console.error("Error getting user", error);
    }

    async function getdata() {
      if (search == "1") {
        const result = await axios.get(
          `http://localhost:3001/api/users/getusers/${slug}`
        );
        console.log(result.data);

        setData(result.data);
      } else if (search == "2") {
        const result = await axios.get(
          `http://localhost:3001/api/posts/getpostbyname/${slug}`
        );
        console.log(result.data);

        setData(result.data);
      } else if (search == "3") {
        const getPosition = () => {
          return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          });
        };

        console.log("getting position");
        const position = await getPosition();
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const p = [latitude, longitude];

        const result = await axios.get(
          `http://localhost:3001/api/posts/getpostbyradio/${slug}/${p}`
        );
        console.log(result.data);

        setData(result.data);
      }
    }
    getdata();
  }, [slug, search]);

  return (
    <>
      <Navbar />
      {search == 1 && (
        <>
          {" "}
          <h1>Users</h1>
          <div className={style.users}>
            {data.length == 0 && <h1>No User Found</h1>}
            {data.map((user) => (
              <div className={style.singleuser}>
                <h1>{user.name}</h1>
                <img src={user.image} alt={user.name} />
                <button
                  className={style.profbtn}
                  onClick={() => router.push(`/prof/${user._id}/profile`)}
                >
                  see profile
                </button>
              </div>
            ))}
          </div>
        </>
      )}
      {search == 2 && (
        <>
          <h1>Gif By Text</h1>
          <div className={style.posts}>
            {data.length == 0 && <h1>No Gif Found</h1>}
            {data.map((post) => (
              <>
                <div style={{ padding: "5px" }}>
                  <Post
                    id={post._id}
                    username={post.author}
                    caption={post.description}
                    gif={post.gif}
                    logedInUser={user}
                    likesamount={post.likes.length}
                  />
                </div>
              </>
            ))}
          </div>
        </>
      )}
      {search == 3 && (
        <>
          <h1>Gif By radios</h1>
          <div className={style.posts}>
            {data.length == 0 && <h1>No Gif Found</h1>}
            {data.map((post) => (
              <>
                <div style={{ padding: "5px" }}>
                  <Post
                    id={post._id}
                    username={post.author}
                    caption={post.description}
                    gif={post.gif}
                    logedInUser={user}
                    likesamount={post.likes.length}
                  />
                </div>
              </>
            ))}
          </div>
        </>
      )}
    </>
  );
}

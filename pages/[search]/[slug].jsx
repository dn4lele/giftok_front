import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import style from "./search.module.css";
import Navbar from "../../components/Navbar/navbar";

export default function Search() {
  const router = useRouter();
  const { search, slug } = router.query;

  const [data, setData] = useState([]);

  useEffect(() => {
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
            {data.map((user) => (
              <div className={style.singleuser}>
                <h1>{user.name}</h1>
                <img src={user.image} alt={user.name} />
                <button
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
            {data.map((post) => (
              <div className={style.singlepost}>
                <img src={post.gif} alt={post.caption} />
                <p>{post.description}</p>
                <h5 className={style.hide}>likes:{post.likes.length}</h5>
              </div>
            ))}
          </div>
        </>
      )}
      {search == 3 && (
        <>
          <h1>Gif By radios</h1>
          <div className={style.posts}>
            {data.map((post) => (
              <div className={style.singlepost}>
                <img src={post.gif} alt={post.caption} />
                <p>{post.description}</p>
                <h5 className={style.hide}>likes:{post.likes.length}</h5>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}

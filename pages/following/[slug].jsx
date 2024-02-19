import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import style from "./following.module.css";
import Navbar from "../../components/Navbar/navbar";

export default function Search() {
  const router = useRouter();
  const { search, slug } = router.query;

  const [data, setData] = useState([]);

  useEffect(() => {
    let usea = null;
    try {
      const storedUser = sessionStorage.getItem("user");
      if (!(storedUser == "null" || storedUser == null)) {
        loginUser(JSON.parse(storedUser));
        setlogedinUser(JSON.parse(storedUser));
        usea = JSON.parse(storedUser);
      }
    } catch (error) {
      console.error("Error getting user", error);
    }

    async function getdata() {
      console.log("slug", slug);
      const result = await axios.get(
        `http://localhost:3001/api/users/getfollowing/${slug}`
      );
      console.log(result.data);

      setData(result.data);
    }
    getdata();
  }, [slug]);

  return (
    <>
      <Navbar />

      <>
        <h1>following</h1>
        <div className={style.users}>
          {data.length == 0 && <h1>no following</h1>}
          {data.map((user) => (
            <div className={style.singleuser}>
              <h1>{user.following.name}</h1>
              <img src={user.following.image} alt={user.following.name} />
              <button
                onClick={() =>
                  router.push(`/prof/${user.following._id}/profile`)
                }
              >
                see profile
              </button>
            </div>
          ))}
        </div>
      </>
    </>
  );
}

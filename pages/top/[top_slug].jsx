import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/navbar";
import axios from "axios";
import { useUser } from "../../components/UserContext";
import style from "./top.module.css";

export default function Top() {
  const router = useRouter();
  const { top_slug } = router.query;
  const { user, loginUser } = useUser();
  const [data, setData] = useState([]);
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

    if (usea) getdata();

    async function getdata() {
      if (top_slug == 1) {
        const result = await axios.get(
          `http://localhost:3001/api/users/getmostfollowers/${usea._id}`
        );
        setData(result.data);
      } else if (top_slug == 2) {
        const result = await axios.get(
          `http://localhost:3001/api/posts/getmostliked/${usea._id}`
        );
        console.log(result.data);
        setData(result.data);
      }
    }
  }, [top_slug]);

  return (
    <>
      <Navbar />
      <h1>Top {top_slug == 1 ? "follower person" : "Post"}</h1>
      {top_slug == 1 && (
        <>
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
      {top_slug == 2 && (
        <>
          <div className={style.posts}>
            {data.map((post) => (
              <div className={style.singlepost}>
                <img src={post.gif} alt={post.caption} />
                <p>{post.description}</p>
                {post.likes != null && (
                  <h5 className={style.hide}>likes:{post.likes.length}</h5>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}

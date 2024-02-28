import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import axios from "axios";
import { useUser } from "../../components/UserContext";
import style from "./top.module.css";
import Post from "../../components/posts/posts";
import Layout from "../../components/layout";

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
      }
    } catch (error) {
      console.error("Error getting user", error);
    }

    if (usea || top_slug == 3 || top_slug == 4) getdata();

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
        setData(result.data);
      } else if (top_slug == 3) {
        const result = await axios.get(
          `http://localhost:3001/api/users/top3TotalMostLikes`
        );
        setData(result.data);
      } else if (top_slug == 4) {
        const result = await axios.get(
          `http://localhost:3001/api/posts/postwithmostcomments`
        );
        setData(result.data);
      }
    }
  }, [top_slug]);

  return (
    <>
      <center>
        <h1>
          {top_slug == 1
            ? "top following person you follow"
            : top_slug == 2
            ? "top liked post also you liked"
            : top_slug == 3
            ? "top 3 preson with total most likes"
            : "Post with the most comments"}
        </h1>
      </center>
      {top_slug == 1 && (
        <>
          <div className={style.users}>
            {data.map((user) => (
              <div className={style.singleuser}>
                <h1>{user.name}</h1>
                <img
                  src={user.image}
                  alt={user.name}
                  className={style.userprofilepic}
                />
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
      {(top_slug == 2 || top_slug == 4) && (
        <>
          <div className={style.posts}>
            {data.map((gif) => (
              <div>
                {gif != null && gif.author != null && (
                  <>
                    <Post
                      id={gif._id}
                      username={gif.author}
                      caption={gif.description}
                      gif={gif.gif}
                      logedInUser={user}
                      likesamount={gif.likes.length}
                    />
                  </>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {top_slug == 3 && (
        <>
          <div className={style.users}>
            {data.map((user, index) => (
              <div className={style.singleuser}>
                <h1
                  style={{
                    color:
                      index + 1 == 1
                        ? "gold"
                        : index + 1 == 2
                        ? "lightgrey"
                        : "brown",
                  }}
                >
                  Top:{index + 1}
                </h1>
                <h1>{user.name}</h1>
                <img
                  src={user.image}
                  alt={user.image}
                  className={style.userprofilepic}
                />
                <h3>total likes:{user.count}</h3>
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
    </>
  );
}

Top.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

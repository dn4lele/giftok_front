import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/navbar";
import axios from "axios";
import { useUser } from "../../components/UserContext";
import style from "./showpost.module.css";
import Post from "../../components/posts/posts";
import Layout from "../../components/layout";

export default function post() {
  const router = useRouter();
  const { post_slug } = router.query;
  const { user, loginUser } = useUser();
  const [data, setData] = useState();

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
    getpost();
    async function getpost() {
      if (post_slug == null) return;
      const result = await axios.get(
        `http://localhost:3001/api/posts/getpostbyid/${post_slug}`
      );
      console.log(result.data);
      setData(result.data);
    }
  }, [post_slug]);

  return (
    <>
      <h1>post </h1>
      <center>
        {data && (
          <Post
            id={data._id}
            username={data.author}
            caption={data.description}
            gif={data.gif}
            logedInUser={user}
            likesamount={data.likes.length}
          />
        )}
      </center>
    </>
  );
}
post.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

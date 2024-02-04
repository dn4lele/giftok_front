import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "../../components/UserContext";
import style from "./profile.module.css";
import Navbar from "../../components/Navbar/navbar";

export default function ProfilePage() {
  const [posts, setPosts] = useState([]);

  const { user, loginUser } = useUser();

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

    //get the posts
    const fetchPosts = async () => {
      const response = await axios.get(
        `http://localhost:3001/api/posts/getpost/${user.name}`
      );
      setPosts(response.data);
    };
    fetchPosts();
  }, []);

  return (
    <>
      {user != null && (
        <>
          <Navbar />
          <div>
            <h1>My Profile</h1>

            <div className={style.header}>
              <div>
                <img className={style.Profilepic} src={user.image}></img>
                <h2>{user.name}</h2>
              </div>
              <div>
                <h3>followers:{user.following.length}</h3>
                <h3>following:{user.followers.length}</h3>
              </div>
            </div>

            <div className={style.posts}>
              {posts.map((post) => (
                <div className={style.post} key={post.id}>
                  <img src={post.gif} alt={post.caption} />
                  <p>{post.description}</p>
                  <h5 className={style.hide}>likes:{post.likes.length}</h5>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}

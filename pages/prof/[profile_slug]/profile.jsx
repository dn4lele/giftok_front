import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "../../../components/UserContext";
import { useRouter } from "next/router";
import style from "./profile.module.css";
import Navbar from "../../../components/Navbar/navbar";

export default function Profile() {
  const router = useRouter();
  const { profile_slug } = router.query;

  const { user, loginUser } = useUser();

  const [logedinUser, setlogedinUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [profileuser, setProfileuser] = useState(null);
  const [state, setstate] = useState("unfollow");

  const fetchPosts = async () => {
    if (profile_slug != null) {
      const response = await axios.get(
        `http://localhost:3001/api/posts/getpostbyuserid/${profile_slug}`
      );

      setPosts(response.data);
    }
  };

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

    //get the user
    const fetchUser = async () => {
      const response = await axios.get(
        `http://localhost:3001/api/users/getuser/${profile_slug}`
      );
      setProfileuser(response.data);
    };

    const fatchwasfollow = async () => {
      const response = await axios.get(
        `http://localhost:3001/api/users/wasfollow/${profile_slug}/${usea._id}`
      );
      if (response.data) setstate("unfollow");
      else setstate("follow");
    };

    fetchUser();
    if (user != null) {
      fatchwasfollow();
    }
    fetchPosts();
  }, [profile_slug]);

  const handlefollow = async () => {
    const response = await axios.patch(
      `http://localhost:3001/api/users/follow/${profile_slug}/${logedinUser._id}`
    );
    console.log(response.data);
    setProfileuser(response.data[0]);
    setstate(response.data[1]);
  };

  const handledelete = async (postid) => {
    if (confirm("are you sure you want to delete this post?")) {
      console.log(postid);
      const response = await axios.delete(
        `http://localhost:3001/api/posts/delete/${postid}`
      );
      fetchPosts();
    }
  };

  return (
    <>
      <Navbar />
      <>
        {profileuser != null && (
          <>
            <div>
              <h1>{profileuser.name} Profile</h1>

              <div className={style.header}>
                <div>
                  <img
                    className={style.Profilepic}
                    src={profileuser.image}
                  ></img>
                  <h2>{profileuser.name}</h2>
                </div>
                <div>
                  {profileuser.following != null &&
                    profileuser.followers != null && (
                      <>
                        <h3>
                          followers:{profileuser.followers.length}
                          <button
                            className={style.showfoll}
                            onClick={() => {
                              router.push("/followers/" + profileuser._id);
                            }}
                          >
                            show
                          </button>
                        </h3>
                        <h3>
                          following:{profileuser.following.length}
                          <button
                            className={style.showfoll}
                            onClick={() => {
                              router.push("/following/" + profileuser._id);
                            }}
                          >
                            show
                          </button>
                        </h3>
                      </>
                    )}
                </div>

                {logedinUser != null && logedinUser._id != profile_slug && (
                  <>
                    <button
                      className={
                        state == "follow" ? style.follow : style.nofollow
                      }
                      onClick={() => handlefollow()}
                    >
                      {state}
                    </button>
                  </>
                )}
              </div>

              <div className={style.posts}>
                {posts.map((post) => (
                  <div className={style.post} key={post._id}>
                    <img
                      src={post.gif}
                      alt={post.caption}
                      className={style.pic}
                    />
                    <p>{post.description}</p>
                    {post != null && (
                      <>
                        <h5 className={style.hide}>
                          likes:{post.likes.length}
                        </h5>
                        <center>
                          <button
                            className={style.hidetwo}
                            onClick={() => {
                              router.push("/showpost/" + post._id);
                            }}
                          >
                            show post
                          </button>
                        </center>
                      </>
                    )}

                    {logedinUser && logedinUser._id == profile_slug && (
                      <button
                        onClick={() => handledelete(post._id)}
                        className={style.button_24}
                      >
                        delete post
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </>
    </>
  );
}

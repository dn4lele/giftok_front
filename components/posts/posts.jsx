import React, { useEffect } from "react";
import style from "./posts.module.css";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

const Post = ({ username, caption, gif, logedInUser, id }) => {
  const [postuserpic, setpostuserpic] = useState(null);
  const [user_name, setusername] = useState(null);

  const [liked, setLiked] = useState(false);

  const router = useRouter();

  //need to get the username picture that he uploaded the gif
  useEffect(() => {
    const fetchUser = async () => {
      const response = await axios.get(
        `http://localhost:3001/api/users/getuserpicandname/${username}`
      );
      setpostuserpic(response.data[0]);
      setusername(response.data[1]);
    };

    const fatchlike = async () => {
      const response = await axios.get(
        `http://localhost:3001/api/posts/youliked/${id}/${logedInUser._id}`
      );
      setLiked(response.data);
    };

    fetchUser();
    if (logedInUser != null) fatchlike();
  });

  async function addlike() {
    const response = await axios.patch(
      `http://localhost:3001/api/posts/addlike/${id}/${logedInUser._id}`
    );
    if (response.data) {
      console.log(liked);
      setLiked(!liked);
    } else {
      console.log("error adding like");
    }
  }

  return (
    <div className={style.post}>
      <div className={style.post__header}>
        <h3>{user_name}</h3>
        <img className={style.rounded} src={postuserpic}></img>
      </div>

      <div className={style.Post_img}>
        <img src={gif} alt="Post" className={style.pic} />

        <h4 className={style.post__caption}>{caption}</h4>
      </div>

      <div className={style.post__like_comment}>
        {logedInUser != null && (
          <>
            <button
              onClick={() => addlike()}
              style={{ backgroundColor: liked ? "red" : "white" }}
            >
              Like
            </button>
            <button onClick={() => router.push(`/comment/${id}/comment`)}>
              Comment
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Post;

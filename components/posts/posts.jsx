import React, { useEffect } from "react";
import style from "./posts.module.css";
import { useState } from "react";
import axios from "axios";

const Post = ({ username, caption, gif, logedInUser, id }) => {
  const [postuserpic, setpostuserpic] = useState(null);

  const [liked, setLiked] = useState(false);

  //need to get the username picture that he uploaded the gif
  useEffect(() => {
    const fetchUser = async () => {
      const response = await axios.get(
        `http://localhost:3001/api/users/getuserpic/${username}`
      );
      setpostuserpic(response.data);
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
        <h3>{username}</h3>
        <img className={style.rounded} src={postuserpic}></img>
      </div>

      <div className={style.Post_img}>
        <img src={gif} alt="Post" />

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
            <button>Comment</button>
          </>
        )}
      </div>
    </div>
  );
};

export default Post;

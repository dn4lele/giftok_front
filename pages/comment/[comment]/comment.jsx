import { useEffect, useState } from "react";
import style from "./comment.module.css";
import { useRouter } from "next/router";
import axios from "axios";
import Navbar from "../../../components/Navbar/navbar";

export default function Comment() {
  const router = useRouter();
  const { comment } = router.query;

  const [data, setData] = useState();

  const [user_log, setUser_log] = useState(null);
  const [mycomm, setMycomm] = useState("");

  const [allcomments, setAllcomments] = useState([]);

  async function getdata() {
    if (comment != null) {
      const result = await axios.get(
        `http://localhost:3001/api/posts/getpostbyid/${comment}`
      );
      setData(result.data);
    }
  }

  async function handlepostcomment() {
    console.log("posting comment " + mycomm + "on " + comment);
    const response = await axios.post(`http://localhost:3001/api/comments`, {
      text: mycomm,
      postid: comment,
      by: user_log._id,
    });
    getcomments();
  }

  async function getcomments() {
    if (comment != null) {
      const result = await axios.get(
        `http://localhost:3001/api/comments/getcomments/${comment}`
      );
      setAllcomments(result.data);
    }
  }

  async function deletecomm(id) {
    if (confirm("Are you sure you want to delete this comment?")) {
      const response = await axios.delete(
        `http://localhost:3001/api/comments/delete/${id}`
      );
      getcomments();
    }
  }

  useEffect(() => {
    try {
      const storedUser = sessionStorage.getItem("user");

      if (!(storedUser == "null" || storedUser == null)) {
        setUser_log(JSON.parse(storedUser));
      } else {
        router.push("/Log_in_Sign_up/LoginSignup");
      }
    } catch (error) {
      console.error("Error getting user", error);
    }

    console.log("getting data" + comment);
    getdata();
    getcomments();
  }, [comment]);

  return (
    <div>
      <Navbar />
      <center>
        <h1>Comment</h1>
        <div className={style.gif}>
          {data && (
            <div className={style.Post_img}>
              <img src={data.gif} alt="Post" className={style.pic} />

              <h4 className={style.post__caption}>{data.description}</h4>
            </div>
          )}
        </div>

        <div className={style.comment__section}>
          {allcomments.map((com) => (
            <>
              <div className={style.comment}>
                <h3>{com.username}</h3>
                <p>{com.text}</p>
                {com.userid == user_log._id && (
                  <button
                    className={style.deletecomm}
                    onClick={() => deletecomm(com._id)}
                  >
                    Delete
                  </button>
                )}
              </div>
            </>
          ))}
        </div>

        <div className={style.mycomment}>
          <input
            type="text"
            placeholder="comment"
            onChange={(e) => setMycomm(e.target.value)}
          />
          <button onClick={() => handlepostcomment()} className={style.savebtn}>
            Submit
          </button>
        </div>
      </center>
    </div>
  );
}

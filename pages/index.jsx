import Navbar from "../components/Navbar/navbar";
import axios from "axios";
import { useState, useEffect } from "react";
import Post from "../components/posts/posts";
import { useUser } from "../components/UserContext";
import Layout from "../components/layout";

export default function Main() {
  const { user, loginUser } = useUser();

  const [gif, setGif] = useState(null);
  const [page, setPage] = useState(1);

  const fetchGifs = async (gifnum) => {
    const response = await axios.get(
      `http://localhost:3001/api/posts/getpost/paging/${gifnum}`
    );
    setGif(response.data[0]);
    setPage(page + 1);

    if (!response.data[0]) {
      const response2 = await axios.get(
        `http://localhost:3001/api/posts/getpost/paging/${1}`
      );
      setPage(2);
      setGif(response2.data[0]);
    }
  };

  useEffect(() => {
    const storeUserInSessionStorage = async () => {
      try {
        // Check if user is not null before storing in sessionStorage
        if (user != null) {
          // Store user in sessionStorage
          sessionStorage.setItem("user", JSON.stringify(user));

          // Wait for the storage operation to complete
          await new Promise((resolve) => setTimeout(resolve, 0));
        }
        // Retrieve user from sessionStorage and call loginUser
        const storedUser = sessionStorage.getItem("user");

        if (storedUser) {
          loginUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Error storing user in sessionStorage:", error);
      }
    };

    // Call the function
    storeUserInSessionStorage();
    fetchGifs(1);
  }, []);

  return (
    <>
      <center>
        {gif && (
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
        <button
          style={{ borderRadius: "50%", width: 100, height: 100 }}
          onClick={() => fetchGifs(page)}
        >
          show next gif
        </button>
      </center>
    </>
  );
}

Main.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

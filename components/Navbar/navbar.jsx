import Link from "next/link";
import styles from "./Navbar.module.css";
import { useUser } from "../UserContext";
import DropDownProfile from "../dropdown/dropDownProfile";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Navbar() {
  const { user } = useUser();

  const [showstting, setshowstting] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (user == null) {
      setshowstting(false);
    }
  });

  return (
    <>
      <div className={styles.bigdiv}>
        <div className={styles.smalldivs}>
          {/* Left section */}
          <Link href="/">
            <img src={"/logo.png"} alt="Logo" className={styles.pictures} />
          </Link>
        </div>

        <div className={styles.rounded}>
          {/* Middle section */}
          <input
            type="text"
            placeholder="Search"
            className={styles.inputsearch}
          />

          <div className={styles.verticalLine}></div>

          <img
            src={"/search black.png"}
            alt="search logo"
            className={styles.search}
          />
        </div>

        <div className={styles.smalldivs}>
          {/* Right section */}
          {user && (
            <button
              className={styles.addgif}
              onClick={() => router.push("AddPost/AddPost")}
            >
              <img
                src={"/plus.png"}
                alt="profile picture"
                style={{ width: "20px", verticalAlign: "middle" }}
              />
              Add Gif
            </button>
          )}

          {user == null && (
            <button
              onClick={() => router.push("/Log_in_Sign_up/LoginSignup")}
              className={styles.loginbutton}
            >
              Log In
            </button>
          )}

          <div>
            <img
              src={user == null ? "/person.png" : user.image}
              alt="profile picture"
              className={styles.profile}
              onClick={() => {
                if (user != null) setshowstting(!showstting);
              }}
            />
            {showstting && <DropDownProfile />}
          </div>
        </div>
      </div>

      <div style={{ borderBottom: "1px solid #ccc", margin: "10px 0" }}></div>
    </>
  );
}

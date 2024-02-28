import Link from "next/link";
import styles from "./Navbar.module.css";
import { useUser } from "../UserContext";
import DropDownProfile from "../dropdown/dropDownProfile";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Topthings from "../topThingsDropDown/topThingsDropDown";

export default function Navbar() {
  const { user } = useUser();

  const [showstting, setshowstting] = useState(false);

  const [showtop, setshowtop] = useState(false);

  const router = useRouter();

  const [selectedOption, setSelectedOption] = useState("accounts");

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const [serach, setsearch] = useState("");
  const handlesearch = () => {
    if (selectedOption == "accounts") router.push(`/1/${serach}`);
    else if (selectedOption == "gifcaption") router.push(`/2/${serach}`);
    else if (selectedOption == "radios") router.push(`/3/${serach}`);
  };

  useEffect(() => {
    if (user == null) {
      setshowstting(false);
    }
  }, []);

  return (
    <>
      <div className={styles.bigdiv}>
        <div className={styles.smalldivs}>
          {/* Left section */}
          <Link href="/">
            <img src={"/logo.png"} alt="Logo" className={styles.pictures} />
          </Link>

          <button
            className={styles.top}
            onClick={() => {
              setshowtop(!showtop);
              console.log(showtop);
            }}
          >
            top things
          </button>

          {showtop && <Topthings />}
        </div>

        <div className={styles.rounded}>
          {/* Middle section */}
          <input
            type="text"
            placeholder="Search"
            className={styles.inputsearch}
            onChange={(e) => setsearch(e.target.value)}
          />

          <div className={styles.verticalLine}></div>

          <img
            src={"/search black.png"}
            alt="search logo"
            className={styles.search}
            onClick={() => handlesearch()}
          />

          <div>
            <select
              value={selectedOption}
              onChange={handleChange}
              className={styles.select}
            >
              <option value="accounts">accounts</option>
              <option value="gifcaption">gif caption</option>
              <option value="radios">radios</option>
            </select>
          </div>
        </div>

        <div className={styles.smalldivs}>
          {/* Right section */}
          {user && (
            <button
              className={styles.addgif}
              onClick={() => router.push("/AddPost/AddPost")}
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

import React from "react";
import style from "./topThingsDropDown.module.css";
import { useUser } from "../UserContext";
import { useRouter } from "next/router";

const DropDownProfile = () => {
  const { user, logoutUser } = useUser();

  const router = useRouter();

  return (
    <>
      <div className={style.dropDownProfile}>
        <ul className={style.ul}>
          {user && (
            <>
              <li onClick={() => router.push("/top/1")}>
                top following person you follow
              </li>
              <li onClick={() => router.push("/top/2")}>
                top liked post also you liked
              </li>
            </>
          )}
          <li onClick={() => router.push("/top/3")}>
            top 3 preson with total most likes
          </li>
          <li onClick={() => router.push("/top/4")}>
            Post with the most comments
          </li>
        </ul>
      </div>
    </>
  );
};

export default DropDownProfile;

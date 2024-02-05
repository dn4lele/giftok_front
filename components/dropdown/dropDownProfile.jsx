import React from "react";
import style from "./dropDownProfile.module.css";
import { useUser } from "../UserContext";
import { useRouter } from "next/router";

const DropDownProfile = () => {
  const { user, logoutUser } = useUser();

  const router = useRouter();

  const handleLogout = () => {
    if (window.confirm("Do you really want to log out?")) {
      logoutUser();
      router.push("/");
    }
  };

  return (
    <>
      <div className={style.dropDownProfile}>
        <ul className={style.ul}>
          <li onClick={() => router.push(`/prof/${user._id}/profile`)}>
            Profile
          </li>
          <li onClick={() => router.push("/usersetting/usersetting")}>
            Settings
          </li>
          <li onClick={() => handleLogout()}>Log out</li>
        </ul>
      </div>
    </>
  );
};

export default DropDownProfile;

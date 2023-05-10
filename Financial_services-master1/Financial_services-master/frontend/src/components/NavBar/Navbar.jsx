import React, { useState } from "react";
import style from "./navbar.module.css";
import { useNavigate } from "react-router-dom";
const Navbar = React.memo(() => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <>
      <div className={style.navbarContainer}>
        <div className={style.navbarLeftSide}>
          Amrutvahini Financial Services
        </div>
        <div className={style.navbarRightSide} onClick={handleLogout}>
          <button className={style.logoutButton}>Logout</button>
        </div>
      </div>
    </>
  );
});

export default Navbar;

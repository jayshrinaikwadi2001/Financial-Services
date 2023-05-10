import React from "react";
import style from "./homepage.module.css";
import Navbar from "../NavBar/Navbar";
import MainContainer from "../MainContainer/MainContainer";
const Homepage = React.memo(() => {
  return (
    <>
      <div className={style.homepageContainer}>
        <div className={style.navBarCantainer}>
          <Navbar />
        </div>
        <div className={style.mainContaintContainer}>
          <MainContainer />
        </div>
      </div>
    </>
  );
});

export default Homepage;

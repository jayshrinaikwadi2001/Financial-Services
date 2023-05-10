import React from "react";
import style from "./login.module.css";
import Login from "./Login";
const LoginPage = () => {
  return (
    <>
      <div className={style.loginContainer}>
        <div className={style.outerLoginBox}>
          <div className={style.loginBoxWrapper}>
            <div className={style.loginBoxImage}>
              <img
                className={style.loginImage}
                src="https://res.cloudinary.com/djgouef8q/image/upload/v1683352996/mk6qngnhxvsfkvhzis3d.jpg"
                alt="Login Page image"
              />
            </div>
            <div className={style.loginForm}>
              <Login />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;

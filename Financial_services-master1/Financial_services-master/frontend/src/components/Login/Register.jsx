import React from "react";
import style from "./login.module.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import { baseUrl } from "../constants";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
const Register = React.memo(() => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
    selectedOption: "",
  });

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Form Data", formData);

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const res = await axios.post(
        `${baseUrl}/user/register`,
        formData,
        config
      );
      console.log(res.data);
      setFormData({
        userName: "",
        email: "",
        password: "",
        confirmPassword: "",
        selectedOption: "",
      });
      if (res.status === 200) {
        toast.success("Register Successful", {
          position: "top-left",
        });
        navigate("/");
      } else {
        toast.error("something went wrong please check details again", {
          position: "top-left",
        });
      }
    } catch (err) {
      console.log(err);
      toast.error("something went wrong please check details again", {
        position: "top-left",
      });
    }
  };

  return (
    <div className={style.loginFormWrapper}>
      <div className={style.heading}>
        <span className={style.bigHeading}>Sign Up</span>
      </div>
      <div className={style.inputFeildWrapper}>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="userName"
            className={style.inputFeild}
            placeholder="Name"
            value={formData.userName}
            onChange={handleChange}
          />
          <hr />
          <input
            type="text"
            className={style.inputFeild}
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
          <hr />
          <input
            type="password"
            name="password"
            className={style.inputFeild}
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          <hr />
          <input
            type="password"
            name="confirmPassword"
            className={style.inputFeild}
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          <hr />

          <select
            name="selectedOption"
            className={style.inputFeild}
            onChange={handleChange}
          >
            <option value="">Select an option</option>
            <option value="Relationship_Manager">Relationship Manager</option>
            <option value="Operations_Manager">Operations Manager</option>
          </select>
          <hr />

          <button className={style.formSubmitButton}>Sign Up</button>
        </form>
        <div className={style.registUserRedirect}>
          <span>Click to Sign in</span>&nbsp;
          <Link to="/">here</Link>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
});

export default Register;

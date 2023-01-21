import React from "react";
import { Link } from "react-router-dom";
import avatar from "../assets/profile.png";
import styles from "../styles/username.module.css";
import { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import { useState } from "react";
import convertToBase64 from "../helper/convert";
import { profileValidaton } from "../helper/validate";
import extend from "../styles/profile.module.css";

const Profile = () => {
  const [file, setFile] = useState();
  const formik = useFormik({
    initialValues: {
      firstname: "",
      lastname: "",
      email: "",
      mobile: "",
      address: "",
    },
    validate: profileValidaton,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      values = await Object.assign(values, { profile: file || "" });
      console.log("forms", values);
    },
  });

  const onUpload = async (e) => {
    let base64 = await convertToBase64(e.target.files[0]);
    setFile(base64);
  };
  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <div className="flex justify-center items-center h-screen">
        <div className={`${styles.glass} ${extend.glass}`}>
          <div className="title flex flex-col items-center">
            <h4 className="text-5xl font-bold">Profile</h4>
            <span className="text-xl w-2/3 text-center text-gray-500">
              You can update the details
            </span>
          </div>
          <form className="py-1" onSubmit={formik.handleSubmit}>
            <div className="profile flex justify-center py-4">
              <label htmlFor="profile" name="profile">
                <img
                  src={file || avatar}
                  alt="avatar"
                  className={`${styles.profile_img} ${extend.profile_img}`}
                />
              </label>
              <input type="file" id="profile" onChange={onUpload} />
            </div>
            <div className="textbox flex flex-col items-center gap-6">
              <div className="name flex w-3/4 gap-10">
                <input
                  {...formik.getFieldProps("firstname")}
                  type="text"
                  placeholder="firstname"
                  className={`${styles.textbox} ${extend.textbox}`}
                />
                <input
                  {...formik.getFieldProps("lastname")}
                  type="text"
                  placeholder="lastname"
                  className={`${styles.textbox} ${extend.textbox}`}
                />
              </div>
              <div className="name flex w-3/4 gap-10">
                <input
                  {...formik.getFieldProps("mobile")}
                  type="text"
                  placeholder="mobile no."
                  className={`${styles.textbox} ${extend.textbox}`}
                />
                <input
                  {...formik.getFieldProps("email")}
                  type="text"
                  placeholder="email"
                  className={`${styles.textbox} ${extend.textbox}`}
                />
              </div>

              <input
                {...formik.getFieldProps("address")}
                type="text"
                placeholder="address"
                className={`${styles.textbox} ${extend.textbox}`}
              />
              <button type="submit" className={styles.btn}>
                Register
              </button>
            </div>

            <div className="text-center py-4">
              <span className="text-gray-500">
                Come back later?{" "}
                <Link className="text-red-500" to="/">
                  Logout
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;

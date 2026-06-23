import React, { useRef, useState } from "react";
import styles from "./cssFolder/AuthModal.module.css";
import { FaGoogle, FaGithub } from "react-icons/fa";
import toast from "react-hot-toast";
import axios from "axios";
import api from "../api/axiosInstance";

import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

// { isOpen, onClose, setSigneIn, setAuthTrigger }

const AuthModal = ({ setAuthTrigger, setSigneIn }) => {
  const [mode, setMode] = useState("signup"); // login | signup

  const [Email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confurmPass, setConfurmPass] = useState("");
  const navigate = useNavigate();

  const signUpHandler = (e) => {
    if (password !== confurmPass) {
      toast.error("password not match");
      return;
    }

    api
      .post("/Auth/signUp", {
        name: username,
        username: Email,
        password: password,
      })
      .then((data) => {
        setMode("Login");
        setAuthTrigger((prev) => !prev);
        toast.success("SignUp Successful");
      })
      .catch((error) => {
        const errors = error.response?.data;

        if (errors.password) {
          toast.error(errors.password);
        } else {
          toast.error("Signup failed");
        }
      });
  };

  const queryClient = useQueryClient();
  const LoginHandler = () => {
    api
      .post(
        "/Auth/Login",
        {
          username: Email,
          password: password,
        },
        { withCredentials: true },
      )
      .then((response) => {
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("userId", response.data.userId);
        localStorage.setItem("role", response.data.userRole);

        setSigneIn(true);
        navigate("/");
        setAuthTrigger((prev) => !prev);
        toast.success("Login Successful");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      })
      .catch((error) => {
        const ermsg =
          err.response?.data?.message || err.response?.data || err.message;

        toast.error(ermsg || "Login Failed");
      });
  };

  // if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {/* <button className={styles.closeBtn} onClick={onClose}>
          ×
        </button> */}

        <div className={styles.logoBox}>✦</div>

        {mode === "signup" ? (
          <>
            <h2>Create your account</h2>
            <p className={styles.subtitle}>
              Please fill in the details to get started.
            </p>

            {/* SIGNUP FORM */}
            <div className={styles.form}>
              <button
                type="button"
                className={styles.socialBtn}
                onClick={() => {
                  window.location.href =
                    "https://multi-vender-food-ordering-web-fron.vercel.app/oauth2/authorization/google";
                }}
              >
                <FaGoogle /> Continue with Google
              </button>

              <div className={styles.divider}>
                <span>or</span>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  signUpHandler(e);
                }}
              >
                <div className={styles.formGroup}>
                  <label>Full Name</label>
                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    type="text"
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Email address</label>
                  <input
                    value={Email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Password</label>
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    placeholder="Enter password"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Confirm Password</label>
                  <input
                    value={confurmPass}
                    onChange={(e) => setConfurmPass(e.target.value)}
                    type="password"
                    placeholder="Confirm password"
                    required
                  />
                </div>

                <button className={styles.continueBtn} type="submit">
                  Sign Up →
                </button>
              </form>
            </div>

            <p className={styles.footerText}>
              Already have an account?
              <span onClick={() => setMode("Login")}> Login</span>
            </p>
          </>
        ) : (
          <>
            <h2>Welcome back</h2>
            <p className={styles.subtitle}>Login to continue.</p>

            {/* LOGIN FORM */}
            <div className={styles.form}>
              <button
                type="button"
                className={styles.socialBtn}
                onClick={() => {
                  window.location.href =
                    "http://localhost:8080/oauth2/authorization/google";
                }}
              >
                <FaGoogle /> Continue with Google
              </button>

              <button type="button" className={styles.socialBtn}>
                <FaGithub /> Continue with GitHub
              </button>

              <div className={styles.divider}>
                <span>or</span>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  LoginHandler(e);
                }}
              >
                <div className={styles.formGroup}>
                  <label>Email address</label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={Email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Password</label>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <button className={styles.continueBtn} type="submit">
                  Login →
                </button>
              </form>
            </div>

            <p className={styles.footerText}>
              Don’t have an account?
              <span onClick={() => setMode("signup")}> Sign up</span>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthModal;

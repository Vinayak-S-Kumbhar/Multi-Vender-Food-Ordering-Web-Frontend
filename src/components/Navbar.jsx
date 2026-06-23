import React, { useState, useRef, useContext } from "react";
import styles from "./cssFolder/navbar.module.css";
import { FaBars, FaTimes, FaSearch, FaShoppingBasket } from "react-icons/fa";
import AuthModal from "./AuthModal";
import { assets } from "../assets/assets";
import UserAccount from "./UserAccount";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../api/axiosInstance";
import toast from "react-hot-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Loading from "./Loading";
import ConfirmModal from "./ConfirmModal";

const FetchUserInfo = (userId) => {
  if (!userId) return;
  return api.get(`/user/userInfo/${userId}`);
};

const Navbar = ({
  setAuthTrigger,
  authTrigger,
  dashboard,
  setSigneIn,
  isSigneIn,
}) => {
  const [menu, setmenu] = useState(false); //profile dropdown
  const [mobileMenu, setMobileMenu] = useState(false); //mobile nav drawer
  const [AccountOpen, setAccountOpen] = useState(false); //our account page
  const [conferm, setConferm] = useState(false); //conferm Logout
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const dropdownRef = useRef(null);

  useEffect(() => {
    if (userId) {
      setSigneIn(true);
    } else {
      setSigneIn(false);
    }
  }, [userId]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["userInfo/", userId],
    queryFn: () => FetchUserInfo(userId),
    staleTime: Infinity,
    enabled: !!userId,
  });

  if (isError) toast.error(error.message);

  const userData = data?.data;

  const queryClient = useQueryClient();
  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("hotelId");
    setSigneIn(false);
    setmenu(false);
    toast.success("Logout successfully");
    navigate("/");

    queryClient.clear();
    window.location.reload();
  };

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setmenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.logo}>Tomato.</div>

        {/* Desktop Links */}
        <ul className={styles.navLinks}>
          <Link to="/">Home</Link>
          <Link to="/restorents">Restorents</Link>
          <Link to="/My-Orders">My Orders</Link>
          <Link to="/contact-us">Contact us</Link>
          {userData?.userRole === "VENDER" && (
            <Link to="/Vender/dashbord">Dashboard</Link>
          )}
        </ul>

        <div className={styles.navRight}>
          <FaSearch className={styles.icon} />
          <div className={styles.cartContainer}>
            <FaShoppingBasket
              className={styles.CartIcon}
              onClick={() => navigate("/Cart")}
            />

            {isSigneIn && (
              <span className={userData?.cardCount > 0 ? styles.cartBadge : ""}>
                {userData?.cardCount > 0 && userData?.cardCount}
              </span>
            )}
          </div>
          {isSigneIn ? (
            <img
              src={assets.profile_picture}
              alt="Profile"
              className={styles.profilePic}
              onClick={() => setmenu(true)}
            />
          ) : (
            <button
              className={styles.signinBtn}
              onClick={() => navigate("/login")}
            >
              sign in
            </button>
          )}
        </div>
      </nav>

      {menu && (
        <div className={styles.dropdown} ref={dropdownRef}>
          <div className={styles.header}>
            <div className={styles.avatar}>
              <img
                className={styles.avatarImage}
                src={assets.profile_picture}
              />
            </div>
            <div className={styles.userInfo}>
              <strong>{userData?.name}</strong>
              <span>{userData?.username}</span>
            </div>
          </div>

          <div className={styles.menuItem} onClick={() => setAccountOpen(true)}>
            ⚙️ Manage account
          </div>
          <UserAccount
            AccountOpen={AccountOpen}
            onClose={() => setAccountOpen(false)}
          />

          <div
            className={styles.menuItem}
            onClick={() => {
              navigate("/");
              setmenu(false);
            }}
          >
            🏠 Home
          </div>

          <div
            className={styles.menuItem}
            onClick={() => {
              navigate("/restorents");
              setmenu(false);
            }}
          >
            🍽️ Restorents
          </div>
          <div
            className={styles.menuItem}
            onClick={() => {
              navigate("/My-Orders");
              setmenu(false);
            }}
          >
            📖 My Orders
          </div>
          <div
            className={styles.menuItem}
            onClick={() => {
              navigate("/adress");
              setmenu(false);
            }}
          >
            📍 adress
          </div>

          {userData?.userRole === "VENDER" && (
            <div
              className={styles.menuItem}
              onClick={() => {
                navigate("/Vender/dashbord");
                setmenu(false);
              }}
            >
              📊 Dashboard
            </div>
          )}

          <div
            className={styles.menuItem}
            onClick={() => {
              navigate("/requested-restorents");
              setmenu(false);
            }}
          >
            🏪 Requested Restorents
          </div>
          <div
            className={styles.menuItem}
            onClick={() => {
              navigate("/Contact-us");
              setmenu(false);
            }}
          >
            📞 Contact Us
          </div>
          <div
            className={styles.menuItem}
            onClick={() => {
              navigate("/Register-your-Hotel");
              setmenu(false);
            }}
          >
            👨‍🍳 Registre your hotel
          </div>

          <div className={styles.menuItem} onClick={() => setConferm(true)}>
            🚪 Logout
          </div>

          <ConfirmModal
            isOpen={conferm}
            title="Logout"
            message="Are you sure you want to Logout the web"
            confirmText="Logout"
            cancelText="Cancel"
            onConfirm={logout}
            onCancel={() => setConferm(false)}
          />

          <div className={styles.footer}>
            Secured by clerk
            <span>Development mode</span>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;

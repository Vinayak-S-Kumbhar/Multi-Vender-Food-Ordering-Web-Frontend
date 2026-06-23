import { Link, useLocation } from "react-router-dom";
import styles from "./cssFolder/VenderSidebar.module.css";

import { FaUtensils, FaPlus, FaList, FaClipboardList } from "react-icons/fa";
import { useState } from "react";

const VenderSidebar = () => {
  const location = useLocation();
  return (
    <>
      <div className={styles.sidebar}>
        <h2 className={styles.logo}>FoodVendor</h2>

        <ul className={styles.menu}>
          <Link
            to="/Vender/Dashbord"
            className={`${location.pathname === "/Vender/Dashbord" ? styles.active : styles.menuItem}`}
          >
            <FaUtensils /> Dashboard
          </Link>
          <Link
            to="/Vender/Add-Items"
            className={`${location.pathname === "/Vender/Add-Items" ? styles.active : styles.menuItem}`}
          >
            <FaPlus /> Add Food
          </Link>
          <Link
            to="/Vender/List-Item"
            className={`${location.pathname === "/Vender/List-Item" ? styles.active : styles.menuItem}`}
          >
            <FaList /> List Food
          </Link>
          <Link
            to="/Vender/Orders"
            className={`${location.pathname === "/Vender/Orders" ? styles.active : styles.menuItem}`}
          >
            <FaClipboardList /> Orders
          </Link>
        </ul>
      </div>
    </>
  );
};

export default VenderSidebar;

import {
  FaTachometerAlt,
  FaStore,
  FaShoppingBag,
  FaUsers,
  FaDollarSign,
  FaTags,
  FaCog,
} from "react-icons/fa";

import styles from "./cssFolder/OwnerSidebar.module.css";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const menuItems = [
  { name: "Dashboard", icon: FaTachometerAlt, path: "/Owner/Dashboard" },
  {
    name: "Vender Management",
    icon: FaStore,
    path: "/Owner/VenderManagement",
  },
  { name: "Orders", icon: FaShoppingBag, path: "/Owner/Orders" },
  { name: "Users", icon: FaUsers, path: "/Owner/Users" },
  { name: "Food Items", icon: FaTags, path: "/Owner/FoodItems" },
];

export default function OwnerSidebar() {
  const location = useLocation();
  const [active, setActive] = useState(location.pathname);

  return (
    <aside className={styles.sidebar}>
      {/* Logo Section */}
      <div className={styles.logoSection}>
        <div className={styles.logoWrapper}>
          <div className={styles.logoIcon}>🍔</div>

          <div>
            <h2 className={styles.logoTitle}>FoodRush</h2>
            <p className={styles.logoSubtitle}>Super Admin</p>
          </div>
        </div>
      </div>

      {/* Menu Section */}
      <div className={styles.menuSection}>
        <span className={styles.menuHeading}>MAIN MENU</span>

        <nav className={styles.nav}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const name = item.name.split(" ").join("");
            return (
              <Link
                to={`/Owner/${name}`}
                key={item.name}
                onClick={() => setActive(item.name)}
                className={
                  active === item.path ? styles.active : styles.menuItem
                }
              >
                <Icon size={16} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

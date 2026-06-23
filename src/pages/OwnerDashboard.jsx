import { useNavigate } from "react-router-dom";
import OwnerSidebar from "../components/OwnerSidebar";
import styles from "./cssFolder/OwnerDashboard.module.css";

import {
  FaBell,
  FaSearch,
  FaStore,
  FaUsers,
  FaShoppingBag,
} from "react-icons/fa";

import { HiTrendingUp } from "react-icons/hi";
import { useQuery } from "@tanstack/react-query";
import Loading from "../components/Loading";
import api from "../api/axiosInstance";

const stats = [
  {
    title: "TOTAL REVENUE",
    value: "₹28.4L",
    change: "+14.2%",
    icon: <HiTrendingUp size={18} />,
    color: "#f97316",
  },
  {
    title: "TOTAL ORDERS",
    value: "24,891",
    change: "+9.8%",
    icon: <FaShoppingBag size={18} />,
    color: "#3b82f6",
  },
  {
    title: "ACTIVE VENDORS",
    value: "347",
    change: "+3.1%",
    icon: <FaStore size={18} />,
    color: "#22c55e",
  },
  {
    title: "TOTAL CUSTOMERS",
    value: "1,28,450",
    change: "-1.4%",
    icon: <FaUsers size={18} />,
    color: "#a855f7",
  },
];

const vendors = [
  {
    name: "Burger Palace",
    orders: "1245 orders",
    revenue: "₹4.2L",
    growth: "+12.4%",
  },
  {
    name: "Pizza Heaven",
    orders: "1102 orders",
    revenue: "₹3.8L",
    growth: "+8.2%",
  },
  {
    name: "Sushi World",
    orders: "987 orders",
    revenue: "₹5.1L",
    growth: "+15.6%",
  },
  {
    name: "Spice Garden",
    orders: "876 orders",
    revenue: "₹2.9L",
    growth: "-2.1%",
  },
];
const formatDate = (dateString) => {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(dateString));
};

const FetchRecent5orders = () => {
  return api.get("/order/all");
};

export default function OwnerDashboard() {
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["/order/all"],
    queryFn: FetchRecent5orders,
  });
  const orders = data?.data;

  if (isLoading) {
    return (
      <div style={{ marginTop: "60px", marginBottom: "80px" }}>
        <Loading />
      </div>
    );
  }
  return (
    <div className={styles.layout}>
      <OwnerSidebar />

      <main className={styles.dashboard}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h1>Dashboard</h1>
            <p>Welcome back, Alex 👋</p>
          </div>

          <div className={styles.headerActions}>
            <div className={styles.searchBox}>
              <FaSearch size={14} />
              <input type="text" placeholder="Search..." />
            </div>

            <button className={styles.notification}>
              <FaBell size={18} />
              <span>5</span>
            </button>

            <img
              src="https://i.pravatar.cc/100?img=12"
              alt="profile"
              className={styles.avatar}
            />
          </div>
        </div>

        {/* Stats */}
        <div className={styles.statsGrid}>
          {stats.map((card) => (
            <div key={card.title} className={styles.statCard}>
              <div className={styles.statTop}>
                <div>
                  <p>{card.title}</p>
                  <h2>{card.value}</h2>
                  <span>{card.change} vs last week</span>
                </div>

                <div
                  className={styles.iconBox}
                  style={{
                    backgroundColor: `${card.color}15`,
                    color: card.color,
                  }}
                >
                  {card.icon}
                </div>
              </div>

              <div className={styles.chartPlaceholder}></div>
            </div>
          ))}
        </div>

        {/* Charts + Vendors */}
        <div className={styles.middleGrid}>
          <div className={styles.chartCard}>
            <div className={styles.cardHeader}>
              <h3>Weekly Orders</h3>
              <button>This Week</button>
            </div>

            <div className={styles.barChart}>
              {[40, 55, 45, 65, 70, 85, 60].map((height, i) => (
                <div key={i} className={styles.barWrapper}>
                  <div
                    className={`${styles.bar} ${
                      i === 5 ? styles.activeBar : ""
                    }`}
                    style={{ height: `${height}%` }}
                  ></div>

                  <span>
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.vendorCard}>
            <div className={styles.cardHeader}>
              <h3>Top Vendors</h3>
              <button onClick={() => navigate("/Owner/VenderManagement")}>
                View All
              </button>
            </div>

            {vendors.map((vendor) => (
              <div key={vendor.name} className={styles.vendor}>
                <div className={styles.vendorImage}></div>

                <div>
                  <h4>{vendor.name}</h4>
                  <p>
                    {vendor.orders} • {vendor.revenue}
                  </p>
                </div>

                <span>{vendor.growth}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Orders Table */}
        <div className={styles.tableCard}>
          <div className={styles.cardHeader}>
            <h3>Recent Orders</h3>
            <button onClick={() => navigate("/Owner/Orders")}>View All</button>
          </div>

          <table>
            <thead>
              <tr>
                <th>ORDER ID</th>
                <th>CUSTOMER</th>
                <th>VENDOR</th>
                <th>ITEMS</th>
                <th>AMOUNT</th>
                <th>STATUS</th>
                <th>TIME</th>
              </tr>
            </thead>

            <tbody>
              {orders?.map((order) => (
                <tr key={order.id}>
                  <td>#{order.orderId}</td>
                  <td>{order.customerName}</td>
                  <td>{order.venderName}</td>
                  <td>
                    {order.orderItems
                      .map((item) => `${item.foodName} * ${item.quantity}`)
                      .join(", ")}
                  </td>
                  <td>{order.totalAmount}</td>
                  <td>
                    <span className={styles.status}>{order.orderStatus}</span>
                  </td>
                  <td>{formatDate(order.time)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

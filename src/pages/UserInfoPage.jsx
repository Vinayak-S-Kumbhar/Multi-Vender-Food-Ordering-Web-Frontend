import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import styles from "./cssFolder/UserInfoPage.module.css";

import {
  FaUser,
  FaStore,
  FaShoppingBag,
  FaWallet,
  FaStar,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhone,
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";
import { useParams } from "react-router-dom";
import api from "../api/axiosInstance";

const FetchUserInfo = (userId) => {
  return api.get(`/user/${userId}/info/owner`);
};
const FetchOrdersInfo = (userId) => {
  return api.get(`/order/info/${userId}`);
};
const UserInfoPage = () => {
  const { userId } = useParams();
  const [activeTab, setActiveTab] = useState("overview");

  const {
    data,
    isLoading: userLoading,
    error: userError,
  } = useQuery({
    queryKey: ["user-details", userId],
    queryFn: () => FetchUserInfo(userId),
    enabled: !!userId,
  });
  const userData = data?.data;

  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: ["orders", userId],
    queryFn: () => FetchOrdersInfo(userId),
    enabled: !!userId,
  });
  const orders = ordersData?.data;

  if (userLoading || ordersLoading) {
    return (
      <div className={styles.loaderContainer}>
        <div className={styles.loader}></div>
      </div>
    );
  }

  if (userError) {
    return <h3>Failed to load user information</h3>;
  }

  const user = userData?.userInfo;
  const restaurants = userData?.restorentInfo || [];

  const primaryAddress = user?.address?.[0];

  const totalSpent =
    orders?.reduce((acc, item) => acc + item.totalAmount, 0) || 0;

  const averageRating =
    restaurants.length > 0
      ? (
          restaurants.reduce((acc, item) => acc + item.averageRating, 0) /
          restaurants.length
        ).toFixed(1)
      : 0;

  return (
    <div className={styles.container}>
      {/* HEADER */}

      <div className={styles.profileCard}>
        <div className={styles.leftSection}>
          <div className={styles.avatar}>{user?.customerName?.charAt(0)}</div>

          <div>
            <h2>{user?.customerName}</h2>

            <div className={styles.meta}>
              <span>#{user?.userId}</span>

              <span className={styles.badge}>{user?.userRole}</span>

              <span className={styles.active}>Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* STATS */}

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <FaShoppingBag />
          <span>Orders</span>
          <h3>{user?.totalOrders}</h3>
        </div>

        <div className={styles.statCard}>
          <FaWallet />
          <span>Total Spend</span>
          <h3>₹{totalSpent.toLocaleString()}</h3>
        </div>

        <div className={styles.statCard}>
          <FaStore />
          <span>Restaurants</span>
          <h3>{restaurants.length}</h3>
        </div>

        <div className={styles.statCard}>
          <FaStar />
          <span>Vendor Rating</span>
          <h3>{averageRating}/5</h3>
        </div>
      </div>

      {/* TABS */}

      <div className={styles.tabs}>
        <button
          className={activeTab === "overview" ? styles.activeTab : ""}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>

        <button
          className={activeTab === "orders" ? styles.activeTab : ""}
          onClick={() => setActiveTab("orders")}
        >
          Orders ({orders.length})
        </button>

        <button
          className={activeTab === "restaurants" ? styles.activeTab : ""}
          onClick={() => setActiveTab("restaurants")}
        >
          Restaurants ({restaurants.length})
        </button>
      </div>

      {/* OVERVIEW */}

      {activeTab === "overview" && (
        <div className={styles.overviewGrid}>
          <div className={styles.card}>
            <h3>Personal Details</h3>

            <div className={styles.infoRow}>
              <FaUser />
              <span>{user?.customerName}</span>
            </div>

            <div className={styles.infoRow}>
              <FaEnvelope />
              <span>{user?.email}</span>
            </div>

            <div className={styles.infoRow}>
              <FaPhone />
              <span>{primaryAddress?.phone}</span>
            </div>

            <div className={styles.infoRow}>
              <FaCalendarAlt />
              <span>{new Date(user?.registerdAt).toLocaleDateString()}</span>
            </div>
          </div>

          <div className={styles.card}>
            <h3>Address</h3>

            <div className={styles.addressBox}>
              <FaMapMarkerAlt />

              <div>
                <p>{primaryAddress?.addressLine1}</p>
                <p>{primaryAddress?.addressLine2}</p>
                <p>
                  {primaryAddress?.city}, {primaryAddress?.state}
                </p>
                <p>{primaryAddress?.pincode}</p>
                <p>{primaryAddress?.landmark}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ORDERS */}

      {activeTab === "orders" && (
        <div className={styles.listWrapper}>
          {orders.map((order) => (
            <div key={order.orderId} className={styles.orderCard}>
              <div>
                <h3>Order #{order.orderId}</h3>

                <p>{order.VenderName}</p>

                <small>{new Date(order.orderTime).toLocaleString()}</small>
              </div>

              <div className={styles.orderRight}>
                <h3>₹{order.totalAmount}</h3>

                <span className={styles.items}>{order.totalItems} Items</span>

                <span
                  className={`${styles.status} ${
                    styles[order.status?.toLowerCase()]
                  }`}
                >
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* RESTAURANTS */}

      {activeTab === "restaurants" && (
        <div className={styles.restaurantList}>
          {restaurants.map((restaurant) => (
            <div key={restaurant.id} className={styles.restaurantCard}>
              <div>
                <div className={styles.restaurantHeader}>
                  <h3>{restaurant.restorentName}</h3>

                  <span
                    className={
                      restaurant.status === "APPROVED"
                        ? styles.approved
                        : styles.pending
                    }
                  >
                    {restaurant.status}
                  </span>
                </div>

                <p>
                  {restaurant.address?.city}, {restaurant.address?.state}
                </p>
              </div>

              <div className={styles.restaurantStats}>
                <div>
                  <FaStar />
                  {restaurant.averageRating}
                </div>

                <div>
                  <FaCheckCircle />
                  {restaurant.totalRatings} Ratings
                </div>

                <div>
                  <FaClock />
                  {restaurant.createdAt
                    ? new Date(restaurant.createdAt).toLocaleDateString()
                    : "-"}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserInfoPage;

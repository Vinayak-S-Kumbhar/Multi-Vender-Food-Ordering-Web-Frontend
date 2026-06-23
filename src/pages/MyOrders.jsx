import api from "../api/axiosInstance";
import styles from "./cssFolder/MyOrders.module.css";
import { assets } from "../assets/assets";
import { useQuery } from "@tanstack/react-query";
import { FaStar } from "react-icons/fa";
import {
  FaStore,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaStickyNote,
  FaCheckCircle,
} from "react-icons/fa";

import { MdDeliveryDining } from "react-icons/md";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const fetchUserOrders = (userId) => {
  return api.get(`/order/user/${userId}`);
};

const MyOrders = () => {
  const [openOrderId, setOpenOrderId] = useState(null);
  const [foodRatings, setFoodRatings] = useState({});
  const [restaurantRatings, setRestaurantRatings] = useState({});
  const [reviews, setReviews] = useState({});
  const [loading, setLoading] = useState({}); //for add retings

  const toggleOrder = (orderId) => {
    setOpenOrderId((prev) => (prev === orderId ? null : orderId));
  };
  const userId = localStorage.getItem("userId");

  const { data, isLoading } = useQuery({
    queryKey: ["user-orders", userId],
    queryFn: () => fetchUserOrders(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 1,
  });

  const orders = data?.data || [];

  if (!userId) {
    return (
      <div className={styles.orderContainer}>
        <h1 className={styles.ordersTitle}>My Orders</h1>
        <p>Please login to view orders.</p>
      </div>
    );
  }
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (isLoading) {
    return (
      <div className={styles.orderContainer}>
        <h1 className={styles.ordersTitle}>My Orders</h1>
        <p>Loading orders...</p>
      </div>
    );
  }

  const submitFoodRating = async (foodId) => {
    setLoading((prev) => ({ ...prev, [foodId]: true }));
    try {
      const res = await api.post("/Rating/Food/add", {
        userId: Number(userId),
        foodId,
        rating: foodRatings[foodId],
        review: reviews[`food-${foodId}`] || "",
      });

      toast.success(res.data || "Food rated successfully");
    } catch (error) {
      toast.error(error.data || "Failed to submit rating");
    } finally {
      setLoading((prev) => ({ ...prev, [foodId]: false }));
    }
  };

  const submitRestaurantRating = async (restorentId) => {
    setLoading((prev) => ({
      ...prev,
      [restorentId]: true,
    }));
    try {
      const res = await api.post("/Rating/Restorent/add", {
        userId: Number(userId),
        restorentId,
        rating: restaurantRatings[restorentId],
        review: reviews[`rest-${restorentId}`] || "",
      });

      toast.success(res.data || "Restaurant rated successfully");
    } catch (error) {
      console.error(error);
      toast.error(error.data || "Failed to submit rating");
    } finally {
      setLoading((prev) => ({
        ...prev,
        [restorentId]: false,
      }));
    }
  };

  return (
    <div className={styles.orderContainer}>
      <h1 className={styles.ordersTitle}>My Orders</h1>

      {orders.length === 0 ? (
        <div className={styles.emptyOrders}>
          <img src={assets.orderBox} alt="" />
          <p>No Orders Found</p>
        </div>
      ) : (
        <div className={styles.orderList}>
          {orders.map((order) => (
            <div key={order.orderId} className={styles.orderCard}>
              <div
                className={styles.orderHeader}
                onClick={() => toggleOrder(order.orderId)}
              >
                <div className={styles.restaurantInfo}>
                  <FaStore className={styles.icon} />

                  <div>
                    <h2>{order.restorentName}</h2>
                    <p>Order #{order.orderId}</p>
                  </div>
                </div>

                <div className={styles.upperCornner}>
                  <div
                    className={`${styles.statusBadge} ${
                      styles[order.orderStatus?.toLowerCase()]
                    }`}
                  >
                    <MdDeliveryDining />
                    {order.orderStatus}
                  </div>

                  {openOrderId === order.orderId ? (
                    <IoIosArrowUp size={24} />
                  ) : (
                    <IoIosArrowDown size={24} />
                  )}
                </div>
              </div>

              {/* Always visible summary */}
              <div className={styles.orderSummary}>
                <span>{order.foodList?.length || 0} Items</span>

                <span>₹{order.totalAmount}</span>

                <span>{new Date(order.dateTime).toLocaleDateString()}</span>
              </div>

              {/* Expanded Content */}
              {openOrderId === order.orderId && (
                <>
                  <div className={styles.foodSection}>
                    <h3>🍔 Ordered Items</h3>

                    <ul>
                      {order.foodList?.map((food) => (
                        <li key={food.id} className={styles.food}>
                          <div className={styles.Image}>
                            <img
                              src={`http://localhost:8080/public/FoodItem/image/${food.id}`}
                              alt={food.foodname}
                            />

                            <p>{food.foodname}</p>
                          </div>

                          <p>₹{food.price}</p>

                          {order.orderStatus === "PENDING" && (
                            <div className={styles.ratingSection}>
                              <div className={styles.starContainer}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <FaStar
                                    key={star}
                                    size={20}
                                    color={
                                      star <= (foodRatings[food.id] || 0)
                                        ? "#ffc107"
                                        : "#d1d5db"
                                    }
                                    style={{ cursor: "pointer" }}
                                    onClick={() =>
                                      setFoodRatings((prev) => ({
                                        ...prev,
                                        [food.id]: star,
                                      }))
                                    }
                                  />
                                ))}
                              </div>

                              <textarea
                                placeholder="Write your review..."
                                value={reviews[`food-${food.id}`] || ""}
                                onChange={(e) =>
                                  setReviews((prev) => ({
                                    ...prev,
                                    [`food-${food.id}`]: e.target.value,
                                  }))
                                }
                              />

                              <button
                                className={styles.rateBtn}
                                onClick={() => submitFoodRating(food.id)}
                                disabled={loading[food.id]}
                              >
                                {loading[food.id] === true
                                  ? "Submiting Ratings..."
                                  : "Submit Food Rating"}
                              </button>
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className={styles.infoGrid}>
                    <div className={styles.infoCard}>
                      <FaCalendarAlt className={styles.infoIcon} />

                      <div>
                        <strong>Date</strong>

                        <p>{new Date(order.dateTime).toLocaleString()}</p>
                      </div>
                    </div>

                    <div className={styles.infoCard}>
                      <FaMoneyBillWave className={styles.infoIcon} />

                      <div>
                        <strong>Payment</strong>

                        <p>{order.paymentStatus}</p>
                      </div>
                    </div>

                    <div className={styles.infoCard}>
                      <MdDeliveryDining className={styles.infoIcon} />

                      <div>
                        <strong>Delivery Fee</strong>

                        <p>₹{order.deliveryFee}</p>
                      </div>
                    </div>
                  </div>

                  <div className={styles.addressBox}>
                    <h3>
                      <FaMapMarkerAlt /> Delivery Address
                    </h3>

                    <p>
                      {order.orderAddress?.addressLine1},{" "}
                      {order.orderAddress?.addressLine2}
                    </p>

                    <p>
                      {order.orderAddress?.city}, {order.orderAddress?.state}
                    </p>

                    <p>{order.orderAddress?.pincode}</p>
                  </div>

                  {order.note && (
                    <div className={styles.noteBox}>
                      <h3>
                        <FaStickyNote /> Delivery Note
                      </h3>

                      <p>{order.note}</p>
                    </div>
                  )}

                  {order.orderStatus === "PENDING" && (
                    <div className={styles.restaurantRatingBox}>
                      <h3>⭐ Rate Restaurant</h3>

                      <div className={styles.starContainer}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FaStar
                            key={star}
                            size={26}
                            color={
                              star <=
                              (restaurantRatings[order.restorentId] || 0)
                                ? "#ffc107"
                                : "#d1d5db"
                            }
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                              setRestaurantRatings((prev) => ({
                                ...prev,
                                [order.restorentId]: star,
                              }))
                            }
                          />
                        ))}
                      </div>

                      <textarea
                        placeholder="Write your restaurant review..."
                        value={reviews[`rest-${order.restorentId}`] || ""}
                        onChange={(e) =>
                          setReviews((prev) => ({
                            ...prev,
                            [`rest-${order.restorentId}`]: e.target.value,
                          }))
                        }
                      />

                      <button
                        className={styles.rateBtn}
                        onClick={() =>
                          submitRestaurantRating(order.restorentId)
                        }
                        disabled={loading[order.restorentId]}
                      >
                        {loading[order.restorentId] === true
                          ? "Submiting Rating..."
                          : "Submit Restaurant Rating"}
                      </button>
                    </div>
                  )}
                  <div className={styles.orderFooter}>
                    <div className={styles.totalBox}>
                      <FaCheckCircle />

                      <span>Total Amount</span>

                      <h2>₹{order.totalAmount}</h2>
                    </div>

                    <button className={styles.trackBtn}>Track Order</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;

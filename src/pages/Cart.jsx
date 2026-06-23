import { useNavigate } from "react-router-dom";
import style from "./cssFolder/Cart.module.css";
import { useState } from "react";
import api from "../api/axiosInstance";
import toast from "react-hot-toast";
import Loading from "../components/Loading";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const DELIVERY_FEE = 40;

const FetchUserCartFoodItems = (userId) => {
  if (!userId) return Promise.reject("Please login first");
  return api.get(`/cart/list/${userId}`);
};

const Cart = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const queryClient = useQueryClient();
  const [notes, setNotes] = useState({});
  const [activeNote, setActiveNote] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["cart/list/", userId],
    queryFn: () => FetchUserCartFoodItems(userId),
    staleTime: Infinity,
  });

  const restaurants = data?.data || [];

  const savings = (subtotal) => Math.round(subtotal * 0.06);
  const total = (subtotal) => subtotal + DELIVERY_FEE;

  const overallSubtotal = restaurants.reduce((total, restaurant) => {
    return (
      total +
      restaurant.foodItemList.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      )
    );
  }, 0);

  const overallSavings = Math.round(overallSubtotal * 0.06);

  const handleRemoveRestaurant = (restorentId, restorentName) => {
    api
      .delete(`/cart/restaurant/${restorentId}`)
      .then(() => {
        toast.success(`${restorentName} removed from cart`);
        queryClient.invalidateQueries({ queryKey: ["cart/list/", userId] });
        queryClient.invalidateQueries({ queryKey: ["userInfo/", userId] });
      })
      .catch(() => toast.error("Failed to remove restaurant"));
  };
  const handleRemovefood = (foodId) => {
    api
      .delete(`/cart/${foodId}/${userId}`)
      .then((res) => {
        toast.success(`removed from cart`);
        queryClient.invalidateQueries({ queryKey: ["cart/list/", userId] });
        queryClient.invalidateQueries({ queryKey: ["userInfo/", userId] });
      })
      .catch((err) => toast.error("Failed to remove food"));
  };

  const handleQuantityChange = (foodId, currentQty, delta) => {
    const userId = localStorage.getItem("userId");
    const newQty = currentQty + delta;
    if (newQty < 1) {
      toast.error("Minimum quantity is 1");
      return;
    }
    api
      .patch(`/cart/update`, { foodId, quantity: newQty, userId })
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ["cart/list/", userId] });
      })
      .catch(() => toast.error("Failed to update quantity"));
  };

  const handleCheckout = (restaurant, restSubtotal) => {
    navigate("/Order", {
      state: {
        restaurant,
        subtotal: restSubtotal,
        deliveryFee: DELIVERY_FEE,
        savings: savings(restSubtotal),
        total: total(restSubtotal),
        note: notes[restaurant.restorentId] || "",
      },
    });
  };

  if (!userId) {
    return (
      <div className={style.emptyState}>
        <div className={style.emptyIcon}>🛒</div>
        <h2>You're not logged in</h2>
        <p>Please login first to view your cart</p>
        <button className={style.actionBtn} onClick={() => navigate("/login")}>
          Login
        </button>
      </div>
    );
  }

  if (isLoading) return <Loading />;

  if (!restaurants.length) {
    return (
      <div className={style.emptyState}>
        <div className={style.emptyIcon}>🛒</div>
        <h2>Your cart is empty</h2>
        <p>Add delicious items from our restaurants</p>
        <button className={style.actionBtn} onClick={() => navigate("/")}>
          Browse Restaurants
        </button>
      </div>
    );
  }

  return (
    <div className={style.pageWrapper}>
      <div className={style.cartContainer}>
        {/* Page Header */}
        <div className={style.pageHeader}>
          <div className={style.restaurantCount}>
            {restaurants.length} Restaurant{restaurants.length > 1 ? "s" : ""}
          </div>
          <div className={style.deliveryRow}>
            <span className={style.deliveryLabel}>Delivery at Home</span>
            <span className={style.deliveryAddr}>Kolhapur, Maharashtra</span>
          </div>
        </div>

        {/* Savings Banner */}
        {overallSavings > 0 && (
          <div className={style.savingsBanner}>
            <span className={style.savingsEmoji}>🎉</span>
            <span>
              You saved <strong>₹{overallSavings}</strong> on this order
            </span>
          </div>
        )}

        {/* Restaurant Sections */}
        {restaurants.map((restaurant) => {
          const restSubtotal = restaurant.foodItemList.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0,
          );
          const restSavings = savings(restSubtotal);
          const restTotal = total(restSubtotal);

          return (
            <div key={restaurant.restorentId} className={style.restaurantCard}>
              {/* Restaurant Header */}
              <div className={style.restaurantHeader}>
                <div className={style.restaurantInfo}>
                  <div className={style.restaurantImgWrapper}>
                    <img
                      src={""}
                      alt={restaurant.restorentName}
                      className={style.restaurantImg}
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/52x52?text=🍽";
                      }}
                    />
                  </div>
                  <div>
                    <h3 className={style.restaurantName}>
                      {restaurant.restorentName}
                    </h3>
                    <div className={style.deliveryTime}>
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={style.clockIcon}
                      >
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      30–35 mins
                    </div>
                  </div>
                </div>
                <button
                  className={style.removeRestBtn}
                  onClick={() =>
                    handleRemoveRestaurant(
                      restaurant.restorentId,
                      restaurant.restorentName,
                    )
                  }
                >
                  Remove
                </button>
              </div>

              {/* Food Items */}
              <div className={style.itemsList}>
                {restaurant.foodItemList.map((item, idx) => (
                  <div
                    key={item.foodId}
                    className={`${style.cartItem} ${
                      idx < restaurant.foodItemList.length - 1
                        ? style.cartItemBorder
                        : ""
                    }`}
                  >
                    <div className={style.itemLeft}>
                      <span className={style.vegIndicator} aria-label="Veg" />
                      <div className={style.itemDetails}>
                        <span className={style.itemName}>{item.foodName}</span>
                        {item.description && (
                          <span className={style.itemDesc}>
                            {item.description}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className={style.itemRight}>
                      <div className={style.qtyControl}>
                        <button
                          className={style.qtyBtn}
                          onClick={() =>
                            handleQuantityChange(item.foodId, item.quantity, -1)
                          }
                        >
                          −
                        </button>
                        <span className={style.qtyValue}>{item.quantity}</span>
                        <button
                          className={style.qtyBtn}
                          onClick={() =>
                            handleQuantityChange(item.foodId, item.quantity, 1)
                          }
                        >
                          +
                        </button>
                      </div>

                      <span className={style.itemPrice}>
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                    <button
                      className={style.cancelBtn}
                      onClick={() => handleRemovefood(item.foodId)}
                    >
                      ✖
                    </button>
                  </div>
                ))}
              </div>

              {/* Add More Items */}
              <button
                className={style.addMoreBtn}
                onClick={() =>
                  navigate(`/restaurant/${restaurant.restorentId}`)
                }
              >
                + Add more items
              </button>

              {/* Notes & Cutlery */}
              <div className={style.restaurantFooter}>
                <button
                  className={style.footerActionBtn}
                  onClick={() =>
                    setActiveNote(
                      activeNote === restaurant.restorentId
                        ? null
                        : restaurant.restorentId,
                    )
                  }
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                  Add a note
                </button>
                <button className={style.footerActionBtn}>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M3 3h18" />
                    <path d="M3 9l2 12h14l2-12" />
                    <path d="M9 3v6M15 3v6" />
                  </svg>
                  Don't send cutlery
                </button>
              </div>

              {/* Note Input */}
              {activeNote === restaurant.restorentId && (
                <div className={style.noteBox}>
                  <input
                    className={style.noteInput}
                    placeholder={`Note for ${restaurant.restorentName}...`}
                    value={notes[restaurant.restorentId] || ""}
                    onChange={(e) =>
                      setNotes((prev) => ({
                        ...prev,
                        [restaurant.restorentId]: e.target.value,
                      }))
                    }
                  />
                </div>
              )}

              {/* Restaurant Bill Summary */}
              <div className={style.billCard}>
                <h3 className={style.billTitle}>Bill Details</h3>
                <div className={style.billRow}>
                  <span>Item Total</span>
                  <span>₹{restSubtotal}</span>
                </div>
                <div className={style.billRow}>
                  <span>Delivery Fee</span>
                  <div className={style.deliveryFeeBox}>
                    <span className={style.feeOriginal}>₹80</span>
                    <span>₹{DELIVERY_FEE}</span>
                  </div>
                </div>
                {restSavings > 0 && (
                  <div className={`${style.billRow} ${style.savingsRow}`}>
                    <span>Total Savings</span>
                    <span>−₹{restSavings}</span>
                  </div>
                )}
                <div className={style.billDivider} />
                <div className={`${style.billRow} ${style.grandTotal}`}>
                  <span>To Pay</span>
                  <span>₹{restTotal}</span>
                </div>
              </div>

              {/* Per-Restaurant Checkout Button */}
              <div className={style.restaurantCheckoutBar}>
                <div className={style.checkoutTotal}>
                  <span className={style.checkoutAmount}>₹{restTotal}</span>
                  <span className={style.checkoutItems}>
                    {restaurant.foodItemList.length} item
                    {restaurant.foodItemList.length > 1 ? "s" : ""}
                  </span>
                </div>
                <button
                  className={style.checkoutBtn}
                  onClick={() => handleCheckout(restaurant, restSubtotal)}
                >
                  Proceed to Checkout →
                </button>
              </div>
            </div>
          );
        })}

        {/* Safety Info */}
        <div className={style.safetyNote}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <span>
            Review your order and address before placing. Fixed price, no surge.
          </span>
        </div>
      </div>
    </div>
  );
};

export default Cart;

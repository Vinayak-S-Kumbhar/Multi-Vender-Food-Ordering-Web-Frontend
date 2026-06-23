import { useLocation, useNavigate } from "react-router-dom";
import style from "./cssFolder/Order.module.css";
import { useRef, useState } from "react";
import api from "../api/axiosInstance";
import toast from "react-hot-toast";
import AddressPage from "./AddressPage";
import { useQueryClient } from "@tanstack/react-query";
import ConfirmModal from "../components/ConfirmModal";

const Order = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [conferm, setConferm] = useState(false);
  const location = useLocation();
  const { restaurant, subtotal, deliveryFee, savings, total, note } =
    location.state || {};

  const queryClient = useQueryClient();

  const placeOrder = () => {
    const userId = localStorage.getItem("userId");
    setLoading(true);

    api
      .post(`/order/add`, {
        restorentId: restaurant.restorentId,
        userId,
        note,
        savings,
        totalAmount: total,
        deliveryFee,
      })
      .then((res) => {
        toast.success(res.data);
        queryClient.invalidateQueries({ queryKey: ["cart/list/", userId] });
        queryClient.invalidateQueries({ queryKey: ["userInfo/", userId] });
        queryClient.invalidateQueries({ queryKey: ["user-orders", userId] });
        navigate("/My-Orders");
      })
      .catch((err) => {
        const ermsg =
          err.response?.data?.message || err.response?.data || err.message;

        toast.error(ermsg || "Something went wrong");
      })
      .finally(() => setLoading(false));
  };
  return (
    <>
      <div className={style.checkoutContainer}>
        <div className={style.left}>
          <h1>Select The Delivery Address</h1>
          <AddressPage />
        </div>

        <div className={style.right}>
          {/* Restaurant Summary */}
          <div className={style.summaryCard}>
            <h2 className={style.summaryTitle}>Order Summary</h2>

            <div className={style.restaurantInfo}>
              <h3>{restaurant?.restorentName}</h3>
              <span>Estimated delivery: 30–35 mins</span>
            </div>

            {note && (
              <div className={style.notePreview}>
                <strong>Note:</strong> {note}
              </div>
            )}
          </div>

          {/* Savings Banner */}
          {savings > 0 && (
            <div className={style.savingsBanner}>
              🎉 You saved <strong>₹{savings}</strong> on this order
            </div>
          )}

          {/* Bill Details */}
          <div className={style.billCard}>
            <h3 className={style.billTitle}>Bill Details</h3>

            <div className={style.billRow}>
              <span>Item Total</span>
              <span>₹{subtotal}</span>
            </div>

            <div className={style.billRow}>
              <span>Delivery Fee</span>

              <div className={style.deliveryFeeBox}>
                <span className={style.feeOriginal}>₹80</span>
                <span>₹{deliveryFee}</span>
              </div>
            </div>

            {savings > 0 && (
              <div className={`${style.billRow} ${style.savingsRow}`}>
                <span>Total Savings</span>
                <span>-₹{savings}</span>
              </div>
            )}

            <div className={style.billDivider}></div>

            <div className={`${style.billRow} ${style.grandTotal}`}>
              <span>To Pay</span>
              <span>₹{total}</span>
            </div>
          </div>

          {/* Payment Method */}
          <div className={style.paymentCard}>
            <h3 className={style.paymentTitle}>Payment Method</h3>

            <label className={style.pmItem}>
              <input type="radio" name="payment" value="COD" defaultChecked />

              <div className={style.pmText}>
                <div className={style.pmTitle}>Cash on Delivery</div>

                <div className={style.pmDesc}>Pay when your order arrives</div>
              </div>
            </label>

            <label className={style.pmItem}>
              <input type="radio" name="payment" value="UPI" />

              <div className={style.pmText}>
                <div className={style.pmTitle}>UPI Payment</div>

                <div className={style.pmDesc}>Google Pay, PhonePe, Paytm</div>
              </div>
            </label>
          </div>

          {/* Checkout Bar */}
          <div className={style.checkoutBar}>
            <div>
              <div className={style.checkoutAmount}>₹{total}</div>
              <div className={style.checkoutLabel}>Final Amount</div>
            </div>

            <button
              className={style.placeOrderBtn}
              onClick={() => {
                setConferm(true);
              }}
              disabled={loading}
            >
              {loading ? "Placing Order..." : "Place Order → "}
            </button>

            <ConfirmModal
              isOpen={conferm}
              title="Place Order"
              message="Are you sure you want to place this order"
              confirmText="Place Order"
              cancelText="Cancel"
              onConfirm={placeOrder}
              onCancel={() => setConferm(false)}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Order;

import { useQuery, useQueryClient } from "@tanstack/react-query";
import VenderSidebar from "../components/VenderSidebar";
import style from "./cssFolder/VenderOrders.module.css";
import Loading from "../components/Loading";
import api from "../api/axiosInstance";
import { useState } from "react";
import { UpdateStatus } from "../utils/OrderManagement";
import { FiRefreshCw, FiX } from "react-icons/fi";
import ConfirmModal from "../components/ConfirmModal";

const FetchRecentOrders = (restorentId) => {
  return api.get(`/order/restorent/${restorentId}`);
};
const getNextStatus = (status) => {
  switch (status) {
    case "PLACED":
      return "CONFIRMED";

    case "CONFIRMED":
      return "PREPARING";

    case "PREPARING":
      return "OUT_OF_DELIVERY";

    case "OUT_OF_DELIVERY":
      return "DELIVERED";

    case "CANCELED":
      return "CONFIRMED";

    default:
      return null;
  }
};
const formatDate = (dateString) => {
  if (!dateString) return "-";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(dateString));
};
const VenderOrders = ({ activeHotel }) => {
  const [conferm, setConferm] = useState({
    type: null,
    orderId: null,
  }); // conferm for chenge the status
  const restorenId = localStorage.getItem("hotelId");
  const [activeFilter, setActiveFilter] = useState("All");
  const queryClient = useQueryClient();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["order/restorent", restorenId],
    queryFn: () => FetchRecentOrders(restorenId),
    enabled: !!restorenId,
  });

  const orders = data?.data || [];

  const order =
    activeFilter === "All"
      ? orders
      : orders.filter((o) => o.orderStatus === activeFilter).sort();

  const filterd = [...order].sort((a, b) => b.orderId - a.orderId);

  return (
    <>
      <div className={style.adminLayout}>
        <VenderSidebar />

        <div className={style.ordersContent}>
          {orders.length !== 0 && orders[0]?.restorentStatus !== "APPROVED" && (
            <h1 className={style.accountError}>
              This Account is {orders[0]?.restorentStatus} !
            </h1>
          )}
          <div className={style.pageHeader}>
            <div className={style.pageIcon}>🍽️</div>

            <div>
              <h2 className={style.ordersTitle}>Orders</h2>
              <p className={style.subTitle}>Live order management</p>
            </div>
          </div>

          {/* Stats */}
          <div className={style.statsGrid}>
            <div className={style.statCard}>
              <span>TOTAL ORDERS</span>
              <h3>{orders?.length || 0}</h3>
            </div>

            <div className={style.statCard}>
              <span>TOTAL REVENUE</span>
              <h3 className={style.revenue}>
                ₹
                {orders?.reduce((sum, order) => sum + order.totalAmount, 0) ||
                  0}
              </h3>
            </div>

            <div className={style.statCard}>
              <span>PENDING</span>
              <h3 className={style.pendingCount}>
                {orders?.filter((order) => order.orderStatus === "PENDING")
                  .length || 0}
              </h3>
            </div>
          </div>

          {/* Filters */}
          <div className={style.filterTabs}>
            <button
              className={`${style.filterBtn} ${activeFilter === "All" && style.activeFilter}`}
              onClick={() => setActiveFilter("All")}
            >
              All orders
            </button>
            <button
              className={`${style.filterBtn} ${activeFilter === "PENDING" && style.activeFilter}`}
              onClick={() => setActiveFilter("PENDING")}
            >
              Pending
            </button>
            <button
              className={`${style.filterBtn} ${activeFilter === "PREPARING" && style.activeFilter}`}
              onClick={() => setActiveFilter("PREPARING")}
            >
              Preparing
            </button>
            <button
              className={`${style.filterBtn} ${activeFilter === "OUT_OF_DELIVERY" && style.activeFilter}`}
              onClick={() => setActiveFilter("OUT_OF_DELIVERY")}
            >
              Out for delivery
            </button>
            <button
              className={`${style.filterBtn} ${activeFilter === "DELIVERED" && style.activeFilter}`}
              onClick={() => setActiveFilter("DELIVERED")}
            >
              Delivered
            </button>{" "}
            <button
              className={`${style.filterBtn} ${activeFilter === "CANCELED" && style.activeFilter}`}
              onClick={() => setActiveFilter("CANCELED")}
            >
              Canceled
            </button>
          </div>

          {isLoading ? (
            <Loading />
          ) : orders.length > 0 ? (
            filterd.map((order) => (
              <div key={order.orderId} className={style.orderCard}>
                {/* Header */}
                <div className={style.orderHeader}>
                  <div className={style.customerSection}>
                    <div className={style.avatar}>
                      {order.addressResponse?.fullName?.charAt(0)}
                    </div>

                    <div>
                      <h3>{order.addressResponse?.fullName}</h3>

                      <div className={style.customerMeta}>
                        <span>📞 {order.addressResponse?.phone}</span>

                        <span>
                          📍 {order.addressResponse?.city},{" "}
                          {order.addressResponse?.state}
                        </span>
                      </div>

                      <div className={style.address}>
                        {order.addressResponse?.addressLine1}
                      </div>
                    </div>
                  </div>

                  <div className={style.amountSection}>
                    <div className={style.amount}>₹{order.totalAmount}</div>

                    <div
                      className={`${style.paymentBadge} ${
                        order.paymentStatus === "PAID"
                          ? style.paid
                          : style.unpaid
                      }`}
                    >
                      {order.paymentStatus}
                    </div>
                  </div>
                </div>
                {/* Food Items */}
                <div className={style.itemsRow}>
                  {order.itemList?.map((item) => (
                    <div key={item.foodId} className={style.foodChip}>
                      🍽 {item.foodName}
                      <span className={style.qtyBadge}>×{item.quantity}</span>
                    </div>
                  ))}
                </div>
                {/* Footer */}
                <div className={style.orderFooter}>
                  <div className={style.orderInfo}>
                    <span className={style.infoBadge}>
                      # Order {order.orderId}
                    </span>

                    <span className={style.infoBadge}>
                      🕒 {formatDate(order.orderTime)}
                    </span>

                    <span
                      className={`${style.statusBadge} ${
                        style[order.orderStatus?.toLowerCase()]
                      }`}
                    >
                      ● {order.orderStatus}
                    </span>
                  </div>

                  <div className={style.topActions}>
                    <button
                      className={style.primaryBtn}
                      onClick={() =>
                        setConferm({
                          type: "chenge",
                          orderId: order.orderId,
                        })
                      }
                    >
                      <FiRefreshCw /> Change status
                    </button>
                    <button
                      className={style.dangerBtn}
                      onClick={() =>
                        setConferm({
                          type: "canceld",
                          orderId: order.orderId,
                        })
                      }
                    >
                      <FiX /> Cancel order
                    </button>
                  </div>
                </div>
                <ConfirmModal
                  isOpen={
                    conferm.type === "canceld" &&
                    conferm.orderId === order.orderId
                  }
                  title="Cancel Order"
                  message="Are you sure you want to Cancel this Order"
                  confirmText="Cancel Order"
                  cancelText="Cancel"
                  onConfirm={() =>
                    UpdateStatus(
                      order.orderId,
                      "CANCELED",
                      null,
                      queryClient,
                      refetch,
                      setConferm,
                    )
                  }
                  onCancel={() =>
                    setConferm({
                      type: null,
                      orderId: null,
                    })
                  }
                />
                <ConfirmModal
                  isOpen={
                    conferm.type === "chenge" &&
                    conferm.orderId === order.orderId
                  }
                  title="chenge Order status"
                  message={`Are you sure you want Chenge status to ${getNextStatus(order.orderStatus)}`}
                  confirmText="Chenge status"
                  cancelText="Cancel"
                  onConfirm={() =>
                    UpdateStatus(
                      order.orderId,
                      getNextStatus(order.orderStatus),
                      null,
                      queryClient,
                      refetch,
                      setConferm,
                    )
                  }
                  onCancel={() =>
                    setConferm({
                      type: null,
                      orderId: null,
                    })
                  }
                />
              </div>
            ))
          ) : (
            <div className={style.noOrders}>No Orders Found</div>
          )}
        </div>
      </div>
    </>
  );
};

export default VenderOrders;

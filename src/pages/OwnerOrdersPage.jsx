import styles from "./cssFolder/OwnerOrdersPage.module.css";
import { FiSearch, FiBell, FiMoreVertical, FiEye } from "react-icons/fi";
import OwnerSidebar from "../components/OwnerSidebar";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import Loading from "../components/Loading";
import toast from "react-hot-toast";

const FetchOrders = ({ pageParam = 0 }) => {
  return api.get(`/order/all?page=${pageParam}&size=10`);
};

const getStatusClass = (status) => {
  switch (status) {
    case "DELIVERED":
      return styles.delivered;
    case "PREPARING":
      return styles.preparing;
    case "PLACED":
      return styles.placed;
    case "OUT_OF_DELIVERY":
      return styles.onway;
    case "CANCELED":
      return styles.cancelled;
    default:
      return "";
  }
};
const formatDate = (dateString) => {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(dateString));
};

const orderStatus = [
  "All Orders",
  "PLACED",
  "CANCELED",
  "PREPARING",
  "OUT_OF_DELIVERY",
  "DELIVERED",
];
export default function OwnerOrdersPage() {
  const [openMenu, setOpenMenu] = useState(null);
  const [activeStatus, setActiveStatus] = useState("All Orders"); //to filter orders by status
  const navigate = useNavigate();

  const { ref, inView } = useInView();

  const { data, isLoading, isError, error, isFetchingNextPage, fetchNextPage } =
    useInfiniteQuery({
      queryKey: ["Owner", "Orders", "all"],
      queryFn: FetchOrders,
      staleTime: 1000 * 60 * 2,
      initialPageParam: 0,
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage.data.length < 10) {
          return undefined;
        }
        return allPages.length;
      },
    });

  if (isError) {
    const msg =
      error.response?.data?.message || error.response?.data || error.message;

    toast.error(msg);
  }

  const orders = data?.pages?.flatMap((page) => page.data);

  const filterdOrders =
    activeStatus === "All Orders"
      ? orders
      : orders.filter((order) => order.orderStatus === activeStatus);

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  const menuRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <div className={styles.layout}>
      <OwnerSidebar />

      <div className={styles.mainContent}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h1>Order Management</h1>
            <p>Track and manage all platform orders</p>
          </div>

          <div className={styles.headerRight}>
            <div className={styles.searchBox}>
              <FiSearch />
              <input placeholder="Search..." />
            </div>

            <div className={styles.notification}>
              <FiBell size={18} />
              <span>5</span>
            </div>

            <img
              src="https://i.pravatar.cc/150?img=3"
              alt=""
              className={styles.avatar}
            />
          </div>
        </div>

        <div className={styles.pageContent}>
          {/* Tabs */}
          <div className={styles.tabs}>
            {orderStatus.map((status) => {
              return (
                <button
                  className={activeStatus === status ? styles.activeTab : ""}
                  onClick={() => setActiveStatus(status)}
                >
                  {status}
                </button>
              );
            })}
          </div>

          {/* Filters */}
          <div className={styles.filters}>
            <div className={styles.bigSearch}>
              <FiSearch />
              <input placeholder="Search orders, customers, vendors..." />
            </div>
          </div>

          {/* Table */}
          <div className={styles.tableWrapper}>
            <table>
              <thead>
                <tr>
                  <th>ORDER ID</th>
                  <th>CUSTOMER</th>
                  <th>VENDOR</th>
                  <th>ITEMS</th>
                  <th>AMOUNT</th>
                  <th>STATUS</th>
                  <th>DATE</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>

              <tbody>
                {isLoading && (
                  <div style={{ marginTop: "60px", marginBottom: "80px" }}>
                    <Loading />
                  </div>
                )}
                {filterdOrders?.length === 0 ? (
                  <div style={{ marginLeft: "20px" }}>No Orders found</div>
                ) : (
                  filterdOrders?.map((order) => (
                    <tr key={order.id}>
                      <td className={styles.orderId}>{order.orderId}</td>

                      <td>
                        <div className={styles.customer}>
                          <strong>{order.customerName}</strong>
                        </div>
                      </td>

                      <td>{order.venderName}</td>
                      <td>
                        {order.orderItems
                          .map((item) => `${item.foodName} * ${item.quantity}`)
                          .join(", ")}
                      </td>
                      <td>{order.totalAmount}</td>

                      <td>
                        <span
                          className={`${styles.status} ${getStatusClass(
                            order.orderStatus,
                          )}`}
                        >
                          {order.orderStatus}
                        </span>
                      </td>

                      <td>
                        <div className={styles.date}>
                          <span>{order.date}</span>
                          <small>{formatDate(order.time)}</small>
                        </div>
                      </td>

                      <td>
                        <div
                          className={styles.actionMenu}
                          ref={openMenu === order.id ? menuRef : null}
                        >
                          <button
                            className={styles.actionBtn}
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenu(
                                openMenu === order.orderId
                                  ? null
                                  : order.orderId,
                              );
                            }}
                          >
                            <FiMoreVertical />
                          </button>

                          {openMenu === order.orderId && (
                            <div className={styles.dropdown}>
                              <button
                                onClick={() =>
                                  navigate(`/Owner/Order/${order.orderId}`)
                                }
                              >
                                <FiEye />
                                View Order
                              </button>

                              <button className={styles.blockBtn}>
                                Cancel Order
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
                <div ref={ref}>
                  {isFetchingNextPage && (
                    <div style={{ marginTop: "10px", marginBottom: "10px" }}>
                      <Loading />
                    </div>
                  )}
                </div>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

import VenderSidebar from "../components/VenderSidebar";
import Loading from "../components/Loading";
import api from "../api/axiosInstance";

import styles from "./cssFolder/VendorDashboard.module.css";

const FetchUserHotels = (userId) => {
  return api.get(`/Restorent/user/${userId}`);
};

const FetchRecentOrders = (restorentId) => {
  return api.get(`/order/restorent/${restorentId}`);
};

const VendorDashboard = ({ activeHotel, setActiveHotel }) => {
  const userId = localStorage.getItem("userId");

  if (!userId) {
    return (
      <center>
        <h1>Login First</h1>
      </center>
    );
  }

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["restaurants", userId],
    queryFn: () => FetchUserHotels(userId),
    staleTime: Infinity,
    enabled: !!userId,
  });

  const hotels = data?.data || [];

  // Set Active Hotel
  useEffect(() => {
    if (!hotels.length) return;

    const savedHotelId = localStorage.getItem("hotelId");

    if (savedHotelId) {
      const selectedHotel = hotels.find(
        (hotel) => hotel.id.toString() === savedHotelId,
      );

      if (selectedHotel) {
        setActiveHotel(selectedHotel);
      } else {
        setActiveHotel(hotels[0]);
        localStorage.setItem("hotelId", hotels[0].id.toString());
      }
    } else {
      setActiveHotel(hotels[0]);
      localStorage.setItem("hotelId", hotels[0].id.toString());
    }
  }, [hotels, setActiveHotel]);

  // Fetch Orders
  const recentOrders = useQuery({
    queryKey: ["orders", activeHotel?.id],
    queryFn: () => FetchRecentOrders(activeHotel.id),
    enabled: !!activeHotel?.id,
  });

  const orders = recentOrders?.data?.data || [];

  const OrderList = orders.sort((a, b) => b.orderId - a.orderId);

  if (isLoading) {
    return <Loading />;
  }

  if (!activeHotel) {
    return <Loading />;
  }
  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <VenderSidebar />

      {/* Main Content */}
      <div className={styles.main}>
        {activeHotel.status !== "APPROVED" && (
          <h1 className={styles.accountError}>
            This Account is {activeHotel.status} ! You can't sell your food
            heare
          </h1>
        )}

        <h1 className={styles.heading}>
          {activeHotel?.restorentName} Dashboard
        </h1>

        <p className={styles.subHeading}>
          Managing: {activeHotel?.restorentName} ({activeHotel?.address?.city},{" "}
          {activeHotel?.address?.state})
        </p>

        <p className={styles.subHeading}>
          Track orders, manage food items and monitor your revenue.
        </p>

        {/* Hotel Selector */}
        <div className={styles.hotelSection}>
          <h1>Select Hotel</h1>
          <br />

          <div className={styles.hotelList}>
            {hotels.map((hotel) => (
              <div
                key={hotel.id}
                className={`${styles.hotelCard} ${
                  activeHotel?.id === hotel.id ? styles.activeHotel : ""
                }`}
                onClick={() => {
                  localStorage.setItem("hotelId", hotel.id.toString());
                  setActiveHotel(hotel);
                }}
              >
                <h3>{hotel.restorentName}</h3>

                <p>
                  {hotel?.address?.city}, {hotel?.address?.state}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className={styles.cards}>
          <div className={styles.card}>
            <h3>Total Orders</h3>
            <p>{recentOrders?.data?.data?.length || 0}</p>
          </div>

          <div className={styles.card}>
            <h3>Total Revenue</h3>
            <p>₹45,600</p>
          </div>

          <div className={styles.card}>
            <h3>Pending Orders</h3>
            <p>12</p>
          </div>

          <div className={styles.card}>
            <h3>Total Products</h3>
            <p>34</p>
          </div>
        </div>

        {/* Recent Orders */}
        <div className={styles.tableContainer}>
          <div className={styles.tableHeader}>
            <h2>Recent Orders</h2>

            <span className={styles.orderCount}>
              {OrderList.length || 0} Orders
            </span>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Location</th>
                  <th>Items</th>
                  <th>Amount</th>
                  <th>Order Status</th>
                  <th>Payment</th>
                  <th>Time</th>
                </tr>
              </thead>

              <tbody>
                {recentOrders.isLoading ? (
                  <tr>
                    <td colSpan="8">
                      <Loading />
                    </td>
                  </tr>
                ) : OrderList?.length > 0 ? (
                  OrderList?.map((order) => (
                    <tr key={order.orderId}>
                      <td>
                        <span className={styles.orderId}>#{order.orderId}</span>
                      </td>

                      <td>
                        <div className={styles.customerInfo}>
                          <h4>
                            {order.addressResponse?.fullName || "Unknown"}
                          </h4>

                          <p>{order.addressResponse?.phone || "No Phone"}</p>
                        </div>
                      </td>

                      <td>
                        <div className={styles.locationInfo}>
                          <span>{order.addressResponse?.city}</span>
                          <small>{order.addressResponse?.state}</small>
                        </div>
                      </td>

                      <td>
                        <div className={styles.itemsContainer}>
                          <span className={styles.itemCount}>
                            {order.itemList?.length || 0} Items
                          </span>

                          <div className={styles.itemPreview}>
                            {order.itemList?.slice(0, 2).map((item) => (
                              <span
                                key={item.foodId}
                                className={styles.itemBadge}
                              >
                                {item.foodName} × {item.quantity}
                              </span>
                            ))}
                          </div>
                        </div>
                      </td>

                      <td className={styles.amount}>₹{order.totalAmount}</td>

                      <td>
                        <span
                          className={`${styles.status} ${
                            order.orderStatus === "DELIVERED"
                              ? styles.delivered
                              : order.orderStatus === "PREPARING"
                                ? styles.preparing
                                : styles.pending
                          }`}
                        >
                          {order.orderStatus}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`${styles.status} ${
                            order.paymentStatus === "PAID"
                              ? styles.paid
                              : styles.unpaid
                          }`}
                        >
                          {order.paymentStatus}
                        </span>
                      </td>

                      <td className={styles.time}>
                        {order.orderTime
                          ? new Date(order.orderTime).toLocaleString()
                          : "-"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className={styles.noOrders}>
                      No Orders Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;

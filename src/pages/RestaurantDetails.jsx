import { useParams } from "react-router-dom";
import OwnerSidebar from "../components/OwnerSidebar";
import styles from "./cssFolder/RestaurantDetails.module.css";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../api/axiosInstance";
import Loading from "../components/Loading";
import { FaStar } from "react-icons/fa";
import { useState } from "react";
import { UpdateRestorentStatus } from "../utils/VenderManagmentHelper";

const FetchVenderList = (restorentId) => {
  return api.get(`/public/Restorent/${restorentId}`);
};

const RestaurantDetails = () => {
  const [selectedCat, setSelectedCat] = useState("All"); //selected categery for food list
  const [loading, setLoading] = useState(false); //loading state for chenge state
  const queryClient = useQueryClient();

  const { restorentId } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ["owner", "Restorent/", restorentId],
    queryFn: () => FetchVenderList(restorentId),
    staleTime: Infinity,
  });

  const restorent = data?.data || {};

  const categerys = ["All"];

  restorent?.foodItemList?.map((item) => {
    if (!categerys.includes(item.foodCategery))
      categerys.push(item.foodCategery);
  });

  const filterdfood =
    selectedCat === "All"
      ? restorent.foodItemList
      : restorent.foodItemList.filter(
          (item) => item.foodCategery === selectedCat,
        );

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
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.profileSection}>
            <div className={styles.avatar}>SG</div>

            <div>
              <div className={styles.restaurantName}>
                {restorent.restorentName}
                <span
                  className={
                    restorent.status === "PENDING"
                      ? styles.pending
                      : restorent.status === "APPROVED"
                        ? styles.approved
                        : restorent.status === "SUSPENDED"
                          ? styles.suspended
                          : restorent.status === "REJECTED"
                            ? styles.suspended
                            : ""
                  }
                >
                  {restorent.status}
                </span>
              </div>

              <div className={styles.meta}>{restorent.ownerName}</div>

              <div className={styles.cuisine}>{restorent.productCategerys}</div>
            </div>
          </div>

          <div className={styles.Btns}>
            {restorent.status === "APPROVED" ? (
              <>
                <button
                  className={styles.suspendBtn}
                  disabled={loading}
                  onClick={() =>
                    UpdateRestorentStatus(
                      restorent.id,
                      "REJECTED",
                      queryClient,
                      setLoading,
                    )
                  }
                >
                  Reject Account
                </button>
                <button
                  className={styles.suspendBtn}
                  disabled={loading}
                  onClick={() =>
                    UpdateRestorentStatus(
                      restorent.id,
                      "SUSPENDED",
                      queryClient,
                      setLoading,
                    )
                  }
                >
                  Suspend Account
                </button>
              </>
            ) : (
              <button
                className={styles.AcceptBtn}
                disabled={loading}
                onClick={() =>
                  UpdateRestorentStatus(
                    restorent.id,
                    "APPROVED",
                    queryClient,
                    setLoading,
                  )
                }
              >
                Accept Account
              </button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <span>Total Orders</span>
            <h3>{restorent.totalOrders}</h3>
          </div>

          <div className={styles.statCard}>
            <span>Total Revenue</span>
            <h3>₹4,82,500</h3>
          </div>

          <div className={styles.statCard}>
            <span>Avg Rating</span>
            <h3>⭐ {restorent.averageRating}</h3>
          </div>

          <div className={styles.statCard}>
            <span>Commission</span>
            <h3>18%</h3>
          </div>
        </div>

        {/* Main Layout */}
        <div className={styles.mainContent}>
          {/* Sidebar */}
          <div className={styles.sidebar}>
            <div className={styles.card}>
              <h4>Restaurant Info</h4>
              <div className={styles.infoItem}>
                <strong>Address</strong>
                <p>
                  {[
                    restorent.address.addressLine1,
                    restorent.address.addressLine2,
                    restorent.address.landmark,
                    restorent.address.state,
                    restorent.address.pincode &&
                      `Pincode: ${restorent.address.pincode}`,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </div>

              <div className={styles.infoItem}>
                <strong>Phone</strong>
                <p>+91 {restorent.mobileNumber}</p>
              </div>
              <div className={styles.infoItem}>
                <strong>alternetive Phone</strong>
                <p>+91 {restorent.alternativeMobNumber}</p>
              </div>
              <div className={styles.infoItem}>
                <strong>Email</strong>
                <p>{restorent.email}</p>
              </div>
              <div className={styles.infoItem}>
                <strong>Hours</strong>
                <p>9:00 AM - 11:00 PM</p>
              </div>
              <div className={styles.infoItem}>
                <strong>Delivery</strong>
                <p>25-35 min</p>
              </div>
              <div className={styles.infoItem}>
                <strong>Joined</strong>
                <p>{restorent.createdAt}</p>
              </div>
              <div className={styles.infoItem}>
                <strong>GST No.</strong>
                <p>27AAPFU0939F1ZV</p>
              </div>
              <div className={styles.infoItem}>
                <strong>FSSAI</strong>
                <p>11223344556677</p>
              </div>
            </div>

            <div className={styles.card}>
              <h4>Activity Log</h4>

              <ul className={styles.activityList}>
                <li>Account registered</li>
                <li>Profile documents verified</li>
                <li>Account approved by admin</li>
                <li>First order received</li>
              </ul>
            </div>
          </div>

          {/* Menu */}
          <div className={styles.menuSection}>
            <div className={styles.menuHeader}>
              <h4>Food Menu</h4>

              <div className={styles.filters}>
                {categerys.map((cat) => {
                  return (
                    <button
                      key={cat}
                      className={selectedCat === cat ? styles.activeFilter : ""}
                      onClick={() => setSelectedCat(cat)}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Item Name</th>
                    <th>Category</th>
                    <th>Description</th>
                    <th>Price</th>
                    <th>Ratings</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {filterdfood.map((item, index) => (
                    <tr key={index}>
                      <td>{item.foodname}</td>
                      <td>{item.foodCategery}</td>
                      <td>{item.description}</td>
                      <td>{item.price}</td>
                      <td>
                        <FaStar color="orange" />
                        {` ${item.averageRating} (${item.totalRatings})`}
                      </td>
                      <td>
                        <span
                          className={item.available ? styles.live : styles.off}
                        >
                          {item.available ? "live" : "off"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetails;

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import {
  FiAlertCircle,
  FiClock,
  FiMail,
  FiMapPin,
  FiPhone,
  FiRefreshCw,
  FiStar,
  FiTag,
  FiUser,
  FiHome,
  FiArrowRight,
} from "react-icons/fi";
import { FiCreditCard, FiCalendar, FiShield } from "react-icons/fi";
import styles from "./cssFolder/RequestedRestaurantsPage.module.css";
import api from "../api/axiosInstance";

const FetchRequestedRestorents = (userId) => {
  return api.get(`/Restorent/${encodeURIComponent(userId)}`);
};

export default function RequestedRestaurantsPage() {
  const params = useParams();
  const userId = localStorage.getItem("userId");

  const { data, error, refetch, isFetching, status } = useQuery({
    queryKey: ["requested-restaurants", userId],
    enabled: !!userId,
    queryFn: () => FetchRequestedRestorents(userId),
    staleTime: 1000 * 60 * 30,
  });

  const restaurants = Array.isArray(data?.data) ? data?.data : [];
  const loading = status === "pending";

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <div>
          <p className={styles.kicker}>Restaurant registration</p>
          <h1 className={styles.title}>Requested Restaurants</h1>
          <p className={styles.subtitle}>
            All restaurant requests submitted by this user are shown here with
            their current status, contact details, and address.
          </p>
        </div>

        <div className={styles.topActions}>
          <div className={styles.userChip}>
            <FiUser />
            <span>User ID: {userId || "N/A"}</span>
          </div>

          <button
            type="button"
            className={styles.refreshBtn}
            onClick={() => refetch()}
            disabled={!userId || isFetching}
          >
            <FiRefreshCw className={isFetching ? styles.spin : ""} />
            Refresh
          </button>
        </div>
      </div>

      {!userId ? (
        <div className={styles.stateCard}>
          <FiAlertCircle className={styles.stateIcon} />
          <h2 className={styles.stateTitle}>User ID is missing</h2>
          <p className={styles.stateText}>
            Pass the userId through the route param or as a prop.
          </p>
        </div>
      ) : loading ? (
        <div className={styles.stateCard}>
          <FiRefreshCw className={styles.stateIconSpin} />
          <h2 className={styles.stateTitle}>Loading requested restaurants</h2>
          <p className={styles.stateText}>Please wait while we fetch data...</p>
        </div>
      ) : error ? (
        <div className={styles.stateCard}>
          <FiAlertCircle className={styles.stateIcon} />
          <h2 className={styles.stateTitle}>Something went wrong</h2>
          <p className={styles.stateText}>
            {error?.message || "Unable to fetch requested restaurants."}
          </p>
        </div>
      ) : restaurants.length === 0 ? (
        <div className={styles.stateCard}>
          <FiClock className={styles.stateIcon} />
          <h2 className={styles.stateTitle}>No restaurant requests yet</h2>
          <p className={styles.stateText}>
            When the user registers a restaurant, it will appear here.
          </p>
        </div>
      ) : (
        <div className={styles.grid}>
          {restaurants.map((item) => {
            const r = item?.restorentDto || {};
            ``;
            const a = item?.restorentAddress || {};
            const RStatus = item.status;
            const categories = String(r.productCategerys || "")
              .split(",")
              .map((x) => x.trim())
              .filter(Boolean);

            const status = String(RStatus || "UNKNOWN");
            const statusClass =
              status === "APPROVED"
                ? styles.approved
                : status === "PENDING"
                  ? styles.pending
                  : ["REJECTED", "SUSPENDED"].includes(status)
                    ? styles.rejected
                    : styles.unknown;

            return (
              <article
                key={r.id || `${r.restorentName}-${r.email}`}
                className={styles.card}
              >
                <div className={styles.cardHeader}>
                  <div className={styles.brandBlock}>
                    <div className={styles.brandIcon}>
                      <FiHome />
                    </div>

                    <div>
                      <h2 className={styles.restaurantName}>
                        {r.restorentName || "Unnamed Restaurant"}
                      </h2>
                      <p className={styles.ownerLine}>
                        <FiUser />
                        <span>{r.ownerName || "Owner not available"}</span>
                      </p>
                    </div>
                  </div>

                  <span className={`${styles.badge} ${statusClass}`}>
                    {status}
                  </span>
                </div>
                <div className={styles.metaRow}>
                  <div className={styles.ratingBox}>
                    <FiStar />
                    <strong>{Number(r.averageRating || 0).toFixed(1)}</strong>
                    <span>({r.totalRatings || 0} ratings)</span>
                  </div>

                  <div className={styles.metaItem}>
                    <FiClock />
                    <span>
                      {r.createdAt
                        ? new Date(r.createdAt).toLocaleString()
                        : "Created date not available"}
                    </span>
                  </div>
                </div>
                <div className={styles.infoGrid}>
                  <div className={styles.infoCard}>
                    <FiMail />
                    <div>
                      <label>Email</label>
                      <p>{r.email || "Not provided"}</p>
                    </div>
                  </div>

                  <div className={styles.infoCard}>
                    <FiPhone />
                    <div>
                      <label>Mobile</label>
                      <p>
                        {r.mobileNumber != null
                          ? String(r.mobileNumber)
                          : "Not provided"}
                      </p>
                    </div>
                  </div>

                  <div className={styles.infoCard}>
                    <FiPhone />
                    <div>
                      <label>Alt. mobile</label>
                      <p>
                        {r.alternativeMobNumber != null
                          ? String(r.alternativeMobNumber)
                          : "Not provided"}
                      </p>
                    </div>
                  </div>

                  <div className={styles.infoCard}>
                    <FiTag />
                    <div>
                      <label>Business type</label>
                      <p>{r.businessType || "Not available"}</p>
                    </div>
                  </div>
                </div>
                <div className={styles.financeSection}>
                  <h3 className={styles.sectionTitle}>
                    <FiShield />
                    Business & Banking Details
                  </h3>

                  <div className={styles.financeGrid}>
                    <div className={styles.infoCard}>
                      <FiShield />
                      <div>
                        <label>FSSAI Number</label>
                        <p>{r.fssaiNumber || "Not provided"}</p>
                      </div>
                    </div>

                    <div className={styles.infoCard}>
                      <FiCalendar />
                      <div>
                        <label>FSSAI Expiry</label>
                        <p>
                          {r.fssaiExpiry
                            ? new Date(r.fssaiExpiry).toLocaleDateString()
                            : "Not provided"}
                        </p>
                      </div>
                    </div>

                    <div className={styles.infoCard}>
                      <FiCreditCard />
                      <div>
                        <label>Account Number</label>
                        <p>{r.accountNumber || "Not provided"}</p>
                      </div>
                    </div>

                    <div className={styles.infoCard}>
                      <FiCreditCard />
                      <div>
                        <label>IFSC Code</label>
                        <p>{r.ifscCode || "Not provided"}</p>
                      </div>
                    </div>

                    <div className={styles.infoCard}>
                      <FiCreditCard />
                      <div>
                        <label>Account Type</label>
                        <p>{r.accountType || "Not provided"}</p>
                      </div>
                    </div>
                  </div>
                </div>
                {categories.length > 0 && (
                  <div className={styles.chips}>
                    {categories.map((cat) => (
                      <span key={cat} className={styles.chip}>
                        {cat}
                      </span>
                    ))}
                  </div>
                )}
                <div className={styles.addressBox}>
                  <div className={styles.addressTitle}>
                    <FiMapPin />
                    <h3>Restaurant address</h3>
                  </div>

                  <p className={styles.addressText}>
                    {a.fullName || "Name not available"}
                    {a.addressLine1 ? `, ${a.addressLine1}` : ""}
                    {a.addressLine2 ? `, ${a.addressLine2}` : ""}
                    {a.landmark ? `, ${a.landmark}` : ""}
                    {a.city ? `, ${a.city}` : ""}
                    {a.state ? `, ${a.state}` : ""}
                    {a.pincode ? ` - ${a.pincode}` : ""}
                  </p>

                  <div className={styles.addressMeta}>
                    <span>Phone: {a.phone || "N/A"}</span>
                    <span>Type: {a.addressType || "N/A"}</span>
                    <span>Default: {a.isDefault ? "Yes" : "No"}</span>
                  </div>
                </div>
                {RStatus !== "PENDING" && (
                  <Link className={styles.visitBtn} to="/Vender/dashbord">
                    Visit Restaurant
                    <FiArrowRight />
                  </Link>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

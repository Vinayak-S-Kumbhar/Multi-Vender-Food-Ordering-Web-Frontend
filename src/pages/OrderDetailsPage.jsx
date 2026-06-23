import React, { useState } from "react";
import {
  FiArrowDown,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiCreditCard,
  FiEdit3,
  FiMail,
  FiMapPin,
  FiPackage,
  FiPhone,
  FiRefreshCw,
  FiShoppingBag,
  FiTruck,
  FiX,
  FiUser,
  FiMap,
  FiMessageSquare,
  FiCopy,
} from "react-icons/fi";
import styles from "./cssFolder/OrderDetailsPage.module.css";
import VenderSidebar from "../components/VenderSidebar";
import OwnerSidebar from "../components/OwnerSidebar";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import api from "../api/axiosInstance";
import Loading from "../components/loading";
import { FaStar } from "react-icons/fa";
import toast from "react-hot-toast";
import ConfirmModal from "../components/ConfirmModal";
import { UpdateStatus } from "../utils/OrderManagement";

function currency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);
}

function SectionTitle({ title, right }) {
  return (
    <div className={styles.sectionTitle}>
      <h2>{title}</h2>
      {right ? <div className={styles.sectionTitleRight}>{right}</div> : null}
    </div>
  );
}

function InfoRow({ icon: Icon, label, value, muted = false }) {
  return (
    <div className={styles.infoRow}>
      <div className={styles.infoIcon}>
        <Icon />
      </div>
      <div className={styles.infoText}>
        <div className={styles.infoLabel}>{label}</div>
        <div className={`${styles.infoValue} ${muted ? styles.muted : ""}`}>
          {value}
        </div>
      </div>
    </div>
  );
}

function StatLine({ label, value, accent = false, total = false }) {
  return (
    <div className={`${styles.statLine} ${total ? styles.totalLine : ""}`}>
      <span className={accent ? styles.discountLabel : ""}>{label}</span>
      <strong className={accent ? styles.discountValue : ""}>{value}</strong>
    </div>
  );
}
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

const ORDER_STEPS = [
  {
    key: "PLACED",
    label: "Order placed",
    icon: FiPackage,
  },
  {
    key: "CONFIRMED",
    label: "Confirmed",
    icon: FiCheckCircle,
  },
  {
    key: "PREPARING",
    label: "Preparing",
    icon: FiShoppingBag,
  },
  {
    key: "OUT_OF_DELIVERY",
    label: "Out for delivery",
    icon: FiTruck,
  },
  {
    key: "DELIVERED",
    label: "Delivered",
    icon: FiCheckCircle,
  },
];
const FetchOrderDetails = (orderId) => {
  return api.get(`/order/${orderId}`);
};

export default function OrderDetailsPage() {
  const [conferm, setConferm] = useState(null);
  const { orderId } = useParams();
  const queryClient = useQueryClient();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["owner", "Order", orderId],
    queryFn: () => FetchOrderDetails(orderId),
    staleTime: 1000 * 60 * 2,
  });
  const order = data?.data;
  const items = order?.orderResponce?.itemList;

  const currentStatus = order?.orderResponce?.orderStatus;

  const currentStepIndex = ORDER_STEPS.findIndex(
    (step) => step.key === currentStatus,
  );

  const statusSteps = ORDER_STEPS.map((step, index) => ({
    ...step,
    done: index < currentStepIndex,
    active: index === currentStepIndex,
  }));

  const subtotal = 860;
  const deliveryFee = 40;
  const discount = order?.orderResponce?.savings;
  const total = order?.orderResponce?.totalAmount;

  const date = new Date(order?.orderResponce?.orderTime);

  const formattedDate = date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  if (isLoading) {
    return (
      <div style={{ marginTop: "60px", marginBottom: "80px" }}>
        <Loading />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* Leave this space for your fixed vendor sidebar */}
      <OwnerSidebar />

      <div className={styles.sidebarSpacer} aria-hidden="true" />

      <main className={styles.main}>
        <div className={styles.wrapper}>
          <header className={styles.topbar}>
            <div>
              <div className={styles.orderIdRow}>
                <h1>#ORD-{order.orderResponce.orderId}</h1>
                <span className={styles.statusBadge}>
                  {order.orderResponce.orderStatus}
                </span>
              </div>

              <div className={styles.metaRow}>
                <span>
                  <FiCalendar /> {formattedDate}
                </span>
                <span>
                  <FiClock /> {formattedTime}
                </span>
              </div>
            </div>

            <div className={styles.topActions}>
              <button
                className={styles.primaryBtn}
                onClick={() => setConferm("chenge")}
              >
                <FiRefreshCw /> Change status
              </button>
              <button
                className={styles.dangerBtn}
                onClick={() => setConferm("canceld")}
              >
                <FiX /> Cancel order
              </button>
            </div>
          </header>

          <section className={styles.progressCard}>
            {currentStatus === "CANCELED" ? (
              <div className={styles.cancelledOrder}>
                <div className={styles.cancelledIcon}>
                  <FiX />
                </div>
                <div className={styles.cancelledText}>
                  Order has been cancelled
                </div>
              </div>
            ) : (
              <div className={styles.progressTrack}>
                {statusSteps.map((step, idx) => {
                  const Icon = step.icon;

                  return (
                    <React.Fragment key={step.key}>
                      <div
                        className={`${styles.step}
                ${step.done ? styles.stepDone : ""}
                ${step.active ? styles.stepActive : ""}`}
                      >
                        <div className={styles.stepIcon}>
                          <Icon />
                        </div>

                        <span>{step.label}</span>
                      </div>

                      {idx !== statusSteps.length - 1 && (
                        <div
                          className={`${styles.connector}
                  ${step.done || step.active ? styles.connectorDone : ""}`}
                        />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            )}
          </section>

          <div className={styles.grid}>
            {/* Left column */}
            <div className={styles.leftCol}>
              <section className={styles.card}>
                <SectionTitle title="Customer" />
                <div className={styles.customerHeader}>
                  <div className={styles.avatar}>PS</div>
                  <div>
                    <div className={styles.customerName}>
                      {order.orderResponce.addressResponse.fullName}
                    </div>
                    <div className={styles.subtle}>
                      {order.customerInfo.userRole}
                    </div>
                  </div>
                </div>

                <div className={styles.divider} />

                <InfoRow
                  icon={FiPhone}
                  label="Phone"
                  value={`+91 ${order.orderResponce.addressResponse.phone}`}
                />
                <InfoRow
                  icon={FiMail}
                  label="Email"
                  value={order.customerInfo.username}
                />
                <InfoRow
                  icon={FiMapPin}
                  label="Delivery address"
                  value={
                    <>
                      {[
                        order.orderResponce.addressResponse.addressLine1,
                        order.orderResponce.addressResponse.addressLine2,
                        order.orderResponce.addressResponse.landmark,
                        order.orderResponce.addressResponse.state,
                        order.orderResponce.addressResponse.pincode &&
                          `Pincode: ${order.orderResponce.addressResponse.pincode}`,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </>
                  }
                />

                <div className={styles.notePill}>
                  <strong>Landmark:</strong> Opp. Petrol Pump
                </div>
              </section>

              <section className={styles.card}>
                <SectionTitle title="Vendor details" />
                <div className={styles.customerHeader}>
                  <div className={styles.avatar}>PS</div>
                  <div>
                    <div className={styles.customerName}>
                      {order.vendor.restorentName}
                    </div>
                    <div className={styles.subtle}>
                      {order.vendor.businessType}
                    </div>
                  </div>
                </div>
                <div className={styles.divider} />

                <InfoRow
                  icon={FiShoppingBag}
                  label="Vendor name"
                  value={order.vendor.ownerName}
                />
                <InfoRow
                  icon={FiCopy}
                  label="Vendor ID"
                  value={order.vendor.venderId}
                />
                <InfoRow
                  icon={FiPhone}
                  label="Contact"
                  value={`+91 ${order.vendor.mobileNumber}`}
                />
                <InfoRow
                  icon={FiMail}
                  label="Email"
                  value={order.vendor.email}
                />
                <InfoRow
                  icon={FiMap}
                  label="Address"
                  value={
                    <>
                      {[
                        order.vendor.address.addressLine1,
                        order.vendor.address.addressLine2,
                        order.vendor.address.landmark,
                        order.vendor.address.state,
                        order.vendor.address.pincode &&
                          `Pincode: ${order.vendor.address.pincode}`,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </>
                  }
                />
                <div className={styles.ratingRow}>
                  <span>
                    <FaStar color="orange" />
                  </span>{" "}
                  {order.vendor.averageRating} ({order.vendor.totalRatings})
                </div>
              </section>
            </div>

            {/* Main content */}
            <div className={styles.rightCol}>
              <section className={styles.card}>
                <SectionTitle
                  title="Order items"
                  right={
                    <span className={styles.countPill}>
                      {items.length} items
                    </span>
                  }
                />
                <div className={styles.tableWrap}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Qty</th>
                        <th>Unit price</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item) => (
                        <tr key={item.foodId}>
                          <td>
                            <div className={styles.itemCell}>
                              {/* <span
                                className={`${styles.dot} ${item.spice === "veg" ? styles.veg : styles.nonVeg}`}
                              /> */}
                              <strong>{item.foodName}</strong>
                            </div>
                          </td>
                          <td>×{item.quantity}</td>
                          <td>{currency(item.price)}</td>
                          <td>{currency(item.price * item.quantity)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className={styles.mobileItems}>
                  {items.map((item) => (
                    <div key={item.foodId} className={styles.mobileItemCard}>
                      <div className={styles.mobileItemTop}>
                        <div className={styles.itemCell}>
                          {/* <span
                            className={`${styles.dot} ${item.spice === "veg" ? styles.veg : styles.nonVeg}`}
                          /> */}
                          <strong>{item.foodName}</strong>
                        </div>
                        <span className={styles.qtyPill}>×{item.quantity}</span>
                      </div>
                      <div className={styles.mobileItemMeta}>
                        <span>{currency(item.price)} each</span>
                        <strong>{currency(item.subtotal)}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <div className={styles.bottomGrid}>
                <section className={styles.card}>
                  <SectionTitle title="Payment summary" />
                  <div className={styles.summaryBox}>
                    <StatLine label="Subtotal" value={currency(subtotal)} />
                    <StatLine
                      label="Delivery fee"
                      value={currency(deliveryFee)}
                    />
                    {/* <StatLine label="GST (5%)" value={currency(gst)} /> */}
                    <StatLine
                      label="Discount"
                      value={`-${currency(Math.abs(discount))}`}
                      accent
                    />
                    {/* <div className={styles.summaryDivider} /> */}
                    <StatLine label="Total" value={currency(total)} total />
                  </div>

                  {/* <div className={styles.paymentMethod}>
                    <FiCreditCard />
                    <div>
                      <div className={styles.paymentText}>
                        UPI (PhonePe) · Paid
                      </div>
                      <div className={styles.subtle}>TXN8847291034</div>
                    </div>
                  </div> */}
                </section>

                <section className={styles.card}>
                  <SectionTitle title="Order timing" />
                  <div className={styles.summaryBox}>
                    <InfoRow icon={FiClock} label="Placed at" value="1:30 PM" />
                    <InfoRow
                      icon={FiCalendar}
                      label="Date"
                      value={formattedDate}
                    />
                    {/* <InfoRow icon={FiTruck} label="ETA" value={formattedTime} /> */}
                  </div>

                  <div className={styles.customerNote}>
                    <div className={styles.noteHeader}>
                      <FiMessageSquare />
                      <span>Customer note</span>
                    </div>
                    <p>“{order.orderResponce.note}”</p>
                  </div>

                  <div className={styles.tinyActions}>
                    <button className={styles.lightBtn}>
                      <FiUser /> View profile
                    </button>
                  </div>
                </section>
              </div>
            </div>
          </div>

          <div className={styles.mobileFooterSpace} />
        </div>
      </main>
      <ConfirmModal
        isOpen={conferm === "canceld"}
        title="Cancel Order"
        message="Are you sure you want to Cancel this Order"
        confirmText="Cancel Order"
        cancelText="Cancel"
        onConfirm={() =>
          UpdateStatus(
            order.orderResponce.orderId,
            "CANCELED",
            order.customerInfo.id,
            queryClient,
            refetch,
            setConferm,
          )
        }
        onCancel={() => setConferm(null)}
      />
      <ConfirmModal
        isOpen={conferm === "chenge"}
        title="chenge Order status"
        message={`Are you sure you want Chenge status to ${getNextStatus(order.orderResponce.orderStatus)}`}
        confirmText="Chenge status"
        cancelText="Cancel"
        onConfirm={() =>
          UpdateStatus(
            order.orderResponce.orderId,
            getNextStatus(order.orderResponce.orderStatus),
            order.customerInfo.id,
            queryClient,
            refetch,
            setConferm,
          )
        }
        onCancel={() => setConferm(null)}
      />
    </div>
  );
}

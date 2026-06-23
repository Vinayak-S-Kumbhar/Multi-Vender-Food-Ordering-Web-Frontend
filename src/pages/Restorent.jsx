import { useState } from "react";
import styles from "./cssFolder/Restorent.module.css";
import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import api from "../api/axiosInstance";
import toast from "react-hot-toast";
import Loading from "../components/loading";
import Food from "../components/Food";
import { addToCart } from "../utils/foodItemHelper";
import Ratings from "../components/Ratings";

const FetchRestorentData = (restorentId) => {
  return api.get(`/public/Restorent/${restorentId}`);
};
export default function Restorent() {
  const [section, setSection] = useState("food");
  const [selectedCat, setSelectedCat] = useState("All");

  const queryClient = useQueryClient();
  const { restorentId } = useParams();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["/Restorent/", restorentId],
    queryFn: () => FetchRestorentData(restorentId),
    staleTime: 1000 * 60 * 15,
    enabled: !!restorentId,
  });

  const restorent = data?.data;
  const allFoodItems = restorent?.foodItemList || [];

  const foodList = () => {
    if (selectedCat === "All") return allFoodItems;

    return allFoodItems.filter((item) => item.foodCategery === selectedCat);
  };

  const categeryFood = foodList();
  //find categerys
  const categerys = ["All"];

  allFoodItems.forEach((element) => {
    if (!categerys.includes(element.foodCategery)) {
      categerys.push(element.foodCategery);
    }
  });

  const AvailableItems = allFoodItems.filter((item) => item.available === true);

  const establishedYears = restorent?.yearOfEstablish
    ? new Date().getFullYear() - restorent?.yearOfEstablish
    : null;

  if (isLoading) return <Loading />;

  return (
    <div className={styles.page}>
      {/* HERO */}
      {restorent.status !== "APPROVED" && (
        <h1 className={styles.accountError}>
          This Restorent is {restorent.status} ! You can't buy food heare Please
          check some other venders
        </h1>
      )}
      <section className={styles.hero}>
        <div className={styles.heroOverlay}></div>

        <div className={styles.heroContent}>
          <div className={styles.badges}>
            <span className={styles.badge}>🧁 {restorent?.businessType}</span>
            <span className={styles.badge}>
              Est. {restorent?.yearOfEstablish} • {establishedYears} yrs
            </span>
            <span className={styles.openBadge}>🟢 Open Now</span>
          </div>

          <h1 className={styles.restaurantName}>{restorent?.restorentName}</h1>

          <p className={styles.cuisine}>{restorent?.productCategerys}</p>
        </div>
      </section>

      {/* OFFERS */}
      <div className={styles.offerWrapper}>
        <div className={`${styles.offerCard} ${styles.fristOfferCard}`}>
          <div>🏷️</div>

          <div>
            <h4>20% OFF</h4>
            <p>On first order • Use FIRST20</p>
          </div>
        </div>

        <div className={styles.offerCard}>
          <div>🚚</div>

          <div>
            <h4>FREE DELIVERY</h4>
            <p>Orders above ₹500</p>
          </div>
        </div>

        <div className={styles.offerCard}>
          <div>🎁</div>

          <div>
            <h4>COMBO DEAL</h4>
            <p>2 Items for ₹199</p>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className={styles.restaurantInfo}>
        <div className={styles.infoItem}>
          ⭐ <strong>{restorent.averageRating}</strong>
          <span>{restorent.totalRatings} Reviews</span>
        </div>

        <div className={styles.infoItem}>
          ⏰ <strong>30-45 min</strong>
        </div>

        <div className={styles.infoItem}>
          🚚 <strong>Free above ₹500</strong>
        </div>

        <div className={styles.infoItem}>
          📍 <strong>2.4 km</strong>
        </div>
      </div>

      {/* TABS */}
      <div className={styles.tabs}>
        <button
          className={section === "food" ? styles.activeTab : ""}
          onClick={() => setSection("food")}
        >
          🍽 Menu (2)
        </button>
        <button
          className={section === "info" ? styles.activeTab : ""}
          onClick={() => setSection("info")}
        >
          ℹ Info
        </button>
        <button
          className={section === "Retings" ? styles.activeTab : ""}
          onClick={() => setSection("Retings")}
        >
          Ratings
        </button>
      </div>

      {/* CATEGORY */}
      {section === "food" && (
        <>
          <div className={styles.categoryButtons}>
            {categerys.map((item) => {
              return (
                <button
                  key={item}
                  className={selectedCat === item ? styles.activeCategory : ""}
                  onClick={() => setSelectedCat(item)}
                >
                  🥗 {item}
                </button>
              );
            })}
            {/* <button >🥗 Veg Meal</button> */}
          </div>

          {/* SEARCH */}
          <div className={styles.searchContainer}>
            <input
              placeholder="Search dishes or category..."
              className={styles.searchInput}
            />
          </div>

          {/* SMALL STATS */}
          <div className={styles.cardsRow}>
            <div className={styles.smallCard}>
              <h2>{foodList.length}</h2>
              <p>Total Items</p>
            </div>

            <div className={styles.smallCard}>
              <h2>{AvailableItems.length}</h2>
              <p>Available</p>
            </div>

            <div className={styles.smallCard}>
              <h2>
                {restorent.totalOrders} {restorent.totalOrders > 100 && "+"}
              </h2>
              <p>Orders</p>
            </div>

            <div className={styles.smallCard}>
              <h2>⭐ {restorent.averageRating}</h2>
              <p>Avg Rating</p>
            </div>
          </div>

          {/* SECTION */}
          <div className={styles.sectionHeader}>
            <h2>🥗 {selectedCat}</h2>
            <span>{categeryFood.length} Item</span>
          </div>

          {/* FOOD CARDS */}
          <div className={styles.foodGrid}>
            {categeryFood?.map((food, index) => (
              <Link to={`/Item/${food.id}`} key={food.id}>
                <Food
                  key={index}
                  food={food}
                  page={"restorent"}
                  addToCart={() =>
                    addToCart(food.id, 1, restorent.id, () => {}, queryClient)
                  }
                />
              </Link>
            ))}
          </div>
        </>
      )}
      {section === "info" && (
        <>
          <div className={styles.container}>
            {/* ABOUT */}

            <section className={styles.section}>
              <h2 className={styles.heading}>About the Restaurant</h2>

              <div className={styles.infoGrid}>
                <div className={styles.infoCard}>
                  <span className={styles.icon}>🧁</span>
                  <p>Business Type</p>
                  <h4>{restorent.businessType}</h4>
                </div>

                <div className={styles.infoCard}>
                  <span className={styles.icon}>📅</span>
                  <p>Established</p>
                  <h4>
                    {restorent.yearOfEstablish} ({establishedYears} yrs)
                  </h4>
                </div>

                <div className={styles.infoCard}>
                  <span className={styles.icon}>👤</span>
                  <p>Owner</p>
                  <h4>{restorent.ownerName}</h4>
                </div>

                <div className={styles.infoCard}>
                  <span className={styles.icon}>🪪</span>
                  <p>Restaurant ID</p>
                  <h4>#{restorent.id}</h4>
                </div>

                <div className={styles.infoCard}>
                  <span className={styles.icon}>🏆</span>
                  <p>Hygiene Rating</p>
                  <h4>A+</h4>
                </div>

                <div className={styles.infoCard}>
                  <span className={styles.icon}>📦</span>
                  <p>Total Orders</p>
                  <h4>
                    {restorent.totalOrders} {restorent.totalOrders > 100 && "+"}
                  </h4>
                </div>
              </div>
            </section>

            {/* CONTACT */}

            <section className={styles.section}>
              <h2 className={styles.heading}>Contact Information</h2>

              <div className={styles.contactCard}>
                <span>📞</span>

                <div>
                  <p>Primary</p>
                  <h4>+91 {restorent.mobileNumber}</h4>
                </div>
              </div>

              <div className={styles.contactCard}>
                <span>📱</span>

                <div>
                  <p>Alternative</p>
                  <h4>+91 {restorent.alternativeMobNumber}</h4>
                </div>
              </div>

              <div className={styles.contactCard}>
                <span>✉️</span>

                <div>
                  <p>Email</p>
                  <h4>{restorent.email}</h4>
                </div>
              </div>
            </section>

            {/* LOCATION */}

            <section className={styles.section}>
              <h2 className={styles.heading}>Location & Address</h2>

              <div className={styles.locationCard}>
                <div className={styles.mapTop}>
                  <div className={styles.pin}>📍</div>
                </div>

                <div className={styles.locationContent}>
                  <h4>{restorent.address.addressLine1}</h4>
                  <p>{restorent.address.addressLine2}</p>
                  <p>Near: {restorent.address.landmark}</p>

                  <p>
                    {restorent.address.city}, {restorent.address.state}
                  </p>
                  <p>PinCode :{restorent.address.pincode}</p>
                </div>
              </div>
            </section>

            {/* PAYMENT */}

            <section className={styles.section}>
              <h2 className={styles.heading}>Payment Methods</h2>

              <div className={styles.paymentMethods}>
                <span>💳 UPI</span>
                <span>💵 Cash</span>
                <span>💳 Card</span>
                <span>👛 Wallets</span>
              </div>
            </section>
          </div>
        </>
      )}

      {section === "Retings" && <Ratings />}
    </div>
  );
}

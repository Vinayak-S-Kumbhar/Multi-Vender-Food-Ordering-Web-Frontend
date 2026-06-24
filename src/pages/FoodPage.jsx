import React, { useEffect, useState } from "react";
import styles from "./cssFolder/ItemPage.module.css";
import { FaStar, FaRegStar, FaLeaf } from "react-icons/fa";
import { PiPhoneCallFill } from "react-icons/pi";
import {
  MdLocationOn,
  MdStorefront,
  MdAccessTime,
  MdLocalOffer,
  MdVerified,
} from "react-icons/md";
import { FaStarHalfAlt } from "react-icons/fa";

import { HiOutlineShoppingBag } from "react-icons/hi";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import api from "../api/axiosInstance";
import toast from "react-hot-toast";
import Loading from "../components/Loading";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Food from "../components/Food";
import { FcRating } from "react-icons/fc";
import Ratings from "../components/Ratings";
import { addToCart } from "../utils/foodItemHelper";

const FetchRestorentAndFood = (foodId) => {
  return api.get(`/public/Restorent/Food/${foodId}`);
};

const FetcFoodRetings = (foodId) => {
  return api.get(`/public/Rating/food/${foodId}`);
};

const FoodPage = () => {
  const { foodId } = useParams();
  const [quantity, setQuantity] = useState(1);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [addingToCart, setAddingToCart] = useState(false);
  const userId = localStorage.getItem("userId");

  const location = useLocation();

  const stateRestorent = location.state?.restorent;

  const foodFromState = stateRestorent?.foodItemList?.find(
    (item) => item.id === Number(foodId),
  );

  const shouldFetch = !foodFromState;

  const {
    data: restorentData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["Restorent/Food", foodId],
    queryFn: () => FetchRestorentAndFood(foodId),
    enabled: shouldFetch,
    initialData: foodFromState ? { data: stateRestorent } : undefined,
    staleTime: Infinity,
  });

  const restorent = restorentData?.data;

  const { data, isLoading: retingsLoading } = useQuery({
    queryKey: ["/Rating/food/", foodId],
    queryFn: () => FetcFoodRetings(foodId),
    staleTime: Infinity,
    enabled: !!foodId,
  });
  const retingsData = data?.data || [];
  const ratingCounts = [
    retingsData.fiveStar,
    retingsData.fourStar,
    retingsData.threeStar,
    retingsData.twoStar,
    retingsData.oneStar,
  ];

  useEffect(() => {
    if (isError) {
      const ermsg =
        error.response?.data?.message || error.response?.data || error.message;

      toast.error(ermsg || "Something went wrong");
      navigate("/");
    }
  }, [isError, error, navigate]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [foodId]);

  const food = restorent?.foodItemList?.find(
    (item) => item.id === Number(foodId),
  );
  const rating = food?.averageRating || 0;

  if (isLoading) return <Loading />;
  if (!food) return <h2 className={styles.notFound}>Food item not found</h2>;

  const categories = restorent?.productCategerys
    ? restorent.productCategerys.split(",")
    : [];

  const establishedYears = restorent?.yearOfEstablish
    ? new Date().getFullYear() - restorent.yearOfEstablish
    : null;

  return (
    <div className={styles.pageWrapper}>
      {/* ─── HERO BANNER ─── */}
      <div className={styles.heroBanner}>
        <div className={styles.heroImageWrap}>
          <img
            src={food.imageUrl}
            alt={food.foodname}
            className={styles.heroImage}
          />
          <div className={styles.heroOverlay} />
        </div>

        <div className={styles.heroContent}>
          <span className={styles.categoryPill}>{food.foodCategery}</span>
          <h1 className={styles.heroTitle}>{food.foodname}</h1>

          <div className={styles.heroMeta}>
            <div className={styles.rating}>
              {[...Array(5)].map((_, index) => {
                if (index + 1 <= rating) {
                  return (
                    <FaStar
                      key={index}
                      size={14}
                      className={styles.filledStar}
                    />
                  );
                }

                if (index < rating) {
                  return (
                    <FaStarHalfAlt
                      key={index}
                      size={14}
                      className={styles.filledStar}
                    />
                  );
                }

                return (
                  <FaRegStar
                    key={index}
                    size={14}
                    className={styles.emptyStar}
                  />
                );
              })}
            </div>
            <p className={styles.ratingText}>{rating}</p>

            <div className={styles.heroBadges}>
              <span className={styles.badge}>
                <MdAccessTime /> 30-40 mins
              </span>
              <span className={styles.badge}>🚚 Free Delivery</span>
              <span className={styles.badge}>
                <FaLeaf /> Fresh
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── MAIN CONTENT ─── */}
      <div className={styles.mainGrid}>
        {/* LEFT — ORDER CARD */}
        <div className={styles.orderCard}>
          <div className={styles.orderCardTop}>
            <div className={styles.priceRow}>
              <span className={styles.currentPrice}>₹{food.price}</span>
              <span className={styles.offerBadge}>
                <MdLocalOffer /> Best Price
              </span>
            </div>
            <p className={styles.foodDesc}>{food.description}</p>
          </div>

          <div className={styles.divider} />

          {/* QUANTITY */}
          <div className={styles.qtySection}>
            <span className={styles.qtyLabel}>Quantity</span>
            <div className={styles.qtyControl}>
              <button
                className={styles.qtyBtn}
                onClick={() => quantity > 1 && setQuantity((p) => p - 1)}
              >
                −
              </button>
              <span className={styles.qtyNum}>{quantity}</span>
              <button
                className={styles.qtyBtn}
                onClick={() => setQuantity((p) => p + 1)}
              >
                +
              </button>
            </div>
          </div>

          {/* TOTAL */}
          <div className={styles.totalRow}>
            <span>Total</span>
            <span className={styles.totalAmt}>
              ₹{(food.price * quantity).toFixed(2)}
            </span>
          </div>

          {/* CTA */}
          <button
            className={`${styles.cartBtn} ${addingToCart ? styles.loading : ""}`}
            onClick={() =>
              addToCart(
                food.id,
                quantity,
                restorent.id,
                setAddingToCart,
                queryClient,
              )
            }
            disabled={addingToCart}
          >
            <HiOutlineShoppingBag className={styles.cartIcon} />
            {addingToCart ? "Adding…" : "Add to Cart"}
          </button>

          {/* DELIVERY PERKS */}
          <div className={styles.perksRow}>
            <div className={styles.perk}>
              <span className={styles.perkIcon}>🚚</span>
              <span>Free Delivery</span>
            </div>
            <div className={styles.perk}>
              <span className={styles.perkIcon}>🔒</span>
              <span>Secure Pay</span>
            </div>
            <div className={styles.perk}>
              <span className={styles.perkIcon}>↩️</span>
              <span>Easy Refund</span>
            </div>
          </div>
        </div>

        {/* RIGHT — RESTAURANT INFO */}
        <div className={styles.restaurantCard}>
          <div className={styles.restaurantHeader}>
            <div className={styles.restaurantIconWrap}>
              <MdStorefront className={styles.restaurantIcon} />
            </div>
            <div>
              <p className={styles.restaurantLabel}>Served by</p>
              <h2 className={styles.restaurantName}>
                {restorent?.restorentName}
                <MdVerified className={styles.verifiedIcon} />
              </h2>
            </div>
          </div>

          {/* CATEGORY TAGS */}
          <div className={styles.tagRow}>
            {categories.map((cat) => (
              <span key={cat} className={styles.tag}>
                {cat.trim()}
              </span>
            ))}
            <span className={styles.tagOutline}>{restorent?.businessType}</span>
          </div>

          <div className={styles.infoGrid}>
            {establishedYears !== null && (
              <div className={styles.infoItem}>
                <span className={styles.infoIconText}>🏅</span>
                <div>
                  <p className={styles.infoLabel}>Experience</p>
                  <p className={styles.infoValue}>
                    {establishedYears}+ years since {restorent.yearOfEstablish}
                  </p>
                </div>
              </div>
            )}

            <div className={styles.infoItem}>
              <span className={styles.infoIconText}>👤</span>
              <div>
                <p className={styles.infoLabel}>Owner</p>
                <p className={styles.infoValue}>{restorent?.ownerName}</p>
              </div>
            </div>
          </div>

          <Link to={`/restorent/${restorent.id}`} className={styles.visitBtn}>
            Visit Restaurant Page →
          </Link>
        </div>
      </div>

      {/* Ratings */}
      {retingsLoading ? (
        <div style={{ marginTop: "60px", marginBottom: "80px" }}>
          <Loading />
        </div>
      ) : (
        <div className={styles.ratingsSection}>
          <div className={styles.ratingsHeader}>
            <FcRating size={28} />
            <h2>Customer Reviews</h2>
          </div>

          <div className={styles.ratingSummary}>
            <div className={styles.ratingOverview}>
              <h1>{retingsData.averageRatings.toFixed(1)}</h1>

              <div className={styles.ratingStars}>
                {[...Array(5)].map((_, index) => {
                  if (retingsData.averageRatings >= index + 1) {
                    return <FaStar key={index} />;
                  }

                  if (retingsData.averageRatings >= index + 0.5) {
                    return <FaStarHalfAlt key={index} />;
                  }

                  return <FaRegStar key={index} />;
                })}
              </div>

              <p>{retingsData.totalRatings} Reviews</p>
            </div>

            <div className={styles.ratingBreakdown}>
              {ratingCounts.map((star, index) => (
                <div key={index} className={styles.breakdownRow}>
                  <span>{5 - index} ★</span>

                  <div className={styles.bar}>
                    <div
                      className={styles.fill}
                      style={{
                        width: retingsData.totalRatings
                          ? `${(star / retingsData.totalRatings) * 100}%`
                          : "0%",
                      }}
                    />
                  </div>

                  <span>{star}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.reviewList}>
            {retingsData.ratingsList.length === 0 ? (
              <p>No reviews yet.</p>
            ) : (
              retingsData.ratingsList.map((review) => (
                <div key={review.ratingId} className={styles.reviewCard}>
                  <div className={styles.reviewTop}>
                    <div>
                      <h4>{review.name}</h4>

                      <span className={styles.reviewDate}>
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className={styles.reviewStars}>
                      {[...Array(Math.round(review.ratings))].map((_, i) => (
                        <FaStar key={i} />
                      ))}
                    </div>
                  </div>

                  <p>{review.review}</p>
                </div>
              ))
            )}
          </div>
          <Link className={styles.ReadMoreBtn} to={`/food/retings/${foodId}`}>
            Read More
          </Link>
        </div>
      )}

      {/* ─── FOOD LIST ─── */}
      <div className={styles.foodListSection}>
        <div className={styles.foodListHeader}>
          <h3 className={styles.foodListTitle}>
            More from {restorent?.restorentName}
          </h3>
          <span className={styles.foodListCount}>
            {restorent?.foodItemList?.length} items
          </span>
        </div>

        <div className={styles.foodGrid}>
          {" "}
          {restorent?.foodItemList?.map((food) => (
            <Link
              to={`/Item/${food.id}`}
              key={food.id}
              className={styles.foodLink}
              onClick={() => setQuantity(1)}
              state={{ restorent }}
            >
              <Food
                food={food}
                venderName={restorent?.restorentName}
                page={"foodPage"}
                addToCart={() =>
                  addToCart(
                    food.id,
                    1,
                    restorent.id,
                    setAddingToCart,
                    queryClient,
                  )
                }
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FoodPage;

import React from "react";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import { FcRating } from "react-icons/fc";
import { useInfiniteQuery } from "@tanstack/react-query";

import styles from "./cssFolder/Ratings.module.css";
import Loading from "./Loading";
import api from "../api/axiosInstance";
import { useParams } from "react-router-dom";

const FetchFoodRatings = (foodId, pageParam = 0) => {
  return api.get(`/public/Rating/food/${foodId}?page=${pageParam}&size=5`);
};

const FetchRestorentRatings = (restorentId, pageParam = 0) => {
  return api.get(
    `/public/Rating/restorent/${restorentId}?page=${pageParam}&size=5`,
  );
};

const Ratings = () => {
  const { foodId, restorentId } = useParams();
  const isValid = Boolean(foodId) !== Boolean(restorentId);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: foodId
        ? ["ratings", "food", foodId]
        : ["ratings", "restorent", restorentId],

      queryFn: ({ pageParam }) =>
        foodId
          ? FetchFoodRatings(foodId, pageParam)
          : FetchRestorentRatings(restorentId, pageParam),

      initialPageParam: 0,

      getNextPageParam: (lastPage) => {
        return lastPage.data.last ? undefined : lastPage.data.page + 1;
      },

      enabled: isValid,
      staleTime: Infinity,
    });

  if (!isValid) {
    return null;
  }

  if (isLoading) {
    return (
      <div style={{ marginTop: "60px", marginBottom: "80px" }}>
        <Loading />
      </div>
    );
  }

  // First page contains summary info
  const firstPage = data?.pages?.[0]?.data;

  const averageRatings = Number(firstPage?.averageRatings || 0);
  const totalRatings = Number(firstPage?.totalRatings || 0);

  const ratingCounts = [
    firstPage.fiveStar,
    firstPage.fourStar,
    firstPage.threeStar,
    firstPage.twoStar,
    firstPage.oneStar,
  ];

  // Merge reviews from all loaded pages
  const ratingsList =
    data?.pages?.flatMap((page) => page?.data?.ratingsList || []) || [];

  return (
    <div className={styles.ratingsSection}>
      <div className={styles.ratingsHeader}>
        <FcRating size={28} />
        <h2>Customer Reviews</h2>
      </div>

      <div className={styles.ratingSummary}>
        <div className={styles.ratingOverview}>
          <h1>{averageRatings.toFixed(1)}</h1>

          <div className={styles.ratingStars}>
            {[...Array(5)].map((_, index) => {
              if (averageRatings >= index + 1) {
                return <FaStar key={index} />;
              }

              if (averageRatings >= index + 0.5) {
                return <FaStarHalfAlt key={index} />;
              }

              return <FaRegStar key={index} />;
            })}
          </div>

          <p>{totalRatings} Reviews</p>
        </div>

        <div className={styles.ratingBreakdown}>
          {ratingCounts.map((star, index) => (
            <div key={index} className={styles.breakdownRow}>
              <span>{5 - index} ★</span>

              <div className={styles.bar}>
                <div
                  className={styles.fill}
                  style={{
                    width: totalRatings
                      ? `${(star / totalRatings) * 100}%`
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
        {ratingsList.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          ratingsList.map((review) => (
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

        {hasNextPage && (
          <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
            {isFetchingNextPage ? "Loading..." : "Read More"}
          </button>
        )}
      </div>
    </div>
  );
};

export default Ratings;

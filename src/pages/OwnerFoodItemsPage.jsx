import styles from "./cssFolder/OwnerFoodItemsPage.module.css";
import OwnerSidebar from "../components/OwnerSidebar";

import { FiSearch, FiBell, FiMoreVertical, FiEdit } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";
import { useInView } from "react-intersection-observer";
import api from "../api/axiosInstance";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import Loading from "../components/Loading";
import { Link } from "react-router-dom";
import Food from "../components/Food";

const FetchFoodItemsList = ({ pageParam = 0 }) => {
  return api.get(`/Owner/foodItem/list?page=${pageParam}&size=10`);
};

export default function OwnerFoodItemsPage() {
  const { ref, inView } = useInView();

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["FoodItem/list"],
    queryFn: FetchFoodItemsList,
    staleTime: 1000 * 60 * 2,
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.data.length < 10) {
        return undefined;
      }
      return allPages.length;
    },
  });

  const foodData = data?.pages?.flatMap((data) => data.data) || [];

  if (isError) toast.error(error.message);

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

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

      <div className={styles.mainContent}>
        <div className={styles.header}>
          <div>
            <h1>Food Items Management</h1>
            <p>Manage all food items across vendors</p>
          </div>

          <div className={styles.headerRight}>
            <div className={styles.searchBox}>
              <FiSearch />
              <input placeholder="Search..." />
            </div>

            <div className={styles.notification}>
              <FiBell />
              <span>5</span>
            </div>

            <img
              src="https://i.pravatar.cc/150?img=12"
              alt=""
              className={styles.avatar}
            />
          </div>
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <p>Total Food Items</p>
            <h2>1,863</h2>
          </div>

          <div className={styles.statCard}>
            <p>Available</p>
            <h2 className={styles.green}>1,725</h2>
          </div>

          <div className={styles.statCard}>
            <p>Out Of Stock</p>
            <h2 className={styles.orange}>138</h2>
          </div>
        </div>

        <div className={styles.searchSection}>
          <div className={styles.bigSearch}>
            <FiSearch />
            <input placeholder="Search food items..." />
          </div>

          <button className={styles.addBtn}>+ Add Food Item</button>
        </div>

        <div>
          {foodData.map((food) => {
            return (
              <Link to={`/Item/${food.foodItem.id}`} key={food.foodItem.id}>
                <Food
                  food={food.foodItem}
                  venderName={food.venderName}
                  page={"Owner"}
                />
              </Link>
            );
          })}
          <div ref={ref}>
            {isFetchingNextPage && (
              <div style={{ marginTop: "10px", marginBottom: "10px" }}>
                <Loading />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

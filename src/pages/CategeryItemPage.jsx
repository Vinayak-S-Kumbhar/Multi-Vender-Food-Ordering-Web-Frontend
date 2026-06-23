import { Link, useParams } from "react-router-dom";
import style from "./cssFolder/CategeryItemPage.module.css";
import Item from "../components/Food.jsx";
import { useContext, useEffect, useState } from "react";
import api from "../api/axiosInstance.js";
import toast from "react-hot-toast";
import Loading from "../components/Loading.jsx";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import Food from "../components/Food.jsx";
import { useInView } from "react-intersection-observer";

const FetchFoodItemsByCategery = ({ pageParam = 0, queryKey }) => {
  const [, FoodCategery] = queryKey;

  return api.get(
    `/public/FoodItem/list/categery/${FoodCategery}?page=${pageParam}&size=8`,
  );
};

const CategeryItemPage = () => {
  const { category } = useParams();
  const FoodCategery = category.split(" ").join("");

  const { ref, inView } = useInView();

  const { data, isLoading, isError, error, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["/FoodItem/list/categery", FoodCategery],
      queryFn: FetchFoodItemsByCategery,
      staleTime: 1000 * 60 * 15,
      initialPageParam: 0,
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage.data.length < 8) {
          return undefined;
        }
        return allPages.length;
      },
    });

  const foodData = data?.pages?.flatMap((page) => page.data) || [];

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  if (isError) toast.error(error.message);

  return (
    <>
      <center className={style.heading}>{category} Delivery</center>
      {isLoading && <Loading />}

      <div className={style.foodGrid}>
        {" "}
        {foodData.map((food) => {
          return (
            <Link to={`/Item/${food.id}`} key={food.id}>
              <Food food={food} />
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
    </>
  );
};

export default CategeryItemPage;

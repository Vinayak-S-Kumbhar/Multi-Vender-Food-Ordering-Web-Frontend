import Hero from "../components/Hero";
import { assets } from "../assets/assets";
import { categerys } from "../assets/assets";
import style from "./cssFolder/Home.module.css";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import api from "../api/axiosInstance";
import Loading from "../components/Loading";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Food from "../components/Food";
import { useInView } from "react-intersection-observer";

const FetchFoodItemsList = ({ pageParam = 0 }) => {
  return api.get(`/public/FoodItem/list?page=${pageParam}&size=8`);
};

const Home = () => {
  const navigate = useNavigate();

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
    staleTime: 1000 * 60 * 15,
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.data.length < 8) {
        return undefined;
      }
      return allPages.length;
    },
  });

  const foodData = data?.pages?.flatMap((data) => data.data) || [];

  if (isError) toast.error(error.message);

  const scrollRef = useRef(null);
  const scrollLeft = () => {
    scrollRef.current.scrollBy({
      left: -300,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({
      left: 300,
      behavior: "smooth",
    });
  };

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
    <>
      <div className={style.home}>
        <Hero />

        {/* Categery section */}
        <div className={style.wrapper}>
          <button
            className={`${style.arrow} ${style.left}`}
            onClick={scrollLeft}
          >
            ❮
          </button>

          <div className={style.categerySection} ref={scrollRef}>
            {categerys.map((categery, index) => {
              const name = categery.split(" ").join("");
              return (
                <center
                  className={style.box}
                  key={index}
                  onClick={() => navigate(`/category/${categery}`)}
                >
                  <img className={style.image} src={assets[name]} alt="..." />
                  <p>{categery}</p>
                </center>
              );
            })}
          </div>
          <button
            className={`${style.arrow} ${style.right}`}
            onClick={scrollRight}
          >
            ❯
          </button>
        </div>

        {/* Food Items section */}

        <div className={style.foodGrid}>
          {foodData.map((food) => {
            return (
              <Link to={`/Item/${food.foodItem.id}`} key={food.foodItem.id}>
                <Food
                  food={food.foodItem}
                  venderName={food.venderName}
                  page={"Home"}
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
    </>
  );
};

export default Home;

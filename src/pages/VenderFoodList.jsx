import VenderSidebar from "../components/VenderSidebar";
import style from "./cssFolder/ListItems.module.css";
import api from "../api/axiosInstance";
import Loading from "../components/Loading";
import toast from "react-hot-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Food from "../components/Food";
import ConfirmModal from "../components/ConfirmModal";
import { useState } from "react";
import { FaUtensils } from "react-icons/fa";

const FetchHotelFoodList = (hotelId) => {
  return api.get(`/FoodItem/list/Hotel/${hotelId}`);
};

const VenderFoodList = () => {
  const hotelId = localStorage.getItem("hotelId");

  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["FoodItem/list/Hotel/", hotelId],
    queryFn: () => FetchHotelFoodList(hotelId),
    staleTime: Infinity,
    enabled: !!hotelId,
  });

  const foodItems = data?.data || [];

  return (
    <div className={style.adminContainer}>
      <VenderSidebar />

      <main className={style.content}>
        <h2 className={style.foodList}>Food Items</h2>

        {isLoading ? (
          <Loading />
        ) : (
          <div className={style.foodGrid}>
            {foodItems.length <= 0 ? (
              <div className={style.empty}>
                <FaUtensils className={style.icon} />
                <h2>No Food Items</h2>
                <p>Add your favorite dishes to get started.</p>
              </div>
            ) : (
              foodItems.map((item) => (
                <div key={item.id}>
                  <Food food={item} venderName={"VenderNmae"} page={"vender"} />
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default VenderFoodList;

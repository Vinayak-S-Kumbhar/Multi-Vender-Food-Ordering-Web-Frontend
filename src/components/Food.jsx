import styles from "./cssFolder/Item.module.css";
import { FaStar, FaRegStar, FaPlus } from "react-icons/fa";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";
import { useContext, useState } from "react";
import api from "../api/axiosInstance";
import toast from "react-hot-toast";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { FaStarHalfAlt } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";
import ConfirmModal from "./ConfirmModal";

const Food = ({ food, venderName, page, addToCart }) => {
  const [confermDelete, setConfermDelete] = useState(false); //conferm delete food item
  const [availebal, setAvailebal] = useState();
  if (!food) {
    return;
  }

  const rating = food.averageRating || 0;

  const queryClient = useQueryClient();
  const hotelId = localStorage.getItem("hotelId");

  const handelAvailable = () => {
    api
      .patch(`/FoodItem/isAvailable/${food.id}`)
      .then((res) => {
        if (res.data) {
          toast.success("Food item enabled");
        } else {
          toast.success("Food item disabled");
        }
        queryClient.invalidateQueries({
          queryKey: ["FoodItem/list/Hotel/", hotelId],
        });

        queryClient.invalidateQueries({
          queryKey: ["/Restorent/", hotelId],
        });
        queryClient.invalidateQueries({
          queryKey: ["FoodItem/list"],
        });

        queryClient.invalidateQueries({
          queryKey: ["/FoodItem/list/categery", food.foodCategery],
          refetchType: "all",
        });
      })
      .catch((err) => {
        toast.error(
          err.response?.data?.message ||
            err.response?.data ||
            "Failed to update availability",
        );
      });
  };
  const handelDelete = (id, foodCategery) => {
    api
      .delete(`/FoodItem/${id}`)
      .then((res) => {
        queryClient.invalidateQueries({
          queryKey: ["FoodItem/list/Hotel/", hotelId],
        });
        queryClient.invalidateQueries({
          queryKey: ["/Restorent/", hotelId],
        });
        queryClient.invalidateQueries({
          queryKey: ["FoodItem/list"],
        });

        queryClient.invalidateQueries({
          queryKey: ["/FoodItem/list/categery", foodCategery],
        });

        toast.success("Food Item Deleted Successfully");
      })
      .catch((err) => {
        const msg =
          error.response?.data?.message ||
          error.response?.data ||
          error.message;
        toast.error(msg);
      })
      .finally(() => {
        setConfermDelete(false);
      });
  };

  return (
    <>
      <div className={styles.card}>
        <div
          className={`${styles.imageContainer} ${!food.available ? styles.unavailable : ""} `}
        >
          <img
            src={food.imageUrl}
            alt="Peri Peri Rolls"
            className={styles.image}
          />

          {page === "restorent" && (
            <span
              className={`${styles.badge} ${
                food.available ? styles.available : styles.outOfStock
              }`}
            >
              {food.available ? "Available" : "Unavailable"}
            </span>
          )}
        </div>

        <div className={styles.content}>
          <div className={styles.header}>
            <h2
              className={`${!food.available ? styles.unavailableTitle : styles.title}`}
            >
              {food.foodname}
            </h2>

            <div className={styles.rating}>
              <span className={styles.ratingText}>
                <FaStar color="orange" />
                {rating}
              </span>
            </div>
          </div>

          <p className={styles.description}>{food.description}</p>

          <div className={styles.infoRow}>
            <div>
              <strong>₹{food.price}</strong>
              <span>Price</span>
            </div>
            {!["vender", "restorent"].includes(page) && (
              <div>
                <strong>{venderName}</strong>
                <span>Vendor</span>
              </div>
            )}
            {(page === "vender" || page === "Owner") && (
              <div className={styles.Switchcontainer}>
                <span className={styles.label}>
                  {food.available ? "Available" : "Unavailable"}
                </span>

                <label className={styles.switch}>
                  <input
                    type="checkbox"
                    checked={food.available}
                    onChange={() => handelAvailable()}
                  />
                  <span className={styles.slider}></span>
                </label>
              </div>
            )}
          </div>

          {(page === "foodPage" || page === "restorent") && (
            <button
              className={styles.addToCart}
              onClick={(e) => {
                e.preventDefault();
                addToCart(food.id, 1);
              }}
            >
              🛒 Add to Cart
            </button>
          )}

          {(page === "vender" || page === "Owner") && (
            <div className={styles.dropdown}>
              <button>
                <FiEdit />
                Edit
              </button>

              <button
                className={styles.deleteBtn}
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  setConfermDelete(true);
                }}
              >
                <MdDeleteOutline />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
      <ConfirmModal
        isOpen={confermDelete}
        title="Delete Food Item"
        message="Are you sure you want to Delete Food Item Permenentely"
        confirmText="Delete Food"
        cancelText="Cancel"
        onConfirm={() => handelDelete(food.id, food.foodCategery)}
        onCancel={() => setConfermDelete(false)}
      />
    </>
  );
};

export default Food;

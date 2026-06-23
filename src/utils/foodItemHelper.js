import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "../api/axiosInstance";

export const addToCart = async (
  foodId,
  quantity,
  restorentId,
  setAddingToCart,
  queryClient,
) => {
  const userId = localStorage.getItem("userId");

  if (!userId) {
    toast.error("Please login First");
    return;
  }
  setAddingToCart(true);
  try {
    const res = await api.post("/cart/add", {
      userId,
      foodId: foodId,
      quantity: quantity,
      restorentId: restorentId,
    });
    toast.success(res.data);
    queryClient.invalidateQueries({ queryKey: ["cart/list/", userId] });
    queryClient.invalidateQueries({ queryKey: ["userInfo/", userId] });
  } catch (err) {
    const ermsg =
      err.response?.data?.message || err.response?.data || err.message;

    toast.error(ermsg || "Something went wrong");
  } finally {
    setAddingToCart(false);
  }
};

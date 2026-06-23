import toast from "react-hot-toast";
import api from "../api/axiosInstance";

export const UpdateStatus = async (
  orderId,
  status,
  userId,
  queryClient,
  refetch,
  setConferm,
) => {
  if (status === null) {
    setConferm(null);
    toast.error("Order is DELIVERED! we can't Change it");
    return;
  }
  try {
    const res = await api.patch(`/order/${orderId}/status?status=${status}`);

    toast.success(res.data || "Status Updated Successfully");
    await queryClient.invalidateQueries({
      queryKey: ["user-orders", String(userId)],
    });
    await queryClient.invalidateQueries({
      queryKey: ["owner", "Order", String(orderId)],
    });
    await refetch();
  } catch (err) {
    toast.error(
      err.response?.data?.message ||
        err.response?.data ||
        "Failed to update Status",
    );
  } finally {
    setConferm(null) ||
      setConferm({
        type: null,
        orderId: null,
      });
  }
};

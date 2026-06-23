import toast from "react-hot-toast";
import api from "../api/axiosInstance";

export const UpdateRestorentStatus = (
  restorentId,
  status,
  queryClient,
  setLoading,
) => {
  setLoading(true);
  api
    .patch(`/Restorent/status/${restorentId}/status?status=${status}`)
    .then((res) => {
      toast.success(res.data || "Status updated Successfully");
      queryClient.invalidateQueries({
        queryKey: ["/Restorent/", String(restorentId)],
      });
      queryClient.invalidateQueries({ queryKey: ["owner", "Restorent/all"] });

      queryClient.invalidateQueries({
        queryKey: ["owner", "Restorent/", String(restorentId)],
      });
    })
    .catch((err) => {
      const ermsg =
        err.response?.data?.message || err.response?.data || err.message;

      toast.error(ermsg || "Something went Wrong");
    })
    .finally(() => setLoading(false));
};

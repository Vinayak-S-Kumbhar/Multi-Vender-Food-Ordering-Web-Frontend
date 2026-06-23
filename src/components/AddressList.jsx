import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../api/axiosInstance";
import styles from "./cssFolder/AddressList.module.css";
import {
  FiHome,
  FiBriefcase,
  FiEdit2,
  FiTrash2,
  FiPhone,
  FiMapPin,
  FiClock,
} from "react-icons/fi";
import { FaHotel } from "react-icons/fa";
import Loading from "./Loading";
import toast from "react-hot-toast";

const FetchAddresses = async (userId) => {
  const response = await api.get(`/address/user/${userId}`);
  return response.data;
};

export default function AddressList({ setEdditingAdress }) {
  const userId = localStorage.getItem("userId");

  const {
    data: addresses = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["addresses", userId],
    queryFn: () => FetchAddresses(userId),
    staleTime: Infinity,
    enabled: !!userId,
  });

  // if (isError) {
  // }

  const queryClient = useQueryClient();
  const deleteAdress = (addressId) => {
    api
      .delete(`/address/delete/${addressId}`)
      .then(() => {
        toast.success("address Deleted Successfully");
        queryClient.invalidateQueries({
          queryKey: ["addresses", userId],
        });
      })
      .catch((error) => {
        toast.error(error?.data?.massage || "Something went wronge");
      });
  };

  if (isLoading) {
    return (
      <div style={{ marginTop: "60px", marginBottom: "80px" }}>
        <Loading />
      </div>
    );
  }

  const handleSetDefault = (adressId) => {
    api
      .patch(`/address/update/isDefault/${adressId}`)
      .then((res) => {
        toast.success(res.data || "Set as Default");
        queryClient.invalidateQueries({
          queryKey: ["addresses", userId],
        });
      })
      .catch((err) => {
        toast.error(err.data || "Something Went Wrong");
      });
  };

  const getAddressIcon = (type) => {
    switch (type) {
      case "Home":
        return <FiHome size={16} />;
      case "Work":
        return <FiBriefcase size={16} />;
      case "Hotel":
        return <FaHotel size={16} />;
      default:
        return <FiClock size={16} />;
    }
  };

  return (
    <div className={styles.addressContainer}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <FiMapPin size={20} />
          <h3>Saved Addresses</h3>
        </div>

        <div className={styles.countBadge}>{addresses?.length || 0}</div>
      </div>

      <div className={styles.addressList}>
        {addresses?.map((address) => (
          <div
            key={address.id}
            className={`${styles.addressCard} ${
              address.isDefault ? styles.defaultCard : ""
            }`}
          >
            {address.isDefault && (
              <div className={styles.defaultBadge}>✓ DEFAULT</div>
            )}

            <div className={styles.cardTop}>
              <div className={styles.addressType}>
                {getAddressIcon(address.addressType)}

                <span>{address.addressType}</span>
              </div>

              <div className={styles.actionButtons}>
                <button
                  type="button"
                  className={styles.iconButton}
                  onClick={() => setEdditingAdress(address)}
                >
                  <FiEdit2 size={16} />
                </button>

                <button
                  type="button"
                  className={styles.iconButton}
                  onClick={() => deleteAdress(address.id)}
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>

            <div className={styles.addressDetails}>
              <h4>{address.fullName}</h4>

              <p>{address.addressLine1}</p>

              {address.addressLine2 && <p>{address.addressLine2}</p>}

              {address.landmark && <p>Landmark: {address.landmark}</p>}

              <p>
                {address.city}, {address.state}
              </p>

              <p>Pincode: {address.pincode}</p>

              <div className={styles.phoneRow}>
                <FiPhone size={14} />
                <span>{address.phone}</span>
              </div>
            </div>

            {!address.isDefault && (
              <button
                className={styles.defaultButton}
                type="button"
                onClick={() => handleSetDefault(address.id)}
              >
                Set as Default
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

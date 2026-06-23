import styles from "./cssFolder/AddressForm.module.css";
import { FiPlus, FiMapPin, FiHome, FiBriefcase, FiClock } from "react-icons/fi";
import { FaHotel } from "react-icons/fa";
import { useEffect, useState } from "react";
import { states } from "../assets/assets";
import toast from "react-hot-toast";
import api from "../api/axiosInstance";
import { useQueryClient } from "@tanstack/react-query";

export default function AddressForm({ editingAddress, setEdditingAdress }) {
  const [isOpen, setOpen] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const userId = localStorage.getItem("userId");

  const initialFormData = {
    addressType: "Home",
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
    isDefault: false,
    latitude: null,
    longitude: null,
    userId: userId,
  };

  useEffect(() => {
    if (editingAddress) {
      setOpen(true);

      setFormData(editingAddress);
      window.scrollTo({ button: 0, behavior: "smooth" });
    }
  }, [editingAddress]);

  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCurrentLocation = async () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
          );

          const data = await response.json();
          const address = data.address || {};
          setFormData((prev) => ({
            ...prev,
            latitude,
            longitude,

            addressLine1:
              data.display_name?.split(",").slice(0, 2).join(", ") || "",

            city:
              address.city ||
              address.town ||
              address.village ||
              address.county ||
              "",

            state: address.state || "",
            pincode: address.postcode || "",
          }));

          toast.success("Location fetched successfully");
        } catch (error) {
          console.error(error);
          toast.error("Unable to fetch address details");
        } finally {
          setLocationLoading(false);
        }
      },
      (err) => {
        setLocError(
          err.code === 1
            ? "Location permission denied. Please allow access."
            : "Unable to fetch location. Try again.",
        );
        setLocationLoading(false);
      },
    );
  };

  const getCoordinatesFromAddress = async () => {
    try {
      const query = encodeURIComponent(
        `${formData.city}, ${formData.pincode}, India`,
      );

      console.log("query is : " + query);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${query}&limit=1`,
      );

      const data = await response.json();

      console.log("responce data " + data);

      if (!data.length) {
        throw new Error("Location not found");
      }

      return {
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon),
      };
    } catch (error) {
      console.error(error);
      toast.error("Unable to find location coordinates");
      return null;
    }
  };

  const queryClient = useQueryClient();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);

    try {
      let finalData = { ...formData };

      if (!finalData.latitude || !finalData.longitude) {
        const coordinates = await getCoordinatesFromAddress();

        if (!coordinates) {
          toast.error("Unable to find location coordinates");
          return;
        }

        finalData = {
          ...finalData,
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
        };
      }
      console.log(finalData);
      if (editingAddress) {
        try {
          const { data } = await api.put(
            `/address/update/${editingAddress.id}`,
            finalData,
          );
          toast.success(data.message || "Address Updated successfully!");
        } catch (err) {
          toast.error(err.response?.data?.message || "Something Went Wrong");
        }
      } else {
        try {
          const { data } = await api.post("/address/add", finalData);
          toast.success(data.message || "Address saved successfully!");
        } catch (err) {
          toast.error(err.response?.data?.message || "Something Went Wrong");
        }
      }

      queryClient.invalidateQueries({
        queryKey: ["addresses", userId],
      });
      setSubmitLoading(false);
      console.log(finalData);
      setFormData(initialFormData);
      setOpen(false);
    } catch (error) {
      console.error(error);

      toast.error(error.response?.data?.message || "Failed to save address");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData(initialFormData);
    setOpen(false);
    setEdditingAdress(null);
  };

  return (
    <div className={styles.formContainer}>
      {!isOpen ? (
        <button
          className={styles.addAddressButton}
          onClick={() => setOpen(true)}
        >
          <FiPlus size={28} />
          <span>Add New Address</span>
        </button>
      ) : (
        <div>
          <div className={styles.header}>
            <FiPlus />
            <span>Add New Address</span>
          </div>

          <button
            type="button"
            className={styles.locationButton}
            onClick={handleCurrentLocation}
            disabled={locationLoading}
          >
            <FiMapPin />

            {locationLoading
              ? "Fetching your location..."
              : "Use my current location"}
          </button>

          <div className={styles.divider}>
            <span>or fill in manually</span>
          </div>

          <form className={styles.form} onSubmit={(e) => handleSubmit(e)}>
            <label className={styles.label}>Address Type</label>

            <div className={styles.addressTypes}>
              {["Home", "Work", "Hotel", "Other"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      addressType: type,
                    }))
                  }
                  className={`${styles.typeButton} ${
                    formData.addressType === type ? styles.activeType : ""
                  }`}
                >
                  {type === "Home" && <FiHome />}
                  {type === "Work" && <FiBriefcase />}
                  {type === "Hotel" && <FaHotel />}
                  {type === "Other" && <FiClock />}
                  {type}
                </button>
              ))}
            </div>

            <div className={styles.twoColumn}>
              <div>
                <label className={styles.label}>
                  Full Name <span>*</span>
                </label>

                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Ravi Sharma"
                  className={styles.input}
                  required
                />
              </div>

              <div>
                <label className={styles.label}>
                  Phone Number <span>*</span>
                </label>

                <div className={styles.phoneWrapper}>
                  <div className={styles.countryCode}>+91</div>

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");

                      setFormData((prev) => ({
                        ...prev,
                        phone: value,
                      }));
                    }}
                    placeholder="10-digit mobile number"
                    className={styles.phoneInput}
                    maxLength={10}
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className={styles.label}>
                Address Line 1 <span>*</span>
              </label>

              <input
                type="text"
                name="addressLine1"
                value={formData.addressLine1}
                onChange={handleChange}
                placeholder="House/Flat no, Building, Street"
                className={styles.input}
                required
              />
            </div>

            <div>
              <label className={styles.label}>
                Address Line 2<span className={styles.optional}>Optional</span>
              </label>

              <input
                type="text"
                name="addressLine2"
                value={formData.addressLine2}
                onChange={handleChange}
                placeholder="Area, Colony, Sector"
                className={styles.input}
              />
            </div>

            <div>
              <label className={styles.label}>
                Landmark
                <span className={styles.optional}>Optional</span>
              </label>

              <input
                type="text"
                name="landmark"
                value={formData.landmark}
                onChange={handleChange}
                placeholder="e.g. Near Apollo Hospital"
                className={styles.input}
              />
            </div>

            <div className={styles.twoColumn}>
              <div>
                <label className={styles.label}>
                  City <span>*</span>
                </label>

                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g. Nagpur"
                  className={styles.input}
                  required
                />
              </div>

              <div>
                <label className={styles.label}>
                  State <span>*</span>
                </label>

                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className={styles.input}
                  required
                >
                  <option value="">Select State</option>

                  {states.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.pincodeSection}>
              <label className={styles.label}>
                Pincode <span>*</span>
              </label>

              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");

                  setFormData((prev) => ({
                    ...prev,
                    pincode: value,
                  }));
                }}
                placeholder="6-digit pincode"
                className={styles.input}
                maxLength={6}
                required
              />
            </div>

            <label className={styles.checkboxWrapper}>
              <input
                type="checkbox"
                name="isDefault"
                checked={formData.isDefault}
                onChange={handleChange}
                disabled={editingAddress && editingAddress.isDefault}
              />

              <span>Set as my default delivery address</span>
            </label>

            <div className={styles.actionButtons}>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                disabled={submitLoading}
                type="submit"
                className={styles.saveButton}
              >
                {submitLoading ? "Saving data..." : "Save Address"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaStore,
  FaUserTie,
  FaPhoneAlt,
  FaEnvelope,
  FaIdCard,
  FaUniversity,
  FaMapMarkerAlt,
  FaRegCalendarAlt,
  FaClipboardList,
  FaMoneyCheckAlt,
  FaFileAlt,
  FaBuilding,
  FaCheckCircle,
} from "react-icons/fa";
import styles from "./cssFolder/HostHotelForm.module.css";
import AddressList from "../components/AddressList";
import api from "../api/axiosInstance";
import toast from "react-hot-toast";

const initialFormData = {
  id: "",
  userId: "",
  restorentName: "",
  businessType: "",
  productCategerys: "",
  yearOfEstablish: "",
  ownerName: "",
  mobileNumber: "",
  alternativeMobNumber: "",
  email: "",
  fssaiNumber: "",
  fssaiExpiry: "",
  accountNumber: "",
  confirmAccountNumber: "",
  ifscCode: "",
  accountType: "",
};

export default function HostHotelForm() {
  const [formData, setFormData] = useState(initialFormData);
  const [loding, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userId = localStorage.getItem("userId");

    if (formData.accountNumber !== formData.confirmAccountNumber) {
      toast.error("Account numbers do not match");
      return;
    }

    if (formData.mobileNumber.length !== 10) {
      toast.error("Please enter a 10 digites valid Mobile number");
      return;
    }
    if (formData.alternativeMobNumber.length !== 10) {
      toast.error("Please enter a 10 digites valid alternative Mobile number");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        userId: userId,
        restorentName: formData.restorentName,
        businessType: formData.businessType,
        productCategerys: formData.productCategerys,
        yearOfEstablish: Number(formData.yearOfEstablish),
        ownerName: formData.ownerName,
        mobileNumber: formData.mobileNumber,
        alternativeMobNumber: formData.alternativeMobNumber,
        email: formData.email,
        fssaiNumber: formData.fssaiNumber,
        fssaiExpiry: formData.fssaiExpiry,
        accountNumber: formData.accountNumber,
        ifscCode: formData.ifscCode,
        accountType: formData.accountType,
      };

      const response = await api.post("/Restorent/add", payload);
      navigate("/requested-restorents");

      toast.success(
        response.data ||
          "Restaurant registration submitted successfully. Please wait for approval.",
      );

      setFormData(initialFormData);
    } catch (error) {
      const msg =
        error.response?.data?.message || error.response?.data || error.message;
      toast.error(msg || "Failed to register restaurant");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.heroBadge}>
          <FaStore />
          <span>Restaurant Partner Registration</span>
        </div>

        <h1 className={styles.heroTitle}>
          Register your restaurant and start selling food online
        </h1>

        <p className={styles.heroText}>
          Add your business details, contact information, FSSAI details, banking
          information, and delivery address.
        </p>

        <div className={styles.heroPoints}>
          <div className={styles.heroPoint}>
            <FaCheckCircle />
            <span>Fast onboarding</span>
          </div>
          <div className={styles.heroPoint}>
            <FaCheckCircle />
            <span>Simple registration</span>
          </div>
          <div className={styles.heroPoint}>
            <FaCheckCircle />
            <span>Ready for order flow</span>
          </div>
        </div>
      </div>

      <div className={styles.formWrap}>
        <form className={styles.formCard} onSubmit={handleSubmit}>
          <div className={styles.formHeader}>
            <div>
              <h2>Add Restaurant</h2>
              <p>
                Fill all required details to create your restaurant profile.
              </p>
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionTitle}>
              <FaBuilding />
              <span>Business Details</span>
            </div>

            <div className={styles.grid2}>
              <div className={styles.field}>
                <label>Restaurant Name</label>
                <div className={styles.inputBox}>
                  <FaStore />
                  <input
                    type="text"
                    name="restorentName"
                    value={formData.restorentName}
                    onChange={handleChange}
                    placeholder="Enter restaurant name"
                    required
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label>Business Type</label>
                <div className={styles.inputBox}>
                  <FaClipboardList />
                  <select
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select business type</option>
                    <option value="RESTORENT">Restaurant</option>
                    <option value="CAFE">Café</option>
                    <option value="CLOUD_KITCHEN">Cloud Kitchen</option>
                    <option value="BAKERY">Bakery</option>
                    <option value="FOOD_TRUCK">Streat Food</option>
                    <option value="HOME_BASED">Home Based</option>
                  </select>
                </div>
              </div>

              <div className={styles.field}>
                <label>Product Categories</label>
                <div className={styles.inputBox}>
                  <FaClipboardList />
                  <input
                    type="text"
                    name="productCategerys"
                    value={formData.productCategerys}
                    onChange={handleChange}
                    placeholder="Veg, Non-Veg, Desserts..."
                    required
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label>Year of Establishment</label>
                <div className={styles.inputBox}>
                  <FaRegCalendarAlt />
                  <input
                    type="number"
                    name="yearOfEstablish"
                    value={formData.yearOfEstablish}
                    onChange={handleChange}
                    placeholder="2020"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionTitle}>
              <FaUserTie />
              <span>Owner & Contact Details</span>
            </div>

            <div className={styles.grid2}>
              <div className={styles.field}>
                <label>Owner Name</label>
                <div className={styles.inputBox}>
                  <FaUserTie />
                  <input
                    type="text"
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={handleChange}
                    placeholder="Enter owner full name"
                    required
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label>Mobile Number</label>
                <div className={styles.inputBox}>
                  <FaPhoneAlt />
                  <input
                    type="tel"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    placeholder="Enter mobile number"
                    required
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label>Alternative Mobile Number</label>
                <div className={styles.inputBox}>
                  <FaPhoneAlt />
                  <input
                    type="tel"
                    name="alternativeMobNumber"
                    value={formData.alternativeMobNumber}
                    onChange={handleChange}
                    placeholder="Enter alternative number"
                    required
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label>Email</label>
                <div className={styles.inputBox}>
                  <FaEnvelope />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email address"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionTitle}>
              <FaFileAlt />
              <span>FSSAI Details</span>
            </div>

            <div className={styles.grid2}>
              <div className={styles.field}>
                <label>FSSAI Number</label>
                <div className={styles.inputBox}>
                  <FaIdCard />
                  <input
                    type="text"
                    name="fssaiNumber"
                    value={formData.fssaiNumber}
                    onChange={handleChange}
                    placeholder="Enter FSSAI number"
                    required
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label>FSSAI Expiry</label>
                <div className={styles.inputBox}>
                  <FaRegCalendarAlt />
                  <input
                    type="date"
                    name="fssaiExpiry"
                    value={formData.fssaiExpiry}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionTitle}>
              <FaUniversity />
              <span>Banking Details</span>
            </div>

            <div className={styles.grid2}>
              <div className={styles.field}>
                <label>Account Number</label>
                <div className={styles.inputBox}>
                  <FaMoneyCheckAlt />
                  <input
                    type="text"
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleChange}
                    placeholder="Enter account number"
                    required
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label>Confirm Account Number</label>
                <div className={styles.inputBox}>
                  <FaMoneyCheckAlt />
                  <input
                    type="text"
                    name="confirmAccountNumber"
                    value={formData.confirmAccountNumber}
                    onChange={handleChange}
                    placeholder="Re-enter account number"
                    required
                  />
                </div>

                {formData.confirmAccountNumber &&
                  formData.accountNumber !== formData.confirmAccountNumber && (
                    <span className={styles.errorText}>
                      Account numbers do not match
                    </span>
                  )}
              </div>

              <div className={styles.field}>
                <label>IFSC Code</label>
                <div className={styles.inputBox}>
                  <FaUniversity />
                  <input
                    type="text"
                    name="ifscCode"
                    value={formData.ifscCode}
                    onChange={handleChange}
                    placeholder="Enter IFSC code"
                    required
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label>Account Type</label>
                <div className={styles.inputBox}>
                  <FaMoneyCheckAlt />
                  <select
                    name="accountType"
                    value={formData.accountType}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select account type</option>
                    <option value="SAVINGS">Savings</option>
                    <option value="CURRENT">Current</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionTitle}>
              <FaMapMarkerAlt />
              <span>Address</span>
            </div>

            <div className={styles.addressBox}>
              <AddressList />
              <Link to={"/adress"} className={styles.addressLink}>
                Add diffrent address
              </Link>
            </div>
          </div>

          <div className={styles.submitRow}>
            <button
              disabled={loding}
              type="submit"
              className={styles.submitBtn}
            >
              {loding ? "Sending Request..." : "Register Restaurant"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import styles from "./cssFolder/ContactUs.module.css";
import api from "../api/axiosInstance";
import toast from "react-hot-toast";

const ContactUs = () => {
  const [form, setForm] = useState({
    reason: "",
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/public/Contact", form);
      toast.success(response.data || "thank you");
      setForm({
        reason: "",
        name: "",
        email: "",
        message: "",
      });
    } catch (error) {
      toast.error(error.data || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.contactContainer}>
      <h1>Contact Us</h1>

      <p className={styles.contactSubtitle}>
        We would love to hear from you. Send us your queries or feedback.
      </p>

      <div className={styles.contactCard}>
        <form onSubmit={handleSubmit}>
          <div className={styles.selectWrapper}>
            <select
              name="reason"
              value={form.reason}
              onChange={handleChange}
              required
            >
              <option value="" disabled hidden>
                How can we help you? *
              </option>
              <option value="order_issue">
                I have an issue with my order.
              </option>
              <option value="app_issue">My app is not working.</option>
              <option value="feedback">
                I want to share feedback or a suggestion.
              </option>
            </select>
          </div>

          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <textarea
            name="message"
            placeholder="Your Message"
            rows="5"
            value={form.message}
            onChange={handleChange}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;

import React, { useEffect, useRef, useState } from "react";
import styles from "./cssFolder/OwnerVendorManagement.module.css";

import { FiSearch, FiBell, FiMoreVertical, FiEye } from "react-icons/fi";
import { IoAdd } from "react-icons/io5";
import { MdKeyboardArrowDown } from "react-icons/md";
import { FaStar } from "react-icons/fa";
import OwnerSidebar from "../components/OwnerSidebar";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import { useQueries, useQuery } from "@tanstack/react-query";
import Loading from "../components/Loading";

const getStatusClass = (status) => {
  switch (status) {
    case "Approved":
      return styles.approved;
    case "Pending":
      return styles.pending;
    case "Suspended":
      return styles.suspended;
    default:
      return "";
  }
};

const FetchVenderList = () => {
  return api.get("/Restorent/owner/all");
};

const OwnerVendorManagement = () => {
  const [openMenu, setOpenMenu] = useState(null); //three dotes menu
  const [open, setOpen] = useState(false); // for status filter open close
  const [selected, setSelected] = useState("All Status"); //selected categery
  const [serchText, setSerchText] = useState(); //serch vender

  const navigate = useNavigate();
  const menuRef = useRef(null);

  const { data, isLoading } = useQuery({
    queryKey: ["owner", "Restorent/all"],
    queryFn: FetchVenderList,
    staleTime: Infinity,
  });

  const vendors = data?.data || [];

  const filteredVendors =
    serchText?.length > 0
      ? (vendors || []).filter(
          (vendor) =>
            vendor?.ownerName?.includes(serchText) ||
            vendor?.restorentName?.includes(serchText),
        )
      : selected === "All Status"
        ? vendors || []
        : (vendors || []).filter((vendor) => vendor?.status === selected);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (isLoading) {
    return (
      <div style={{ marginTop: "60px", marginBottom: "80px" }}>
        <Loading />
      </div>
    );
  }

  return (
    <div className={styles.layout}>
      <OwnerSidebar />
      <div className={styles.mainContent}>
        {/* HEADER */}

        <div className={styles.header}>
          <div>
            <h1>Vendor Management</h1>
            <p>Manage all restaurants on your platform</p>
          </div>

          <div className={styles.headerRight}>
            <div className={styles.topSearch}>
              <FiSearch />
              <input type="text" placeholder="Search..." />
            </div>

            <div className={styles.notification}>
              <FiBell size={18} />
              <span>5</span>
            </div>

            <img
              src="https://i.pravatar.cc/150?img=3"
              alt="profile"
              className={styles.avatar}
            />
          </div>
        </div>

        <div className={styles.pageContent}>
          {/* STATS */}

          <div className={styles.statsContainer}>
            <div className={styles.statCard}>
              <p>Total Vendors</p>
              <h2>{vendors.length}</h2>
            </div>

            <div className={`${styles.statCard} ${styles.approvedCard}`}>
              <p>Approved</p>
              <h2>5</h2>
            </div>

            <div className={`${styles.statCard} ${styles.pendingCard}`}>
              <p>Pending Review</p>
              <h2>3</h2>
            </div>
          </div>

          {/* TABLE */}

          <div className={styles.tableWrapper}>
            <div className={styles.tableHeader}>
              <div className={styles.searchVendor}>
                <FiSearch />
                <input
                  type="text"
                  placeholder="Search vendors by name, owner ..."
                  onKeyDown={(e) => setSerchText(e.target.value)}
                />
              </div>

              <div className={styles.actions}>
                <div className={styles.statusDropdown}>
                  <div
                    className={styles.statusBtn}
                    onClick={() => setOpen(!open)}
                  >
                    <span>{selected}</span>
                    <span>⌄</span>
                  </div>

                  <div className={open ? styles.statusMenu : styles.none}>
                    <div
                      className={
                        selected === "All Status"
                          ? styles.active
                          : styles.statusItem
                      }
                      onClick={() => {
                        setSelected("All Status");
                        setOpen(false);
                      }}
                    >
                      All Status
                    </div>
                    <div
                      className={
                        selected === "APPROVED"
                          ? styles.active
                          : styles.statusItem
                      }
                      onClick={() => {
                        setSelected("APPROVED");
                        setOpen(false);
                      }}
                    >
                      APPROVED
                    </div>
                    <div
                      className={
                        selected === "PENDING"
                          ? styles.active
                          : styles.statusItem
                      }
                      onClick={() => {
                        setSelected("PENDING");
                        setOpen(false);
                      }}
                    >
                      PENDING
                    </div>
                    <div
                      className={
                        selected === "SUSPENDED"
                          ? styles.active
                          : styles.statusItem
                      }
                      onClick={() => {
                        setSelected("SUSPENDED");
                        setOpen(false);
                      }}
                    >
                      SUSPENDED
                    </div>
                  </div>
                </div>

                <button
                  className={styles.addBtn}
                  onClick={() => navigate("/Register-your-Hotel")}
                >
                  <IoAdd />
                  Add Vendor
                </button>
              </div>
            </div>

            <div className={styles.tableResponsive}>
              <table>
                <thead>
                  <tr>
                    <th>RESTAURANT</th>
                    <th>OWNER</th>
                    <th>CONTACT</th>
                    <th>EMAIL</th>
                    <th>RATING</th>
                    <th>STATUS</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredVendors.map((vendor) => (
                    <tr key={vendor.id}>
                      <td>
                        <div className={styles.restaurantInfo}>
                          <div className={styles.logo}>
                            {vendor?.restorentName?.charAt(0) || ""}
                          </div>

                          <div>
                            <h4>{vendor.restorentName}</h4>
                            <span>{vendor.businessType}</span>
                          </div>
                        </div>
                      </td>
                      <td>{vendor.ownerName}</td>
                      <td>{vendor.mobileNumber}</td>
                      <td>{vendor.email}</td>
                      {/* <td className={styles.orders}>{vendor.orders}</td> */}
                      <td>
                        <div className={styles.rating}>
                          <FaStar />
                          {vendor.averageRating}
                        </div>
                      </td>
                      <td>
                        <span
                          className={
                            (vendor.status === "PENDING" && styles.pending) ||
                            (vendor.status === "APPROVED" && styles.approved) ||
                            (vendor.status === "SUSPENDED" &&
                              styles.suspended) ||
                            (vendor.status === "REJECTED" && styles.suspended)
                          }
                        >
                          {vendor.status}
                        </span>
                      </td>
                      <td>
                        <div
                          className={styles.actionMenu}
                          ref={openMenu === vendor.id ? menuRef : null}
                        >
                          <button
                            className={styles.actionBtn}
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenu(
                                openMenu === vendor.id ? null : vendor.id,
                              );
                            }}
                          >
                            <FiMoreVertical />
                          </button>

                          {openMenu === vendor.id && (
                            <div className={styles.dropdown}>
                              <button
                                onClick={() =>
                                  navigate(
                                    `/Owner/VenderManagement/${vendor.id}`,
                                  )
                                }
                              >
                                <FiEye />
                                View Profile
                              </button>
                              {vendor.status === "PENDING" && (
                                <button>✅ Approve</button>
                              )}

                              {vendor.status === "APPROVED" && (
                                <button className={styles.blockBtn}>
                                  Suspend
                                </button>
                              )}

                              {vendor.status === "SUSPENDED" && (
                                <button>✅ Approve</button>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerVendorManagement;

import styles from "./cssFolder/OwnerUsersPage.module.css";
import OwnerSidebar from "../components/OwnerSidebar";

import { FiSearch, FiBell, FiMoreVertical } from "react-icons/fi";

import { FaUsers, FaStar, FaShoppingBag, FaBan } from "react-icons/fa";

import { useEffect, useRef, useState } from "react";
import api from "../api/axiosInstance";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import ConfirmModal from "../components/ConfirmModal";
import { Link } from "react-router-dom";

const FetchCustomersList = () => {
  return api.get("/user/all");
};

const formatDate = (dateString) => {
  if (!dateString) return "-";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(dateString));
};

export default function OwnerUsersPage() {
  const [selectedUser, setSelectedUser] = useState(null); //select the user
  const [confirmAction, setConfirmAction] = useState(null); //conferm block or unblock or delete
  const [openMenu, setOpenMenu] = useState(null);

  const menuRef = useRef(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["owner", "customers-all"],
    queryFn: FetchCustomersList,
    staleTime: 1000 * 60 * 10,
  });

  const customers = data?.data || [];

  const totalCustomers = customers.length;

  const activeUsers = customers.filter((u) => u.userRole !== "BLOCKED").length;

  const blockedUsers = customers.filter((u) => u.userRole === "BLOCKED").length;

  const totalOrders = customers.reduce(
    (sum, u) => sum + (u.totalOrders || 0),
    0,
  );

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

  const UpdateUserRole = async (userId, role) => {
    if (
      selectedUser?.userRole === "OWNER" ||
      selectedUser?.userRole === "VENDER"
    ) {
      toast.error("Owner and Vendor accounts cannot be modified.");
      return;
    }

    try {
      const res = await api.patch(`/user/roll/${userId}?userRole=${role}`);

      toast.success(res.data || "User Role Updated Successfully");

      queryClient.invalidateQueries({
        queryKey: ["owner", "customers-all"],
      });

      queryClient.invalidateQueries({
        queryKey: ["userInfo/", userId],
      });
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.response?.data ||
          "Failed to update user role",
      );
    } finally {
      setOpenMenu(null);
      setConfirmAction(null);
      setSelectedUser(null);
    }
  };
  const handelDelete = (userid) => {
    api
      .delete(`/user/${userid}`)
      .then((res) => {
        queryClient.invalidateQueries({
          queryKey: ["owner", "customers-all"],
        });

        toast.success("User Deleted Successfully");
      })
      .catch((err) => {
        toast.error(
          err.response?.data?.message ||
            err.response?.data ||
            "Failed to Delete user",
        );
      })
      .finally(() => {
        setOpenMenu(null);
        setConfirmAction(null);
        setSelectedUser(null);
      });
  };
  if (isLoading) {
    return (
      <div className={styles.layout}>
        <OwnerSidebar />
        <div className={styles.mainContent}>Loading users...</div>
      </div>
    );
  }

  return (
    <div className={styles.layout}>
      <OwnerSidebar />

      <div className={styles.mainContent}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h1>Users Management</h1>
            <p>Manage and monitor platform users</p>
          </div>

          <div className={styles.headerRight}>
            <div className={styles.searchBox}>
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

        {/* Stats */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.iconBlue}>
              <FaUsers />
            </div>

            <div>
              <p>Total Customers</p>
              <h2>{totalCustomers}</h2>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.iconGreen}>
              <FaStar />
            </div>

            <div>
              <p>Active Users</p>
              <h2>{activeUsers}</h2>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.iconOrange}>
              <FaShoppingBag />
            </div>

            <div>
              <p>Total Orders</p>
              <h2>{totalOrders}</h2>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.iconRed}>
              <FaBan />
            </div>

            <div>
              <p>Blocked Users</p>
              <h2>{blockedUsers}</h2>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className={styles.tableCard}>
          <div className={styles.tableHeader}>
            <div className={styles.bigSearch}>
              <FiSearch />

              <input
                type="text"
                placeholder="Search customers by name, email, city..."
              />
            </div>

            <select className={styles.select}>
              <option>All Status</option>
            </select>

            <select className={styles.select}>
              <option>Most Orders</option>
            </select>
          </div>

          <table>
            <thead>
              <tr>
                <th>CUSTOMER</th>
                <th>CONTACT</th>
                <th>CITY</th>
                <th>REGISTERED</th>
                <th>ORDERS</th>
                <th>TOTAL SPENT</th>
                <th>ROLE</th>
                <th>ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {customers.map((customer) => (
                <tr key={customer.userId}>
                  <td>
                    <div className={styles.customerInfo}>
                      <img
                        src={`https://i.pravatar.cc/100?img=${
                          customer.userId + 10
                        }`}
                        alt=""
                        className={styles.userAvatar}
                      />

                      <strong>{customer.customerName}</strong>
                    </div>
                  </td>

                  <td>
                    <div className={styles.contact}>
                      <span>{customer.email}</span>
                      <small>{customer.phone}</small>
                    </div>
                  </td>

                  <td>{customer.city}</td>

                  <td>
                    {formatDate(customer.registerdAt || customer.registeredAt)}
                  </td>

                  <td>{customer.totalOrders}</td>

                  <td>{customer.totalSpend}</td>

                  <td>
                    <span
                      className={
                        customer.userRole === "BLOCKED"
                          ? styles.blockedBadge
                          : styles.activeBadge
                      }
                    >
                      {customer.userRole}
                    </span>
                  </td>

                  <td>
                    <div
                      className={styles.actionMenu}
                      ref={openMenu === customer.userId ? menuRef : null}
                    >
                      <button
                        className={styles.actionBtn}
                        onClick={(e) => {
                          e.stopPropagation();

                          setOpenMenu(
                            openMenu === customer.userId
                              ? null
                              : customer.userId,
                          );
                        }}
                      >
                        <FiMoreVertical />
                      </button>

                      {openMenu === customer.userId && (
                        <div className={styles.dropdown}>
                          {customer.userRole === "CUSTOMER" && (
                            <>
                              <button
                                className={styles.blockBtn}
                                onClick={() => {
                                  setSelectedUser(customer);
                                  setConfirmAction("BLOCK");
                                }}
                              >
                                <FaBan />
                                Block User
                              </button>

                              <button
                                className={styles.blockBtn}
                                onClick={() => {
                                  setSelectedUser(customer);
                                  setConfirmAction("Delete");
                                }}
                              >
                                <FaBan />
                                Delete User
                              </button>
                            </>
                          )}

                          {customer.userRole === "BLOCKED" && (
                            <>
                              <button
                                className={styles.blockBtn}
                                onClick={() => {
                                  setSelectedUser(customer);
                                  setConfirmAction("UNBLOCK");
                                }}
                              >
                                <FaBan />
                                Unblock User
                              </button>

                              <button
                                className={styles.blockBtn}
                                onClick={() => {
                                  setSelectedUser(customer);
                                  setConfirmAction("Delete");
                                }}
                              >
                                <FaBan />
                                Delete User
                              </button>
                            </>
                          )}

                          {(customer.userRole === "OWNER" ||
                            customer.userRole === "VENDER") && (
                            <div className={styles.disabledAction}>
                              Protected Account
                            </div>
                          )}
                          <Link
                            className={styles.UserDitBtn}
                            to={`/Owner/User/${customer.userId}`}
                          >
                            View Details
                          </Link>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Block Modal */}
        <ConfirmModal
          isOpen={confirmAction === "BLOCK"}
          title="Block User"
          message={`Are you sure you want to block ${
            selectedUser?.customerName || "this user"
          }?`}
          confirmText="Block User"
          cancelText="Cancel"
          onConfirm={() => UpdateUserRole(selectedUser?.userId, "BLOCKED")}
          onCancel={() => {
            setConfirmAction(null);
            setSelectedUser(null);
          }}
        />

        {/* Unblock Modal */}
        <ConfirmModal
          isOpen={confirmAction === "UNBLOCK"}
          title="Unblock User"
          message={`Are you sure you want to unblock ${
            selectedUser?.customerName || "this user"
          }?`}
          confirmText="Unblock User"
          cancelText="Cancel"
          onConfirm={() => UpdateUserRole(selectedUser?.userId, "CUSTOMER")}
          onCancel={() => {
            setConfirmAction(null);
            setSelectedUser(null);
          }}
        />

        {/* Delete Modal */}
        <ConfirmModal
          isOpen={confirmAction === "Delete"}
          title="Delete User Permenetly"
          message={`Are you sure you want to Delete ${
            selectedUser?.customerName || "this user"
          } Permenently?`}
          confirmText="Delete User"
          cancelText="Cancel"
          onConfirm={() => handelDelete(selectedUser?.userId)}
          onCancel={() => {
            setConfirmAction(null);
            setSelectedUser(null);
          }}
        />
      </div>
    </div>
  );
}

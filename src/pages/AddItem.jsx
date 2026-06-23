import VenderSidebar from "../components/VenderSidebar";
import style from "./cssFolder/AddItem.module.css";
import { assets } from "../assets/assets";
import { categerys } from "../assets/assets";
import { useRef, useState } from "react";
import api from "../api/axiosInstance";
import toast from "react-hot-toast";
import Loading from "../components/Loading";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const AddItem = ({ activeHotel }) => {
  const [loading, setLoading] = useState(false);
  const [previve, setPrevive] = useState();
  const hotelId = localStorage.getItem("hotelId");
  let foodname = useRef();
  let description = useRef();
  let foodCategery = useRef();
  let price = useRef();
  let file = useRef();
  let foodType = useRef();

  const queryClient = useQueryClient();
  const addFoodItem = (e) => {
    if (!activeHotel) return;
    e.preventDefault();

    const formData = new FormData();
    formData.append("foodname", foodname.current.value);
    formData.append("description", description.current.value);
    formData.append("foodCategery", foodCategery.current.value);
    formData.append("price", price.current.value);
    formData.append("restorentId", activeHotel.id);
    formData.append("file", file.current.files[0]);
    formData.append("foodType", foodType.current.value);

    setLoading(true);
    api
      .post("/FoodItem/add", formData, {
        "Content-Type": "multipart/form-data",
      })
      .then((e) => {
        const msg = e.response?.data?.message || e.response?.data || e.message;
        toast.success(e.data);

        foodname.current.value = "";
        description.current.value = "";
        foodCategery.current.value = "";
        price.current.value = "";
        file.current.value = null;
        foodType.current.value = "";
        setPrevive(null);
      })
      .catch((err) => {
        const ermsg =
          err.response?.data?.message || err.response?.data || err.message;

        toast.error(ermsg);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <div className={style.adminContainer}>
        <VenderSidebar />

        {!activeHotel ? (
          <>
            <h2>Open Dashboard Frist!</h2>
            <Loading />
          </>
        ) : (
          <main className={style.content}>
            {activeHotel.status !== "APPROVED" && (
              <h1 className={style.accountError}>
                This Account is {activeHotel.status} ! You can't sell your food
                heare
              </h1>
            )}
            <h1 className={style.heading}>
              {activeHotel.restorentName} Dashboard
            </h1>

            <p className={style.subHeading}>
              Managing: {activeHotel.restorentName} ({activeHotel.address?.city}
              )
            </p>

            <h1>Add Item</h1>

            <form className={style.addForm} onSubmit={(e) => addFoodItem(e)}>
              <div className={style.field}>
                <label>Upload Image</label>
                <input
                  type="file"
                  name="file"
                  ref={file}
                  onChange={(e) => {
                    const i = e.target.files[0];
                    setPrevive(URL.createObjectURL(i));
                  }}
                  required
                />

                {previve && (
                  <img
                    style={{ height: "200px", width: "200px" }}
                    src={previve}
                  />
                )}
              </div>

              <div className={style.field}>
                <label>Product Name</label>
                <input
                  name="foodname"
                  type="text"
                  placeholder="Type here"
                  ref={foodname}
                  required
                />
              </div>

              <div className={style.field}>
                <label>Description</label>
                <textarea
                  name="description"
                  type="text"
                  placeholder="Write content here"
                  ref={description}
                  required
                />
              </div>

              <div className={style.field}>
                <label>Category</label>
                <select name="foodCategery" ref={foodCategery} required>
                  <option value="">Please Choose an Option</option>
                  {categerys.map((cat) => (
                    <option key={cat} value={cat.split(" ").join("")}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className={style.row}>
                <div className={style.field}>
                  <label>Food Type</label>
                  <select name="foodType" ref={foodType} required>
                    <option value="">Select Type</option>
                    <option value="VEG">🟢 Veg</option>
                    <option value="NON_VEG">🔴 Non Veg</option>
                  </select>
                </div>

                <div className={style.field}>
                  <label>Price</label>
                  <input
                    name="price"
                    type="number"
                    placeholder="25"
                    ref={price}
                    required
                  />
                </div>
              </div>

              <button
                disabled={loading}
                className={style.addItemBtn}
                type="submit"
              >
                {loading ? "Adding..." : "ADD"}
              </button>
            </form>
          </main>
        )}
      </div>
    </>
  );
};

export default AddItem;

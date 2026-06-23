import { useQuery } from "@tanstack/react-query";
import api from "../api/axiosInstance";
import styles from "./cssFolder/RestorentsList.module.css";
import { Link } from "react-router-dom";

const FetchRestorents = () => {
  return api.get("/public/Restorent/all");
};

const RestaurantsList = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["restaurants"],
    queryFn: FetchRestorents,
    staleTime: 1000 * 60 * 30,
  });

  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.headingSection}>
        <h1>Restaurants Near You</h1>
        <p>Find your favorite food and order instantly</p>
      </div>

      <div className={styles.grid}>
        {data?.data?.map((restaurant) => (
          <div key={restaurant.id} className={styles.card}>
            <div className={styles.header}>
              <div className={styles.logo}>
                {restaurant.restorentName.charAt(0)}
              </div>

              <div>
                <h3>{restaurant.restorentName}</h3>
                <p>{restaurant.ownerName}</p>
              </div>
            </div>

            <div className={styles.badges}>
              <span className={styles.type}>
                {restaurant.businessType.replace("_", " ")}
              </span>
              <span className={styles.year}>
                Since {restaurant.yearOfEstablish}
              </span>
            </div>

            <div className={styles.categories}>
              {(restaurant.productCategorys || "")
                .split(",")
                .filter(Boolean)
                .map((category, index) => (
                  <span key={index} className={styles.tag}>
                    {category.trim()}
                  </span>
                ))}
            </div>

            <div className={styles.footer}>
              <div>
                <span>⭐ 4.5</span>
              </div>

              <Link
                to={`/restorent/${restaurant.id}`}
                className={styles.viewBtn}
              >
                Visite Restorent →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RestaurantsList;

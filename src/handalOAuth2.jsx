import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

const OAuth2SuccessHandler = ({ setAuthTrigger }) => {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const userId = searchParams.get("userId");
    const userRole = searchParams.get("role");

    if (!token || !userId) {
      toast.error("OAuth Login Failed");

      navigate("/login");

      return;
    }

    localStorage.setItem("accessToken", token);

    localStorage.setItem("userId", userId);
    localStorage.setItem("role", userRole);

    setAuthTrigger((prev) => !prev);

    toast.success("Login Successful");

    setTimeout(() => {
      window.location.reload();
    }, [1000]);

    navigate("/");
  }, []);

  return <div>Loading...</div>;
};

export default OAuth2SuccessHandler;

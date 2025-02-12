import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setOffline } from "@/client/environment/redux/slices/session";
import { setNoUser } from "@/client/environment/redux/slices/user";

const useAuth = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogOut = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok && data.success) {
        dispatch(setOffline());
        dispatch(setNoUser());
        router.push("/sounds");
      } else {
        console.error("Logout failed:", data.message);
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return { handleLogOut };
};

export default useAuth;
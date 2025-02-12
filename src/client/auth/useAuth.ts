import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setAuthenticated, setUnauthenticated, setOffline } from "@/client/environment/redux/slices/session";
import { setNoUser } from "@/client/environment/redux/slices/user";
import { useState } from "react";

const useAuth = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async (email: string, password: string, onSuccess: () => void, onConfirmEmail: () => void) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        dispatch(setAuthenticated());
        onSuccess(); // Call function to close modal
      } else {
        const data = await response.json();
        alert(data.message);

        if (data.message === "ConfirmSignUp required") {
          onConfirmEmail(); // Trigger email confirmation modal
        }
      }
    } catch (error) {
      dispatch(setUnauthenticated());
      console.error("Error during login:", error);
      alert("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

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

  return { handleSignIn, handleLogOut, isLoading };
};

export default useAuth;

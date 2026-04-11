import React, { useEffect } from "react";
import { Button } from "./ui/button";
import { useCreateCheckoutSessionMutation } from "@/features/api/purchaseApi";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const BuyCourseButton = ({ courseId }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [createCheckoutSession, { data, isSuccess, isLoading, error }] =
    useCreateCheckoutSessionMutation();

  const purchaseCourseHandler = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to purchase the course");
      navigate("/login");
      return;
    }
    await createCheckoutSession(courseId);
  };

  useEffect(() => {
    if (isSuccess && data?.url) {
      // Redirect to Stripe checkout page
      window.location.href = data.url;
    }
    if (error) {
      const errorMessage = error?.data?.message || error?.message || "Failed to create checkout session";
      toast.error(errorMessage);
      
      // If 401, redirect to login
      if (error?.status === 401) {
        toast.error("Please login to continue");
        navigate("/login");
      }
    }
  }, [isSuccess, data, error, navigate]);

  return (
    <Button
      onClick={purchaseCourseHandler}
      disabled={isLoading}
      className="w-full"
    >
      {isLoading ? (
        <>
          {" "}
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please Wait{" "}
        </>
      ) : (
        "Purchase Course"
      )}
    </Button>
  );
};

export default BuyCourseButton;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle } from "lucide-react";

const SubscriptionPage = () => {
  const navigate = useNavigate();
  const { user, login, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // For demo purposes - bypass payment flow
  const handleDemoSubscription = () => {
    setIsLoading(true);
    setError(null);

    setTimeout(() => {
      // Update user object with subscription data
      if (user) {
        const updatedUser = {
          ...user,
          isSubscriber: true,
          subscriptionStartDate: new Date().toISOString(),
          subscriptionValidTill: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        };

        // Update localStorage
        localStorage.setItem("isSubscriber", "true");
        localStorage.setItem(
          "subscriptionStartDate",
          updatedUser.subscriptionStartDate,
        );
        localStorage.setItem(
          "subscriptionValidTill",
          updatedUser.subscriptionValidTill,
        );

        // Update auth context
        login(updatedUser);

        setSuccess("Demo subscription activated successfully!");

        // Redirect to dashboard after a short delay
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }

      setIsLoading(false);
    }, 1500);
  };

  const handleSubscription = async () => {
    setIsLoading(true);
    setError(null);
    console.log("Starting subscription process with token:", user?.token);

    try {
      // Create order
      try {
        const orderResponse = await fetch(
          "https://7cvccltb-3100.inc1.devtunnels.ms/api/users/payment/create-order",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user?.token}`,
              "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({
              amount: 500,
              currency: "INR",
            }),
          },
        );

        const orderData = await orderResponse.json();

        if (!orderResponse.ok) {
          console.error("Order creation failed:", orderData);
          throw new Error(orderData.message || "Failed to create order");
        }

        console.log("Order created successfully:", orderData);

        // Initialize Razorpay
        const options = {
          key: "rzp_test_DUyJsTbSpXKKaz", // Using the correct test key
          amount: orderData.data.amount,
          currency: orderData.data.currency,
          name: "Inventory System",
          description: "Subscription Payment",
          order_id: orderData.data.id,
          image:
            "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=200&q=80", // Add company logo
          handler: async function (response: any) {
            try {
              console.log("Payment successful:", response);
              // Verify payment
              const verifyResponse = await fetch(
                "https://7cvccltb-3100.inc1.devtunnels.ms/api/users/payment/verify-payment",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user?.token}`,
                    "Access-Control-Allow-Origin": "*",
                  },
                  body: JSON.stringify({
                    razorpay_order_id: orderData.data.id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                    userId: user?.userId,
                  }),
                },
              );

              const verifyData = await verifyResponse.json();

              if (!verifyResponse.ok) {
                throw new Error(
                  verifyData.message || "Payment verification failed",
                );
              }

              // Update user with subscription data
              if (user) {
                const updatedUser = {
                  ...user,
                  isSubscriber: true,
                  subscriptionStartDate: new Date().toISOString(),
                  subscriptionValidTill: new Date(
                    Date.now() + 30 * 24 * 60 * 60 * 1000,
                  ).toISOString(),
                };

                // Update localStorage
                localStorage.setItem("isSubscriber", "true");
                localStorage.setItem(
                  "subscriptionStartDate",
                  updatedUser.subscriptionStartDate,
                );
                localStorage.setItem(
                  "subscriptionValidTill",
                  updatedUser.subscriptionValidTill,
                );

                // Update auth context
                login(updatedUser);
              }

              setSuccess(
                "Payment successful! You now have access to all features.",
              );

              // Redirect to dashboard after successful payment
              setTimeout(() => {
                navigate("/");
              }, 3000);
            } catch (err) {
              console.error("Payment verification error:", err);
              setError(
                err instanceof Error
                  ? err.message
                  : "Payment verification failed",
              );
              setIsLoading(false);
            }
          },
          prefill: {
            name: user?.userName,
            email: "customer@example.com", // Add a default email for testing
            contact: "9999999999", // Add a default phone for testing
          },
          theme: {
            color: "#0ea5e9",
          },
          modal: {
            ondismiss: function () {
              setIsLoading(false);
            },
          },
        };

        const razorpay = new (window as any).Razorpay(options);
        razorpay.open();
      } catch (error) {
        console.error("Error creating order:", error);
        setError(
          error instanceof Error ? error.message : "Failed to create order",
        );
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Subscription error:", err);
      setError(
        err instanceof Error ? err.message : "Failed to initialize payment",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-4">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <Card className="w-full shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-sky-600">
              Subscription Required
            </CardTitle>
            <CardDescription className="text-center">
              Subscribe to access all features of the Inventory System
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-sky-50 rounded-lg border border-sky-100">
              <h3 className="text-lg font-semibold text-sky-700 mb-2">
                Premium Subscription
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <span>Full access to inventory management</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <span>GST invoice generation</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <span>Custom invoice templates</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <span>Sales and purchase tracking</span>
                </li>
              </ul>
              <div className="mt-4 text-center">
                <span className="text-2xl font-bold text-sky-700">₹500</span>
                <span className="text-gray-500 ml-1">/month</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-3">
            <Button
              onClick={handleSubscription}
              className="w-full bg-sky-600 hover:bg-sky-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                "Subscribe Now"
              )}
            </Button>

            <div className="text-center text-sm text-gray-500">
              <span>Having issues with payment?</span>
              <Button
                variant="link"
                className="text-sky-600 p-0 h-auto font-medium"
                onClick={handleDemoSubscription}
                disabled={isLoading}
              >
                Use demo subscription
              </Button>
            </div>
            <div className="text-center text-xs text-gray-500 mt-2">
              <p>For testing, use these Razorpay test card details:</p>
              <p>Card Number: 4111 1111 1111 1111</p>
              <p>Expiry: Any future date | CVV: Any 3 digits</p>
              <p>Name: Any name | 3D Secure: Success</p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SubscriptionPage;

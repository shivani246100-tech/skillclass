"use client";

import { useState } from "react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function BuyCourseButton({
  courseId,
  price,
}: {
  courseId: string;
  price: number;
}) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function loadRazorpayScript() {
    if (window.Razorpay) {
      return true;
    }

    return new Promise<boolean>((resolve) => {
      const script = document.createElement("script");

      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);

      document.body.appendChild(script);
    });
  }

  async function handleBuy() {
    setLoading(true);
    setMessage("");

    try {
      const scriptLoaded = await loadRazorpayScript();

      if (!scriptLoaded) {
        setMessage(
          "Unable to load Razorpay. Please check your internet connection."
        );
        return;
      }

      const response = await fetch(
        "/api/student/payments/create-order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            courseId,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Unable to start payment.");
        return;
      }

      const options = {
        key: data.razorpayKeyId,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "SkillClass",
        description: data.course.title,
        order_id: data.order.id,

        prefill: {
          name: data.student.name || "",
          email: data.student.email || "",
        },

        theme: {
          color: "#2563eb",
        },

        handler: async function (paymentResponse: any) {
          setMessage("Payment successful. Verifying payment...");

          try {
            const verifyResponse = await fetch(
              "/api/student/payments/verify",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  courseId,
                  orderId: paymentResponse.razorpay_order_id,
                  paymentId: paymentResponse.razorpay_payment_id,
                  signature: paymentResponse.razorpay_signature,
                }),
              }
            );

            const verifyData = await verifyResponse.json();

            if (!verifyResponse.ok) {
              setMessage(
                verifyData.error ||
                  "Payment verification failed."
              );
              return;
            }

            setMessage(
              "Payment successful! Your course purchase has been recorded."
            );
          } catch (error) {
            console.error(
              "Payment verification error:",
              error
            );

            setMessage(
              "Payment was received, but verification is still pending."
            );
          }
        },

        modal: {
          ondismiss: function () {
            setMessage("Payment window closed.");
          },
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on(
        "payment.failed",
        function (response: any) {
          console.error(
            "Razorpay payment failed:",
            response
          );

          setMessage(
            response?.error?.description ||
              "Payment failed. Please try again."
          );
        }
      );

      razorpay.open();
    } catch (error) {
      console.error("Payment error:", error);
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ marginTop: 24 }}>
      <button
        type="button"
        className="btn btn-primary"
        onClick={handleBuy}
        disabled={loading}
      >
        {loading
          ? "Opening Payment..."
          : `Buy Course ₹${Number(price).toLocaleString("en-IN")}`}
      </button>

      {message && (
        <p style={{ marginTop: 12 }}>
          {message}
        </p>
      )}
    </div>
  );
}
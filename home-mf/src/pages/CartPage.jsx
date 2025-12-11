// src/pages/CartPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCartContext } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import CheckoutPopup from "../components/CheckoutPopup";

export default function CartPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, loading, updateQuantity, removeItem, clearCart, getCartTotal } =
    useCartContext();

  const [cartItems, setCartItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [processing, setProcessing] = useState(false);

  const BACKEND_URL = "http://localhost:8082/api"; // ✅ Update if backend port differs

  // Sync cart items
  useEffect(() => {
    if (cart?.items?.length) {
      setCartItems(cart.items);
    } else {
      setCartItems([]);
    }
  }, [cart]);

  if (loading) {
    return (
      <div className="min-h-screen bg-base-100">
        <Navbar />
        <div className="flex justify-center items-center h-screen">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </div>
    );
  }

  const items = cartItems || [];
  const subtotal = getCartTotal();
  const shipping = subtotal > 50 ? 0 : 5;
  const total = subtotal + shipping;

  const handleUpdateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    updateQuantity(itemId, newQuantity);
  };

  const handleRemoveItem = (itemId) => {
    if (window.confirm("Remove this item from cart?")) {
      removeItem(itemId);
    }
  };

  const handleClearCart = () => {
    if (window.confirm("Clear all items from cart?")) {
      clearCart();
    }
  };

  // ✅ Show checkout popup when user clicks “Proceed to Checkout”
  const handleProceedToCheckout = () => {
    if (!user) {
      if (
        window.confirm(
          "Please sign in to complete your purchase. Go to login page?"
        )
      ) {
        navigate("/login", { state: { from: "/cart" } });
      }
      return;
    }

    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    setShowModal(true);
  };

  // ✅ Checkout Logic (Stock Update + Order Email)
  const handleCheckout = async () => {
    if (processing) return;
    setProcessing(true);

    try {
      console.log("🛒 Starting checkout...");
      console.log("Items:", cartItems);

      // 1️⃣ Validate cart before stock update
      if (!cartItems || cartItems.length === 0) {
        alert("Cart is empty. Cannot proceed.");
        setProcessing(false);
        return;
      }

      // 2️⃣ Update stock for each item
      for (const item of cartItems) {
        if (!item._id) {
          console.error("❌ Missing _id for product:", item);
          continue;
        }

        const updatedStockQuantity = (item.stockQuantity || 0) - item.quantity;

        if (updatedStockQuantity < 0) {
          console.warn(
            `⚠️ Product "${item.name}" would go negative. Skipping stock update.`
          );
          continue;
        }

        console.log(
          `🧾 Updating stock for "${item.name}" (ID: ${item._id}) → New stock: ${updatedStockQuantity}`
        );

        //const productId = item.productId || item._id;
        const productId = item.productId || (item._id.split('-')[0]);
        await axios
          .patch(`${BACKEND_URL}/products/${productId}/stock`, {
            stockQuantity: updatedStockQuantity,
          })
          .then((res) => {
            console.log("✅ Stock updated successfully:", res.data);
          })
          .catch((error) => {
            console.error(
              `❌ Error updating stock for ${item.name} (${item._id}):`,
              error.response?.data || error.message
            );
          });
      }

      // 3️⃣ Send order confirmation email
      const totalAmount = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      const emailPayload = {
        to:  "kartarsingh.gothwal22@vit.edu", // ✅ Fallback email
        customerName: user?.name || "Valued Customer",
        orderId: Date.now(),
        totalAmount,
        items: cartItems.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
      };

      console.log("📧 Sending order email:", emailPayload);

      await axios
        .post(`${BACKEND_URL}/email/send-order-email`, emailPayload)
        .then(() => {
          console.log("✅ Order confirmation email sent!");
        })
        .catch((error) => {
          console.error("❌ Failed to send email:", error.response?.data || error);
        });

      // 4️⃣ Clear cart after successful checkout
      clearCart();
      setCartItems([]);
      setShowModal(false);
      setProcessing(false);

      alert("✅ Checkout successful! Confirmation email sent.");
      navigate("/products");
    } catch (error) {
      console.error("❌ Checkout failed:", error.response?.data || error.message);
      alert("❌ Checkout failed. Please try again.");
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-100">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>

        {items.length === 0 ? (
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body items-center text-center py-16">
              <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
              <p className="text-base-content/70 mb-6">
                Add some eco-friendly products to get started!
              </p>
              <button
                onClick={() => navigate("/products")}
                className="btn btn-primary"
              >
                Browse Products
              </button>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* 🛍️ Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item._id} className="card bg-base-200 shadow-lg">
                  <div className="card-body p-4">
                    <div className="flex gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-bold text-lg">{item.name}</h3>
                            <p className="text-sm text-base-content/70">
                              {item.categoryName}
                            </p>
                          </div>
                          <button
                            onClick={() => handleRemoveItem(item._id)}
                            className="btn btn-sm btn-ghost btn-circle"
                          >
                            ✕
                          </button>
                        </div>

                        <div className="flex justify-between items-center mt-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                handleUpdateQuantity(item._id, item.quantity - 1)
                              }
                              className="btn btn-xs btn-circle"
                              disabled={item.quantity <= 1}
                            >
                              -
                            </button>
                            <span className="w-8 text-center font-semibold">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleUpdateQuantity(item._id, item.quantity + 1)
                              }
                              className="btn btn-xs btn-circle"
                              disabled={
                                item.quantity >= (item.stockQuantity || 999)
                              }
                            >
                              +
                            </button>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-primary">
                              ₹{(item.price * item.quantity).toFixed(2)}
                            </div>
                            <div className="text-xs text-base-content/70">
                              ₹{item.price.toFixed(2)} each
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 🧾 Order Summary */}
            <div className="lg:col-span-1">
              <div className="card bg-base-200 shadow-xl sticky top-4">
                <div className="card-body">
                  <h2 className="card-title">Order Summary</h2>
                  <div className="divider my-2"></div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-semibold">
                        ₹{subtotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span className="font-semibold">
                        {shipping === 0 ? (
                          <span className="text-success">FREE</span>
                        ) : (
                          `₹${shipping.toFixed(2)}`
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="divider my-2"></div>

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">₹{total.toFixed(2)}</span>
                  </div>

                  <button
                    onClick={handleProceedToCheckout}
                    className="btn btn-primary btn-block mt-4"
                  >
                    {user ? "Proceed to Checkout" : "Sign In to Checkout"}
                  </button>

                  <button
                    onClick={() => navigate("/products")}
                    className="btn btn-outline btn-block"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ✅ Checkout Popup */}
      <CheckoutPopup
        show={showModal}
        handleClose={() => setShowModal(false)}
        cartItems={cartItems}
        totalPrice={total}
        handleCheckout={handleCheckout}
      />

      <Footer />
    </div>
  );
}

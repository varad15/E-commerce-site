import React from "react";

const CheckoutPopup = ({ show, handleClose, cartItems, totalPrice, handleCheckout }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm transition-opacity">
      <div className="bg-base-200 text-base-content rounded-2xl shadow-2xl w-full max-w-lg mx-4 border border-base-300 animate-fade-in">
        {/* Header */}
        <div className="flex justify-between items-center px-5 py-3 border-b border-base-300 bg-base-300/30 rounded-t-2xl">
          <h2 className="text-lg font-bold text-success">Confirm Checkout</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-5 max-h-[60vh] overflow-y-auto">
          {cartItems && cartItems.length > 0 ? (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between bg-base-100 rounded-lg p-3 border border-base-300"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover border border-base-300"
                    />
                    <div>
                      <p className="font-semibold text-base">{item.name}</p>
                      <p className="text-sm opacity-70">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="text-success font-semibold text-sm">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}

              {/* Total */}
              <div className="text-center border-t border-base-300 pt-4 mt-4">
                <p className="text-sm opacity-70">Total</p>
                <p className="text-2xl font-bold text-success">
                  ₹{totalPrice.toFixed(2)}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-center text-base-content/70 py-6">
              Your cart is empty.
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center px-5 py-3 border-t border-base-300 bg-base-300/30 rounded-b-2xl">
          <button
            onClick={handleClose}
            className="btn btn-outline border-base-300 hover:bg-base-300/40 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleCheckout}
            className="btn bg-success text-white hover:bg-green-600 border-none text-sm"
          >
            Confirm Purchase
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPopup;

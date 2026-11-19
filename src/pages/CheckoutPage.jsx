import React, { useState } from "react";
import { Link } from "react-router-dom";

// Routed page "/checkout" — itemized review + controlled shipping form.
const CheckoutPage = ({ cart, onClearCart }) => {
  // Has the order been submitted successfully?
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Controlled form state: every input is bound to this object.
  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    cardDetails: "",
  });

  // Invoice math.
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const taxes = subtotal * 0.06;
  const total = subtotal + taxes;

  // One handler updates whichever field fired the change (controlled inputs).
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit handler: stop the reload, validate, clear the cart, confirm.
  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple validation: no empty fields allowed.
    const allFilled = Object.values(formData).every(
      (value) => value.trim() !== "",
    );
    if (!allFilled) {
      alert("Please fill in all fields before placing your order.");
      return;
    }

    setIsSubmitted(true);
    onClearCart();
  };

  // Confirmation view after a successful order.
  if (isSubmitted) {
    return (
      <div className="checkout-success">
        <h2>✓ Order Placed Successfully</h2>
        <p>
          Thank you, {formData.fullName}! Your records are on the way to{" "}
          {formData.address}, {formData.city}. A confirmation has been sent for
          your order.
        </p>
        <Link className="btn btn-primary" to="/">
          Back to Catalog
        </Link>
      </div>
    );
  }

  // Edge case: nothing to check out.
  if (cart.length === 0) {
    return (
      <div className="empty-cart-page">
        <h2>Your cart is empty.</h2>
        <Link className="btn btn-secondary" to="/">
          Browse the catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>

      <div className="checkout-grid">
        {/* Controlled shipping form */}
        <form className="checkout-form" onSubmit={handleSubmit}>
          <h2>Shipping &amp; Payment</h2>

          <div className="form-group">
            <label htmlFor="fullName">Full Name *</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">Address *</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="city">City *</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="postalCode">Postal Code *</label>
            <input
              type="text"
              id="postalCode"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="cardDetails">Card Details *</label>
            <input
              type="text"
              id="cardDetails"
              name="cardDetails"
              placeholder="1234 5678 9012 3456"
              value={formData.cardDetails}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block btn-lg">
            Complete Order (${total.toFixed(2)})
          </button>
        </form>

        {/* Order summary / invoice */}
        <aside className="order-summary-card">
          <h3>Order Summary</h3>
          <ul className="summary-list">
            {cart.map((item) => (
              <li key={item.id} className="summary-row">
                <span>
                  {item.title} &times; {item.quantity}
                </span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <hr />
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Estimated Tax (6%)</span>
            <span>${taxes.toFixed(2)}</span>
          </div>
          <div className="summary-row total-row">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CheckoutPage;

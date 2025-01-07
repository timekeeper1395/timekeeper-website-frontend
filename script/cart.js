const cartContainer = document.getElementById("cart-container");
const proceedToPaymentBtn = document.getElementById("proceed-to-payment");
const proceedToHomePageBtn = document.getElementById("proceed-to-homepage");

let cart = JSON.parse(localStorage.getItem("cart")) || []; // Load cart from localStorage

// Render Cart Items
function renderCart() {
  cartContainer.innerHTML = ""; // Clear the container

  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>Your cart is empty.</p>";
    proceedToPaymentBtn.style.display = "none"; // Hide payment button
    return;
  }

  let totalAmount = 0;

  cart.forEach((item, index) => {
    const cartItem = document.createElement("div");
    cartItem.classList.add("cart-item");

    cartItem.innerHTML = `
      <div class="cart-item-details">
        <h4>${item.name}</h4>
        <p>Price: $${item.price}</p>
        <div class="quantity-controls">
          <button class="decrease-btn" data-index="${index}">-</button>
          <span>${item.quantity}</span>
          <button class="increase-btn" data-index="${index}">+</button>
        </div>
      </div>
      <button class="delete-btn" data-index="${index}">Remove</button>
    `;

    totalAmount += item.price * item.quantity;
    cartContainer.appendChild(cartItem);
  });

  const totalContainer = document.createElement("div");
  totalContainer.classList.add("cart-total");
  totalContainer.innerHTML = `<h4>Total Amount: $${totalAmount}</h4>`;
  cartContainer.appendChild(totalContainer);
  proceedToPaymentBtn.dataset.amount = totalAmount;

  // Add event listeners for increase, decrease, and delete buttons
  document.querySelectorAll(".increase-btn").forEach((btn) =>
    btn.addEventListener("click", increaseQuantity)
  );
  document.querySelectorAll(".decrease-btn").forEach((btn) =>
    btn.addEventListener("click", decreaseQuantity)
  );
  document.querySelectorAll(".delete-btn").forEach((btn) =>
    btn.addEventListener("click", deleteItem)
  );
}

// Increase Quantity
function increaseQuantity(event) {
  const index = event.target.dataset.index;
  cart[index].quantity += 1;
  localStorage.setItem("cart", JSON.stringify(cart)); // Save updated cart
  renderCart();
}

// Decrease Quantity
function decreaseQuantity(event) {
  const index = event.target.dataset.index;
  if (cart[index].quantity > 1) {
    cart[index].quantity -= 1;
  } else {
    // If quantity reaches 0, remove the item
    cart.splice(index, 1);
  }
  localStorage.setItem("cart", JSON.stringify(cart)); // Save updated cart
  renderCart();
}

// Delete Item
function deleteItem(event) {
  const index = event.target.dataset.index;
  cart.splice(index, 1); // Remove item from cart
  localStorage.setItem("cart", JSON.stringify(cart)); // Save updated cart
  renderCart();
}


// Proceed to Payment
proceedToPaymentBtn.addEventListener("click", async () => {
  const totalAmount = proceedToPaymentBtn.dataset.amount;

  // Replace with actual user information (e.g., fetched from localStorage or session)
  const userName = localStorage.getItem("email") || "Guest User";

  try {
    const response = await fetch("https://timekeeper-website-backend.onrender.com/api/payment/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: totalAmount, userName }), // Amount in cents
    });

    if (response.ok) {
      const { sessionId } = await response.json();
      const stripe = Stripe("pk_test_51QeWghLgaQTOHiq0kLswfRJbyR8tE3k90FgjLsBt4PnKnZD7C8bznccpogwWifctpOKHINfHPc2a8w9WxDNxRZ0P00kvhLOjdE"); // Replace with your Stripe publishable key
      emailjs.init("NavqjgpkbTbTiwmL7");
      emailjs.send("service_qwjg2ko", "template_8mfssmj", {
          userName: userName,
          amountPaid: totalAmount, // Convert cents to dollars
          paymentDate: new Date().toLocaleString(),
        })
        .then(
          function (response) {
            console.log("SUCCESS!", response.status, response.text);
            stripe.redirectToCheckout({ sessionId });
          },
          function (error) {
            console.error("FAILED...", error);
          }
        );
    } else {
      alert("Failed to initiate payment.");
    }
  } catch (error) {
    console.error("Payment error:", error);
    alert("An error occurred during payment.");
  }
});

// Proceed to Home Page
proceedToHomePageBtn.addEventListener("click", () => {
  window.location.href = "index.html"; // Redirect to the home page
});

// Render cart on page load
renderCart();
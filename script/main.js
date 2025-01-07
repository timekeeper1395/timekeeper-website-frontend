const menuBtn = document.getElementById("menu-btn");
const navLinks = document.getElementById("nav-links");
const menuBtnIcon = menuBtn.querySelector("i");

menuBtn.addEventListener("click", (e) => {
  navLinks.classList.toggle("open");

  const isOpen = navLinks.classList.contains("open");
  menuBtnIcon.setAttribute("class", isOpen ? "ri-close-line" : "ri-menu-line");
});

navLinks.addEventListener("click", (e) => {
  navLinks.classList.remove("open");
  menuBtnIcon.setAttribute("class", "ri-menu-line");
});

const scrollRevealOption = {
  distance: "50px",
  origin: "bottom",
  duration: 1000,
};

ScrollReveal().reveal(".header__image img", {
  ...scrollRevealOption,
  origin: "right",
});
ScrollReveal().reveal(".header__content h1", {
  ...scrollRevealOption,
  delay: 500,
});
ScrollReveal().reveal(".header__content p", {
  ...scrollRevealOption,
  delay: 1000,
});
ScrollReveal().reveal(".header__content h4", {
  ...scrollRevealOption,
  delay: 1500,
});
ScrollReveal().reveal(".header__content .header__btns", {
  ...scrollRevealOption,
  delay: 2000,
});

ScrollReveal().reveal(".story__image img", {
  ...scrollRevealOption,
  origin: "left",
});
ScrollReveal().reveal(".story__content .section__header", {
  ...scrollRevealOption,
  delay: 500,
});
ScrollReveal().reveal(".story__content h4", {
  ...scrollRevealOption,
  delay: 1000,
});
ScrollReveal().reveal(".story__content p", {
  ...scrollRevealOption,
  delay: 1500,
});
ScrollReveal().reveal(".story__content .story__btn", {
  ...scrollRevealOption,
  delay: 2000,
});

ScrollReveal().reveal(".client__image img", {
  ...scrollRevealOption,
  origin: "right",
});

const swiper = new Swiper(".swiper", {
  loop: true,
});

let isAuthenticated = false; // Tracks user authentication status

// Check authentication state on page load
document.addEventListener("DOMContentLoaded", () => {
  isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  updateNavbar();
});

// Update Navbar for Login/Logout
function updateNavbar() {
  const navbarUser = document.getElementById("navbar-user");
  if (isAuthenticated) {
    // If logged in, show "Logout"
    navbarUser.innerHTML = `<a href="#" id="logout-btn">Logout</a>`;
    document.getElementById("logout-btn").addEventListener("click", handleLogout);
  } else {
    // If not logged in, show "Login"
    navbarUser.innerHTML = `<a href="login.html">Login</a>`;
  }
}

// Handle Logout
function handleLogout() {
  isAuthenticated = false; // Clear authentication status
  localStorage.removeItem("email");
  localStorage.setItem("isAuthenticated", "false"); // Persist logout state
  localStorage.clear();
  alert("You have been logged out.");
  updateNavbar(); // Update navbar to show "Login"
  window.location.href = "login.html"; // Redirect to login page
}

let cart = JSON.parse(localStorage.getItem("cart")) || []; // Load cart from localStorage

// Add Product to Cart
function addToCart(product) {
  const existingProduct = cart.find((item) => item.id === product.id);

  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  updateCartCount();
  localStorage.setItem("cart", JSON.stringify(cart)); // Save cart to localStorage
  alert(`${product.name} added to cart.`);
}


// Update Cart Count in Icon
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || []; // Load cart from localStorage
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  
  const cartCountElement = document.getElementById("cart-count");
  if (cartCountElement) {
    cartCountElement.innerText = cartCount; // Update cart count in the DOM
  }
}

// Call `updateCartCount` on page load
document.addEventListener("DOMContentLoaded", updateCartCount);

document.getElementById("cart-icon").addEventListener("click", (e) => {
  e.preventDefault(); // Prevent default link behavior
  window.location.href = "cart.html"; // Redirect to cart.html
});


document.querySelectorAll(".add__cart").forEach((button) => {
  button.addEventListener("click", (event) => {
    const product = {
      id: event.target.getAttribute("data-id"),
      name: event.target.getAttribute("data-name"),
      price: parseFloat(event.target.getAttribute("data-price")),
    };

    addToCart(product);
  });
});

const modalWatches = [
  { id: "7", name: "C63 Sealander", price: 945, image: "/frontend/assets/arrival-7.png" },
  { id: "8", name: "Hamilton Field Khaki", price: 1199, image: "/frontend/assets/arrival-8.png" },
  { id: "9", name: "Baume Moonphase", price: 950, image: "/frontend/assets/arrival-9.png" },
  { id: "10", name: "PRX Powermatic 80", price: 675, image: "/frontend/assets/arrival-10.png" },
  { id: "11", name: "Alpinist SPB121", price: 1099, image: "/frontend/assets/arrival-11.png" },
  { id: "12", name: "Sub 200", price: 1100, image: "/frontend/assets/arrival-12.png" },
];

// DOM Elements
const showMoreBtn = document.getElementById("show-more-btn");
const modal = document.getElementById("watch-modal");
const closeModal = document.getElementById("close-modal");
const modalSearchBar = document.getElementById("modal-search-bar");
const modalFilterPrice = document.getElementById("modal-filter-price");
const modalWatchList = document.getElementById("modal-watch-list");

// Function to Render Watches in Modal
function renderModalWatches(watches) {
  modalWatchList.innerHTML = ""; // Clear previous watches

  if (watches.length === 0) {
    modalWatchList.innerHTML = "<p>No watches found.</p>";
    return;
  }

  watches.forEach((watch) => {
    const watchCard = document.createElement("div");
    watchCard.classList.add("arrival__card");

    watchCard.innerHTML = `
      <img src="${watch.image}" alt="${watch.name}" />
      <h4>${watch.name}</h4>
      <p>Price: $${watch.price}</p>
      <button class="btn add__cart" data-id="${watch.id}" data-name="${watch.name}" data-price="${watch.price}">
        Add to Cart
      </button>
    `;

    modalWatchList.appendChild(watchCard);
  });

  // Add event listeners to "Add to Cart" buttons
  const addToCartButtons = modalWatchList.querySelectorAll(".add__cart");
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const product = {
        id: button.dataset.id,
        name: button.dataset.name,
        price: button.dataset.price,
      };
      addToCart(product); // Use the existing addToCart function
    });
  });
}

// Open Modal
showMoreBtn.addEventListener("click", () => {
  modal.classList.remove("hidden");
  renderModalWatches(modalWatches); // Render all watches initially
});

// Close Modal
closeModal.addEventListener("click", () => {
  modal.classList.add("hidden");
});

// Filter Watches in Modal (Search and Price)
function filterModalWatches() {
  const searchText = modalSearchBar.value.toLowerCase();
  const maxPrice = modalFilterPrice.value ? parseFloat(modalFilterPrice.value) : Infinity;

  const filteredWatches = modalWatches.filter((watch) => {
    const matchesSearch = watch.name.toLowerCase().includes(searchText);
    const matchesPrice = watch.price <= maxPrice;

    return matchesSearch && matchesPrice;
  });

  renderModalWatches(filteredWatches);
}

// Event Listeners for Filters
modalSearchBar.addEventListener("input", filterModalWatches);
modalFilterPrice.addEventListener("input", filterModalWatches);

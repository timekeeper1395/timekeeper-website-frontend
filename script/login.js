document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  try {
    const response = await fetch("https://timekeeper-website-backend.onrender.com/auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });

    if (response.ok) {
      const data = await response.json();
      alert("Login successful!");
      localStorage.setItem("email", email);
      localStorage.setItem("isAuthenticated", "true"); // Persist authentication state
      window.location.href = "index.html"; // Redirect to home page
    } else {
      const errorData = await response.json();
      alert(errorData.message || "Login failed.");
    }
  } catch (error) {
    console.error("Login Error:", error);
    alert("An error occurred. Please try again.");
  }
});

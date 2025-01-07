document.getElementById("signup-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  try {
    const response = await fetch("https://timekeeper-website-backend.onrender.com/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
      credentials: "include",
    });

    if (response.ok) {
      alert("Sign-up successful! Redirecting to login page...");
      window.location.href = "../pages/login.html"; // Redirect to login page
    } else {
      const errorData = await response.json();
      alert(errorData.message || "Sign-up failed.");
    }
  } catch (error) {
    console.error("Sign-Up Error:", error);
    alert("An error occurred. Please try again.");
  }
});

// Frontend middleware
window.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("/api/auth/me", {
      credentials: "same-origin",
    });

    const data = await res.json();

    if(!data.authenticated || !data.user) {
      window.location.href = "/index.html";
    } else {
      document.getElementById("user-email").textContent = data.user.email;
    }

    importLinks();
  } catch (err) {
    console.error(err);
    window.location.href = "/index.html"
  }
});

const profileButton = document.getElementById("profile-button");
const userDataWrapper = document.getElementById("user-data-wrapper");

profileButton.addEventListener("click", () => {
  userDataWrapper.classList.toggle("hidden");
});

// Logout 
const logoutBtn = document.getElementById("logout-button");

if(logoutBtn) {
  logoutBtn.addEventListener("click", async() => {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "same-origin",
    });

    window.location.href = "/index.html";
  });
};

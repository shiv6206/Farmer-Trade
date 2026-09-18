const profileMenus = document.querySelectorAll(".profile-menu");

profileMenus.forEach(function (profileMenu) {
    const profileButton = profileMenu.querySelector(".profile-button");
    const logoutButton = profileMenu.querySelector("[data-action=\"logout\"]");

    if (!profileButton) {
        return;
    }

    profileButton.addEventListener("click", function (event) {
        event.preventDefault();
        profileMenu.classList.toggle("open");
    });

    if (logoutButton) {
        logoutButton.addEventListener("click", function () {
            localStorage.removeItem("token");
            sessionStorage.removeItem("aapki mandiUserRole");
            sessionStorage.removeItem("aapki mandiLoggedIn");
            sessionStorage.removeItem("aapki mandiLoginMobile");
            window.location.replace("index.html");
        });
    }
});

document.addEventListener("click", function (event) {
    profileMenus.forEach(function (profileMenu) {
        if (!profileMenu.contains(event.target)) {
            profileMenu.classList.remove("open");
        }
    });
});

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        profileMenus.forEach(function (profileMenu) {
            profileMenu.classList.remove("open");
        });
    }
});

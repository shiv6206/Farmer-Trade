/* =========================================================
   Farmer Trade — LOGIN
   =========================================================

   ROLE SYSTEM:

   The login page supports:

       farmer
       buyer

   After successful login, the selected role is stored in:

       sessionStorage:
       "Farmer TradeUserRole"

   Other common pages such as:

       profile.html
       support.html
       notifications.html
       market-prices.html

   can read this value to determine which user's
   information/UI should be displayed.

   IMPORTANT:

   This is temporary frontend authentication.

   Later the backend should authenticate the user and
   return the actual role from the server.
   ========================================================= */


/* =========================================================
   ELEMENTS
   ========================================================= */

const loginForm =
    document.getElementById("loginForm");

const mobileInput =
    document.getElementById("mobile");

const passwordInput =
    document.getElementById("password");

const passwordToggle =
    document.getElementById("passwordToggle");

const mobileError =
    document.getElementById("mobileError");

const passwordError =
    document.getElementById("passwordError");

const roleError =
    document.getElementById("roleError");

const formMessage =
    document.getElementById("formMessage");

const forgotPassword =
    document.getElementById("forgotPassword");

/* =========================================================
   MOBILE NUMBER
   ========================================================= */

mobileInput.addEventListener(
    "input",
    function () {

        this.value =
            this.value
                .replace(/\D/g, "")
                .slice(0, 10);

        mobileError.textContent = "";
        formMessage.textContent = "";

    }
);


/* =========================================================
   PASSWORD VISIBILITY
   ========================================================= */

passwordToggle.addEventListener(
    "click",
    function () {

        const isPassword =
            passwordInput.type === "password";


        passwordInput.type =
            isPassword
                ? "text"
                : "password";


        this.textContent =
            isPassword
                ? "Hide"
                : "Show";


        this.setAttribute(
            "aria-label",
            isPassword
                ? "Hide password"
                : "Show password"
        );

    }
);


/* =========================================================
   VALIDATION
   ========================================================= */

function validateLogin() {

    let valid = true;


    mobileError.textContent = "";
    passwordError.textContent = "";
    roleError.textContent = "";
    formMessage.textContent = "";


    const mobile =
        mobileInput.value.trim();

    const password =
        passwordInput.value;


    const selectedRole =
        document.querySelector(
            'input[name="role"]:checked'
        );


    /* =====================================================
       MOBILE
       ===================================================== */

    if (!/^[6-9]\d{9}$/.test(mobile)) {

        mobileError.textContent =
            "Enter a valid 10-digit Indian mobile number.";

        valid = false;

    }


    /* =====================================================
       PASSWORD
       ===================================================== */

    if (password.length === 0) {

        passwordError.textContent =
            "Please enter your OTP.";

        valid = false;

    }


    /* =====================================================
       ROLE
       ===================================================== */

    if (!selectedRole) {

        roleError.textContent =
            "Please select Farmer or Buyer.";

        valid = false;

    }


    return valid;

}


/* =========================================================
   FORGOT PASSWORD / GET OTP
   ========================================================= */

forgotPassword.addEventListener(
    "click",
    async function (event) {
        event.preventDefault();

        const mobile = mobileInput.value.trim();
        if (!/^[6-9]\d{9}$/.test(mobile)) {
            mobileError.textContent = "Enter a valid 10-digit Indian mobile number first.";
            return;
        }

        formMessage.textContent = "Sending OTP...";
        formMessage.style.color = "blue";

        try {
            const response = await fetch("http://localhost:5000/api/auth/send-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone: mobile })
            });
            const data = await response.json();

            if (response.ok) {
                formMessage.textContent = data.otp
                    ? "Development OTP: " + data.otp
                    : "OTP sent. Check your phone.";
                formMessage.style.color = "green";
                if (data.otp) passwordInput.value = data.otp;
                return;
            }

            formMessage.textContent = data.message || "Unable to send OTP.";
            formMessage.style.color = "red";

        } catch (err) {
            formMessage.textContent = "Server unavailable. Please try again later.";
            formMessage.style.color = "red";
        }
    }
);

/* =========================================================
   LOGIN
   ========================================================= */

loginForm.addEventListener(
    "submit",
    async function (event) {
        event.preventDefault();

        if (!validateLogin()) {
            return;
        }

        const mobile = mobileInput.value.trim();
        const otp = passwordInput.value;
        const selectedRole = document.querySelector('input[name="role"]:checked').value;

        formMessage.textContent = "Verifying...";
        formMessage.style.color = "blue";

        try {
            const response = await fetch("http://localhost:5000/api/auth/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    phone: mobile,
                    otp: otp,
                    role: selectedRole.toUpperCase(),
                    name: "Hackathon User",
                    district: "Nashik"
                })
            });
            const data = await response.json();

            if (response.ok && data?.token && data?.user?.role) {
                localStorage.setItem("token", data.token);
                sessionStorage.setItem("Farmer TradeUserRole", String(data.user.role).toLowerCase());
                sessionStorage.setItem("Farmer TradeLoggedIn", "true");
                sessionStorage.setItem("Farmer TradeLoginMobile", mobile);
                sessionStorage.setItem("Farmer TradeSignupRole", String(data.user.role).toLowerCase());

                if (String(data.user.role).toUpperCase() === "FARMER") {
                    window.location.replace("dashboard.html");
                } else {
                    window.location.replace("buyer-dashboard.html");
                }
                return;
            }

            formMessage.textContent = data.message || "Invalid OTP.";
            formMessage.style.color = "red";

        } catch (err) {
            formMessage.textContent = "Server unavailable. Please try again later.";
            formMessage.style.color = "red";
        }
    }
);
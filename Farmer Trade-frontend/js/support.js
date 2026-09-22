/* =========================================================
Farmer Trade — SUPPORT
ROLE-AWARE FRONTEND
========================================================= */


/* =========================================================
ROLE
========================================================= */

const storedRole =
    sessionStorage.getItem("Farmer TradeUserRole");

const signupRole =
    sessionStorage.getItem("Farmer TradeSignupRole");


/*
 * Login role has priority.
 *
 * We only READ the role here.
 * We do NOT change the stored role.
 */

const userRole =
    storedRole === "buyer" || storedRole === "farmer"
        ? storedRole
        : (
            signupRole === "buyer" || signupRole === "farmer"
                ? signupRole
                : ""
        );


/* =========================================================
ELEMENTS
========================================================= */

const menuButton =
    document.getElementById("menuButton");

const mainNav =
    document.getElementById("mainNav");

const dashboardNavLink =
    document.getElementById("dashboardNavLink");

const supportTitle =
    document.getElementById("supportTitle");

const supportDescription =
    document.getElementById("supportDescription");

const helpTitleOne =
    document.getElementById("helpTitleOne");

const helpTextOne =
    document.getElementById("helpTextOne");

const helpIconOne =
    document.getElementById("helpIconOne");

const helpTitleTwo =
    document.getElementById("helpTitleTwo");

const helpTextTwo =
    document.getElementById("helpTextTwo");

const helpIconTwo =
    document.getElementById("helpIconTwo");

const helpTitleThree =
    document.getElementById("helpTitleThree");

const helpTextThree =
    document.getElementById("helpTextThree");

const helpIconThree =
    document.getElementById("helpIconThree");

const faqList =
    document.getElementById("faqList");

const contactHeading =
    document.getElementById("contactHeading");

const contactDescription =
    document.getElementById("contactDescription");

const supportCategory =
    document.getElementById("supportCategory");

const supportForm =
    document.getElementById("supportForm");

const formStatus =
    document.getElementById("formStatus");

const sellNavLink =
    document.getElementById("sellNavLink");

const profileButton =
    document.getElementById("profileButton");

const profileInitial =
    document.getElementById("profileInitial");

const noteHeading =
    document.getElementById("noteHeading");

const noteDescription =
    document.getElementById("noteDescription");


/* =========================================================
ROLE-AWARE NAVIGATION
========================================================= */

function setupNavigation() {

    /* =====================================================
       FARMER
       ===================================================== */

    if (userRole === "farmer") {

        if (dashboardNavLink) {

            dashboardNavLink.href =
                "dashboard.html";

        }


        if (sellNavLink) {

            sellNavLink.href =
                "lots.html";

            sellNavLink.textContent =
                "Produce";

        }


        if (profileInitial) {

            profileInitial.textContent =
                "F";

        }


        return;
    }


    /* =====================================================
       BUYER
       ===================================================== */

    if (userRole === "buyer") {

        if (dashboardNavLink) {

            dashboardNavLink.href =
                "buyer-dashboard.html";

        }


        if (sellNavLink) {

            sellNavLink.href =
                "lots.html";

            sellNavLink.textContent =
                "Produce";

        }


        if (profileInitial) {

            profileInitial.textContent =
                "B";

        }


        return;
    }


    /* =====================================================
       NO ROLE
       ===================================================== */

    if (dashboardNavLink) {

        dashboardNavLink.href =
            "index.html";

    }


    if (sellNavLink) {

        sellNavLink.href =
            "lots.html";

        sellNavLink.textContent =
            "Produce";

    }


    if (profileInitial) {

        profileInitial.textContent =
            "F";

    }

}


/* =========================================================
MOBILE NAVIGATION
========================================================= */

if (menuButton && mainNav) {

    menuButton.addEventListener(
        "click",
        () => {

            const isOpen =
                mainNav.classList.toggle("open");


            menuButton.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

        }
    );


    mainNav
        .querySelectorAll("a")
        .forEach(
            link => {

                link.addEventListener(
                    "click",
                    () => {

                        mainNav.classList.remove(
                            "open"
                        );


                        menuButton.setAttribute(
                            "aria-expanded",
                            "false"
                        );

                    }
                );

            }
        );

}


/* =========================================================
FAQ DATA
========================================================= */

const sharedFAQs = [

    {
        question:
            "How do I update my profile?",

        answer:
            "Open your Profile page and select Edit Profile. You can update your personal information and other account details there."
    },

    {
        question:
            "How can I check market prices?",

        answer:
            "Open Market Prices from the navigation menu to explore crop prices and compare available market information."
    },

    {
        question:
            "What if I find incorrect information?",

        answer:
            "Send us a support request and clearly describe the incorrect information so the support team can review it."
    },

    {
        question:
            "How can I contact support?",

        answer:
            "Choose the appropriate category in the support form, describe your issue and submit your request."
    }

];


const farmerFAQs = [

    {
        question:
            "How do I list my produce?",

        answer:
            "Open Sell Produce and enter the crop, quantity, expected price and other required information to create your listing."
    },

    {
        question:
            "How can I find buyers for my produce?",

        answer:
            "Create a clear produce listing with accurate crop and quantity information. Buyers can then discover your available produce through the marketplace."
    },

    {
        question:
            "How do I update my produce listing?",

        answer:
            "Open your produce listings from the dashboard and select the listing you want to edit. You can update available quantity, price and other information."
    },

    {
        question:
            "How can I understand market prices?",

        answer:
            "Use the Market Prices section to compare current crop prices and use that information when deciding how to price your produce."
    }

];


const buyerFAQs = [

    {
        question:
            "How do I find produce to buy?",

        answer:
            "Open the marketplace or relevant buyer section from your dashboard to explore available produce listings and their details."
    },

    {
        question:
            "How can I find farmers selling a specific crop?",

        answer:
            "Use the marketplace filters and search options to narrow listings by crop and other available information."
    },

    {
        question:
            "How can I contact a farmer?",

        answer:
            "Open a suitable produce listing and use the available contact or enquiry option to connect with the farmer."
    },

    {
        question:
            "How do I compare market prices before buying?",

        answer:
            "Use Market Prices to review available crop price information before deciding which produce listing best fits your requirement."
    }

];


/* =========================================================
ROLE-BASED QUICK HELP
========================================================= */

function setupRoleContent() {

    /* =====================================================
       FARMER
       ===================================================== */

    if (userRole === "farmer") {

        if (profileInitial) {

            profileInitial.textContent =
                "F";

        }


        supportTitle.innerHTML =
            "We're here to<br><span>help you.</span>";


        supportDescription.textContent =
            "Get help with selling your produce, finding buyers, market prices, your account and everything you need to make the most of Farmer Trade.";


        helpIconOne.textContent =
            "+";


        helpTitleOne.textContent =
            "Sell Produce";


        helpTextOne.textContent =
            "Need help creating, updating or managing your produce listings?";


        helpIconTwo.textContent =
            "₹";


        helpTitleTwo.textContent =
            "Market Prices";


        helpTextTwo.textContent =
            "Understand crop prices and use market information when deciding your selling price.";


        helpIconThree.textContent =
            "?";


        helpTitleThree.textContent =
            "Find Buyers";


        helpTextThree.textContent =
            "Need help understanding how buyers discover and enquire about your produce?";


        contactHeading.textContent =
            "Need help selling?";


        contactDescription.textContent =
            "Tell us about your listing, buyer enquiry, market price or account issue and our support team can assist you.";


        noteHeading.textContent =
            "Having trouble with a sale?";


        noteDescription.textContent =
            "Tell us what is happening with your produce listing or buyer interaction and we'll help you find the right direction.";


        setupCategories([
            "Selling Produce",
            "Finding Buyers",
            "Market Prices",
            "Account",
            "Other"
        ]);


        renderFAQs([
            ...farmerFAQs,
            ...sharedFAQs
        ]);


        return;
    }


    /* =====================================================
       BUYER
       ===================================================== */

    if (userRole === "buyer") {

        if (profileInitial) {

            profileInitial.textContent =
                "B";

        }


        supportTitle.innerHTML =
            "We're here to<br><span>help you.</span>";


        supportDescription.textContent =
            "Get help finding produce, connecting with farmers, understanding market prices, managing your account and everything else you need on Farmer Trade.";


        helpIconOne.textContent =
            "⌕";


        helpTitleOne.textContent =
            "Find Produce";


        helpTextOne.textContent =
            "Need help finding the right crop, quantity or produce listing?";


        helpIconTwo.textContent =
            "₹";


        helpTitleTwo.textContent =
            "Market Prices";


        helpTextTwo.textContent =
            "Compare crop prices and understand market information before making a purchase.";


        helpIconThree.textContent =
            "?";


        helpTitleThree.textContent =
            "Contact Farmers";


        helpTextThree.textContent =
            "Need help contacting a farmer or enquiring about available produce?";


        contactHeading.textContent =
            "Need help finding produce?";


        contactDescription.textContent =
            "Tell us about the crop you're looking for, a farmer enquiry, market information or your account issue.";


        noteHeading.textContent =
            "Can't find what you're looking for?";


        noteDescription.textContent =
            "Tell us what produce you need and what you're trying to find. We'll help you understand the right direction on Farmer Trade.";


        setupCategories([
            "Finding Produce",
            "Contacting Farmers",
            "Market Prices",
            "Account",
            "Other"
        ]);


        renderFAQs([
            ...buyerFAQs,
            ...sharedFAQs
        ]);


        return;
    }


    /* =====================================================
       NO ROLE / GENERAL
       ===================================================== */

    if (profileInitial) {

        profileInitial.textContent =
            "F";

    }


    supportDescription.textContent =
        "Get help with your account, market information, produce listings, buying and anything else you need while using Farmer Trade.";


    helpIconOne.textContent =
        "?";


    helpTitleOne.textContent =
        "Account Help";


    helpTextOne.textContent =
        "Need help with your profile, login or account information?";


    helpIconTwo.textContent =
        "₹";


    helpTitleTwo.textContent =
        "Market Prices";


    helpTextTwo.textContent =
        "Having trouble understanding market prices or crop information?";


    helpIconThree.textContent =
        "+";


    helpTitleThree.textContent =
        "Marketplace Help";


    helpTextThree.textContent =
        "Need help buying produce or creating a produce listing?";


    setupCategories([
        "Account",
        "Market Prices",
        "Selling Produce",
        "Finding Produce",
        "Other"
    ]);


    renderFAQs(
        sharedFAQs
    );

}


/* =========================================================
CATEGORY OPTIONS
========================================================= */

function setupCategories(categories) {

    supportCategory.innerHTML = "";


    const defaultOption =
        document.createElement("option");


    defaultOption.value =
        "";


    defaultOption.textContent =
        "Select a category";


    supportCategory.appendChild(
        defaultOption
    );


    categories.forEach(
        category => {

            const option =
                document.createElement("option");


            option.value =
                category;


            option.textContent =
                category;


            supportCategory.appendChild(
                option
            );

        }
    );

}


/* =========================================================
FAQ RENDER
========================================================= */

function renderFAQs(faqs) {

    faqList.innerHTML = "";


    faqs.forEach(
        faq => {

            const details =
                document.createElement(
                    "details"
                );


            details.className =
                "faq-item";


            const summary =
                document.createElement(
                    "summary"
                );


            summary.textContent =
                faq.question;


            const icon =
                document.createElement(
                    "span"
                );


            icon.textContent =
                "+";


            summary.appendChild(
                icon
            );


            const answer =
                document.createElement(
                    "p"
                );


            answer.textContent =
                faq.answer;


            details.appendChild(
                summary
            );


            details.appendChild(
                answer
            );


            faqList.appendChild(
                details
            );

        }
    );

}


/* =========================================================
SUPPORT FORM
========================================================= */

if (supportForm) {

    supportForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            formStatus.textContent =
                "";


            formStatus.className =
                "form-status";


            const submitButton =
                supportForm.querySelector(
                    ".submit-button"
                );


            const formData =
                new FormData(
                    supportForm
                );


            const supportRequest = {

                name:
                    String(
                        formData.get("name") || ""
                    ).trim(),

                phone:
                    String(
                        formData.get("phone") || ""
                    ).trim(),

                category:
                    formData.get("category"),

                subject:
                    String(
                        formData.get("subject") || ""
                    ).trim(),

                message:
                    String(
                        formData.get("message") || ""
                    ).trim(),

                role:
                    userRole || null

            };


            /* =================================================
               BASIC FRONTEND VALIDATION
               ================================================= */

            if (
                !/^[6-9]\d{9}$/.test(
                    supportRequest.phone
                )
            ) {

                formStatus.textContent =
                    "Please enter a valid 10-digit Indian mobile number.";


                formStatus.classList.add(
                    "error"
                );


                return;
            }


            if (
                !supportRequest.category
            ) {

                formStatus.textContent =
                    "Please select a support category.";


                formStatus.classList.add(
                    "error"
                );


                return;
            }


            if (
                !supportRequest.subject ||
                !supportRequest.message
            ) {

                formStatus.textContent =
                    "Please provide a subject and message.";


                formStatus.classList.add(
                    "error"
                );


                return;
            }


            /* =================================================
               LOADING
               ================================================= */

            submitButton.classList.add(
                "loading"
            );


            /* =================================================
               TEMPORARY FRONTEND DEMO
               ================================================= */

            await new Promise(
                resolve =>
                    setTimeout(
                        resolve,
                        500
                    )
            );


            formStatus.textContent =
                "Your support request has been prepared successfully.";


            formStatus.classList.add(
                "success"
            );


            console.log(
                "Support request:",
                supportRequest
            );


            supportForm.reset();


            submitButton.classList.remove(
                "loading"
            );

        }
    );

}


/* =========================================================
INITIALIZE
========================================================= */

setupNavigation();

setupRoleContent();
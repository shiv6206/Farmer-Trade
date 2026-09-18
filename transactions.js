/* =========================================================
   aapki mandi — TRANSACTIONS
   ROLE-AWARE FRONTEND
   ========================================================= */


/* =========================================================
   ROLE
   ========================================================= */

const userRole =
    sessionStorage.getItem("aapki mandiUserRole") || "";


/* =========================================================
   CONFIGURATION
   ========================================================= */

/*
    BACKEND TEAM:

    Change this to the actual API base URL.

    Example:

    const API_BASE_URL = "/api";

    Suggested endpoint:

    GET /api/transactions/me

    The backend should determine the authenticated
    user from the session/token.

    DO NOT trust buyerId/farmerId sent from browser.
*/

const API_BASE_URL = "/api";


/*
    DEMO MODE

    Keep true while backend endpoints are not connected.

    Set to false when backend is ready.
*/

const DEMO_MODE = true;


/* =========================================================
   ELEMENTS
   ========================================================= */

const menuButton =
    document.getElementById("menuButton");

const mainNav =
    document.getElementById("mainNav");

const marketplaceLinkOne =
    document.getElementById("marketplaceLinkOne");

const marketplaceLinkTwo =
    document.getElementById("marketplaceLinkTwo");

const marketplaceLinkThree =
    document.getElementById("marketplaceLinkThree");

const profileInitial =
    document.getElementById("profileInitial");

const pageTitle =
    document.getElementById("pageTitle");

const pageDescription =
    document.getElementById("pageDescription");

const transactionHeading =
    document.getElementById("transactionHeading");

const valueLabel =
    document.getElementById("valueLabel");

const noteHeading =
    document.getElementById("noteHeading");

const noteDescription =
    document.getElementById("noteDescription");

const totalTransactions =
    document.getElementById("totalTransactions");

const activeTransactions =
    document.getElementById("activeTransactions");

const completedTransactions =
    document.getElementById("completedTransactions");

const totalValue =
    document.getElementById("totalValue");

const statusFilter =
    document.getElementById("statusFilter");

const transactionList =
    document.getElementById("transactionList");

const transactionCount =
    document.getElementById("transactionCount");

const emptyState =
    document.getElementById("emptyState");

const transactionModal =
    document.getElementById("transactionModal");

const modalOverlay =
    document.getElementById("modalOverlay");

const modalClose =
    document.getElementById("modalClose");

const modalCropName =
    document.getElementById("modalCropName");

const modalStatus =
    document.getElementById("modalStatus");

const modalTotalValue =
    document.getElementById("modalTotalValue");

const modalLotId =
    document.getElementById("modalLotId");

const modalCounterpartyLabel =
    document.getElementById(
        "modalCounterpartyLabel"
    );

const modalCounterparty =
    document.getElementById(
        "modalCounterparty"
    );

const modalQuantity =
    document.getElementById(
        "modalQuantity"
    );

const modalPrice =
    document.getElementById(
        "modalPrice"
    );

const modalDate =
    document.getElementById(
        "modalDate"
    );

const modalLocation =
    document.getElementById(
        "modalLocation"
    );


/* =========================================================
   MOBILE NAVIGATION
   ========================================================= */

if (menuButton && mainNav) {

    menuButton.addEventListener(
        "click",
        function () {

            const opened =
                mainNav.classList.toggle(
                    "open"
                );

            menuButton.setAttribute(
                "aria-expanded",
                opened ? "true" : "false"
            );

            menuButton.setAttribute(
                "aria-label",
                opened
                    ? "Close navigation"
                    : "Open navigation"
            );

        }
    );


    mainNav
        .querySelectorAll("a")
        .forEach(
            function (link) {

                link.addEventListener(
                    "click",
                    function () {

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


    document.addEventListener(
        "click",
        function (event) {

            if (
                !mainNav.contains(
                    event.target
                ) &&
                !menuButton.contains(
                    event.target
                )
            ) {

                mainNav.classList.remove(
                    "open"
                );

                menuButton.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }

        }
    );

}


/* =========================================================
   DEMO TRANSACTIONS
   ========================================================= */

/*
    Temporary frontend records.

    Backend should eventually return objects
    approximately following this structure:

    {
        id,
        listingId,
        lotId,
        buyerId,
        farmerId,
        crop,
        quantity,
        unit,
        agreedPrice,
        totalValue,
        state,
        district,
        buyerName,
        farmerName,
        status,
        createdAt
    }
*/


const demoTransactions = [

    {
        id:
            "transaction-demo-001",

        listingId:
            "listing-demo-001",

        lotId:
            "LOT-PN-001",

        buyerId:
            "buyer-demo-001",

        farmerId:
            "farmer-demo-001",

        crop:
            "Wheat",

        quantity:
            10,

        unit:
            "quintals",

        agreedPrice:
            2450,

        totalValue:
            24500,

        state:
            "Maharashtra",

        district:
            "Pune",

        buyerName:
            "Buyer",

        farmerName:
            "Farmer",

        status:
            "confirmed",

        createdAt:
            "28 Aug 2026"

    },


    {
        id:
            "transaction-demo-002",

        listingId:
            "listing-demo-003",

        lotId:
            "LOT-NS-003",

        buyerId:
            "buyer-demo-001",

        farmerId:
            "farmer-demo-003",

        crop:
            "Red Onion",

        quantity:
            8,

        unit:
            "quintals",

        agreedPrice:
            2180,

        totalValue:
            17440,

        state:
            "Maharashtra",

        district:
            "Nashik",

        buyerName:
            "Buyer",

        farmerName:
            "Farmer",

        status:
            "in-logistics",

        createdAt:
            "25 Aug 2026"

    },


    {
        id:
            "transaction-demo-003",

        listingId:
            "listing-demo-005",

        lotId:
            "LOT-IN-005",

        buyerId:
            "buyer-demo-001",

        farmerId:
            "farmer-demo-005",

        crop:
            "Chickpea",

        quantity:
            5,

        unit:
            "quintals",

        agreedPrice:
            5600,

        totalValue:
            28000,

        state:
            "Madhya Pradesh",

        district:
            "Indore",

        buyerName:
            "Buyer",

        farmerName:
            "Farmer",

        status:
            "completed",

        createdAt:
            "19 Aug 2026"

    },


    {
        id:
            "transaction-demo-004",

        listingId:
            "listing-demo-006",

        lotId:
            "LOT-NZ-006",

        buyerId:
            "buyer-demo-001",

        farmerId:
            "farmer-demo-006",

        crop:
            "Turmeric",

        quantity:
            3,

        unit:
            "quintals",

        agreedPrice:
            7600,

        totalValue:
            22800,

        state:
            "Telangana",

        district:
            "Nizamabad",

        buyerName:
            "Buyer",

        farmerName:
            "Farmer",

        status:
            "pending",

        createdAt:
            "29 Aug 2026"

    },


    /* -----------------------------------------------------
       FARMER-SIDE DEMO TRANSACTIONS
       ----------------------------------------------------- */

    {
        id:
            "transaction-demo-005",

        listingId:
            "listing-demo-farmer-001",

        lotId:
            "LOT-PN-F01",

        buyerId:
            "buyer-demo-002",

        farmerId:
            "farmer-demo-001",

        crop:
            "Basmati Rice",

        quantity:
            12,

        unit:
            "quintals",

        agreedPrice:
            8400,

        totalValue:
            100800,

        state:
            "Maharashtra",

        district:
            "Pune",

        buyerName:
            "Buyer",

        farmerName:
            "Farmer",

        status:
            "confirmed",

        createdAt:
            "27 Aug 2026"

    },


    {
        id:
            "transaction-demo-006",

        listingId:
            "listing-demo-farmer-002",

        lotId:
            "LOT-PN-F02",

        buyerId:
            "buyer-demo-003",

        farmerId:
            "farmer-demo-001",

        crop:
            "Onion",

        quantity:
            15,

        unit:
            "quintals",

        agreedPrice:
            2200,

        totalValue:
            33000,

        state:
            "Maharashtra",

        district:
            "Pune",

        buyerName:
            "Buyer",

        farmerName:
            "Farmer",

        status:
            "in-logistics",

        createdAt:
            "23 Aug 2026"

    },

    {
        id:
            "transaction-demo-007",

        listingId:
            "listing-demo-farmer-003",

        lotId:
            "LOT-PN-F03",

        buyerId:
            "buyer-demo-004",

        farmerId:
            "farmer-demo-001",

        crop:
            "Wheat",

        quantity:
            20,

        unit:
            "quintals",

        agreedPrice:
            2425,

        totalValue:
            48500,

        state:
            "Maharashtra",

        district:
            "Pune",

        buyerName:
            "Buyer",

        farmerName:
            "Farmer",

        status:
            "completed",

        createdAt:
            "15 Aug 2026"

    }

];


let allTransactions = [];

let currentTransactions = [];

let currentSelectedTransaction = null;


/* =========================================================
   ROLE CONFIGURATION
   ========================================================= */

function setupRoleContent() {

    if (userRole === "farmer") {

        profileInitial.textContent =
            "F";


        /*
            Farmer marketplace navigation:

            Sell Produce
            My Lots
            Bidding
            Logistics
            Transactions
        */

        marketplaceLinkOne.textContent =
            "Sell Produce";

        marketplaceLinkOne.href =
            "lots.html";


        marketplaceLinkTwo.textContent =
            "Bidding";

        marketplaceLinkTwo.href =
            "bidding.html";


        marketplaceLinkThree.textContent =
            "Logistics";

        marketplaceLinkThree.href =
            "logistics.html";


        pageTitle.innerHTML =
            "Keep every deal<br><span>in one place.</span>";


        pageDescription.textContent =
            "Track the produce you've sold, agreed prices, buyer details and transaction progress through aapki mandi.";


        transactionHeading.textContent =
            "Your sales";


        valueLabel.textContent =
            "TOTAL SALES VALUE";


        noteHeading.textContent =
            "From agreement to completion.";


        noteDescription.textContent =
            "Track each sale as the buyer confirms the deal, logistics are arranged and the transaction reaches completion.";


        return;

    }


    if (userRole === "buyer") {

        profileInitial.textContent =
            "B";


        /*
            Buyer marketplace navigation:

            Buy Produce
            Browse/search available lots
            Bids/Offers
            Logistics
            Transactions
        */

        marketplaceLinkOne.textContent =
            "Buy Produce";

        marketplaceLinkOne.href =
            "lots.html";


        marketplaceLinkTwo.textContent =
            "Bids / Offers";

        marketplaceLinkTwo.href =
            "bidding.html";


        marketplaceLinkThree.textContent =
            "Logistics";

        marketplaceLinkThree.href =
            "logistics.html";


        pageTitle.innerHTML =
            "Keep every deal<br><span>in one place.</span>";


        pageDescription.textContent =
            "Track your produce purchases, agreed prices, farmer details and transaction progress through aapki mandi.";


        transactionHeading.textContent =
            "Your purchases";


        valueLabel.textContent =
            "TOTAL PURCHASE VALUE";


        noteHeading.textContent =
            "From agreement to completion.";


        noteDescription.textContent =
            "Track each purchase as the deal is confirmed, logistics are arranged and the transaction reaches completion.";


        return;

    }


    /*
        NO ROLE

        Keep the page usable without a role,
        but don't expose a misleading marketplace
        experience.
    */

    profileInitial.textContent =
        "F";


    marketplaceLinkOne.textContent =
        "Produce";

    marketplaceLinkOne.href =
        "lots.html";


    marketplaceLinkTwo.textContent =
        "Bidding";

    marketplaceLinkTwo.href =
        "bidding.html";


    marketplaceLinkThree.textContent =
        "Logistics";

    marketplaceLinkThree.href =
        "logistics.html";


    pageDescription.textContent =
        "Track marketplace transactions and monitor the progress of your produce deals through aapki mandi.";

}


/* =========================================================
   GET TRANSACTIONS
   ========================================================= */

async function fetchTransactions() {

    /*
        BACKEND ENDPOINT:

        GET /api/transactions/me

        Backend determines the authenticated user
        and returns only their transactions.
    */


    if (DEMO_MODE) {

        /*
            Farmer sees transactions where farmerId
            belongs to the current farmer demo account.

            Buyer sees transactions where buyerId
            belongs to the current buyer demo account.
        */

        if (userRole === "farmer") {

            return demoTransactions.filter(
                transaction =>
                    transaction.farmerId ===
                    "farmer-demo-001"
            );

        }


        if (userRole === "buyer") {

            return demoTransactions.filter(
                transaction =>
                    transaction.buyerId ===
                    "buyer-demo-001"
            );

        }


        return [];

    }


    const response =
        await fetch(
            `${API_BASE_URL}/transactions/me`,
            {
                method: "GET",

                headers: {
                    "Accept":
                        "application/json"
                },

                credentials: "include"
            }
        );


    if (!response.ok) {

        throw new Error(
            "Unable to load transactions."
        );

    }


    const data =
        await response.json();


    return data.transactions || data;

}


/* =========================================================
   RENDER SUMMARY
   ========================================================= */

function renderSummary(transactions) {

    const total =
        transactions.length;


    const active =
        transactions.filter(
            transaction =>
                transaction.status !==
                    "completed" &&
                transaction.status !==
                    "cancelled"
        ).length;


    const completed =
        transactions.filter(
            transaction =>
                transaction.status ===
                "completed"
        ).length;


    const value =
        transactions.reduce(
            (
                totalAmount,
                transaction
            ) =>
                totalAmount +
                Number(
                    transaction.totalValue || 0
                ),
            0
        );


    totalTransactions.textContent =
        total;


    activeTransactions.textContent =
        active;


    completedTransactions.textContent =
        completed;


    totalValue.textContent =
        `₹${formatNumber(value)}`;

}


/* =========================================================
   RENDER TRANSACTIONS
   ========================================================= */

function renderTransactions(
    transactions
) {

    transactionList.innerHTML = "";


    transactionCount.textContent =
        `${transactions.length} ${
            transactions.length === 1
                ? "transaction"
                : "transactions"
        }`;


    if (!transactions.length) {

        emptyState.hidden =
            false;

        return;

    }


    emptyState.hidden =
        true;


    transactions.forEach(
        transaction => {

            const card =
                createTransactionCard(
                    transaction
                );


            transactionList.appendChild(
                card
            );

        }
    );

}


/* =========================================================
   CREATE TRANSACTION CARD
   ========================================================= */

function createTransactionCard(
    transaction
) {

    const article =
        document.createElement(
            "article"
        );


    article.className =
        "transaction-card";


    const status =
        normalizeStatus(
            transaction.status
        );


    const counterparty =
        userRole === "farmer"
            ? transaction.buyerName
            : transaction.farmerName;


    const counterpartyLabel =
        userRole === "farmer"
            ? "BUYER"
            : "FARMER";


    article.innerHTML = `

        <div class="transaction-main">

            <div class="transaction-icon">

                ${getCropInitial(
                    transaction.crop
                )}

            </div>

            <div>

                <h3>
                    ${escapeHTML(
                        transaction.crop ||
                        "Produce"
                    )}
                </h3>

                <p>
                    ${escapeHTML(
                        transaction.lotId ||
                        "Lot not available"
                    )}
                </p>

            </div>

        </div>


        <div class="transaction-detail">

            <span>
                ${counterpartyLabel}
            </span>

            <strong>
                ${escapeHTML(
                    counterparty ||
                    "Farmer"
                )}
            </strong>

            <span>
                ${escapeHTML(
                    transaction.district ||
                    ""
                )},
                ${escapeHTML(
                    transaction.state ||
                    ""
                )}
            </span>

        </div>


        <div class="transaction-detail">

            <span>
                AGREED VALUE
            </span>

            <strong>
                ₹${formatNumber(
                    transaction.totalValue
                )}
            </strong>

            <span>
                ${formatNumber(
                    transaction.quantity
                )}
                ${escapeHTML(
                    transaction.unit ||
                    "quintals"
                )}
                · ₹${formatNumber(
                    transaction.agreedPrice
                )}/quintal
            </span>

        </div>


        <div>

            <span class="transaction-status ${status}">
                ${formatStatus(
                    status
                )}
            </span>

            <br>

            <button
                type="button"
                class="view-button"
                data-transaction-id="${escapeHTML(
                    transaction.id
                )}"
            >
                View Details →
            </button>

        </div>

    `;


    const viewButton =
        article.querySelector(
            ".view-button"
        );


    viewButton.addEventListener(
        "click",
        function () {

            openTransactionModal(
                transaction.id
            );

        }
    );


    return article;

}


/* =========================================================
   OPEN TRANSACTION MODAL
   ========================================================= */

function openTransactionModal(
    transactionId
) {

    const transaction =
        allTransactions.find(
            item =>
                item.id ===
                transactionId
        );


    if (!transaction) {
        return;
    }


    currentSelectedTransaction =
        transaction;


    const status =
        normalizeStatus(
            transaction.status
        );


    const counterparty =
        userRole === "farmer"
            ? transaction.buyerName
            : transaction.farmerName;


    modalCropName.textContent =
        transaction.crop ||
        "Produce";


    modalStatus.textContent =
        formatStatus(status);


    modalStatus.className =
        `modal-status ${status}`;


    modalTotalValue.textContent =
        `₹${formatNumber(
            transaction.totalValue
        )}`;


    modalLotId.textContent =
        transaction.lotId ||
        "—";


    modalCounterpartyLabel.textContent =
        userRole === "farmer"
            ? "BUYER"
            : "FARMER";


    modalCounterparty.textContent =
        counterparty ||
        "Farmer";


    modalQuantity.textContent =
        `${formatNumber(
            transaction.quantity
        )} ${
            transaction.unit ||
            "quintals"
        }`;


    modalPrice.textContent =
        `₹${formatNumber(
            transaction.agreedPrice
        )}`;


    modalDate.textContent =
        transaction.createdAt ||
        "Recently";


    modalLocation.textContent =
        `${transaction.district || ""}, ${
            transaction.state || ""
        }`;


    updateTimeline(
        status
    );


    transactionModal.classList.add(
        "open"
    );


    transactionModal.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.style.overflow =
        "hidden";

}


/* =========================================================
   TIMELINE
   ========================================================= */

function updateTimeline(status) {

    const timelineItems =
        document.querySelectorAll(
            ".timeline-item"
        );


    const order = [
        "pending",
        "confirmed",
        "in-logistics",
        "completed"
    ];


    const currentIndex =
        order.indexOf(status);


    timelineItems.forEach(
        item => {

            item.classList.remove(
                "active",
                "completed-step"
            );


            const itemStatus =
                item.dataset.status;


            const itemIndex =
                order.indexOf(
                    itemStatus
                );


            if (
                currentIndex >= 0 &&
                itemIndex >= 0
            ) {

                if (
                    itemIndex <
                    currentIndex
                ) {

                    item.classList.add(
                        "completed-step"
                    );

                }


                if (
                    itemIndex ===
                    currentIndex
                ) {

                    item.classList.add(
                        "active"
                    );

                }

            }

        }
    );

}


/* =========================================================
   CLOSE MODAL
   ========================================================= */

function closeTransactionModal() {

    transactionModal.classList.remove(
        "open"
    );


    transactionModal.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.style.overflow =
        "";


    currentSelectedTransaction =
        null;

}


modalClose.addEventListener(
    "click",
    closeTransactionModal
);


modalOverlay.addEventListener(
    "click",
    closeTransactionModal
);


document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape" &&
            transactionModal.classList.contains(
                "open"
            )
        ) {

            closeTransactionModal();

        }

    }
);


/* =========================================================
   FILTER
   ========================================================= */

statusFilter.addEventListener(
    "change",
    function () {

        const selectedStatus =
            statusFilter.value;


        if (
            selectedStatus ===
            "all"
        ) {

            currentTransactions =
                allTransactions;

        }
        else {

            currentTransactions =
                allTransactions.filter(
                    transaction =>
                        normalizeStatus(
                            transaction.status
                        ) ===
                        selectedStatus
                );

        }


        renderTransactions(
            currentTransactions
        );

    }
);


/* =========================================================
   LOAD DATA
   ========================================================= */

async function loadTransactions() {

    try {

        transactionList.innerHTML = "";


        allTransactions =
            await fetchTransactions();


        currentTransactions =
            allTransactions;


        renderSummary(
            allTransactions
        );


        renderTransactions(
            currentTransactions
        );

    }
    catch (error) {

        console.error(error);


        transactionList.innerHTML = "";


        transactionCount.textContent =
            "Unable to load";


        emptyState.hidden =
            false;


        emptyState.querySelector(
            "h3"
        ).textContent =
            "Unable to load transactions";


        emptyState.querySelector(
            "p"
        ).textContent =
            "Please try again in a moment.";

    }

}


/* =========================================================
   HELPERS
   ========================================================= */

function getCropInitial(crop) {

    if (!crop) {
        return "P";
    }


    return crop
        .trim()
        .charAt(0)
        .toUpperCase();

}


function formatNumber(number) {

    const value =
        Number(number);


    if (
        Number.isNaN(value)
    ) {

        return "0";

    }


    return value.toLocaleString(
        "en-IN"
    );

}


function normalizeStatus(status) {

    if (!status) {
        return "pending";
    }


    const normalized =
        status
            .toLowerCase()
            .trim();


    const validStatuses = [
        "pending",
        "confirmed",
        "in-logistics",
        "completed",
        "cancelled"
    ];


    if (
        validStatuses.includes(
            normalized
        )
    ) {

        return normalized;

    }


    return "pending";

}


function formatStatus(status) {

    const labels = {

        pending:
            "Pending",

        confirmed:
            "Confirmed",

        "in-logistics":
            "In Logistics",

        completed:
            "Completed",

        cancelled:
            "Cancelled"

    };


    return (
        labels[status] ||
        "Pending"
    );

}


/*
    Prevent API/user-provided text from being
    inserted directly as HTML.
*/

function escapeHTML(value) {

    return String(
        value ?? ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================================
   INITIALIZE
   ========================================================= */

setupRoleContent();

loadTransactions();
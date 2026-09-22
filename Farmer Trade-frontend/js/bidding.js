/* =========================================================
   Farmer Trade — LIVE BIDDING

   ONE COMMON PAGE:

       bidding.html

   Farmer:
       Lots → View Bids → bidding.html?lotId=<id>

   Buyer:
       Lots → Make Offer → bid via modal → view here

   Role:

       sessionStorage.getItem("Farmer TradeUserRole")

   Values:

       farmer
       buyer

   ========================================================= */


/* =========================================================
   AUTH / ROLE
   ========================================================= */

const userRole =
    sessionStorage.getItem("Farmer TradeUserRole");

const loggedIn =
    sessionStorage.getItem("Farmer TradeLoggedIn");


if (
    loggedIn !== "true" ||
    !["farmer", "buyer"].includes(userRole)
) {
    window.location.href = "login.html";
}


/* =========================================================
   ELEMENTS
   ========================================================= */

const farmerView =
    document.getElementById("farmerView");

const buyerView =
    document.getElementById("buyerView");

const heroLabel =
    document.getElementById("heroLabel");

const heroTitle =
    document.getElementById("heroTitle");

const heroDescription =
    document.getElementById("heroDescription");

const lotsNavText =
    document.getElementById("lotsNavText");

const profileInitial =
    document.getElementById("profileInitial");

const dashboardLink =
    document.getElementById("dashboardLink");

const menuButton =
    document.getElementById("menuButton");

const mainNav =
    document.getElementById("mainNav");


/* =========================================================
   MOBILE NAV
   ========================================================= */

if (menuButton && mainNav) {

    menuButton.addEventListener(
        "click",
        function () {

            const opened =
                mainNav.classList.toggle("open");

            menuButton.setAttribute(
                "aria-expanded",
                opened ? "true" : "false"
            );

        }
    );

    document.addEventListener(
        "click",
        function (event) {

            if (
                !mainNav.contains(event.target) &&
                !menuButton.contains(event.target)
            ) {

                mainNav.classList.remove("open");

                menuButton.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }

        }
    );

}


/* =========================================================
   ROLE INTERFACE
   ========================================================= */

function setupRoleInterface() {

    if (userRole === "farmer") {

        farmerView.style.display = "block";

        buyerView.style.display = "none";

        heroLabel.textContent =
            "LIVE BIDDING";

        heroTitle.innerHTML =
            'Live <span>bidding.</span>';

        heroDescription.textContent =
            "View bids on your produce lots in real time, accept or decline offers and manage negotiations from one place.";

        lotsNavText.textContent =
            "My Lots";

        dashboardLink.href =
            "dashboard.html";

        profileInitial.textContent =
            "F";

        loadFarmerBids();

        return;

    }


    if (userRole === "buyer") {

        farmerView.style.display = "none";

        buyerView.style.display = "block";

        heroLabel.textContent =
            "MY OFFERS";

        heroTitle.innerHTML =
            'Track your <span>offers.</span>';

        heroDescription.textContent =
            "View the status of all offers you have placed on produce lots, track responses and manage your active negotiations.";

        lotsNavText.textContent =
            "Buy Produce";

        dashboardLink.href =
            "buyer-dashboard.html";

        profileInitial.textContent =
            "B";

        loadBuyerBids();

    }

}


/* =========================================================
   DEMO BID DATA

   REMOVE WHEN BACKEND IS CONNECTED.

   Backend replacement:

       GET  /api/bids?role=farmer
       GET  /api/bids?role=buyer
       POST /api/bids/:id/accept
       POST /api/bids/:id/decline

   ========================================================= */

function getDemoBids() {

    let bids =
        JSON.parse(
            localStorage.getItem(
                "Farmer TradeDemoBids"
            )
        ) || [];


    /* If no demo bids exist, seed some */

    if (bids.length === 0) {

        bids = generateDemoBids();

        localStorage.setItem(
            "Farmer TradeDemoBids",
            JSON.stringify(bids)
        );

    }


    return bids;

}


function generateDemoBids() {

    const now =
        Date.now();

    const hour =
        3600000;

    const day =
        86400000;


    return [

        {
            id: "bid-demo-1",
            lotId: "demo-1001",
            lotCrop: "Wheat",
            lotProduceType: "grain",
            lotDistrict: "Pune",
            lotState: "Maharashtra",
            lotQuantity: 25,
            lotPrice: 2450,
            lotQuality: "Grade A",
            buyerName: "Rajesh Traders",
            buyerLocation: "Mumbai, Maharashtra",
            offerPrice: 2380,
            offerQuantity: 20,
            status: "pending",
            createdAt: new Date(
                now - 2 * hour
            ).toISOString(),
            endsAt: new Date(
                now + 6 * hour
            ).toISOString(),
            message: "Interested in bulk purchase, can pick up from farm."
        },

        {
            id: "bid-demo-2",
            lotId: "demo-1002",
            lotCrop: "Red Onion",
            lotProduceType: "vegetable",
            lotDistrict: "Nashik",
            lotState: "Maharashtra",
            lotQuantity: 12,
            lotPrice: 2180,
            lotQuality: "Premium",
            buyerName: "Fresh Farms Co.",
            buyerLocation: "Delhi",
            offerPrice: 2100,
            offerQuantity: 12,
            status: "accepted",
            createdAt: new Date(
                now - 1 * day
            ).toISOString(),
            endsAt: new Date(
                now + 2 * day
            ).toISOString(),
            message: "Regular buyer, looking for consistent supply."
        },

        {
            id: "bid-demo-3",
            lotId: "demo-1003",
            lotCrop: "Basmati Rice",
            lotProduceType: "grain",
            lotDistrict: "Ludhiana",
            lotState: "Punjab",
            lotQuantity: 50,
            lotPrice: 8700,
            lotQuality: "Premium",
            buyerName: "AgriExports Ltd",
            buyerLocation: "Chennai, Tamil Nadu",
            offerPrice: 8500,
            offerQuantity: 40,
            status: "pending",
            createdAt: new Date(
                now - 5 * hour
            ).toISOString(),
            endsAt: new Date(
                now + 12 * hour
            ).toISOString(),
            message: "Export quality needed, willing to negotiate."
        },

        {
            id: "bid-demo-4",
            lotId: "demo-1004",
            lotCrop: "Potato",
            lotProduceType: "vegetable",
            lotDistrict: "Indore",
            lotState: "Madhya Pradesh",
            lotQuantity: 30,
            lotPrice: 1800,
            lotQuality: "Grade A",
            buyerName: "Green Market",
            buyerLocation: "Bhopal, Madhya Pradesh",
            offerPrice: 1650,
            offerQuantity: 30,
            status: "declined",
            createdAt: new Date(
                now - 3 * day
            ).toISOString(),
            endsAt: new Date(
                now - 1 * day
            ).toISOString(),
            message: "Can arrange transport from your farm."
        },

        {
            id: "bid-demo-5",
            lotId: "demo-1005",
            lotCrop: "Turmeric",
            lotProduceType: "spices",
            lotDistrict: "Sangli",
            lotState: "Maharashtra",
            lotQuantity: 8,
            lotPrice: 14200,
            lotQuality: "Premium",
            buyerName: "Spice Garden Traders",
            buyerLocation: "Kochi, Kerala",
            offerPrice: 13800,
            offerQuantity: 6,
            status: "pending",
            createdAt: new Date(
                now - 30 * 60000
            ).toISOString(),
            endsAt: new Date(
                now + 4 * hour
            ).toISOString(),
            message: "Need premium quality for retail packaging."
        },

        {
            id: "bid-demo-6",
            lotId: "demo-1006",
            lotCrop: "Chickpea",
            lotProduceType: "pulse",
            lotDistrict: "Jaipur",
            lotState: "Rajasthan",
            lotQuantity: 15,
            lotPrice: 5400,
            lotQuality: "Grade B",
            buyerName: "Bharat Foods",
            buyerLocation: "Ahmedabad, Gujarat",
            offerPrice: 5200,
            offerQuantity: 15,
            status: "accepted",
            createdAt: new Date(
                now - 2 * day
            ).toISOString(),
            endsAt: new Date(
                now + 1 * day
            ).toISOString(),
            message: "Looking for Grade B for processing unit."
        }

    ];

}


/* =========================================================
   SAVE BID (DEMO)
   ========================================================= */

function saveDemoBid(bidData) {

    const existing =
        JSON.parse(
            localStorage.getItem(
                "Farmer TradeDemoBids"
            )
        ) || [];

    existing.unshift(bidData);

    localStorage.setItem(
        "Farmer TradeDemoBids",
        JSON.stringify(existing)
    );

}


/* =========================================================
   UPDATE BID STATUS (DEMO)
   ========================================================= */

function updateDemoBidStatus(
    bidId,
    newStatus
) {

    const bids =
        JSON.parse(
            localStorage.getItem(
                "Farmer TradeDemoBids"
            )
        ) || [];

    const bid =
        bids.find(function (b) {

            return b.id === bidId;

        });

    if (bid) {

        bid.status = newStatus;

    }

    localStorage.setItem(
        "Farmer TradeDemoBids",
        JSON.stringify(bids)
    );

}


/* =========================================================
   LOAD BIDS — FARMER
   ========================================================= */

async function loadFarmerBids(
    filter
) {

    const container =
        document.getElementById(
            "farmerBidsContainer"
        );

    if (!container) return;


    /* =====================================================
       BACKEND CONNECTION

       GET /api/bids?role=farmer

       Backend determines farmer from authenticated
       session/token.

       Expected response:

       [
           {
               id,
               lotId,
               lotCrop,
               lotProduceType,
               lotDistrict,
               lotState,
               lotQuantity,
               lotPrice,
               lotQuality,
               buyerName,
               buyerLocation,
               offerPrice,
               offerQuantity,
               status,
               createdAt,
               endsAt,
               message
           }
       ]

       ===================================================== */


    /*
    const response =
        await fetch(
            "/api/bids?role=farmer",
            {
                headers: {
                    "Authorization":
                        "Bearer " +
                        sessionStorage.getItem(
                            "Farmer TradeToken"
                        )
                }
            }
        );

    const bids =
        await response.json();

    if (!response.ok) {
        throw new Error(
            bids.message ||
            "Unable to load bids."
        );
    }

    renderFarmerBids(bids, filter);

    return;
    */


    /* TEMPORARY FRONTEND DEMO */

    let bids =
        getDemoBids();


    if (filter && filter !== "all") {

        bids = bids.filter(function (bid) {

            return bid.status === filter;

        });

    }


    renderFarmerBids(bids, filter);

    updateStatusBar();

}


/* =========================================================
   RENDER — FARMER
   ========================================================= */

function renderFarmerBids(
    bids,
    filter
) {

    const container =
        document.getElementById(
            "farmerBidsContainer"
        );


    if (!bids.length) {

        container.innerHTML = `

            <div class="empty-state">

                <strong>
                    No ${filter && filter !== "all" ? filter : ""} bids found.
                </strong>

                <p>
                    ${filter && filter !== "all"
                        ? "Try a different filter."
                        : "Bids from buyers on your lots will appear here."
                    }
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML =
        bids.map(function (bid) {

            return `

                <article
                    class="bid-card"
                    data-status="${escapeHtml(
                        bid.status
                    )}"
                >

                    <div class="bid-card-top">

                        <div class="bid-icon">
                            ${getCropInitial(
                                bid.lotCrop
                            )}
                        </div>

                        <span class="bid-status ${escapeHtml(
                            bid.status
                        )}">
                            ${formatStatus(
                                bid.status
                            )}
                        </span>

                    </div>

                    <p class="bid-lot-name">
                        ${escapeHtml(
                            bid.lotCrop
                        )} — ${escapeHtml(
                            bid.lotProduceType
                        )}
                    </p>

                    <h3>
                        Offer from ${escapeHtml(
                            bid.buyerName
                        )}
                    </h3>

                    <p class="bid-location">
                        ${escapeHtml(
                            bid.buyerLocation
                        )}
                    </p>

                    <div class="bid-info">

                        <div>
                            <span>Buyer Offer</span>
                            <strong>
                                ₹${escapeHtml(
                                    bid.offerPrice
                                )}/q
                            </strong>
                        </div>

                        <div>
                            <span>Your Price</span>
                            <strong>
                                ₹${escapeHtml(
                                    bid.lotPrice
                                )}/q
                            </strong>
                        </div>

                        <div>
                            <span>Quantity</span>
                            <strong>
                                ${escapeHtml(
                                    bid.offerQuantity
                                )} q
                            </strong>
                        </div>

                        <div>
                            <span>Lot Location</span>
                            <strong>
                                ${escapeHtml(
                                    bid.lotDistrict
                                )},
                                ${escapeHtml(
                                    bid.lotState
                                )}
                            </strong>
                        </div>

                    </div>

                    ${bid.status === "pending" ? renderCountdown(
                        bid.endsAt
                    ) : ""}

                    ${bid.status === "pending" ? `

                        <div class="bid-actions">

                            <button
                                class="bid-action"
                                type="button"
                                data-action="view"
                                data-id="${escapeHtml(
                                    bid.id
                                )}"
                            >
                                View Details
                            </button>

                            <button
                                class="bid-action accept"
                                type="button"
                                data-action="accept"
                                data-id="${escapeHtml(
                                    bid.id
                                )}"
                            >
                                Accept
                            </button>

                        </div>

                    ` : `

                        <div class="bid-actions">

                            <button
                                class="bid-action"
                                type="button"
                                data-action="view"
                                data-id="${escapeHtml(
                                    bid.id
                                )}"
                            >
                                View Details
                            </button>

                        </div>

                    `}

                </article>

            `;

        }).join("");


    attachBidActions();

}


/* =========================================================
   LOAD BIDS — BUYER
   ========================================================= */

async function loadBuyerBids(
    filter
) {

    const container =
        document.getElementById(
            "buyerBidsContainer"
        );

    if (!container) return;


    /* =====================================================
       BACKEND CONNECTION

       GET /api/bids?role=buyer

       Backend determines buyer from authenticated
       session/token.

       ===================================================== */


    /*
    const response =
        await fetch(
            "/api/bids?role=buyer",
            {
                headers: {
                    "Authorization":
                        "Bearer " +
                        sessionStorage.getItem(
                            "Farmer TradeToken"
                        )
                }
            }
        );

    const bids =
        await response.json();

    if (!response.ok) {
        throw new Error(
            bids.message ||
            "Unable to load bids."
        );
    }

    renderBuyerBids(bids, filter);

    return;
    */


    /* TEMPORARY FRONTEND DEMO */

    let bids =
        getDemoBids();


    if (filter && filter !== "all") {

        bids = bids.filter(function (bid) {

            return bid.status === filter;

        });

    }


    renderBuyerBids(bids, filter);

    updateStatusBar();

}


/* =========================================================
   RENDER — BUYER
   ========================================================= */

function renderBuyerBids(
    bids,
    filter
) {

    const container =
        document.getElementById(
            "buyerBidsContainer"
        );


    if (!bids.length) {

        container.innerHTML = `

            <div class="empty-state">

                <strong>
                    No ${filter && filter !== "all" ? filter : ""} offers found.
                </strong>

                <p>
                    ${filter && filter !== "all"
                        ? "Try a different filter."
                        : "Your offers on produce lots will appear here."
                    }
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML =
        bids.map(function (bid) {

            return `

                <article
                    class="bid-card"
                    data-status="${escapeHtml(
                        bid.status
                    )}"
                >

                    <div class="bid-card-top">

                        <div class="bid-icon">
                            ${getCropInitial(
                                bid.lotCrop
                            )}
                        </div>

                        <span class="bid-status ${escapeHtml(
                            bid.status
                        )}">
                            ${formatStatus(
                                bid.status
                            )}
                        </span>

                    </div>

                    <p class="bid-lot-name">
                        ${escapeHtml(
                            bid.lotCrop
                        )} — ${escapeHtml(
                            bid.lotProduceType
                        )}
                    </p>

                    <h3>
                        ${escapeHtml(
                            bid.lotCrop
                        )}
                    </h3>

                    <p class="bid-location">
                        ${escapeHtml(
                            bid.lotDistrict
                        )},
                        ${escapeHtml(
                            bid.lotState
                        )}
                    </p>

                    <div class="bid-info">

                        <div>
                            <span>Your Offer</span>
                            <strong>
                                ₹${escapeHtml(
                                    bid.offerPrice
                                )}/q
                            </strong>
                        </div>

                        <div>
                            <span>Asking Price</span>
                            <strong>
                                ₹${escapeHtml(
                                    bid.lotPrice
                                )}/q
                            </strong>
                        </div>

                        <div>
                            <span>Quantity</span>
                            <strong>
                                ${escapeHtml(
                                    bid.offerQuantity
                                )} q
                            </strong>
                        </div>

                        <div>
                            <span>Grade</span>
                            <strong>
                                ${escapeHtml(
                                    bid.lotQuality
                                )}
                            </strong>
                        </div>

                    </div>

                    ${bid.status === "pending" ? renderCountdown(
                        bid.endsAt
                    ) : ""}

                    <div class="bid-actions">

                        <button
                            class="bid-action"
                            type="button"
                            data-action="view"
                            data-id="${escapeHtml(
                                bid.id
                            )}"
                        >
                            View Details
                        </button>

                    </div>

                </article>

            `;

        }).join("");


    attachBidActions();

}


/* =========================================================
   RENDER COUNTDOWN
   ========================================================= */

function renderCountdown(
    endsAt
) {

    if (!endsAt) return "";


    const endMs =
        new Date(endsAt).getTime();

    const nowMs =
        Date.now();

    const diff =
        endMs - nowMs;


    if (diff <= 0) {

        return `

            <div class="bid-countdown">

                <span class="countdown-label">
                    ENDED
                </span>

            </div>

        `;

    }


    const hours =
        Math.floor(diff / 3600000);

    const mins =
        Math.floor(
            (diff % 3600000) / 60000
        );

    const secs =
        Math.floor(
            (diff % 60000) / 1000
        );


    return `

        <div
            class="bid-countdown"
            data-ends="${escapeHtml(endsAt)}"
        >

            <span class="countdown-label">
                ENDS IN
            </span>

            <div class="countdown-timer">

                <span class="countdown-unit">
                    ${pad(hours)}
                </span>

                <span class="countdown-separator">
                    :
                </span>

                <span class="countdown-unit">
                    ${pad(mins)}
                </span>

                <span class="countdown-separator">
                    :
                </span>

                <span class="countdown-unit">
                    ${pad(secs)}
                </span>

            </div>

        </div>

    `;

}


function pad(n) {

    return n < 10
        ? "0" + n
        : String(n);

}


/* =========================================================
   COUNTDOWN TICKER
   ========================================================= */

let countdownInterval = null;


function startCountdownTicker() {

    if (countdownInterval) {
        clearInterval(countdownInterval);
    }

    countdownInterval = setInterval(
        function () {

            document
                .querySelectorAll(
                    ".bid-countdown[data-ends]"
                )
                .forEach(function (el) {

                    const endsAt =
                        el.dataset.ends;

                    const endMs =
                        new Date(endsAt).getTime();

                    const nowMs =
                        Date.now();

                    const diff =
                        endMs - nowMs;


                    if (diff <= 0) {

                        el.innerHTML = `

                            <span class="countdown-label">
                                ENDED
                            </span>

                        `;

                        return;

                    }


                    const hours =
                        Math.floor(diff / 3600000);

                    const mins =
                        Math.floor(
                            (diff % 3600000) / 60000
                        );

                    const secs =
                        Math.floor(
                            (diff % 60000) / 1000
                        );


                    const units =
                        el.querySelectorAll(
                            ".countdown-unit"
                        );

                    if (units.length === 3) {

                        units[0].textContent =
                            pad(hours);

                        units[1].textContent =
                            pad(mins);

                        units[2].textContent =
                            pad(secs);

                    }

                });

        },
        1000
    );

}


/* =========================================================
   FILTER TABS
   ========================================================= */

function setupFilterTabs(
    tabsId,
    callback
) {

    const tabs =
        document.getElementById(tabsId);

    if (!tabs) return;


    tabs
        .querySelectorAll(".filter-tab")
        .forEach(function (tab) {

            tab.addEventListener(
                "click",
                function () {

                    tabs
                        .querySelectorAll(".filter-tab")
                        .forEach(function (t) {

                            t.classList.remove(
                                "active"
                            );

                        });

                    tab.classList.add("active");

                    callback(
                        tab.dataset.filter
                    );

                }
            );

        });

}


setupFilterTabs(
    "farmerTabs",
    function (filter) {

        loadFarmerBids(filter);

    }
);


setupFilterTabs(
    "buyerTabs",
    function (filter) {

        loadBuyerBids(filter);

    }
);


/* =========================================================
   UPDATE STATUS BAR
   ========================================================= */

function updateStatusBar() {

    const bids =
        getDemoBids();

    const activeCount =
        bids.filter(function (b) {

            return b.status === "pending";

        }).length;

    const totalCount =
        bids.length;


    const activeEl =
        document.getElementById(
            "activeLotsCount"
        );

    const totalEl =
        document.getElementById(
            "totalBidsCount"
        );

    const updatedEl =
        document.getElementById(
            "lastUpdated"
        );


    if (activeEl) {
        activeEl.textContent = activeCount;
    }

    if (totalEl) {
        totalEl.textContent = totalCount;
    }

    if (updatedEl) {

        const now =
            new Date();

        updatedEl.textContent =
            now.getHours() + ":" +
            pad(now.getMinutes());

    }

}


/* =========================================================
   BID ACTIONS
   ========================================================= */

function attachBidActions() {

    document
        .querySelectorAll(".bid-action")
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    const action =
                        this.dataset.action;

                    const bidId =
                        this.dataset.id;


                    if (action === "view") {

                        openBidModal(bidId);

                    }


                    if (action === "accept") {

                        handleAcceptBid(bidId);

                    }

                }
            );

        });

}


/* =========================================================
   MODAL
   ========================================================= */

const bidModal =
    document.getElementById("bidModal");

const modalClose =
    document.getElementById("modalClose");

const modalOverlay =
    document.getElementById("modalOverlay");

const modalBidTitle =
    document.getElementById("modalBidTitle");

const modalBidDetails =
    document.getElementById("modalBidDetails");

const farmerBidActions =
    document.getElementById("farmerBidActions");


let selectedBidId = null;


function openBidModal(
    bidId
) {

    selectedBidId = bidId;


    /* =====================================================
       BACKEND CONNECTION — BID DETAILS

       GET /api/bids/:bidId

       ===================================================== */


    /*
    const response =
        await fetch(
            "/api/bids/" +
            encodeURIComponent(bidId)
        );

    const bid =
        await response.json();

    if (!response.ok) {
        throw new Error(
            bid.message ||
            "Unable to load bid."
        );
    }
    */


    const bids =
        getDemoBids();


    const bid =
        bids.find(function (item) {

            return item.id === bidId;

        });


    if (!bid) return;


    modalBidTitle.textContent =
        bid.lotCrop + " — Offer";


    modalBidDetails.innerHTML = `

        <div class="modal-detail">
            <span>Lot Crop</span>
            <strong>
                ${escapeHtml(bid.lotCrop)}
            </strong>
        </div>

        <div class="modal-detail">
            <span>Produce Type</span>
            <strong>
                ${escapeHtml(
                    formatType(bid.lotProduceType)
                )}
            </strong>
        </div>

        <div class="modal-detail">
            <span>Buyer</span>
            <strong>
                ${escapeHtml(bid.buyerName)}
            </strong>
        </div>

        <div class="modal-detail">
            <span>Buyer Location</span>
            <strong>
                ${escapeHtml(bid.buyerLocation)}
            </strong>
        </div>

        <div class="modal-detail">
            <span>Buyer Offer</span>
            <strong>
                ₹${escapeHtml(bid.offerPrice)}
                / quintal
            </strong>
        </div>

        <div class="modal-detail">
            <span>Asking Price</span>
            <strong>
                ₹${escapeHtml(bid.lotPrice)}
                / quintal
            </strong>
        </div>

        <div class="modal-detail">
            <span>Quantity</span>
            <strong>
                ${escapeHtml(bid.offerQuantity)}
                quintals
            </strong>
        </div>

        <div class="modal-detail">
            <span>Grade</span>
            <strong>
                ${escapeHtml(bid.lotQuality)}
            </strong>
        </div>

        <div class="modal-detail">
            <span>Lot Location</span>
            <strong>
                ${escapeHtml(bid.lotDistrict)},
                ${escapeHtml(bid.lotState)}
            </strong>
        </div>

        <div class="modal-detail">
            <span>Status</span>
            <strong>
                ${formatStatus(bid.status)}
            </strong>
        </div>

        <div class="modal-detail">
            <span>Placed</span>
            <strong>
                ${formatDate(bid.createdAt)}
            </strong>
        </div>

        <div class="modal-detail">
            <span>Message</span>
            <strong>
                ${escapeHtml(
                    bid.message ||
                    "No message provided."
                )}
            </strong>
        </div>

    `;


    /* Show accept/decline only for farmers on pending bids */

    if (
        userRole === "farmer" &&
        bid.status === "pending"
    ) {

        farmerBidActions.style.display =
            "block";

    }
    else {

        farmerBidActions.style.display =
            "none";

    }


    bidModal.classList.add("open");

    bidModal.setAttribute(
        "aria-hidden",
        "false"
    );

}


function closeBidModal() {

    bidModal.classList.remove("open");

    bidModal.setAttribute(
        "aria-hidden",
        "true"
    );

    selectedBidId = null;

}


if (modalClose) {

    modalClose.addEventListener(
        "click",
        closeBidModal
    );

}


if (modalOverlay) {

    modalOverlay.addEventListener(
        "click",
        closeBidModal
    );

}


/* =========================================================
   ACCEPT / DECLINE BID
   ========================================================= */

function handleAcceptBid(
    bidId
) {

    /* =====================================================
       BACKEND CONNECTION

       POST /api/bids/:bidId/accept

       ===================================================== */


    /*
    const response =
        await fetch(
            "/api/bids/" +
            encodeURIComponent(bidId) +
            "/accept",
            {
                method: "POST",

                headers: {
                    "Authorization":
                        "Bearer " +
                        sessionStorage.getItem(
                            "Farmer TradeToken"
                        )
                }
            }
        );

    const result =
        await response.json();

    if (!response.ok) {
        throw new Error(
            result.message ||
            "Unable to accept bid."
        );
    }
    */


    /* TEMPORARY FRONTEND DEMO */

    updateDemoBidStatus(
        bidId,
        "accepted"
    );

    closeBidModal();

    loadFarmerBids();

}


const acceptBidButton =
    document.getElementById(
        "acceptBidButton"
    );

const declineBidButton =
    document.getElementById(
        "declineBidButton"
    );

const bidResponseMessage =
    document.getElementById(
        "bidResponseMessage"
    );


if (acceptBidButton) {

    acceptBidButton.addEventListener(
        "click",
        function () {

            if (!selectedBidId) return;


            /* =================================================
               BACKEND CONNECTION

               POST /api/bids/:bidId/accept

               ================================================= */


            /*
            const response =
                await fetch(
                    "/api/bids/" +
                    encodeURIComponent(
                        selectedBidId
                    ) +
                    "/accept",
                    {
                        method: "POST",

                        headers: {
                            "Authorization":
                                "Bearer " +
                                sessionStorage.getItem(
                                    "Farmer TradeToken"
                                )
                        }
                    }
                );

            const result =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message ||
                    "Unable to accept bid."
                );
            }
            */


            /* TEMPORARY FRONTEND DEMO */

            updateDemoBidStatus(
                selectedBidId,
                "accepted"
            );

            bidResponseMessage.textContent =
                "Offer accepted successfully.";

            bidResponseMessage.style.color =
                "#53634d";

            setTimeout(function () {

                closeBidModal();

                loadFarmerBids();

            }, 1000);

        }
    );

}


if (declineBidButton) {

    declineBidButton.addEventListener(
        "click",
        function () {

            if (!selectedBidId) return;


            /* =================================================
               BACKEND CONNECTION

               POST /api/bids/:bidId/decline

               ================================================= */


            /*
            const response =
                await fetch(
                    "/api/bids/" +
                    encodeURIComponent(
                        selectedBidId
                    ) +
                    "/decline",
                    {
                        method: "POST",

                        headers: {
                            "Authorization":
                                "Bearer " +
                                sessionStorage.getItem(
                                    "Farmer TradeToken"
                                )
                        }
                    }
                );

            const result =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message ||
                    "Unable to decline bid."
                );
            }
            */


            /* TEMPORARY FRONTEND DEMO */

            updateDemoBidStatus(
                selectedBidId,
                "declined"
            );

            bidResponseMessage.textContent =
                "Offer declined.";

            bidResponseMessage.style.color =
                "#9a493b";

            setTimeout(function () {

                closeBidModal();

                loadFarmerBids();

            }, 1000);

        }
    );

}


/* =========================================================
   HELPERS
   ========================================================= */

function formatType(type) {

    if (!type) {
        return "Produce";
    }

    return type.charAt(0).toUpperCase() +
        type.slice(1);

}


function formatStatus(status) {

    if (!status) {
        return "Pending";
    }

    return status.charAt(0).toUpperCase() +
        status.slice(1);

}


function getCropInitial(crop) {

    if (!crop) {
        return "?";
    }

    return crop
        .trim()
        .charAt(0)
        .toUpperCase();

}


function formatDate(iso) {

    if (!iso) return "—";

    const d =
        new Date(iso);

    return (
        d.getDate() + " " +
        d.toLocaleString(
            "default",
            { month: "short" }
        ) + " " +
        d.getFullYear()
    );

}


function escapeHtml(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");

}


/* =========================================================
   INIT
   ========================================================= */

setupRoleInterface();

startCountdownTicker();

updateStatusBar();

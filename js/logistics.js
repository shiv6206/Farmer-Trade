/* =========================================================
   Farmer Trade — LOGISTICS

   ONE COMMON PAGE:

       logistics.html

   Farmer:
       Dashboard → Logistics

   Buyer:
       Dashboard → Logistics

   Role:

       sessionStorage.getItem("Farmer TradeUserRole")

   Values:

       farmer
       buyer

   FRONTEND DEMO:
       localStorage

   BACKEND READY:
       API endpoints are marked below.

   ========================================================= */


/* =========================================================
   AUTH / ROLE
   ========================================================= */

const userRole =
    sessionStorage.getItem(
        "Farmer TradeUserRole"
    );

const loggedIn =
    sessionStorage.getItem(
        "Farmer TradeLoggedIn"
    );


if (
    loggedIn !== "true" ||
    !["farmer", "buyer"].includes(userRole)
) {

    window.location.href =
        "login.html";

}


/* =========================================================
   ELEMENTS
   ========================================================= */

const farmerView =
    document.getElementById(
        "farmerView"
    );

const buyerView =
    document.getElementById(
        "buyerView"
    );

const heroLabel =
    document.getElementById(
        "heroLabel"
    );

const heroTitle =
    document.getElementById(
        "heroTitle"
    );

const heroDescription =
    document.getElementById(
        "heroDescription"
    );

const lotsNavText =
    document.getElementById(
        "lotsNavText"
    );

const profileInitial =
    document.getElementById(
        "profileInitial"
    );

const dashboardLink =
    document.getElementById(
        "dashboardLink"
    );

const menuButton =
    document.getElementById(
        "menuButton"
    );

const mainNav =
    document.getElementById(
        "mainNav"
    );


/* =========================================================
   STORAGE KEYS
   ========================================================= */

const SHIPMENTS_STORAGE_KEY =
    "Farmer TradeDemoShipments";


/* =========================================================
   MOBILE NAV
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
                opened
                    ? "true"
                    : "false"
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
   DEMO SHIPMENT DATA
   =========================================================

   This is only frontend demonstration data.

   Backend replacement:

       GET /api/logistics/my
       GET /api/logistics/incoming

   ========================================================= */

const defaultDemoShipments = [

    {
        id: "KS-2026-001",

        crop: "Wheat",

        quantity: 25,

        origin: "Pune",

        destination: "Mumbai",

        status: "In Transit",

        date: "2026-09-03",

        pickupAddress:
            "Pune Farm",

        notes:
            "Handle bags carefully.",

        createdAt:
            "2026-08-28T10:00:00.000Z"
    },

    {
        id: "KS-2026-002",

        crop: "Potato",

        quantity: 40,

        origin: "Dehradun",

        destination: "Delhi",

        status: "Pickup Pending",

        date: "2026-09-05",

        pickupAddress:
            "Dehradun Farm",

        notes:
            "Pickup during morning hours.",

        createdAt:
            "2026-08-29T10:00:00.000Z"
    }

];


/* =========================================================
   INITIALIZE DEMO STORAGE
   ========================================================= */

function initializeDemoShipments() {

    const existing =
        localStorage.getItem(
            SHIPMENTS_STORAGE_KEY
        );


    if (existing === null) {

        localStorage.setItem(
            SHIPMENTS_STORAGE_KEY,
            JSON.stringify(
                defaultDemoShipments
            )
        );

    }

}


initializeDemoShipments();


/* =========================================================
   GET SHIPMENTS
   ========================================================= */

function getStoredShipments() {

    try {

        const shipments =
            JSON.parse(
                localStorage.getItem(
                    SHIPMENTS_STORAGE_KEY
                )
            );


        if (!Array.isArray(shipments)) {

            return [];

        }


        return shipments;

    }
    catch (error) {

        console.error(
            "Unable to read shipment storage:",
            error
        );

        return [];

    }

}


/* =========================================================
   SAVE SHIPMENTS
   ========================================================= */

function saveStoredShipments(
    shipments
) {

    localStorage.setItem(
        SHIPMENTS_STORAGE_KEY,
        JSON.stringify(shipments)
    );

}


/* =========================================================
   ROLE INTERFACE
   ========================================================= */

function setupRoleInterface() {

    if (userRole === "farmer") {

        farmerView.style.display =
            "block";

        buyerView.style.display =
            "none";


        heroLabel.textContent =
            "FARMER LOGISTICS";


        heroTitle.innerHTML =
            'Move your <span>produce.</span>';


        heroDescription.textContent =
            "Arrange pickups, track shipments and make sure your produce reaches buyers on time.";


        lotsNavText.textContent =
            "My Lots";


        dashboardLink.href =
            "dashboard.html";


        profileInitial.textContent =
            "F";


        loadFarmerShipments();

        populateFarmerLots();

        return;

    }


    if (userRole === "buyer") {

        farmerView.style.display =
            "none";

        buyerView.style.display =
            "block";


        heroLabel.textContent =
            "BUYER LOGISTICS";


        heroTitle.innerHTML =
            'Track your <span>deliveries.</span>';


        heroDescription.textContent =
            "Track incoming produce, monitor deliveries and stay updated from pickup to arrival.";


        lotsNavText.textContent =
            "Buy Produce";


        dashboardLink.href =
            "buyer-dashboard.html";


        profileInitial.textContent =
            "B";


        loadBuyerShipments();

    }

}


/* =========================================================
   FARMER — LOAD SHIPMENTS
   ========================================================= */

async function loadFarmerShipments() {

    const container =
        document.getElementById(
            "farmerShipmentContainer"
        );


    if (!container) {
        return;
    }


    /*
    =========================================================
    BACKEND CONNECTION

    GET /api/logistics/my

    Backend identifies farmer from
    authenticated session/token.

    Example:

    [
        {
            id,
            lotId,
            crop,
            quantity,
            origin,
            destination,
            status,
            date
        }
    ]

    Replace the demo storage below with fetch()
    when backend is ready.

    =========================================================
    */


    const shipments =
        getStoredShipments();


    renderFarmerShipments(
        shipments
    );

}


/* =========================================================
   FARMER — RENDER SHIPMENTS
   ========================================================= */

function renderFarmerShipments(
    shipments
) {

    const container =
        document.getElementById(
            "farmerShipmentContainer"
        );


    if (!container) {
        return;
    }


    const active =
        shipments.filter(
            function (shipment) {

                return shipment.status !==
                    "Delivered";

            }
        );


    const pickup =
        shipments.filter(
            function (shipment) {

                return shipment.status ===
                    "Pickup Pending";

            }
        );


    const delivered =
        shipments.filter(
            function (shipment) {

                return shipment.status ===
                    "Delivered";

            }
        );


    document.getElementById(
        "farmerActiveCount"
    ).textContent =
        active.length;


    document.getElementById(
        "farmerPickupCount"
    ).textContent =
        pickup.length;


    document.getElementById(
        "farmerDeliveredCount"
    ).textContent =
        delivered.length;


    if (!shipments.length) {

        container.innerHTML = `

            <div class="empty-state">

                <strong>
                    No shipments yet.
                </strong>

                <p>
                    Your logistics requests will appear here.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML =
        shipments.map(
            function (shipment) {

                return `

                    <article class="shipment-card">

                        <div class="shipment-top">

                            <div class="shipment-icon">
                                ${getShipmentInitial(
                                    shipment.crop
                                )}
                            </div>

                            <span class="shipment-status">
                                ${escapeHtml(
                                    shipment.status
                                )}
                            </span>

                        </div>


                        <h3>
                            ${escapeHtml(
                                shipment.crop
                            )}
                        </h3>


                        <p class="shipment-id">
                            ${escapeHtml(
                                shipment.id
                            )}
                        </p>


                        <div class="shipment-info">

                            <div>

                                <span>
                                    Quantity
                                </span>

                                <strong>
                                    ${escapeHtml(
                                        shipment.quantity
                                    )} q
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Pickup
                                </span>

                                <strong>
                                    ${escapeHtml(
                                        shipment.origin
                                    )}
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Destination
                                </span>

                                <strong>
                                    ${escapeHtml(
                                        shipment.destination
                                    )}
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Date
                                </span>

                                <strong>
                                    ${escapeHtml(
                                        shipment.date
                                    )}
                                </strong>

                            </div>

                        </div>


                        <div class="shipment-actions">

                            <button
                                class="shipment-action"
                                type="button"
                                data-action="view"
                                data-id="${escapeHtml(
                                    shipment.id
                                )}"
                            >
                                Details
                            </button>


                            <button
                                class="shipment-action primary"
                                type="button"
                                data-action="track"
                                data-id="${escapeHtml(
                                    shipment.id
                                )}"
                            >
                                Track
                            </button>

                        </div>

                    </article>

                `;

            }
        ).join("");


    attachShipmentActions();

}


/* =========================================================
   BUYER — LOAD SHIPMENTS
   ========================================================= */

async function loadBuyerShipments() {

    const container =
        document.getElementById(
            "buyerShipmentContainer"
        );


    if (!container) {
        return;
    }


    /*
    =========================================================
    BACKEND CONNECTION

    GET /api/logistics/incoming

    Backend identifies buyer from
    authenticated session/token.

    =========================================================
    */


    const shipments =
        getStoredShipments();


    renderBuyerShipments(
        shipments
    );

}


/* =========================================================
   BUYER — RENDER SHIPMENTS
   ========================================================= */

function renderBuyerShipments(
    shipments
) {

    const container =
        document.getElementById(
            "buyerShipmentContainer"
        );


    if (!container) {
        return;
    }


    const transit =
        shipments.filter(
            function (shipment) {

                return shipment.status ===
                    "In Transit";

            }
        );


    const expected =
        shipments.filter(
            function (shipment) {

                return shipment.status ===
                    "Pickup Pending";

            }
        );


    const delivered =
        shipments.filter(
            function (shipment) {

                return shipment.status ===
                    "Delivered";

            }
        );


    document.getElementById(
        "buyerTransitCount"
    ).textContent =
        transit.length;


    document.getElementById(
        "buyerExpectedCount"
    ).textContent =
        expected.length;


    document.getElementById(
        "buyerDeliveredCount"
    ).textContent =
        delivered.length;


    if (!shipments.length) {

        container.innerHTML = `

            <div class="empty-state">

                <strong>
                    No incoming shipments.
                </strong>

                <p>
                    Your purchased produce deliveries will appear here.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML =
        shipments.map(
            function (shipment) {

                return `

                    <article class="shipment-card">

                        <div class="shipment-top">

                            <div class="shipment-icon">
                                ${getShipmentInitial(
                                    shipment.crop
                                )}
                            </div>

                            <span class="shipment-status">
                                ${escapeHtml(
                                    shipment.status
                                )}
                            </span>

                        </div>


                        <h3>
                            ${escapeHtml(
                                shipment.crop
                            )}
                        </h3>


                        <p class="shipment-id">
                            ${escapeHtml(
                                shipment.id
                            )}
                        </p>


                        <div class="shipment-info">

                            <div>

                                <span>
                                    Quantity
                                </span>

                                <strong>
                                    ${escapeHtml(
                                        shipment.quantity
                                    )} q
                                </strong>

                            </div>


                            <div>

                                <span>
                                    From
                                </span>

                                <strong>
                                    ${escapeHtml(
                                        shipment.origin
                                    )}
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Delivery
                                </span>

                                <strong>
                                    ${escapeHtml(
                                        shipment.destination
                                    )}
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Expected
                                </span>

                                <strong>
                                    ${escapeHtml(
                                        shipment.date
                                    )}
                                </strong>

                            </div>

                        </div>


                        <div class="shipment-actions">

                            <button
                                class="shipment-action"
                                type="button"
                                data-action="view"
                                data-id="${escapeHtml(
                                    shipment.id
                                )}"
                            >
                                Details
                            </button>


                            <button
                                class="shipment-action primary"
                                type="button"
                                data-action="track"
                                data-id="${escapeHtml(
                                    shipment.id
                                )}"
                            >
                                Track
                            </button>

                        </div>

                    </article>

                `;

            }
        ).join("");


    attachShipmentActions();

}


/* =========================================================
   FARMER — LOT OPTIONS
   ========================================================= */

function populateFarmerLots() {

    const select =
        document.getElementById(
            "pickupLot"
        );


    if (!select) {
        return;
    }


    select.innerHTML = `

        <option value="">
            Select your lot
        </option>

    `;


    let lots = [];


    try {

        lots =
            JSON.parse(
                localStorage.getItem(
                    "Farmer TradeDemoLots"
                )
            ) || [];

    }
    catch (error) {

        console.error(
            "Unable to read farmer lots:",
            error
        );

        lots = [];

    }


    if (!lots.length) {

        const option =
            document.createElement(
                "option"
            );

        option.value = "";

        option.textContent =
            "Create a lot first";

        option.disabled = true;

        select.appendChild(
            option
        );

        return;

    }


    lots.forEach(
        function (lot) {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                lot.id;

            option.textContent =
                lot.crop +
                " — " +
                lot.quantity +
                " q";

            option.dataset.quantity =
                lot.quantity;

            option.dataset.district =
                lot.district || "";

            option.dataset.state =
                lot.state || "";

            select.appendChild(
                option
            );

        }
    );

}


/* =========================================================
   PICKUP LOT CHANGE
   ========================================================= */

const pickupLot =
    document.getElementById(
        "pickupLot"
    );


if (pickupLot) {

    pickupLot.addEventListener(
        "change",
        function () {

            const selectedOption =
                pickupLot.options[
                    pickupLot.selectedIndex
                ];


            const quantityInput =
                document.getElementById(
                    "pickupQuantity"
                );


            if (
                selectedOption &&
                selectedOption.dataset.quantity
            ) {

                quantityInput.max =
                    selectedOption.dataset.quantity;

            }
            else {

                quantityInput.removeAttribute(
                    "max"
                );

            }

        }
    );

}


/* =========================================================
   FARMER — PICKUP FORM
   ========================================================= */

const pickupForm =
    document.getElementById(
        "pickupForm"
    );


if (pickupForm) {

    pickupForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const lotId =
                document.getElementById(
                    "pickupLot"
                ).value;


            const quantity =
                Number(
                    document.getElementById(
                        "pickupQuantity"
                    ).value
                );


            const date =
                document.getElementById(
                    "pickupDate"
                ).value;


            const address =
                document.getElementById(
                    "pickupAddress"
                ).value.trim();


            const notes =
                document.getElementById(
                    "pickupNotes"
                ).value.trim();


            const message =
                document.getElementById(
                    "pickupMessage"
                );


            message.textContent = "";

            message.style.color =
                "#6b7068";


            /* ---------------------------------------------
               VALIDATION
               --------------------------------------------- */

            if (!lotId) {

                message.textContent =
                    "Please select a produce lot.";

                return;

            }


            if (!quantity || quantity <= 0) {

                message.textContent =
                    "Enter a valid quantity.";

                return;

            }


            const selectedOption =
                document.querySelector(
                    `#pickupLot option[value="${CSS.escape(lotId)}"]`
                );


            const lotQuantity =
                selectedOption
                    ? Number(
                        selectedOption.dataset.quantity
                    )
                    : 0;


            if (
                lotQuantity &&
                quantity > lotQuantity
            ) {

                message.textContent =
                    "Pickup quantity cannot exceed the lot quantity.";

                return;

            }


            if (!date) {

                message.textContent =
                    "Select a pickup date.";

                return;

            }


            if (!address) {

                message.textContent =
                    "Enter the pickup location.";

                return;

            }


            /* ---------------------------------------------
               FIND SELECTED LOT
               --------------------------------------------- */

            let lots = [];


            try {

                lots =
                    JSON.parse(
                        localStorage.getItem(
                            "Farmer TradeDemoLots"
                        )
                    ) || [];

            }
            catch (error) {

                lots = [];

            }


            const selectedLot =
                lots.find(
                    function (lot) {

                        return lot.id ===
                            lotId;

                    }
                );


            if (!selectedLot) {

                message.textContent =
                    "Selected produce lot could not be found.";

                return;

            }


            /* ---------------------------------------------
               CREATE SHIPMENT
               --------------------------------------------- */

            const shipments =
                getStoredShipments();


            const shipmentNumber =
                Date.now()
                    .toString()
                    .slice(-6);


            const shipment = {

                id:
                    "KS-" +
                    new Date()
                        .getFullYear() +
                    "-" +
                    shipmentNumber,

                lotId:
                    selectedLot.id,

                crop:
                    selectedLot.crop,

                quantity:
                    quantity,

                origin:
                    selectedLot.district ||
                    selectedLot.state ||
                    "Farmer Location",

                destination:
                    "Buyer / Destination Pending",

                status:
                    "Pickup Pending",

                date:
                    date,

                pickupAddress:
                    address,

                notes:
                    notes,

                createdAt:
                    new Date().toISOString()

            };


            shipments.unshift(
                shipment
            );


            saveStoredShipments(
                shipments
            );


            /* ---------------------------------------------
               SUCCESS
               --------------------------------------------- */

            message.textContent =
                "Pickup request created successfully.";

            message.style.color =
                "#53634d";


            pickupForm.reset();


            document.getElementById(
                "pickupLot"
            ).innerHTML = `

                <option value="">
                    Select your lot
                </option>

            `;


            populateFarmerLots();


            loadFarmerShipments();

        }
    );

}


/* =========================================================
   BUYER — TRACK SHIPMENT
   ========================================================= */

const trackButton =
    document.getElementById(
        "trackButton"
    );


if (trackButton) {

    trackButton.addEventListener(
        "click",
        function () {

            const trackingNumber =
                document.getElementById(
                    "trackingNumber"
                ).value.trim();


            const message =
                document.getElementById(
                    "trackingMessage"
                );


            message.textContent = "";

            message.style.color =
                "#6b7068";


            if (!trackingNumber) {

                message.textContent =
                    "Enter a shipment ID.";

                return;

            }


            /*
            BACKEND CONNECTION:

            GET /api/logistics/:shipmentId
            */


            const shipments =
                getStoredShipments();


            const shipment =
                shipments.find(
                    function (item) {

                        return item.id
                            .toLowerCase() ===
                            trackingNumber
                                .toLowerCase();

                    }
                );


            if (!shipment) {

                message.textContent =
                    "Shipment not found.";

                return;

            }


            message.textContent =
                "Shipment " +
                shipment.id +
                " is currently " +
                shipment.status +
                ".";

            message.style.color =
                "#53634d";


            openShipmentModal(
                shipment.id
            );

        }
    );

}


/* =========================================================
   SEARCH ENTER
   ========================================================= */

const trackingNumber =
    document.getElementById(
        "trackingNumber"
    );


if (trackingNumber) {

    trackingNumber.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key ===
                "Enter"
            ) {

                event.preventDefault();

                trackButton.click();

            }

        }
    );

}


/* =========================================================
   SHIPMENT ACTIONS
   ========================================================= */

function attachShipmentActions() {

    document
        .querySelectorAll(
            ".shipment-action"
        )
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const action =
                            this.dataset.action;

                        const shipmentId =
                            this.dataset.id;


                        if (
                            action === "view" ||
                            action === "track"
                        ) {

                            openShipmentModal(
                                shipmentId
                            );

                        }

                    }
                );

            }
        );

}


/* =========================================================
   MODAL
   ========================================================= */

const shipmentModal =
    document.getElementById(
        "shipmentModal"
    );

const modalClose =
    document.getElementById(
        "modalClose"
    );

const modalOverlay =
    document.getElementById(
        "modalOverlay"
    );

const modalShipmentTitle =
    document.getElementById(
        "modalShipmentTitle"
    );

const modalShipmentDetails =
    document.getElementById(
        "modalShipmentDetails"
    );


function openShipmentModal(
    shipmentId
) {

    const shipments =
        getStoredShipments();


    const shipment =
        shipments.find(
            function (item) {

                return item.id ===
                    shipmentId;

            }
        );


    if (!shipment) {
        return;
    }


    modalShipmentTitle.textContent =
        shipment.crop;


    modalShipmentDetails.innerHTML = `

        <div class="modal-detail">

            <span>
                Shipment ID
            </span>

            <strong>
                ${escapeHtml(
                    shipment.id
                )}
            </strong>

        </div>


        <div class="modal-detail">

            <span>
                Status
            </span>

            <strong>
                ${escapeHtml(
                    shipment.status
                )}
            </strong>

        </div>


        <div class="modal-detail">

            <span>
                Quantity
            </span>

            <strong>
                ${escapeHtml(
                    shipment.quantity
                )}
                quintals
            </strong>

        </div>


        <div class="modal-detail">

            <span>
                Origin
            </span>

            <strong>
                ${escapeHtml(
                    shipment.origin
                )}
            </strong>

        </div>


        <div class="modal-detail">

            <span>
                Destination
            </span>

            <strong>
                ${escapeHtml(
                    shipment.destination
                )}
            </strong>

        </div>


        <div class="modal-detail">

            <span>
                Expected Date
            </span>

            <strong>
                ${escapeHtml(
                    shipment.date
                )}
            </strong>

        </div>


        <div class="modal-detail">

            <span>
                Pickup Location
            </span>

            <strong>
                ${escapeHtml(
                    shipment.pickupAddress ||
                    "Not specified"
                )}
            </strong>

        </div>


        <div class="modal-detail">

            <span>
                Instructions
            </span>

            <strong>
                ${escapeHtml(
                    shipment.notes ||
                    "No additional instructions."
                )}
            </strong>

        </div>

    `;


    shipmentModal.classList.add(
        "open"
    );


    shipmentModal.setAttribute(
        "aria-hidden",
        "false"
    );

}


function closeShipmentModal() {

    shipmentModal.classList.remove(
        "open"
    );


    shipmentModal.setAttribute(
        "aria-hidden",
        "true"
    );

}


if (modalClose) {

    modalClose.addEventListener(
        "click",
        closeShipmentModal
    );

}


if (modalOverlay) {

    modalOverlay.addEventListener(
        "click",
        closeShipmentModal
    );

}


/* =========================================================
   ESCAPE KEY — MODAL
   ========================================================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape" &&
            shipmentModal.classList.contains(
                "open"
            )
        ) {

            closeShipmentModal();

        }

    }
);


/* =========================================================
   HELPERS
   ========================================================= */

function getShipmentInitial(
    crop
) {

    if (!crop) {
        return "?";
    }


    return crop
        .trim()
        .charAt(0)
        .toUpperCase();

}


function escapeHtml(
    value
) {

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
   START
   ========================================================= */

setupRoleInterface();
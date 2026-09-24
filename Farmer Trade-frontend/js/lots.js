/* =========================================================
   Farmer Trade — LOTS

   ONE COMMON PAGE:

       lots.html

   Farmer:
       Dashboard → Sell Produce → lots.html

   Buyer:
       Dashboard → Buy Produce → lots.html

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
   DATA — PRODUCE
   ========================================================= */

const produceOptions = {

    fruit: [
        "Apple",
        "Banana",
        "Mango",
        "Orange",
        "Grapes",
        "Guava",
        "Pomegranate",
        "Papaya",
        "Watermelon",
        "Other Fruit"
    ],

    vegetable: [
        "Potato",
        "Onion",
        "Red Onion",
        "Tomato",
        "Cabbage",
        "Cauliflower",
        "Carrot",
        "Peas",
        "Spinach",
        "Other Vegetable"
    ],

    grain: [
        "Wheat",
        "Rice",
        "Basmati Rice",
        "Maize",
        "Bajra",
        "Jowar",
        "Barley",
        "Other Grain"
    ],

    pulse: [
        "Chickpea",
        "Lentil",
        "Moong Dal",
        "Urad Dal",
        "Arhar Dal",
        "Peas",
        "Other Pulse"
    ],

    oilseed: [
        "Mustard",
        "Groundnut",
        "Soybean",
        "Sunflower",
        "Sesame",
        "Other Oilseed"
    ],

    spices: [
        "Turmeric",
        "Chilli",
        "Cumin",
        "Coriander",
        "Cardamom",
        "Ginger",
        "Garlic",
        "Other Spice"
    ],

    other: [
        "Other Produce"
    ]

};


/* =========================================================
   LOCATION DATA
   ========================================================= */

const locationData = {

    "Maharashtra": [
        "Pune",
        "Nashik",
        "Nagpur",
        "Ahmednagar",
        "Kolhapur",
        "Satara",
        "Solapur",
        "Sangli"
    ],

    "Uttarakhand": [
        "Dehradun",
        "Haridwar",
        "Nainital",
        "Udham Singh Nagar",
        "Pauri Garhwal",
        "Almora",
        "Chamoli",
        "Tehri Garhwal"
    ],

    "Punjab": [
        "Amritsar",
        "Ludhiana",
        "Patiala",
        "Jalandhar",
        "Bathinda",
        "Moga",
        "Sangrur"
    ],

    "Haryana": [
        "Gurugram",
        "Hisar",
        "Karnal",
        "Panipat",
        "Rohtak",
        "Sirsa",
        "Ambala"
    ],

    "Uttar Pradesh": [
        "Lucknow",
        "Agra",
        "Kanpur",
        "Meerut",
        "Varanasi",
        "Prayagraj",
        "Gorakhpur"
    ],

    "Madhya Pradesh": [
        "Bhopal",
        "Indore",
        "Ujjain",
        "Gwalior",
        "Jabalpur",
        "Sagar",
        "Dewas"
    ],

    "Gujarat": [
        "Ahmedabad",
        "Surat",
        "Rajkot",
        "Vadodara",
        "Anand",
        "Junagadh",
        "Mehsana"
    ],

    "Rajasthan": [
        "Jaipur",
        "Jodhpur",
        "Kota",
        "Ajmer",
        "Udaipur",
        "Bikaner",
        "Alwar"
    ]

};


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

    menuButton.addEventListener("click", function () {

        const opened =
            mainNav.classList.toggle("open");

        menuButton.setAttribute(
            "aria-expanded",
            opened ? "true" : "false"
        );

    });

    document.addEventListener("click", function (event) {

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

    });

}


/* =========================================================
   POPULATE SELECT
   ========================================================= */

function populateSelect(
    select,
    items,
    placeholder
) {

    if (!select) return;

    select.innerHTML = "";

    const defaultOption =
        document.createElement("option");

    defaultOption.value = "";

    defaultOption.textContent =
        placeholder;

    select.appendChild(defaultOption);

    items.forEach(function (item) {

        const option =
            document.createElement("option");

        option.value = item;

        option.textContent = item;

        select.appendChild(option);

    });

}


/* =========================================================
   PRODUCE SUBCATEGORY
   ========================================================= */

function setupProduceSelector(
    typeElement,
    cropElement
) {

    if (!typeElement || !cropElement) {
        return;
    }

    typeElement.addEventListener(
        "change",
        function () {

            const type =
                typeElement.value;

            if (!type) {

                cropElement.disabled = true;

                populateSelect(
                    cropElement,
                    [],
                    "Select produce type first"
                );

                return;

            }

            cropElement.disabled = false;

            populateSelect(
                cropElement,
                produceOptions[type] || [],
                "Select produce"
            );

        }
    );

}


/* =========================================================
   LOCATION SELECTOR
   ========================================================= */

function setupLocationSelector(
    stateElement,
    districtElement
) {

    if (!stateElement || !districtElement) {
        return;
    }

    populateSelect(
        stateElement,
        Object.keys(locationData),
        "Select state"
    );

    stateElement.addEventListener(
        "change",
        function () {

            const state =
                stateElement.value;

            if (!state) {

                districtElement.disabled = true;

                populateSelect(
                    districtElement,
                    [],
                    "Select state first"
                );

                return;

            }

            districtElement.disabled = false;

            populateSelect(
                districtElement,
                locationData[state] || [],
                "Select district"
            );

        }
    );

}


/* =========================================================
   FARMER FORM SELECTORS
   ========================================================= */

setupProduceSelector(
    document.getElementById("produceType"),
    document.getElementById("crop")
);

setupLocationSelector(
    document.getElementById("state"),
    document.getElementById("district")
);


/* =========================================================
   BUYER FILTER SELECTORS
   ========================================================= */

setupProduceSelector(
    document.getElementById("buyerProduceType"),
    document.getElementById("buyerCrop")
);

setupLocationSelector(
    document.getElementById("buyerState"),
    document.getElementById("buyerDistrict")
);


/* =========================================================
   ROLE INTERFACE
   ========================================================= */

function setupRoleInterface() {

    if (userRole === "farmer") {

        farmerView.style.display = "block";

        buyerView.style.display = "none";

        heroLabel.textContent =
            "SELL PRODUCE";

        heroTitle.innerHTML =
            'Sell your <span>produce.</span>';

        heroDescription.textContent =
            "List your harvest, reach genuine buyers and manage your produce lots from one place.";

        lotsNavText.textContent =
            "My Lots";

        dashboardLink.href =
            "dashboard.html";

        profileInitial.textContent =
            "F";

        loadFarmerLots();

        return;
    }


    if (userRole === "buyer") {

        farmerView.style.display = "none";

        buyerView.style.display = "block";

        heroLabel.textContent =
            "BUY PRODUCE";

        heroTitle.innerHTML =
            'Find the right <span>produce.</span>';

        heroDescription.textContent =
            "Browse available farmer lots, compare offers and purchase produce directly through Farmer Trade.";

        lotsNavText.textContent =
            "Buy Produce";

        dashboardLink.href =
            "buyer-dashboard.html";

        profileInitial.textContent =
            "B";

        loadBuyerLots();

    }

}


/* =========================================================
   FARMER — CREATE LOT
   ========================================================= */

const createLotForm =
    document.getElementById("createLotForm");


function syncUploadBoxState(inputId, fileName) {

    const box =
        document.querySelector(
            `[data-upload-box="${inputId}"]`
        );

    const meta =
        document.querySelector(
            `[data-upload-meta="${inputId}"]`
        );

    if (!box || !meta) return;

    if (fileName) {
        box.classList.add("has-file");
        meta.textContent = fileName;
        return;
    }

    box.classList.remove("has-file");
    meta.textContent = "No file selected";

}


document.querySelectorAll(
    ".upload-area input[type='file']"
).forEach(function (input) {

    input.addEventListener(
        "change",
        function () {

            const file =
                this.files && this.files[0];

            syncUploadBoxState(
                this.id,
                file ? file.name : ""
            );

        }
    );

});


if (createLotForm) {

    createLotForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const produceType =
                document.getElementById(
                    "produceType"
                ).value;

            const crop =
                document.getElementById(
                    "crop"
                ).value;

            const quantity =
                Number(
                    document.getElementById(
                        "quantity"
                    ).value
                );

            const price =
                Number(
                    document.getElementById(
                        "price"
                    ).value
                );

            const quality =
                document.getElementById(
                    "quality"
                ).value;

            const harvestDate =
                document.getElementById(
                    "harvestDate"
                ).value;

            const state =
                document.getElementById(
                    "state"
                ).value;

            const district =
                document.getElementById(
                    "district"
                ).value;

            const description =
                document.getElementById(
                    "description"
                ).value.trim();

            const productPhotoFile =
                document.getElementById(
                    "productPhoto"
                ).files[0];

            const labResultFile =
                document.getElementById(
                    "labResultFile"
                ).files[0];

            const message =
                document.getElementById(
                    "farmerFormMessage"
                );


            message.textContent = "";


            /* FRONTEND VALIDATION */

            if (!produceType) {

                message.textContent =
                    "Please select a produce type.";

                return;

            }

            if (!crop) {

                message.textContent =
                    "Please select your produce.";

                return;

            }

            if (!quantity || quantity <= 0) {

                message.textContent =
                    "Enter a valid quantity.";

                return;

            }

            if (!price || price <= 0) {

                message.textContent =
                    "Enter a valid expected price.";

                return;

            }

            if (!quality) {

                message.textContent =
                    "Please select the quality/grade.";

                return;

            }

            if (!harvestDate) {

                message.textContent =
                    "Select the availability date.";

                return;

            }

            if (!state || !district) {

                message.textContent =
                    "Select your state and district.";

                return;

            }


            const lotData = {

                produceType,

                crop,

                quantity,

                price,

                quality,

                harvestDate,

                state,

                district,

                description,

                productPhotoName:
                    productPhotoFile
                        ? productPhotoFile.name
                        : "",

                labResultName:
                    labResultFile
                        ? labResultFile.name
                        : ""

            };


            /* =================================================
               BACKEND CONNECTION — CREATE LOT
               =================================================

               POST /api/lots

               Body:

               {
                   produceType,
                   crop,
                   quantity,
                   price,
                   quality,
                   harvestDate,
                   state,
                   district,
                   description
               }

               IMPORTANT:
               Backend must determine farmer ID from
               authenticated session/token.

               DO NOT send farmerId from frontend.

               ================================================= */


            try {

                /*
                const response = await fetch(
                    "/api/lots",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",

                            "Authorization":
                                "Bearer " +
                                sessionStorage.getItem(
                                    "Farmer TradeToken"
                                )
                        },

                        body:
                            JSON.stringify(lotData)
                    }
                );

                const result =
                    await response.json();

                if (!response.ok) {
                    throw new Error(
                        result.message ||
                        "Unable to create lot."
                    );
                }
                */


                /* TEMPORARY FRONTEND DEMO */

                saveDemoLot(lotData);

                message.textContent =
                    "Produce lot created successfully.";

                message.style.color =
                    "#53634d";

                createLotForm.reset();

                syncUploadBoxState(
                    "productPhoto",
                    ""
                );

                syncUploadBoxState(
                    "labResultFile",
                    ""
                );

                document.getElementById(
                    "crop"
                ).disabled = true;

                document.getElementById(
                    "district"
                ).disabled = true;

                loadFarmerLots();

            }
            catch (error) {

                console.error(error);

                message.textContent =
                    error.message ||
                    "Something went wrong.";

            }

        }
    );

}


/* =========================================================
   DEMO STORAGE
   =========================================================

   REMOVE WHEN BACKEND IS CONNECTED.

   Backend replacement:

       POST /api/lots
       GET  /api/lots/my

   ========================================================= */

function saveDemoLot(lotData) {

    const existing =
        JSON.parse(
            localStorage.getItem(
                "Farmer TradeDemoLots"
            )
        ) || [];


    const newLot = {

        id:
            "demo-" +
            Date.now(),

        ...lotData,

        status:
            "active",

        createdAt:
            new Date().toISOString()

    };


    existing.unshift(newLot);


    localStorage.setItem(
        "Farmer TradeDemoLots",
        JSON.stringify(existing)
    );

}


/* =========================================================
   FARMER — LOAD MY LOTS
   ========================================================= */

async function loadFarmerLots() {

    const container =
        document.getElementById(
            "farmerLotsContainer"
        );

    if (!container) return;


    /* =====================================================
       BACKEND CONNECTION

       GET /api/lots/my

       Backend determines farmer from authenticated
       session/token.

       Expected response:

       [
           {
               id,
               produceType,
               crop,
               quantity,
               price,
               quality,
               harvestDate,
               state,
               district,
               description,
               status,
               createdAt
           }
       ]

       ===================================================== */


    /*
    const response =
        await fetch(
            "/api/lots/my",
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

    const lots =
        await response.json();

    if (!response.ok) {
        throw new Error(
            lots.message ||
            "Unable to load your lots."
        );
    }

    renderFarmerLots(lots);

    return;
    */


    const lots =
        JSON.parse(
            localStorage.getItem(
                "Farmer TradeDemoLots"
            )
        ) || [];


    renderFarmerLots(lots);

}


/* =========================================================
   FARMER — RENDER LOTS
   ========================================================= */

function renderFarmerLots(lots) {

    const container =
        document.getElementById(
            "farmerLotsContainer"
        );


    if (!lots.length) {

        container.innerHTML = `

            <div class="empty-state">

                <strong>
                    No active lots yet.
                </strong>

                <p>
                    Create your first produce lot above.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML =
        lots.map(function (lot) {

            return `

                <article class="lot-card">

                    <div class="lot-card-top">

                        <div class="lot-icon">
                            ${getCropInitial(lot.crop)}
                        </div>

                        <span class="lot-status">
                            ${escapeHtml(
                                lot.status || "Active"
                            )}
                        </span>

                    </div>

                    <p class="lot-type">
                        ${escapeHtml(
                            formatType(lot.produceType)
                        )}
                    </p>

                    <h3>
                        ${escapeHtml(lot.crop)}
                    </h3>

                    <p class="lot-location">
                        ${escapeHtml(lot.district)},
                        ${escapeHtml(lot.state)}
                    </p>

                    <div class="lot-info">

                        <div>
                            <span>Quantity</span>

                            <strong>
                                ${escapeHtml(lot.quantity)} q
                            </strong>
                        </div>

                        <div>
                            <span>Expected</span>

                            <strong>
                                ₹${escapeHtml(lot.price)}
                            </strong>
                        </div>

                        <div>
                            <span>Grade</span>

                            <strong>
                                ${escapeHtml(
                                    lot.quality
                                )}
                            </strong>
                        </div>

                        <div>
                            <span>Available</span>

                            <strong>
                                ${escapeHtml(
                                    lot.harvestDate
                                )}
                            </strong>
                        </div>

                    </div>

                    <div class="lot-actions">

                        <button
                            class="lot-action"
                            type="button"
                            data-action="view"
                            data-id="${escapeHtml(lot.id)}"
                        >
                            View
                        </button>

                        <button
                            class="lot-action primary"
                            type="button"
                            data-action="bids"
                            data-id="${escapeHtml(lot.id)}"
                        >
                            View Bids
                        </button>

                    </div>

                </article>

            `;

        }).join("");


    attachLotActions();

}


/* =========================================================
   BUYER — LOAD LOTS
   ========================================================= */

async function loadBuyerLots(filters = {}) {

    const container =
        document.getElementById(
            "buyerLotsContainer"
        );

    const resultsCount =
        document.getElementById(
            "resultsCount"
        );


    if (!container) return;


    /* =====================================================
       BACKEND CONNECTION — BUYER MARKETPLACE

       GET /api/lots

       Query parameters:

           produceType
           crop
           state
           district
           quality
           minPrice
           maxPrice
           minQuantity
           search

       Example:

       GET /api/lots?
           produceType=vegetable&
           crop=Potato&
           state=Maharashtra&
           district=Pune&
           quality=Grade%20A&
           minPrice=1000&
           maxPrice=2500&
           minQuantity=20

       Backend should return ACTIVE lots only.

       Backend should also exclude completely sold lots.

       ===================================================== */


    /*
    const params =
        new URLSearchParams();

    Object.entries(filters).forEach(
        ([key, value]) => {

            if (
                value !== "" &&
                value !== null &&
                value !== undefined
            ) {
                params.set(key, value);
            }

        }
    );


    const response =
        await fetch(
            "/api/lots?" +
            params.toString()
        );

    const result =
        await response.json();

    if (!response.ok) {
        throw new Error(
            result.message ||
            "Unable to load lots."
        );
    }

    renderBuyerLots(
        result.lots || result,
        resultsCount
    );

    return;
    */


    /* TEMPORARY FRONTEND DEMO */

    let lots =
        JSON.parse(
            localStorage.getItem(
                "Farmer TradeDemoLots"
            )
        ) || [];


    lots =
        lots.filter(function (lot) {

            if (
                lot.status &&
                lot.status !== "active"
            ) {
                return false;
            }

            if (
                filters.produceType &&
                lot.produceType !==
                filters.produceType
            ) {
                return false;
            }

            if (
                filters.crop &&
                lot.crop !== filters.crop
            ) {
                return false;
            }

            if (
                filters.state &&
                lot.state !== filters.state
            ) {
                return false;
            }

            if (
                filters.district &&
                lot.district !== filters.district
            ) {
                return false;
            }

            if (
                filters.quality &&
                lot.quality !== filters.quality
            ) {
                return false;
            }

            if (
                filters.minPrice &&
                Number(lot.price) <
                Number(filters.minPrice)
            ) {
                return false;
            }

            if (
                filters.maxPrice &&
                Number(lot.price) >
                Number(filters.maxPrice)
            ) {
                return false;
            }

            if (
                filters.minQuantity &&
                Number(lot.quantity) <
                Number(filters.minQuantity)
            ) {
                return false;
            }

            if (
                filters.search &&
                !lot.crop
                    .toLowerCase()
                    .includes(
                        filters.search.toLowerCase()
                    )
            ) {
                return false;
            }

            return true;

        });


    renderBuyerLots(
        lots,
        resultsCount
    );

}


/* =========================================================
   BUYER — RENDER
   ========================================================= */

function renderBuyerLots(
    lots,
    resultsCount
) {

    if (resultsCount) {

        resultsCount.textContent =
            lots.length +
            (
                lots.length === 1
                    ? " lot"
                    : " lots"
            );

    }


    const container =
        document.getElementById(
            "buyerLotsContainer"
        );


    if (!lots.length) {

        container.innerHTML = `

            <div class="empty-state">

                <strong>
                    No matching lots found.
                </strong>

                <p>
                    Try changing your filters.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML =
        lots.map(function (lot) {

            return `

                <article class="lot-card">

                    <div class="lot-card-top">

                        <div class="lot-icon">
                            ${getCropInitial(lot.crop)}
                        </div>

                        <span class="lot-status">
                            Available
                        </span>

                    </div>

                    <p class="lot-type">
                        ${escapeHtml(
                            formatType(lot.produceType)
                        )}
                    </p>

                    <h3>
                        ${escapeHtml(lot.crop)}
                    </h3>

                    <p class="lot-location">
                        ${escapeHtml(lot.district)},
                        ${escapeHtml(lot.state)}
                    </p>

                    <div class="lot-info">

                        <div>
                            <span>Quantity</span>

                            <strong>
                                ${escapeHtml(lot.quantity)} q
                            </strong>
                        </div>

                        <div>
                            <span>Price</span>

                            <strong>
                                ₹${escapeHtml(lot.price)}
                            </strong>
                        </div>

                        <div>
                            <span>Grade</span>

                            <strong>
                                ${escapeHtml(
                                    lot.quality
                                )}
                            </strong>
                        </div>

                        <div>
                            <span>Available</span>

                            <strong>
                                ${escapeHtml(
                                    lot.harvestDate
                                )}
                            </strong>
                        </div>

                    </div>

                    <div class="lot-actions">

                        <button
                            class="lot-action"
                            type="button"
                            data-action="view"
                            data-id="${escapeHtml(lot.id)}"
                        >
                            Details
                        </button>

                        <button
                            class="lot-action primary"
                            type="button"
                            data-action="bid"
                            data-id="${escapeHtml(lot.id)}"
                        >
                            Make Offer
                        </button>

                    </div>

                </article>

            `;

        }).join("");


    attachLotActions();

}


/* =========================================================
   BUYER SEARCH
   ========================================================= */

const searchButton =
    document.getElementById(
        "searchButton"
    );


if (searchButton) {

    searchButton.addEventListener(
        "click",
        function () {

            const filters = {

                produceType:
                    document.getElementById(
                        "buyerProduceType"
                    ).value,

                crop:
                    document.getElementById(
                        "buyerCrop"
                    ).value,

                state:
                    document.getElementById(
                        "buyerState"
                    ).value,

                district:
                    document.getElementById(
                        "buyerDistrict"
                    ).value,

                quality:
                    document.getElementById(
                        "buyerQuality"
                    ).value,

                minPrice:
                    document.getElementById(
                        "minPrice"
                    ).value,

                maxPrice:
                    document.getElementById(
                        "maxPrice"
                    ).value,

                minQuantity:
                    document.getElementById(
                        "minQuantity"
                    ).value,

                search:
                    document.getElementById(
                        "searchCrop"
                    ).value.trim()

            };


            loadBuyerLots(filters);

        }
    );

}


/* =========================================================
   SEARCH ENTER
   ========================================================= */

const searchCrop =
    document.getElementById(
        "searchCrop"
    );


if (searchCrop) {

    searchCrop.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Enter") {

                event.preventDefault();

                searchButton.click();

            }

        }
    );

}


/* =========================================================
   LOT ACTIONS
   ========================================================= */

function attachLotActions() {

    document
        .querySelectorAll(".lot-action")
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    const action =
                        this.dataset.action;

                    const lotId =
                        this.dataset.id;


                    if (action === "view") {

                        openLotModal(
                            lotId,
                            false
                        );

                    }


                    if (action === "bid") {

                        openLotModal(
                            lotId,
                            true
                        );

                    }


                    if (action === "bids") {

                        /*
                        BACKEND CONNECTION:

                        Navigate to:

                            bidding.html?lotId=<id>

                        Bidding page should call:

                            GET /api/lots/:lotId/bids
                        */

                        window.location.href =
                            "bidding.html?lotId=" +
                            encodeURIComponent(
                                lotId
                            );

                    }

                }
            );

        });

}


/* =========================================================
   MODAL
   ========================================================= */

const lotModal =
    document.getElementById(
        "lotModal"
    );

const modalClose =
    document.getElementById(
        "modalClose"
    );

const modalOverlay =
    document.getElementById(
        "modalOverlay"
    );

const modalLotTitle =
    document.getElementById(
        "modalLotTitle"
    );

const modalLotDetails =
    document.getElementById(
        "modalLotDetails"
    );

const buyerBidArea =
    document.getElementById(
        "buyerBidArea"
    );


let selectedLotId = null;


async function openLotModal(
    lotId,
    allowBid
) {

    selectedLotId = lotId;


    /* =====================================================
       BACKEND CONNECTION — LOT DETAILS

       GET /api/lots/:lotId

       Replace demo lookup below with API request.

       ===================================================== */


    /*
    const response =
        await fetch(
            "/api/lots/" +
            encodeURIComponent(lotId)
        );

    const lot =
        await response.json();

    if (!response.ok) {
        throw new Error(
            lot.message ||
            "Unable to load lot."
        );
    }
    */


    const lots =
        JSON.parse(
            localStorage.getItem(
                "Farmer TradeDemoLots"
            )
        ) || [];


    const lot =
        lots.find(function (item) {

            return item.id === lotId;

        });


    if (!lot) return;


    modalLotTitle.textContent =
        lot.crop;


    modalLotDetails.innerHTML = `

        <div class="modal-detail">
            <span>Type</span>
            <strong>
                ${escapeHtml(
                    formatType(lot.produceType)
                )}
            </strong>
        </div>

        <div class="modal-detail">
            <span>Produce</span>
            <strong>
                ${escapeHtml(lot.crop)}
            </strong>
        </div>

        <div class="modal-detail">
            <span>Quantity</span>
            <strong>
                ${escapeHtml(lot.quantity)}
                quintals
            </strong>
        </div>

        <div class="modal-detail">
            <span>Expected Price</span>
            <strong>
                ₹${escapeHtml(lot.price)}
                / quintal
            </strong>
        </div>

        <div class="modal-detail">
            <span>Quality / Grade</span>
            <strong>
                ${escapeHtml(
                    lot.quality || "Not specified"
                )}
            </strong>
        </div>

        <div class="modal-detail">
            <span>Availability</span>
            <strong>
                ${escapeHtml(
                    lot.harvestDate
                )}
            </strong>
        </div>

        <div class="modal-detail">
            <span>Location</span>
            <strong>
                ${escapeHtml(lot.district)},
                ${escapeHtml(lot.state)}
            </strong>
        </div>

        <div class="modal-detail">
            <span>Details</span>
            <strong>
                ${escapeHtml(
                    lot.description ||
                    "No additional details."
                )}
            </strong>
        </div>

        <div class="modal-file-list">

            <div class="modal-file-item">
                <span>Product Photo</span>
                <strong>
                    ${lot.productPhotoName
                        ? escapeHtml(lot.productPhotoName)
                        : "Not uploaded"}
                </strong>
            </div>

            <div class="modal-file-item">
                <span>Lab Result</span>
                <strong>
                    ${lot.labResultName
                        ? escapeHtml(lot.labResultName)
                        : "Not uploaded"}
                </strong>
            </div>

        </div>

    `;


    if (
        userRole === "buyer" &&
        allowBid
    ) {

        buyerBidArea.style.display =
            "block";

    }
    else {

        buyerBidArea.style.display =
            "none";

    }


    lotModal.classList.add("open");

    lotModal.setAttribute(
        "aria-hidden",
        "false"
    );

}


function closeLotModal() {

    lotModal.classList.remove("open");

    lotModal.setAttribute(
        "aria-hidden",
        "true"
    );

    selectedLotId = null;

}


if (modalClose) {

    modalClose.addEventListener(
        "click",
        closeLotModal
    );

}


if (modalOverlay) {

    modalOverlay.addEventListener(
        "click",
        closeLotModal
    );

}


/* =========================================================
   BUYER — SUBMIT OFFER
   ========================================================= */

const submitBidButton =
    document.getElementById(
        "submitBidButton"
    );


if (submitBidButton) {

    submitBidButton.addEventListener(
        "click",
        async function () {

            const bidPrice =
                document.getElementById(
                    "bidPrice"
                ).value;

            const bidMessage =
                document.getElementById(
                    "bidMessage"
                );


            bidMessage.textContent = "";


            if (
                !bidPrice ||
                Number(bidPrice) <= 0
            ) {

                bidMessage.textContent =
                    "Enter a valid offer price.";

                return;

            }


            /* =================================================
               BACKEND CONNECTION — CREATE BID

               POST /api/bids

               Body:

               {
                   lotId: selectedLotId,
                   price: Number(bidPrice)
               }

               Backend determines buyer ID from authentication.

               DO NOT send buyerId from frontend.

               ================================================= */


            /*
            const response =
                await fetch(
                    "/api/bids",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",

                            "Authorization":
                                "Bearer " +
                                sessionStorage.getItem(
                                    "Farmer TradeToken"
                                )
                        },

                        body:
                            JSON.stringify({
                                lotId:
                                    selectedLotId,

                                price:
                                    Number(
                                        bidPrice
                                    )
                            })
                    }
                );

            const result =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message ||
                    "Unable to submit offer."
                );
            }
            */


            bidMessage.textContent =
                "Offer is ready for backend submission.";

            bidMessage.style.color =
                "#53634d";

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


function getCropInitial(crop) {

    if (!crop) {
        return "?";
    }

    return crop
        .trim()
        .charAt(0)
        .toUpperCase();

}


function escapeHtml(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================================
   START
   ========================================================= */

setupRoleInterface();
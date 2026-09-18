/* =========================================================
   aapki mandi — MARKET PRICES
   ROLE-AWARE MARKET PAGE

   FARMER:
   Sell with confidence.
   Sell Your Produce →

   BUYER:
   Buy with confidence.
   Find Produce →

   ========================================================= */


/* =========================================================
   ROLE
   ========================================================= */

/*

- Your login/dashboard should store:
-
- sessionStorage.setItem(
-
    "aapki mandiUserRole",
    "buyer"
- );
-
- OR
-
- sessionStorage.setItem(
-
    "aapki mandiUserRole",
    "farmer"
- );

*/

const userRole =
    sessionStorage.getItem("aapki mandiUserRole") || "";



/* =========================================================
   ELEMENTS
   ========================================================= */

const menuButton =
    document.getElementById("menuButton");

const mainNav =
    document.getElementById("mainNav");

const dashboardNavLink =
    document.getElementById("dashboardNavLink");

const stateSelect =
    document.getElementById("stateSelect");

const districtSelect =
    document.getElementById("districtSelect");

const seasonSelect =
    document.getElementById("seasonSelect");

const cropTypeSelect =
    document.getElementById("cropTypeSelect");

const cropSelect =
    document.getElementById("cropSelect");

const marketGrid =
    document.getElementById("marketGrid");

const emptyState =
    document.getElementById("emptyState");

const selectedRegion =
    document.getElementById("selectedRegion");

const lastUpdated =
    document.getElementById("lastUpdated");

const marketPageTitleAccent =
    document.getElementById(
        "marketPageTitleAccent"
    );

const marketIntroText =
    document.getElementById(
        "marketIntroText"
    );

const marketActionButton =
    document.getElementById(
        "marketActionButton"
    );

const marketCtaLabel =
    document.getElementById(
        "marketCtaLabel"
    );

const marketCtaHeading =
    document.getElementById(
        "marketCtaHeading"
    );

const marketCtaAccent =
    document.getElementById(
        "marketCtaAccent"
    );

const marketNoteHeading =
    document.getElementById(
        "marketNoteHeading"
    );

const marketNoteDescription =
    document.getElementById(
        "marketNoteDescription"
    );

const sellNavLink =
    document.getElementById(
        "sellNavLink"
    );



/* =========================================================
   MOBILE NAVIGATION
   ========================================================= */

if (menuButton && mainNav) {

    menuButton.addEventListener(
        "click",
        () => {

            const isOpen =
                mainNav.classList.toggle(
                    "open"
                );

            menuButton.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

        }
    );


    mainNav
        .querySelectorAll("a")
        .forEach(link => {

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

        });

}



/* =========================================================
   ROLE-BASED CONTENT
   ========================================================= */

function setupMarketRoleContent() {


    /* =====================================================
       BUYER
       ===================================================== */

    if (userRole === "buyer") {

        /* ROLE-BASED DASHBOARD */
        if (dashboardNavLink) {

            dashboardNavLink.href =
                "buyer-dashboard.html";

        }


        marketPageTitleAccent.textContent =
            "Buy with confidence.";


        marketIntroText.textContent =
            "Explore agricultural prices by region, season and crop to understand market conditions before choosing the right produce to buy.";


        marketCtaLabel.textContent =
            "READY TO BUY?";


        marketCtaHeading.innerHTML =
            "Turn market information into <span>better purchases.</span>";


        marketCtaAccent.textContent =
            "better purchases.";


        marketActionButton.textContent =
            "Find Produce →";


        /*
         * IMPORTANT:
         * Change this only if your buyer marketplace
         * uses a different filename.
         */

        marketActionButton.href =
            "buyer-dashboard.html";


        marketNoteHeading.textContent =
            "Compare before you buy.";


        marketNoteDescription.textContent =
            "Market prices can vary by location, crop quality, season and market conditions. Use this information to compare opportunities before choosing produce.";


        /*
         * Buyers don't need the farmer-only
         * Sell Produce navigation item.
         */

        if (sellNavLink) {

            sellNavLink.style.display =
                "none";

        }


        return;

    }



    /* =====================================================
       FARMER
       ===================================================== */

    if (userRole === "farmer") {

        /* ROLE-BASED DASHBOARD */
        if (dashboardNavLink) {

            dashboardNavLink.href =
                "farmer-dashboard.html";

        }


        marketPageTitleAccent.textContent =
            "Sell with confidence.";


        marketIntroText.textContent =
            "Explore agricultural prices by region, season and crop to understand market opportunities before selling your produce.";


        marketCtaLabel.textContent =
            "READY TO SELL?";


        marketCtaHeading.innerHTML =
            "Turn market information into <span>better opportunities.</span>";


        marketCtaAccent.textContent =
            "better opportunities.";


        marketActionButton.textContent =
            "Sell Your Produce →";


        marketActionButton.href =
            "sell-produce.html";


        marketNoteHeading.textContent =
            "Compare before you sell.";


        marketNoteDescription.textContent =
            "Market prices can vary by location, crop quality, season and market conditions. Use this information to compare opportunities before listing your produce.";


        if (sellNavLink) {

            sellNavLink.style.display =
                "";

        }


        return;

    }



    /* =====================================================
       NO ROLE / DEFAULT
       ===================================================== */

    if (dashboardNavLink) {

        dashboardNavLink.href =
            "index.html";

    }


    marketPageTitleAccent.textContent =
        "Make better decisions.";


    marketIntroText.textContent =
        "Explore agricultural prices by region, season and crop to understand current market opportunities.";


    marketCtaLabel.textContent =
        "EXPLORE THE MARKET";


    marketCtaHeading.innerHTML =
        "Turn market information into <span>better decisions.</span>";


    marketCtaAccent.textContent =
        "better decisions.";


    marketActionButton.textContent =
        "Explore Marketplace →";


    marketActionButton.href =
        "index.html";


    marketNoteHeading.textContent =
        "Compare before you decide.";


    marketNoteDescription.textContent =
        "Market prices can vary by location, crop quality, season and market conditions. Use this information to compare opportunities before making a decision.";

}



/* =========================================================
   STATES + DISTRICTS
   ========================================================= */

const stateDistricts = {

    "Andhra Pradesh": [
        "Anantapur",
        "Chittoor",
        "Guntur",
        "Krishna",
        "Kurnool",
        "Nellore",
        "Prakasam",
        "Srikakulam",
        "Visakhapatnam",
        "Vizianagaram",
        "West Godavari"
    ],

    "Arunachal Pradesh": [
        "Itanagar",
        "Tawang",
        "Papum Pare",
        "West Kameng",
        "East Kameng",
        "Lower Subansiri",
        "Upper Subansiri",
        "West Siang",
        "East Siang",
        "Lohit",
        "Changlang"
    ],

    "Assam": [
        "Kamrup",
        "Kamrup Metropolitan",
        "Dibrugarh",
        "Jorhat",
        "Nagaon",
        "Sonitpur",
        "Tinsukia",
        "Barpeta",
        "Cachar",
        "Dhemaji",
        "Golaghat"
    ],

    "Bihar": [
        "Patna",
        "Gaya",
        "Nalanda",
        "Muzaffarpur",
        "Vaishali",
        "Bhagalpur",
        "Darbhanga",
        "Begusarai",
        "Purnia",
        "Samastipur",
        "Rohtas"
    ],

    "Chhattisgarh": [
        "Raipur",
        "Durg",
        "Bilaspur",
        "Rajnandgaon",
        "Korba",
        "Bastar",
        "Dhamtari",
        "Mahasamund",
        "Surguja"
    ],

    "Goa": [
        "North Goa",
        "South Goa"
    ],

    "Gujarat": [
        "Ahmedabad",
        "Amreli",
        "Anand",
        "Banaskantha",
        "Bharuch",
        "Bhavnagar",
        "Gandhinagar",
        "Jamnagar",
        "Junagadh",
        "Kutch",
        "Mehsana",
        "Rajkot",
        "Surat",
        "Vadodara"
    ],

    "Haryana": [
        "Ambala",
        "Bhiwani",
        "Fatehabad",
        "Gurugram",
        "Hisar",
        "Jind",
        "Karnal",
        "Kurukshetra",
        "Panipat",
        "Rohtak",
        "Sirsa",
        "Sonipat"
    ],

    "Himachal Pradesh": [
        "Bilaspur",
        "Chamba",
        "Hamirpur",
        "Kangra",
        "Kullu",
        "Mandi",
        "Shimla",
        "Sirmaur",
        "Solan",
        "Una"
    ],

    "Jharkhand": [
        "Ranchi",
        "Bokaro",
        "Dhanbad",
        "East Singhbhum",
        "Hazaribagh",
        "Deoghar",
        "Dumka",
        "Giridih",
        "Palamu"
    ],

    "Karnataka": [
        "Bengaluru Urban",
        "Belagavi",
        "Ballari",
        "Chikkaballapur",
        "Chitradurga",
        "Dharwad",
        "Gadag",
        "Hassan",
        "Mandya",
        "Mysuru",
        "Raichur",
        "Shivamogga",
        "Tumakuru",
        "Vijayapura",
        "Kolar"
    ],

    "Kerala": [
        "Thiruvananthapuram",
        "Kollam",
        "Pathanamthitta",
        "Alappuzha",
        "Kottayam",
        "Idukki",
        "Ernakulam",
        "Thrissur",
        "Palakkad",
        "Malappuram",
        "Kozhikode",
        "Wayanad",
        "Kannur",
        "Kasaragod"
    ],

    "Madhya Pradesh": [
        "Bhopal",
        "Indore",
        "Ujjain",
        "Dewas",
        "Gwalior",
        "Jabalpur",
        "Sagar",
        "Ratlam",
        "Mandsaur",
        "Neemuch",
        "Vidisha",
        "Sehore"
    ],

    "Maharashtra": [
        "Ahmednagar",
        "Akola",
        "Amravati",
        "Aurangabad",
        "Beed",
        "Bhandara",
        "Buldhana",
        "Chandrapur",
        "Dhule",
        "Jalgaon",
        "Jalna",
        "Kolhapur",
        "Latur",
        "Mumbai",
        "Nagpur",
        "Nanded",
        "Nandurbar",
        "Nashik",
        "Osmanabad",
        "Palghar",
        "Parbhani",
        "Pune",
        "Raigad",
        "Ratnagiri",
        "Sangli",
        "Satara",
        "Sindhudurg",
        "Solapur",
        "Thane",
        "Wardha",
        "Washim",
        "Yavatmal"
    ],

    "Manipur": [
        "Imphal East",
        "Imphal West",
        "Bishnupur",
        "Churachandpur",
        "Thoubal",
        "Ukhrul",
        "Senapati"
    ],

    "Meghalaya": [
        "East Khasi Hills",
        "West Khasi Hills",
        "Ri-Bhoi",
        "East Garo Hills",
        "West Garo Hills",
        "South Garo Hills",
        "West Jaintia Hills"
    ],

    "Mizoram": [
        "Aizawl",
        "Lunglei",
        "Champhai",
        "Kolasib",
        "Lawngtlai",
        "Mamit",
        "Serchhip"
    ],

    "Nagaland": [
        "Dimapur",
        "Kohima",
        "Mokokchung",
        "Mon",
        "Phek",
        "Tuensang",
        "Wokha",
        "Zunheboto"
    ],

    "Odisha": [
        "Angul",
        "Balangir",
        "Balasore",
        "Bargarh",
        "Cuttack",
        "Dhenkanal",
        "Ganjam",
        "Jajpur",
        "Kalahandi",
        "Koraput",
        "Mayurbhanj",
        "Puri",
        "Sambalpur",
        "Sundargarh"
    ],

    "Punjab": [
        "Amritsar",
        "Bathinda",
        "Faridkot",
        "Fazilka",
        "Ferozepur",
        "Gurdaspur",
        "Hoshiarpur",
        "Jalandhar",
        "Ludhiana",
        "Mansa",
        "Patiala",
        "Sangrur"
    ],

    "Rajasthan": [
        "Ajmer",
        "Alwar",
        "Bharatpur",
        "Bikaner",
        "Chittorgarh",
        "Jaipur",
        "Jaisalmer",
        "Jalore",
        "Jodhpur",
        "Kota",
        "Nagaur",
        "Pali",
        "Sikar",
        "Sri Ganganagar",
        "Udaipur"
    ],

    "Sikkim": [
        "East Sikkim",
        "West Sikkim",
        "North Sikkim",
        "South Sikkim"
    ],

    "Tamil Nadu": [
        "Chennai",
        "Coimbatore",
        "Cuddalore",
        "Dindigul",
        "Erode",
        "Madurai",
        "Namakkal",
        "Salem",
        "Thanjavur",
        "Theni",
        "Tiruchirappalli",
        "Tirunelveli",
        "Vellore"
    ],

    "Telangana": [
        "Hyderabad",
        "Adilabad",
        "Karimnagar",
        "Khammam",
        "Mahbubnagar",
        "Medak",
        "Nalgonda",
        "Nizamabad",
        "Rangareddy",
        "Warangal"
    ],

    "Tripura": [
        "West Tripura",
        "South Tripura",
        "North Tripura",
        "Dhalai"
    ],

    "Uttar Pradesh": [
        "Agra",
        "Aligarh",
        "Allahabad",
        "Azamgarh",
        "Bareilly",
        "Bulandshahr",
        "Etawah",
        "Farrukhabad",
        "Firozabad",
        "Ghaziabad",
        "Gorakhpur",
        "Jhansi",
        "Kanpur",
        "Lucknow",
        "Mathura",
        "Meerut",
        "Moradabad",
        "Muzaffarnagar",
        "Prayagraj",
        "Saharanpur",
        "Varanasi"
    ],

    "Uttarakhand": [
        "Dehradun",
        "Haridwar",
        "Nainital",
        "Udham Singh Nagar",
        "Almora",
        "Bageshwar",
        "Chamoli",
        "Champawat",
        "Pauri Garhwal",
        "Pithoragarh",
        "Rudraprayag",
        "Tehri Garhwal",
        "Uttarkashi"
    ],

    "West Bengal": [
        "Bankura",
        "Bardhaman",
        "Birbhum",
        "Cooch Behar",
        "Darjeeling",
        "Hooghly",
        "Howrah",
        "Jalpaiguri",
        "Malda",
        "Murshidabad",
        "Nadia",
        "North 24 Parganas",
        "South 24 Parganas",
        "Purulia"
    ],

    "Andaman and Nicobar Islands": [
        "South Andaman",
        "North and Middle Andaman",
        "Nicobar"
    ],

    "Chandigarh": [
        "Chandigarh"
    ],

    "Dadra and Nagar Haveli and Daman and Diu": [
        "Dadra and Nagar Haveli",
        "Daman",
        "Diu"
    ],

    "Delhi": [
        "Central Delhi",
        "East Delhi",
        "New Delhi",
        "North Delhi",
        "North East Delhi",
        "North West Delhi",
        "Shahdara",
        "South Delhi",
        "South East Delhi",
        "South West Delhi",
        "West Delhi"
    ],

    "Jammu and Kashmir": [
        "Anantnag",
        "Baramulla",
        "Budgam",
        "Jammu",
        "Kathua",
        "Kishtwar",
        "Kupwara",
        "Pulwama",
        "Rajouri",
        "Samba",
        "Srinagar",
        "Udhampur"
    ],

    "Ladakh": [
        "Leh",
        "Kargil"
    ],

    "Lakshadweep": [
        "Kavaratti",
        "Agatti",
        "Amini",
        "Andrott",
        "Kalpeni",
        "Minicoy"
    ],

    "Puducherry": [
        "Puducherry",
        "Karaikal",
        "Mahe",
        "Yanam"
    ]

};



/* =========================================================
   CROP MASTER
   ========================================================= */

const crops = [

    /* CEREALS */

    {
        name: "Rice",
        type: "Cereals",
        season: "Kharif"
    },

    {
        name: "Basmati Rice",
        type: "Cereals",
        season: "Kharif"
    },

    {
        name: "Maize",
        type: "Cereals",
        season: "Kharif"
    },

    {
        name: "Jowar",
        type: "Cereals",
        season: "Kharif"
    },

    {
        name: "Bajra",
        type: "Cereals",
        season: "Kharif"
    },

    {
        name: "Ragi",
        type: "Cereals",
        season: "Kharif"
    },

    {
        name: "Wheat",
        type: "Cereals",
        season: "Rabi"
    },

    {
        name: "Barley",
        type: "Cereals",
        season: "Rabi"
    },


    /* PULSES */

    {
        name: "Chickpea",
        type: "Pulses",
        season: "Rabi"
    },

    {
        name: "Masoor",
        type: "Pulses",
        season: "Rabi"
    },

    {
        name: "Tur / Arhar",
        type: "Pulses",
        season: "Kharif"
    },

    {
        name: "Urad",
        type: "Pulses",
        season: "Kharif"
    },

    {
        name: "Moong",
        type: "Pulses",
        season: "Zaid"
    },


    /* OILSEEDS */

    {
        name: "Mustard",
        type: "Oilseeds",
        season: "Rabi"
    },

    {
        name: "Soybean",
        type: "Oilseeds",
        season: "Kharif"
    },

    {
        name: "Groundnut",
        type: "Oilseeds",
        season: "Kharif"
    },

    {
        name: "Sunflower",
        type: "Oilseeds",
        season: "Kharif"
    },

    {
        name: "Sesame",
        type: "Oilseeds",
        season: "Kharif"
    },


    /* VEGETABLES */

    {
        name: "Potato",
        type: "Vegetables",
        season: "Rabi"
    },

    {
        name: "Red Onion",
        type: "Vegetables",
        season: "Rabi"
    },

    {
        name: "Cauliflower",
        type: "Vegetables",
        season: "Rabi"
    },

    {
        name: "Cabbage",
        type: "Vegetables",
        season: "Rabi"
    },

    {
        name: "Green Peas",
        type: "Vegetables",
        season: "Rabi"
    },

    {
        name: "Okra",
        type: "Vegetables",
        season: "Kharif"
    },

    {
        name: "Tomato",
        type: "Vegetables",
        season: "Year Round"
    },

    {
        name: "Onion",
        type: "Vegetables",
        season: "Year Round"
    },

    {
        name: "Brinjal",
        type: "Vegetables",
        season: "Year Round"
    },

    {
        name: "Green Chilli",
        type: "Vegetables",
        season: "Year Round"
    },


    /* FRUITS */

    {
        name: "Mango",
        type: "Fruits",
        season: "Year Round"
    },

    {
        name: "Banana",
        type: "Fruits",
        season: "Year Round"
    },

    {
        name: "Apple",
        type: "Fruits",
        season: "Year Round"
    },

    {
        name: "Pomegranate",
        type: "Fruits",
        season: "Year Round"
    },

    {
        name: "Papaya",
        type: "Fruits",
        season: "Year Round"
    },

    {
        name: "Orange",
        type: "Fruits",
        season: "Rabi"
    },

    {
        name: "Grapes",
        type: "Fruits",
        season: "Rabi"
    },


    /* CASH CROPS */

    {
        name: "Cotton",
        type: "Cash Crops",
        season: "Kharif"
    },

    {
        name: "Sugarcane",
        type: "Cash Crops",
        season: "Year Round"
    },

    {
        name: "Jute",
        type: "Cash Crops",
        season: "Kharif"
    },


    /* SPICES */

    {
        name: "Turmeric",
        type: "Spices",
        season: "Kharif"
    },

    {
        name: "Ginger",
        type: "Spices",
        season: "Kharif"
    },

    {
        name: "Cumin",
        type: "Spices",
        season: "Rabi"
    },

    {
        name: "Coriander",
        type: "Spices",
        season: "Rabi"
    },

    {
        name: "Cardamom",
        type: "Spices",
        season: "Year Round"
    },


    /* PLANTATION */

    {
        name: "Tea",
        type: "Plantation",
        season: "Year Round"
    },

    {
        name: "Coffee",
        type: "Plantation",
        season: "Year Round"
    }

];



/* =========================================================
   MARKET DATA
   ========================================================= */

const marketData = [

    {
        crop: "Wheat",
        cropType: "Cereals",
        season: "Rabi",
        state: "Maharashtra",
        district: "Pune",
        price: 2450,
        unit: "quintal",
        change: 4.2,
        trend: "positive"
    },

    {
        crop: "Red Onion",
        cropType: "Vegetables",
        season: "Rabi",
        state: "Maharashtra",
        district: "Pune",
        price: 2180,
        unit: "quintal",
        change: 1.6,
        trend: "positive"
    },

    {
        crop: "Soybean",
        cropType: "Oilseeds",
        season: "Kharif",
        state: "Maharashtra",
        district: "Pune",
        price: 4650,
        unit: "quintal",
        change: -0.8,
        trend: "negative"
    },

    {
        crop: "Sugarcane",
        cropType: "Cash Crops",
        season: "Year Round",
        state: "Maharashtra",
        district: "Pune",
        price: 340,
        unit: "quintal",
        change: 2.1,
        trend: "positive"
    },

    {
        crop: "Mustard",
        cropType: "Oilseeds",
        season: "Rabi",
        state: "Rajasthan",
        district: "Jaipur",
        price: 5120,
        unit: "quintal",
        change: -1.3,
        trend: "negative"
    },

    {
        crop: "Maize",
        cropType: "Cereals",
        season: "Kharif",
        state: "Karnataka",
        district: "Belagavi",
        price: 2250,
        unit: "quintal",
        change: 1.7,
        trend: "positive"
    },

    {
        crop: "Groundnut",
        cropType: "Oilseeds",
        season: "Kharif",
        state: "Gujarat",
        district: "Rajkot",
        price: 6100,
        unit: "quintal",
        change: 3.1,
        trend: "positive"
    },

    {
        crop: "Chickpea",
        cropType: "Pulses",
        season: "Rabi",
        state: "Madhya Pradesh",
        district: "Indore",
        price: 5800,
        unit: "quintal",
        change: 1.4,
        trend: "positive"
    },

    {
        crop: "Cotton",
        cropType: "Cash Crops",
        season: "Kharif",
        state: "Gujarat",
        district: "Ahmedabad",
        price: 7200,
        unit: "quintal",
        change: 2.4,
        trend: "positive"
    },

    {
        crop: "Turmeric",
        cropType: "Spices",
        season: "Kharif",
        state: "Telangana",
        district: "Nizamabad",
        price: 11800,
        unit: "quintal",
        change: 3.8,
        trend: "positive"
    },

    {
        crop: "Potato",
        cropType: "Vegetables",
        season: "Rabi",
        state: "Uttar Pradesh",
        district: "Agra",
        price: 1650,
        unit: "quintal",
        change: -1.1,
        trend: "negative"
    },

    {
        crop: "Tomato",
        cropType: "Vegetables",
        season: "Year Round",
        state: "Karnataka",
        district: "Kolar",
        price: 2850,
        unit: "quintal",
        change: 5.2,
        trend: "positive"
    },

    {
        crop: "Apple",
        cropType: "Fruits",
        season: "Year Round",
        state: "Himachal Pradesh",
        district: "Shimla",
        price: 8500,
        unit: "quintal",
        change: 2.5,
        trend: "positive"
    },

    {
        crop: "Pomegranate",
        cropType: "Fruits",
        season: "Year Round",
        state: "Maharashtra",
        district: "Solapur",
        price: 9200,
        unit: "quintal",
        change: 3.4,
        trend: "positive"
    }

];



/* =========================================================
   POPULATE STATES
   ========================================================= */

function populateStates() {

    stateSelect.innerHTML = "";


    Object.keys(stateDistricts)
        .sort()
        .forEach(state => {

            const option =
                document.createElement(
                    "option"
                );

            option.value = state;

            option.textContent = state;

            stateSelect.appendChild(
                option
            );

        });


    stateSelect.value =
        "Maharashtra";

}



/* =========================================================
   POPULATE DISTRICTS
   ========================================================= */

function populateDistricts(state) {

    districtSelect.innerHTML = "";


    const districts =
        stateDistricts[state] || [];


    districts.forEach(district => {

        const option =
            document.createElement(
                "option"
            );

        option.value = district;

        option.textContent = district;

        districtSelect.appendChild(
            option
        );

    });


    if (
        districts.includes("Pune")
    ) {

        districtSelect.value =
            "Pune";

    }

    else if (
        districts.length > 0
    ) {

        districtSelect.value =
            districts[0];

    }


    updateRegionText();

}



/* =========================================================
   POPULATE CROP TYPES
   ========================================================= */

function populateCropTypes() {

    const selectedSeason =
        seasonSelect.value;


    cropTypeSelect.innerHTML =
        "";


    const allOption =
        document.createElement(
            "option"
        );

    allOption.value =
        "all";

    allOption.textContent =
        "All Crop Types";


    cropTypeSelect.appendChild(
        allOption
    );


    const availableTypes =
        [
            ...new Set(

                crops
                    .filter(crop => {

                        return (
                            selectedSeason === "all" ||
                            crop.season === selectedSeason
                        );

                    })
                    .map(crop =>
                        crop.type
                    )

            )
        ];


    availableTypes
        .sort()
        .forEach(type => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                type;

            option.textContent =
                type;

            cropTypeSelect.appendChild(
                option
            );

        });

}



/* =========================================================
   POPULATE CROPS
   ========================================================= */

function populateCrops() {

    const selectedSeason =
        seasonSelect.value;

    const selectedType =
        cropTypeSelect.value;


    cropSelect.innerHTML =
        "";


    const allOption =
        document.createElement(
            "option"
        );

    allOption.value =
        "all";

    allOption.textContent =
        "All Crops";


    cropSelect.appendChild(
        allOption
    );


    const availableCrops =
        crops
            .filter(crop => {

                const seasonMatches =
                    selectedSeason === "all" ||
                    crop.season === selectedSeason;


                const typeMatches =
                    selectedType === "all" ||
                    crop.type === selectedType;


                return (
                    seasonMatches &&
                    typeMatches
                );

            })
            .sort(
                (a, b) =>
                    a.name.localeCompare(
                        b.name
                    )
            );


    availableCrops.forEach(crop => {

        const option =
            document.createElement(
                "option"
            );

        option.value =
            crop.name;

        option.textContent =
            crop.name;

        cropSelect.appendChild(
            option
        );

    });

}



/* =========================================================
   UPDATE REGION TEXT
   ========================================================= */

function updateRegionText() {

    const district =
        districtSelect.value;

    const state =
        stateSelect.value;


    if (
        district &&
        state
    ) {

        selectedRegion.textContent =
            `${district}, ${state}`;

    }

    else {

        selectedRegion.textContent =
            state || "India";

    }

}



/* =========================================================
   FILTER MARKET DATA
   ========================================================= */

function getFilteredData() {

    const selectedState =
        stateSelect.value;

    const selectedDistrict =
        districtSelect.value;

    const selectedSeason =
        seasonSelect.value;

    const selectedType =
        cropTypeSelect.value;

    const selectedCrop =
        cropSelect.value;


    return marketData.filter(item => {

        const stateMatches =
            item.state === selectedState;

        const districtMatches =
            item.district === selectedDistrict;

        const seasonMatches =
            selectedSeason === "all" ||
            item.season === selectedSeason;

        const typeMatches =
            selectedType === "all" ||
            item.cropType === selectedType;

        const cropMatches =
            selectedCrop === "all" ||
            item.crop === selectedCrop;


        return (
            stateMatches &&
            districtMatches &&
            seasonMatches &&
            typeMatches &&
            cropMatches
        );

    });

}



/* =========================================================
   CREATE MARKET CARD
   ========================================================= */

function createMarketCard(item) {

    const card =
        document.createElement(
            "article"
        );


    card.className =
        "market-card";


    const firstLetter =
        item.crop
            .charAt(0)
            .toUpperCase();


    const arrow =
        item.trend === "positive"
            ? "↑"
            : "↓";


    const changeClass =
        item.trend === "positive"
            ? "positive"
            : "negative";


    card.innerHTML = `

        <div class="card-top">

            <div class="crop-icon">
                ${firstLetter}
            </div>

            <span
                class="price-change ${changeClass}"
            >
                ${arrow} ${Math.abs(item.change)}%
            </span>

        </div>


        <div class="crop-category">
            ${item.cropType}
        </div>


        <h3>
            ${item.crop}
        </h3>


        <p class="market-name">
            ${item.state}
        </p>


        <div class="price-row">

            <strong>
                ₹${Number(item.price).toLocaleString("en-IN")}
            </strong>

            <span>
                / ${item.unit}
            </span>

        </div>


        <div class="card-footer">

            <span>
                ${item.season}
            </span>

            <span>
                Market rate
            </span>

        </div>

    `;


    return card;

}



/* =========================================================
   RENDER
   ========================================================= */

function renderMarketData() {

    const filteredData =
        getFilteredData();


    marketGrid.innerHTML =
        "";


    if (
        filteredData.length === 0
    ) {

        emptyState.hidden =
            false;

        return;

    }


    emptyState.hidden =
        true;


    filteredData.forEach(item => {

        marketGrid.appendChild(
            createMarketCard(item)
        );

    });


    lastUpdated.textContent =
        "Updated recently";

}



/* =========================================================
   STATE CHANGE
   ========================================================= */

stateSelect.addEventListener(
    "change",
    () => {

        populateDistricts(
            stateSelect.value
        );

        renderMarketData();

    }
);



/* =========================================================
   DISTRICT CHANGE
   ========================================================= */

districtSelect.addEventListener(
    "change",
    () => {

        updateRegionText();

        renderMarketData();

    }
);



/* =========================================================
   SEASON CHANGE
   ========================================================= */

seasonSelect.addEventListener(
    "change",
    () => {

        populateCropTypes();

        cropTypeSelect.value =
            "all";

        populateCrops();

        renderMarketData();

    }
);



/* =========================================================
   CROP TYPE CHANGE
   ========================================================= */

cropTypeSelect.addEventListener(
    "change",
    () => {

        populateCrops();

        renderMarketData();

    }
);



/* =========================================================
   CROP CHANGE
   ========================================================= */

cropSelect.addEventListener(
    "change",
    renderMarketData
);



/* =========================================================
   INITIALISE
   ========================================================= */

function initialiseMarketPage() {

    populateStates();


    populateDistricts(
        stateSelect.value
    );


    populateCropTypes();


    populateCrops();


    updateRegionText();


    renderMarketData();

}



/* =========================================================
   START
   ========================================================= */

setupMarketRoleContent();

initialiseMarketPage();
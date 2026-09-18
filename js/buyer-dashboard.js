/* =========================================================
   Farmer Trade BUYER DASHBOARD
   ========================================================= */


/* =========================================================
   CONFIGURATION
   ========================================================= */

/*
   BACKEND TEAM:
   Change this to the actual API base URL when the backend
   is connected.

   Example:

   const API_BASE_URL = "http://localhost:5000/api";

   Production example:

   const API_BASE_URL = "https://your-domain.com/api";
*/

const API_BASE_URL = "/api";


/*
   DEMO MODE

   Keep true while backend endpoints are not connected.

   Set to false when the backend is ready.
*/

const DEMO_MODE = true;


/* =========================================================
   ELEMENTS
   ========================================================= */

const menuButton =
    document.getElementById("menuButton");

const mainNav =
    document.getElementById("mainNav");

const stateSelect =
    document.getElementById("stateSelect");

const districtSelect =
    document.getElementById("districtSelect");

const regionDisplay =
    document.getElementById("regionDisplay");

const cropSearch =
    document.getElementById("cropSearch");

const categorySelect =
    document.getElementById("categorySelect");

const searchButton =
    document.getElementById("searchButton");

const produceGrid =
    document.getElementById("produceGrid");

const listingCount =
    document.getElementById("listingCount");

const emptyState =
    document.getElementById("emptyState");

const requestBox =
    document.getElementById("requestBox");

const requestEmpty =
    document.getElementById("requestEmpty");

const listingModal =
    document.getElementById("listingModal");

const modalOverlay =
    document.getElementById("modalOverlay");

const modalClose =
    document.getElementById("modalClose");

const modalCropName =
    document.getElementById("modalCropName");

const modalPrice =
    document.getElementById("modalPrice");

const modalQuantity =
    document.getElementById("modalQuantity");

const modalLocation =
    document.getElementById("modalLocation");

const modalCategory =
    document.getElementById("modalCategory");

const modalListed =
    document.getElementById("modalListed");

const modalSeller =
    document.getElementById("modalSeller");

const modalSellerLocation =
    document.getElementById("modalSellerLocation");

const selectedListingId =
    document.getElementById("selectedListingId");

const interestQuantity =
    document.getElementById("interestQuantity");

const offerPrice =
    document.getElementById("offerPrice");

const interestForm =
    document.getElementById("interestForm");

const modalMessage =
    document.getElementById("modalMessage");


/* =========================================================
   STATES + DISTRICTS
   ========================================================= */

const states = {

    "Andhra Pradesh": [
        "Alluri Sitharama Raju",
        "Anakapalli",
        "Ananthapuramu",
        "Annamayya",
        "Bapatla",
        "Chittoor",
        "East Godavari",
        "Eluru",
        "Guntur",
        "Kakinada",
        "Krishna",
        "Kurnool",
        "Nandyal",
        "NTR",
        "Palnadu",
        "Prakasam",
        "Srikakulam",
        "Tirupati",
        "Visakhapatnam",
        "Vizianagaram",
        "West Godavari",
        "YSR Kadapa"
    ],

    "Arunachal Pradesh": [
        "Anjaw",
        "Changlang",
        "East Kameng",
        "East Siang",
        "Itanagar Capital Complex",
        "Kamle",
        "Lepa Rada",
        "Lohit",
        "Longding",
        "Lower Dibang Valley",
        "Lower Siang",
        "Lower Subansiri",
        "Namsai",
        "Pakke Kessang",
        "Papum Pare",
        "Shi Yomi",
        "Siang",
        "Tawang",
        "Tirap",
        "Upper Siang",
        "Upper Subansiri",
        "West Kameng",
        "West Siang"
    ],

    "Assam": [
        "Baksa",
        "Barpeta",
        "Biswanath",
        "Bongaigaon",
        "Cachar",
        "Charaideo",
        "Chirang",
        "Darrang",
        "Dhemaji",
        "Dhubri",
        "Dibrugarh",
        "Dima Hasao",
        "Goalpara",
        "Golaghat",
        "Hailakandi",
        "Hojai",
        "Jorhat",
        "Kamrup",
        "Kamrup Metropolitan",
        "Karbi Anglong",
        "Karimganj",
        "Kokrajhar",
        "Lakhimpur",
        "Majuli",
        "Morigaon",
        "Nagaon",
        "Nalbari",
        "Sivasagar",
        "Sonitpur",
        "Tinsukia",
        "Udalguri"
    ],

    "Bihar": [
        "Araria",
        "Arwal",
        "Aurangabad",
        "Banka",
        "Begusarai",
        "Bhagalpur",
        "Bhojpur",
        "Buxar",
        "Darbhanga",
        "East Champaran",
        "Gaya",
        "Gopalganj",
        "Jamui",
        "Jehanabad",
        "Kaimur",
        "Katihar",
        "Khagaria",
        "Kishanganj",
        "Lakhisarai",
        "Madhepura",
        "Madhubani",
        "Munger",
        "Muzaffarpur",
        "Nalanda",
        "Nawada",
        "Patna",
        "Purnia",
        "Rohtas",
        "Saharsa",
        "Samastipur",
        "Saran",
        "Sheikhpura",
        "Sheohar",
        "Sitamarhi",
        "Siwan",
        "Supaul",
        "Vaishali",
        "West Champaran"
    ],

    "Chhattisgarh": [
        "Balod",
        "Baloda Bazar",
        "Balrampur",
        "Bastar",
        "Bemetara",
        "Bijapur",
        "Bilaspur",
        "Dantewada",
        "Dhamtari",
        "Durg",
        "Gariaband",
        "Gaurela-Pendra-Marwahi",
        "Janjgir-Champa",
        "Jashpur",
        "Kanker",
        "Kondagaon",
        "Korba",
        "Koriya",
        "Mahasamund",
        "Mungeli",
        "Narayanpur",
        "Raigarh",
        "Raipur",
        "Rajnandgaon",
        "Sukma",
        "Surajpur",
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
        "Aravalli",
        "Banaskantha",
        "Bharuch",
        "Bhavnagar",
        "Botad",
        "Chhota Udaipur",
        "Dahod",
        "Dang",
        "Devbhoomi Dwarka",
        "Gandhinagar",
        "Gir Somnath",
        "Jamnagar",
        "Junagadh",
        "Kheda",
        "Kutch",
        "Mahisagar",
        "Mehsana",
        "Morbi",
        "Narmada",
        "Navsari",
        "Panchmahal",
        "Patan",
        "Porbandar",
        "Rajkot",
        "Sabarkantha",
        "Surat",
        "Surendranagar",
        "Tapi",
        "Vadodara",
        "Valsad"
    ],

    "Haryana": [
        "Ambala",
        "Bhiwani",
        "Charkhi Dadri",
        "Faridabad",
        "Fatehabad",
        "Gurugram",
        "Hisar",
        "Jhajjar",
        "Jind",
        "Kaithal",
        "Karnal",
        "Kurukshetra",
        "Mahendragarh",
        "Nuh",
        "Palwal",
        "Panchkula",
        "Panipat",
        "Rewari",
        "Rohtak",
        "Sirsa",
        "Sonipat",
        "Yamunanagar"
    ],

    "Himachal Pradesh": [
        "Bilaspur",
        "Chamba",
        "Hamirpur",
        "Kangra",
        "Kinnaur",
        "Kullu",
        "Lahaul and Spiti",
        "Mandi",
        "Shimla",
        "Sirmaur",
        "Solan",
        "Una"
    ],

    "Jharkhand": [
        "Bokaro",
        "Chatra",
        "Deoghar",
        "Dhanbad",
        "Dumka",
        "East Singhbhum",
        "Garhwa",
        "Giridih",
        "Godda",
        "Gumla",
        "Hazaribagh",
        "Jamtara",
        "Khunti",
        "Koderma",
        "Latehar",
        "Lohardaga",
        "Pakur",
        "Palamu",
        "Ramgarh",
        "Ranchi",
        "Sahebganj",
        "Seraikela Kharsawan",
        "Simdega",
        "West Singhbhum"
    ],

    "Karnataka": [
        "Bagalkot",
        "Ballari",
        "Belagavi",
        "Bengaluru Rural",
        "Bengaluru Urban",
        "Bidar",
        "Chamarajanagar",
        "Chikkaballapur",
        "Chikkamagaluru",
        "Chitradurga",
        "Dakshina Kannada",
        "Davanagere",
        "Dharwad",
        "Gadag",
        "Hassan",
        "Haveri",
        "Kalaburagi",
        "Kodagu",
        "Kolar",
        "Koppal",
        "Mandya",
        "Mysuru",
        "Raichur",
        "Ramanagara",
        "Shivamogga",
        "Tumakuru",
        "Udupi",
        "Uttara Kannada",
        "Vijayapura",
        "Vijayanagara",
        "Yadgir"
    ],

    "Kerala": [
        "Alappuzha",
        "Ernakulam",
        "Idukki",
        "Kannur",
        "Kasaragod",
        "Kollam",
        "Kottayam",
        "Kozhikode",
        "Malappuram",
        "Palakkad",
        "Pathanamthitta",
        "Thiruvananthapuram",
        "Thrissur",
        "Wayanad"
    ],

    "Madhya Pradesh": [
        "Agar Malwa",
        "Alirajpur",
        "Anuppur",
        "Ashoknagar",
        "Balaghat",
        "Barwani",
        "Betul",
        "Bhind",
        "Bhopal",
        "Burhanpur",
        "Chhatarpur",
        "Chhindwara",
        "Damoh",
        "Datia",
        "Dewas",
        "Dhar",
        "Dindori",
        "Guna",
        "Gwalior",
        "Harda",
        "Indore",
        "Jabalpur",
        "Jhabua",
        "Katni",
        "Khandwa",
        "Khargone",
        "Mandla",
        "Mandsaur",
        "Morena",
        "Narmadapuram",
        "Narsinghpur",
        "Neemuch",
        "Panna",
        "Raisen",
        "Rajgarh",
        "Ratlam",
        "Rewa",
        "Sagar",
        "Satna",
        "Sehore",
        "Seoni",
        "Shahdol",
        "Shajapur",
        "Sheopur",
        "Shivpuri",
        "Sidhi",
        "Singrauli",
        "Tikamgarh",
        "Ujjain",
        "Umaria",
        "Vidisha"
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
        "Gadchiroli",
        "Gondia",
        "Hingoli",
        "Jalgaon",
        "Jalna",
        "Kolhapur",
        "Latur",
        "Mumbai City",
        "Mumbai Suburban",
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
        "Bishnupur",
        "Chandel",
        "Churachandpur",
        "Imphal East",
        "Imphal West",
        "Jiribam",
        "Kakching",
        "Kamjong",
        "Kangpokpi",
        "Noney",
        "Pherzawl",
        "Senapati",
        "Tamenglong",
        "Tengnoupal",
        "Thoubal",
        "Ukhrul"
    ],

    "Meghalaya": [
        "East Garo Hills",
        "East Jaintia Hills",
        "East Khasi Hills",
        "North Garo Hills",
        "Ri-Bhoi",
        "South Garo Hills",
        "South West Garo Hills",
        "South West Khasi Hills",
        "West Garo Hills",
        "West Jaintia Hills",
        "West Khasi Hills"
    ],

    "Mizoram": [
        "Aizawl",
        "Champhai",
        "Hnahthial",
        "Khawzawl",
        "Kolasib",
        "Lawngtlai",
        "Lunglei",
        "Mamit",
        "Saiha",
        "Saitual",
        "Serchhip"
    ],

    "Nagaland": [
        "Chumoukedima",
        "Dimapur",
        "Kiphire",
        "Kohima",
        "Longleng",
        "Mokokchung",
        "Mon",
        "Niuland",
        "Noklak",
        "Peren",
        "Phek",
        "Shamator",
        "Tseminyu",
        "Tuensang",
        "Wokha",
        "Zunheboto"
    ],

    "Odisha": [
        "Angul",
        "Balangir",
        "Balasore",
        "Bargarh",
        "Bhadrak",
        "Boudh",
        "Cuttack",
        "Deogarh",
        "Dhenkanal",
        "Gajapati",
        "Ganjam",
        "Jagatsinghpur",
        "Jajpur",
        "Jharsuguda",
        "Kalahandi",
        "Kandhamal",
        "Kendrapara",
        "Kendujhar",
        "Khordha",
        "Koraput",
        "Malkangiri",
        "Mayurbhanj",
        "Nabarangpur",
        "Nayagarh",
        "Nuapada",
        "Puri",
        "Rayagada",
        "Sambalpur",
        "Subarnapur",
        "Sundargarh"
    ],

    "Punjab": [
        "Amritsar",
        "Barnala",
        "Bathinda",
        "Faridkot",
        "Fatehgarh Sahib",
        "Fazilka",
        "Ferozepur",
        "Gurdaspur",
        "Hoshiarpur",
        "Jalandhar",
        "Kapurthala",
        "Ludhiana",
        "Malerkotla",
        "Mansa",
        "Moga",
        "Pathankot",
        "Patiala",
        "Rupnagar",
        "Sangrur",
        "Tarn Taran"
    ],

    "Rajasthan": [
        "Ajmer",
        "Alwar",
        "Banswara",
        "Baran",
        "Barmer",
        "Bharatpur",
        "Bhilwara",
        "Bikaner",
        "Bundi",
        "Chittorgarh",
        "Churu",
        "Dausa",
        "Dholpur",
        "Dungarpur",
        "Hanumangarh",
        "Jaipur",
        "Jaisalmer",
        "Jalore",
        "Jhalawar",
        "Jhunjhunu",
        "Jodhpur",
        "Karauli",
        "Kota",
        "Nagaur",
        "Pali",
        "Pratapgarh",
        "Rajsamand",
        "Sawai Madhopur",
        "Sikar",
        "Sirohi",
        "Sri Ganganagar",
        "Tonk",
        "Udaipur"
    ],

    "Sikkim": [
        "Gangtok",
        "Gyalshing",
        "Mangan",
        "Namchi",
        "Pakyong",
        "Soreng"
    ],

    "Tamil Nadu": [
        "Ariyalur",
        "Chengalpattu",
        "Chennai",
        "Coimbatore",
        "Cuddalore",
        "Dharmapuri",
        "Dindigul",
        "Erode",
        "Kallakurichi",
        "Kancheepuram",
        "Karur",
        "Krishnagiri",
        "Madurai",
        "Mayiladuthurai",
        "Nagapattinam",
        "Namakkal",
        "Nilgiris",
        "Perambalur",
        "Pudukkottai",
        "Ramanathapuram",
        "Salem",
        "Sivaganga",
        "Tenkasi",
        "Thanjavur",
        "Theni",
        "Thoothukudi",
        "Tiruchirappalli",
        "Tirunelveli",
        "Tiruppur",
        "Tiruvallur",
        "Tiruvannamalai",
        "Tiruvarur",
        "Vellore",
        "Viluppuram",
        "Virudhunagar"
    ],

    "Telangana": [
        "Adilabad",
        "Bhadradri Kothagudem",
        "Hyderabad",
        "Jagtial",
        "Jangaon",
        "Jayashankar Bhupalpally",
        "Jogulamba Gadwal",
        "Kamareddy",
        "Karimnagar",
        "Khammam",
        "Komaram Bheem Asifabad",
        "Mahabubabad",
        "Mahbubnagar",
        "Mancherial",
        "Medak",
        "Medchal-Malkajgiri",
        "Mulugu",
        "Nagarkurnool",
        "Nalgonda",
        "Narayanpet",
        "Nirmal",
        "Nizamabad",
        "Peddapalli",
        "Rajanna Sircilla",
        "Rangareddy",
        "Sangareddy",
        "Siddipet",
        "Suryapet",
        "Vikarabad",
        "Wanaparthy",
        "Warangal",
        "Yadadri Bhuvanagiri"
    ],

    "Tripura": [
        "Dhalai",
        "Gomati",
        "Khowai",
        "North Tripura",
        "Sepahijala",
        "South Tripura",
        "Unakoti",
        "West Tripura"
    ],

    "Uttar Pradesh": [
        "Agra",
        "Aligarh",
        "Ambedkar Nagar",
        "Amethi",
        "Amroha",
        "Auraiya",
        "Ayodhya",
        "Azamgarh",
        "Baghpat",
        "Bahraich",
        "Ballia",
        "Balrampur",
        "Banda",
        "Barabanki",
        "Bareilly",
        "Basti",
        "Bhadohi",
        "Bijnor",
        "Budaun",
        "Bulandshahr",
        "Chandauli",
        "Chitrakoot",
        "Deoria",
        "Etah",
        "Etawah",
        "Farrukhabad",
        "Fatehpur",
        "Firozabad",
        "Gautam Buddha Nagar",
        "Ghaziabad",
        "Ghazipur",
        "Gonda",
        "Gorakhpur",
        "Hamirpur",
        "Hapur",
        "Hardoi",
        "Hathras",
        "Jalaun",
        "Jaunpur",
        "Jhansi",
        "Kannauj",
        "Kanpur Dehat",
        "Kanpur Nagar",
        "Kasganj",
        "Kaushambi",
        "Kheri",
        "Kushinagar",
        "Lalitpur",
        "Lucknow",
        "Maharajganj",
        "Mahoba",
        "Mainpuri",
        "Mathura",
        "Mau",
        "Meerut",
        "Mirzapur",
        "Moradabad",
        "Muzaffarnagar",
        "Pilibhit",
        "Pratapgarh",
        "Prayagraj",
        "Raebareli",
        "Rampur",
        "Saharanpur",
        "Sambhal",
        "Sant Kabir Nagar",
        "Shahjahanpur",
        "Shamli",
        "Shravasti",
        "Siddharthnagar",
        "Sitapur",
        "Sonbhadra",
        "Sultanpur",
        "Unnao",
        "Varanasi"
    ],

    "Uttarakhand": [
        "Almora",
        "Bageshwar",
        "Chamoli",
        "Champawat",
        "Dehradun",
        "Haridwar",
        "Nainital",
        "Pauri Garhwal",
        "Pithoragarh",
        "Rudraprayag",
        "Tehri Garhwal",
        "Udham Singh Nagar",
        "Uttarkashi"
    ],

    "West Bengal": [
        "Alipurduar",
        "Bankura",
        "Paschim Bardhaman",
        "Purba Bardhaman",
        "Birbhum",
        "Cooch Behar",
        "Darjeeling",
        "Hooghly",
        "Howrah",
        "Jalpaiguri",
        "Jhargram",
        "Kalimpong",
        "Kolkata",
        "Maldah",
        "Murshidabad",
        "Nadia",
        "North 24 Parganas",
        "South 24 Parganas",
        "Uttar Dinajpur",
        "Dakshin Dinajpur",
        "Paschim Medinipur",
        "Purba Medinipur"
    ],

    "Andaman and Nicobar Islands": [
        "Nicobar",
        "North and Middle Andaman",
        "South Andaman"
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
        "Bandipora",
        "Baramulla",
        "Budgam",
        "Doda",
        "Ganderbal",
        "Jammu",
        "Kathua",
        "Kishtwar",
        "Kulgam",
        "Kupwara",
        "Poonch",
        "Pulwama",
        "Rajouri",
        "Ramban",
        "Reasi",
        "Samba",
        "Shopian",
        "Srinagar",
        "Udhampur"
    ],

    "Ladakh": [
        "Kargil",
        "Leh"
    ],

    "Lakshadweep": [
        "Agatti",
        "Amini",
        "Andrott",
        "Bitra",
        "Chetlat",
        "Kadmat",
        "Kalpeni",
        "Kavaratti",
        "Kiltan",
        "Minicoy"
    ],

    "Puducherry": [
        "Karaikal",
        "Mahe",
        "Puducherry",
        "Yanam"
    ]

};


/* =========================================================
   DEMO LISTINGS
   ========================================================= */

/*
   These are ONLY temporary frontend records.

   Backend should eventually return objects following
   approximately this structure:

   {
       id,
       farmerId,
       crop,
       category,
       quantity,
       unit,
       askingPrice,
       state,
       district,
       sellerName,
       status,
       createdAt
   }
*/

const demoListings = [

    {
        id: "listing-demo-001",
        farmerId: "farmer-demo-001",
        crop: "Wheat",
        category: "cereal",
        quantity: 25,
        unit: "quintal",
        askingPrice: 2450,
        state: "Maharashtra",
        district: "Pune",
        sellerName: "Farmer",
        status: "available",
        createdAt: "2 days ago"
    },

    {
        id: "listing-demo-002",
        farmerId: "farmer-demo-002",
        crop: "Basmati Rice",
        category: "cereal",
        quantity: 40,
        unit: "quintal",
        askingPrice: 8700,
        state: "West Bengal",
        district: "Bardhaman",
        sellerName: "Farmer",
        status: "available",
        createdAt: "1 day ago"
    },

    {
        id: "listing-demo-003",
        farmerId: "farmer-demo-003",
        crop: "Red Onion",
        category: "vegetable",
        quantity: 12,
        unit: "quintal",
        askingPrice: 2180,
        state: "Maharashtra",
        district: "Nashik",
        sellerName: "Farmer",
        status: "available",
        createdAt: "5 days ago"
    },

    {
        id: "listing-demo-004",
        farmerId: "farmer-demo-004",
        crop: "Potato",
        category: "vegetable",
        quantity: 30,
        unit: "quintal",
        askingPrice: 1900,
        state: "Uttar Pradesh",
        district: "Agra",
        sellerName: "Farmer",
        status: "available",
        createdAt: "3 days ago"
    },

    {
        id: "listing-demo-005",
        farmerId: "farmer-demo-005",
        crop: "Chickpea",
        category: "pulse",
        quantity: 18,
        unit: "quintal",
        askingPrice: 5600,
        state: "Madhya Pradesh",
        district: "Indore",
        sellerName: "Farmer",
        status: "available",
        createdAt: "4 days ago"
    },

    {
        id: "listing-demo-006",
        farmerId: "farmer-demo-006",
        crop: "Turmeric",
        category: "spice",
        quantity: 10,
        unit: "quintal",
        askingPrice: 7600,
        state: "Telangana",
        district: "Nizamabad",
        sellerName: "Farmer",
        status: "available",
        createdAt: "6 days ago"
    }

];


let allListings = [];

let currentListings = [];

let currentSelectedListing = null;


/* =========================================================
   MOBILE NAVIGATION
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
        .forEach(function (link) {

            link.addEventListener(
                "click",
                function () {

                    mainNav.classList.remove("open");

                    menuButton.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                }
            );

        });


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
   LOAD STATES
   ========================================================= */

Object.keys(states)
    .forEach(function (state) {

        const option =
            document.createElement("option");

        option.value = state;

        option.textContent = state;

        stateSelect.appendChild(option);

    });


/* =========================================================
   LOAD DISTRICTS
   ========================================================= */

function loadDistricts(state) {

    districtSelect.innerHTML = "";

    const firstOption =
        document.createElement("option");

    firstOption.value = "";

    firstOption.textContent =
        "Select District";

    districtSelect.appendChild(
        firstOption
    );


    const stateDistricts =
        states[state] || [];


    stateDistricts.forEach(
        function (district) {

            const option =
                document.createElement("option");

            option.value = district;

            option.textContent = district;

            districtSelect.appendChild(
                option
            );

        }
    );


    districtSelect.disabled =
        stateDistricts.length === 0;
}


/* =========================================================
   UPDATE REGION
   ========================================================= */

function updateRegion() {

    const state =
        stateSelect.value;

    const district =
        districtSelect.value;


    if (!state) {

        regionDisplay.textContent =
            "Select your region";

        return;

    }


    if (!district) {

        regionDisplay.textContent =
            `${state}, India`;

        return;

    }


    regionDisplay.textContent =
        `${district}, ${state}, India`;

}


/* =========================================================
   API — GET LISTINGS
   ========================================================= */

async function fetchListings(filters = {}) {

    /*
       BACKEND ENDPOINT:

       GET /api/listings

       Suggested query parameters:

       crop
       category
       state
       district
       status=available

       Example:

       GET /api/listings?crop=wheat&state=Maharashtra
    */


    if (DEMO_MODE) {

        return demoListings.filter(
            function (listing) {

                if (
                    listing.status !== "available"
                ) {
                    return false;
                }


                if (
                    filters.crop &&
                    !listing.crop
                        .toLowerCase()
                        .includes(
                            filters.crop.toLowerCase()
                        )
                ) {
                    return false;
                }


                if (
                    filters.category &&
                    listing.category !== filters.category
                ) {
                    return false;
                }


                if (
                    filters.state &&
                    listing.state !== filters.state
                ) {
                    return false;
                }


                if (
                    filters.district &&
                    listing.district !== filters.district
                ) {
                    return false;
                }


                return true;

            }
        );

    }


    const params =
        new URLSearchParams();


    if (filters.crop) {
        params.set(
            "crop",
            filters.crop
        );
    }


    if (filters.category) {
        params.set(
            "category",
            filters.category
        );
    }


    if (filters.state) {
        params.set(
            "state",
            filters.state
        );
    }


    if (filters.district) {
        params.set(
            "district",
            filters.district
        );
    }


    params.set(
        "status",
        "available"
    );


    const response =
        await fetch(
            `${API_BASE_URL}/listings?${params.toString()}`,
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
            "Unable to load produce listings."
        );

    }


    const data =
        await response.json();


    return data.listings || data;
}


/* =========================================================
   API — SEND PURCHASE REQUEST
   ========================================================= */

async function sendPurchaseRequest(payload) {

    /*
       BACKEND ENDPOINT:

       POST /api/purchase-requests

       Suggested body:

       {
           listingId,
           quantity,
           offeredPrice
       }

       The backend should obtain buyerId from the
       authenticated session/token.

       DO NOT trust buyerId sent from the browser.
    */


    if (DEMO_MODE) {

        return {

            success: true,

            request: {

                id:
                    "request-demo-" +
                    Date.now(),

                listingId:
                    payload.listingId,

                quantity:
                    payload.quantity,

                offeredPrice:
                    payload.offeredPrice,

                status:
                    "pending"

            }

        };

    }


    const response =
        await fetch(
            `${API_BASE_URL}/purchase-requests`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json",

                    "Accept":
                        "application/json"
                },

                credentials: "include",

                body:
                    JSON.stringify(payload)
            }
        );


    const data =
        await response.json();


    if (!response.ok) {

        throw new Error(
            data.message ||
            "Unable to send purchase request."
        );

    }


    return data;
}


/* =========================================================
   API — GET BUYER REQUESTS
   ========================================================= */

async function fetchMyRequests() {

    /*
       BACKEND ENDPOINT:

       GET /api/purchase-requests/me

       The backend determines the authenticated
       buyer from the session/token.
    */


    if (DEMO_MODE) {

        return [];

    }


    const response =
        await fetch(
            `${API_BASE_URL}/purchase-requests/me`,
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
            "Unable to load purchase requests."
        );

    }


    const data =
        await response.json();


    return data.requests || data;
}


/* =========================================================
   SEARCH
   ========================================================= */

async function searchListings() {

    const filters = {

        crop:
            cropSearch.value.trim(),

        category:
            categorySelect.value,

        state:
            stateSelect.value,

        district:
            districtSelect.value

    };


    try {

        searchButton.disabled = true;

        searchButton.innerHTML =
            "Searching...";


        currentListings =
            await fetchListings(filters);

        allListings =
            currentListings;


        renderListings(
            currentListings
        );

    }
    catch (error) {

        console.error(error);

        produceGrid.innerHTML = "";

        listingCount.textContent =
            "Unable to load";

        emptyState.hidden = false;

        emptyState.querySelector("h3").textContent =
            "Unable to load produce";

        emptyState.querySelector("p").textContent =
            "Please try again in a moment.";

    }
    finally {

        searchButton.disabled = false;

        searchButton.innerHTML =
            'Search <span>→</span>';

    }

}


/* =========================================================
   RENDER LISTINGS
   ========================================================= */

function renderListings(listings) {

    produceGrid.innerHTML = "";


    listingCount.textContent =
        `${listings.length} ${
            listings.length === 1
                ? "listing"
                : "listings"
        }`;


    if (!listings.length) {

        emptyState.hidden = false;

        return;

    }


    emptyState.hidden = true;


    listings.forEach(
        function (listing) {

            const card =
                createListingCard(
                    listing
                );

            produceGrid.appendChild(
                card
            );

        }
    );

}


/* =========================================================
   CREATE LISTING CARD
   ========================================================= */

function createListingCard(listing) {

    const article =
        document.createElement("article");

    article.className =
        "produce-card";


    const icon =
        getCropInitial(
            listing.crop
        );


    article.innerHTML = `

        <div class="produce-card-top">

            <div class="produce-icon">
                ${icon}
            </div>

            <span class="available-badge">
                Available
            </span>

        </div>


        <p class="produce-category">
            ${escapeHTML(
                formatCategory(
                    listing.category
                )
            )}
        </p>


        <h3>
            ${escapeHTML(
                listing.crop
            )}
        </h3>


        <p class="produce-location">
            ${escapeHTML(
                listing.district
            )},
            ${escapeHTML(
                listing.state
            )}
        </p>


        <div class="produce-bottom">

            <div class="produce-price">
                ₹${formatNumber(
                    listing.askingPrice
                )}
                <small>
                    / ${escapeHTML(
                        listing.unit || "quintal"
                    )}
                </small>
            </div>


            <div class="produce-quantity">
                ${formatNumber(
                    listing.quantity
                )}
                ${escapeHTML(
                    listing.unit || "quintals"
                )}
                available
            </div>

        </div>


        <button
            type="button"
            class="view-button"
            data-listing-id="${escapeHTML(
                listing.id
            )}"
        >
            View Listing →
        </button>

    `;


    const viewButton =
        article.querySelector(
            ".view-button"
        );


    viewButton.addEventListener(
        "click",
        function () {

            openListingModal(
                listing.id
            );

        }
    );


    return article;
}


/* =========================================================
   OPEN LISTING MODAL
   ========================================================= */

function openListingModal(listingId) {

    const listing =
        allListings.find(
            function (item) {

                return item.id === listingId;

            }
        );


    if (!listing) {
        return;
    }


    currentSelectedListing =
        listing;


    selectedListingId.value =
        listing.id;


    modalCropName.textContent =
        listing.crop;


    modalPrice.textContent =
        `₹${formatNumber(
            listing.askingPrice
        )} / ${listing.unit || "quintal"}`;


    modalQuantity.textContent =
        `${formatNumber(
            listing.quantity
        )} ${listing.unit || "quintals"}`;


    modalLocation.textContent =
        `${listing.district}, ${listing.state}`;


    modalCategory.textContent =
        formatCategory(
            listing.category
        );


    modalListed.textContent =
        listing.createdAt ||
        "Recently";


    modalSeller.textContent =
        listing.sellerName ||
        "Farmer";


    modalSellerLocation.textContent =
        `${listing.district}, ${listing.state}`;


    interestQuantity.value = "";

    offerPrice.value =
        listing.askingPrice || "";


    modalMessage.textContent =
        "";


    listingModal.classList.add(
        "open"
    );


    listingModal.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.style.overflow =
        "hidden";


    setTimeout(
        function () {

            interestQuantity.focus();

        },
        100
    );

}


/* =========================================================
   CLOSE LISTING MODAL
   ========================================================= */

function closeListingModal() {

    listingModal.classList.remove(
        "open"
    );


    listingModal.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.style.overflow =
        "";

    currentSelectedListing =
        null;

}


modalClose.addEventListener(
    "click",
    closeListingModal
);


modalOverlay.addEventListener(
    "click",
    closeListingModal
);


document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape" &&
            listingModal.classList.contains("open")
        ) {

            closeListingModal();

        }

    }
);


/* =========================================================
   PURCHASE INTEREST
   ========================================================= */

interestForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        if (!currentSelectedListing) {
            return;
        }


        const quantity =
            Number(
                interestQuantity.value
            );


        const offeredPrice =
            offerPrice.value
                ? Number(
                    offerPrice.value
                )
                : null;


        if (
            !quantity ||
            quantity <= 0
        ) {

            modalMessage.textContent =
                "Please enter a valid quantity.";

            return;

        }


        if (
            quantity >
            Number(
                currentSelectedListing.quantity
            )
        ) {

            modalMessage.textContent =
                "Requested quantity exceeds availability.";

            return;

        }


        if (
            offeredPrice !== null &&
            (
                !offeredPrice ||
                offeredPrice <= 0
            )
        ) {

            modalMessage.textContent =
                "Please enter a valid offered price.";

            return;

        }


        const payload = {

            listingId:
                currentSelectedListing.id,

            quantity:
                quantity,

            offeredPrice:
                offeredPrice

        };


        const submitButton =
            interestForm.querySelector(
                ".modal-submit"
            );


        try {

            submitButton.disabled = true;

            submitButton.textContent =
                "Sending...";

            modalMessage.textContent =
                "";


            const result =
                await sendPurchaseRequest(
                    payload
                );


            if (
                !result ||
                result.success === false
            ) {

                throw new Error(
                    result?.message ||
                    "Request could not be sent."
                );

            }


            modalMessage.textContent =
                "Purchase interest sent successfully.";


            setTimeout(
                function () {

                    closeListingModal();

                    loadMyRequests();

                },
                1200
            );

        }
        catch (error) {

            console.error(error);

            modalMessage.textContent =
                error.message ||
                "Something went wrong.";

        }
        finally {

            submitButton.disabled =
                false;

            submitButton.textContent =
                "Send Purchase Interest →";

        }

    }
);


/* =========================================================
   LOAD REQUESTS
   ========================================================= */

async function loadMyRequests() {

    try {

        const requests =
            await fetchMyRequests();


        renderRequests(
            requests
        );

    }
    catch (error) {

        console.error(error);

        requestBox.innerHTML = "";

        requestEmpty.hidden = false;

        requestEmpty.querySelector("h3").textContent =
            "Unable to load requests";

        requestEmpty.querySelector("p").textContent =
            "Please try again later.";

    }

}


/* =========================================================
   RENDER REQUESTS
   ========================================================= */

function renderRequests(requests) {

    requestBox.innerHTML = "";


    if (!requests.length) {

        requestEmpty.hidden = false;

        return;

    }


    requestEmpty.hidden = true;


    requests.forEach(
        function (request) {

            const row =
                document.createElement("div");

            row.className =
                "request-row";


            const status =
                normalizeStatus(
                    request.status
                );


            row.innerHTML = `

                <div class="request-main">

                    <span class="request-icon">
                        ${getCropInitial(
                            request.crop ||
                            "Produce"
                        )}
                    </span>

                    <div>

                        <h3>
                            ${escapeHTML(
                                request.crop ||
                                "Produce"
                            )}
                        </h3>

                        <p>
                            ${formatNumber(
                                request.quantity
                            )}
                            quintals requested
                            ${
                                request.offeredPrice
                                    ? ` · ₹${formatNumber(
                                        request.offeredPrice
                                    )}/quintal`
                                    : ""
                            }
                        </p>

                        <small>
                            ${
                                request.createdAt ||
                                "Recently"
                            }
                        </small>

                    </div>

                </div>


                <span class="
                    request-status
                    ${status}
                ">
                    ${capitalize(
                        status
                    )}
                </span>

            `;


            requestBox.appendChild(
                row
            );

        }
    );

}


/* =========================================================
   EVENTS — REGION
   ========================================================= */

stateSelect.addEventListener(
    "change",
    function () {

        loadDistricts(
            stateSelect.value
        );

        updateRegion();

        searchListings();

    }
);


districtSelect.addEventListener(
    "change",
    function () {

        updateRegion();

        searchListings();

    }
);


/* =========================================================
   EVENTS — SEARCH
   ========================================================= */

searchButton.addEventListener(
    "click",
    searchListings
);


cropSearch.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Enter"
        ) {

            event.preventDefault();

            searchListings();

        }

    }
);


categorySelect.addEventListener(
    "change",
    searchListings
);


/* =========================================================
   DEFAULT REGION
   ========================================================= */

stateSelect.value =
    "Maharashtra";


loadDistricts(
    "Maharashtra"
);


districtSelect.value =
    "Pune";


updateRegion();


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


function formatCategory(category) {

    if (!category) {
        return "PRODUCE";
    }


    const categories = {

        cereal: "CEREAL",

        vegetable: "VEGETABLE",

        fruit: "FRUIT",

        pulse: "PULSE",

        spice: "SPICE"

    };


    return (
        categories[
            category.toLowerCase()
        ] ||
        category.toUpperCase()
    );

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


function capitalize(value) {

    if (!value) {
        return "";
    }


    return value
        .charAt(0)
        .toUpperCase() +
        value.slice(1);

}


function normalizeStatus(status) {

    if (!status) {
        return "pending";
    }


    const normalized =
        status.toLowerCase();


    if (
        normalized === "accepted" ||
        normalized === "declined" ||
        normalized === "pending"
    ) {

        return normalized;

    }


    return "pending";

}


/*
   Prevent API/user-provided text from being inserted
   directly as HTML.
*/

function escapeHTML(value) {

    return String(value ?? "")
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
   INITIAL LOAD
   ========================================================= */

async function initializeDashboard() {

    await searchListings();

    await loadMyRequests();

}


initializeDashboard();
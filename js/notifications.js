/* =========================================================
   Farmer Trade — NOTIFICATIONS

   ROLE-AWARE FRONTEND

   Farmer:
   - Selling
   - Buyer interest
   - Market
   - Account
   - Support

   Buyer:
   - Buying
   - New produce
   - Seller activity
   - Market
   - Account
   - Support

   BACKEND HANDOFF:

   GET:
   /api/notifications

   PATCH:
   /api/notifications/:id/read

   PATCH:
   /api/notifications/read-all

   Backend should determine the authenticated user's role
   and return only notifications belonging to that user.
   ========================================================= */



/* =========================================================
   MOBILE NAVIGATION
   ========================================================= */

const menuButton =
    document.getElementById("menuButton");

const mainNav =
    document.getElementById("mainNav");


if (menuButton && mainNav) {

    menuButton.addEventListener(
        "click",
        function () {

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

}



/* =========================================================
   GET USER ROLE
   ========================================================= */

/*
 * Login currently stores:
 *
 * sessionStorage.setItem(
 *     "Farmer TradeUserRole",
 *     selectedRole
 * );
 *
 * Signup also stores:
 *
 * sessionStorage.setItem(
 *     "Farmer TradeSignupRole",
 *     selectedRole
 * );
 */


const storedRole =
    sessionStorage.getItem(
        "Farmer TradeUserRole"
    );


const signupRole =
    sessionStorage.getItem(
        "Farmer TradeSignupRole"
    );


/*
 * Only accept valid roles.
 *
 * IMPORTANT:
 * This page NEVER changes the role.
 *
 * It only reads the existing role and
 * adjusts the interface accordingly.
 */

const userRole =
    storedRole === "buyer"
        ? "buyer"
        : storedRole === "farmer"
            ? "farmer"
            : signupRole === "buyer"
                ? "buyer"
                : "farmer";



/* =========================================================
   ELEMENTS
   ========================================================= */

const notificationList =
    document.getElementById(
        "notificationList"
    );


const emptyState =
    document.getElementById(
        "emptyState"
    );


const notificationCount =
    document.getElementById(
        "notificationCount"
    );


const markAllButton =
    document.getElementById(
        "markAllButton"
    );


const filterWrap =
    document.getElementById(
        "filterWrap"
    );


const notificationHeading =
    document.getElementById(
        "notificationHeading"
    );


const notificationDescription =
    document.getElementById(
        "notificationDescription"
    );


const emptyMessage =
    document.getElementById(
        "emptyMessage"
    );


const profileButton =
    document.getElementById(
        "profileButton"
    );


const dashboardLink =
    document.getElementById(
        "dashboardLink"
    );


const produceLink =
    document.getElementById(
        "produceLink"
    );



/* =========================================================
   ROLE-BASED NAVIGATION
   ========================================================= */

function setupNavigation() {

    if (userRole === "buyer") {

        /*
         * BUYER
         */

        if (dashboardLink) {

            dashboardLink.href =
                "buyer-dashboard.html";

        }


        /*
         * Both roles use the same
         * common lots.html page.
         */

        if (produceLink) {

            produceLink.href =
                "lots.html";

            produceLink.textContent =
                "Produce";

        }


        if (profileButton) {

            profileButton.textContent =
                "B";

        }


        return;
    }


    /*
     * FARMER
     */

    if (dashboardLink) {

        dashboardLink.href =
            "dashboard.html";

    }


    /*
     * Both roles use the same
     * common lots.html page.
     */

    if (produceLink) {

        produceLink.href =
            "lots.html";

        produceLink.textContent =
            "Produce";

    }


    if (profileButton) {

        profileButton.textContent =
            "F";

    }

}



/* =========================================================
   ROLE-BASED PAGE CONTENT
   ========================================================= */

function setupRoleContent() {

    if (userRole === "buyer") {

        notificationHeading.textContent =
            "Your updates.";


        notificationDescription.textContent =
            "Stay informed about new produce, seller activity, market prices and important Farmer Trade updates.";


        emptyMessage.textContent =
            "There are no buyer updates to show right now.";

        return;
    }


    notificationHeading.textContent =
        "Notifications.";


    notificationDescription.textContent =
        "Stay informed about your produce, buyer interest, market activity and important Farmer Trade updates.";


    emptyMessage.textContent =
        "There are no farmer updates to show right now.";

}



/* =========================================================
   FILTERS
   ========================================================= */

function createFilters() {

    filterWrap.innerHTML = "";


    let filters;


    if (userRole === "buyer") {

        filters = [

            {
                label: "All",
                value: "all"
            },

            {
                label: "Unread",
                value: "unread"
            },

            {
                label: "Buying",
                value: "buying"
            },

            {
                label: "Market",
                value: "market"
            }

        ];

    } else {

        filters = [

            {
                label: "All",
                value: "all"
            },

            {
                label: "Unread",
                value: "unread"
            },

            {
                label: "Market",
                value: "market"
            },

            {
                label: "Selling",
                value: "selling"
            },

            {
                label: "Buyers",
                value: "buyers"
            }

        ];

    }


    filters.forEach(
        function (filter, index) {

            const button =
                document.createElement(
                    "button"
                );


            button.type = "button";


            button.className =
                "notification-filter";


            if (index === 0) {

                button.classList.add(
                    "active"
                );

            }


            button.dataset.filter =
                filter.value;


            button.textContent =
                filter.label;


            filterWrap.appendChild(
                button
            );

        }
    );


    filterWrap
        .querySelectorAll(
            ".notification-filter"
        )
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function (event) {

                        event.preventDefault();

                        event.stopPropagation();


                        const filter =
                            button.dataset.filter;


                        currentFilter =
                            filter;


                        filterWrap
                            .querySelectorAll(
                                ".notification-filter"
                            )
                            .forEach(
                                function (item) {

                                    item.classList.remove(
                                        "active"
                                    );

                                }
                            );


                        button.classList.add(
                            "active"
                        );


                        renderNotifications();

                    }
                );

            }
        );

}



/* =========================================================
   TEMPORARY DEMO DATA
   ========================================================= */

/*
 * IMPORTANT:
 *
 * This is demo data only.
 *
 * Backend can eventually return the same structure
 * through:
 *
 * GET /api/notifications
 */


const farmerNotifications = [

    {
        id: "F001",

        type: "market",

        title:
            "Wheat prices increased",

        message:
            "The latest market information shows an increase in wheat prices. Check Market Prices before deciding your next sale.",

        category:
            "Market",

        createdAt:
            "Today, 10:30 AM",

        read: false
    },


    {
        id: "F002",

        type: "selling",

        title:
            "Your produce listing is active",

        message:
            "Your wheat listing has been successfully published and is now visible to potential buyers.",

        category:
            "Selling",

        createdAt:
            "Today, 09:15 AM",

        read: false
    },


    {
        id: "F003",

        type: "buyers",

        title:
            "New buyer interest",

        message:
            "A buyer is interested in produce matching your listed crop. Check your marketplace activity for more information.",

        category:
            "Buyers",

        createdAt:
            "Yesterday",

        read: false
    },


    {
        id: "F004",

        type: "selling",

        title:
            "Your produce details were saved",

        message:
            "The latest changes to your produce listing have been successfully saved.",

        category:
            "Selling",

        createdAt:
            "Yesterday",

        read: true
    },


    {
        id: "F005",

        type: "market",

        title:
            "Market information updated",

        message:
            "Prices for several crops have been updated. Review the latest market information before listing your produce.",

        category:
            "Market",

        createdAt:
            "28 Aug 2026",

        read: true
    },


    {
        id: "F006",

        type: "account",

        title:
            "Profile information saved",

        message:
            "Your profile information was successfully updated.",

        category:
            "Account",

        createdAt:
            "27 Aug 2026",

        read: true
    },


    {
        id: "F007",

        type: "support",

        title:
            "Welcome to Farmer Trade",

        message:
            "Your account is ready. Explore market prices and connect with buyers through Farmer Trade.",

        category:
            "Farmer Trade",

        createdAt:
            "26 Aug 2026",

        read: true
    }

];



const buyerNotifications = [

    {
        id: "B001",

        type: "buying",

        title:
            "New wheat produce available",

        message:
            "A farmer has listed wheat that may match your buying requirements. Explore the listing for quantity and location details.",

        category:
            "Buying",

        createdAt:
            "Today, 10:42 AM",

        read: false
    },


    {
        id: "B002",

        type: "buying",

        title:
            "New produce matches your interest",

        message:
            "Fresh produce listings matching crops you may be interested in are now available.",

        category:
            "Buying",

        createdAt:
            "Today, 09:20 AM",

        read: false
    },


    {
        id: "B003",

        type: "market",

        title:
            "Market prices updated",

        message:
            "Current market information for several crops has been updated. Review prices before placing your next order.",

        category:
            "Market",

        createdAt:
            "Yesterday",

        read: false
    },


    {
        id: "B004",

        type: "buying",

        title:
            "Seller listing updated",

        message:
            "A seller has updated the quantity or details of a produce listing you may be interested in.",

        category:
            "Buying",

        createdAt:
            "Yesterday",

        read: true
    },


    {
        id: "B005",

        type: "market",

        title:
            "Wheat market information changed",

        message:
            "Updated wheat market information is now available on the Market Prices page.",

        category:
            "Market",

        createdAt:
            "28 Aug 2026",

        read: true
    },


    {
        id: "B006",

        type: "account",

        title:
            "Profile information saved",

        message:
            "Your buyer profile information was successfully updated.",

        category:
            "Account",

        createdAt:
            "27 Aug 2026",

        read: true
    },


    {
        id: "B007",

        type: "support",

        title:
            "Welcome to Farmer Trade",

        message:
            "Your buyer account is ready. Explore produce listings and connect with farmers through Farmer Trade.",

        category:
            "Farmer Trade",

        createdAt:
            "26 Aug 2026",

        read: true
    }

];



/* =========================================================
   SELECT DATA ACCORDING TO ROLE
   ========================================================= */

let notificationData =
    userRole === "buyer"
        ? buyerNotifications
        : farmerNotifications;



/* =========================================================
   CURRENT FILTER
   ========================================================= */

let currentFilter = "all";



/* =========================================================
   ICONS
   ========================================================= */

function getNotificationIcon(type) {

    if (type === "market") {

        return "₹";

    }


    if (type === "selling") {

        return "↗";

    }


    if (type === "buyers") {

        return "•";

    }


    if (type === "buying") {

        return "⌂";

    }


    if (type === "account") {

        return "✓";

    }


    if (type === "support") {

        return "?";

    }


    return "•";

}



/* =========================================================
   FILTER DATA
   ========================================================= */

function getFilteredNotifications() {

    if (currentFilter === "all") {

        return notificationData;

    }


    if (currentFilter === "unread") {

        return notificationData.filter(
            function (notification) {

                return notification.read === false;

            }
        );

    }


    return notificationData.filter(
        function (notification) {

            return notification.type === currentFilter;

        }
    );

}



/* =========================================================
   RENDER
   ========================================================= */

function renderNotifications() {

    const filtered =
        getFilteredNotifications();


    notificationList.innerHTML = "";


    if (filtered.length === 0) {

        emptyState.hidden = false;

        return;

    }


    emptyState.hidden = true;


    filtered.forEach(
        function (notification) {

            const card =
                document.createElement(
                    "article"
                );


            card.classList.add(
                "notification-item"
            );


            if (!notification.read) {

                card.classList.add(
                    "unread"
                );

            }


            card.dataset.id =
                notification.id;


            card.innerHTML = `

                <div class="notification-icon">
                    ${getNotificationIcon(
                        notification.type
                    )}
                </div>


                <div class="notification-content">

                    <h2 class="notification-title">
                        ${escapeHTML(
                            notification.title
                        )}
                    </h2>


                    <p class="notification-message">
                        ${escapeHTML(
                            notification.message
                        )}
                    </p>


                    <div class="notification-meta">

                        <span class="notification-category">
                            ${escapeHTML(
                                notification.category
                            )}
                        </span>


                        <span class="read-indicator">

                            ${
                                notification.read
                                    ? "Read"
                                    : "Unread"
                            }

                        </span>

                    </div>

                </div>


                <time class="notification-time">
                    ${escapeHTML(
                        notification.createdAt
                    )}
                </time>

            `;


            card.addEventListener(
                "click",
                function () {

                    markAsRead(
                        notification.id
                    );

                }
            );


            notificationList.appendChild(
                card
            );

        }
    );

}



/* =========================================================
   UPDATE UNREAD COUNT
   ========================================================= */

function updateUnreadCount() {

    const count =
        notificationData.filter(
            function (notification) {

                return notification.read === false;

            }
        ).length;


    notificationCount.textContent =
        `${count} unread`;

}



/* =========================================================
   MARK ONE AS READ
   ========================================================= */

function markAsRead(id) {

    const notification =
        notificationData.find(
            function (item) {

                return item.id === id;

            }
        );


    if (!notification) {

        return;

    }


    notification.read = true;


    /*
     * BACKEND:
     *
     * PATCH /api/notifications/:id/read
     *
     * Example:
     *
     * fetch(
     *     `/api/notifications/${id}/read`,
     *     {
     *         method: "PATCH"
     *     }
     * );
     */


    updateUnreadCount();

    renderNotifications();

}



/* =========================================================
   MARK ALL READ
   ========================================================= */

if (markAllButton) {

    markAllButton.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            event.stopPropagation();


            notificationData =
                notificationData.map(
                    function (notification) {

                        return {

                            ...notification,

                            read: true

                        };

                    }
                );


            /*
             * BACKEND:
             *
             * PATCH /api/notifications/read-all
             */


            updateUnreadCount();

            renderNotifications();

        }
    );

}



/* =========================================================
   SAFE HTML
   ========================================================= */

function escapeHTML(value) {

    const element =
        document.createElement(
            "div"
        );


    element.textContent =
        String(value ?? "");


    return element.innerHTML;

}



/* =========================================================
   BACKEND INTEGRATION
   ========================================================= */

/*
 * BACKEND TEAM:
 *
 * When the API is available, use this function.
 *
 * Expected response:
 *
 * [
 *     {
 *         id: "N001",
 *         type: "market",
 *         title: "...",
 *         message: "...",
 *         category: "Market",
 *         createdAt: "...",
 *         read: false
 *     }
 * ]
 *
 * The backend should identify the authenticated user
 * and return notifications for that user only.
 */


async function loadNotificationsFromBackend() {

    try {

        const response =
            await fetch(
                "/api/notifications",
                {
                    method: "GET",
                    headers: {
                        "Content-Type":
                            "application/json"
                    }
                }
            );


        if (!response.ok) {

            throw new Error(
                "Failed to load notifications"
            );

        }


        const data =
            await response.json();


        if (!Array.isArray(data)) {

            throw new Error(
                "Invalid notification response"
            );

        }


        notificationData =
            data;


        updateUnreadCount();

        renderNotifications();

    } catch (error) {

        /*
         * Demo data remains visible if backend
         * is not connected yet.
         */

        console.info(
            "Notifications API unavailable. Using frontend demo data."
        );

        console.error(error);

    }

}



/* =========================================================
   INITIAL LOAD
   ========================================================= */

setupNavigation();

setupRoleContent();

createFilters();

updateUnreadCount();

renderNotifications();


/*
 * IMPORTANT:
 *
 * Keep this commented until backend authentication
 * and the notification endpoint are actually ready.
 *
 * loadNotificationsFromBackend();
 */
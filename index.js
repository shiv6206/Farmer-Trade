/* =========================================================
   aapki mandi LANDING PAGE
   ========================================================= */


/* =========================================================
   KEEP AUTHENTICATED USERS IN THEIR APP
   =========================================================

   Internal app pages use index.html for the Home link. When a
   logged-in user follows that link, return them to the correct
   role dashboard instead of showing the public landing page.
   ========================================================= */

const loggedIn =
    sessionStorage.getItem("aapki mandiLoggedIn") === "true";

const userRole =
    sessionStorage.getItem("aapki mandiUserRole");

const hasToken =
    Boolean(localStorage.getItem("token"));


if (
    loggedIn &&
    hasToken &&
    (userRole === "farmer" || userRole === "buyer")
) {

    window.location.replace(
        userRole === "farmer"
            ? "dashboard.html"
            : "buyer-dashboard.html"
    );

}


/* =========================================================
   MOBILE NAVIGATION
   ========================================================= */

const menuButton =
    document.getElementById("menuButton");

const mainNav =
    document.getElementById("mainNav");

const siteHeader =
    document.querySelector(".site-header");


if (
    menuButton &&
    mainNav &&
    siteHeader
) {

    menuButton.addEventListener(
        "click",
        function () {

            const isOpen =
                mainNav.classList.toggle(
                    "mobile-open"
                );


            siteHeader.classList.toggle(
                "menu-active",
                isOpen
            );


            document.body.classList.toggle(
                "menu-open",
                isOpen
            );


            menuButton.setAttribute(
                "aria-expanded",
                String(isOpen)
            );


            menuButton.setAttribute(
                "aria-label",
                isOpen
                    ? "Close navigation menu"
                    : "Open navigation menu"
            );

        }
    );


    /*
        Close mobile navigation when a link is selected.
    */

    mainNav
        .querySelectorAll("a")
        .forEach(function (link) {

            link.addEventListener(
                "click",
                function () {

                    mainNav.classList.remove(
                        "mobile-open"
                    );

                    siteHeader.classList.remove(
                        "menu-active"
                    );

                    document.body.classList.remove(
                        "menu-open"
                    );

                    menuButton.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                    menuButton.setAttribute(
                        "aria-label",
                        "Open navigation menu"
                    );

                }
            );

        });

}


/* =========================================================
   CLOSE MENU WHEN RESIZING TO DESKTOP
   ========================================================= */

window.addEventListener(
    "resize",
    function () {

        if (
            window.innerWidth > 700 &&
            mainNav &&
            siteHeader &&
            menuButton
        ) {

            mainNav.classList.remove(
                "mobile-open"
            );

            siteHeader.classList.remove(
                "menu-active"
            );

            document.body.classList.remove(
                "menu-open"
            );

            menuButton.setAttribute(
                "aria-expanded",
                "false"
            );

            menuButton.setAttribute(
                "aria-label",
                "Open navigation menu"
            );

        }

    }
);


/* =========================================================
   SMOOTH INTERNAL NAVIGATION
   ========================================================= */

document
    .querySelectorAll('a[href^="#"]')
    .forEach(function (link) {

        link.addEventListener(
            "click",
            function (event) {

                const targetId =
                    link.getAttribute("href");


                if (
                    !targetId ||
                    targetId === "#"
                ) {
                    return;
                }


                const target =
                    document.querySelector(
                        targetId
                    );


                if (!target) {
                    return;
                }


                event.preventDefault();


                const header =
                    document.querySelector(
                        ".site-header"
                    );


                const headerHeight =
                    header
                        ? header.offsetHeight
                        : 0;


                const targetPosition =
                    target.getBoundingClientRect().top +
                    window.scrollY -
                    headerHeight -
                    12;


                window.scrollTo({
                    top: targetPosition,
                    behavior: "smooth"
                });

            }
        );

    });


/* =========================================================
   UPDATE ACTIVE NAVIGATION
   ========================================================= */

const sections =
    document.querySelectorAll(
        "main section[id]"
    );


const navigationLinks =
    document.querySelectorAll(
        '.main-nav a[href^="#"]'
    );


if (
    sections.length &&
    navigationLinks.length
) {

    const observer =
        new IntersectionObserver(
            function (entries) {

                entries.forEach(
                    function (entry) {

                        if (!entry.isIntersecting) {
                            return;
                        }


                        const currentId =
                            entry.target.id;


                        navigationLinks.forEach(
                            function (link) {

                                const matches =
                                    link.getAttribute(
                                        "href"
                                    ) ===
                                    `#${currentId}`;


                                link.classList.toggle(
                                    "active",
                                    matches
                                );

                            }
                        );

                    }
                );

            },
            {
                rootMargin:
                    "-35% 0px -55% 0px"
            }
        );


    sections.forEach(
        function (section) {

            observer.observe(section);

        }
    );

}


/* =========================================================
   HERO / PAGE LOAD
   ========================================================= */

window.addEventListener(
    "load",
    function () {

        document.body.classList.add(
            "page-loaded"
        );

    }
);

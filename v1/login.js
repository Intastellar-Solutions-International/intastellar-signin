const intastellarLogoSrc = "https://www.intastellarsolutions.com/assets/logos/intastellar-new-planet.svg";
class IntastellarSolutionsSDKError extends Error {
    constructor(message) {
        super(message);
        this.name = 'IntastellarSolutionsSDKError';
    }
};

class IntastellarSolutionsSDKSuccess extends Error {
    constructor(message) {
        super(message);
        this.name = 'IntastellarSolutionsSDK';
    }
};

function signin() {
    const intastellarIssuerUrl = "https://apis.intastellaraccounts.com";
    const loginUri = (document.querySelector("[data-login_uri]") == null) ? location.hostname + ((location.port) ? ":" + location.port : "") + location.pathname : document.querySelector("[data-login_uri]").getAttribute("data-login_uri");
    const appName = document.querySelector("[data-app-name]").getAttribute("data-app-name");
    const key = document.querySelector("[data-client_id]").getAttribute("data-client_id");
    const scope = document.querySelector("[data-scope]")?.getAttribute("data-scope") || "profile";

    // Get root domain or the ip address if domain is not available
    let domain = window.location.hostname || window.location.host;
    // Remove the subdomain from the domain name and check if it's an ip address
    const domainParts = domain.split(".");
    if (domainParts.length > 2) {
        domainParts.shift();
    }
    if (isNaN(domainParts[0])) {
        domain = domainParts.join(".");
    }

    // Add the port if it´s on the origin domain
    if (window.location.port != "") {
        domain += ":" + window.location.port;
    }

    const loginWindow = window.open("https://www.intastellaraccounts.com/signin/v2/ws/oauth/oauthchooser?service=" + appName + "&continue=" + loginUri + "&entryFlow=" + window.btoa(scope) + "&key=" + key + "&access_id=" + encodeURI(domain) + "&passive=true&flowName=GeneralOAuthFlow&Entry=webauthsignin&scope=" + scope, 'popUpWindow', 'height=719,width=500,left=100,top=100,resizable=no');

    if (loginWindow == null) {
        throw new IntastellarSolutionsSDKError("Please enable popups for this website");
        return;
    }

    const checkLoadedAndClosed = setInterval(function () {
        try {
            // If this doesn't throw an exception, the page is loaded
            if (loginWindow.document) {
                /* console.log("Popup window loaded."); */
            }
        } catch (e) {
            // The page is not loaded yet, ignore the security exception
            /* console.log(e); */
        }
        // Check if the window is closed
        if (loginWindow.closed) {
            // If the window is closed

            clearInterval(checkLoadedAndClosed);
        }
    }, 1000);

    window.addEventListener("message", function (token) {
        const t = token.data;

        if (t != "") {
            loginWindow.postMessage("iframe-token-recieved", token.origin);
        }

        if (document.querySelector("[data-login_uri]") != null && document.querySelector("[data-login_callback]") != null) {
            new IntastellarSolutionsSDKError("Please add only 1 of the following: data-login_callback or data-login_uri. Not both")
            return;
        }

        if (document.querySelector("[data-login_uri]") != null) {
            // Check if current url has a query string
            const query = "?" + window.location.href.split("?")[1];
            const token = t;

            fetch("https://apis.intastellaraccounts.com/verify", {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            }).then(e => e.json()).then(e => {
                if (e.statusCode == 200) {
                    const { phone, birthday } = e.account.user[0];
                    e.account.user.phone = phone;
                    e.account.user.birthday = birthday;
                    delete e.account.user[0];
                    const t = e.account;
                    if (window.location.href.indexOf("?") > -1) {
                        const query = "?" + window.location.href.split("?")[1];
                        // Add the query string to the url
                        window.location.href = window.location.protocol + "//" + document.querySelector("[data-login_uri]").getAttribute("data-login_uri") + query + "&token=" + JSON.stringify(t);
                    } else {
                        window.location.href = window.location.protocol + "//" + document.querySelector("[data-login_uri]").getAttribute("data-login_uri") + "?token=" + JSON.stringify(t);
                    }
                    throw new IntastellarSolutionsSDKSuccess("We´ve successfully send user data for: " + t.name);
                } else {
                    throw new IntastellarSolutionsSDKError(e.error);
                }
            })
        } else if (document.querySelector("[data-login_callback]") != null) {
            const fn = window[document.querySelector("[data-login_callback]").getAttribute("data-login_callback")];
            const token = t;
            fetch("https://apis.intastellaraccounts.com/verify", {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            }).then(e => e.json()).then(e => {
                if (e.statusCode == 200) {
                    const { phone, birthday } = e.account.user[0];
                    e.account.user.phone = phone;
                    e.account.user.birthday = birthday;
                    delete e.account.user[0];
                    fn(e.account);
                } else {
                    throw new IntastellarSolutionsSDKError(e.error);
                }
            })
        }
    })
}

function checkToken() {
    const token = sessionStorage.getItem("intastellar_token");
    if (token != null) {
        return token;
    } else {
        return null;
    }
}

function loginViaToken() {
    const token = checkToken();
    if (token != null) {
        fetch("https://apis.intastellaraccounts.com/verify", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: token
        }).then(e => e.json()).then(e => {
            if (e.statusCode == 200) {
                new IntastellarSolutionsSDKSuccess("We´ve successfully send user data for: " + e.account.name);
                return e.account;
            } else {
                throw new IntastellarSolutionsSDKError(e.error);
            }
        })
    }
}

/* Check user loggedin status on intastellaraccounts.com */

const Intastellar = {
    accounts: {
        id: {
            renderButton(element, theme = {}) {
                const styleSheet = document.createElement("link");
                styleSheet.rel = "stylesheet";
                styleSheet.href = "https://account.api.intastellarsolutions.com/v1/insign/style.css";

                if (window.location.href.indexOf("localhost") > -1 || window.location.href.indexOf("127.0.0") > -1) {
                    styleSheet.href = "/v1/insign/style.css";
                }

                document.head.appendChild(styleSheet);
                const IntastellarButtonContainer = document.getElementById(element);
                const type = document.querySelector("[data-login-type]")?.getAttribute("data-login-type");
                const IntastellarSigninButton = document.createElement("button");
                const IntastellarText = document.createElement("div");
                IntastellarText.setAttribute("class", "intastellarSignIn-info");
                if (type == null || type == undefined || type == "" || type == "intastellar") {
                    IntastellarText.innerHTML = "Sign in with Intastellar"
                } else if (type == "signup") {
                    IntastellarText.innerHTML = "Sign up with Intastellar"
                }

                IntastellarSigninButton.setAttribute("class", "IntastellarSignin");

                if (theme != null || theme != undefined) {
                    if (theme.theme == "dark") {
                        IntastellarSigninButton.classList.add("dark");
                    }

                    if (theme.scopes != null || theme.scopes != undefined) {
                        IntastellarSigninButton.setAttribute("data-scope", theme.scopes);
                    }
                }

                const IntastellarLogo = document.createElement("img");
                IntastellarLogo.setAttribute("src", intastellarLogoSrc)
                IntastellarLogo.setAttribute("class", "intastellar-logo");
                IntastellarSigninButton.appendChild(IntastellarLogo);
                IntastellarSigninButton.appendChild(IntastellarText);

                const IntastellarSigniniFrame = document.createElement("iframe");
                IntastellarSigniniFrame.setAttribute("id", "intastellar-signin-iframe");
                IntastellarSigniniFrame.setAttribute("src", "https://apis.intastellaraccounts.com/usercontent/button.php?v=" + Math.random());
                const appName = document.querySelector("[data-app-name]")?.getAttribute("data-app-name");

                const intastellarPopup = document.createElement("div");
                const intastellarPopupShadow = document.createElement("div");
                intastellarPopupShadow.setAttribute("class", "intastellar-popup-shadow");
                intastellarPopupShadow.setAttribute("onclick", "document.querySelector('.intastellar-popup').style.bottom = '-100%'; this.style.visibility = 'hidden'");
                intastellarPopupShadow.appendChild(intastellarPopup);
                intastellarPopup.setAttribute("class", "intastellar-popup");
                const intastellarPopupContent = document.createElement("div");
                intastellarPopupContent.setAttribute("class", "intastellar-popup-content");
                intastellarPopup.innerHTML = `<header class="mobile-header desktop-hide">
                            <img src="https://www.intastellarsolutions.com/assets/logos/intastellar-new-planet.svg" class="logo">
                            <p class="header-info">Sign into ${appName} with Intastellar</p>
                        </header>`;

                intastellarPopupContent.innerHTML += `<div class='intastellar-popup-header'>
                        <img src="https://scontent-uc-d2c-7.intastellar.com/a/s/ul/p/avtr46-img/profile_standard.jpg" class="intastellar-popup-userProfile">
                        <div class="intastellar-popup-header-info">
                            <p class="intastellar-popup-userName">To continue signin in with Intastellar Solutions, please first sign in.</p>
                        </div>
                </div>`;

                const intastellarPopupButton = document.createElement("button");
                intastellarPopupButton.innerHTML = "Sign in with Intastellar";
                intastellarPopupButton.setAttribute("class", "intastellar-popup-button");
                intastellarPopupButton.setAttribute("onclick", "signin()");

                intastellarPopupContent.appendChild(intastellarPopupButton);
                intastellarPopupContent.innerHTML += "<p class='intastellar-popup-footer'>To create your account, Intastellar will share your name, email and profile picture with " + appName + ".</p>";
                intastellarPopup.appendChild(intastellarPopupContent);
                document.body.appendChild(intastellarPopupShadow);

                fetch("https://apis.intastellaraccounts.com/usercontent/js/getuser?origin=" + window.location.host, {
                    method: 'GET',
                    credentials: "include",
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }).then(e => e.json()).then(e => {
                    const user = e.user;
                    const loginbtn = document.querySelector(".IntastellarSignin");
                    const type = document.querySelector("[data-login-type]")?.getAttribute("data-login-type");
                    const intastellarSignInInfo = document.querySelector(".intastellarSignIn-info");
                    const intastellarLogo = document.querySelector(".intastellar-logo");

                    if (window.innerWidth > 768) {
                        if (user) {
                            intastellarLogo.classList.add("reverse");
                        }
                        if (type == null || type == undefined || type == "") {
                            intastellarSignInInfo.innerHTML = "Sign in as " + user.name.first;
                            intastellarSignInInfo.innerHTML += "<span class='email'>" + user.email + "</span>";
                        } else if (type == "signup") {
                            intastellarSignInInfo.innerHTML = "Sign up as " + user.name.first;
                            intastellarSignInInfo.innerHTML += "<span class='email'>" + user.email + "</span>";
                        }
                        loginbtn.innerHTML += "<img class='intastellar-userProfile' src='" + user.image + "'>";
                    } else {
                        if (user) {
                            document.querySelector(".intastellar-popup-header").innerHTML = `<img src="${user.image}" class="intastellar-popup-userProfile"><div class="intastellar-popup-header-info"><p class="intastellar-popup-userName">${user.name.first}</p> <p class="intastellar-popup-header-email">${user.email}</p></div>`;
                            document.querySelector(".intastellar-popup-button").innerHTML = "Continue as " + user.name.first;
                        }
                    }

                }).catch(e => {
                    new IntastellarSolutionsSDKError("User not logged in");
                })

                if (IntastellarButtonContainer != null || IntastellarButtonContainer != undefined) {
                    IntastellarButtonContainer.appendChild(IntastellarSigninButton);
                    IntastellarSigninButton.addEventListener("click", (e) => {
                        e.preventDefault();
                        if (window.innerWidth > 768) {
                            signin();
                        } else {
                            document.querySelector(".intastellar-popup-shadow").style.visibility = "visible";
                            setTimeout(() => {
                                document.querySelector(".intastellar-popup").style.bottom = "0";
                            }, 100);
                        }
                    });
                }
            }
        }
    }
}

document.addEventListener("click", function (e) {
    const intastellarPopup = document.querySelector(".intastellar-popup");
    // check if e.target is inside or is the popup
    if (intastellarPopup && !intastellarPopup.contains(e.target)) {

    }
}, false);
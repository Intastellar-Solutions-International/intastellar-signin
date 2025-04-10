/* 
Sign in with Intastellar
Author: Intastellar Solutions
Version: 1.5.0
https://www.intastellarsolutions.com

This script allows you to add a sign in with Intastellar button to your website.
Copyright (c) 2024 Intastellar Solutions, International
*/
const intastellarLogoSrc = "https://www.intastellarsolutions.com/assets/logos/intastellar-new-planet.svg";
class IntastellarSolutionsSDKError extends Error {
    constructor(message) {
        super(message);
        this.name = 'IntastellarSolutionsSDKError';
    }
};

class IntastellarSolutionsSDKSuccess {
    constructor(message) {
        this.message = message;
        this.name = 'IntastellarSolutionsSDKSuccess';
    }

    getCustomSuccessMessage() {
        return `Success: ${this.message}`;
    }
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function closeSignIn() {
    if (window.innerWidth <= 768) {
        document.querySelector('.intastellar-popup').style.bottom = '-100%';
        document.querySelector('.intastellar-popup-shadow').style.visibility = 'hidden'
    } else {
        document.querySelector('.intastellar-popup').style.right = '-100%';
        document.querySelector('.intastellar-popup-shadow').style.visibility = 'hidden'
    }

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
    const expires = new Date();
    // Set the expiration date to 2 years
    expires.setFullYear(expires.getFullYear() + 2);
    domain = domain.split(":")[0];

    document.cookie = "inta_state=1; expires=" + expires.toUTCString() + "; domain=" + domain + "; path=/";
}

function formatArray(arr) {
    if (arr.length === 0) {
        return "";
    }
    if (arr.length === 1) {
        return arr[0];
    }
    if (arr.length === 2) {
        return arr.join(" & ");
    }
    return ", " + arr.slice(0, -1).join(", ") + " & " + arr[arr.length - 1];
}

function signin(email, nameOfApp, apiKey) {
    const intastellarIssuerUrl = "https://apis.intastellaraccounts.com";
    const loginUri = (document.querySelector("[data-login_uri]") == null) ? location.hostname + ((location.port) ? ":" + location.port : "") + location.pathname : document.querySelector("[data-login_uri]").getAttribute("data-login_uri");
    const appName = document.querySelector("[data-app-name]")?.getAttribute("data-app-name") || nameOfApp;
    const key = document.querySelector("[data-client_id]")?.getAttribute("data-client_id") || apiKey;
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

    let loginWindow = window.open("https://www.intastellaraccounts.com/signin/v2/ws/oauth/oauthchooser?service=" + appName + "&continue=" + loginUri + "&entryFlow=" + window.btoa(scope) + "&key=" + key + "&access_id=" + encodeURI(domain) + "&passive=true&flowName=GeneralOAuthFlow&Entry=webauthsignin&scope=" + scope, 'popUpWindow', 'height=719,width=500,left=100,top=100,resizable=no');
    if (email != null) {
        loginWindow = window.open("https://www.intastellaraccounts.com/signin/v2/ws/oauth/pwd?service=" + appName + "&continue=" + loginUri + "&entryFlow=" + window.btoa(scope) + "&key=" + key + "&access_id=" + encodeURI(domain) + "&passive=true&flowName=GeneralOAuthFlow&Entry=webauthsignin&identifier=" + email + "&scope=" + scope, 'popUpWindow', 'height=719,width=500,left=100,top=100,resizable=no');

    }


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
        const expires = new Date();
        // Set the expiration date to 2 years
        expires.setFullYear(expires.getFullYear() + 2);
        domain = domain.split(":")[0];

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
                    const success = new IntastellarSolutionsSDKSuccess("We´ve successfully send user data for: " + e.account.user.name.first);
                    console.log(success.getCustomSuccessMessage());
                    document.cookie = "inta_acc=" + token + ";expire=" + expires + "; domain=" + domain + "; path=/";
                    document.querySelector(".intastellar-popup-shadow").style.visibility = "hidden";
                    if (window.location.href.indexOf("?") > -1) {
                        const query = "?" + window.location.href.split("?")[1];
                        // Add the query string to the url
                        window.location.href = window.location.protocol + "//" + document.querySelector("[data-login_uri]").getAttribute("data-login_uri") + query + "&token=" + JSON.stringify(t);
                    } else {
                        window.location.href = window.location.protocol + "//" + document.querySelector("[data-login_uri]").getAttribute("data-login_uri") + "?token=" + JSON.stringify(t);
                    }
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
                    const success = new IntastellarSolutionsSDKSuccess("We´ve successfully send user data for: " + e.account.user.name.first);
                    console.log(success.getCustomSuccessMessage());

                    document.cookie = "inta_acc=" + token + ";expire=" + expires + "; domain=" + domain + "; path=/";

                    document.querySelector(".intastellar-popup-shadow").style.visibility = "hidden";
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
                const success = new IntastellarSolutionsSDKSuccess("We´ve successfully send user data for: " + e.account.name);
                console.log(success.getCustomSuccessMessage());
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
            renderButton(element, theme = {
                theme: "light",
                scopes: "profile",
                picker: "popup",
            }) {
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
                const intastellarPopup = document.createElement("div");
                IntastellarText.setAttribute("class", "intastellarSignIn-info");
                if (type == null || type == undefined || type == "" || type == "intastellar") {
                    IntastellarText.innerHTML = "Sign in with Intastellar"
                } else if (type == "signup") {
                    IntastellarText.innerHTML = "Sign up with Intastellar"
                }

                IntastellarSigninButton.setAttribute("class", "IntastellarSignin");
                intastellarPopup.setAttribute("class", "intastellar-popup");
                if (theme != null || theme != undefined) {
                    if (theme.theme == "dark") {
                        IntastellarSigninButton.classList.add("dark");
                        intastellarPopup.classList.add("dark");
                    }

                    if (theme.scopes != null || theme.scopes != undefined) {
                        IntastellarSigninButton.setAttribute("data-scope", theme.scopes);
                    }
                }

                const IntastellarLogo = document.createElement("img");
                IntastellarLogo.setAttribute("src", intastellarLogoSrc)
                IntastellarLogo.setAttribute("class", "intastellar-logo");

                const IntastellarSigniniFrame = document.createElement("iframe");
                IntastellarSigniniFrame.setAttribute("id", "intastellar-signin-iframe");
                IntastellarSigniniFrame.setAttribute("src", "https://apis.intastellaraccounts.com/usercontent/button.php?v=" + Math.random());
                let appName = document.querySelector("[data-app-name]")?.getAttribute("data-app-name");
                let key = document.querySelector("[data-client_id]")?.getAttribute("data-client_id");
                if (theme.picker == "popup" && theme.appName != null) {
                    appName = theme.appName || document.querySelector("[data-app-name]")?.getAttribute("data-app-name");
                } else {
                    appName = document.querySelector("[data-app-name]")?.getAttribute("data-app-name");
                }

                const intastellarPopupShadow = document.createElement("div");
                intastellarPopupShadow.setAttribute("class", "intastellar-popup-shadow");
                /* intastellarPopupShadow.setAttribute("onclick", "document.querySelector('.intastellar-popup').style.bottom = '-100%'; this.style.visibility = 'hidden'"); */
                intastellarPopupShadow.appendChild(intastellarPopup);

                if (getCookie("inta_acc") != null) {
                    intastellarPopupShadow.setAttribute("style", "visibility: hidden");
                }

                if (theme.picker == "popup") {
                    intastellarPopupShadow.classList.add("top-left");
                    intastellarPopup.classList.add("top-left");
                    intastellarPopup.setAttribute("data-scope", theme.scopes || "profile");
                }

                const intastellarPopupContent = document.createElement("div");
                intastellarPopupContent.setAttribute("class", "intastellar-popup-content");

                const intastellarPopupButton = document.createElement("button");
                intastellarPopupButton.innerHTML = "Continue with Intastellar";
                intastellarPopupButton.setAttribute("class", "intastellar-popup-button");
                intastellarPopupButton.addEventListener("click", function () {
                    signin(null, appName, key);
                });

                intastellarPopup.innerHTML = `<header class="mobile-header desktop-hide">
                            <img src="https://www.intastellarsolutions.com/assets/logos/intastellar-new-planet.svg" class="logo">
                            <p class="header-info">Sign in to ${appName} with Intastellar</p>
                            <button class="close-popup" onclick="closeSignIn()">
                                <svg class="Bz112c Bz112c-r9oPif" xmlns="https://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#5f6368"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path><path fill="none" d="M0 0h24v24H0z"></path></svg>
                            </button>
                        </header>`;

                if (type === "signup") {
                    intastellarPopupContent.innerHTML += "<p class='intastellar-popup-footer'>To create your account, Intastellar will share your name, email, profile picture, " +
                        (theme.scopes) ?? formatArray(theme.scopes) + " with " + appName + ".</p>";;
                }

                if (getCookie("inta_state") == "1" && theme.picker == "popup") {
                    document.querySelector(".intastellar-popup-shadow").style.visibility = "hidden";
                }

                fetch("https://apis.intastellaraccounts.com/usercontent/js/getuser?origin=" + window.location.host, {
                    method: 'GET',
                    credentials: "include",
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }).then(e => e.json()).then(user => {

                    const loginbtn = document.querySelector(".IntastellarSignin");
                    const type = document.querySelector("[data-login-type]")?.getAttribute("data-login-type");
                    const intastellarSignInInfo = document.querySelector(".intastellarSignIn-info");
                    const intastellarLogo = document.querySelector(".intastellar-logo");

                    IntastellarSigninButton.appendChild(IntastellarLogo);
                    IntastellarSigninButton.appendChild(IntastellarText);

                    intastellarPopupContent.innerHTML = "";

                    if (user.length == 0) {


                        intastellarPopupContent.innerHTML = `<div class='intastellar-popup-user'>
                        <section>
                            <p class="intastellarSignIn-title">Sign in to '${appName}' with your Intastellar Account</p>
                            <p class="intastellarSignIn-info">
                                You no longer need to remember your passwords. Logging in is quick, easy and secure.
                            </p>
                        </section>
                        <div class="lgKYGb-v0h5Oe-HiaYvf"><svg xmlns="http://www.w3.org/2000/svg" width="109" height="68" viewBox="0 0 109 68" fill="none"><path d="M76.9939 45.6097C83.6315 45.6097 89.0123 40.2587 89.0123 33.6579C89.0123 27.0571 83.6315 21.7061 76.9939 21.7061C70.3563 21.7061 64.9754 27.0571 64.9754 33.6579C64.9754 40.2587 70.3563 45.6097 76.9939 45.6097Z" fill="#F1F3F4"></path><path opacity="0.04" d="M66.2924 28.242C68.28 28.0286 70.1827 27.3253 71.8279 26.1957C73.4731 25.0662 74.8088 23.5461 75.7139 21.7734C73.7264 21.9874 71.824 22.6909 70.1788 23.8204C68.5337 24.9499 67.1979 26.4696 66.2924 28.242Z" fill="#202124"></path><path d="M89.0123 62.3417C94.3211 62.3417 98.6246 58.062 98.6246 52.7827C98.6246 47.5034 94.3211 43.2236 89.0123 43.2236C83.7036 43.2236 79.4 47.5034 79.4 52.7827C79.4 58.062 83.7036 62.3417 89.0123 62.3417Z" fill="#F8F9FA"></path><path d="M5.74464 34.4539C8.84083 34.4539 11.3508 31.9578 11.3508 28.8788C11.3508 25.7998 8.84083 23.3037 5.74464 23.3037C2.64845 23.3037 0.138489 25.7998 0.138489 28.8788C0.138489 31.9578 2.64845 34.4539 5.74464 34.4539Z" fill="#F8F9FA"></path><path d="M40.9385 64.7347C47.5761 64.7347 52.957 59.3837 52.957 52.7829C52.957 46.1821 47.5761 40.8311 40.9385 40.8311C34.3009 40.8311 28.92 46.1821 28.92 52.7829C28.92 59.3837 34.3009 64.7347 40.9385 64.7347Z" fill="#F8F9FA"></path><path opacity="0.04" d="M40.9385 40.8311C39.1467 40.8323 37.378 41.2339 35.7631 42.006C36.5909 45.7269 38.6702 49.0556 41.6577 51.4423C44.6451 53.829 48.3618 55.1309 52.1939 55.1329H52.7231C52.8792 54.3633 52.9575 53.5802 52.957 52.7951C52.9586 51.2246 52.6489 49.6691 52.0457 48.2176C51.4424 46.7661 50.5574 45.4471 49.4412 44.336C48.325 43.2249 46.9996 42.3434 45.5406 41.742C44.0817 41.1406 42.5178 40.8311 40.9385 40.8311Z" fill="#202124"></path><path opacity="0.04" d="M29.9908 47.8623C32.207 47.7738 34.3544 47.0715 36.1908 45.8345C38.0272 44.5976 39.4797 42.8751 40.3846 40.8613C38.1714 40.9616 36.0292 41.6686 34.1949 42.9041C32.3606 44.1397 30.9056 45.8557 29.9908 47.8623Z" fill="#202124"></path><path opacity="0.6" d="M16.9015 24.099C22.2137 24.099 26.52 19.8166 26.52 14.5339C26.52 9.25121 22.2137 4.96875 16.9015 4.96875C11.5894 4.96875 7.28308 9.25121 7.28308 14.5339C7.28308 19.8166 11.5894 24.099 16.9015 24.099Z" fill="white" stroke="#F1F3F4" stroke-width="0.63" stroke-miterlimit="10"></path><path d="M64.9754 26.4857C71.613 26.4857 76.9939 21.1347 76.9939 14.5339C76.9939 7.93305 71.613 2.58203 64.9754 2.58203C58.3378 2.58203 52.957 7.93305 52.957 14.5339C52.957 21.1347 58.3378 26.4857 64.9754 26.4857Z" fill="#F8F9FA"></path><path opacity="0.6" d="M88.9877 24.038C94.2965 24.038 98.6 19.7582 98.6 14.4789C98.6 9.19964 94.2965 4.91992 88.9877 4.91992C83.679 4.91992 79.3754 9.19964 79.3754 14.4789C79.3754 19.7582 83.679 24.038 88.9877 24.038Z" fill="white" stroke="#F1F3F4" stroke-width="0.63" stroke-miterlimit="10"></path><path d="M28.92 45.6097C35.5576 45.6097 40.9385 40.2587 40.9385 33.6579C40.9385 27.0571 35.5576 21.7061 28.92 21.7061C22.2824 21.7061 16.9016 27.0571 16.9016 33.6579C16.9016 40.2587 22.2824 45.6097 28.92 45.6097Z" fill="#F1F3F4"></path><path opacity="0.04" d="M40.6985 31.259C40.1383 28.563 38.6613 26.1412 36.5161 24.4013C34.3708 22.6614 31.6883 21.7096 28.92 21.7061C28.4037 21.7076 27.8878 21.7403 27.3754 21.804C28.1409 23.9026 29.3876 25.7949 31.0166 27.3309C32.6456 28.867 34.612 30.0044 36.76 30.6531C35.3692 34.5212 35.4172 38.7568 36.8954 42.5927C38.1677 41.4735 39.1861 40.0981 39.8832 38.5577C40.5802 37.0173 40.94 35.3471 40.9385 33.6579C40.937 32.8524 40.8566 32.049 40.6985 31.259Z" fill="#202124"></path><path d="M16.9015 67.1268C24.868 67.1268 31.3262 60.7045 31.3262 52.7822C31.3262 44.8598 24.868 38.4375 16.9015 38.4375C8.93505 38.4375 2.47693 44.8598 2.47693 52.7822C2.47693 60.7045 8.93505 67.1268 16.9015 67.1268Z" fill="#FEEFC3"></path><path d="M64.9754 67.1268C72.9419 67.1268 79.4 60.7045 79.4 52.7822C79.4 44.8598 72.9419 38.4375 64.9754 38.4375C57.0089 38.4375 50.5508 44.8598 50.5508 52.7822C50.5508 60.7045 57.0089 67.1268 64.9754 67.1268Z" fill="#CEEAD6"></path><path d="M70.4892 58.7066H62.4893L70.4892 50.751V58.7066Z" fill="#81C995"></path><path d="M40.9385 28.8788C48.905 28.8788 55.3631 22.4564 55.3631 14.5341C55.3631 6.61177 48.905 0.189453 40.9385 0.189453C32.972 0.189453 26.5139 6.61177 26.5139 14.5341C26.5139 22.4564 32.972 28.8788 40.9385 28.8788Z" fill="#D2E3FC"></path><path d="M35.4 14.455C35.4 12.9943 35.9835 11.5934 37.0222 10.5605C38.0609 9.52755 39.4696 8.94727 40.9385 8.94727C42.4074 8.94727 43.8161 9.52755 44.8548 10.5605C45.8934 11.5934 46.477 12.9943 46.477 14.455H35.4Z" fill="#8AB4F8"></path><path opacity="0.2" d="M69.6646 39.2216C67.4927 38.4762 65.1731 38.258 62.8991 38.5852C60.6252 38.9124 58.4629 39.7755 56.5925 41.1026C54.7222 42.4296 53.1979 44.1821 52.147 46.2139C51.096 48.2458 50.5487 50.498 50.5508 52.7829C50.5508 53.1745 50.5508 53.5601 50.6062 53.9456C51.381 54.0534 52.1623 54.1086 52.9446 54.1109C57.0857 54.1103 61.081 52.591 64.166 49.8439C67.2509 47.0967 69.2087 43.3146 69.6646 39.2216Z" fill="#34A853"></path><path d="M52.9569 50.3895C62.2489 50.3895 69.7815 42.8986 69.7815 33.6581C69.7815 24.4176 62.2489 16.9268 52.9569 16.9268C43.665 16.9268 36.1323 24.4176 36.1323 33.6581C36.1323 42.8986 43.665 50.3895 52.9569 50.3895Z" fill="white"></path><path d="M21.8431 57.0357H11.96L16.8831 48.5293L21.8431 57.0357Z" fill="#FDD663"></path><path opacity="0.04" d="M97.7878 48.8841C97.2557 47.6921 96.4835 46.6214 95.5187 45.738C94.554 44.8547 93.4173 44.1776 92.1789 43.7486C90.9405 43.3195 89.6268 43.1477 88.319 43.2436C87.0112 43.3396 85.7371 43.7014 84.5754 44.3065C85.7871 45.8468 87.3356 47.0926 89.1034 47.9493C90.8712 48.8061 92.812 49.2513 94.7785 49.2513C95.7927 49.2483 96.8029 49.125 97.7878 48.8841Z" fill="#202124"></path><path opacity="0.04" d="M81.8001 36.3386C81.7993 38.8522 82.5372 41.3111 83.9231 43.4131C85.2478 42.4879 86.3705 41.3057 87.2236 39.9377C88.0766 38.5696 88.6424 37.044 88.8867 35.4527C89.1311 33.8614 89.049 32.2373 88.6455 30.6784C88.2419 29.1195 87.5252 27.658 86.5385 26.3818C85.0559 27.5884 83.8617 29.1077 83.0421 30.8298C82.2226 32.5518 81.7984 34.4335 81.8001 36.3386Z" fill="#202124"></path><path d="M95.5292 46.938C102.697 46.938 108.508 41.1596 108.508 34.0315C108.508 26.9034 102.697 21.125 95.5292 21.125C88.3614 21.125 82.5508 26.9034 82.5508 34.0315C82.5508 41.1596 88.3614 46.938 95.5292 46.938Z" fill="#FAD2CF"></path><path d="M99.1446 34.3067L95.2544 30.4381C94.3316 29.5203 92.8364 29.5194 91.9147 30.4359C90.9931 31.3524 90.9941 32.8394 91.9169 33.7571L95.8071 37.6257C96.7299 38.5434 98.2252 38.5444 99.1468 37.6279C100.068 36.7113 100.067 35.2244 99.1446 34.3067Z" fill="#F28B82"></path><path d="M64.2985 32.5868C63.8976 33.1763 63.2859 33.5917 62.5879 33.7483C61.8898 33.905 61.158 33.7911 60.5414 33.4299C59.9248 33.0687 59.4699 32.4874 59.2693 31.8043C59.0686 31.1212 59.1374 30.3878 59.4615 29.7534C59.5673 29.5314 59.7041 29.3254 59.8677 29.1414L56.8954 26.8281L51.7077 33.4374L61.5539 41.0993L66.7415 34.4962L64.2985 32.5868Z" fill="#FBBC04"></path><path d="M63.85 40.8551L43.3286 24.8994L40.0347 29.089L60.5562 45.0447L63.85 40.8551Z" fill="#FCC934"></path><path d="M43.3323 24.9014L40.0339 29.0934L42.2308 30.8069C43.0696 30.174 43.8244 29.4378 44.4769 28.616C44.9416 28.0268 45.3535 27.3981 45.7077 26.7373L43.3323 24.9014Z" fill="#FBBC04"></path><path d="M40.6924 13.4635C39.1195 12.2373 37.2162 11.5027 35.2233 11.3528C33.2304 11.2029 31.2376 11.6445 29.4972 12.6216C27.7568 13.5987 26.3471 15.0674 25.4465 16.8417C24.546 18.616 24.1951 20.6161 24.4383 22.5889C24.6816 24.5616 25.5079 26.4182 26.8129 27.9236C28.1178 29.429 29.8425 30.5155 31.7687 31.0455C33.6949 31.5755 35.736 31.5253 37.6334 30.901C39.5309 30.2768 41.1994 29.1067 42.4277 27.5389C44.0706 25.4421 44.8105 22.783 44.4852 20.1446C44.1599 17.5061 42.7959 15.1036 40.6924 13.4635ZM38.2985 24.3628C37.707 25.1149 36.9046 25.6757 35.9927 25.9744C35.0807 26.273 34.1002 26.2961 33.1751 26.0407C32.25 25.7853 31.4217 25.2629 30.7951 24.5395C30.1685 23.8161 29.7716 22.9241 29.6547 21.9765C29.5377 21.0288 29.7059 20.0679 30.138 19.2152C30.57 18.3626 31.2466 17.6565 32.0822 17.1862C32.9177 16.7158 33.8748 16.5024 34.8323 16.5729C35.7898 16.6434 36.7048 16.9946 37.4616 17.5821C38.4759 18.3715 39.1337 19.529 39.2906 20.8003C39.4475 22.0716 39.0907 23.3528 38.2985 24.3628Z" fill="#FCC934"></path><path d="M27.4615 22.2383C27.1971 20.0957 27.5832 17.9234 28.5702 16.0007C29.5571 14.0781 31.0999 12.493 33 11.4492C30.343 11.7738 27.9244 13.1348 26.2764 15.2328C24.6284 17.3307 23.8859 19.9938 24.2123 22.6361C24.5387 25.2784 25.9073 27.6836 28.0169 29.3225C30.1266 30.9613 32.8045 31.6997 35.4616 31.3751C33.3636 30.8197 31.4807 29.6528 30.0551 28.0246C28.6294 26.3963 27.7262 24.3812 27.4615 22.2383Z" fill="#FBBC04"></path></svg></div>
                    </div>`;
                    } else {

                        user.map(e => {
                            intastellarPopupContent.innerHTML += `
                        <div class='intastellar-popup-header intastellar-popup-user'>
                            <img src="${e.image}" class="intastellar-popup-userProfile">
                            <div class="intastellar-popup-header-info">
                                <p class="intastellar-popup-userName">${e.name.first}</p>
                                <p class="intastellar-popup-header-email">${e.email}</p>
                            </div>
                        </div>`;

                        })

                        if (user.length == 1) {
                            const IntastellarUserProfile = document.createElement("img");
                            IntastellarUserProfile.setAttribute("class", "intastellar-userProfile");
                            IntastellarUserProfile.setAttribute("src", user[0].image);
                            IntastellarSigninButton.appendChild(IntastellarUserProfile);
                            IntastellarSigninButton.appendChild(IntastellarText);
                            IntastellarSigninButton.appendChild(IntastellarLogo);
                            if (theme.picker == "button" || getCookie("inta_acc") != null) {
                                IntastellarText.innerHTML = "Continue as " + user[0].name.first;
                            }

                            intastellarPopupButton.innerHTML = "Continue as " + user[0].name.first;
                            /* intastellarPopupButton.setAttribute("onclick", "signin('" + user[0].email + "', '" + appName + "')"); */
                            intastellarPopupButton.addEventListener("click", () => {
                                signin(user[0].email, appName, key);
                            });
                        } else {
                            intastellarPopupButton.innerHTML = "Continue by choosing an account";
                            intastellarPopupButton.addEventListener("click", () => {
                                signin(null, appName, key);
                            });
                        }
                    }
                    if (user && intastellarLogo != null) {
                        intastellarLogo.classList.add("reverse");
                    }
                    else if (type == "signup") {
                        intastellarSignInInfo.innerHTML = "Sign up as " + user.name.first;
                        intastellarSignInInfo.innerHTML += "<span class='email'>" + user.email + "</span>";
                    }
                    if (loginbtn != null) {
                        loginbtn.innerHTML += "<img class='intastellar-userProfile' src='" + user.image + "'>";
                    }
                }).catch(e => {
                    new IntastellarSolutionsSDKError("User not logged in");
                }).finally(() => {
                    intastellarPopupContent.appendChild(intastellarPopupButton);
                    intastellarPopupContent.innerHTML += "<p class='intastellar-popup-footer'>To sign in, Intastellar will share your name, email, profile picture" +
                        (theme.scopes != undefined ? formatArray(theme.scopes) : "") + " with " + appName + ".</p>";
                    intastellarPopup.appendChild(intastellarPopupContent);
                    document.body.appendChild(intastellarPopupShadow);

                    if (IntastellarButtonContainer != null || IntastellarButtonContainer != undefined) {
                        if (theme.picker != "popup") {
                            IntastellarButtonContainer.appendChild(IntastellarSigninButton);
                            IntastellarSigninButton.addEventListener("click", (e) => {
                                e.preventDefault();
                                if (window.innerWidth > 768) {
                                    signin(null, appName, key);
                                } else {
                                    document.querySelector(".intastellar-popup-shadow").style.visibility = "visible";
                                    setTimeout(() => {
                                        document.querySelector(".intastellar-popup").style.bottom = "0";
                                    }, 100);
                                }
                            })
                        } else {
                            if (getCookie("inta_acc") == null) {
                                if (getCookie("inta_state") != "1" && theme.picker == "popup") {
                                    document.querySelector(".intastellar-popup-shadow").style.visibility = "visible";
                                }
                            } else {
                                IntastellarButtonContainer.appendChild(IntastellarSigninButton);
                                IntastellarSigninButton.addEventListener("click", (e) => {
                                    e.preventDefault();
                                    if (window.innerWidth > 768) {
                                        signin(null, appName, key);
                                    } else {
                                        document.querySelector(".intastellar-popup-shadow").style.visibility = "visible";
                                        setTimeout(() => {
                                            document.querySelector(".intastellar-popup").style.bottom = "0";
                                        }, 100);
                                    }
                                })
                            }
                        }
                    }
                })
            },
            logout() {
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
                document.cookie = "inta_acc=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" + domain + ";";
            },
        }
    }
}
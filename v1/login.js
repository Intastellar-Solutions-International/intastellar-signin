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
        new IntastellarSolutionsSDKError("Please enable popups for this website");
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
            /* console.log("Popup window closed."); */
            clearInterval(checkLoadedAndClosed);
        }
    }, 1000);

    window.addEventListener("message", function (token) {
        const t = token.data;
        document.cookie = "c_name=" + JSON.parse(window.atob(t)).user_id + "; expire=; domain=" + window.location.host;

        if (t != "") {
            loginWindow.postMessage("iframe-token-recieved", token.origin);
        }

        if (document.querySelector("[data-login_uri]") != null && document.querySelector("[data-login_callback]") != null) {
            new IntastellarSolutionsSDKError("Please add only 1 of the following: data-login_callback or data-login_uri. Not both")
            return;
        }

        if (document.querySelector("[data-login_uri]") != null) {
            //loginWindow.close();
            // Check if current url has a query string
            const query = "?" + window.location.href.split("?")[1];
            const token = t;

            fetch("https://apis.intastellaraccounts.com/verify.php", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: token,
                    origin: window.location.host,
                    app: appName
                })
            }).then(e => e.json()).then(e => {
                if (e.statusCode == 200) {
                    const t = e.account;
                    new IntastellarSolutionsSDKSuccess("We´ve successfully send user data for: " + t.name);
                    if (window.location.href.indexOf("?") > -1) {
                        const query = "?" + window.location.href.split("?")[1];
                        // Add the query string to the url
                        window.location.href = window.location.protocol + "//" + document.querySelector("[data-login_uri]").getAttribute("data-login_uri") + query + "&token=" + JSON.stringify(t);
                    } else {
                        window.location.href = window.location.protocol + "//" + document.querySelector("[data-login_uri]").getAttribute("data-login_uri") + "?token=" + JSON.stringify(t);
                    }
                } else {
                    new IntastellarSolutionsSDKError(e.error);
                }
            })
        } else if (document.querySelector("[data-login_callback]") != null) {
            const fn = window[document.querySelector("[data-login_callback]").getAttribute("data-login_callback")];
            new IntastellarSolutionsSDKSuccess("We´ve successfully send user data for: " + JSON.parse(window.atob(t)).name);
            const token = t;
            fetch("https://apis.intastellaraccounts.com/verify.php", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: token,
                    origin: window.location.host,
                    app: appName
                })
            }).then(e => e.json()).then(e => {
                if (e.statusCode == 200) {
                    new IntastellarSolutionsSDKSuccess("We´ve successfully send user data for: " + JSON.parse(window.atob(t)).name);
                    fn(e.account);
                } else {
                    new IntastellarSolutionsSDKError(e.error);
                }
            })
        }
    })
}

/* Check user loggedin status on intastellaraccounts.com */

async function checkUserLogin() {
    await fetch("https://apis.intastellaraccounts.com/usercontent/js/getuser.php?origin=" + window.location.host, {
        method: 'GET',
        credentials: "include",
        mode: 'cors',
    }).then(e => e.json()).then(e => {
        const user = e.user;
        const loginbtn = document.querySelector(".IntastellarSignin");
        const type = document.querySelector("[data-login-type]")?.getAttribute("data-login-type");
        const intastellarSignInInfo = document.querySelector(".intastellarSignIn-info");
        const intastellarLogo = document.querySelector(".intastellar-logo");
        if (user) {
            intastellarLogo.classList.add("reverse");
        }
        if (type == null || type == undefined || type == "") {
            intastellarSignInInfo.innerHTML = "Sign in as " + user.name + "<br>";
            intastellarSignInInfo.innerHTML += "<span class='email'>" + user.email + "</span>";
        } else if (type == "signup") {
            intastellarSignInInfo.innerHTML = "Sign up as " + user.name + "<br>";
            intastellarSignInInfo.innerHTML += "<span class='email'>" + user.email + "</span>";
        }
        loginbtn.innerHTML += "<img class='intastellar-userProfile' src='" + user.image + "'>";
    }).catch(e => {
        new IntastellarSolutionsSDKError("User not logged in");
    })
}
const styleSheet = document.createElement("link");
styleSheet.rel = "stylesheet";
styleSheet.href = "https://account.api.intastellarsolutions.com/v1/insign/style.css";

if (window.location.host == "localhost" || window.location.host.indexOf("127.0.0.1") > -1) {
    styleSheet.href = "./insign/style.css";
}

document.head.appendChild(styleSheet);

const Intastellar = {
    accounts: {
        id: {
            renderButton(element, theme = {}) {
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

                if (IntastellarButtonContainer != null || IntastellarButtonContainer != undefined) {
                    checkUserLogin();
                    IntastellarButtonContainer.appendChild(IntastellarSigninButton);
                    IntastellarSigninButton.addEventListener("click", (e) => {
                        e.preventDefault();
                        signin();
                    });
                }
            }
        }
    }
}
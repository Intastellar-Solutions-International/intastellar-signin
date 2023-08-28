const intastellarLogoSrc = "https://www.intastellarsolutions.com/assets/icons/fav/android-icon-192x192.png";
class IntastellarAccounts{
    constructor(){
        /* Intastellar API root for IntastellarA Accounts */
        this.IntastellarAPIroot = "https://apis.intastellaraccounts.com";
        /* Intastellar Login Url */
        this.IntastellarAPILoginRoot = "https://www.intastellaraccounts.com";

    }

    /* Function to log the user in */
    LogUserIn(){
        const login = this.IntastellarAPILoginRoot + "/signin/v3/identifier";

    }

    /* Function to log the user out */
    LogUserOut(){

    }

    /* Function to get user profile information */
    getPublicData(){

    }
}

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

function signin(){
    const loginUri = (document.querySelector("[data-login_uri]") == null) ? location.hostname + location.pathname : document.querySelector("[data-login_uri]").getAttribute("data-login_uri");
    const appName = document.querySelector("[data-app-name]").getAttribute("data-app-name");
    const key = document.querySelector("[data-client_id]").getAttribute("data-client_id");
    const loginWindow = window.open("https://www.intastellaraccounts.com/signin/v2/ws/oauth/oauthchooser?service="+ appName +"&continue="+ loginUri +"&entryFlow="+ window.btoa(loginUri) +"&key="+key+"&passive=true&flowName=WebSignin&Entry=webauthsignin", 'popUpWindow','height=719,width=500,left=100,top=100,resizable=no');

    window.addEventListener("message", function(token){
        const t = token.data;
        document.cookie = "c_name=" + JSON.parse(window.atob(t)).user_id + "; expire=; domain=" + window.location.host;
        loginWindow.postMessage("iframe-token-recieved", token.origin);

        if(document.querySelector("[data-login_uri]") != null && document.querySelector("[data-login_callback]") != null){
            new IntastellarSolutionsSDKError("Please add only 1 of the following: data-login_callback or data-login_uri. Not both")
            return;
        }

        if(document.querySelector("[data-login_uri]") != null){
            loginWindow.close();
            window.location.href = "http://" + loginUri + "?token=" + t;
        }else if(document.querySelector("[data-login_callback]") != null){
            const fn = window[document.querySelector("[data-login_callback]").getAttribute("data-login_callback")];
            new IntastellarSolutionsSDKSuccess("We´ve successfully send user data for: " + JSON.parse(window.atob(t)).name)
            fn(JSON.parse(window.atob(t)));
        }
    })
}

/* Check user loggedin status on intastellaraccounts.com */

function checkUserLogin(){
    fetch("https://apis.intastellaraccounts.com/usercontent/js/getuser.php", {
        method: 'GET',
        credentials: "include",
        mode: 'cors',
    }).then(e => e.json()).then(e => {
        const user = e.user;
        const loginbtn = document.querySelector(".IntastellarSignin");

        const intastellarSignInInfo = document.querySelector(".intastellarSignIn-info");
        intastellarSignInInfo.innerHTML = "Continue as " + user.name;
        loginbtn.innerHTML += "<img style='width: 30px; height=: 30px; margin-left: 5px; border-radius: 50%; object-fit: cover;' class='intastellar-userProfile' src='"+user.image+"'>";
    }).catch(e => {
        /* console.log(e); */
    })
}
const styleSheet = document.createElement("link");
styleSheet.rel = "stylesheet";
styleSheet.href = "https://account.api.intastellarsolutions.com/insign/style.css";
document.head.appendChild(styleSheet);

const Intastellar = {
    accounts: {
        id: {
            renderButton(element, theme = {}){
                const IntastellarSigninButton = document.createElement("button");
                const IntastellarText = document.createElement("div");
                IntastellarText.setAttribute("class", "intastellarSignIn-info");
                IntastellarText.innerHTML = "Sign in with Intastellar"
                IntastellarSigninButton.setAttribute("class", "IntastellarSignin");
                const IntastellarLogo = document.createElement("img");
                IntastellarLogo.setAttribute("src", intastellarLogoSrc)
                IntastellarLogo.setAttribute("class", "intastellar-logo");
                IntastellarSigninButton.appendChild(IntastellarLogo);
                IntastellarSigninButton.appendChild(IntastellarText);

                if(element != null || element != undefined){
                    element.appendChild(IntastellarSigninButton);
                    IntastellarSigninButton.addEventListener("click", signin);
                    checkUserLogin();
                }
            }
        }
    }
}
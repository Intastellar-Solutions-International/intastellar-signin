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

function signin(){
    const loginUri = (document.querySelector("[data-login_uri]") == null) ? location.hostname + location.pathname : document.querySelector("[data-login_uri]").getAttribute("data-login_uri");
    const appName = document.querySelector("[data-app-name]").getAttribute("data-app-name");
    const key = document.querySelector("[data-client_id]").getAttribute("data-client_id");
    const loginWindow = window.open("https://www.intastellaraccounts.com/signin/v2/ws/oauth/oauthchooser?service="+ appName +"&continue="+ loginUri +"&entryFlow="+ window.btoa(loginUri) +"&key="+key+"&passive=true&flowName=WebSignin&Entry=webauthsignin", 'popUpWindow','height=719,width=500,left=100,top=100,resizable=no');

    window.addEventListener("message", function(e){
        const token = e.data;
        document.cookie = "c_name=" + JSON.parse(window.atob(token)).user_id + "; expire=; domain=" + window.location.host;
        loginWindow.postMessage("iframe-token-recieved", e.origin);

        if(document.querySelector("[data-login_uri]") != null && document.querySelector("[data-login_callback]") != null){
            console.error("Intastellar SDK: Please add only 1 of the following: data-login_callback or data-login_uri. Not both")
            return;
        }

        if(document.querySelector("[data-login_uri]") != null){
            window.parent.close();
            window.location.href = "http://" + loginUri + "?token=" + token;
        }else if(document.querySelector("[data-login_callback]") != null){
            const fn = window[document.querySelector("[data-login_callback]").getAttribute("data-login_callback")];
            fn(JSON.parse(window.atob(token)))
        }
    })
}

/* Check user loggedin status on intastellaraccounts.com */

function checkUserLogin(){
    fetch("https://apis.intastellaraccounts.com/usercontent/js/getuser.php", {
        method: 'GET',
        credentials: 'include'
    }).then(e => e.json()).then(e => {
        if(e.status == 200){
            const user = e.data;
            const loginbtn = document.querySelector(".intastellarSignin");
            const intastellarSignInInfo = document.querySelector(".intastellarSignIn-info");
            loginbtn.innerHTML += "<img src='"+user.image+"'>";
            intastellarSignInInfo.innerHTML = "Continue as " + user.name;
        }
    }).catch(e => {
        console.log(e);
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
                }
                /* checkUserLogin(); */
            }
        }
    }
}
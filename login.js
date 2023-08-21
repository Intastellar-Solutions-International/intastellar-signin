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
    const loginUri = document.querySelector("[data-login_uri]").getAttribute("data-login_uri");
    const appName = document.querySelector("[data-app-name]").getAttribute("data-app-name");
    const key = document.querySelector("[data-client_id]").getAttribute("data-client_id");
    const loginWindow = window.open("https://www.intastellaraccounts.com/signin/v2/ws/oauth/oauthchooser?service="+ appName +"&continue="+ loginUri +"&entryFlow="+ window.btoa(loginUri) +"&key="+key+"&passive=true&flowName=WebSignin&Entry=webauthsignin", 'popUpWindow','height=719,width=500,left=100,top=100,resizable=no');

    window.addEventListener("message", function(e){
        const token = e.data;
        document.cookie = "c_name=" + JSON.parse(window.atob(e.data)).user_id + "; expire=; domain=" + window.location.host;
        loginWindow.postMessage("success", e.origin);
        window.location.href = "http://" + loginUri + "?token=" + token;
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

const Intastellar = {
    accounts: {
        id: {
            renderButton(element, theme = {}){
                const IntastellarSigninButton = document.createElement("button");
                const IntastellarText = document.createElement("div");
                IntastellarText.setAttribute("class", "intastellarSignIn-info");
                IntastellarText.innerHTML = "Signin with Intastellar"
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
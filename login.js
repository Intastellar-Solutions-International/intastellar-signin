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
    const loginWindow = window.open("https://www.intastellaraccounts.com/signin/v2/ws/oauth/oauthchooser?service="+ appName +"&continue="+ loginUri +"&entryFlow="+ window.btoa(loginUri) +"&passive=true&flowName=WebSignin&Entry=webauthsignin", 'popUpWindow','height=719,width=500,left=100,top=100,resizable=no');

    window.addEventListener("message", function(e){
        const token = e.data;
        loginWindow.postMessage("success", e.origin);
        window.location.href = "http://" + loginUri + "?token=" + token;
    })
}

const Intastellar = {
    accounts: {
        id: {
            renderButton(element, theme = {}){
                const IntastellarSigninButton = document.createElement("button");
                IntastellarSigninButton.setAttribute("class", "IntastellarSignin");
                IntastellarSigninButton.innerHTML = "Signin with Intastellar";
                element.appendChild(IntastellarSigninButton);

                IntastellarSigninButton.addEventListener("click", signin);
            }
        }
    }
}
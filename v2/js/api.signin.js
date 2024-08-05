class IntastellarAPI {
    constructor() {
        this._apiDomain = 'https://account.api.intastellarsolutions.com';
        this._apiVersion = 'v2';
        this._apiPath = 'js';
        this._apiUrl = `${this._apiDomain}/${this._apiVersion}/${this._apiPath}`;
        this._intastellarLogoSrc = 'https://www.intastellarsolutions.com/assets/logos/intastellar-new-planet.svgg';
        this._tokenVerifyUrl = 'https://apis.intastellaraccounts.com/verify';
        this._loginDomain = 'https://www.intastellaraccounts.com';
        this._loginPath = 'signin';
        this._loginVersion = 'v3';
        this._loginUrl = `${this._loginDomain}/${this._loginPath}/${this._loginVersion}`;

        this._apiEndpoints = {
            signin: 'api.signin.js',
            signup: 'api.signup.js',
            signout: 'api.signout.js',
            reset: 'api.reset.js',
            verify: 'api.verify.js',
            profile: 'api.profile.js',
            settings: 'api.settings.js',
            security: 'api.security.js',
            notifications: 'api.notifications.js'
        }

        this._apiData = {
            email: '',
            password: ''
        }

        this._apiResponse = {
            status: '',
            message: '',
            token: ''
        }

        this._apiError = {
            status: '',
            message: ''
        }

        this._apiSuccess = {
            status: '',
            message: ''
        }

        this._apiLoading = {
            status: '',
            message: ''
        }

        this._apiValidateToken = {
            verifyUrl: this._tokenVerifyUrl + '?token=' + this._apiResponse.token,
            verifyMethod: 'GET',
            verifyHeaders: {
                'Content-Type': 'application/json',
            },
            verifyData: {
                token: this._apiResponse.token
            },
            verifyResponse: {
                status: '',
                message: '',
                userInformation: {}
            }
        }
    }

    init() {
        // Build the button to trigger the signin
        //this.signin();
    }

    signin() {
        window.open(this._loginUrl, '_blank');
    }

    checkUserLogin() {
        const token = localStorage.getItem('intastellarToken');
        if (token != null || token != undefined) {
            this.verifyToken(token);
        }
    }

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
        IntastellarLogo.setAttribute("src", this._intastellarLogoSrc);
        IntastellarLogo.setAttribute("class", "intastellar-logo");
        IntastellarSigninButton.appendChild(IntastellarLogo);
        IntastellarSigninButton.appendChild(IntastellarText);

        if (IntastellarButtonContainer != null || IntastellarButtonContainer != undefined) {
            //Call the function to check if the user is already logged in
            /* this.checkUserLogin(); */
            IntastellarButtonContainer.appendChild(IntastellarSigninButton);
            IntastellarSigninButton.addEventListener("click", (e) => {
                e.preventDefault();
                this.signin();
            });
        }
    }

}

const Intastellar = {
    accounts: {
        id: {
            renderButton: new IntastellarAPI().renderButton
        }
    }
}
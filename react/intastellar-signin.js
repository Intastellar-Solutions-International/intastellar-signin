const fetch = require('node-fetch');
import Button from "./components/Button";
const intastellarLogoSrc = "https://www.intastellarsolutions.com/assets/logos/intastellar-new-planet.svg";
const intastellarLogoAlt = "Intastellar Solutions Logo";

class IntastellarSolutionsSDKError extends Error {
    constructor(message) {
        super(message);
        this.name = 'IntastellarSolutionsSDKError';
    }
}

class IntastellarSolutionsSDKSuccess {
    constructor(message) {
        this.message = message;
        this.name = 'IntastellarSolutionsSDKSuccess';
    }

    getCustomSuccessMessage() {
        return `Success: ${this.message}`;
    }
}


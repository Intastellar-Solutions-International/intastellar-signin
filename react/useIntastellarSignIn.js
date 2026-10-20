import { useCallback, useEffect, useRef, useState } from "react";

const INTASTELLAR_ACCOUNTS_ORIGIN = "https://www.intastellaraccounts.com";
const INTASTELLAR_API_ORIGIN = "https://apis.intastellaraccounts.com";

export class IntastellarSignInError extends Error {
    constructor(message) {
        super(message);
        this.name = "IntastellarSignInError";
    }
}

function isSecureContext() {
    return window.location.protocol === "https:" || window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
}

function resolveCookieDomain(cookieDomain) {
    // Default to the exact current host. Widening to the parent domain is
    // opt-in (cookieDomain="parent") because doing it unconditionally is
    // unsafe on multi-tenant public suffixes such as *.github.io or
    // *.vercel.app, where it would leak the cookie to every other site
    // hosted on the same parent domain.
    if (cookieDomain !== "parent") {
        return null;
    }
    let domain = window.location.hostname || window.location.host;
    const domainParts = domain.split(".");
    if (domainParts.length > 2) {
        domainParts.shift();
    }
    if (isNaN(domainParts[0])) {
        domain = domainParts.join(".");
    }
    return domain.split(":")[0];
}

function setCookie(name, value, yearsValid, cookieDomain) {
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + yearsValid);
    const domain = resolveCookieDomain(cookieDomain);
    let cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/; SameSite=Lax${isSecureContext() ? "; Secure" : ""}`;
    if (domain) {
        cookie += `; domain=${domain}`;
    }
    document.cookie = cookie;
}

function clearCookie(name, cookieDomain) {
    const domain = resolveCookieDomain(cookieDomain);
    let cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax${isSecureContext() ? "; Secure" : ""}`;
    if (domain) {
        cookie += `; domain=${domain}`;
    }
    document.cookie = cookie;
}

export function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
}

function getCenteredPopupPosition(width, height) {
    // Account for multi-monitor setups (screenLeft/Top) so the popup is
    // centered on whichever screen the browser window is actually on,
    // instead of opening at a fixed corner.
    const dualScreenLeft = window.screenLeft ?? window.screenX ?? 0;
    const dualScreenTop = window.screenTop ?? window.screenY ?? 0;
    const viewportWidth = window.innerWidth ?? document.documentElement.clientWidth ?? screen.width;
    const viewportHeight = window.innerHeight ?? document.documentElement.clientHeight ?? screen.height;
    return {
        left: Math.max(0, dualScreenLeft + (viewportWidth - width) / 2),
        top: Math.max(0, dualScreenTop + (viewportHeight - height) / 2),
    };
}

function isSameOriginDestination(destination) {
    // loginUri is meant to be a path on this same site. Since it gets built
    // straight into a full URL and navigated to, anything that resolves
    // off-origin (a misconfigured prop, or one templated from unvalidated
    // input) is an open redirect -- refuse to navigate there.
    try {
        const candidate = new URL(window.location.protocol + "//" + destination);
        return candidate.origin === window.location.origin;
    } catch (e) {
        return false;
    }
}

function randomId() {
    return window.crypto?.randomUUID?.() || (Date.now() + "-" + Math.random().toString(36).slice(2));
}

// Retrieves (and discards) the one-time account payload stashed by signIn()
// when using loginUri, keyed by the intastellar_token_ref query parameter the
// destination page was redirected with. Call this on mount of the page that
// loginUri points at. Returns null if the reference is missing or already
// consumed (it's sessionStorage, so it also disappears once the tab closes).
export function consumeToken(ref) {
    if (ref == null) {
        return null;
    }
    const key = "intastellar_pending_" + ref;
    const raw = sessionStorage.getItem(key);
    if (raw == null) {
        return null;
    }
    sessionStorage.removeItem(key);
    return JSON.parse(raw);
}

export function signOut(cookieDomain) {
    clearCookie("inta_acc", cookieDomain);
}

/**
 * Hook form of the sign-in flow. Exactly one of `loginUri` or `onSuccess`
 * must be provided -- loginUri redirects to a same-origin page that reads
 * the result with consumeToken(), onSuccess receives the account object
 * directly (both mirror the vanilla SDK's data-login_uri / data-login_callback
 * split).
 */
export function useIntastellarSignIn({
    clientId,
    appName,
    scope = "profile",
    loginUri,
    onSuccess,
    cookieDomain = "host",
} = {}) {
    if (loginUri != null && onSuccess != null) {
        throw new IntastellarSignInError("Pass only one of loginUri or onSuccess, not both.");
    }
    if (loginUri == null && onSuccess == null) {
        throw new IntastellarSignInError("Pass either loginUri or onSuccess so there's somewhere to deliver the signed-in account.");
    }

    const [status, setStatus] = useState("idle"); // idle | loading | error
    const [errorMessage, setErrorMessage] = useState(null);

    // A ref (not state) because it has to be read synchronously inside the
    // signIn() event handler to guard against a second click opening a
    // duplicate popup before the next render happens.
    const signinInProgressRef = useRef(false);
    const cleanupRef = useRef(null);

    useEffect(() => {
        return () => {
            cleanupRef.current?.();
        };
    }, []);

    const signIn = useCallback((email) => {
        if (signinInProgressRef.current) {
            return;
        }
        signinInProgressRef.current = true;
        setStatus("loading");
        setErrorMessage(null);

        const resolvedLoginUri = loginUri ?? (window.location.hostname + (window.location.port ? ":" + window.location.port : "") + window.location.pathname);

        // Root-domain-or-IP calculation used only for the access_id param
        // sent to the IDP (identifies which site is requesting sign-in), not
        // for any cookie -- cookie scoping is handled separately above.
        let domain = window.location.hostname || window.location.host;
        const domainParts = domain.split(".");
        if (domainParts.length > 2) {
            domainParts.shift();
        }
        if (isNaN(domainParts[0])) {
            domain = domainParts.join(".");
        }
        if (window.location.port !== "") {
            domain += ":" + window.location.port;
        }

        const popupWidth = 500;
        const popupHeight = 719;
        const popupPosition = getCenteredPopupPosition(popupWidth, popupHeight);
        const popupFeatures = `height=${popupHeight},width=${popupWidth},left=${popupPosition.left},top=${popupPosition.top},resizable=no`;

        // Sent as the OAuth `state` param -- the standard CSRF defense for
        // the authorization request itself. The accounts service doesn't
        // currently echo state back through postMessage, so it can't be
        // verified round-trip yet; the message channel's actual CSRF
        // protection is the origin check in onMessage below. Sending it now
        // means nothing has to change here if the backend adds that later.
        const signinState = randomId();

        const basePath = email != null ? "/signin/v2/ws/oauth/pwd" : "/signin/v2/ws/oauth/oauthchooser";
        const identifierParam = email != null ? `&identifier=${encodeURIComponent(email)}` : "";
        const url = `${INTASTELLAR_ACCOUNTS_ORIGIN}${basePath}?service=${appName}&continue=${resolvedLoginUri}&entryFlow=${window.btoa(scope)}&key=${clientId}&access_id=${encodeURI(domain)}&passive=true&flowName=GeneralOAuthFlow&Entry=webauthsignin${identifierParam}&scope=${scope}&state=${signinState}`;

        const loginWindow = window.open(url, "popUpWindow", popupFeatures);

        const reset = () => {
            signinInProgressRef.current = false;
            setStatus("idle");
        };

        const fail = (message) => {
            signinInProgressRef.current = false;
            setStatus("error");
            setErrorMessage(message);
        };

        if (loginWindow == null) {
            fail("Please enable popups for this website and try again.");
            throw new IntastellarSignInError("Please enable popups for this website");
        }

        const checkClosed = setInterval(() => {
            if (loginWindow.closed) {
                clearInterval(checkClosed);
                window.removeEventListener("message", onMessage);
                reset();
            }
        }, 1000);

        function onMessage(event) {
            // Only trust messages from the Intastellar accounts service.
            // Without this check, any page on the web could postMessage a
            // forged token to this window and be treated as a logged-in user.
            if (event.origin !== INTASTELLAR_ACCOUNTS_ORIGIN) {
                return;
            }

            const token = event.data;
            if (token !== "") {
                loginWindow.postMessage("iframe-token-recieved", event.origin);
            }

            fetch(`${INTASTELLAR_API_ORIGIN}/verify`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
            }).then((r) => r.json()).then((result) => {
                if (result.statusCode !== 200) {
                    throw new IntastellarSignInError(result.error);
                }
                const { phone, birthday } = result.account.user[0];
                result.account.user.phone = phone;
                result.account.user.birthday = birthday;
                delete result.account.user[0];
                const account = result.account;

                setCookie("inta_acc", token, 2, cookieDomain);
                clearInterval(checkClosed);
                window.removeEventListener("message", onMessage);

                if (onSuccess != null) {
                    onSuccess(account);
                    reset();
                    return;
                }

                // Hand the account payload off via a one-time sessionStorage
                // entry instead of embedding the token/profile in the URL,
                // where it would end up in browser history and server logs.
                const tokenRef = randomId();
                sessionStorage.setItem("intastellar_pending_" + tokenRef, JSON.stringify(account));

                if (!isSameOriginDestination(resolvedLoginUri)) {
                    sessionStorage.removeItem("intastellar_pending_" + tokenRef);
                    fail("Sign-in is misconfigured for this site (invalid redirect target).");
                    return;
                }

                const existingQuery = window.location.href.indexOf("?") > -1 ? "?" + window.location.href.split("?")[1] + "&" : "?";
                window.location.href = window.location.protocol + "//" + resolvedLoginUri + existingQuery + "intastellar_token_ref=" + tokenRef;
            }).catch(() => {
                fail("We couldn't sign you in. Please try again.");
            });
        }

        window.addEventListener("message", onMessage);
        cleanupRef.current = () => {
            clearInterval(checkClosed);
            window.removeEventListener("message", onMessage);
        };
    }, [clientId, appName, scope, loginUri, onSuccess, cookieDomain]);

    return { status, errorMessage, signIn, clearError: () => setErrorMessage(null) };
}

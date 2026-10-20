import { useEffect, useRef, useState } from "react";
import { getCookie, useIntastellarSignIn } from "../useIntastellarSignIn";

const INTASTELLAR_LOGO_SRC = "https://www.intastellarsolutions.com/assets/logos/intastellar-new-planet.svg";

function useInjectedStylesheet() {
    useEffect(() => {
        if (document.head.querySelector('link[data-intastellar-signin-stylesheet="true"]')) {
            return;
        }
        const styleSheet = document.createElement("link");
        styleSheet.rel = "stylesheet";
        styleSheet.dataset.intastellarSigninStylesheet = "true";
        styleSheet.href = "https://account.api.intastellarsolutions.com/v1/insign/style.css";
        if (window.location.hostname === "localhost" || window.location.href.indexOf("127.0.0") > -1) {
            styleSheet.href = "/v1/insign/style.css";
        }
        document.head.appendChild(styleSheet);
    }, []);
}

function usePrefersDarkScheme(explicitTheme) {
    const [prefersDark, setPrefersDark] = useState(() => window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false);

    useEffect(() => {
        if (explicitTheme != null || !window.matchMedia) {
            return;
        }
        const mq = window.matchMedia("(prefers-color-scheme: dark)");
        const onChange = (e) => setPrefersDark(e.matches);
        mq.addEventListener?.("change", onChange);
        return () => mq.removeEventListener?.("change", onChange);
    }, [explicitTheme]);

    return explicitTheme === "dark" || (explicitTheme == null && prefersDark);
}

/**
 * React port of the "Sign in with Intastellar" button, carrying the same
 * security/UX behavior as the hardened vanilla SDK:
 *   - postMessage origin check, OAuth `state`, centered + non-leaking popup
 *   - no token/account data ever placed in the URL
 *   - open-redirect guard on `loginUri`
 *   - busy/disabled state, inline error banner, backdrop click + Escape to
 *     close, focus trap + focus restore, session-check skeleton, auto dark
 *     mode with live updates
 *
 * Unlike the vanilla widget, config is passed directly as props rather than
 * scraped from global `data-*` attributes, so multiple buttons on one page
 * can't collide with each other's configuration.
 */
export default function IntastellarSignInButton({
    clientId,
    appName,
    scope = "profile",
    loginUri,
    onSuccess,
    cookieDomain = "host",
    picker = "button",
    type = "signin",
    theme,
    className,
}) {
    useInjectedStylesheet();
    const isDark = usePrefersDarkScheme(theme);
    const { status, errorMessage, signIn, clearError } = useIntastellarSignIn({
        clientId,
        appName,
        scope,
        loginUri,
        onSuccess,
        cookieDomain,
    });

    const [isOpen, setIsOpen] = useState(false);
    const [isRevealed, setIsRevealed] = useState(false);
    const [hasExistingSession, setHasExistingSession] = useState(() => picker === "popup" && getCookie("inta_acc") != null);
    const [user, setUser] = useState(null);

    const popupRef = useRef(null);
    const triggerRef = useRef(null);
    const closeButtonRef = useRef(null);
    const lastFocusedRef = useRef(null);

    const isBusy = status === "loading";

    const openPanel = () => {
        lastFocusedRef.current = document.activeElement;
        setIsOpen(true);
    };

    const closePanel = () => {
        setIsOpen(false);
        setIsRevealed(false);
        clearError();
        if (picker === "popup") {
            // Remember the dismissal (mirrors closeSignIn()'s inta_state
            // cookie) so the auto-opening panel doesn't reappear on every
            // page load for a user who already closed it.
            const expires = new Date();
            expires.setFullYear(expires.getFullYear() + 2);
            const isSecure = window.location.protocol === "https:" || window.location.hostname === "localhost";
            document.cookie = `inta_state=1; expires=${expires.toUTCString()}; path=/; SameSite=Lax${isSecure ? "; Secure" : ""}`;
        }
        if (lastFocusedRef.current != null && typeof lastFocusedRef.current.focus === "function") {
            lastFocusedRef.current.focus();
        }
        lastFocusedRef.current = null;
    };

    // Open on mount for "popup" mode, unless the user already has a session
    // or already dismissed it -- same rule as the vanilla widget, but not
    // gated on any container element existing (there's no equivalent
    // failure mode in React: the panel only renders if this component does).
    useEffect(() => {
        if (picker !== "popup") {
            return;
        }
        if (getCookie("inta_acc") == null && getCookie("inta_state") !== "1") {
            openPanel();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [picker]);

    // Wait a frame before animating position: toggling visibility and a
    // transform in the same tick can get coalesced into one paint, which
    // skips the CSS transition entirely.
    useEffect(() => {
        if (!isOpen) {
            return;
        }
        let raf2 = null;
        const raf1 = requestAnimationFrame(() => {
            raf2 = requestAnimationFrame(() => {
                setIsRevealed(true);
                closeButtonRef.current?.focus();
            });
        });
        return () => {
            cancelAnimationFrame(raf1);
            if (raf2 != null) {
                cancelAnimationFrame(raf2);
            }
        };
    }, [isOpen]);

    // Escape closes the panel, Tab is trapped inside it while open.
    useEffect(() => {
        if (!isOpen) {
            return;
        }
        const onKeyDown = (e) => {
            if (e.key === "Escape") {
                closePanel();
                return;
            }
            if (e.key !== "Tab" || popupRef.current == null) {
                return;
            }
            const focusable = popupRef.current.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (focusable.length === 0) {
                return;
            }
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        };
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    // Session-check: only personalizes in "popup" mode, matching the vanilla
    // widget's current behavior (plain-button mode never shows "Signed in
    // as X" either).
    useEffect(() => {
        if (picker !== "popup") {
            return;
        }
        let cancelled = false;
        fetch(`https://apis.intastellaraccounts.com/usercontent/js/getuser?origin=${window.location.host}`, {
            method: "GET",
            credentials: "include",
            mode: "cors",
            headers: { "Content-Type": "application/json" },
        }).then((r) => r.json()).then((data) => {
            if (cancelled) return;
            setHasExistingSession(false);
            if (data.user) {
                setUser(data.user);
            }
        }).catch(() => {
            if (cancelled) return;
            setHasExistingSession(false);
        });
        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [picker]);

    const handleTriggerClick = () => {
        if (window.innerWidth > 768) {
            signIn();
        } else {
            openPanel();
        }
    };

    const titleLabel = type === "signup" ? "Sign up with Intastellar" : "Sign in with Intastellar";
    const continueLabel = user != null ? `Continue as ${user.name.first}` : "Continue with Intastellar";

    const triggerButton = (
        <button
            ref={triggerRef}
            type="button"
            className={["IntastellarSignin", isDark ? "dark" : "", className || ""].filter(Boolean).join(" ")}
            disabled={isBusy}
            aria-busy={isBusy || undefined}
            onClick={handleTriggerClick}
        >
            <img alt="Intastellar logo" src={INTASTELLAR_LOGO_SRC} className="intastellar-logo" />
            <div className="intastellarSignIn-info">
                {hasExistingSession ? (
                    <span className="intastellar-skeleton" aria-hidden="true" />
                ) : isBusy ? "Signing in…" : user != null ? (
                    <>
                        Sign in as {user.name.first}
                        <span className="email">{user.email}</span>
                    </>
                ) : titleLabel}
            </div>
        </button>
    );

    const panel = (
        <div
            className={["intastellar-popup-shadow", picker === "popup" ? "top-left" : ""].filter(Boolean).join(" ")}
            style={{ visibility: isOpen ? "visible" : "hidden" }}
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    closePanel();
                }
            }}
        >
            <div
                ref={popupRef}
                tabIndex={-1}
                className={[
                    "intastellar-popup",
                    isDark ? "dark" : "",
                    picker === "popup" ? "top-left" : "",
                ].filter(Boolean).join(" ")}
                style={
                    picker !== "popup"
                        ? (window.innerWidth <= 768
                            ? { bottom: isRevealed ? "0" : "-100%" }
                            : { right: isRevealed ? "0" : "-100%" })
                        : undefined
                }
            >
                <header className="mobile-header desktop-hide">
                    <img src={INTASTELLAR_LOGO_SRC} className="logo" alt="Intastellar logo" />
                    <p className="header-info">Sign into {appName} with Intastellar</p>
                    <button ref={closeButtonRef} type="button" className="close-popup" onClick={closePanel} aria-label="Close">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#5f6368" width="24" height="24">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                        </svg>
                    </button>
                </header>

                <div className="intastellar-popup-content">
                    {errorMessage != null && (
                        <p className="intastellar-popup-error" role="alert">
                            {errorMessage}
                        </p>
                    )}

                    <div className="intastellar-popup-header">
                        <section>
                            <p className="intastellarSignIn-title">Sign into '{appName}' with your Intastellar Account</p>
                            <p className="intastellarSignIn-info">
                                You no longer need to remember your passwords. Logging in is quick, easy and secure.
                            </p>
                        </section>
                        {user != null && (
                            <>
                                <img src={user.image} className="intastellar-popup-userProfile" alt="user profile" />
                                <div className="intastellar-popup-header-info">
                                    <p className="intastellar-popup-userName">{user.name.first}</p>
                                    <p className="intastellar-popup-header-email">{user.email}</p>
                                </div>
                            </>
                        )}
                    </div>

                    <button
                        type="button"
                        className="intastellar-popup-button"
                        disabled={isBusy}
                        aria-busy={isBusy || undefined}
                        onClick={() => signIn(user?.email)}
                    >
                        {isBusy ? "Signing in…" : continueLabel}
                    </button>
                    <p className="intastellar-popup-footer">
                        To create your account, Intastellar will share your name, email and profile picture with {appName}.
                    </p>
                </div>
            </div>
        </div>
    );

    return (
        <>
            {picker !== "popup" && triggerButton}
            {panel}
        </>
    );
}

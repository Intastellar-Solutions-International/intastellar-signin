const intastellarLogoSrc="https://www.intastellarsolutions.com/assets/icons/fav/android-icon-192x192.png";class IntastellarAccounts{constructor(){this.IntastellarAPIroot="https://apis.intastellaraccounts.com",this.IntastellarAPILoginRoot="https://www.intastellaraccounts.com"}LogUserIn(){this.IntastellarAPILoginRoot}LogUserOut(){}getPublicData(){}}function signin(){const t=document.querySelector("[data-login_uri]").getAttribute("data-login_uri"),e=document.querySelector("[data-app-name]").getAttribute("data-app-name"),n=document.querySelector("[data-client_id]").getAttribute("data-client_id"),a=window.open("https://www.intastellaraccounts.com/signin/v2/ws/oauth/oauthchooser?service="+e+"&continue="+t+"&entryFlow="+window.btoa(t)+"&key="+n+"&passive=true&flowName=WebSignin&Entry=webauthsignin","popUpWindow","height=719,width=500,left=100,top=100,resizable=no");window.addEventListener("message",(function(e){const n=e.data;document.cookie="c_name="+JSON.parse(window.atob(e.data)).user_id+"; expire=; domain="+window.location.host,a.postMessage("success",e.origin),window.location.href="http://"+t+"?token="+n}))}function checkUserLogin(){fetch("https://apis.intastellaraccounts.com/usercontent/js/getuser.php",{method:"GET",credentials:"include"}).then((t=>t.json())).then((t=>{if(200==t.status){const e=t.data,n=document.querySelector(".intastellarSignin"),a=document.querySelector(".intastellarSignIn-info");n.innerHTML+="<img src='"+e.image+"'>",a.innerHTML="Continue as "+e.name}})).catch((t=>{console.log(t)}))}const Intastellar={accounts:{id:{renderButton(t,e={}){const n=document.createElement("button"),a=document.createElement("div");a.setAttribute("class","intastellarSignIn-info"),a.innerHTML="Sign in with Intastellar",n.setAttribute("class","IntastellarSignin");const o=document.createElement("img");o.setAttribute("src",intastellarLogoSrc),o.setAttribute("class","intastellar-logo"),n.appendChild(o),n.appendChild(a),null==t&&null==t||(t.appendChild(n),n.addEventListener("click",signin))}}}};
"use strict";function initAP(){if(hasCoreFeaturesSupport())return void showErrorMsg("🙈","",'Your web browser does not support core audio player features.<br><a href="http://outdatedbrowser.com/en" target="_blank">Please update your web browser.</a>');hasAppearanceIusses()&&showWarningMsg("For better viewing, try a different web browser."),marqueeEl(document.querySelector(el.trackTitle))}function hasCoreFeaturesSupport(){return!!(!Modernizr.audio&&Modernizr.json&&Modernizr.svg&&Modernizr.csscalc&&Modernizr.flexbox)}function hasAppearanceIusses(){return!Modernizr.canvas||(!Modernizr.cssanimations||(!Modernizr.bgsizecover||!Modernizr.objectfit))}function marqueeEl(e){if(e.offsetWidth<e.scrollWidth)var r=15500,t=5e3,n=window.setInterval(function(){e.parentNode.classList.add("marquee"),e.style.width=e.scrollWidth+"px",e.classList.remove("fadeIn"),window.clearInterval(n);var r=window.setTimeout(function(){e.style.width="initial",e.classList.add("fadeIn"),e.parentNode.classList.remove("marquee"),window.clearTimeout(r),marqueeEl(e)},15500)},5e3)}function showWarningMsg(e){var r=document.querySelector(el.warningMsg),t=6e3,n=1e3;r.innerHTML=e,r.style.display="block",r.classList.add("fadeIn"),window.setTimeout(function(){r.classList.remove("fadeIn"),r.classList.add("fadeOut"),window.setTimeout(function(){r.style.display="none",r.innerHTML=""},1e3)},6e3)}function showErrorMsg(e,r,t){var n=document.querySelector(el.splash),o=document.querySelector(el.main),a=document.querySelector(el.errorMsg),s=a.querySelector(".icon"),i=a.querySelector(".title"),d=a.querySelector(".body");s.innerHTML=e,i.innerHTML=r,d.innerHTML=t,n.style.display="none",o.style.display="none",a.style.display="flex",a.classList.add("fadeIn")}/*
 * Audio Player
 *
 * @author: Ethan Lin
 * @url: https://github.com/oel-mediateam/audioplayer
 * @version: 2.0.0
 *
 * @license: The MIT License (MIT)
 * Copyright (c) 2014 - 2018 Media Serivces
 *
 */
!function e(r){(document.attachEvent?"complete"===document.readyState:"loading"!==document.readyState)?r():document.addEventListener("DOMContentLoaded",r)}(initAP);var el={splash:"#ap-splash",main:"#ap-main",trackTitle:".track-info .title-wrapper .title",warningMsg:".body .warning-msg",errorMsg:"#ap-error"};
//# sourceMappingURL=./audio.js.map
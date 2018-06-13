"use strict";function initAP(){marqueeEl(document.querySelectorAll(".track-info .title-wrapper .title")[0])}function marqueeEl(e){if(e.offsetWidth<e.scrollWidth)var t=15500,n=5e3,a=window.setInterval(function(){e.parentNode.classList.add("marquee"),window.clearInterval(a);var t=window.setTimeout(function(){e.parentNode.classList.remove("marquee"),window.clearTimeout(t),marqueeEl(e)},15500)},5e3)}/*
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
!function e(t){(document.attachEvent?"complete"===document.readyState:"loading"!==document.readyState)?t():document.addEventListener("DOMContentLoaded",t)}(initAP);
//# sourceMappingURL=./audio.js.map
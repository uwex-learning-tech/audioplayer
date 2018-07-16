/*
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
"use strict";function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var _createClass=function(){function e(e,t){for(var a=0;a<t.length;a++){var r=t[a];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,a,r){return a&&e(t.prototype,a),r&&e(t,r),t}}(),APlayer=function(){function e(){_classCallCheck(this,e),this.el={splash:"#ap-splash",splashTitle:"#ap-splash .cover-info .title",splashSubtitle:"#ap-splash .cover-info .subtitle",splashAuthor:"#ap-splash .cover-info .author",splashLength:"#ap-splash .cover-info .length",startBtn:"#ap-start-btn",resumeBtn:"#ap-resume-btn",dwnldBtn:"#ap-dwnld-btn",dwnldBtnMenu:"#ap-dwnld-btn .dropdown-content",main:"#ap-main",mainBody:"#ap-main .body",showProfileBtn:"#show-profile",closeProfileBtn:"#author-close-btn",profileDisplay:"#author-overlay",profileDisplayContent:"#author-overlay .content",profileDisplaySpinner:"#author-overlay .spinner",currentPic:".head .track-img button",trackTitle:".track-info .title-wrapper .title",trackAuthor:".track-info .author",currentTrackNum:".track-info .meta .current",totalTracks:".track-info .meta .total",miniDisplay:".track-list .minimized-display",upNextTrack:".track-list .minimized-display .ap_up_next_title",trackList:".track-list .tracks",expandTracksBtn:".track-list .expand-btn",ccSpecDisplay:".body .cc-spec-display",spectrumDisplay:".body .cc-spec-display .spectrum",captionDisplay:".body .cc-spec-display .caption",bodyControls:".body .controls",ccToggle:"#cc-toggle",spectrumToggle:"#spectrum-toggle",warning:".body .warning-msg",error:"#ap-error",errorIcon:"#ap-error .icon",errorTitle:"#ap-error .title",errorBody:"#ap-error .body",playerId:"#player",copyright:".copyright p",player:null},this.manifest={},this.album={url:"assets/album.xml",program:{},downloads:[]},this.player=null,this.reference={names:this._parseUri(window.location.href),params:new URLSearchParams(window.location.search)},this.getManifest()}return _createClass(e,[{key:"getManifest",value:function e(){var t=this,a=t._selector("#ap-manifest").getAttribute("href");t._requestFile(a,function(e){t.manifest=JSON.parse(e.response),0===t.manifest.ap_root_directory.length&&(t.manifest.ap_root_directory="source/"),t.setUIs()})}},{key:"setUIs",value:function e(){var t=this,a=t.manifest.ap_root_directory+"script/templates/apui.tpl";t._requestFile(a,function(e){var a=t._selector("body"),r=e.response.replace(/\{([source)]+)\}/gi,t.manifest.ap_root_directory);a.innerHTML+=r,t.getAlbum(),t._checkSupport(),t._setStartResumeListeners(),t._expandDownloadBtnMenu(),t._CCSpectrumDisplays(),t._expandTracksToggle(),t._setShowProfileListener()})}},{key:"_expandDownloadBtnMenu",value:function e(){var t=this,a=t._selector(t.el.dwnldBtn),r=a.querySelector("button"),s=t._selector(t.el.dwnldBtnMenu);a.addEventListener("mouseenter",function(){r.setAttribute("aria-expanded",!0),s.setAttribute("aria-expanded",!0)}),a.addEventListener("mouseleave",function(){r.setAttribute("aria-expanded",!1),s.setAttribute("aria-expanded",!1)})}},{key:"_setStartResumeListeners",value:function e(){var t=this,a=0,r=t._selector(t.el.startBtn),s=t._selector(t.el.resumeBtn);r.addEventListener("click",function(){t.hideSplash(),t.setTrack(0)}),s.addEventListener("click",function(){t.hideSplash(),t.setTrack(0)})}},{key:"getAlbum",value:function e(){var t=this;t._requestFile(t.album.url,function(e){var a=e.responseXML,r=t._xmlSelector(a,"album"),s=t._xmlSelector(a,"setup"),i=t._xmlSelector(a,"track",!0);t.album.settings={},t.album.settings.accent=r.getAttribute("accent"),t.album.settings.splashFormat=r.getAttribute("splashImgFormat"),t.album.settings.analytics=r.getAttribute("analytics"),t.album.settings.version=r.getAttribute("xmlVersion"),t.album.title=t._xmlSelector(s,"title").textContent,t.album.subtitle=t._xmlSelector(s,"subtitle").textContent,t.album.author=t._xmlSelector(s,"author").getAttribute("name"),t.album.authorProfile=t._xmlSelector(s,"author").textContent,t.album.length=t._xmlSelector(s,"length").textContent,t._isEmpty(s.getAttribute("program"))?void 0!==t.reference.names[3]&&(t.album.program.name=t.reference.names[3]):t.album.program.name=s.getAttribute("program"),t._isEmpty(s.getAttribute("course"))||(t.album.program.course=s.getAttribute("course")),t.album.tracks=[],Array.prototype.forEach.call(i,function(e){var a={};a.img=e.getAttribute("img"),a.src=e.getAttribute("src"),a.title=e.querySelector("title").innerHTML,a.author=e.querySelector("author").getAttribute("name"),a.authorProfile=e.querySelector("author").innerHTML,t.album.tracks.push(a)}),console.log(t.album),t.setData(),t._setupAudioPlayer()})}},{key:"setTrack",value:function e(t){var a=this,r=a._selector(a.el.trackTitle);r.innerHTML=a.album.tracks[t].title;var s=a._selector(a.el.trackAuthor);a._isEmpty(a.album.tracks[t].author)?s.innerHTML=a.album.author:s.innerHTML=a.album.tracks[t].author;var i=a._selector(a.el.currentPic),l=a.manifest.ap_author_directory+a._sanitize(s.innerHTML)+".jpg",n=new Image;if(n.src=a.manifest.ap_root_directory+"images/pic.png",a._fileExists(l,function(e){e&&(n.src=l)}),a._isEmpty(a.album.tracks[t].img)||(n.src="assets/images/"+a.album.tracks[t].img),i.appendChild(n),a.album.tracks.length>1){a._selector(a.el.currentTrackNum).innerHTML=t+1;a._selector(a.el.totalTracks).innerHTML=a.album.tracks.length}var o=a._selector(a.el.upNextTrack);t<a.album.tracks.length&&(o.innerHTML=a.album.tracks[t+1].title),a.player.ready&&(a.player.source={type:"audio",title:a.album.tracks[t].title,sources:[{src:"assets/audio/"+a.album.tracks[0].src,type:"audio/mp3"}]},a.player.once("canplay",function(){a.player.togglePlay()})),a._marqueeEl(r)}},{key:"setData",value:function e(){var t=this;this._selector("title").innerHTML=this.album.title;var a=this._selector(this.el.splashTitle),r=this._selector(this.el.splashSubtitle),s=this._selector(this.el.splashAuthor),i=this._selector(this.el.splashLength);a.innerHTML=this.album.title,r.innerHTML=this.album.subtitle,s.innerHTML=this.album.author,i.innerHTML=this.album.length;var l=t.reference.names;if(l=0===l.length?"album":t.reference.names[t.reference.names.length-1],Array.prototype.forEach.call(this.manifest.ap_download_files,function(e){var a=l+"."+e.format;t._fileExists(a,function(r){if(r){var s=document.createElement("a");s.href=a,s.setAttribute("download",a),s.setAttribute("role","menuitem"),s.innerHTML=e.label;t._selector(t.el.dwnldBtnMenu).appendChild(s);var i=t._selector(t.el.dwnldBtn);i.setAttribute("aria-hidden",!1),i.style.display="block";var l={name:e.label,url:a};t.album.downloads.push(l)}})}),!this._isEmpty(this.album.program.name)){var n=this.manifest.ap_splash_directory+this.album.program.name+"/default."+this.album.settings.splashFormat;this._isEmpty(t.album.program.course)||(n=this.manifest.ap_splash_directory+this.album.program.name+"/"+this.album.program.course+"."+this.album.settings.splashFormat),this._fileExists(n,function(e){if(e){var a=t._selector(t.el.splash),r=t._selector("head"),s='url("'+n+'")';a.style.backgroundImage=s;var i=document.createElement("style");i.setAttribute("type","text/css"),i.innerHTML="#ap-main:before{background-image: "+s+" !important;}",r.appendChild(i)}})}if(!this._isEmpty(t.album.settings.accent)){var o=this.manifest.ap_root_directory+"script/templates/accent_css.tpl";this._requestFile(o,function(e){var a=e.response.replace(/\{([accent)]+)\}/gi,t.album.settings.accent),r=t._selector("head"),s=document.createElement("style");s.setAttribute("type","text/css"),s.innerHTML=a,r.appendChild(s)})}if(this.album.tracks.length>1){var c=this._selector(this.el.trackList);Array.prototype.forEach.call(this.album.tracks,function(e,t){var a=document.createElement("li"),r=document.createElement("a");r.href="javascript:void(0);",r.setAttribute("data-src",e.src),r.setAttribute("data-author",e.author),r.setAttribute("data-img",e.img);var s=document.createElement("span");s.classList.add("track-num"),s.innerHTML=t+1+". ";var i=document.createElement("span");i.classList.add("track-title-wrapper");var l=document.createElement("span");l.classList.add("track-title"),l.innerHTML=e.title,i.appendChild(l),r.appendChild(s),r.appendChild(i),a.appendChild(r),c.appendChild(a)})}else this._selector(this.el.main).classList.add("single");var u=this._selector(this.el.copyright),p=new Date,d=p.getFullYear();u.innerHTML+="&copy; "+d+". "+this.manifest.ap_copyright,this._setProgram()}},{key:"_setupAudioPlayer",value:function e(){var t=this,a=t.manifest.ap_root_directory+"script/templates/single_plyr_controls.tpl";t.album.tracks.length>1&&(a=t.manifest.ap_root_directory+"script/templates/full_plyr_controls.tpl"),t._requestFile(a,function(e){var a=e.response.replace(/\{([source)]+)\}/gi,t.manifest.ap_root_directory);t.el.player=new Plyr(t.el.playerId,{controls:a,autoplay:!1,volume:.8,clickToPlay:!1,fullscreen:{enabled:!1,fallback:!1,iosNative:!1}}),t.el.player.on("ready",function(e){t.player=e.detail.plyr;for(var a=t._selector("#ap-playpause"),r=t._selector("#ap-muteunmute"),s=t._selector("#ap-loop"),i=t._selector("#ap-playbackRate"),l=0;l<i.options.length;l++)if(Number(i.options[l].value)===t.player.speed){i.selectedIndex=l;break}t.player.on("playing",function(){a.classList.add("plyr__control--pressed")}),t.player.on("pause",function(){a.classList.remove("plyr__control--pressed")}),t.player.on("ended",function(){!1===t.player.loop&&(a.classList.contains("plyr__control--pressed")&&a.classList.add("plyr__control--pressed"),t.player.restart())}),s.addEventListener("click",function(){!1===t.player.loop?(t.player.loop=!0,s.classList.add("active")):(t.player.loop=!1,s.classList.remove("active"))}),i.addEventListener("change",function(e){t.player.speed=Number(e.target.options[e.target.selectedIndex].value)}),r.addEventListener("click",function(e){e.target.classList.contains("plyr__control--pressed")?e.target.classList.remove("plyr__control--pressed"):e.target.classList.add("plyr__control--pressed")})})})}},{key:"_setProgram",value:function e(){var t=this;t.manifest.ap_custom_themes&&(t.album.program=t.manifest.ap_custom_themes.find(function(e){return e.name===t.album.program.name}),void 0===t.album.program&&(t.album.program=t.manifest.ap_custom_themes.find(function(e){return e.name===t.manifest.ap_logo_default})));var a=t._selector(".program-theme");t.album.program.colors.forEach(function(e){var t=document.createElement("span");t.style.backgroundColor=e,a.appendChild(t)})}},{key:"_checkSupport",value:function e(){if(this.hasCoreFeaturesSupport())return void this.showError("🙈","",'Your web browser does not support core audio player features.<br><a href="http://outdatedbrowser.com/en" target="_blank">Please update your web browser.</a>');this.hasAppearanceIusses()&&this.showWarning("For better viewing, try a different web browser.")}},{key:"hasCoreFeaturesSupport",value:function e(){return!!(!Modernizr.audio&&Modernizr.json&&Modernizr.svg&&Modernizr.csscalc&&Modernizr.flexbox)}},{key:"hasAppearanceIusses",value:function e(){return!Modernizr.canvas||(!Modernizr.cssanimations||(!Modernizr.bgsizecover||!Modernizr.objectfit))}},{key:"showError",value:function e(t,a,r){var s=this._selector(this.el.splash),i=this._selector(this.el.main),l=this._selector(this.el.error),n=this._selector(this.el.errorIcon),o=this._selector(this.el.errorTitle),c=this._selector(this.el.errorBody),u=document.createAttribute("aria-hidden");u.value=!1,n.innerHTML=t,o.innerHTML=a,c.innerHTML=r,s.style.display="none",i.style.display="none",l.style.display="flex",l.setAttributeNode(u),this._fadeIn(l)}},{key:"showWarning",value:function e(t){var a=this,r=a._selector(a.el.warning),s=6e3;r.innerHTML=t,r.style.display="block",a._fadeIn(r),window.setTimeout(function(){a._fadeOut(r,function(){r.innerHTML="",r.style.display="none"})},6e3)}},{key:"hideSplash",value:function e(){var t=this._selector(this.el.splash),a=document.createAttribute("aria-hidden");a.value=!0,t.classList.add("hide-splash"),t.setAttributeNode(a)}},{key:"showProfile",value:function e(){var t=this,a=this._selector(this.el.profileDisplay),r=this._selector(this.el.closeProfileBtn),s=t.album.author,i=t.album.authorProfile,l=Number(t._selector(t.el.currentTrackNum).innerHTML)-1;if(t._isEmpty(t.album.tracks[l].author)||(s=t.album.tracks[l].author,i=t.album.tracks[l].authorProfile),t._isEmpty(i)){var n=t.manifest.ap_author_directory+t._sanitize(s)+".json?callback=author";(function(){var e={},a=t._selector(t.el.profileDisplaySpinner);return e.send=function(e,t){a.classList.add("spin");var r=t.callbackName||"callback",s=t.onSuccess||function(){},i=t.onTimeout||function(){},l=t.timeout||10,n=window.setTimeout(function(){window[r]=function(){},a.classList.remove("spin"),i()},1e3*l);window[r]=function(e){window.clearTimeout(n),a.classList.remove("spin"),s(e)};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=e,document.getElementsByTagName("head")[0].appendChild(o)},e})().send(n,{callbackName:"author",onSuccess:function e(a){t._setProfile(a.name,a.profile)},onTimeout:function e(){t._setProfile(s,i)},timeout:5})}else t._setProfile(s,i);a.style.display="block",this._fadeIn(a),r.addEventListener("click",function(){t.closeProfile()},{once:!0})}},{key:"_setProfile",value:function e(t,a){var r=this._selector(this.el.profileDisplayContent),s=document.createElement("h4");s.innerHTML=t;var i=document.createElement("div");i.innerHTML=a,r.appendChild(s),r.appendChild(i)}},{key:"closeProfile",value:function e(){var t=this._selector(this.el.profileDisplay),a=this._selector(this.el.profileDisplayContent);this._fadeOut(t,function(){t.style.display="",a.innerHTML=""})}},{key:"_setShowProfileListener",value:function e(){var t=this;this._selector(this.el.showProfileBtn).addEventListener("click",function(){t.showProfile()})}},{key:"_expandTracksToggle",value:function e(){var t=this,a=t._selector(this.el.expandTracksBtn);a.addEventListener("click",function(){var e=t._selector(t.el.trackList),r=t._selector(t.el.miniDisplay);if("none"==e.style.display||""==e.style.display){e.style.display="block",r.style.display="none",t._hideCCSpectrum(),t._slideDown(a.parentNode,function(){a.classList.add("rotate"),e.style.setProperty("overflow-y","auto")});var s=document.querySelectorAll(t.el.trackList+" .track-title-wrapper .track-title");Array.prototype.forEach.call(s,function(e){t._marqueeEl(e)})}else e.style.display="none",e.style.setProperty("overflow-y","hidden"),r.style.display="flex",t._slideUp(a.parentNode,function(){a.classList.remove("rotate"),t._CCSpectrumDisplays()})})}},{key:"toggleCC",value:function e(){var t=this._selector(this.el.captionDisplay),a=this._selector(this.el.spectrumDisplay),r=this._selector(this.el.ccToggle),s=this._selector(this.el.spectrumToggle);r.classList.add("disabled"),s.classList.remove("disabled"),t.classList.add("active"),a.classList.remove("active")}},{key:"toggleSpectrum",value:function e(){var t=this._selector(this.el.captionDisplay),a=this._selector(this.el.spectrumDisplay),r=this._selector(this.el.ccToggle);this._selector(this.el.spectrumToggle).classList.add("disabled"),r.classList.remove("disabled"),a.classList.add("active"),t.classList.remove("active")}},{key:"_CCSpectrumDisplays",value:function e(){var t=this,a=this._selector(this.el.bodyControls),r=this._selector(this.el.ccSpecDisplay),s=this._selector(this.el.ccToggle),i=this._selector(this.el.spectrumToggle);"none"===a.style.display?(a.style.display="",r.style.display=""):t.toggleCC(),s.addEventListener("click",function(){t.toggleCC()}),i.addEventListener("click",function(){t.toggleSpectrum()})}},{key:"_hideCCSpectrum",value:function e(){var t=this._selector(this.el.ccSpecDisplay);this._selector(this.el.bodyControls).style.display="none",t.style.display="none"}},{key:"_selector",value:function e(t){return document.querySelector(t)}},{key:"_xmlSelector",value:function e(t,a,r){return r="boolean"==typeof r&&r,r?t.querySelectorAll(a):t.querySelector(a)}},{key:"_sanitize",value:function e(t){return t.replace(/[^\w]/gi,"").toLowerCase()}},{key:"_isEmpty",value:function e(t){return"string"==typeof t&&""===t.trim()||(void 0===t||null===t)}},{key:"_requestFile",value:function e(t,a){var r=this,s=r._selector("body"),i=new XMLHttpRequest;i.open("GET",t,!0),i.onload=function(){this.status>=200&&this.status<400?a(this):s.innerHTML+='<div class="error">Error '+this.status+" while loading <code>"+t+"</code></div>",i.abort()},i.onerror=function(){s.innerHTML+='<div class="error">Connection Error. Check your network.</div>'},i.send()}},{key:"_fileExists",value:function e(t,a){var r=new XMLHttpRequest,s=!1;r.open("HEAD",t,!0),r.onload=function(){s=this.status>=200&&this.status<400,a(s)},r.send()}},{key:"_cleanArray",value:function e(t){return t.forEach(function(e,a){""===e&&t.splice(a,1)}),/(\w*|(\w*\-\w*)*)\.\w*/gi.test(t[t.length-1])&&t.pop(),/(\w*|(\w*\-\w*)*)\:/gi.test(t[t.length-1])&&t.pop(),t}},{key:"_parseUri",value:function e(t){var a=t.split("?"),r=a[0];return r.lastIndexOf("/")!==r.length-1&&(r+="/"),this._cleanArray(r.split("/"))}},{key:"_marqueeEl",value:function e(t){var a=this;if(t.offsetWidth<t.scrollWidth)var r=15500,s=5e3,i=window.setInterval(function(){t.parentNode.classList.add("marquee"),t.style.width=t.scrollWidth+"px",window.clearInterval(i);var e=window.setTimeout(function(){t.style.width="initial",a._fadeIn(t),t.parentNode.classList.remove("marquee"),window.clearTimeout(e),a._marqueeEl(t)},15500)},5e3)}},{key:"_fadeIn",value:function e(t,a){t.classList.remove("fadeOut"),t.classList.add("fadeIn");var r=this._whichAnimationEvent();t.params={_event:r,_callback:a},t.addEventListener(r,this._fadeCallback)}},{key:"_fadeOut",value:function e(t,a){t.classList.remove("fadeIn"),t.classList.add("fadeOut");var r=this._whichAnimationEvent();t.params={_event:r,_callback:a},t.addEventListener(r,this._fadeCallback)}},{key:"_fadeCallback",value:function e(t){void 0!==t.target.params._callback&&"function"==typeof t.target.params._callback&&t.target.params._callback(),t.target.classList.remove("fadeIn"),t.target.classList.remove("fadeOut"),t.target.removeEventListener(t.target.params._event,this._fadeCallback)}},{key:"_slideDown",value:function e(t,a){t.classList.add("slideDown"),t.classList.remove("slideUp");var r=this._whichAnimationEvent();t.params={_event:r,_callback:a},t.addEventListener(r,this._slideCallback)}},{key:"_slideUp",value:function e(t,a){t.classList.add("slideUp"),t.classList.remove("slideDown");var r=this._whichAnimationEvent();t.params={_event:r,_callback:a},t.addEventListener(r,this._slideCallback)}},{key:"_slideCallback",value:function e(t){void 0!==t.target.params._callback&&"function"==typeof t.target.params._callback&&t.target.params._callback(),t.target.removeEventListener(t.target.params._event,this._slideCallback)}},{key:"_whichAnimationEvent",value:function e(){var t=void 0,a=document.createElement("fakeelement"),r={animation:"animationend",OAnimation:"oAnimationEnd",MozAnimation:"animationend",WebkitAnimation:"webkitAnimationEnd"};for(t in r)if(void 0!==a.style[t])return r[t]}}]),e}();!function e(t){(document.attachEvent?"complete"===document.readyState:"loading"!==document.readyState)?t():document.addEventListener("DOMContentLoaded",t)}(function(){new APlayer});
//# sourceMappingURL=./audio.js.map
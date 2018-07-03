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

'use strict';

class APlayer {
    
    constructor() {
        
        this.el = {
            splash: '#ap-splash',
            main: '#ap-main',
            showProfileBtn: '#show-profile',
            closeProfileBtn: '#author-close-btn',
            profileDisplay: '#author-overlay',
            trackTitle: '.track-info .title-wrapper .title',
            miniDisplay: '.track-list .minimized-display',
            trackList: '.track-list .tracks',
            expandTracksBtn: '.track-list .expand-btn',
            ccSpecDisplay: '.body .cc-spec-display',
            spectrumDisplay: '.body .cc-spec-display .spectrum',
            captionDisplay: '.body .cc-spec-display .caption',
            bodyControls: '.body .controls',
            ccToggle: '#cc-toggle',
            spectrumToggle: '#spectrum-toggle',
            warning: '.body .warning-msg',
            error: '#ap-error',
            errorIcon: '#ap-error .icon',
            errorTitle: '#ap-error .title',
            errorBody: '#ap-error .body',
            playerId: '#player',
            copyright: '.copyright p',
            player: null
        };
        
        this.manifest ={};
        this.album = {};
        this.program = {};
        this.reference = {
            names: window.location.href,
            params: new URLSearchParams( window.location.search )
        };
        
    }
         
    go() {
        
        let self = this;
        
        if ( self.hasCoreFeaturesSupport() ) {
        
            self.showError( '🙈', '', 'Your web browser does not support core audio player features.<br><a href="http://outdatedbrowser.com/en" target="_blank">Please update your web browser.</a>' );
            return;
            
        }
        
        if ( self.hasAppearanceIusses() ) {
        
            self.showWarning( 'For better viewing, try a different web browser.' );
            
        }
        
        self.getManifest();
        
    }
    
    hasCoreFeaturesSupport() {
    
        if ( !Modernizr.audio && Modernizr.json && Modernizr.svg
             && Modernizr.csscalc && Modernizr.flexbox ) {
            return true;
        }
        
        return false;
        
    }
    
    hasAppearanceIusses() {
    
        if ( !Modernizr.canvas ) {
            return true;
        }
        
        if ( !Modernizr.cssanimations ) {
            return true;
        }
        
        if ( !Modernizr.bgsizecover ) {
            return true
        }
        
        if ( !Modernizr.objectfit ) {
            return true
        }
        
        return false;
        
    }
    
    showError( iconStr, titleStr, bodyStr ) {
    
        let splash = this._selector( this.el.splash );
        let main = this._selector( this.el.main );
        let error = this._selector( this.el.error );
        let icon = this._selector( this.el.errorIcon );
        let title = this._selector( this.el.errorTitle );
        let body = this._selector( this.el.errorBody );
        
        let ariaHidden = document.createAttribute( 'aria-hidden' );
        
        ariaHidden.value = false;
        
        icon.innerHTML = iconStr;
        title.innerHTML = titleStr;
        body.innerHTML = bodyStr;
        
        splash.style.display = 'none';
        main.style.display = 'none';
        
        error.style.display = 'flex';
        error.setAttributeNode( ariaHidden );
        
        this._fadeIn( error );
        
    }
    
    showWarning( str ) {
    
        let self = this;
        let warning = self._selector( self.el.warning );
        let hideTime = 6000;
        
        warning.innerHTML = str;
        warning.style.display = 'block';
        
        self._fadeIn( warning );
        
        window.setTimeout( function() {
            
            self._fadeOut( warning, function() {
                
                warning.innerHTML = '';
                warning.style.display = 'none';
                
            } );
            
        }, hideTime );
        
    }
    
    getManifest() {
        
        let self = this;
        let manifestUrl = self._selector( '#ap-manifest' ).getAttribute( 'href' );
        let request = new XMLHttpRequest();
        
        request.open( 'GET', manifestUrl, true );
        
        request.onload = function() {
            
            if ( this.status >= 200 && this.status < 400 ) {
                
                self.manifest = JSON.parse( this.response );
                self.getAlbum();
                
            } else {
                
                self.showError( '🤔', this.status, 'Something went wrong while loading manifest.' );
                
            }
            
        };
        
        request.onerror = function() {
            
            self.showError( '', 'Connection Error', 'Check your network.' );
            
        };
        
        request.send();
        
    }
    
    getAlbum() {
        
        this.setUIs();
        
    }
    
    _setProgram() {
        
        let self = this;
        
        if ( self.manifest.ap_custom_themes ) {
    
            self.program = self.manifest.ap_custom_themes.find( function ( obj ) {
                
                return obj.name === self.reference.names[3];
                
            } );
            
            if ( self.program === undefined ) {
                
                self.program = self.manifest.ap_custom_themes.find( function ( obj ) {
                    
                    return obj.name === self.manifest.ap_logo_default;
                    
                } );
                
            }
            
        }
        
        let decorationBar = self._selector( '.program-theme' );
    
        self.program.colors.forEach( function( hex ) {
                        
            let span = document.createElement( 'span' );
            span.style.backgroundColor = hex;
            decorationBar.appendChild( span );
            
        } );
        
    }
    
    setUIs() {
        
        let self = this;
        let trackTitle = self._selector( self.el.trackTitle );
        let copyright = self._selector( self.el.copyright );
        let date = new Date();
        let year = date.getFullYear();
        
        copyright.innerHTML += '&copy; ' + year + '. ' + self.manifest.ap_copyright;
        
        if ( self.manifest.ap_root_directory.length === 0 ) {
            
            self.manifest.ap_root_directory = 'source/';
            
        }
        
        this._setProgram();
        this._marqueeEl( trackTitle );
        this._CCSpectrumDisplays();
        this._expandTracksToggle();
        this._setShowProfileListener();
        this._setupAudioPlayer();
        
    }
    
    hideSplash() {
    
        let splash = this._selector( this.el.splash );
        let ariaHidden = document.createAttribute( 'aria-hidden' );
        
        ariaHidden.value = true;
        
        splash.classList.add( 'hide-splash' );
        splash.setAttributeNode( ariaHidden );
        
    }
    
    showProfile() {
        
        let self = this;
        let authorProfile = this._selector( this.el.profileDisplay );
        let closeBtn = this._selector( this.el.closeProfileBtn );
        
        authorProfile.style.display = 'block';
        this._fadeIn( authorProfile );
        
        closeBtn.addEventListener( 'click', function() {
            self.closeProfile();
        }, {once: true} );

    }
    
    closeProfile() {
        
        let authorProfile = this._selector( this.el.profileDisplay );
        
        this._fadeOut( authorProfile, function() {
            
            authorProfile.style.display = '';
            
        } );

    }
    
    _setShowProfileListener() {
        
        let self = this;
        let showProfileBtn = this._selector( this.el.showProfileBtn );
        
        showProfileBtn.addEventListener( 'click', function() {
            
            self.showProfile();
            
        } );
        
    }
    
    _expandTracksToggle() {
        
        let self = this;
        let expandTracksBtn = self._selector( this.el.expandTracksBtn );
        
        expandTracksBtn.addEventListener( 'click', function() {
            
            let trackList = self._selector( self.el.trackList );
            let minDisplay = self._selector( self.el.miniDisplay );
            
            if ( trackList.style.display == 'none' || trackList.style.display == '' ) {
                
                trackList.style.display = 'block';
                minDisplay.style.display = 'none';
                
                self._hideCCSpectrum();
                
                self._slideDown( expandTracksBtn.parentNode, function() {
                    
                    expandTracksBtn.classList.add( 'rotate' );
                    
                } );
                
            } else {
                
                trackList.style.display = 'none';
                minDisplay.style.display = 'flex';
                
                self._slideUp( expandTracksBtn.parentNode, function() {
                    
                    expandTracksBtn.classList.remove( 'rotate' );
                    self._CCSpectrumDisplays();
                    
                } );
                
            }
            
        } );
        
    }
    
    _setupAudioPlayer() {
        
        var self = this;
        
        const controls = `
        <div class="plyr__controls">
            
            <div class="top-controls">
            
                <div class="plyr__time plyr__time--current" aria-label="Current time">00:00</div>
                
                <div class="plyr__progress">
                    <input id="plyr-seek-{id}" data-plyr="seek" type="range" min="0" max="100" step="0.01" value="0" aria-label="Seek">
                    <progress class="plyr__progress__buffer" min="0" max="100" value="0" role="presentation" aria-hidden="true">% buffered</progress>
                    <span role="tooltip" class="plyr__tooltip">00:00</span>
                </div>
                
                <div class="plyr__time plyr__time--duration" aria-label="Duration">00:00</div>
            
            </div>
            
            <div class="middle-controls">
                
                <button type="button" class="plyr__control">
                    <svg role="presentation"><use xlink:href="` + self.manifest.ap_root_directory + `images/icons.svg#icon-previous"></use></svg>
                    <span class="plyr__tooltip" role="tooltip">Previous</span>
                </button>
                
                <button type="button" class="plyr__control" data-plyr="rewind">
                    <svg role="presentation"><use xlink:href="` + self.manifest.ap_root_directory + `images/icons.svg#icon-backward"></use></svg>
                    <span class="plyr__tooltip" role="tooltip">Rewind {seektime} secs</span>
                </button>
                
                <button type="button" id="ap-playpause" class="plyr__control" aria-label="Play, {title}" data-plyr="play">
                    <svg class="icon--pressed" role="presentation"><use xlink:href="` + self.manifest.ap_root_directory + `images/icons.svg#icon-pause"></use></svg>
                    <svg class="icon--not-pressed" role="presentation"><use xlink:href="` + self.manifest.ap_root_directory + `images/icons.svg#icon-play"></use></svg>
                    <span class="label--pressed plyr__tooltip" role="tooltip">Pause</span>
                    <span class="label--not-pressed plyr__tooltip" role="tooltip">Play</span>
                </button>
                
                <button type="button" class="plyr__control" data-plyr="fast-forward">
                    <svg role="presentation"><use xlink:href="` + self.manifest.ap_root_directory + `images/icons.svg#icon-forward"></use></svg>
                    <span class="plyr__tooltip" role="tooltip">Forward {seektime} secs</span>
                </button>
                
                <button type="button" class="plyr__control">
                    <svg role="presentation"><use xlink:href="` + self.manifest.ap_root_directory + `images/icons.svg#icon-next"></use></svg>
                    <span class="plyr__tooltip" role="tooltip">Next</span>
                </button>
            
            </div>
            
            <div class="bottom-controls">
                
                <button id="ap-loop" type="button" class="plyr__control">
                    <svg role="presentation"><use xlink:href="` + self.manifest.ap_root_directory + `images/icons.svg#icon-loop"></use></svg>
                    <span class="plyr__tooltip" role="tooltip">Loop</span>
                </button>
                
                 <select id="ap-playbackRate" name="playback">
                  <option value="1">1x</option>
                  <option value="1.5">1.5x</option>
                  <option value="2">2x</option>
                  <option value="2.5">2.5x</option>
                </select> 
                
                <div class="ap-volcontrols">
                
                    <button type="button" id="ap-muteunmute" class="plyr__control" aria-label="Mute" data-plyr="mute">
                        <svg class="icon--pressed" role="presentation"><use xlink:href="#plyr-muted"></use></svg>
                        <svg class="icon--not-pressed" role="presentation"><use xlink:href="#plyr-volume"></use></svg>
                        <span class="label--pressed plyr__tooltip" role="tooltip">Unmute</span>
                        <span class="label--not-pressed plyr__tooltip" role="tooltip">Mute</span>
                    </button>
                    
                    <div class="plyr__volume">
                        <input data-plyr="volume" type="range" min="0" max="1" step="0.05" value="1" autocomplete="off" aria-label="Volume">
                    </div>
                
                </div>
                
                <button type="button" class="plyr__control">
                    <svg role="presentation"><use xlink:href="` + self.manifest.ap_root_directory + `images/icons.svg#icon-download"></use></svg>
                    <span class="plyr__tooltip" role="tooltip">Download</span>
                </button>
            
            </div>
            
        </div>
        `;
        
        self.el.player = new Plyr( this.el.playerId, {
            
            controls: controls,
            autoplay: false,
            volume: 0.8,
            clickToPlay: false,
            fullscreen: {
                enabled: false,
                fallback: false,
                iosNative: false
            }
                        
        } );
        
        self.el.player.on( 'ready', event => {
            
            const instance = event.detail.plyr;
            const playpauseBtn = self._selector( '#ap-playpause' );
            const muteUnmuteBtn = self._selector( '#ap-muteunmute' );
            const loopBtn = self._selector( '#ap-loop' );
            const playbackRateBtn = self._selector( '#ap-playbackRate' );
            
            // play the audio
            // instance.play();
            
            if ( instance.playing === true ) {
                
                playpauseBtn.classList.add( 'plyr__control--pressed' );
                
            }
            
            // check playback rate and update playback rate select element
            for ( var i = 0; i < playbackRateBtn.options.length; i++ ) {

                if ( Number( playbackRateBtn.options[i].value ) === instance.speed ) {
                    
                    playbackRateBtn.selectedIndex = i;
                    break;
                    
                }
                
            }
            
            // on playback end
            instance.on( 'ended', function() {
                
                if ( instance.loop === false ) {
                    
                    if ( playpauseBtn.classList.contains( 'plyr__control--pressed' ) ) {
                
                        playpauseBtn.classList.add( 'plyr__control--pressed' );
                        
                    }
                    
                    instance.restart();
                    
                }
                
            } );
            
            // toogle loop button state
            loopBtn.addEventListener( 'click', function() {

                if ( instance.loop === false ) {
                    
                    instance.loop = true;
                    loopBtn.classList.add( 'active' );
                    
                } else {
                    
                    instance.loop = false;
                    loopBtn.classList.remove( 'active' );
                    
                }
                
            } );
            
            // change playback rate
            playbackRateBtn.addEventListener( 'change', function( evt ) {
                
                instance.speed = Number( evt.target.options[evt.target.selectedIndex].value );
                
            } );
            
            // toggle play/pause state
            playpauseBtn.addEventListener( 'click', function( evt ) {
            
                if ( evt.target.classList.contains( 'plyr__control--pressed' ) ) {
                    
                    evt.target.classList.remove( 'plyr__control--pressed' );
                    
                } else {
                    
                    evt.target.classList.add( 'plyr__control--pressed' );
                    
                }
                
            } );
            
            // toglle mute/unmute state
            muteUnmuteBtn.addEventListener( 'click', function( evt ) {
                
                if ( evt.target.classList.contains( 'plyr__control--pressed' ) ) {
                    
                    evt.target.classList.remove( 'plyr__control--pressed' );
                    
                } else {
                    
                    evt.target.classList.add( 'plyr__control--pressed' );
                    
                }
                
            } );
                
        } ); // end player ready event
        
    } // end _setupAudioPlayer
    
    toggleCC() {
        
        let captionDisplay = this._selector( this.el.captionDisplay );
        let spectrumDisplay = this._selector( this.el.spectrumDisplay );
        let ccToggle = this._selector( this.el.ccToggle );
        let spectrumToggle = this._selector( this.el.spectrumToggle );
        
        ccToggle.classList.add( 'disabled' );
        spectrumToggle.classList.remove( 'disabled' );
        
        captionDisplay.classList.add( 'active' );
        spectrumDisplay.classList.remove( 'active' );
        
    }
    
    toggleSpectrum() {
        
        let captionDisplay = this._selector( this.el.captionDisplay );
        let spectrumDisplay = this._selector( this.el.spectrumDisplay );
        let ccToggle = this._selector( this.el.ccToggle );
        let spectrumToggle = this._selector( this.el.spectrumToggle );
        
        spectrumToggle.classList.add( 'disabled' );
        ccToggle.classList.remove( 'disabled' );
        
        spectrumDisplay.classList.add( 'active' );
        captionDisplay.classList.remove( 'active' );
        
    }
    
    _CCSpectrumDisplays() {
        
        let self = this;
        let toggles = this._selector( this.el.bodyControls );
        let displays = this._selector( this.el.ccSpecDisplay );
        let ccToggle = this._selector( this.el.ccToggle );
        let spectrumToggle = this._selector( this.el.spectrumToggle );
        
        if ( toggles.style.display === 'none' ) {
            
            toggles.style.display = '';
            displays.style.display = '';
            
        } else {

            self.toggleCC();
            
        }
        
        ccToggle.addEventListener( 'click', function() {
            self.toggleCC();
        } );
        
        spectrumToggle.addEventListener( 'click', function() {
            self.toggleSpectrum();
        } );
        
    }
    
    _hideCCSpectrum() {
        
        let displays = this._selector( this.el.ccSpecDisplay );
        let toggles = this._selector( this.el.bodyControls );
        
        toggles.style.display = 'none';
        displays.style.display = 'none';
        
    }
    
    /*** HELPER METHODS ***/
    
    _selector( str ) {
        return document.querySelector( str );
    }
    
    /*** ANIMATION METHODS ***/
    
    _marqueeEl( el ) {
        
        let self = this;
        
        if ( el.offsetWidth < el.scrollWidth ) {
            
            let runTime = 15500;
            let startTime = 5000;
            
            let start = window.setInterval( function() {
                
                el.parentNode.classList.add( 'marquee' );
                
                el.style.width = el.scrollWidth + 'px';
                
                window.clearInterval( start );
                
                let stop = window.setTimeout( function() {
                    
                    el.style.width = 'initial';
                    
                    self._fadeIn( el );
                    
                    el.parentNode.classList.remove( 'marquee' );
                    window.clearTimeout( stop );
                    self._marqueeEl( el );
                    
                }, runTime );
                
            }, startTime );
            
        }
        
    }
    
    _fadeIn( el, callback ) {
        
        el.classList.remove( 'fadeOut' );
        el.classList.add( 'fadeIn' );
        
        let animationEvt = this._whichAnimationEvent();
        
        el.params = {
            _event: animationEvt,
            _callback: callback
        };
        
        el.addEventListener( animationEvt, this._fadeCallback );
        
    }
    
    _fadeOut( el, callback ) {

        el.classList.remove( 'fadeIn' );
        el.classList.add( 'fadeOut' );
        
        let animationEvt = this._whichAnimationEvent();
        
        el.params = {
            _event: animationEvt,
            _callback: callback
        };
        
        el.addEventListener( animationEvt, this._fadeCallback );
        
    }
    
    _fadeCallback( evt ) {
        
        if ( evt.target.params._callback !== undefined ) {
            
            if ( typeof evt.target.params._callback === 'function' ) {
                
                evt.target.params._callback();
                
            }
            
        }
        
        evt.target.classList.remove( 'fadeIn' );
        evt.target.classList.remove( 'fadeOut' );
        evt.target.removeEventListener( evt.target.params._event, this._fadeCallback );
        
    }
    
    _slideDown( el, callback ) {
        
        el.classList.add( 'slideDown' );
        el.classList.remove( 'slideUp' );
        
        let animationEvt = this._whichAnimationEvent();
        
        el.params = {
            _event: animationEvt,
            _callback: callback
        };
        
        el.addEventListener( animationEvt, this._slideCallback );
        
    }
    
    _slideUp( el, callback ) {
        
        el.classList.add( 'slideUp' );
        el.classList.remove( 'slideDown' );
        
        let animationEvt = this._whichAnimationEvent();
        
        el.params = {
            _event: animationEvt,
            _callback: callback
        };
        
        el.addEventListener( animationEvt, this._slideCallback );
        
    }
    
    _slideCallback( evt ) {
        
        if ( evt.target.params._callback !== undefined ) {
            
            if ( typeof evt.target.params._callback === 'function' ) {
                
                evt.target.params._callback();
                
            }
            
        }
        
        evt.target.removeEventListener( evt.target.params._event, this._slideCallback );
        
    } 
    
    _whichAnimationEvent() {
        
        let ani;
        let el = document.createElement( 'fakeelement' );
        let animations = {
            'animation': 'animationend',
            'OAnimation': 'oAnimationEnd',
            'MozAnimation': 'animationend',
            'WebkitAnimation': 'webkitAnimationEnd'
        }
        
        for ( ani in animations ) {
            
            if ( el.style[ani] !== undefined ) {
                
                return animations[ani];
                
            }
            
        }
        
    }
    
} // end APlayer class

let AP = null;

/**** ON DOM READY ****/
( function ready( fn ) {
    
    if ( document.attachEvent ? document.readyState === 'complete' : document.readyState !== 'loading' ) {
        
        fn();
        
    } else {
        
        document.addEventListener( 'DOMContentLoaded', fn );
        
    }
    
} )( function() {
    
    AP = new APlayer();
    AP.go();
    
} );

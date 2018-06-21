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
            trackTitle: '.track-info .title-wrapper .title',
            miniDisplay: '.track-list .minimized-display',
            trackList: '.track-list .tracks',
            expandTracksBtn: '.track-list .expand-btn',
            spectrumDisplay: '.body .spectrum',
            captionDisplay: '.body .caption',
            warning: '.body .warning-msg',
            error: '#ap-error',
            errorIcon: '#ap-error .icon',
            errorTitle: '#ap-error .title',
            errorBody: '#ap-error .body'
        }
        
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
        
        self.setUIs();
        
        /************ DEV ONLY (remove later) ***********/
        
        self.devOnly();
        
        /************** END DEV ONLY ********************/
        
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
    
    setUIs() {
        
        let self = this;
        let trackTitle = self._selector( self.el.trackTitle );
        let expandTracksBtn = self._selector( self.el.expandTracksBtn );
        
        self._marqueeEl( trackTitle );
        
        expandTracksBtn.addEventListener( 'click', function() {
            
            let trackList = self._selector( self.el.trackList );
            let minDisplay = self._selector( self.el.miniDisplay );
            
            if ( trackList.style.display == 'none' || trackList.style.display == '' ) {
                
                trackList.style.display = 'block';
                minDisplay.style.display = 'none';
                
                self._slideDown( expandTracksBtn.parentNode, function() {
                    
                    expandTracksBtn.classList.add( 'rotate' );
                    
                } );
                
            } else {
                
                trackList.style.display = 'none';
                minDisplay.style.display = 'flex';
                
                self._slideUp( expandTracksBtn.parentNode, function() {
                    
                    expandTracksBtn.classList.remove( 'rotate' );
                    
                } );
                
            }
            
        } );
        
    }
    
    hideSplash() {
    
        let splash = this._selector( this.el.splash );
        let ariaHidden = document.createAttribute( 'aria-hidden' );
        
        ariaHidden.value = true;
        
        splash.classList.add( 'hide-splash' );
        splash.setAttributeNode( ariaHidden );
        
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
    
    /*** DEV ONLY (remove later) ***/
    devOnly() {
        
        let self = this;
        let errToggle = self._selector( '#dev-error-toggle' );
        
        errToggle.addEventListener('click', function(evt) {
            
            let errorDisplay = self._selector( self.el.error );
            
            if ( errorDisplay.style.display == '' || 
                errorDisplay.style.display == 'none' ) {
                self.showError('👾', 'Error Title', 'Error message goes here with <a href="#">link</a>.');      
            } else {
                
                let splash = self._selector( self.el.splash );
                let main = self._selector( self.el.main );
                let icon = self._selector( self.el.errorIcon );
                let title = self._selector( self.el.errorTitle );
                let body = self._selector( self.el.errorBody );
                
                splash.style.display = '';
                main.style.display = '';
                
                self._fadeOut( errorDisplay, function() {
                    
                    errorDisplay.style.display = 'none';
                    icon.innerHTML = '';
                    title.innerHTML = '';
                    body.innerHTML = '';
                    
                } );
                
            }
            
            evt.preventDefault();
            
        } );
        
        let warningToggle = self._selector( '#dev-warning-toggle' );
        
        warningToggle.addEventListener('click', function(evt) {
            
            self.showWarning( 'This is a warning message. Will disappear on its own.' );
            
            evt.preventDefault();
            
        } );
        
        let splashToggle = self._selector( '#dev-splash-toggle' );
        
        splashToggle.addEventListener('click', function(evt) {
            
            if ( self._selector( self.el.splash ).classList.contains( 'hide-splash' ) ) {
                self._selector( self.el.splash ).classList.remove('hide-splash');
            } else {
                self.hideSplash();
            }
            
            evt.preventDefault();
            
        } );
        
    } /*** DEV ONLY ***/
    
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

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
        
            self.showError('🙈', '', 'Your web browser does not support core audio player features.<br><a href="http://outdatedbrowser.com/en" target="_blank">Please update your web browser.</a>');
            return;
            
        }
        
        if ( self.hasAppearanceIusses() ) {
        
            self.showWarning( 'For better viewing, try a different web browser.' );
            
        }
        
        let trackTitle = document.querySelector( this.el.trackTitle );
        let expandTracksBtn = document.querySelector( this.el.expandTracksBtn );
        
        self._marqueeEl( trackTitle );
        
        expandTracksBtn.addEventListener( 'click', function() {
            
            let trackList = document.querySelector( self.el.trackList );
            let minDisplay = document.querySelector( self.el.miniDisplay );
            
            if ( trackList.style.display == 'none' || trackList.style.display == '' ) {
                trackList.style.display = 'block';
                minDisplay.style.display = 'none';
                expandTracksBtn.parentNode.classList.add( 'slideDown' );
                expandTracksBtn.parentNode.classList.remove( 'slideUp' );
                expandTracksBtn.classList.add( 'rotate' );
            } else {
                trackList.style.display = 'none';
                minDisplay.style.display = 'flex';
                expandTracksBtn.parentNode.classList.add( 'slideUp' );
                expandTracksBtn.parentNode.classList.remove( 'slideDown' );
                expandTracksBtn.classList.remove( 'rotate' );
            }
            
        } );
        
        /************** DEV ONLY ********************/
        
        let errToggle = document.querySelector( '#dev-error-toggle' );
        
        errToggle.addEventListener('click', function(evt) {
            
            let errorDisplay = document.querySelector( self.el.error );
            
            if ( errorDisplay.style.display == '' || 
                errorDisplay.style.display == 'none' ) {
                self.showError('👾', 'Error Title', 'Error message goes here with <a href="#">link</a>.');      
            } else {
                let splash = document.querySelector( self.el.splash );
                let main = document.querySelector( self.el.main );
                let icon = document.querySelector( self.el.errorIcon );
                let title = document.querySelector( self.el.errorTitle );
                let body = document.querySelector( self.el.errorBody );
                
                splash.style.display = '';
                main.style.display = '';
                
                self._fadeOut( errorDisplay );
                
                window.setTimeout( function() {
                    
                    icon.innerHTML = '';
                    title.innerHTML = '';
                    body.innerHTML = '';
                    
                }, 1000 );
            }
            
            evt.preventDefault();
            
        } );
        
        let warningToggle = document.querySelector( '#dev-warning-toggle' );
        
        warningToggle.addEventListener('click', function(evt) {
            
            self.showWarning( 'This is a warning message. Will disappear on its own.' );
            
            evt.preventDefault();
            
        } );
        
        let splashToggle = document.querySelector( '#dev-splash-toggle' );
        
        splashToggle.addEventListener('click', function(evt) {
            
            if ( document.querySelector( self.el.splash ).classList.contains( 'hide-splash' ) ) {
                document.querySelector( self.el.splash ).classList.remove('hide-splash');
            } else {
                self.hideSplash();
            }
            
            evt.preventDefault();
            
        } );
        
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
    
        let splash = document.querySelector( this.el.splash );
        let main = document.querySelector( this.el.main );
        let error = document.querySelector( this.el.error );
        let icon = document.querySelector( this.el.errorIcon );
        let title = document.querySelector( this.el.errorTitle );
        let body = document.querySelector( this.el.errorBody );
        
        icon.innerHTML = iconStr;
        title.innerHTML = titleStr;
        body.innerHTML = bodyStr;
        
        splash.style.display = 'none';
        main.style.display = 'none';
        
        error.style.display = 'flex';
        
        this._fadeIn( error );
        
    }
    
    showWarning( str ) {
    
        let self = this;
        let warning = document.querySelector( this.el.warning );
        let hideTime = 6000;
        let delayTime = 1000;
        
        warning.innerHTML = str;
        warning.style.display = 'block';
        
        self._fadeIn( warning );
        
        window.setTimeout( function() {
            
            self._fadeOut( warning );
            
            window.setTimeout( function() {
                
                warning.innerHTML = '';
                
            }, delayTime );
            
        }, hideTime );
        
    }
    
    hideSplash() {
    
        let splash = document.querySelector( this.el.splash );
        
        splash.classList.add( 'hide-splash' );
        
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
    
    _fadeIn( el ) {
        
        el.classList.remove( 'fadeOut' );
        el.classList.add( 'fadeIn' );
        this._clearFade( el );
        
    }
    
    _fadeOut( el ) {
        
        el.classList.remove( 'fadeIn' );
        el.classList.add( 'fadeOut' );
        
        window.setTimeout( function() {
                
            el.style.display = 'none';
            
        }, 1000 );
        
        this._clearFade( el );
    }
    
    _clearFade( el ) {
        
        window.setTimeout( function() {
            
            el.classList.remove( 'fadeIn' );
            el.classList.remove( 'fadeOut' );
            
        }, 1000 );
        
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

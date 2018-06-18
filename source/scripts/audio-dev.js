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
 
 /**** ON DOM READY ****/

( function ready( fn ) {
    
    if ( document.attachEvent ? document.readyState === 'complete' : document.readyState !== 'loading' ) {
        
        fn();
        
    } else {
        
        document.addEventListener( 'DOMContentLoaded', fn );
        
    }
    
} )( initAP );

let el = {
    splash: '#ap-splash',
    main: '#ap-main',
    trackTitle: '.track-info .title-wrapper .title',
    miniDisplay: '.track-list .minimized-display',
    trackList: '.track-list .tracks',
    expandTracksBtn: '.track-list .expand-btn',
    spectrumDisplay: '.body .spectrum',
    captionDisplay: '.body .caption',
    warning: '.body .warning-msg',
    error: '#ap-error'
}

function initAP() {
    
    if ( hasCoreFeaturesSupport() ) {
        
        showError('🙈', '', 'Your web browser does not support core audio player features.<br><a href="http://outdatedbrowser.com/en" target="_blank">Please update your web browser.</a>');
        return;
        
    }
    
    if ( hasAppearanceIusses() ) {
        
        showWarning( 'For better viewing, try a different web browser.' );
        
    }
    
    let trackTitle = document.querySelector( el.trackTitle );
    let expandTracksBtn = document.querySelector( el.expandTracksBtn );
    
    marqueeEl( trackTitle );
    
    expandTracksBtn.addEventListener( 'click', function() {
        
        let trackList = document.querySelector( el.trackList );
        let minDisplay = document.querySelector( el.miniDisplay );
        
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
        
        let errorDisplay = document.querySelector( el.error );
        
        if ( errorDisplay.style.display == '' || 
            errorDisplay.style.display == 'none' ) {
            showError('👾', 'Error Title', 'Error message goes here with <a href="#">link</a>.');      
        } else {
            hideError();
        }
        
        evt.preventDefault();
        
    } );
    
    let warningToggle = document.querySelector( '#dev-warning-toggle' );
    
    warningToggle.addEventListener('click', function(evt) {
        
        showWarning( 'This is a warning messages. Will disappear on its own.' );
        
        evt.preventDefault();
        
    } );
    
    let splashToggle = document.querySelector( '#dev-splash-toggle' );
    
    splashToggle.addEventListener('click', function(evt) {
        
        if ( document.querySelector( el.splash ).classList.contains( 'hide-splash' ) ) {
            document.querySelector( el.splash ).classList.remove('hide-splash');
        } else {
            hideSplash();
        }
        
        evt.preventDefault();
        
    } );
    
    /************** END DEV ONLY ********************/
    
}

function hasCoreFeaturesSupport() {
    
    if ( !Modernizr.audio && Modernizr.json && Modernizr.svg
         && Modernizr.csscalc && Modernizr.flexbox ) {
        return true;
    }
    
    return false;
    
}

function hasAppearanceIusses() {
    
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

function hideSplash() {
    
    let splash = document.querySelector( el.splash );
    
    splash.classList.add( 'hide-splash' );
    
}

function marqueeEl( el ) {
    
    if ( el.offsetWidth < el.scrollWidth ) {
        
        let runTime = 15500;
        let startTime = 5000;
        
        let start = window.setInterval( function() {
            
            el.parentNode.classList.add( 'marquee' );
            
            el.style.width = el.scrollWidth + 'px';
            el.classList.remove( 'fadeIn' );
            
            window.clearInterval( start );
            
            let stop = window.setTimeout( function() {
                
                el.style.width = 'initial';
                el.classList.add( 'fadeIn' );
                
                el.parentNode.classList.remove( 'marquee' );
                window.clearTimeout( stop );
                marqueeEl( el );
                
            }, runTime );
            
        }, startTime );
        
    }
    
}

function showWarning( str ) {
    
    let warning = document.querySelector( el.warning );
    let hideTime = 6000;
    let delayTime = 1000;
    
    warning.innerHTML = str;
    warning.style.display = 'block';
    warning.classList.add( 'fadeIn' );
    
    window.setTimeout( function() {
        
        warning.classList.remove( 'fadeIn' );
        warning.classList.add( 'fadeOut' );
        
        window.setTimeout( function() {
            
            warning.style.display = 'none';
            warning.classList.remove( 'fadeOut' );
            warning.innerHTML = '';
            
        }, delayTime );
        
    }, hideTime );
    
}

function showError( iconStr, titleStr, bodyStr ) {
    
    let splash = document.querySelector( el.splash );
    let main = document.querySelector( el.main );
    let error = document.querySelector( el.error );
    let icon = error.querySelector( '.icon' );
    let title = error.querySelector( '.title' );
    let body = error.querySelector( '.body' );
    
    icon.innerHTML = iconStr;
    title.innerHTML = titleStr;
    body.innerHTML = bodyStr;
    
    splash.style.display = 'none';
    main.style.display = 'none';
    
    error.style.display = 'flex';
    error.classList.remove( 'fadeOut' );
    error.classList.add( 'fadeIn' );
    
}

function hideError() {
    
    let splash = document.querySelector( el.splash );
    let main = document.querySelector( el.main );
    let error = document.querySelector( el.error );
    let icon = error.querySelector( '.icon' );
    let title = error.querySelector( '.title' );
    let body = error.querySelector( '.body' );
    let delayTime = 1000;
    
    splash.style.display = '';
    main.style.display = '';
    
    error.classList.remove( 'fadeIn' );
    error.classList.add( 'fadeOut' );
    
    window.setTimeout( function() {
            
        error.style.display = 'none';
        icon.innerHTML = '';
        title.innerHTML = '';
        body.innerHTML = '';
        
    }, delayTime );
    
}

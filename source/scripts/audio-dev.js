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
    warningMsg: '.body .warning-msg',
    errorMsg: '#ap-error'
}

function initAP() {
    
    if ( hasCoreFeaturesSupport() ) {
        
        showErrorMsg('🙈', '', 'Your web browser does not support core audio player features.<br><a href="http://outdatedbrowser.com/en" target="_blank">Please update your web browser.</a>');
        return;
        
    }
    
    if ( hasAppearanceIusses() ) {
        
        showWarningMsg( 'For better viewing, try a different web browser.' );
        
    }
    
    let trackTitle = document.querySelector( el.trackTitle );
    
    marqueeEl( trackTitle );
    
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

function showWarningMsg( str ) {
    
    let warningMsg = document.querySelector( el.warningMsg );
    let hideTime = 6000;
    let delayTime = 1000;
    
    warningMsg.innerHTML = str;
    warningMsg.style.display = 'block';
    warningMsg.classList.add( 'fadeIn' );
    
    window.setTimeout( function() {
        
        warningMsg.classList.remove( 'fadeIn' );
        warningMsg.classList.add( 'fadeOut' );
        
        window.setTimeout( function() {
            
            warningMsg.style.display = 'none';
            warningMsg.innerHTML = '';
            
        }, delayTime );
        
    }, hideTime );
    
}

function showErrorMsg( iconStr, titleStr, bodyStr ) {
    
    let splash = document.querySelector( el.splash );
    let main = document.querySelector( el.main );
    let errorMsg = document.querySelector( el.errorMsg );
    let icon = errorMsg.querySelector( '.icon' );
    let title = errorMsg.querySelector( '.title' );
    let body = errorMsg.querySelector( '.body' );
    
    icon.innerHTML = iconStr;
    title.innerHTML = titleStr;
    body.innerHTML = bodyStr;
    
    splash.style.display = 'none';
    main.style.display = 'none';
    
    errorMsg.style.display = 'flex';
    errorMsg.classList.add( 'fadeIn' );
    
}
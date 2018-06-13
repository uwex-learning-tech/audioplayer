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

function initAP() {
    
    let trackTitle = document.querySelectorAll( '.track-info .title-wrapper .title' )[0];
    
    marqueeEl( trackTitle );
    
}

function marqueeEl( el ) {
    
    if ( el.offsetWidth < el.scrollWidth ) {
        
        let runTime = 15500;
        let startTime = 5000;
        
        let start = window.setInterval( function() {
            
            el.parentNode.classList.add( 'marquee' );
            window.clearInterval( start );
            
            let stop = window.setTimeout( function() {
                
                el.parentNode.classList.remove( 'marquee' );
                window.clearTimeout( stop );
                marqueeEl( el );
                
            }, runTime );
            
        }, startTime );
        
    }
    
}
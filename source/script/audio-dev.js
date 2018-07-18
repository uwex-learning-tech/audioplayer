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
            splashTitle: '#ap-splash .cover-info .title',
            splashSubtitle: '#ap-splash .cover-info .subtitle',
            splashAuthor: '#ap-splash .cover-info .author',
            splashLength: '#ap-splash .cover-info .length',
            startBtn: '#ap-start-btn',
            resumeBtn: '#ap-resume-btn',
            dwnldBtn: '#ap-dwnld-btn',
            dwnldBtnMenu: '#ap-dwnld-btn .dropdown-content',
            main: '#ap-main',
            mainBody: '#ap-main .body',
            showProfileBtn: '#show-profile',
            closeProfileBtn: '#author-close-btn',
            profileDisplay: '#author-overlay',
            profileDisplayContent: '#author-overlay .content',
            profileDisplaySpinner: '#author-overlay .spinner',
            currentPic: '.head .track-img button',
            trackTitle: '.track-info .title-wrapper .title',
            trackAuthor: '.track-info .author',
            currentTrackNum: '.track-info .meta .current',
            totalTracks: '.track-info .meta .total',
            miniDisplay: '.track-list .minimized-display',
            upNextTrack: '.track-list .minimized-display .ap_up_next_title',
            trackList: '.track-list .tracks',
            trackListItem: '.track-list .tracks li .ap-track',
            expandTracksBtn: '.track-list .expand-btn',
            ccSpecDisplay: '.body .cc-spec-display',
            spectrumDisplay: '.body .cc-spec-display .spectrum',
            captionDisplay: '.body .cc-spec-display .caption',
            bodyControls: '.body .controls',
            ccToggle: '#cc-toggle',
            spectrumToggle: '#spectrum-toggle',
            next: '#ap-next',
            previous: '#ap-previous',
            warning: '.body .warning-msg',
            error: '#ap-error',
            errorIcon: '#ap-error .icon',
            errorTitle: '#ap-error .title',
            errorBody: '#ap-error .body',
            playerId: '#player',
            copyright: '.copyright p'
        };
        
        this.manifest ={};
        this.album = {
            url: 'assets/album.xml',
            program: {},
            downloads: [],
            currentTrack: 0,
            sameAuthor: true,
            sameAuthorLoaded: false
        };
        this.player = null;
        this.reference = {
            names: this._parseUri( window.location.href ),
            params: new URLSearchParams( window.location.search )
        };
        this.marquee ={
            start: null,
            stop: null
        };
        
        this.getManifest();
        
    }
    
    getManifest() {
        
        const self = this;
        let manifestUrl = self._selector( '#ap-manifest' ).getAttribute( 'href' );
        
        self._requestFile( manifestUrl, function( xhr ) {
            
            self.manifest = JSON.parse( xhr.response );
            
            if ( self.manifest.ap_root_directory.length === 0 ) {
        
                self.manifest.ap_root_directory = 'source/';
                
            }
            
            self.setUIs();
            
        } );
        
    }
    
    setUIs() {
        
        const self = this;
        let templateUrl = self.manifest.ap_root_directory + 'script/templates/apui.tpl';
        
        self._requestFile( templateUrl, function( xhr ) {
            
            let body = self._selector( 'body' );
            const res = xhr.response.replace( /\{([source)]+)\}/ig, self.manifest.ap_root_directory );
            
            body.innerHTML += res;
            
            self.getAlbum();
            
            self._checkSupport();
            self._setStartResumeListeners();
            self._expandDownloadBtnMenu();
            self._expandTracksToggle();
            self._setShowProfileListener();
            
        } );
        
    }
    
    _trackListItemListener() {
        
        const self = this;
        let tracks = self._selector( self.el.trackListItem, true );
        
        Array.prototype.forEach.call( tracks, function( track ) {
            
            track.addEventListener( 'click', function( evt ) {
                
                if ( evt.target.className !== 'track-download' &&
                evt.target.nodeName !== 'svg' && evt.target.nodeName !== 'use' ) {
                    
                    self.setTrack( evt.currentTarget.getAttribute( 'data-index' ) );
                    evt.preventDefault();
                    
                }
                
            } );
            
        } );
        
    }
    
    _expandDownloadBtnMenu() {
        
        const self = this;
        
        let dwnldBtn = self._selector( self.el.dwnldBtn );
        let btn = dwnldBtn.querySelector( 'button' );
        let menu = self._selector( self.el.dwnldBtnMenu );
        
        dwnldBtn.addEventListener( 'mouseenter', function() {
            
            btn.setAttribute( 'aria-expanded', true );
            menu.setAttribute( 'aria-expanded', true );
            
        } );
        
        dwnldBtn.addEventListener( 'mouseleave', function() {
            
            btn.setAttribute( 'aria-expanded', false );
            menu.setAttribute( 'aria-expanded', false );
            
        } );
        
    }
    
    _setStartResumeListeners() {
        
        const self = this;
        
        let startBtn = self._selector( self.el.startBtn );
        let resumeBtn = self._selector( self.el.resumeBtn );
        
        startBtn.addEventListener( 'click', function() {
            
            self.hideSplash();
            self.setTrack( self.album.currentTrack );
            
        } );
        
        resumeBtn.addEventListener( 'click', function() {
            
            self.hideSplash();
            self.setTrack( self.album.currentTrack );
            
        } );
        
    }
    
    getAlbum() {
        
        const self = this;
        
        self._requestFile( self.album.url, function( xhr ) {
            
            const xml = xhr.responseXML;
            const xmlSettings = self._xmlSelector( xml, 'album' );
            const xmlSetup = self._xmlSelector( xml, 'setup' );
            const xmlTracks = self._xmlSelector( xml, 'track', true );
            
            // settings
            self.album.settings = {};
            self.album.settings.accent = xmlSettings.getAttribute( 'accent' );
            self.album.settings.splashFormat = '.' + xmlSettings.getAttribute( 'splashImgFormat' );
            self.album.settings.trackImgFormat = '.' + xmlSettings.getAttribute( 'trackImgFormat' );
            self.album.settings.analytics = xmlSettings.getAttribute( 'analytics' );
            self.album.settings.version = xmlSettings.getAttribute( 'xmlVersion' );
            
            // setup
            self.album.title = self._xmlSelector( xmlSetup, 'title' ).textContent;
            self.album.subtitle = self._xmlSelector( xmlSetup, 'subtitle' ).textContent;
            self.album.author = self._xmlSelector( xmlSetup, 'author' ).getAttribute( 'name' );
            self.album.authorProfile = self._xmlSelector( xmlSetup, 'author' ).textContent;
            self.album.length = self._xmlSelector( xmlSetup, 'length' ).textContent;
            
            // set program
            if ( self._isEmpty( xmlSetup.getAttribute( 'program' ) ) ) {
                
                if ( self.reference.names[3] !== undefined ) {
                    
                    self.album.program.name = self.reference.names[3];
                    
                }
                
            } else {
                
                self.album.program.name = xmlSetup.getAttribute( 'program' );
                
            }
            
            // set course
            if ( !self._isEmpty( xmlSetup.getAttribute( 'course' ) ) ) {
                
                self.album.program.course = xmlSetup.getAttribute( 'course' );
                
            }
            
            // track(s)
            self.album.tracks = [];
            
            Array.prototype.forEach.call( xmlTracks, function( el) {
                
                let obj = {};
            
                obj.src = el.getAttribute( 'src' );
                obj.title = el.querySelector( 'title' ).innerHTML;
                obj.author = el.querySelector( 'author' ).getAttribute( 'name' );
                obj.authorProfile = el.querySelector( 'author' ).innerHTML;
                
                if ( self._isEmpty( obj.author ) ) {
                    
                    obj.author = self.album.author;
                    
                }
                
                if ( obj.author !== self.album.author ) {
                    self.album.sameAuthor = false;
                }
                
                if ( self._isEmpty( obj.author ) ) {
                    
                    obj.img = self._sanitize( self.album.author ) + self.album.settings.trackImgFormat;
                    
                } else {
                    
                    obj.img = self._sanitize( obj.author ) + self.album.settings.trackImgFormat;
                    
                }

                self.album.tracks.push( obj );
                
            } );
            
            console.log( self.album );
            
            self.setData();
            self._setupAudioPlayer();
            
        } );
        
    }
    
    setTrack( num ) {
        
        // hold the class
        const self = this;
        
        num = Number( num );
        
        // display title
        let currentTitle = self._selector( self.el.trackTitle );
            
        currentTitle.innerHTML = self.album.tracks[num].title;
        
        // display author
        let currentAuthor = self._selector( self.el.trackAuthor );
        
        currentAuthor.innerHTML = self.album.tracks[num].author;
        
        // load author picture if the track author is different
        if ( !self.album.sameAuthor ) {

            self._loadAuthorPic( self.album.tracks[num] );
            
        }
        
        // load author picture once if same author
        if ( self.album.sameAuthor && self.album.sameAuthorLoaded === false ) {
                
            self._loadAuthorPic( self.album.tracks[num] );
            self.album.sameAuthorLoaded = true;
            
        }
        
        // if more than one track
        if ( self.album.tracks.length > 1 ) {
            
            // display and get current track number
            let currentTrack = self._selector( self.el.currentTrackNum );
            currentTrack.innerHTML = num + 1;
            
            let totalTracks = self._selector( self.el.totalTracks );
            totalTracks.innerHTML = self.album.tracks.length;
            
            // add active class to current track in list
            const tracks = self._selector( self.el.trackListItem, true );
            
            Array.prototype.forEach.call( tracks, function( track ) {
                track.parentNode.classList.remove( 'active' );
            } );
            
            tracks[num].parentNode.classList.add( 'active' );
            
        }
        
        // display next track title
        let upNextTrackTitle = self._selector( self.el.upNextTrack );
        
        if ( self.album.tracks.length > 1 && num < self.album.tracks.length - 1 ) {
            
            upNextTrackTitle.innerHTML = self.album.tracks[num + 1].title;
            
        }
        
        // play the audio if the player is ready after setting source
        if ( self.player.ready ) {
            
            const captionUrl = 'assets/audio/' + self.album.tracks[num].src + '.vtt';
            
            self._fileExists( captionUrl, function( exist ) {
                
                if ( exist ) {
                    
                    self.player.source = {
                
                        type: 'video',
                        title: self.album.tracks[num].title,
                        sources: [
                            
                            {
                                
                                src: 'assets/audio/' + self.album.tracks[num].src + '.mp3',
                                type: 'audio/mp3'
                                
                            }
                            
                        ],
                        tracks: [
                            
                            {
                                kind: 'captions',
                                label: 'English',
                                srclang: 'en',
                                src: 'assets/audio/' + self.album.tracks[num].src + '.vtt',
                                default: true
                            }
                            
                        ]
                        
                    };
                    
                } else {
                    
                    self.player.source = {
                
                        type: 'video',
                        title: self.album.tracks[num].title,
                        sources: [
                            
                            {
                                
                                src: 'assets/audio/' + self.album.tracks[num].src + '.mp3',
                                type: 'audio/mp3'
                                
                            }
                            
                        ]
                        
                    };
                    
                }
                
            } );
            
            self.player.once( 'canplay', function() {
                        
                self.player.togglePlay();
                
            } );
            
        }
        
        // scroll the track title is applicable
        self._stopMarquee( currentTitle );
        self._marqueeEl( currentTitle );
        
    }
    
    _loadAuthorPic( track ) {
        
        const self = this;
        let currentPic = self._selector( self.el.currentPic );
        let localPicUrl = 'assets/images/' + track.img;
        let centralPicUrl = self.manifest.ap_author_directory + self._sanitize( track.author ) + self.album.settings.trackImgFormat;
        let authorPic = new Image();
        
        authorPic.src = self.manifest.ap_root_directory + 'images/pic.png';
        
        self._fileExists( localPicUrl, function( exist ) {
            
            if ( exist ) {
                
                authorPic.src = localPicUrl;
                
            } else {
                
                self._fileExists( centralPicUrl, function( exist ) {
    
                    if ( exist ) {
                        
                        authorPic.src = centralPicUrl;
                        
                    }
                    
                } );
                
            }
            
        } );
        
        currentPic.innerHTML = '';
        currentPic.appendChild( authorPic );
        
    }
    
    setData() {
        
        const self = this;
        
        // DOM head elements
        let pageTitle = this._selector( 'title' );
        
        pageTitle.innerHTML = this.album.title;
        
        // splash screen
        let title = this._selector( this.el.splashTitle );
        let subtitle = this._selector( this.el.splashSubtitle );
        let author = this._selector( this.el.splashAuthor );
        let length = this._selector( this.el.splashLength );
        
        title.innerHTML = this.album.title;
        subtitle.innerHTML = this.album.subtitle;
        author.innerHTML = this.album.author;
        length.innerHTML = this.album.length;
        
        // splash download menu list
        let fileName = self.reference.names;
        
        if ( fileName.length === 0 ) {
            
            fileName = 'album';
            
        } else {
            
            fileName = self.reference.names[self.reference.names.length - 1];
            
        }
        
        Array.prototype.forEach.call( this.manifest.ap_download_files, function( el ) {
            
            let file = fileName + '.' + el.format;
            
            self._fileExists( file, function( exist ) {
                
                if ( exist ) {
                    
                    let link = document.createElement( 'a' );
            
                    link.href = file;
                    link.setAttribute( 'download', file );
                    link.setAttribute( 'role', 'menuitem' );
                    link.innerHTML = el.label;
                    
                    let dwnldMenu = self._selector( self.el.dwnldBtnMenu );
                    dwnldMenu.appendChild( link );
                    
                    let dwnldBtn = self._selector( self.el.dwnldBtn );
                    dwnldBtn.setAttribute( 'aria-hidden', false );
                    dwnldBtn.style.display = 'block';
                    
                    let dwnldFile = {
                        name: el.label,
                        url: file
                    };
                    
                    self.album.downloads.push( dwnldFile );
                    
                }
                
            } );
            
        } );
        
        // splash background image
        if ( !this._isEmpty( this.album.program.name ) ) {
            
            let bgUrl = this.manifest.ap_splash_directory + this.album.program.name + '/default' + this.album.settings.splashFormat;
            
            if ( !this._isEmpty( self.album.program.course ) ) {
                
                bgUrl = this.manifest.ap_splash_directory + this.album.program.name + '/' + this.album.program.course + this.album.settings.splashFormat;
                
            }
            
            this._fileExists( bgUrl, function( exist ) {
                
                if ( exist ) {
                    
                    let splashBg = self._selector( self.el.splash );
                    let head = self._selector( 'head' );
                    let bgImg = 'url("' + bgUrl + '")';
                    
                    splashBg.style.backgroundImage = bgImg;
            
                    // change the bg in the ap-main:before as well
                    let style = document.createElement( 'style' );
                    
                    style.setAttribute( 'type', 'text/css' );
                    style.innerHTML = '#ap-main:before{background-image: ' + bgImg + ' !important;}';
                    
                    head.appendChild( style );
                    
                }
                
            } );
            
        }
        
        // load accent
        if ( !this._isEmpty( self.album.settings.accent ) ) {
            
            let accentUrl = this.manifest.ap_root_directory + 'script/templates/accent_css.tpl';
            this._requestFile( accentUrl, function( xhr ) {
                
                const accentStyle = xhr.response.replace( /\{([accent)]+)\}/ig, self.album.settings.accent );
                
                let head = self._selector( 'head' );
                let style = document.createElement( 'style' );
                
                style.setAttribute( 'type', 'text/css' );
                style.innerHTML = accentStyle;
                
                head.appendChild( style );
                
            } );
            
        }
        
        // set tracks
        if ( this.album.tracks.length > 1 ) {
            
            let trackListDisplay = this._selector( this.el.trackList );
            
            Array.prototype.forEach.call( this.album.tracks, function( el, indx ) {
                
                let li = document.createElement( 'li' );
                let a = document.createElement( 'a' );
                
                a.classList.add( 'ap-track' );
                a.href = 'javascript:void(0);';
                a.setAttribute( 'data-index', indx );
                
                let numSpan = document.createElement( 'span' );
                
                numSpan.classList.add( 'track-num' );
                numSpan.innerHTML = indx + 1 + '.';
                
                let titleWrprSpan = document.createElement( 'span' );
                
                titleWrprSpan.classList.add( 'track-title-wrapper' );
                
                let titleSpan = document.createElement( 'span' );
                
                titleSpan.classList.add( 'track-title' );
                titleSpan.setAttribute( 'title', el.title );
                titleSpan.innerHTML = el.title;
                
                titleWrprSpan.appendChild( titleSpan );
                
                if ( !self.album.sameAuthor ) {
                    
                    let img = document.createElement( 'img' );
                    let localPicUrl = 'assets/images/' + self.album.tracks[indx].img;
                    let centralPicUrl = self.manifest.ap_author_directory + self._sanitize( self.album.tracks[indx].author ) + self.album.settings.trackImgFormat;
                    
                    img.classList.add( 'track-img' );
                    img.src = self.manifest.ap_root_directory + 'images/pic.png';
        
                    self._fileExists( localPicUrl, function( exist ) {
                        
                        if ( exist ) {
                            
                            img.src = localPicUrl;
                            
                        } else {
                            
                            self._fileExists( centralPicUrl, function( exist ) {
                
                                if ( exist ) {
                                    
                                    img.src = centralPicUrl;
                                    
                                }
                                
                            } );
                            
                        }
                        
                    } );
                    
                    a.appendChild( img );
                    
                }
                
                a.appendChild( numSpan );
                a.appendChild( titleWrprSpan );
                
                // download button
                let button = document.createElement( 'a' );
                
                button.classList.add( 'track-download' );
                button.setAttribute( 'download', el.src + '.mp3' );
                button.href = 'assets/audio/' + el.src + '.mp3';
                button.setAttribute( 'role', 'button' );
                
                let svg = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg' );
                
                svg.classList.add( 'icon' );
                svg.setAttribute( 'aria-hidden', true );
                svg.setAttribute( 'viewbox', '0 0 30 30' );
                
                let use = document.createElementNS( 'http://www.w3.org/2000/svg', 'use' );
                
                use.setAttributeNS( 'http://www.w3.org/1999/xlink', 'href', self.manifest.ap_root_directory + 'images/icons.svg#icon-download' );
                
                svg.appendChild( use );
                button.appendChild( svg );
                a.appendChild( button );
                
                li.appendChild( a );
                
                trackListDisplay.appendChild( li );
                
            } );
            
            self._trackListItemListener();
            
        } else {
            
            this._selector( this.el.main ).classList.add( 'single' );
            
        }
    
        // copyright
        let copyright = this._selector( this.el.copyright );
        let date = new Date();
        let year = date.getFullYear();
        
        copyright.innerHTML += '&copy; ' + year + '. ' + this.manifest.ap_copyright;
        
        // program theme
        this._setProgram();
        
    }
    
    _setupAudioPlayer() {
        
        const self = this;
        
        let plyrControlsUrl = self.manifest.ap_root_directory + 'script/templates/single_plyr_controls.tpl';
        
        if ( self.album.tracks.length > 1 ) {
            
            plyrControlsUrl = self.manifest.ap_root_directory + 'script/templates/full_plyr_controls.tpl';
            
        }
        
        self._requestFile( plyrControlsUrl, function( xhr ) {
            
            const controls = xhr.response.replace( /\{([source)]+)\}/ig, self.manifest.ap_root_directory );
                
            self.el.player = new Plyr( self.el.playerId, {
        
                controls: controls,
                hideControls: false,
                autoplay: false,
                volume: 0.8,
                blankVideo: self.manifest.ap_root_directory + 'images/blank.m4v',
                clickToPlay: false,
                fullscreen: {
                    enabled: false,
                    fallback: false,
                    iosNative: false
                }
                            
            } );
            
            self.el.player.on( 'ready', event => {
                
                self.player = event.detail.plyr;
                
                self._CCSpectrumDisplays();
                
                const playpauseBtn = self._selector( '#ap-playpause' );
                const muteUnmuteBtn = self._selector( '#ap-muteunmute' );
                const loopBtn = self._selector( '#ap-loop' );
                const playbackRateBtn = self._selector( '#ap-playbackRate' );
                const nextBtn = self._selector( self.el.next );
                const prevBtn = self._selector( self.el.previous );
                const totalTracks = self.album.tracks.length - 1;
                
                // check playback rate and update playback rate select element
                for ( var i = 0; i < playbackRateBtn.options.length; i++ ) {
    
                    if ( Number( playbackRateBtn.options[i].value ) === self.player.speed ) {
                        
                        playbackRateBtn.selectedIndex = i;
                        break;
                        
                    }
                    
                }
                
                if ( self.album.currentTrack <= 0 ) {
                    
                    prevBtn.setAttribute( 'disabled', true );
                    prevBtn.classList.add( 'disabled' );
                }
                
                if ( self.album.currentTrack >= totalTracks ) {
                            
                    nextBtn.setAttribute( 'disabled', true );
                    nextBtn.classList.add( 'disabled' );
                    
                }
                
                nextBtn.addEventListener( 'click', function() {
                    
                    
                    if ( self.album.currentTrack < totalTracks ) {
                        
                        self.album.currentTrack++;
                        self.setTrack( self.album.currentTrack );
                        
                    }
                    
                } );
                
                prevBtn.addEventListener( 'click', function() {
                    
                    if ( self.album.currentTrack > 0 ) {
                        
                        self.album.currentTrack--;
                        self.setTrack( self.album.currentTrack );
                        
                    }
                    
                } );
                
                self.player.on( 'playing', function() {
                    
                    playpauseBtn.classList.add( 'plyr__control--pressed' );
                    
                } );
                
                self.player.on( 'pause', function() {
                    
                    playpauseBtn.classList.remove( 'plyr__control--pressed' );
                    
                } );
                
                // on playback end
                self.player.on( 'ended', function() {
                    
                    if ( self.player.loop === false ) {
                        
                        if ( playpauseBtn.classList.contains( 'plyr__control--pressed' ) ) {
                    
                            playpauseBtn.classList.add( 'plyr__control--pressed' );
                            
                        }
                        
                        self.player.restart();
                        
                    }
                    
                } );
                
                // toogle loop button state
                loopBtn.addEventListener( 'click', function() {
    
                    if ( self.player.loop === false ) {
                        
                        self.player.loop = true;
                        loopBtn.classList.add( 'active' );
                        
                    } else {
                        
                        self.player.loop = false;
                        loopBtn.classList.remove( 'active' );
                        
                    }
                    
                } );
                
                // change playback rate
                playbackRateBtn.addEventListener( 'change', function( evt ) {
                    
                    self.player.speed = Number( evt.target.options[evt.target.selectedIndex].value );
                    
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
            
        } );
        
    } // end _setupAudioPlayer
    
    _setProgram() {
        
        const self = this;
        
        if ( self.manifest.ap_custom_themes ) {
            
            self.album.program = self.manifest.ap_custom_themes.find( function ( obj ) {
                
                return obj.name === self.album.program.name;
                
            } );
            
            if ( self.album.program === undefined ) {
                
                self.album.program = self.manifest.ap_custom_themes.find( function ( obj ) {
                    
                    return obj.name === self.manifest.ap_logo_default;
                    
                } );
                
            }
            
        }
        
        let decorationBar = self._selector( '.program-theme' );
    
        self.album.program.colors.forEach( function( hex ) {
                        
            let span = document.createElement( 'span' );
            span.style.backgroundColor = hex;
            decorationBar.appendChild( span );
            
        } );
        
    }
    
    _checkSupport() {
        
        if ( this.hasCoreFeaturesSupport() ) {
        
            this.showError( '🙈', '', 'Your web browser does not support core audio player features.<br><a href="http://outdatedbrowser.com/en" target="_blank">Please update your web browser.</a>' );
            return;
            
        }
        
        if ( this.hasAppearanceIusses() ) {
        
            this.showWarning( 'For better viewing, try a different web browser.' );
            
        }
        
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
    
        const self = this;
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
    
    hideSplash() {
    
        let splash = this._selector( this.el.splash );
        let ariaHidden = document.createAttribute( 'aria-hidden' );
        
        ariaHidden.value = true;
        
        splash.classList.add( 'hide-splash' );
        splash.setAttributeNode( ariaHidden );
        
    }
    
    showProfile() {
        
        const self = this;
        let authorProfileDisplay = this._selector( this.el.profileDisplay );
        let closeBtn = this._selector( this.el.closeProfileBtn );
        let index = Number( self._selector( self.el.currentTrackNum ).innerHTML ) - 1;
        
        if ( self.album.tracks.length <= 1 ) {
            index = 0;
        }
        
        let currentAuthor = self.album.tracks[index].author;
        let currentProfile = self.album.authorProfile;
        
        if ( !self._isEmpty( self.album.tracks[index].authorProfile) ) {
            
            currentProfile = self.album.tracks[index].authorProfile;
            
        }
        
        if ( self._isEmpty( currentProfile ) ) {
            
            let profileUrl = self.manifest.ap_author_directory + self._sanitize( currentAuthor ) + '.json?callback=author';
        
            let $jsonp = ( function() {
                
                let that = {};
                let spinner = self._selector( self.el.profileDisplaySpinner );
                
                that.send = function( src, options ) {
            
                    spinner.classList.add( 'spin' );
                    
                    let callback_name = options.callbackName || 'callback',
                        on_success = options.onSuccess || function() {},
                        on_timeout = options.onTimeout || function() {},
                        timeout = options.timeout || 10; // sec
                
                    let timeout_trigger = window.setTimeout( function() {
                        window[callback_name] = function() {};
                        spinner.classList.remove( 'spin' );
                        on_timeout();
                    }, timeout * 1000);
                    
                    window[callback_name] = function( data ) {
                        window.clearTimeout( timeout_trigger );
                        spinner.classList.remove( 'spin' );
                        on_success( data );
                    }
                    
                    let script = document.createElement( 'script' );
                    script.type = 'text/javascript';
                    script.async = true;
                    script.src = src;
                    
                    document.getElementsByTagName( 'head' )[0].appendChild( script );
                
                }
                
                return that;
                
            } )();
            
            $jsonp.send( profileUrl, {
                
                callbackName: 'author',
                onSuccess: function( json ) {
                    
                    self._setProfile( json.name, json.profile );
                },
                onTimeout: function() {
                    
                    self._setProfile( currentAuthor, currentProfile );
                    
                },
                timeout: 5
                
            } );
            
        } else {
            
            self._setProfile( currentAuthor, currentProfile );
            
        }
        
        authorProfileDisplay.style.display = 'block';
        this._fadeIn( authorProfileDisplay );
        
        closeBtn.addEventListener( 'click', function() {
            self.closeProfile();
        }, {once: true} );

    }
    
    _setProfile( author, bio ) {
        
        let authorProfileDisplayContent = this._selector( this.el.profileDisplayContent );
        
        let name = document.createElement( 'h4' );
                    
        name.innerHTML = author;
                        
        let profile = document.createElement( 'div' );
        
        profile.innerHTML = bio;
        
        authorProfileDisplayContent.appendChild( name );
        authorProfileDisplayContent.appendChild( profile );
        
    }
    
    closeProfile() {
        
        let authorProfileDisplay = this._selector( this.el.profileDisplay );
        let authorProfileDisplayContent = this._selector( this.el.profileDisplayContent );
        
        this._fadeOut( authorProfileDisplay, function() {
            
            authorProfileDisplay.style.display = '';
            
            authorProfileDisplayContent.innerHTML = '';
            
        } );

    }
    
    _setShowProfileListener() {
        
        const self = this;
        let showProfileBtn = this._selector( this.el.showProfileBtn );
        
        showProfileBtn.addEventListener( 'click', function() {
            
            self.showProfile();
            
        } );
        
    }
    
    _expandTracksToggle() {
        
        const self = this;
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
                    trackList.style.setProperty( 'overflow-y', 'auto' );
                    
                } );
                
            } else {
                
                trackList.style.display = 'none';
                trackList.style.setProperty( 'overflow-y', 'hidden' );
                minDisplay.style.display = 'flex';
                
                self._slideUp( expandTracksBtn.parentNode, function() {
                    
                    expandTracksBtn.classList.remove( 'rotate' );
                    self._CCSpectrumDisplays();
                    
                } );
                
            }
            
        } );
        
    }
    
    toggleCC() {
        
        const self = this;
        let captionDisplay = this._selector( this.el.captionDisplay );
        let spectrumDisplay = this._selector( this.el.spectrumDisplay );
        let ccToggle = this._selector( this.el.ccToggle );
        let spectrumToggle = this._selector( this.el.spectrumToggle );
        
        ccToggle.classList.add( 'disabled' );
        spectrumToggle.classList.remove( 'disabled' );
        
        captionDisplay.classList.add( 'active' );
        spectrumDisplay.classList.remove( 'active' );
        
        self.player.on( 'canplay', function() {
            
            if ( self.player.currentTrack !== -1 ) {
                self.player.toggleCaptions( true );
            }
            
        } );
        
        if ( self.player.playing && self.player.currentTrack !== -1 ) {
            self.player.toggleCaptions( true );
        }

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
        
        if ( this.player !== null && this.player.currentTrack > -1 ) {
            this.player.toggleCaptions( false );
        }
        
    }
    
    _CCSpectrumDisplays() {
        
        const self = this;
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
    
    _selector( str, all ) {
        
        all = typeof all === 'boolean' ? all : false;
        
        if ( all ) {
            
            return document.querySelectorAll( str );
            
        } else {
            
            return document.querySelector( str );
            
        }
        
    }
    
    _xmlSelector( xml, str, all ) {
        
        all = typeof all === 'boolean' ? all : false;
        
        if ( all ) {
            
            return xml.querySelectorAll( str );
            
        } else {
            
            return xml.querySelector( str );
            
        }
        
    }
    
    _sanitize( str ) {
        
        return str.replace(/[^\w]/gi, '').toLowerCase();
    
    }
    
    _isEmpty( str ) {
        
        if ( typeof str === 'string' && str.trim() === '' ) {
            return true;
        }
        
        if ( str === undefined ) {
            return true;
        }
        
        if ( str ===  null ) {
            return true;
        }
        
        return false;
        
    }
    
    _requestFile( url, callback ) {
        
        const self = this;
        let body = self._selector( 'body' );
        let request = new XMLHttpRequest();
        
        request.open( 'GET', url, true );
        
        request.onload = function() {
            
            if ( this.status >= 200 && this.status < 400 ) {
                
                callback( this );
                
            } else {
                
                body.innerHTML += '<div class="error">Error ' + this.status + ' while loading <code>' + url + '</code></div>';
                
            }
            
            request.abort();
            
        };
        
        request.onerror = function() {
            
            body.innerHTML += '<div class="error">Connection Error. Check your network.</div>';
            
        };
        
        request.send();
        
    }
    
    _fileExists( url, callback ) {
        
        let request = new XMLHttpRequest();
        let found = false;
        
        request.open( 'HEAD', url, true );
        
        request.onload = function() {
            
            if ( this.status >= 200 && this.status < 400 ) {
                
                found = true;
                
            } else {
                
                found = false;
                
            }
            
            callback( found );
            
        };
        
        request.send();
        
    }
    
    _cleanArray( arr ) {
    
        arr.forEach( function( value, index ) {
            
            if ( value === '' ) {
                arr.splice( index, 1 );
            }
            
        } );
        
        if ( ( /(\w*|(\w*\-\w*)*)\.\w*/ig ).test( arr[arr.length-1] ) ) {
            arr.pop();
        }
        
        if ( ( /(\w*|(\w*\-\w*)*)\:/ig ).test( arr[arr.length-1] ) ) {
            arr.pop();
        }
        
        return arr;
        
    }
    
    _parseUri( str ) {
        
        let parts =  str.split( '?' );
        let target = parts[0];
        
        if ( target.lastIndexOf( '/' ) !== target.length - 1 ) {
    		target += '/';
    	}
    	
    	return this._cleanArray( target.split( '/' ) );
        
    }
    
    /*** ANIMATION METHODS ***/
    
    _marqueeEl( el ) {
        
        const self = this;
        
        if ( el.offsetWidth < el.scrollWidth ) {
            
            let runTime = 15500;
            let startTime = 5000;
            
            self.marquee.start = window.setInterval( function() {
                
                el.parentNode.classList.remove( 'stop-marquee' );
                el.parentNode.classList.add( 'marquee' );
                
                el.style.width = el.scrollWidth + 'px';
                
                window.clearInterval( self.marquee.start );
                
                self.marquee.stop = window.setTimeout( function() {
                     
                    el.style.width = 'initial';
                    el.parentNode.classList.remove( 'marquee' );
                    window.clearTimeout( self.marquee.stop );
                    
                    self._fadeIn( el );
                    self._marqueeEl( el );
                    
                }, runTime );
                
            }, startTime );
            
        }
        
    }
    
    _stopMarquee( el ) {
        
        el.style.width = '';
        el.parentNode.classList.remove( 'marquee' );
        el.parentNode.classList.add( 'stop-marquee' );
        
        if ( this.marquee.stop !== null ) {
            window.clearTimeout( this.marquee.stop );
        }
        
        if ( this.marquee.start !== null ) {
            window.clearInterval( this.marquee.start );
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
        
        const self = this;
        el.classList.add( 'slideUp' );
        el.classList.remove( 'slideDown' );
        
        let animationEvt = this._whichAnimationEvent();
        
        el.params = {
            _event: animationEvt,
            _callback: callback
        };
        
        el.addEventListener( animationEvt, self._slideCallback );
        
    }
    
    _slideCallback( evt ) {
        
        const self = this;
        
        if ( evt.target.params !== undefined ) {
            
            if ( typeof evt.target.params._callback === 'function' ) {
                
                evt.target.params._callback();
                
            }
            
            evt.target.removeEventListener( evt.target.params._event, self._slideCallback );
            
        }
        
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

/**** ON DOM READY ****/
( function ready( fn ) {
    
    if ( document.attachEvent ? document.readyState === 'complete' : document.readyState !== 'loading' ) {
        
        fn();
        
    } else {
        
        document.addEventListener( 'DOMContentLoaded', fn );
        
    }
    
} )( function() {
    
    new APlayer();
    
} );

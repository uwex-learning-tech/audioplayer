/*
 * HTML5 MP3 Audio Player
 *
 * @author: Ethan Lin
 * @url: https://github.com/oel-mediateam/audioplayer
 * @version: 1.0.2
 *
 * @license: The MIT License (MIT)
 * Copyright (c) 2014 UW-EX CEOEL
 *
 */

/* global MediaElementPlayer */

var ROOT_PATH = "https://media.uwex.edu/";

$(document).ready(function () {

    /************************** GLOBAL-SCOPE VARIABLES *******************************/
    var player, mediaData, album, track, tracks, source, img, trackIndex = 0, autoplay = true,
		firstList = true, trackCount = 0, previousTrack = 0;

    /************************** AJAX SETUP/REQUEST *******************************/
    $.ajaxSetup({
		url: 'assets/tracks.xml',
        type: 'GET',
        dataType: 'xml',
        accepts: 'xml',
        content: 'xml',
        contentType: 'xml; charset="utf-8"',
        cache: false
    });

    $.ajax({
        encoding: 'UTF-8',
        beforeSend: function (xhr) {
            xhr.overrideMimeType("xml; charset=utf-8");
            xhr.setRequestHeader("Accept", "text/xml");
        },
        success: function (xml) {
            $('#errorMsg').hide();
            parseXML(xml);
        },
        error: function (xhr, exception) {
            displayError(xhr.status, exception);
        }
    });

	/************************** FUNCTIONS *******************************/

    function parseXML(xml) {

        // declare a TRACK variable to hold the XML track nodes
        var TRACK;

		// get the last directory folder name as the source
		getSource();

        // create a new album object and assign the data from the XML
        album = {};
        album.name = $(xml).find('album').find('name').text();
        album.author = $(xml).find('album').find('author').text();
        album.image = $(xml).find('album').find('image').text();
        album.length = $(xml).find('album').find('length').text();

		// set the page title to the ablum name
		$(document).attr('title', album.name);

        // assign the track node to the TRACK variable
        TRACK = $(xml).find('tracks').find('track');

        // create a new array to hold all of the tracks
        tracks = [];

        // loop through each track node and assign each track's information
        TRACK.each(function () {

            // create a new track object and assign the data from the XML
            track = {};
            track.id = trackIndex;
            track.source = $(this).find('source').text();
            track.title = $(this).find('title').text();
            track.author = ( ($(this).find('author').text().length <= 0) ? album.author : $(this).find('author').text() );
            track.image = ( ($(this).find('image').text().length <= 0) ? album.image : $(this).find('image').text() );

            // pust the track to the tracks array at the current trackIndex value
            tracks[trackIndex] = track;

            // increment the trackIndex by 1
            trackIndex++;

        }); // end each loop

        // inject the download bar to them DOM
        $(".playerInfoPanel").append("<div id=\"download_bar\"><ul></ul></div>");

        // if tracks array length is greater than one
        if (tracks.length > 1) {

            // loop through each track in the array
            for (var i = 0; i < tracks.length; i++) {

                // if the it is the first element in the array
                if (firstList === true) {

                    // set the first item in the playlist
                    $('#selectable').html('<li class="ui-widget-content" title="' + tracks[i].title + '">' + '<div style="width:10%;padding:0px 1%;text-align:right;float:left;">' + (((tracks[i].id + 1) < 10) ? '0' + (tracks[i].id + 1) : (tracks[i].id + 1)) + '.</div><div style="width:86%;padding:0px 1%;float:left;">' + tracks[i].title + '</div></li>');

                    // set the firstList to false
                    firstList = false;

                    // else if not the first element in the array
                } else {

                    // append the items to the playlist
                    $('#selectable').append('<li class="ui-widget-content" title="' + tracks[i].title + '">' + '<div style="width:10%;padding:0px 1%;text-align:right;float:left;">' + (((tracks[i].id + 1) < 10) ? '0' + (tracks[i].id + 1) : (tracks[i].id + 1)) + '.</div><div style="width:86%;padding:0px 1%;float:left;">' + tracks[i].title + '</div></li>');

                } // end if

            } // end loop

            // select the first list item
            $('#selectable li:first').addClass('ui-selected');

            // enable table of content selection
            $('#selectable').selectable({

                stop: function () {

                    $(".ui-selected", this).each(function () {

                        // set the current trackCount to the selected list index
                        trackCount = $("#selectable li").index(this);

                    }); // end loop

                    // if current trackCount does not equal to the previous track
                    if (trackCount !== previousTrack) {

                        // call the loadTrack function
                        loadTrack(mediaData, trackCount);
                        // set the previous track to current track count
                        previousTrack = trackCount;

                    } // end if

                } // end stop function

            }); // end table of content selection

            // call the getCoverImage() function
			getCoverImage();

			// get the downloadable audio zip folder
			dowloadableFile(source, "zip");

            // if tracks array is 1 or less than 1
        } else {

            // hide the current track number
            $('.currentTrackNum').hide();

            // hide the playlist
            $('.playerPlaylist').hide();

            // hide cover
            //$("#coverImage").hide();
            $("#audioPlayerWrapper").show();
            autoplay = false;
            setupHTML5Player();

            // get the downloadable audio track
            dowloadableFile(tracks[0].source.replace(".mp3",""), "mp3");

        } // end if

		// get the downloadable transcript
		dowloadableFile(source, "pdf");

    } // end parse XML function

    // cover image function
    function getCoverImage() {

        // declare a new Image object to be the cover image
        var coverImage = new Image();

        // display the cover image information
        $('.album_name').html(album.name);
        $('.album_author').html(album.author);
        if (album.length <= 0) {
            $('.album_length').hide();
        } else {
            $('.album_length').html(album.length);
        }

        // load cover image
        $(coverImage).load(function () {

            // success: set the splash image
            $('#coverImage').css('background-image', 'url(assets/images/splash.jpg)');

        }).error(function () {

            // failed: set the default splash image
            $('#coverImage').css('background-image', 'url(' + ROOT_PATH + 'media/mp3_player/sources/images/default_cover.jpg)');

            // set image to load attributes
        }).attr({

            'src': 'assets/images/splash.jpg',
            'border': 0

        }); // end load image

        // set the click listener to the cover image
        $('#coverImage').click(function () {

			/*
// declare browser checker variables
			var ua = navigator.userAgent,
			checker = {
				ios: ua.match(/(iPhone|iPod|iPad)/),
				blackberry: ua.match(/BlackBerry/),
				android: ua.match(/Android/)
			},
			mobile = (getParameterByName("m") === "0") ? false : true;

			// if the device is mobile
			if ((checker.ios || checker.blackberry || checker.android) && mobile) {

				// declare variables to hold the URL
				var location = window.location.href,
					locTemp, locIndex = location.indexOf(".");

				// assign the new location
				locTemp = location.substr(locIndex);
				location = "http://webstreamer" + locTemp + "?m=0";

				// open the new URL in a new tab/window
				window.open(location);

				// if not a mobile device
			} else {
*/

				// hide the cover image
				$('#coverImage').hide();

				// show the player framework
				$('#audioPlayerWrapper').fadeIn();

				// call the setupHTML5Player function
				autoplay = true;
				setupHTML5Player();

			// }

        }); // end click listener

        $("#coverImage").show();

    } // end cover image function

    // setup HTML5 player function
    function setupHTML5Player() {

        // call the loadTrackInfo function with argument of 0
        loadTrackInfo(0);

        // set the player
        $('.player').html('<audio id="ap" src="assets/audio/' + tracks[0].source + '"  '+ ((autoplay) ? 'autoplay="autoplay"' : '')+' preload="metadata" controls></audio>');

        // create a new media element player to take over the HTML5 audio tag with options
        player = new MediaElementPlayer('#ap', {
            // width of audio player
            audioWidth: 380,
            // height of audio player
            audioHeight: 30,
            // initial volume when the player starts
            startVolume: 0.8,
            // useful for <audio> player loops
            loop: false,
            // enables Flash and Silverlight to resize to content size
            enableAutosize: true,
            // the order of controls you want on the control bar (and other plugins below)
            features: ['playpause', 'current', 'progress', 'duration', 'volume'],
            // Hide controls when playing and mouse is not over the video
            alwaysShowControls: false,
            // force iPad's native controls
            iPadUseNativeControls: false,
            // force iPhone's native controls
            iPhoneUseNativeControls: false,
            // force Android's native controls
            AndroidUseNativeControls: false,
            // forces the hour marker (##:00:00)
            alwaysShowHours: false,
            // show framecount in timecode (##:00:00:00)
            showTimecodeFrameCount: false,
            // used when showTimecodeFrameCount is set to true
            framesPerSecond: 25,
            // turns keyboard support on and off for this instance
            enableKeyboard: true,
            // when this player starts, it will pause other players
            pauseOtherPlayers: true,
            // on track successfully ends, determind next track
            success: function (media) {

				// listen to the loadedmetadata event
				media.addEventListener('loadedmetadata', function () {

					// assign values from the media to the globle mediaData variable
					mediaData = media;

					// set the track duration
					$('.duration').html(formatTime(media.duration, false, 25));

				}, false); // loadedmetadata event listener

				// listen to the ended event
				media.addEventListener('ended', function () {

					// call the determindNextTrack function
					determindNextTrack(media);

				}, false); // end ended event listener

            } // end success function

        }); // end new media element

    } // end setup HTML5 player function

    // determind next track function
    function determindNextTrack(media) {

        // increment the track count
        trackCount++;

        // if total track is greater than one AND
        // track count is less than total track
        if (tracks.length > 1 && trackCount < tracks.length) {

            // call the loadTrackInfo function with argument of current trackCount
			previousTrack = trackCount;
            loadTrackInfo(trackCount);

            // set, load, and play the audio file
            media.setSrc('assets/audio/' + tracks[trackCount].source);
            media.load();
            media.play();

            // else if track count is greater and equal to total track
        } else if (trackCount >= tracks.length) {

            // set track count back to zero
            trackCount = 0;

            // call the loadTrackInfo function with argument of current trackCount
            loadTrackInfo(trackCount);

            // set, load, and pause the first audio file
            media.setSrc('assets/audio/' + tracks[trackCount].source);
            media.load();
            media.pause();

			$('.playerPlaylist').animate({ scrollTop: 0 }, 1000);

            // all else...
        } else {

            // pause the audio
            media.pause();

        } // end if

        // clear the current selected item in the playlist
        $('#selectable li').each(function () {
            $(this).removeClass('ui-selected');
        });

        // select the current item in the playlist
        $('#selectable li:nth-child(' + Number(trackCount + 1) + ')').addClass('ui-selected');

		if (trackCount >= 4 && trackCount < tracks.length) {

			$('.playerPlaylist').animate({ scrollTop: $('#selectable li:nth-child(' + Number(trackCount + 1) + ')').offset().top }, 500);

		}

    } // end determind next track function

    // load track function
    function loadTrack(media, index) {

        // call the loadTrackInfo function with the argument of list index
        loadTrackInfo(index);

        // set, load, and play the audio file
        media.pause();
        media.setSrc('assets/audio/' + tracks[index].source);
        media.load();
        media.play();

    } // end load track function

    // format time function
    function formatTime(time, forceHours) {

        var hours = Math.floor(time / 3600) % 24,
            minutes = Math.floor(time / 60) % 60,
            seconds = Math.floor(time % 60),
            result = ((forceHours || hours > 0) ? (hours < 10 ? '0' + hours : hours) + ':' : '') + (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds < 10 ? '0' + seconds : seconds);

        return result;

    } // end format time function

    // load track info
    function loadTrackInfo(i) {

        // set next track info
        $('.currentTrackNum').html(tracks[i].id + 1);
        $('.title').html(tracks[i].title);
        $('.author').html(tracks[i].author);

        // create a new image object
        img = new Image();

        // set the track image
        $(img).load(function () {

            // success: set the loaded image
            $('.image').html(img);

        }).error(function () {

            // failed: set the default track image
            $('.image').html('<img src="sources/images/default_profile.jpg" width="60" height="60" border="0" alt="" />');

            // set the image to load attributes
        }).attr({

            'src': 'assets/images/' + tracks[i].image,
            'border': 0

        }); // end load image

    } // end loadTrackInfo

    // error handling function
    function displayError(status, exception) {

        // hold status and error message
        var statusMsg, exceptionMsg;

        // assign status
        if (status === 0) {
            statusMsg = '<strong>Error 0</strong> - Not connect. Please verify network.';
        } else if (status === 404) {
            statusMsg = '<strong>Error 404</strong> - Requested page not found or not acceptable.';
        } else if (status === 406) {
            statusMsg = '<strong>Error 406</strong> - Not acceptable error.';
        } else if (status === 500) {
            statusMsg = '<strong>Error 500</strong> - Internal Server Error.';
        } else {
            statusMsg = 'Unknow error';
        }

        // assign error
        if (exception === 'parsererror') {
            exceptionMsg = 'Requested XML parse failed.';
        } else if (exception === 'timeout') {
            exceptionMsg = 'Time out error.';
        } else if (exception === 'abort') {
            exceptionMsg = 'Ajax request aborted.';
        } else if (exception === "error") {
            exceptionMsg = 'HTTP / URL Error (most likely a 404 or 406).';
        } else {
            exceptionMsg = ('Uncaught Error.\n' + status.responseText);
        }

        $('#audioPlayerWrapper').hide();
        $('#errorMsg').html('<p>' + statusMsg + '<br />' + exceptionMsg + '</p>'); // display error message

    } // end display error function

	function dowloadableFile(file, ext) {

		var content_type;

		if (ext === "pdf") {
			content_type = "application/pdf";
		} else if (ext === "mp3") {
			content_type = "audio/mpeg";
			file = "assets/audio/"+file;
		} else if (ext === "zip") {
			content_type = "application/zip";
		}

		$.ajax({
			url: file + "." + ext,
			type: 'HEAD',
			dataType: 'text',
			contentType: content_type,
			async: false,
			beforeSend: function (xhr) {
				xhr.overrideMimeType(content_type);
				xhr.setRequestHeader("Accept", content_type);
			},
			success: function () {

				var f = file, downloadBar = $("#download_bar ul");

				if (location.protocol !== "http:") {
					var url = window.location.href;
					url = url.substr(0,url.lastIndexOf("/")+1).replace("https","http");
					f = url + file;
				}

				switch (ext) {

    				case "pdf":
    				    downloadBar.append("<li><a href=\"" + f + "." + ext + "\" target=\"_blank\">Transcript</a></li>");
    				break;

    				case "mp3":
    				case "zip":
    				    downloadBar.append("<li><a href=\"" + f + "." + ext + "\" target=\"_blank\">Audio</a></li>");
    				break;

				}

			},
			error: function () {

				/*
var string = "";

				if (ext === "mp3" || ext === "zip") {
					string = "Aduio pending...";
				}

				$("#download_bar ul").after("<p>" + string + "</p>");
*/

			}
		});
	}

	function getSource() {
		var urlToParse = window.location.href, src;
		src = urlToParse.split("?");
		src = src[0].split("/");
		src = src[src.length-2];
		source = src;
	}

	/*
// getParameterByName function
	function getParameterByName(name) {

        var regexS = "[\\?&]" + name + "=([^&#]*)";
        var regex = new RegExp(regexS);
        var results = regex.exec(window.location.href);

        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");

        if (results === null) {
            return "";
        } else {
            return decodeURIComponent(results[1].replace(/\+/g, " "));
        }
    } // end getParameterByName function
*/

}); // end document ready
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
        
        <button id="ap-previous" type="button" class="plyr__control">
            <svg role="presentation"><use xlink:href="{source}images/icons.svg#icon-previous"></use></svg>
            <span class="plyr__tooltip" role="tooltip">Previous</span>
        </button>
        
        <button type="button" class="plyr__control" data-plyr="rewind">
            <svg role="presentation"><use xlink:href="{source}images/icons.svg#icon-backward"></use></svg>
            <span class="plyr__tooltip" role="tooltip">Rewind {seektime} secs</span>
        </button>
        
        <button type="button" id="ap-playpause" class="plyr__control" aria-label="Play, {title}" data-plyr="play">
            <svg class="icon--pressed" role="presentation"><use xlink:href="{source}images/icons.svg#icon-pause"></use></svg>
            <svg class="icon--not-pressed" role="presentation"><use xlink:href="{source}images/icons.svg#icon-play"></use></svg>
            <span class="label--pressed plyr__tooltip" role="tooltip">Pause</span>
            <span class="label--not-pressed plyr__tooltip" role="tooltip">Play</span>
        </button>
        
        <button type="button" class="plyr__control" data-plyr="fast-forward">
            <svg role="presentation"><use xlink:href="{source}images/icons.svg#icon-forward"></use></svg>
            <span class="plyr__tooltip" role="tooltip">Forward {seektime} secs</span>
        </button>
        
        <button type="button" id="ap-next" class="plyr__control">
            <svg role="presentation"><use xlink:href="{source}images/icons.svg#icon-next"></use></svg>
            <span class="plyr__tooltip" role="tooltip">Next</span>
        </button>
    
    </div>
    
    <div class="bottom-controls">
        
        <button id="ap-caption" type="button" class="plyr__control" data-plyr="captions">
            <svg class="icon--pressed" role="presentation"><use xlink:href="#plyr-captions-on"></use></svg>
            <svg class="icon--not-pressed" role="presentation"><use xlink:href="#plyr-captions-off"></use></svg>
            <span class="label--pressed plyr__tooltip" role="tooltip">Disable captions</span>
            <span class="label--not-pressed plyr__tooltip" role="tooltip">Enable captions</span>
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
        
        <button id="ap-download-cntrl" type="button" class="plyr__control">
            <svg role="presentation"><use xlink:href="{source}images/icons.svg#icon-download"></use></svg>
            <span class="plyr__tooltip" role="tooltip">Download</span>
        </button>
    
    </div>
    
</div>
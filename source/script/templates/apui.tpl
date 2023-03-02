<div class="warning-msg"></div>
<div class="program-theme" role="presentation"></div>
    
    <div id="ap-wrapper">
        
        <div id="ap-error" aria-hidden="true">
            
            <div class="msg">
                <span class="icon" aria-hidden="true"></span>
                <p class="title"></p>
                <p class="body"></p>
            </div>
            
        </div>
        
        <div id="ap-splash" aria-hidden="false">
            
            <div class="cover-info">
                
                <h1 class="title"></h1>
                <p class="subtitle"></p>
                <p class="author"></p>
                <p class="length"></p>
                <div class="actions">
                    
                    <button id="ap-start-btn" class="btn">Start</button>
                    <button id="ap-resume-btn" class="btn">Resume</button>
                
                    <div id="ap-dwnld-btn" class="dropdown" role="menu" aria-hidden="true">
                        <button id="dwnld-btn" class="btn download-btn" aria-haspopup="true" aria-expanded="false">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="{source}images/icons.svg#icon-download"></use>
                            </svg> Downloads
                        </button>
                        <div class="dropdown-content" aria-expanded="false" aria-labelledby="dwnld-btn"></div>
                    </div>
                    
                </div>
                    
            </div>
            
        </div>
        
        <div id="ap-main">
            
            <div class="head">
                
                <div class="track-img">
                    <button id="show-profile" aria-label="Show author profile"></button>
                </div>
                
                <div class="track-info">
                    <div class="title-wrapper">
                        <h2 class="title"></h2>
                    </div>
                    <p class="author"></p>
                    <p class="meta">
                        Track <span class="current"></span> of 
                        <span class="total"></span>
                    </p>
                </div>
                
            </div>
            
            <div class="body">
                
                <div class="track-list">
                    <div class="minimized-display">Up Next: <span class="ap_up_next_title"></span>
                    </div>
                    <ul class="tracks">
                        <div class="label">Tracks</div>
                    </ul>
                    <button class="expand-btn" aria-label="Expand Track List">
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="{source}images/icons.svg#icon-arrow-down"></use>
                        </svg>
                    </button>
                </div>
                
            </div>
            
            <div class="foot">
                
                <div class="audio-ui">
                    
                    <video id="player"></video>
                    
                </div>
                
            </div>
            <!-- author-overlay author-close-btn -->
            <div id="overlay-content">
                <button id="overlay-close-btn" aria-label="Close Author Profile">&times;</button>
                <div class="content"></div>
                <div class="spinner" aria-hidden="true">
                    <svg viewBox="0 0 30 30">
                        <use xlink:href="{source}images/icons.svg#icon-spinner"></use>
                    </svg>
                </div>
            </div>
            
        </div>
        
    </div>
    
    <div class="copyright" role="contentinfo">
        <p></p>
    </div>
    
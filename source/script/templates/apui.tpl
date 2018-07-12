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
                    <button id="show-profile" aria-label="Show author profile">
                        <img src="{source}images/pic.jpg" alt="An Image of the Author" />
                    </button>
                </div>
                
                <div class="track-info">
                    <div class="title-wrapper">
                        <h2 class="title"></h2>
                    </div>
                    <p class="author"></p>
                    <p class="meta">
                        <span class="duration">--:--</span> &bull; 
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
                        
<!--
                        <li><a href="#">
                            <img class="track-img" src="{source}images/pic.jpg" />
                            <span class="track-title">Track 1</span>
                            <button class="track-download">
                                <svg class="icon" aria-hidden="true">
                                    <use xlink:href="{source}images/icons.svg#icon-download"></use>
                                </svg>
                            </button>
                        </a></li>
                        
                        <li><a href="#">
                            <img class="track-img" src="{source}images/pic.jpg" />
                            <span class="track-title">Track 2</span>
                            <button class="track-download">
                                <svg class="icon" aria-hidden="true">
                                    <use xlink:href="{source}images/icons.svg#icon-download"></use>
                                </svg>
                            </button>
                        </a></li>
                        
                        <li><a href="#">
                            <img class="track-img" src="{source}images/pic.jpg" />
                            <span class="track-title">Track 2</span>
                            <button class="track-download">
                                <svg class="icon" aria-hidden="true">
                                    <use xlink:href="{source}images/icons.svg#icon-download"></use>
                                </svg>
                            </button>
                        </a></li>
-->
                        
                    </ul>
                    <button class="expand-btn" aria-label="Expand Track List">
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="{source}images/icons.svg#icon-arrow-down"></use>
                        </svg>
                    </button>
                </div>
                
                <div class="cc-spec-display">
                    <div class="spectrum"></div>
                    <div class="caption"></div>
                </div>
                
                <div class="warning-msg"></div>
                
                <div class="controls">
                    
                    <button id="cc-toggle" aria-label="Closed Caption">
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="{source}images/icons.svg#icon-cc"></use>
                        </svg>
                    </button>
                    
                    <button id="spectrum-toggle" aria-label="Spectrum">
                        <svg class="icon" aria-hidden="true">
                                <use xlink:href="{source}images/icons.svg#icon-wave"></use>
                            </svg>
                    </button>
                    
                </div>
                
            </div>
            
            <div class="foot">
                
                <div class="audio-ui">
                    
                    <audio id="player"></audio>
                    
                </div>
                
            </div>
            
            <div id="author-overlay">
                <button id="author-close-btn" aria-label="Close Author Profile">&times;</button>
                <div class="content"></div>
            </div>
            
        </div>
        
    </div>
    
    <div class="copyright" role="contentinfo">
        <p></p>
    </div>
    
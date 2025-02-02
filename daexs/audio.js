// References https://github.com/beforesemicolon/BFS-Projects/tree/audio-player-tag
{
    class AudioPlayer extends HTMLElement {
        currentTime = 0;
        duration = 0;
        currentSpeed = 1;

        constructor() {
            super();

            this.attachShadow({mode: 'open'})
            this.render();
            this.addEventListeners();
        }

        addEventListeners(){
            console.log("Binding event listeners");

            // Play button click event
            this.playBtn.addEventListener('click', () => {
                if (this.audio.paused) {
                    this.audio.play();
                    this.playBtn.textContent = 'Pause';
                    this.playBtn.classList.add('playing');
                } else {
                    this.audio.pause();
                    this.playBtn.textContent = 'Play';
                    this.playBtn.classList.remove('playing');
                }
            });


            this.audio.addEventListener('ended', () => {
                this.progressBar.value = Math.ceil(this.audio.duration); // ensures progress bar gets full
                console.log("Audio ended.");
                this.playBtn.textContent = 'Play';
                this.playBtn.classList.remove('playing');
            });

            this.audio.addEventListener('loadedmetadata', () => {;
                this.progressBar.max = Math.ceil(this.audio.duration);
                
                const secs = parseInt(`${this.audio.duration % 60}`, 10).toString().padStart(2, '0');
                const mins = parseInt(`${(this.audio.duration/60) % 60}`, 10).toString();
                this.durationElapsed.textContent = `${mins}:${secs}`;
            });

            this.audio.addEventListener('timeupdate', () => {
                this.updateAudioTime(this.audio.currentTime);
            });

            this.progressBar.addEventListener('input', () => {
                this.seekTo(this.progressBar.value);
            }, false);

            this.volumeSlider.addEventListener('change', (e) => {
                this.audio.volume = e.currentTarget.value / 100;
            });

            this.captionsImg.addEventListener('click', () => {
                if (this.captionsImg.style.backgroundImage === 'url("images/cc.png")'){
                    this.captionsImg.style.backgroundImage = 'url("images/closed-captions-on.png")'
                } else {
                    this.captionsImg.style.backgroundImage = 'url("images/cc.png")'
                }
            });

            this.fwdBtn.addEventListener('click', () => {
                this.audio.currentTime = Math.min(this.audio.currentTime + 15, this.audio.duration);
                this.updateAudioTime(this.audio.currentTime);
            });

            this.rewindBtn.addEventListener('click', () => {
                this.audio.currentTime = Math.max(this.audio.currentTime - 15, 0);
                this.updateAudioTime(this.audio.currentTime);
            });

            this.playbackSpeed.addEventListener('change', () => {
                console.log(this.playbackSpeed.value);
                this.audio.playbackRate = this.playbackSpeed.value;
            });
        }

        updateAudioTime(time) {
            this.currentTime = time;
            this.progressBar.value = this.currentTime;
 
            const secs = parseInt(`${time % 60}`, 10).toString().padStart(2, '0');
            const mins = parseInt(`${(time/60) % 60}`, 10);
            this.currentTimeElapsed.textContent = `${mins}:${secs}`;
        }

        seekTo(value) {
            this.audio.currentTime = value;
        }

        changeSpeed(curr) {
            if (curr === 1) {
                this.audio.currentSpeed = 1.5;
            } else if (curr === 1.5) {
                this.audio.currentSpeed = 2;
            } else {
                this.audio.currentSpeed = 1;
            }

            this.audio.playbackRate = this.audio.currentSpeed;
            this.speedBtn.textContent = `${this.audio.currentSpeed.toFixed(1)}x`
        }

        render(){
            this.shadowRoot.innerHTML = ` 
            <link rel="stylesheet" href="audio.css">
            <div class="audio-bar">
                <audio id="player">
                    <source type="audio/mpeg">
                </audio>
                <div class="rewind-btn"></div>
                <button id="playBtn">Play</button> 
                <div class="forward-btn"></div>
                <div class="progress-indicator">
                    <span class="current-time">0:00</span>
                    <input type="range" max="100" value="0" class="progress-bar">
                    <span class="duration">0:00 </span>
                </div>
                <div class="volume-bar">
                    <input type="range" max="100" value="100" class="volume-slider">
                </div>
                <div class="captions"></div>
                <div class="speed-adjust">
                    <select class="playback-speed">
                        <option value="0.5">0.5x</option>
                        <option value="1" selected>1.0x</option>
                        <option value="1.5">1.5x</option>
                        <option value="2">2x</option>
                    </select>
                </div>
            </div>`;

            this.audio = this.shadowRoot.querySelector('audio');
            this.audio.src = this.getAttribute('src');

            this.playBtn = this.shadowRoot.querySelector('#playBtn');
            this.pauseBtn = this.shadowRoot.querySelector('#pauseBtn');
            this.volUp = this.shadowRoot.querySelector('#volUp');
            this.volDown = this.shadowRoot.querySelector('#volDown');

            this.progressIndicator = this.shadowRoot.querySelector('.progress-indicator');
            this.currentTimeElapsed = this.progressIndicator.children[0];
            this.progressBar = this.progressIndicator.children[1];
            this.durationElapsed = this.progressIndicator.children[2];

            this.volumeSlider = this.shadowRoot.querySelector('.volume-slider');

            this.playBtn.classList.add('playing');
            this.speedBtn = this.shadowRoot.querySelector('.current-speed');
            this.audio.currentSpeed = 1;

            this.captionsImg = this.shadowRoot.querySelector('.captions');
            this.fwdBtn = this.shadowRoot.querySelector('.forward-btn');
            this.rewindBtn = this.shadowRoot.querySelector('.rewind-btn');
            this.playbackSpeed = this.shadowRoot.querySelector('.playback-speed');
        }

    }
    customElements.define('audio-controls', AudioPlayer);

}
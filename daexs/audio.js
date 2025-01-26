{
    class AudioPlayer extends HTMLElement {
        currentTime = 0;
        duration = 0;

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
                console.log("Play button clicked");
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

        render(){
            this.shadowRoot.innerHTML = ` 
            <link rel="stylesheet" href="audio.css">
            <div class="audio-bar">
                <audio id="player">
                    <source type="audio/mpeg">
                </audio>
                <button id="playBtn">Play</button> 
                <div class="progress-indicator">
                    <span class="current-time">0:00</span>
                    <input type="range" max="100" value="0" class="progress-bar">
                    <span class="duration">0:00 </span>
                </div>
                <div class="volume-bar">
                    <input type="range" max="100" value="100" class="volume-slider">
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

        }

    }
    customElements.define('audio-controls', AudioPlayer);

}
{
    class AudioPlayer extends HTMLElement {
        playing = false;
        hasAutoplayed = false;
        audioCtx = null;
        track = null;

        constructor() {
            super();

            this.attachShadow({mode: 'open'})
            // this.render();
            // this.audioInit();
            // this.attachEvents();
            this.render();
            this.addEventListeners();
        }

        // connectedCallback() {
        //     this.render();
        //     this.addEventListeners();
        // }

        audioInit() {
            if (this.audioCtx) return; // Avoid reinitialization if Start button is clicked again
            this.audioCtx = new AudioContext();
            this.track = this.audioCtx.createMediaElementSource(this.audio);
            this.track.connect(this.audioCtx.destination);
        }

        addEventListeners(){
            console.log("Binding event listeners");

            // Play button click event
            this.playBtn.addEventListener('click', () => {
                console.log("Play button clicked");
                if (this.audio.paused) {
                    this.audio.play();
                    this.playBtn.textContent = 'Pause';
                } else {
                    this.audio.pause();
                    this.playBtn.textContent = 'Play';
                }
            });

            // Volume up button event
            this.volUp.addEventListener('click', () => {
                console.log("Volume up clicked");
                if (this.audio.volume < 1) {
                    this.audio.volume += 0.1;
                }
            });

            // Volume down button event
            this.volDown.addEventListener('click', () => {
                console.log("Volume down clicked");
                if (this.audio.volume > 0) {
                    this.audio.volume -= 0.1;
                }
            });

            this.audio.addEventListener('ended', () => {
                console.log("Audio ended.");
                this.playBtn.textContent = 'Play';
            });

        //     this.audio.addEventListener('play', () => {
        //         if (this.hasAutoplayed) {
        //             this.audio.play();
        //             this.playing = true;
        //             this.audio.textContent = 'pause';
        //         }
        //     })

        //     this.audio.addEventListener('pause', () => {
        //         this.playing = false;
        //         this.audio.textContent = 'play';
                
        //     })
        }

        async audioPlay() {
            if (this.audioCtx.state === 'suspended') {
                await this.audioCtx.resume();
            }

            if (this.playing) {
                await this.audio.pause();
                this.playing = false;
                this.audio.textContent = 'play';
            } else {
                await this.audio.play();
                this.playing = true;
                this.audio.textContent = 'pause';
            }
        }

        render(){
            this.shadowRoot.innerHTML = `
            <audio id="player">
                <source type="audio/mpeg">
            </audio>
            <div>
                <button id="playBtn">Play</button> 
                <button id="volUp">Vol +</button> 
                <button id="volDown">Vol -</button> 
            </div>`;

            this.audio = this.shadowRoot.querySelector('audio');
            this.audio.src = this.getAttribute('src');

            this.playBtn = this.shadowRoot.querySelector('#playBtn');
            this.pauseBtn = this.shadowRoot.querySelector('#pauseBtn');
            this.volUp = this.shadowRoot.querySelector('#volUp');
            this.volDown = this.shadowRoot.querySelector('#volDown');

        }

        // addAudioObserver() {
        //     const observer = new IntersectionObserver((entries) => {
        //         entries.forEach(entry => {
        //             if (entry.isIntersecting) {
        //                 this.audioInit();
        //                 // this.attachEvents();
        //                 this.addEventListeners();
        //                 this.hasAutoplayed = true;
        //                 console.log("Audio has autoplayed");
        //             }
        //         });
        //     }, {threshold: 0.5});

        //     observer.observe(this.audio);
        // }
    }
    customElements.define('audio-controls', AudioPlayer);

}
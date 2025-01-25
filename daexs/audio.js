{
    class AudioPlayer extends HTMLElement {
        playing = false;
        hasAutoplayed = false;
        audioCtx = null;
        track = null;

        constructor() {
            super();

            this.attachShadow({mode: 'open'})
            this.render();
            // this.audioInit();
            // this.attachEvents();
        }

        // audioInit() {
        //     if (this.audioCtx) return; // Avoid reinitialization if Start button is clicked again
        //     this.audioCtx = new AudioContext();
        //     this.track = this.audioCtx.createMediaElementSource(this.audio);
        //     this.track.connect(this.audioCtx.destination);
        // }

        // attachEvents(){
        //     this.playPauseBtn.addEventListener('click'. this.audioPlay.bind(this));

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
        // }

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
            <audio controls=true>
                <source type="audio/mpeg">
                Your browser does not support the audio element.
            </audio>
            <button class="play-btn" type="button"> play </button>`;

            this.audio = this.shadowRoot.querySelector('audio');
            this.audio.src = this.getAttribute('src');
            this.playBtn = this.shadowRoot.querySelector('.play-btn');

        }

        // addAudioObserver() {
        //     const observer = new IntersectionObserver((entries) => {
        //         entries.forEach(entry => {
        //             if (entry.isIntersecting) {
        //                 this.audioInit();
        //                 // this.attachEvents();
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
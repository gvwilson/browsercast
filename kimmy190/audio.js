// js functions to implement all features 
const doc = document; 

function audioBarFeature(){
    const slides = doc.querySelectorAll('div.slide');

    // iterate each slide to add functions for the audio bar 
    slides.forEach((slide)=>{ 
        const audio = slide.querySelector('audio');
        if (audio === null){
            return;
        } else {
            audio.play(); 
        }
        const playPauseBtn = slide.querySelector('.playPauseBtn');
        const timeDisplay = slide.querySelector('.timeDisplay');
        const seekBar = slide.querySelector('.seekBar');
        const volumeBtn = slide.querySelector('.volumeBtn');
        const volumeControl = slide.querySelector('.volumeControl');
        const playbackSpeed = slide.querySelector('.playbackSpeed'); 
        const forwordBtn = slide.querySelector('.forward');
        const backwardBtn = slide.querySelector('.backword');
        const captionBtn = slide.querySelector('.caption')

        // change the play button when audio is playing 
        if (audio.paused) {
            console.log(audio.paused); 
            playPauseBtn.className = 'fa-solid fa-play pointer';
        } else {
            console.log("playing")
            playPauseBtn.className = 'fa-solid fa-pause pointer';
        }

        // play/pause functionality
        playPauseBtn.addEventListener('click', () => {
            if (audio.paused) {
                audio.play();
                playPauseBtn.className = 'fa-solid fa-pause pointer';
            } else {
                audio.pause();
                playPauseBtn.className = 'fa-solid fa-play pointer';
            }
        });

        // update seek bar
        audio.addEventListener('timeupdate', () => {
            seekBar.value = (audio.currentTime / audio.duration) * 100;
            timeDisplay.textContent = formatTime(audio.currentTime) + " / " + formatTime(audio.duration);
        });

        // seek audio
        seekBar.addEventListener('input', () => {
            audio.currentTime = (seekBar.value / 100) * audio.duration;
        });

        // forward 15s of audio 
        forwordBtn.addEventListener('click', () => {
            audio.currentTime += 15; 
        })

        // backword 15s of audio 
        backwardBtn.addEventListener('click', () => {
            audio.currentTime -= 15;
        })

        // volume control
        volumeControl.addEventListener('input', () => {
            audio.volume = volumeControl.value;
        });

        // toggle volume slider on hover
        volumeBtn.addEventListener('mouseover', () => {
        volumeControl.classList.toggle('hidden');
        });

        // hide the slider when clicking outside
        doc.addEventListener('click', (event) => {
            if (!volumeBtn.contains(event.target) && !volumeControl.contains(event.target)) {
                volumeControl.classList.add('hidden');
            }
        });

        // playback speed control
        playbackSpeed.addEventListener('change', () => {
            audio.playbackRate = playbackSpeed.value;
        });

        // set initial duration once metadata is loaded
        audio.addEventListener('loadedmetadata', () => {
            timeDisplay.textContent = `0:00 / ${formatTime(audio.duration)}`;
        });

        // reset everything once audio ends 
        audio.addEventListener('ended', ()=>{
            setTimeout(()=>{
                // reset logo 
                playPauseBtn.className = 'fa-solid fa-play pointer';
                // reset time 
                // timeDisplay.textContent = `0:00 / ${formatTime(audio.duration)}`;
                // reset seek bar 
                //seekBar.value = 0;
                // reset playback speed & audio rate 
                playbackSpeed.value = 1.0;
                audio.playbackRate = 1.0;
            }, 100)  
        })

        // change the caption icon when click 
        captionBtn.addEventListener('click', ()=>{
            // const imgSrc = captionBtn.src; 
            // if (imgSrc.includes("-on")){
            //     captionBtn.src = "./images/closed-captions.png"; 
            // } else {
            //     captionBtn.src = "./images/closed-captions-on.png";
            // }
            // using data next method to switch attributes 
            const currSrc = captionBtn.src; 
            const nextSrc = captionBtn.getAttribute("data-next");

            captionBtn.src = nextSrc;
            captionBtn.setAttribute("data-next", currSrc); // Store the old image for future clicks
        })
    })
}

// format time for the audio bar 
function formatTime(seconds) {
    let minutes = Math.floor(seconds / 60);
    let secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

// put the audio tag inside the custom audio playback bar 
function newAudioBar(){
    // select audio & src tag 
    const audioTags = doc.querySelectorAll('audio');

    audioTags.forEach(audioTag => {
        // create the outer div element that wraps around all the feature 
        const audioPlayerDiv = doc.createElement('div'); 
        const audioPlayerParent = doc.createElement('div'); 
        audioPlayerDiv.className = 'audio-player';
        audioPlayerParent.className = 'audio-bar-container'; 
        // newElement('div', 'audio-player');

        // add customized features into the new div
        audioPlayerDiv.innerHTML = `
            <img src="./images/backword.png" class="backword pointer">
            <i class="fa-solid fa-play pointer playPauseBtn"></i>
            <img src="./images/forward.png" class="forward pointer">

            <input class="seekBar" type="range" min="0" value="0">
            <span class="timeDisplay"></span>

            <!-- <i class="fa-regular fa-closed-captioning fa-sm pointer caption"></i> -->
            <img src="./images/closed-captions.png" data-next="./images/closed-captions-on.png" class="pointer caption">
            
            <i class="fa-solid fa-volume-high fa-sm pointer volumeBtn"></i>
            <input class="volumeControl hidden" type="range" min="0" max="1" step="0.01" value="1">
            <select class="playbackSpeed pointer">
                <option value="0.5">0.5x</option>
                <option value="1" selected>1.0x</option>
                <option value="1.5">1.5x</option>
                <option value="2">2x</option>
            </select>
        `;

        // add the customized audio bar before the audio tag 
        // audioTag.parentNode.insertBefore(audioPlayerDiv, audioTag);

        // Add audioPlayerDiv inside audioPlayerParent
        audioPlayerParent.appendChild(audioPlayerDiv);

        // Insert the parent container before the audio tag
        audioTag.parentNode.insertBefore(audioPlayerParent, audioTag);

        // Move the audio tag inside the customized audioPlayerDiv
        audioPlayerDiv.appendChild(audioTag);

    }); 

    audioBarFeature();

} 

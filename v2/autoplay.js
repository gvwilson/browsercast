const slideNavBar = document.querySelector('#slide-navigation-container');
const audioBars = document.querySelectorAll('audio-controls');
const autoplayToggle = document.querySelector('.autoplay-btn-wrapper'); 
const toggleSliderBtn = document.querySelector('.slider');
const slides = document.querySelectorAll('.slide');
const interval = 3000; // set interval for how long scroll will wait
const toggleBtn = document.getElementById('toggle');

let isAudioManuallyPaused = false 
let autoScrollState = 0;
let scrollTimeout;
let autoplayEnabled = false; // autoplay is off 
let hideControlsTimeout; 


function hideAudioBars(visibleState) {
    audioBars.forEach((bar) => {
        const shadowRoot = bar.shadowRoot;
        const content = shadowRoot.querySelector('.audio-bar');

        if (shadowRoot) {
            if (visibleState) {
                content.classList.add('hide');
            } else {
                content.classList.remove('hide');
            }
        }
    });
}

function closeSlideNav(){
    const previewSlider = document.querySelector('.preview-slider');
const toggleBtn = document.getElementById('toggle');

    if (!previewSlider.classList.contains('open')){
        previewSlider.classList.toggle('open');
        toggleBtn.classList.toggle('open');
    }
}

function showControls() {
    slideNavBar.classList.remove('hide');
    autoplayToggle.classList.remove('hide');
    if (audioBars.length > 0) {
        hideAudioBars(0);
    }
}

function hideControls() {
    closeSlideNav();
    slideNavBar.classList.add('hide');
    autoplayToggle.classList.add('hide');
    if (audioBars.length > 0) {
        hideAudioBars(1);
    }
}

function handleMouseMove() {
    // when autoplay is on and hover over the screen, make controls visible and hide after 3 seconds 
    if (autoplayEnabled) {
        showControls();
        clearTimeout(hideControlsTimeout); 

        // select the audio from the current slide 
        const currentSlide = document.querySelector('.slide.active'); 
        const audioPlayer = currentSlide?.querySelector('audio-controls'); 

        if (audioPlayer) {
            const audioElement = audioPlayer.shadowRoot.querySelector('audio'); 

            audioElement.addEventListener('pause', () => {
                if(isAudioManuallyPaused){
                    // show controls when audio is manually paused 
                    showControls();
                    clearTimeout(hideControlsTimeout);
                    console.log("it still shows the controsl");
                } 
            });

            if (audioElement.play) {
                hideControlsTimeout = setTimeout(() => {
                    hideControls();
                }, 3000);
            }

        } else {
            // when slide has no audio 
            hideControlsTimeout = setTimeout(() => {
                hideControls();
            }, 3000);
        }

    }
}

function waitForAudio(currAudio) {
    return new Promise (resolve => {
        if (currAudio.ended) {
            resolve();
        } else {
            currAudio.onended = resolve;
        }
    });
}

function countDown() {
    let count = 2; 
    let countdownEl = document.getElementById('countdown');
    countdownEl.classList.remove('none'); 

    let interval = setInterval(() => {
        if (count > 0) { 

            countdownEl.textContent = count;
            count--; 

        } else {
            console.log("Countdown done"); 
            countdownEl.classList.add('none'); 
            countdownEl.textContent = 3;
            // Stop the interval once it reaches 0
            clearInterval(interval);  

        }
    }, 1000); 
}

async function autoScroll () {

    // Get current slide
    const curr = document.querySelector('.active');
    const index = Array.from(slides).indexOf(curr);

    // if slide has audio, scroll when audio ends
    const currAudio = curr.querySelector('audio-controls');

    if (currAudio) {
        const shadowRoot = currAudio.shadowRoot;
        const content = shadowRoot.querySelector('audio');
        await waitForAudio(content);
    } 
    
    if (autoplayEnabled && index + 1 < slides.length){ 
        slides[index].classList.remove('active');
        slides[index + 1].classList.add('active');
    }

    // continue scrolling after fixed interval if new slide not the last one
    if (index + 1 < slides.length - 1 && autoplayEnabled) {
        scrollTimeout = setTimeout(autoScroll, interval);
    } else {
        console.log('Reached end.');
        // when reach the end, autoplay stops and controls show 
        toggleSliderBtn.click();
        toggleBtn.click();
    }

}

function addEventListeners () {
    toggleSliderBtn.addEventListener('click', () => {
        if (!autoplayEnabled) {
            // hiding all features 
            closeSlideNav();

            setTimeout(() => {
                slideNavBar.classList.add('hide');
                autoplayToggle.classList.add('hide');
                if (audioBars.length > 0){
                    hideAudioBars(1);
                }
            }, 500);
            autoplayEnabled = true; 
            

            // Play audio if paused
            const curr = document.querySelector('.active');
            const currAudio = curr.querySelector('audio-controls');

            if (currAudio) {
                const shadowRoot = currAudio.shadowRoot;
                const content = shadowRoot.querySelector('audio');
                if (content.paused){
                    content.play();
                }
            }
            
            // start the countdown when autoplay starts at first slide  
            const currentSlide = document.querySelector('.slide.active'); 
            if (currentSlide.id === 'slide-1'){
                countDown();
            }
            
            setTimeout(() => {
                autoScroll();
            }, 3000);

        } else {
            // controls visible    
            clearTimeout(hideControlsTimeout); 
            slideNavBar.classList.remove('hide');
            autoplayToggle.classList.remove('hide');
            if (audioBars.length > 0){
                hideAudioBars(0);
            }

            autoplayEnabled = false; 

        }
    });

    // hover effect when controlling slides with mouse 
    document.addEventListener('mousemove', handleMouseMove);
}

function init () {
    addEventListeners();
}

init();
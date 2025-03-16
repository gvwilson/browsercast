const slideNavBar = document.querySelector('#slide-navigation-container');
const audioBars = document.querySelectorAll('audio-controls');
const toggleSliderBtn = document.querySelector('.slider');
const slides = document.querySelectorAll('.slide');
let interval;

// let visibleState = 1; // 1 means it is visible
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
    if (audioBars.length > 0) {
        hideAudioBars(0);
    }
}

function hideControls() {
    closeSlideNav();
    slideNavBar.classList.add('hide');
    if (audioBars.length > 0) {
        hideAudioBars(1);
    }
}


function handleMouseMove() {
    // when autoplay is on and hover over the screen, make controls visible and hide after 3 seconds 
    if (autoplayEnabled) {
        console.log("should only work when autoplay is on,  " + autoplayEnabled); 
        showControls();
        clearTimeout(hideControlsTimeout); 

        // select the audio from the current slide 
        const currentSlide = document.querySelector('.slide.active'); 
        const audioPlayer = currentSlide?.querySelector('audio-controls'); 

        if (audioPlayer) {
            const audioElement = audioPlayer.shadowRoot.querySelector('audio'); 

            audioElement.addEventListener('pause', () => {
                showControls();
                clearTimeout(hideControlsTimeout);
            });

            if (!audioElement.paused) {
                hideControlsTimeout = setTimeout(() => {
                    hideControls();
                }, 3000);
            }

        } else {
            hideControlsTimeout = setTimeout(() => {
                    hideControls();
            }, 3000);
        }

    }
}

async function autoScroll () {
    // 1. Play audio if exists, if not, wait a fixed interval (ie. 5 secs) and scroll to next
    // 2. Repeat until end reached

    // Get current slide
    const curr = document.querySelector('.active');
    const index = Array.from(slides).indexOf(curr);

    if (index < slides.length - 1) {
        slides[index + 1].scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    } else {
        clearInterval(interval);
    }

}

function addEventListeners () {
    toggleSliderBtn.addEventListener('click', () => {
        if (!autoplayEnabled) {
            // hiding all features 
            closeSlideNav();

            setTimeout(() => {
                slideNavBar.classList.add('hide');
                if (audioBars.length > 0){
                    hideAudioBars(1);
                }
                // visibleState = 0;
            }, 500);
            autoplayEnabled = true; 

            setTimeout(() => {
                interval = setInterval(autoScroll, 3000);
            }, 3000);

        } else {
            // controls visible    
            // console.log("showing controls when autoplay is off")
            clearTimeout(hideControlsTimeout); 
            slideNavBar.classList.remove('hide');
            if (audioBars.length > 0){
                hideAudioBars(0);
            }
            autoplayEnabled = false; 
            clearInterval(interval);
            // console.log("making sure autoplay is turned off??" + autoplayEnabled);
        }
    });

    // showing controls when audio is ended 
    document.addEventListener('AudioEnded', () => {
        showControls();
        clearTimeout(hideControlsTimeout); 
    });

    // hover effect when controlling slides with mouse 
    document.addEventListener('mousemove', handleMouseMove);
}

function init () {
    addEventListeners();
}

init();
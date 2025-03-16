const slideNavBar = document.querySelector('#slide-navigation-container');
const audioBars = document.querySelectorAll('audio-controls');
const toggleSliderBtn = document.querySelector('.slider');
const slides = document.querySelectorAll('.slide');
// let interval;
let autoScrollState = 0;
let scrollTimeout;

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

function waitForAudio(currAudio) {
    console.log(currAudio);
    return new Promise (resolve => {
        if (currAudio.ended) {
            resolve();
        } else {
            currAudio.onended = resolve;
        }
    });
}

async function autoScroll () {
    // 1. Play audio if exists, if not, wait a fixed interval (ie. 5 secs) and scroll to next
    // 2. Repeat until end reached

    // Get current slide
    const curr = document.querySelector('.active');
    const index = Array.from(slides).indexOf(curr);

    // Get current audio if exists
    const currAudio = curr.querySelector('audio-controls');

    if (currAudio) {
        const shadowRoot = currAudio.shadowRoot;
        const content = shadowRoot.querySelector('audio');
        await waitForAudio(content);
    } else {
        await new Promise(resolve => {
            scrollTimeout = setTimeout(resolve, 3000);
        });
    }

    // const next = index + 1;
    // if (next < slides.length){
    //     const nextSlide = slides[next];
    //     const offset = nextSlide.offsetTop - 28;

    //     window.scrollTo({
    //         top: offset,
    //         behavior: 'smooth',
    //     });
    // }
    slides[index + 1].scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });

    if (index < slides.length - 1 && autoplayEnabled) {
        scrollTimeout = setTimeout(autoScroll, 3000);
    } else {
        console.log('Reached end.');
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


            setTimeout(() => {
                autoScroll();
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
            clearTimeout(scrollTimeout); 
            // console.log("making sure autoplay is turned off??" + autoplayEnabled);
        }
    });

    // showing controls when audio is ended 
    // document.addEventListener('AudioEnded', () => {
    //     showControls();
    //     clearTimeout(hideControlsTimeout); 
    // });

    // hover effect when controlling slides with mouse 
    document.addEventListener('mousemove', handleMouseMove);
}

function init () {
    addEventListeners();
}

init();
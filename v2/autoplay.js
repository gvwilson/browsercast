const slideNavBar = document.querySelector('#slide-navigation-container');
const audioBars = document.querySelectorAll('audio-controls');
const toggleSliderBtn = document.querySelector('.slider');

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
    // when hovering over the screen make controls visible and hide after 3 seconds 
    if (autoplayEnabled) {
        console.log("should only work when autoplay is on,  " + autoplayEnabled); 
        showControls();
        clearTimeout(hideControlsTimeout); 

        // select the audio from the current slide 
        const currentSlide = document.querySelector('.slide.active'); 
        const audioPlayer = currentSlide?.querySelector('audio-controls'); 

        if (audioPlayer) {
            const audioElement = audioPlayer.shadowRoot.querySelector('audio'); 
            console.log(audioElement)

            // when audio is ended controls remain visible 
            audioElement.addEventListener('ended', () => {
                showControls(); 
                clearTimeout(hideControlsTimeout); 
            });

             // when audio is paused controls remain visible 
            audioElement.addEventListener('pause', () => {
                showControls();
                clearTimeout(hideControlsTimeout);
            });

            if (!audioElement.paused) {
                hideControlsTimeout = setTimeout(() => {
                    hideControls();
                }, 3000);
            }

        }
    }
}


function addEventListeners () {
    toggleSliderBtn.addEventListener('click', () => {
        if (!autoplayEnabled) {
            // hiding all features 
            console.log("hiding controls cuz autoplay is on"); 
            
            closeSlideNav();

            setTimeout(() => {
                slideNavBar.classList.add('hide');
                if (audioBars.length > 0){
                    hideAudioBars(1);
                }
                // visibleState = 0;
            }, 500);
            autoplayEnabled = true; 

        } else {
            // controls visible    
            console.log("showing controls when autoplay is off")
            clearTimeout(hideControlsTimeout); 
            slideNavBar.classList.remove('hide');
            if (audioBars.length > 0){
                hideAudioBars(0);
            }
            // visibleState = 1;
            autoplayEnabled = false; 
            console.log("making sure autoplay is turned off??" + autoplayEnabled);
        }
    });

    document.addEventListener('mousemove', handleMouseMove);
}

function init () {
    addEventListeners();
}

init();
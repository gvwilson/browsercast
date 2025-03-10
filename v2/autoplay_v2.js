const slideNavBar = document.querySelector('#slide-navigation-container');
const audioBars = document.querySelectorAll('audio-controls');
const toggleSliderBtn = document.querySelector('.slider');
let visibleState = 1; // 1 means it is visible
let autoplayEnabled = false;

function hideAudioBars() {
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

function toggleVisibility(state) {
    if (state) { 
        // make controls visible 
        slideNavBar.classList.remove('hide');
        console.log("making controls visible + " + visibleState); 
        if (audioBars.length > 0) {
            hideAudioBars();
        }
        visibleState = 0;
    } else {
        // hide controls 
        closeSlideNav(); 

        slideNavBar.classList.add('hide');
        console.log("trying to hide controls + " + visibleState); 
        if (audioBars.length > 0) {
            console.log("i want to hide the audio bar"); 
            hideAudioBars();
        }
        // setTimeout(() => {
        //     slideNavBar.classList.add('hide');
        //     if (audioBars.length > 0){
        //         hideAudioBars();
        //     }
        //     // visibleState = 0;
        // }, 500);

        visibleState = 1;
    }
}

function addEventListeners () {
    toggleSliderBtn.addEventListener('click', () => {
        if (visibleState) { 
            // hiding controls 
            closeSlideNav();

            setTimeout(() => {
                slideNavBar.classList.add('hide');
                console.log("hiding AUDIO and length is " + audioBars.length); 

                if (audioBars.length > 0){
                    hideAudioBars();
                }
                visibleState = 0;
            }, 500);
            autoplayEnabled = true; 

        } else { 
            // making controls visible 
            slideNavBar.classList.remove('hide');
            if (audioBars.length > 0){
                hideAudioBars();
            }
            visibleState = 1;
            autoplayEnabled = false;

        }
    });

    document.addEventListener('mouseover', () => {

        if (autoplayEnabled) {
            // mouseover only works when autoplay is on 
            toggleVisibility(1); 
            setTimeout(()=>{
                toggleVisibility(0); 
            }, 3000)
        }
    })
}

function init () {
    addEventListeners();
}

init();
const slideNavBar = document.querySelector('#slide-navigation-container');
const audioBars = document.querySelectorAll('audio-controls');
const toggleSliderBtn = document.querySelector('.slider');
let visibleState = 1; // 1 means it is visible

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

function addEventListeners () {
    toggleSliderBtn.addEventListener('click', () => {
        if (visibleState) {
            closeSlideNav();

            setTimeout(() => {
                slideNavBar.classList.add('hide');
                if (audioBars.length > 0){
                    hideAudioBars();
                }
                visibleState = 0;
            }, 500);
        } else {
            slideNavBar.classList.remove('hide');
            if (audioBars.length > 0){
                hideAudioBars();
            }
            visibleState = 1;
        }
    });
}

function init () {
    addEventListeners();
}

init();
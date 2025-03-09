const slideNavBar = document.querySelector('#slide-navigation-container');
const audioBars = document.querySelectorAll('audio-controls');
const toggleBtn = document.querySelector('.slider');
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

function addEventListeners () {
    toggleBtn.addEventListener('click', () => {
        if (visibleState) {
            slideNavBar.classList.add('hide');
            if (audioBars.length > 0){
                hideAudioBars();
            }
            visibleState = 0;
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
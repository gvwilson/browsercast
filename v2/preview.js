const slideOne = document.getElementById('slide-1'); 
const previewAll = document.querySelector('.preview-all');
const previewSlider = document.querySelector('.preview-slider');
const arrowBtn = document.querySelector('.right-arrow');

const referenceWidth = 954;
const referenceHeight = 898;

// take out all the preview slider outside the slide div 
function moveElementToAbove(targetElement, referenceElement) {
    // Ensure both target and reference elements are valid
    if (targetElement && referenceElement) {
        const parent = targetElement.parentElement;
        parent.removeChild(targetElement);
        // Insert the target element before the reference element
        referenceElement.parentElement.insertBefore(targetElement, referenceElement);
    }
    }

function scaleDiv(div, containerElement) {
    const containerWidth = containerElement.clientWidth;
    const containerHeight = containerElement.clientHeight;
    const scaleFactor = Math.min(containerWidth / referenceWidth, containerHeight / referenceHeight);
    div.style['-webkit-transform'] = 'scale(' + scaleFactor + ')';
}

function createThumbnails() {
    const slides = document.querySelectorAll('div.slide');
    
    slides.forEach((slide, i) => {
        const thumbnailWrap = document.createElement('div');
        thumbnailWrap.classList.add('thumbnail-wrap'); 

        // Thumbnail number 
        const text = document.createElement('p');
        text.setAttribute('class', 'thumbnail-number');
        text.textContent = `${i + 1}`; 

        // Creating the thumbnail for each slide
        // Uses HTML cloning and scaling inspired from https://github.com/gnab/remark
        const thumbnail = document.createElement('div');
        const slideClone = document.createDocumentFragment();
 
        Array.from(slide.children).forEach(child => {
            if (!(child.closest('.controls-container') || child.closest('.page-num'))){
                slideClone.appendChild(child.cloneNode(true));
            }
        });

        thumbnail.appendChild(slideClone);
        thumbnail.classList.add('thumbnail');

        // Add event listener for slide navigation
        thumbnail.setAttribute('id', `thumbnail-${i + 1}`); 
        thumbnail.addEventListener('click', () => navigateToSlide(i + 1));
        
        // Build the HTML structure for the preview
        thumbnailWrap.appendChild(text); 
        thumbnailWrap.appendChild(thumbnail); 
        previewSlider.appendChild(thumbnailWrap);

        scaleDiv(thumbnail, previewSlider); 
        window.addEventListener('resize', scaleDiv(thumbnail, thumbnailWrap));
    });
}


// Navigate to the clicked slide
function navigateToSlide(slideNumber) {
    const targetSlide = document.getElementById(`thumbnail-${slideNumber}`);
    if (targetSlide) {
        window.location.hash = `slide-${slideNumber}`;
    }
}

// Highlight the current slide in the filmstrip
function highlightCurrentSlide() {
    const slides = document.querySelectorAll('.slide');
    const thumbnails = document.querySelectorAll('.thumbnail');
    
    slides.forEach((slide, index) => {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if(thumbnails[index]){
                        thumbnails[index].classList.add('highlight');
                        thumbnails[index].scrollIntoView();
                        previewSlider.scrollTop -= 20;
                    }
                } else {
                    if(thumbnails[index]){
                        thumbnails[index].classList.remove('highlight');
                    }
                }
            });
        }, { threshold: 0.5 });
        observer.observe(slide);
    });
}

// Initialize the slide navigation preview
function init() {
    moveElementToAbove(previewAll,slideOne);
    createThumbnails();
    highlightCurrentSlide();

    toggleBtn = document.getElementById('toggle');
    toggleBtn.addEventListener('click', () => {
        previewSlider.classList.toggle('open');
        toggleBtn.classList.toggle('open');
    });
}

init();


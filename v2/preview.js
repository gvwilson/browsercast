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
        // Get the parent of the target element
        const parent = targetElement.parentElement;
        // Remove the target element from its current position
        parent.removeChild(targetElement);
        // Insert the target element before the reference element
        referenceElement.parentElement.insertBefore(targetElement, referenceElement);
    }
    }

function scaleDiv(div, containerElement) {
    console.log("is this runnning");

  const containerWidth = containerElement.clientWidth;
  const containerHeight = containerElement.clientHeight;

  const scaleFactor = Math.min(containerWidth / referenceWidth, containerHeight / referenceHeight);
  div.style['-webkit-transform'] = 'scale(' + scaleFactor + ')';
}

// Function to create thumbnails for each slide using html2canvas 
function createThumbnails() {
    const slides = document.querySelectorAll('div.slide');
    
    slides.forEach((slide, i) => {
        // div that wraps all 
        const thumbnailWrap = document.createElement('div');
        thumbnailWrap.classList.add('thumbnail-wrap'); 
        // const thumbnailContent = document.createElement('div');
        // thumbnailContent.classList.add('thumbnail-content'); 
        // thumbnail.appendChild(thumbnailContent);

        // thumbnail number 
        // const thumbnailNum = document.createElement('span'); 
        // thumbnailNum.classList.add('thumbnail-number'); 
        // thumbnailNum.innerHTML = i+1; 
        const text = document.createElement('p');
        text.setAttribute('class', 'thumbnail-number');
        text.textContent = `${i + 1}`; 

        // screenshot of each slides 
        const thumbnail = document.createElement('div');


        const slideClone = document.createDocumentFragment();
 
        // Loop through each child of the parent div and clone it
        Array.from(slide.children).forEach(child => {
            if (!(child.closest('.controls-container') || child.closest('.page-num'))){
                slideClone.appendChild(child.cloneNode(true));
            }
        });

        // const unwantedElements = slideClone.querySelectorAll('.audio-bar-container, .page-number');
        // unwantedElements.forEach(element => element.remove());

        thumbnail.appendChild(slideClone);
        thumbnail.classList.add('thumbnail');

        // thumbnail.classList.add('slide');
        thumbnail.setAttribute('id', `thumbnail-${i + 1}`); 
        thumbnail.addEventListener('click', () => navigateToSlide(i + 1));
        

        thumbnailWrap.appendChild(text); 
        thumbnailWrap.appendChild(thumbnail); 
        previewSlider.appendChild(thumbnailWrap);

        scaleDiv(thumbnail, previewSlider); 
        window.addEventListener('resize', scaleDiv(thumbnail, thumbnailWrap));

        toggleBtn = document.getElementById('toggle');
        toggleBtn.addEventListener('click', () => {
            previewSlider.classList.toggle('open');
            toggleBtn.classList.toggle('open');
        });
    });
}


// Navigate to the clicked slide
function navigateToSlide(slideNumber) {
    const targetSlide = document.getElementById(`thumbnail-${slideNumber}`);
    if (targetSlide) {
        window.location.hash = `slide-${slideNumber}`;
        // targetSlide.scrollIntoView();
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

// Initialize the preview slide navigation 
function init() {
    moveElementToAbove(previewAll,slideOne);
    createThumbnails();
    highlightCurrentSlide();
}

init();


const slideOne = doc.getElementById('slide-1'); 
const previewAll = doc.querySelector('.preview-all');
const previewSlider = doc.querySelector('.preview-slider');
const arrowBtn = doc.querySelector('.right-arrow');

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

// Function to create thumbnails for each slide using html2canvas 
function createThumbnails() {
    const slides = doc.querySelectorAll('div.slide');
    slides.forEach((slide, i) => {
        // div that wraps all 
        const thumbnailWrap = doc.createElement('div');
        thumbnailWrap.classList.add('thumbnail-wrap'); 

        // thumbnail number 
        const thumbnailNum = doc.createElement('span'); 
        thumbnailNum.classList.add('thumbnail-number'); 
        thumbnailNum.innerHTML = i+1; 

        // screenshot of each slides 
        const thumbnail = doc.createElement('img');

        html2canvas(slide).then(canvas => {
            thumbnail.src = canvas.toDataURL('image/png');
        });

        thumbnail.classList.add('thumbnail');
        thumbnail.setAttribute('id', `thumbnail-${i + 1}`); 
        thumbnail.addEventListener('click', () => navigateToSlide(i + 1));

        thumbnailWrap.appendChild(thumbnailNum); 
        thumbnailWrap.appendChild(thumbnail); 

        previewSlider.appendChild(thumbnailWrap);
    });
}

// Navigate to the clicked slide
function navigateToSlide(slideNumber) {
    const targetSlide = document.getElementById(`thumbnail-${slideNumber}`);
    if (targetSlide) {
        window.location.hash = `slide-${slideNumber}`;
        targetSlide.scrollIntoView();
    }
}

// Highlight the current slide in the filmstrip
function highlightCurrentSlide() {
    const slides = doc.querySelectorAll('.slide');
    const thumbnails = document.querySelectorAll('.thumbnail');
    slides.forEach((slide, index) => {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    thumbnails[index].classList.add('highlight');
                } else {
                    thumbnails[index].classList.remove('highlight');
                }
            });
        }, { threshold: 0.5 });
        observer.observe(slide);
    });
}

// Initialize the preview slide navigation 
function init() {
    moveElementToAbove(previewAll,slideOne);

    if(arrowBtn){
        arrowBtn.addEventListener('click', (event)=> {
            previewSlider.classList.toggle('hidden');
            event.stopPropagation(); // Prevent the click from triggering the parent listener
        });
    }
    
    createThumbnails();
    highlightCurrentSlide();
}

init();
const slideOne = doc.getElementById('slide-1'); 
const previewAll = doc.querySelector('.preview-all');
const previewSlider = doc.querySelector('.preview-slider');
const arrowBtn = doc.querySelector('.right-arrow');

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
        const thumbnail = doc.createElement('div');

        // html2canvas(slide).then(canvas => {
        //     thumbnail.src = canvas.toDataURL('image/png');
        // });

        const slideClone = document.createDocumentFragment();
        // const slideClone = slide.cloneNode(true);
        // Remove audio and slide number from clone 
        //slideClone.classList.add('preview-slide');

        // Loop through each child of the parent div and clone it
        Array.from(slide.children).forEach(child => {
            slideClone.appendChild(child.cloneNode(true));
        });

        const unwantedElements = slideClone.querySelectorAll('.audio-bar-container, .page-number');
        unwantedElements.forEach(element => element.remove());


        // // Clear all classes
        // slideClone.querySelectorAll('*').forEach(element => {
        //     slideClone.className = ''; 
        // });

        thumbnail.appendChild(slideClone);


        // thumbnail.innerHTML = slideHTML; 

        // copying the inner HTML 
        // const audioBar = slide.querySelector('.audio-bar-container');
        // const slideHTML = slide.innerHTML;

        thumbnail.classList.add('thumbnail');

        thumbnail.classList.add('slide');
        thumbnail.setAttribute('id', `thumbnail-${i + 1}`); 
        thumbnail.addEventListener('click', () => navigateToSlide(i + 1));
        

        thumbnailWrap.appendChild(thumbnailNum); 
        thumbnailWrap.appendChild(thumbnail); 
        //thumbnailWrap.appendChild(slideClone);
        
        previewSlider.appendChild(thumbnailWrap);

        // const thumbnailSlide = doc.querySelector(`thumbnail-${i + 1}`); 


        // 
        const containerElement = doc.querySelector(".preview-slider");
                //console.log("inside our sidebar" + containerElement.innerHTML); 
        console.log(containerElement.clientHeight +" and " + thumbnailWrap.clientWidth);
        
        scaleDiv(thumbnail, containerElement); 
        window.addEventListener('resize', scaleDiv(thumbnail, thumbnailWrap));




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
            
            const previwSlides = doc.querySelectorAll('div.thumbnail');
            
            // console.log(previewSlider.clientWidth)
            //     previwSlides.forEach((slide)=>{
            //     scaleElementToFit(previewSlider, slide);
            // })

            // const containerElement = document.querySelector(".preview-slider"); 
            // if(containerElement){
            //     initializeScaling(slide, containerElement, '954:898');
            // }

        });
    }
    
    createThumbnails();
    highlightCurrentSlide();
}

init();


// Inspired by https://yihui.org/en/2023/09/snap-slides/
const audioState = {};
let isScrolling = false;

(function(doc) {
    let page = doc.body;  // <body> is container of slides

    // Is this a plain <hr> separator?
    function isSep(el) {
        return (el.tagName === 'HR') && (el.attributes.length === 0);
    }

    // Set attribute on element by creating a div and copying the attribute over.
    function setAttr(el, attr) {
        const m = newElement('div');
        m.innerHTML = `<div ${attr}></div>`;
        const attrs = m.firstElementChild.attributes;
        for (let i = 0; i < attrs.length; i++) {
            let a = attrs[i];
            el.setAttribute(a.name, a.value);
        }
        m.remove();
    }

    // Create new element with given class.
    function newElement(tag, cls) {
        const el = doc.createElement(tag);
        if (cls) {
            el.className = cls;
        }
        return el;
    }

    // Create a new slide.
    function newSlide(s) {
        return (s?.innerText === '') ? s : newElement('div', 'slide');
    }

    // Create slides from content.
    function createSlides() {
        let el = page.firstElementChild;

        // Skip sidebar
        while (el && (el.id === 'slide-navigation-container' || el.id === 'autoplay-container')){
            el = el.nextElementSibling;
        }
        
        // no slides
        if (!el) {
            return false;
        }
        // insert first slide
        let s = newSlide();
        el.before(s);
        while (true) {
            // look at next element in page
            let el = s.nextSibling;
            // if no next element, we're done
            if (!el) {
                break;
            }
            // if this is a slide separator, remove it and start a new slide
            if (isSep(el)) {
                s = newSlide(s);
                el.before(s);
                el.remove();
            }
            // if this is explicitly a new slide, add it
            else if (el.classList?.contains('slide')) {
                s = newSlide(s);
                el.after(s);
            }
            // otherwise, append content to current slide
            else {
                s.append(el);
            }
        }
        return true; // slides were found
    }

    // Add slide number as ID.
    function addSlideId(slide, i) {
	slide.setAttribute('id', `slide-${i + 1}`);
    }

    // Update URL to reflect current slide.
    function addSlideObserver(slide) {
	// slide === entries[0] in the handler below
	function obs(entries, observer) {
        slideId = slide.getAttribute('id');
        audioControls = slide.querySelector('audio-controls'); 


	    if (entries[0].isIntersecting) {
            window.location.hash = slideId;
            console.log(`slide ${slideId} enter`);

            // Remove "active" class from all slides
            document.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));

            // add "active" class to the current slide
            slide.classList.add('active'); 

            if (audioControls){
                audio = audioControls.shadowRoot.querySelector('audio');
                if (audio) {
    
                    if(autoplayEnabled){
                        // only replay audio when autoplay is on 
                        audio.play();
                    } else {
                        // Check if audio has been played before and play the audio once 
                        if (!audioState[slideId]){
                            audio.play();
                            audioState[slideId] = true;
                        } else {
                            console.log('Audio already played before.');
                        }
                    }
                }
            }
	    }
	    else {
            console.log(`slide ${slideId} exit`);
            if (audioControls) {
                audio = audioControls.shadowRoot.querySelector('audio');
                audio.pause();
                audio.currentTime = 0.0;
            }
	    }
	}
	const observer = new IntersectionObserver(obs, {threshold: 0.5});
	observer.observe(slide);
    }

    // Add page number to top right.
    function addPageNumber(slide, i, numSlides) {
	const header = newElement('span', 'page-num');
	slide.append(header);
        const pageNum = newElement('span', 'page-number');
        pageNum.innerText = `${i + 1}/${numSlides}`;
    header.append(pageNum);
    }

    // Apply slide attributes in <!--# --> comments.
    function applyDirectives(slide) {
        const pattern = /[\s\n]class="([^"]+)"/;
        for (let node of slide.childNodes) {
            if (node.nodeType !== Node.COMMENT_NODE) {
                continue;
            }
            let directive = node.textContent;
            if (!/^#/.test(directive)) {
                continue;
            }
            directive = directive.replace(/^#/, '');
            const m = directive.match(pattern);
            if (m) {
                directive = directive.replace(pattern, '').trim();
                slide.className += ' ' + m[1];
            }
            if (directive) {
                setAttr(slide, directive);
            }
            break;
        }
    }

    // Apply slide audio states & format
    function initAudioState(){
        const audio = doc.querySelectorAll('audio');
        audio.forEach( a => {
            slideId = a.closest('div.slide').id;
            audioState[slideId] = false;
        });
    }

    // modify slides to include IDs, page numbers, embedded directives,
    // and audio auto-play
    function decorateSlides() {
        const slides = doc.querySelectorAll('div.slide');
        const numSlides = slides.length;
        slides.forEach((s, i) => {
	    addSlideId(s, i);
        addPageNumber(s, i, numSlides);
        applyDirectives(s);
	    addSlideObserver(s);
        });
    }

    // set up and run
    function main(doc) {
        page.classList.add('slide-container');
        if (!createSlides()) {
            return;
        }
        decorateSlides();
        initAudioState();

        const slides = document.querySelectorAll('.slide');
        slides[0].classList.add('active');

        // TODO: Handle Prolonged Keyboard Events
        // TODO: Allow scrolling to trigger slide changes
        
        // press 'f' for fullscreen mode and 'o' for overview
        doc.addEventListener('keyup', (evt) => {
            if (evt.target !== doc.body) {
                return;
            }
            const slides = document.querySelectorAll('.slide');
            const curr = document.querySelector('.active');
            const index = Array.from(slides).indexOf(curr);

            if (evt.key === 'f') {
                doc.documentElement.requestFullscreen();
            }
            else if (evt.key === 'o') {
                doc.body.classList.toggle('overview');
            } 
            else if (evt.key === 'ArrowDown') {
                evt.preventDefault();
                if (index + 1 < slides.length){
                    slides[index].classList.remove('active');
                    slides[index + 1].classList.add('active');
                }
            }
            else if (evt.key === 'ArrowUp'){
                evt.preventDefault();
                if (index - 1 >= 0){
                    slides[index].classList.remove('active');
                    slides[index - 1].classList.add('active');
                }
            }
            sessionStorage.setItem('body-class', doc.body.className);
        });
        
        // restore previously saved body class
        const bc = sessionStorage.getItem('body-class');
        if (bc) {
            doc.body.className += ' ' + bc;
        }
    }

    // run
    main(doc);
})(document);

// Inspired by https://yihui.org/en/2023/09/snap-slides/
const audioState = {};
 isAudioInitialized = false;

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
        while (el && el.id === 'slide-navigation-container'){
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
	    if (entries[0].isIntersecting) {
		window.location.hash = slideId;
		console.log(`slide ${slideId} enter`);
		audioControls = slide.querySelector('audio-controls'); 
        if (audioControls){
            audio = audioControls.shadowRoot.querySelector('audio');
            if (audio) {
                // Check if audio has been played before
                if (!audioState[slideId]){
                    audio.play();
                    audioState[slideId] = true;
                } else {
                    console.log('Audio already played before.')
                }
            }
        }
	    }
	    else {
		console.log(`slide ${slideId} exit`);
		audio = slide.querySelector('audio');
		if (audio) {
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

        // Scroll to next slide from start slide
        const startButton = doc.getElementById('start');
        startButton.addEventListener('click', () => {
            const slides = doc.querySelectorAll('div.slide');
            slides[1].scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            })
        });
        
        // press 'f' for fullscreen mode and 'o' for overview
        doc.addEventListener('keyup', (evt) => {
            if (evt.target !== doc.body) {
                return;
            }
            if (evt.key === 'f') {
                doc.documentElement.requestFullscreen();
            }
            else if (evt.key === 'o') {
                doc.body.classList.toggle('overview');
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

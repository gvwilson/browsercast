// Inspired by https://yihui.org/en/2023/09/snap-slides/

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
	    if (entries[0].isIntersecting) {
		window.location.hash = slide.getAttribute('id');
		console.log(`slide ${slide.getAttribute('id')} enter`);
		audio = slide.querySelector('audio');
		if (audio) {
		    audio.play();
		}
	    }
	    else {
		console.log(`slide ${slide.getAttribute('id')} exit`);
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

    // Add page number to bottom right.
    function addPageNumber(slide, i, numSlides) {
	const footer = newElement('span', 'footer');
	slide.append(footer);
        const pageNum = newElement('span', 'page-number');
        pageNum.innerText = `${i + 1}/${numSlides}`;
	footer.append(pageNum);
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

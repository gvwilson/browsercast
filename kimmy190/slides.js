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
    // deleted the audio to prevent autoplay 
	function obs(entries, observer) {
	    if (entries[0].isIntersecting) {
		window.location.hash = slide.getAttribute('id');
		console.log(`slide ${slide.getAttribute('id')} enter`);
		audio = slide.querySelector('audio');
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

    // Add page number to top right.
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
    // and audio auto-play <- deleted it 
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

    // js functions to implement all features 
    function audioBarFeature(){
        const slides = doc.querySelectorAll('div.slide');

        // iterate each slide to add functions for the audio bar 
        slides.forEach((slide)=>{ 
            const audio = slide.querySelector('audio');
            if (audio === null){
                return;
            } 
            const playPauseBtn = slide.querySelector('.playPauseBtn');
            const timeDisplay = slide.querySelector('.timeDisplay');
            const seekBar = slide.querySelector('.seekBar');
            const volumeBtn = slide.querySelector('.volumeBtn');
            const volumeControl = slide.querySelector('.volumeControl');
            const playbackSpeed = slide.querySelector('.playbackSpeed'); 

            // play/pause functionality
            playPauseBtn.addEventListener('click', () => {
                if (audio.paused) {
                    audio.play();
                    playPauseBtn.className = 'fa-solid fa-pause pointer';
                } else {
                    audio.pause();
                    playPauseBtn.className = 'fa-solid fa-play pointer';
                }
            });

            // update seek bar
            audio.addEventListener('timeupdate', () => {
                seekBar.value = (audio.currentTime / audio.duration) * 100;
                timeDisplay.textContent = formatTime(audio.currentTime) + " / " + formatTime(audio.duration);
            });

            // seek audio
            seekBar.addEventListener('input', () => {
                audio.currentTime = (seekBar.value / 100) * audio.duration;
            });

            // volume control
            volumeControl.addEventListener('input', () => {
                audio.volume = volumeControl.value;
            });

            // toggle volume slider on hover
            volumeBtn.addEventListener('mouseover', () => {
            volumeControl.classList.toggle('hidden');
            });

            // hide the slider when clicking outside
            doc.addEventListener('click', (event) => {
                if (!volumeBtn.contains(event.target) && !volumeControl.contains(event.target)) {
                    volumeControl.classList.add('hidden');
                }
            });

            // playback speed control
            playbackSpeed.addEventListener('change', () => {
                audio.playbackRate = playbackSpeed.value;
            });

            // set initial duration once metadata is loaded
            audio.addEventListener('loadedmetadata', () => {
                timeDisplay.textContent = `0:00 / ${formatTime(audio.duration)}`;
            });

            // reset everything once audio ends 
            audio.addEventListener('ended', ()=>{
                setTimeout(()=>{
                    // reset logo 
                    playPauseBtn.className = 'fa-solid fa-play pointer';
                    // reset time 
                    timeDisplay.textContent = `0:00 / ${formatTime(audio.duration)}`;
                    // reset seek bar 
                    seekBar.value = 0;
                    // reset playback speed & audio rate 
                    playbackSpeed.value = 1.0;
                    audio.playbackRate = 1.0;
                }, 800)  
            })

        })
    }

    // format time for the audio bar 
    function formatTime(seconds) {
        let minutes = Math.floor(seconds / 60);
        let secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }

    // put the audio tag inside the custom audio playback bar 
    function newAudioBar(){
        // select audio & src tag 
        const audioTags = doc.querySelectorAll('audio');

        audioTags.forEach(audioTag => {
            // create the outer div element that wraps around all the feature 
            const audioPlayerDiv = newElement('div', 'audio-player');

            // add customized features into the new div
            audioPlayerDiv.innerHTML = `
                <i class="fa-solid fa-play pointer playPauseBtn"></i>
                <input class="seekBar" type="range" min="0" value="0">
                <span class="timeDisplay"></span>
                <i class="fa-regular fa-closed-captioning pointer caption"></i>
                <i class="fa-solid fa-volume-high pointer volumeBtn"></i>
                <input class="volumeControl hidden" type="range" min="0" max="1" step="0.01" value="1">
                <select class="playbackSpeed">
                    <option value="0.5">0.5x</option>
                    <option value="1" selected>1.0x</option>
                    <option value="1.5">1.5x</option>
                    <option value="2">2x</option>
                </select>
            `;

            // add the customized audio bar before the audio tag 
            audioTag.parentNode.insertBefore(audioPlayerDiv, audioTag);

            // move the audio tag inside the customized div 
            audioPlayerDiv.appendChild(audioTag);
        }); 

        audioBarFeature();

    } 

    // set up and run
    function main(doc) {
        page.classList.add('slide-container');
        if (!createSlides()) {
            return;
        }
        decorateSlides(); 
        
        newAudioBar(); 
        
        // press 'f' for fullscreen mode and 'o' for overview
        // navigate to each slide by clicking its slide number 
        doc.addEventListener('keyup', (evt) => {
            const numSlides = document.querySelectorAll('.slide').length;
            if (evt.target !== doc.body) {
                return;
            }
            if (evt.key === 'f') {
                doc.documentElement.requestFullscreen();
            }
            else if (evt.key === 'o') {
                doc.body.classList.toggle('overview');
            }
            else if (evt.key >= '0' && evt.key <= numSlides.toString()) {
                const slideNumber = evt.key; // get the pressed number
                const targetSlide = document.getElementById(`slide-${slideNumber}`);

                if (targetSlide) {
                    window.location.hash = `slide-${slideNumber}`; // update url 
                    targetSlide.scrollIntoView(); // navigate to slide clicked 
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

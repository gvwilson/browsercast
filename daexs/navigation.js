{
    class SlideNavigation extends HTMLElement {
        curr_slide = 1;

        constructor() {
            super();

            this.attachShadow({mode: 'open'})
            this.render();
            this.addEventListeners();
        }

        addEventListeners() {
            this.toggleBtn.addEventListener('click', () => {
                this.sidebar.classList.toggle('open');
                this.toggleBtn.classList.toggle('open');
            });

            document.addEventListener('DOMContentLoaded', () => {
                this.populateSlides();
                this.highlightSlide();
            });

            window.addEventListener('hashchange', () => {
                this.highlightSlide();
            });
        }

        populateSlides() {
            const slides = document.querySelectorAll('.slide');
            slides.forEach((slide, idx) => {
                const div = document.createElement('div');
                div.setAttribute('class', 'thumbnail-container');
                const text = document.createElement('p');
                text.setAttribute('class', 'thumbnail-num');
                text.textContent = `${idx + 1}`; 
                div.appendChild(text);

                const li = document.createElement('li');
                div.appendChild(li);
                // li.textContent = `Slide ${idx + 1}`;
                li.setAttribute('id', `slide-${idx + 1}-li`);

                // Add event listeners for slides to jump to is
                li.addEventListener('click', () => {
                    this.jumpToSlide(idx + 1);
                    // this.highlightSlide();
                });

                this.slideList.appendChild(div);

                // Add thumbnail
                html2canvas(slide, {
                    ignoreElements: (element) => {
                        if (element.closest('.controls-container') || element.closest('.page-num')) {
                            return true;  // Ignore in screenshot
                        }
                        return false;
                    }
                }).then(canvas => {
                    const imageUrl = canvas.toDataURL("image/png");
                    const img = document.createElement('img');
                    img.src = imageUrl;
                    li.appendChild(img);
                })
            });

        }

        jumpToSlide(slideNum) {
            window.location.hash = `slide-${slideNum}`; // update url 
            const target = document.getElementById(`slide-${slideNum}`);
            target.scrollIntoView();
        }

        highlightSlide() {
            const hash = window.location.hash;
            const slideNum = hash.split('-')[1];
            const slide = this.shadowRoot.querySelector(`#slide-${slideNum}-li`);
            
            // Remove previous highlights
            const oldSlide = this.shadowRoot.querySelector('.current-slide');
            if (oldSlide) {
                oldSlide.classList.remove('current-slide');
            }

            if (slide) { 
                slide.classList.add('current-slide');
            }
        }

        render(){
            this.shadowRoot.innerHTML = ` 
            <link rel="stylesheet" href="navigation.css">
            <div id="slide-navigation">
                <div class="toggle-btn" id="toggle"> <span></span> </div>
                <div id="sidebar">
                    <ul id="slide-list"> </ul>
                </div>
            </div>`;

            this.toggleBtn = this.shadowRoot.querySelector('#toggle');
            this.sidebar = this.shadowRoot.querySelector('#sidebar');
            this.slideList = this.shadowRoot.querySelector('#slide-list');
        }

    }

    customElements.define('slide-nav', SlideNavigation);
}
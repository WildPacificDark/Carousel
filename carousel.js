class Carousel {
  constructor(
    {
	    anim = {
		    duration: 1000, // Animation length (in milliseconds)
		    change: 7000, // How much time needs to pass before we change the slide
		    timing: 'ease', // Animation Timing Function
		    availSlides: 3, // Number of slide
		    autoStart: true, // The carousel will automatically start?
		    restart: false, // The carousel will restart automatically after the user has manually changed the slide?
        transition: [
          { prev: 'left', next: 'right' },
          { prev: 'down', next: 'up' },
          { prev: 'fadeout', next: 'fadein'}
        ]
	    },
      image = [],
      heading = { 
        h1: { text: 'Carousel!', anim: typewriter },
		    h2: { text: ["Some Text!", "Some Text!", "Some Text!"], anim: [slideRight, slideLeft, rotate] },
		    h3: { text: ["Some Button!", "Some Button", "Some Button!"], anim: [] }
	    },
    } = {}
  ) {
    
	  this.anim = anim;
	  this.image;
	  this.heading = heading;
    this.heading.h1.elem = null;
    this.heading.h2.elem = [];
    this.heading.h1.elem = [];
    
    this.prevSlide = 0;
	  this.curSlide = 0;
    this.nextSlide = 0;
      
    // Check if the animation is running
    this.isRunning = false;
    
    // Autoslide interval
    this.interval;
    
    // Container
    this.container = document.querySelector('.carousel');
    this.slides = null;
    
    // Indicators
    let indicators = this.#create('ol');
    indicators.setAttribute('class', 'carousel-indicators');
    for(let i = 0; i < this.availSlides; ++i) {
      let li = this.#create('li');
      if(!i) li.setAttribute('class', 'active');
      li.setAttribute('data-index', i);
      indicators.appendChild(li);
    }
    this.container.appendChild(indicators);
    this.#indicators = document.querySelectorAll('.carousel-indicators li');
    
    // Arrows
	  this.#arrows = [];
	  for(let i = 0; i < 2; ++i) {
	    this.#arrows[i] = this.#create('div')
	    this.#arrows[i].setAttribute('class', `carousel-arrow ${!i ? 'left' : 'right'}`);
	    this.#arrows[i].appendChild(this.#create('span'));
	    this.container.appendChild(this.#arrows[i]);
	  }
    
    // Slide Container
    let slideContainer = this.#create('div');
    slideContainer.setAttribute('class', 'carousel-item-container');
	
    // Heading 1
    let carouselHeading = this.#create('div');
    carouselHeading.setAttribute('class', 'carousel-heading');
    this.heading.h1.elem = this.#create('h1');
    this.heading.h1.elem.innerHTML = this.heading.h1.text;
    carouselHeading.appendChild(this.heading.h1.elem);
    slideContainer.appendChild(carouselHeading);
    
    // Slides
    for(let i = 0; i < this.availSlides; ++i) {
      this.slides = this.#create('div');
      this.slides.setAttribute('class', !i ? 'carousel-item' : 'carousel-item disabled');
      this.slides.setAttribute('style', `background-image:url('${image[i]}')`);
      // Heading 2
      let caption = this.#create('div');
      caption.setAttribute('class', 'carousel-caption');
      this.heading.h2.elem[i] = this.#create('h2');
      this.heading.h2.elem[i].innerHTML = this.heading.h2.text[i];
      // Cover
      let carouselCover = this.#create('div');
      carouselCover.setAttribute('class', 'carousel-cover');
      caption.appendChild(this.heading.h2.elem[i]);
      caption.appendChild(carouselCover);
      this.slides.appendChild(caption);
      slideContainer.appendChild(this.slides);
    }
    this.container.appendChild(slideContainer);
    
    // Add event listeners to dots
    for(let i = 0; i <= this.availSlides; ++i) {
      this.#indicators[i].addEventListener('click', (e) => {
        if(!this.isRunning) { this.#changeSlideFromDot(e.target); }
      }, false);
    }
    
    // Add event listeners to arrows
    for(let i = 0; i < 2; ++i) {
      this.#arrows[i].addEventListener('click', (e) => {
        if(!this.isRunning) { this.#changeSlideFromArrow(e.target); }
      }, false);
    }
    
    //Set Animation Duration and Timing Function
    this.#root = document.querySelector(':root');
    this.#root.style.setProperty('--animationDuration', `${(this.anim.duration / 1000).toString()}s`);
    this.#root.style.setProperty('--animationTiming', `${this.anim.timing}`);
    
    // Start the slideShow
    this.start = () => {
      this.interval = setInterval(
        () => { 
          this.#autoShow();
        }, this.anim.change
      );
    };
    
    // Stop the slideShow
    this.end = () => { clearInterval(this.interval); };
    
    if(this.autoStart) this.start();
    
    // Typewriter Effect
    this.typewriterEffectH1 = heading.h1.typewriter;
    // Not implemented yet
    this.typewriterEffectH2 = heading.h2.typewriter;
    this.typewriterAnimation = null;
  }
  
  get availSlides() { return this.anim.availSlides - 1; }
  get activeDot() { return this.container.querySelector('.carousel-indicators .active'); }
  
  #create(tag) { return document.createElement(tag); }
  
  // Automatic slideShow
  #autoShow() {
    this.prevSlide = this.nextSlide;
    if(this.nextSlide >= this.availSlides) { this.nextSlide = 0; }
    else { ++this.nextSlide; }
    this.changeSlide(this.anim.transition[this.prevSlide].next);
  }
  
  #changeSlideFromDot(elem) {
    // Check if user clicked the same dot
    if(elem.dataset.index != this.nextSlide) {
      // Prevent other clicks before animation is complete
      this.isRunning = true;
      // Stop the auto slideShow
      this.end();
      // prevSlide is the current slide
      this.prevSlide = this.nextSlide;
      // nextSlide is the slide to show
      this.nextSlide = elem.dataset.index;
      // Right to left
      if(elem.dataset.index > this.prevSlide) { this.changeSlide(this.anim.transition[this.prevSlide].next); }
      // Left to right
      else { this.changeSlide(this.anim.transition[this.prevSlide].prev); }
      // If restart is true, then restart the slideShow
      if(this.autoRestart) this.start();
    }
  }
  
  #changeSlideFromArrow(elem) {
    this.isRunning = true;
    this.end();
    const index = Number((this.activeDot).dataset.index);
    if(elem.classList.contains(this.anim.transition[this.prevSlide].prev)) {
      if(index === 0) {
        this.prevSlide = 0;
        this.nextSlide = this.availSlides;
      } else {
        this.prevSlide = this.nextSlide;
        this.nextSlide = index - 1;
      }
      this.changeSlide(this.anim.transition[this.prevSlide].prev);
    } else {
      if(index === this.availSlides) {
        this.prevSlide = this.availSlides;
        this.nextSlide = 0;
      } else {
        this.prevSlide = this.nextSlide;
        this.nextSlide = index + 1;
      }
      this.changeSlide(this.anim.transition[this.prevSlide].next);
    }
    if(this.autoRestart) this.start();
  }
  
  // Change slide
  changeSlide(_class) {
    // First, we'll put the slide to show to the (right\left | up\down)
    this.slides[this.nextSlide].className = `carousel-item ${_class}`;
    
    // Then we'll perform the animation
    this.slides[this.prevSlide].className = `carousel-item carousel-prev ${_class}`;
    this.slides[this.nextSlide].className = `carousel-item carousel-next ${_class}`;
    
    // Change active dots
    this.#indicators[this.prevSlide].classList.toggle("active");
    this.#indicators[this.nextSlide].classList.toggle("active");
	
    // Wait animationDuration seconds before disabling the former active slide
    setTimeout(() => {
      this.slides[this.prevSlide].className = "carousel-item disabled";
      this.slides[this.nextSlide].className = "carousel-item";
      this.isRunning = false;
    }, this.anim.duration);
  }
}

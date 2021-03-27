/**
 * Author: Elia Vettoretto
 * Original Date:   23/04/2020
 * Title:  Animated Carousel
 * Last Version: 1.1
*/
class Carousel {
  constructor(
    {
      animationDuration = 700, 
      timeBeforeChange = 7000,
      autoStart = true,
      autoRestart = false,
      numberOfElems = 1,
      image = [],
      heading = {},
    } = {}) {
    
    // The carousel will automatically start?
    this.autoStart = autoStart;
    
    // The carousel will restart automatically after the user has manually changed the slide?
    this.autoRestart = autoRestart;
    
    // Animation length
    this.animationDuration = animationDuration;
    
    // How much time needs to pass before we change the slide
    this.timeBeforeChange = timeBeforeChange;
    
    // Next and previus index
    this.prevSlide = 0;
    this.nextSlide = 0;
    
    // Number of slides 
    this.slidesNumber = numberOfElems;
    
    // Carousel Container
    this.carouselDiv = document.querySelector('.carousel');
    
    // Start creating the HTML tags
    
    // Carousel Indicators
    let indicators = this.create('ol');
    indicators.setAttribute('class', 'carousel-indicators');
    for(let i = 0; i < numberOfElems; ++i) {
      let li = this.create('li');
      if(!i) li.setAttribute('class', 'active');
      li.setAttribute('data-index', i);
      indicators.appendChild(li);
    }
    this.carouselDiv.appendChild(indicators);
    this.carouselIndicators = document.querySelectorAll('.carousel-indicators li');
    
    // Carousel Arrows
    let arrows = [this.create('div'), this.create('div')];
    arrows[0].setAttribute('class', 'carousel-arrow left');
    arrows[1].setAttribute('class', 'carousel-arrow right');
    this.carouselDiv.appendChild(arrows[0]);
    this.carouselDiv.appendChild(arrows[1]);
    this.carouselArrows = document.querySelectorAll('.carousel-arrow');
    
    // Carousel Item Container
    let carouselItemContainer = this.create('div');
    carouselItemContainer.setAttribute('class', 'carousel-item-container');
    
    // Carousel Heading
    this.heading = heading;
    let carouselHeading = this.create('div');
    carouselHeading.setAttribute('class', 'carousel-heading');
    this.carouselHeadingText = this.create('h1');
    this.carouselHeadingText.innerHTML = heading.h1.text[0];
    carouselHeading.appendChild(this.carouselHeadingText);
    carouselItemContainer.appendChild(carouselHeading);
    
    // Carousel Item
    for(let i = 0; i < numberOfElems; ++i) {
      let carouselItem = this.create('div');
      carouselItem.setAttribute('class', i === 0 ? 'carousel-item' : 'carousel-item disabled');
      carouselItem.setAttribute('style', `background-image:url('${image[i]}')`);
      // Carousel Caption
      let carouselCaption = this.create('div');
      carouselCaption.setAttribute('class', 'carousel-caption');
      // Carousel Caption Heading 2
      let carouselCaptionText = this.create('h2');
      carouselCaptionText.innerHTML = heading.h2.text[i];
      // Carousel Cover
      let carouselCover = this.create('div');
      carouselCover.setAttribute('class', 'carousel-cover');
      // Append Child
      carouselCaption.appendChild(carouselCaptionText);
      carouselCaption.appendChild(carouselCover);
      carouselItem.appendChild(carouselCaption);
      carouselItemContainer.appendChild(carouselItem);
    }
    this.carouselDiv.appendChild(carouselItemContainer);
    this.carouselItems = document.querySelectorAll('.carousel-item');
    
    // Check if the animation is running
    this.isRunning = false;
    
    // Autoslide interval
    this.interval;
    
    // Adding event listeners to dots
    for(let i = 0; i <= this.numberOfSlides; ++i) {
      this.carouselIndicators[i].addEventListener('click', (e) => {
        if(!this.isRunning) { this.changeSlideFromDot(e.target); }
      }, false);
    }
    
    // Adding event listeners to arrows
    for(let i = 0; i < 2; ++i) {
      // Change slide
      this.carouselArrows[i].addEventListener('click', (e) => {
        if(!this.isRunning) { this.changeSlideFromArrow(e.target); }
      }, false);
    }
    
    // Start the slideShow
    this.start = () => {
      this.interval = setInterval(
        () => { 
          this.autoShow(); 
        }, this.timeBeforeChange
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
  
  get numberOfSlides() { return this.slidesNumber - 1; }
  
  get activeDot() { return this.carouselDiv.querySelector('.carousel-indicators .active'); }
  
  create(tag) { return document.createElement(tag); }
  
  // Automatic slideShow
  autoShow() {
    this.prevSlide = this.nextSlide;
    if(this.nextSlide >= this.numberOfSlides) { this.nextSlide = 0; }
    else { ++this.nextSlide; }
    this.changeSlide('right');
  }
  
  changeSlideFromDot(elem) {
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
      if(elem.dataset.index > this.prevSlide) { this.changeSlide('right'); }
      // Left to right
      else { this.changeSlide('left'); }
      // If restart is true, then restart the slideShow
      if(this.autoRestart) this.start();
    }
  }
  
  changeSlideFromArrow(elem) {
    this.isRunning = true;
    this.end();
    const index = Number((this.activeDot).dataset.index);
    if(elem.classList.contains('left')) {
      if(index === 0) {
        this.prevSlide = 0;
        this.nextSlide = this.numberOfSlides;
      } else {
        this.prevSlide = this.nextSlide;
        this.nextSlide = index - 1;
      }
      this.changeSlide('left');
    } else {
      if(index === this.numberOfSlides) {
        this.prevSlide = this.numberOfSlides;
        this.nextSlide = 0;
      } else {
        this.prevSlide = this.nextSlide;
        this.nextSlide = index + 1;
      }
      this.changeSlide('right');
    }
    if(this.autoRestart) this.start();
  }
  
  // Change slide
  changeSlide(_class) {
    
    // If the animation is still performing, stop it
    if(this.typewriterAnimation) clearInterval(this.typewriterAnimation);
    this.carouselHeadingText.innerText = '';
    
    // First, we'll put the slide to show to the (right\left)
    this.carouselItems[this.nextSlide].className = `carousel-item carousel-${_class}`;
    
    // Then we'll perform the animation
    this.carouselItems[this.prevSlide].className = `carousel-item carousel-prev ${_class}`;
    this.carouselItems[this.nextSlide].className = `carousel-item carousel-next ${_class}`;
    
    // Change active dots
    this.carouselIndicators[this.prevSlide].classList.toggle("active");
    this.carouselIndicators[this.nextSlide].classList.toggle("active");
    
    // Change heading text with typewriter effect
    if(this.typewriterEffectH1) {
      let i = 0;
      this.typewriterAnimation = setInterval(() => {
        if(i < this.heading.h1.text[this.nextSlide].length)
          this.carouselHeadingText.innerHTML += this.heading.h1.text[this.nextSlide].charAt(i++);
        else clearInterval(this.typewriter);
      }, 60);
    }
    
    // Wait animationDuration seconds before disabling the former active slide
    setTimeout(() => {
      this.carouselItems[this.prevSlide].className = "carousel-item disabled";
      this.carouselItems[this.nextSlide].className = "carousel-item";
      this.isRunning = false;
    }, this.animationDuration);
  }
}
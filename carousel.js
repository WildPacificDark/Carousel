/**
 * Author: Elia Vettoretto
 * Date:   23/04/2020
 * Title:  Animated Carousel
 * Version: 1.0
*/
class Carousel {
  constructor({animationDuration = 1500, timeBeforeChange = 7000, autoStart = true, autoRestart = false} = {}) {
    
    // The carousel will automatically start?
    this.autoStart = autoStart;
    // The carousel will restart automatically after the user has manually 
    // changed the slide?
    this.autoRestart = autoRestart;
    // Animation length
    this.animationDuration = animationDuration;
    // How much time needs to pass before we change the slide
    this.timeBeforeChange = timeBeforeChange;
    // Next and previus index
    this.prevSlide = 0;
    this.nextSlide = 0;
    // Get slides
    this.slides = document.getElementsByClassName("carousel-item");
    // Indicators
    this.dots = document.getElementsByClassName("carousel-indicators")[0]
    .getElementsByTagName("li");
    // Arrows
    this.arrows = document.getElementsByClassName("carousel-arrow");
    // Check if the animation is running
    this.isRunning = false;
    // Autoslide intervall
    this.interval;
    // Adding event listeners to dots
    for(let i = 0; i <= this.numberOfSlides; ++i) {
      // Change slide
      this.dots[i].addEventListener('click', (e) => {
        if(!this.isRunning) { this.changeSlideFromDot(e); }
      }, false);
    }
    
    // Adding event listeners to arrows
    for(let i = 0; i < this.arrows.length; ++i) {
      // Change slide
      this.arrows[i].addEventListener('click', (e) => {
        if(!this.isRunning) { this.changeSlideFromArrow(e); }
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
  }
  
  get numberOfSlides() { return this.slides.length - 1; }
  
  // Automatic slideShow
  autoShow() {
    this.prevSlide = this.nextSlide;
    if(this.nextSlide >= this.numberOfSlides) { this.nextSlide = 0; }
    else { ++this.nextSlide; }
    this.changeSlide('right');
  }
  
  changeSlideFromDot(event) {
    let elem = event.target;
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
  
  changeSlideFromArrow(event) {
    this.isRunning = true;
    this.end();
    const elem = event.target, index = Number((this.activeDot).dataset.index);
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
  
  get activeDot() {
    for(let i = 0; i <= this.numberOfSlides; ++i) {
      if(this.dots[i].classList.contains('active')) { return this.dots[i]; }
    }
    return 0;
  }
  
  // Change slide
  changeSlide(_class) {
    // First, we'll put the slide to show to the (right\left)
    this.slides[this.nextSlide].className = `carousel-item carousel-${_class}`;
    
    // Then we'll perform the animation
    this.slides[this.prevSlide].className = `carousel-item carousel-prev ${_class}`;
    this.slides[this.nextSlide].className = `carousel-item carousel-next ${_class}`;
    
    // Change active dots
    this.dots[this.prevSlide].classList.toggle("active");
    this.dots[this.nextSlide].classList.toggle("active");
    
    // Wait animationDuration seconds before disabling the former active slide
    setTimeout(() => {
      this.slides[this.prevSlide].className = "carousel-item disabled";
      this.slides[this.nextSlide].className = "carousel-item";
      this.isRunning = false;
    }, this.animationDuration);
  }
}

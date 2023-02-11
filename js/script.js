"use strict"

//////////////////////////////////////////////////////////////////
// vhFix

const vhFix = () => {
  let customViewportCorrectionVariable = 'vh';


  function setViewportProperty(doc) {
    let prevClientHeight;
    let customVar = '--' + ( customViewportCorrectionVariable || 'vh' );
    function handleResize() {
      let clientHeight = doc.clientHeight;
      if (clientHeight === prevClientHeight) return;
      requestAnimationFrame(function updateViewportHeight(){
        doc.style.setProperty(customVar, (clientHeight * 0.01) + 'px');
        prevClientHeight = clientHeight;
      });
    }
    handleResize();
    return handleResize;
  }
  window.addEventListener('resize', setViewportProperty(document.documentElement));
}

vhFix();

// vhFix
//////////////////////////////////////////////////////////////////

// toggle menu

const toggleMenu = () => {

  const toggle = document.querySelector('.btn-toggle');
  const nav = document.querySelector('.nav');

  if (toggle !== null) {
    document.querySelector('body').classList.remove('no-js');

    toggle.addEventListener('click', function () {
      nav.classList.toggle('nav--opened');
      toggle.classList.toggle('btn-toggle--close');

    });
  }

}

toggleMenu();

// end toggle menu


function checkWebP(callback){
  let webP = new Image();
  webP.onload = webP.onerror = function(){
    callback(webP.height == 2);
  };
  webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
};
checkWebP(function(support){
  if(support) document.body.classList.add("webp");
  else document.body.classList.add("no-webp");
});

if (navigator.userAgent.indexOf('Mac OS X') != -1) {
  document.body.classList.add("mac");
} else {
  document.body.classList.add("pc");
}

window.addEventListener("load", function() {
  const slider = document.querySelector(".instruments__slider-block");
  //const list = slider.querySelector(".instruments__slider");
  const slides = document.querySelectorAll(".instruments__slide");
  const prevBtn = document.querySelector(".instruments__slider-btn--prev");
  const nextBtn = document.querySelector(".instruments__slider-btn--next");
  const sliderPreview = document.querySelectorAll(".instruments__item");
  let currentSlide = 1;


  const previewClickHandler = function (i) {
    return function () {
      currentSlide = i + 1;
      let target = this.getAttribute("data-target");
      let currentSlideItem = slider.querySelector(target);
      slides.forEach(slide => slide.classList.remove('active'));
      currentSlideItem.classList.add("active");
      sliderPreview.forEach(elem => elem.classList.remove('active'));
      this.classList.add('active');

      if (currentSlide == sliderPreview.length) {
        nextBtn.disabled = true;
        prevBtn.disabled = false;
      }
      else if (currentSlide == 1) {
        nextBtn.disabled = false;
        prevBtn.disabled = true;
      }
      else {
        nextBtn.disabled = false;
        prevBtn.disabled = false;
      }
    };
  };

  if (prevBtn && nextBtn) {

    prevBtn.disabled = true;

    for (let i = 0; i < sliderPreview.length; i++) {
      sliderPreview[i].addEventListener("click", previewClickHandler(i));
    }

    nextBtn.addEventListener('click', ()=> {
      if (currentSlide <= slides.length) {
        currentSlide++;

        prevBtn.disabled = false;
        nextBtn.disabled = false;

        let currentSlideItem = slider.querySelector('#slide-'+currentSlide);
        let currentPreview = document.querySelector('#preview-'+currentSlide);

        slides.forEach(elem => elem.classList.remove('active'));
        currentSlideItem.classList.add('active');

        sliderPreview.forEach(elem => elem.classList.remove('active'));
        currentPreview.classList.add('active');
      }
      if (currentSlide === slides.length) {
        nextBtn.disabled = true;
      }
    })

    prevBtn.addEventListener('click', ()=> {
      if (currentSlide >= 0) {
        currentSlide--;

        prevBtn.disabled = false;
        nextBtn.disabled = false;

        let currentSlideItem = slider.querySelector('#slide-'+currentSlide);
        let currentPreview = document.querySelector('#preview-'+currentSlide);

        slides.forEach(elem => elem.classList.remove('active'));
        currentSlideItem.classList.add('active');

        sliderPreview.forEach(elem => elem.classList.remove('active'));
        currentPreview.classList.add('active');
      }
      if (currentSlide === 1) {
        prevBtn.disabled = true;
      }
    })
  }





})

let buttons = document.querySelectorAll("[data-modal]");
let popup = document.querySelectorAll(".modal-block");
//let popup;
let close = document.querySelectorAll(".btn--close");

for (let i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener("click", function (evt) {
    evt.preventDefault();
    let modalId = '#' + buttons[i].getAttribute('data-modal');
    popup = document.querySelector(modalId);
    popup.classList.remove("hide");
    popup.classList.add("modal-open");
    document.querySelector('body').classList.add('body-with-open-modal');
  });
}

function closepopup() {
  popup.classList.add("hide");
  popup.classList.remove("modal-open");
  document.querySelector('body').classList.remove('body-with-open-modal');
}

//закрываем по крестику
if (close) {

  close.forEach(close => {
    close.addEventListener("click", function (evt) {
      evt.preventDefault();
      closepopup();
    });
  })

}


//закрытие окна по ESC
window.addEventListener("keydown", function (evt) {
  if (evt.keyCode === 27) {
    evt.preventDefault();
    if (popup.classList.contains("modal-open")) {
      closepopup();
    }
  }
});

//закрытие по клику мимо окна
//хак для ИЕ, чтобы работал closest и matches
(function (evt) {
  evt.matches = evt.matches || evt.mozMatchesSelector || evt.msMatchesSelector || evt.oMatchesSelector || evt.webkitMatchesSelector;
  evt.closest = evt.closest || function closest(selector) {
    if (!this) return null;
    if (this.matches(selector)) return this;
    if (!this.parentElement) {
      return null
    } else return this.parentElement.closest(selector)
  };
}(Element.prototype));
//end хак для ИЕ

if (popup) {

  popup.forEach(popup =>
    popup.addEventListener("mouseup", function (evt) {
      if (evt.target.closest('.modal') === null) {
        closepopup();
      }
    })
  )
}

//////////////////////////////////////////////////////////////////
// to top

const toTopBtn = document.querySelector('.to-top');

function trackScroll() {
  let scrolled = window.scrollY;
  let coords = document.documentElement.clientHeight;

  if (scrolled > coords) {
    toTopBtn.classList.add('to-top--show');
  }
  if (scrolled < coords) {
    toTopBtn.classList.remove('to-top--show');
  }
}

// function backToTop() {
//   if (window.pageYOffset > 0) {
//     window.scrollBy(0, -80);
//     setTimeout(backToTop, 0);
//   }
// }

window.addEventListener('scroll', trackScroll);
//toTopBtn.addEventListener('click', backToTop);

//  to top
//////////////////////////////////////////////////////////////////

// language-selection
const languageSelection = () => {

  const btn = document.querySelector('.lang__selected');
  const block = document.querySelector('.lang__list');

  btn.addEventListener('click', () => {
    block.classList.toggle('opened');
  })
}

languageSelection();

// end language-selection


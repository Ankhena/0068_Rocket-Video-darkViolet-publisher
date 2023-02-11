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

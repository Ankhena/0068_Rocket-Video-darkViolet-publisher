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

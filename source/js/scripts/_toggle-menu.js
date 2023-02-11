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

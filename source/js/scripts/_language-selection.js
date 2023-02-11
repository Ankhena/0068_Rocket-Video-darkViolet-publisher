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

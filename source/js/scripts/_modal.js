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

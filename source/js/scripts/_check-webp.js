
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

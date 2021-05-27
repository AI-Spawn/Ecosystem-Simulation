//@ts-nocheck
let sliders_made = false;
function create_sliders() {}
function sliders() {
  var x = document.getElementById("form");
  var text = "";
  var i;
  for (i = 0; i < x.length; i++) {
    text += x.elements[i].value + "<br>";
  }
  console.log(text);
}

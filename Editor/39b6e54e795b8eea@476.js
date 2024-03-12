// https://observablehq.com/@esperanc/inline-inputs@476
import define1 from "./3df1b33bb2cfcd3c@475.js";
import define2 from "./4caee69e966109c8@35.js";

function _1(md){return(
md`# Inline Inputs

Sometimes you might want to put inputs inline in your Markdown, rather than as separate cells. This is a little trickier, but possible, and you can even synchronize multiple inputs if you desire. Here’s an example:`
)}

function _2(md,bind,html,$0){return(
md`This is a range input ${bind(html`<input type=range style="width:80px;">`, $0)}.

This is a number input ${bind(html`<input type=number style="width:80px;">`, $0)}.`
)}

function _3(md){return(
md`You can also do a standalone input:`
)}

function _4(bind,html,$0){return(
bind(html`<input type=range>`, $0)
)}

function _5(md){return(
md`All of these inputs are synchronized using a [view](/@mbostock/synchronized-views):`
)}

function _apples(View){return(
new View(3)
)}

function _7(md){return(
md`The view’s value can be referenced reactively:`
)}

function _8(apples){return(
new Array(apples + 1).join("🍎")
)}

function _9(md){return(
md`To bind a given *input* to a *view*, you need bidirectional listening: the *input* needs to listen to the *view* (to update the *input*’s value), and the *view* needs to listen to the *input* (to update the *view*’s value). This is a [disposable view](/@mbostock/disposal).`
)}

function _bind(disposal){return(
function bind(input, view) {
  const value = ["range", "number"].includes(input.type) ? "valueAsNumber" : "value";
  var update;
  if (input.type == "file") {
    update = () => { };
    input.oninput = () => { view.value = input.files };
  }
  else if (input.type == "radiogroup") {
    update = () => { input.setter(view.value) };
    input.oninput = () => { view.value = input.getter() };
  }
  else if (input.type == "checkbox") {
    update = () => input.checked = view.value;
    input.oninput = () => view.value = input.checked;
  } 
  else {
    update = () => input[value] = view.value;
    input.oninput = () => view.value = input[value];
  }
  view.addEventListener("input", update);
  disposal(input).then(() => view.removeEventListener("input", update));
  return update(), input;
}
)}

function _11(md){return(
md`### Some useful gui components`
)}

function _makeSlider(html){return(
function (options={}) {
  let {min=0,max=10,step=0.1,size="10em"} = options;
  return html`<input type=range min=${min} max=${max} step=${step} style='width:${size}'>`
}
)}

function _makeFile(html){return(
function (options={}) {
  let {multiple=false, accept=undefined, size="20em"} = options;
  return html`<input type=file multiple=${multiple} accept=${accept} style='width:${size}'>`
}
)}

function _makeColor(html){return(
function (options={}) {
  return html`<input type=color />`
}
)}

function _makeSelect(html){return(
function(opt={}) {
  let {options=[]} = opt;
  let sel = html`<select></select>`;
  for (let o of options) {
    sel.append(html`<option value=${o}>${o}</option>`)
  }
  return sel;
}
)}

function _makeNumber(html){return(
function (options={}) {
  let {min=0,max=10,step=0.1,size="4em"} = options
  return html`<input type=number min=${min} max=${max} step=${step} style="width:${size};">`
}
)}

function _makeCheckbox(html){return(
function () {
  return html`<input type="checkbox">`
}
)}

function _makeRadioGroup(html){return(
function (opt = {}) {
  let {options=[]} = opt;
  let sel = html`<form></form>`;
  sel.style.display = 'inline-block';
  sel.type = 'radiogroup';
  let name = "group"+options.join("");
  let buttons = new Map();
  for (let o of options) {
    let button = html`<input type=radio name=${name} value=${o} id=${o}>`;
    buttons.set(o, button);
    sel.append(buttons.get(o));
    sel.append(html`<label for=${o}> ${o}&nbsp;&nbsp;</label>`);
  }
  sel.setter = function(value) {
    for (let [key,button] of buttons) { 
      button.checked = (key == value) 
    }
  }
  sel.getter = function () {
    for (let [key,button] of buttons) {
      if (button.checked) return key;
    }
  }
  return sel;
}
)}

function _makeCheckGroup(html){return(
function (opt = {}) {
  let {options=[]} = opt;
  let sel = html`<form></form>`;
  sel.style.display = 'inline-block';
  sel.type = 'radiogroup';
  let name = "group"+options.join("");
  let buttons = new Map();
  for (let o of options) {
    let button = html`<input type=checkbox id=${o}>`;
    buttons.set(o, button);
    sel.append(button);
    sel.append(html`<label for=${o}> ${o}&nbsp;&nbsp;</label>`);
  }
  sel.setter = function(checked) {
    let i = 0;
    for (let [key,button] of buttons) { 
      button.checked = checked[i++] 
    }
  }
  sel.getter = function () {
    let checked = [];
    let i = 0;
    for (let [key,button] of buttons) {
      checked [i++] = button.checked;
    }
    return checked
  }
  return sel;
}
)}

function _20(md){return(
md`## Combo bind/make components`
)}

function _bindSlider(bind,makeSlider){return(
(options,view) => bind(makeSlider(options),view)
)}

function _bindNumber(bind,makeNumber){return(
(options,view) => bind(makeNumber(options),view)
)}

function _bindSelect(bind,makeSelect){return(
(options,view) => bind(makeSelect(options),view)
)}

function _bindFile(bind,makeFile){return(
(options,view) => bind(makeFile(options),view)
)}

function _bindColor(bind,makeColor){return(
(options,view) => bind(makeColor(options),view)
)}

function _bindCheckbox(bind,makeCheckbox){return(
(options,view) => bind(makeCheckbox(options),view)
)}

function _bindCheckGroup(bind,makeCheckGroup){return(
(options,view) => bind(makeCheckGroup(options),view)
)}

function _bindRadioGroup(bind,makeRadioGroup){return(
(options,view) => bind(makeRadioGroup(options),view)
)}

function _bindSliderNumber(html,bindSlider,bindNumber){return(
(options,view) => html`<span>${bindSlider(options,view)} ${bindNumber(options,view)}</span>`
)}

function _30(md){return(
md`### Example:`
)}

function _31(md,bindSelect,$0,bindSliderNumber,$1,bindCheckbox,$2,bindRadioGroup,$3,bindCheckGroup,$4,bindFile,$5,bindColor,$6){return(
md `X: ${bindSelect({options:["a","b","c"]}, $0)}&nbsp;&nbsp;&nbsp;&nbsp;Y:${bindSliderNumber ({min:0,max:10,step:0.1}, $1)}

Z: ${bindCheckbox("z", $2)}

W: ${bindRadioGroup ({options:["a","b","c"]}, $3)}

S: ${bindCheckGroup ({options:["a","b","c"]}, $4)}

F: ${bindFile({multiple:true, accept:".png,.jpg", size:'20em'}, $5)}

C: ${bindColor({}, $6)}`
)}

function _32(md){return(
md`#### Variables`
)}

function _x(View){return(
new View("a")
)}

function _y(View){return(
new View (5)
)}

function _z(View){return(
new View(false)
)}

function _w(View){return(
new View("b")
)}

function _s(View){return(
new View([false,true,true])
)}

function _f(View){return(
new View("")
)}

function _c(View){return(
new View("#ffaa00")
)}

function _40(x,y,z,w,s){return(
[x,y,z,w,s]
)}

async function _41(html,f,Files)
{
  const div = html`<div>`;
  div.append(html`<h3>Image:</h3>`);
  for (var j = 0; j < f.length; j++) {
    let file = f[j];
    let img = html`<img height="125px" />`
    img.src = await Files.url(f[j]);
    div.append(img);
  }
  return div;
}


function _42(md){return(
md`### Imports`
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md","bind","html","viewof apples"], _2);
  main.variable(observer()).define(["md"], _3);
  main.variable(observer()).define(["bind","html","viewof apples"], _4);
  main.variable(observer()).define(["md"], _5);
  main.variable(observer("viewof apples")).define("viewof apples", ["View"], _apples);
  main.variable(observer("apples")).define("apples", ["Generators", "viewof apples"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], _7);
  main.variable(observer()).define(["apples"], _8);
  main.variable(observer()).define(["md"], _9);
  main.variable(observer("bind")).define("bind", ["disposal"], _bind);
  main.variable(observer()).define(["md"], _11);
  main.variable(observer("makeSlider")).define("makeSlider", ["html"], _makeSlider);
  main.variable(observer("makeFile")).define("makeFile", ["html"], _makeFile);
  main.variable(observer("makeColor")).define("makeColor", ["html"], _makeColor);
  main.variable(observer("makeSelect")).define("makeSelect", ["html"], _makeSelect);
  main.variable(observer("makeNumber")).define("makeNumber", ["html"], _makeNumber);
  main.variable(observer("makeCheckbox")).define("makeCheckbox", ["html"], _makeCheckbox);
  main.variable(observer("makeRadioGroup")).define("makeRadioGroup", ["html"], _makeRadioGroup);
  main.variable(observer("makeCheckGroup")).define("makeCheckGroup", ["html"], _makeCheckGroup);
  main.variable(observer()).define(["md"], _20);
  main.variable(observer("bindSlider")).define("bindSlider", ["bind","makeSlider"], _bindSlider);
  main.variable(observer("bindNumber")).define("bindNumber", ["bind","makeNumber"], _bindNumber);
  main.variable(observer("bindSelect")).define("bindSelect", ["bind","makeSelect"], _bindSelect);
  main.variable(observer("bindFile")).define("bindFile", ["bind","makeFile"], _bindFile);
  main.variable(observer("bindColor")).define("bindColor", ["bind","makeColor"], _bindColor);
  main.variable(observer("bindCheckbox")).define("bindCheckbox", ["bind","makeCheckbox"], _bindCheckbox);
  main.variable(observer("bindCheckGroup")).define("bindCheckGroup", ["bind","makeCheckGroup"], _bindCheckGroup);
  main.variable(observer("bindRadioGroup")).define("bindRadioGroup", ["bind","makeRadioGroup"], _bindRadioGroup);
  main.variable(observer("bindSliderNumber")).define("bindSliderNumber", ["html","bindSlider","bindNumber"], _bindSliderNumber);
  main.variable(observer()).define(["md"], _30);
  main.variable(observer()).define(["md","bindSelect","viewof x","bindSliderNumber","viewof y","bindCheckbox","viewof z","bindRadioGroup","viewof w","bindCheckGroup","viewof s","bindFile","viewof f","bindColor","viewof c"], _31);
  main.variable(observer()).define(["md"], _32);
  main.variable(observer("viewof x")).define("viewof x", ["View"], _x);
  main.variable(observer("x")).define("x", ["Generators", "viewof x"], (G, _) => G.input(_));
  main.variable(observer("viewof y")).define("viewof y", ["View"], _y);
  main.variable(observer("y")).define("y", ["Generators", "viewof y"], (G, _) => G.input(_));
  main.variable(observer("viewof z")).define("viewof z", ["View"], _z);
  main.variable(observer("z")).define("z", ["Generators", "viewof z"], (G, _) => G.input(_));
  main.variable(observer("viewof w")).define("viewof w", ["View"], _w);
  main.variable(observer("w")).define("w", ["Generators", "viewof w"], (G, _) => G.input(_));
  main.variable(observer("viewof s")).define("viewof s", ["View"], _s);
  main.variable(observer("s")).define("s", ["Generators", "viewof s"], (G, _) => G.input(_));
  main.variable(observer("viewof f")).define("viewof f", ["View"], _f);
  main.variable(observer("f")).define("f", ["Generators", "viewof f"], (G, _) => G.input(_));
  main.variable(observer("viewof c")).define("viewof c", ["View"], _c);
  main.variable(observer("c")).define("c", ["Generators", "viewof c"], (G, _) => G.input(_));
  main.variable(observer()).define(["x","y","z","w","s"], _40);
  main.variable(observer()).define(["html","f","Files"], _41);
  main.variable(observer()).define(["md"], _42);
  const child1 = runtime.module(define1);
  main.import("View", child1);
  const child2 = runtime.module(define2);
  main.import("disposal", child2);
  return main;
}

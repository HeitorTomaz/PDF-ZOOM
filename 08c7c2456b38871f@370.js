import define1 from "./92ae203e0b6ca39d@1136.js";
import define2 from "./14cac50a79a0b841@316.js";
import define3 from "./7440fd46d55d55de@676.js";

function _1(md){return(
md`# PDF Zoom Viewer

Also check the [PDF Rectangle Selector](https://observablehq.com/@the-heitortomaz/pdf-rectangle-selector)`
)}

function _inputZipFile(Inputs){return(
Inputs.file({ label: "Upload zip", accept: ".zip" })
)}

function _isFullscreen(){return(
false
)}

function _fs(addEventListener,$0)
{
  addEventListener("fullscreenchange", (event) => {
  if (document.fullscreenElement) {
    $0.value = true;
  } else {
    $0.value = false;
  }
});
}


function _fullscreen2(htl){return(
htl.html`<button onclick=${({currentTarget}) => {
  const currentCell = currentTarget.parentElement;
  const nextCell = currentCell.nextElementSibling;
  if( nextCell.requestFullscreen){ 
    nextCell.requestFullscreen()
    
  } else if( nextCell.webkitRequestFullscreen){ 
    nextCell.webkitRequestFullscreen()
    
  }
    else {
    throw new Error("Fullscreen API not supported");
  }
}}>Fullscreen</button>`
)}

function _presenter(rectViewer,pdfDocument,inputRects,Audios_List,isFullscreen,width){return(
rectViewer(pdfDocument, inputRects, {audios:Audios_List, w:isFullscreen ? width : 1152, isFullscreen})
)}

function _7(md){return(
md`<br>
## Implementation`
)}

async function _loadZipFile(inputZipFile,filepath,zipreader,$0,$1,$2)
{
  if (inputZipFile || filepath) {
    let readerUp =  (inputZipFile ? await  zipreader(inputZipFile, { type: "arraybuffer" }) : await fetch(filepath).then(d => zipreader(d,{ type: "arraybuffer" })));
    const dir = [...readerUp.keys()];
    console.log("dir", dir);
    $0.value = await readerUp.get( dir.filter(word => word.includes(".pdf"))[0]);
    let audios =  dir.filter(word => word.includes(".ogg")).sort();
    console.log ("audios", audios);
    audios.sort(function(a, b) {
    var keyA = parseInt(a.split(".")[0]),
      keyB = parseInt(b.split(".")[0]);
      if (keyA < keyB) return -1;
      if (keyA > keyB) return 1;
      return 0;
    });
    console.log ("audios", audios);
    var aud_list = []
    for (let i in audios){
      let aud = await readerUp.get( audios[i]);
      let blb = new Blob([aud], { type: "audio/ogg; codecs=opus" })
      console.log("blb", blb);
      aud_list.push(blb);
    }
    $1.value = aud_list;
    //Default, sem ser arraybuffer
    readerUp = (inputZipFile ? await  zipreader(inputZipFile) : await fetch(filepath).then(zipreader));
    $2.value = JSON.parse(await readerUp.get(dir.filter(word => word.includes(".json"))[0]));
  }
}


async function _buf(defaultZip){return(
(await defaultZip.file("document.pdf").blob()).arrayBuffer()
)}

async function _inputRects(defaultZip){return(
JSON.parse(await defaultZip.file("rects.json").text())
)}

function _pdfDocument(pdfjs,buf){return(
pdfjs.getDocument(buf).promise
)}

function _Audios_List(){return(
[]
)}

function _filepath(getParamValue){return(
getParamValue("filepath")
)}

function _defaultZip(FileAttachment){return(
FileAttachment(
 "infographics--the-benefits-of-their-use-online.zip"
).zip()
)}

function _15(md){return(
md`## Dependencies`
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["infographics--the-benefits-of-their-use-online.zip", {url: new URL("./files/3f62f5237c5bd99bc2dafe0bdbc58b5fc5df5225051a2abcf187da2d39497e2ddbe02b3a87f7afa849b1037f500f26fc33d5208156639cac21bac37d2d1a5801.zip", import.meta.url), mimeType: "application/zip", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("viewof inputZipFile")).define("viewof inputZipFile", ["Inputs"], _inputZipFile);
  main.variable(observer("inputZipFile")).define("inputZipFile", ["Generators", "viewof inputZipFile"], (G, _) => G.input(_));
  main.define("initial isFullscreen", _isFullscreen);
  main.variable(observer("mutable isFullscreen")).define("mutable isFullscreen", ["Mutable", "initial isFullscreen"], (M, _) => new M(_));
  main.variable(observer("isFullscreen")).define("isFullscreen", ["mutable isFullscreen"], _ => _.generator);
  main.variable(observer("fs")).define("fs", ["addEventListener","mutable isFullscreen"], _fs);
  main.variable(observer("fullscreen2")).define("fullscreen2", ["htl"], _fullscreen2);
  main.variable(observer("presenter")).define("presenter", ["rectViewer","pdfDocument","inputRects","Audios_List","isFullscreen","width"], _presenter);
  main.variable(observer()).define(["md"], _7);
  main.variable(observer("loadZipFile")).define("loadZipFile", ["inputZipFile","filepath","zipreader","mutable buf","mutable Audios_List","mutable inputRects"], _loadZipFile);
  main.define("initial buf", ["defaultZip"], _buf);
  main.variable(observer("mutable buf")).define("mutable buf", ["Mutable", "initial buf"], (M, _) => new M(_));
  main.variable(observer("buf")).define("buf", ["mutable buf"], _ => _.generator);
  main.define("initial inputRects", ["defaultZip"], _inputRects);
  main.variable(observer("mutable inputRects")).define("mutable inputRects", ["Mutable", "initial inputRects"], (M, _) => new M(_));
  main.variable(observer("inputRects")).define("inputRects", ["mutable inputRects"], _ => _.generator);
  main.variable(observer("pdfDocument")).define("pdfDocument", ["pdfjs","buf"], _pdfDocument);
  main.define("initial Audios_List", _Audios_List);
  main.variable(observer("mutable Audios_List")).define("mutable Audios_List", ["Mutable", "initial Audios_List"], (M, _) => new M(_));
  main.variable(observer("Audios_List")).define("Audios_List", ["mutable Audios_List"], _ => _.generator);
  main.variable(observer("filepath")).define("filepath", ["getParamValue"], _filepath);
  main.variable(observer("defaultZip")).define("defaultZip", ["FileAttachment"], _defaultZip);
  main.variable(observer()).define(["md"], _15);
  const child1 = runtime.module(define1);
  main.import("pdfjs", child1);
  main.import("rectViewer", child1);
  const child2 = runtime.module(define2);
  main.import("zip", child2);
  main.import("zipreader", child2);
  const child3 = runtime.module(define3);
  main.import("getParamValue", child3);
  return main;
}

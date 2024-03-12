import define1 from "./6de75d56115bcaf2@1070.js";
import define2 from "./14cac50a79a0b841@316.js";
import define3 from "./3a1a35b62fdb644d@452.js";

function _1(md){return(
md`# PDF Rectangle Selector

Also check the [PDF Zoom Viewer](https://observablehq.com/@the-heitortomaz/pdf-zoom-viewer).`
)}

function _pdfFile(Inputs){return(
Inputs.file({ label: "Upload PDF" })
)}

function _inputZipFile(Inputs){return(
Inputs.file({ label: "Upload zip" })
)}

function _saveButton(Inputs,saveZipFile){return(
Inputs.button([["Save zip", saveZipFile]])
)}

function _rects(selectRects,pdfDocument,inputRects,Audios_List){return(
selectRects(pdfDocument, {   
  width: 850,
  height: 800,
  value: inputRects,
  audios: Audios_List})
)}

function _6(md){return(
md`<br>
## Implementation`
)}

function _7(rects){return(
rects
)}

async function _loadPdfFile(pdfFile,$0,$1,$2)
{
  if (pdfFile) {
    $0.value = (await pdfFile.blob()).arrayBuffer();
    $1.value = [];
    $2.value = [];
  }
}


async function _loadZipFile(inputZipFile,zipreader,$0,$1,$2)
{
  if (inputZipFile) {
    let readerUp = await zipreader(inputZipFile, { type: "arraybuffer" });
    const dir = [...readerUp.keys()];
    console.log("dir", dir);
    $0.value = await readerUp.get( dir.filter(word => word.includes(".pdf"))[0]);
    let audios =  dir.filter(word => word.includes(".ogg")).sort();
    console.log ("audios", audios);
    var aud_list = []
    for (let i in audios){
      let aud = await readerUp.get( audios[i]);
      let blb = new Blob([aud], { type: "audio/ogg; codecs=opus" })
      console.log("blb", blb);
      aud_list.push(blb);
    }
    $1.value = aud_list;
    readerUp = await zipreader(inputZipFile);
    $2.value = JSON.parse(await readerUp.get(dir.filter(word => word.includes(".json"))[0]));
  }
}


function _saveZipFile(zip,pdfDocument,rects,DictaphoneObj){return(
async function saveZipFile() {
  const theZip = zip();
  theZip.file("document.pdf", await pdfDocument.getData());
  
  theZip.file("rects.json", JSON.stringify( rects.sort(function(a, b){return a.y - b.y})));
  
  var audios = DictaphoneObj.getAudios();
  for (let i in audios){
    console.log("audio", fetch(audios[i].src).then(res => res.blob()));
    theZip.file(`${i}.ogg`, fetch(audios[i].src).then(res => res.blob()));
  }
  
  const blob = await theZip.generateAsync({ type: "blob" });
  
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.download = `annotatedPdf.zip`;
  link.click();
}
)}

function _defaultPdfUrl(){return(
"https://static.observableusercontent.com/files/7c017ecb74bcfc40c27ab7eece42a036a4e91b2c85e855277b42424f70d6312bac5e95c18d67c783ff0979d8a85150c57987873ac4b2357ca34cb20a2624000e"
)}

function _teddyASketchingInterfaceFor3dFreeformDesign(FileAttachment){return(
FileAttachment("Teddy A Sketching Interface for 3D Freeform Design.pdf")
)}

function _buf(teddyASketchingInterfaceFor3dFreeformDesign){return(
teddyASketchingInterfaceFor3dFreeformDesign.arrayBuffer()
)}

function _inputRects(){return(
[]
)}

function _Audios_List(){return(
[]
)}

function _pdfDocument(pdfjs,buf){return(
pdfjs.getDocument(buf).promise
)}

async function _DictaphoneObj(Dictaphone){return(
await Dictaphone.build( )
)}

function _18(md){return(
md`## Dependencies`
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["Teddy A Sketching Interface for 3D Freeform Design.pdf", {url: new URL("./files/7c017ecb74bcfc40c27ab7eece42a036a4e91b2c85e855277b42424f70d6312bac5e95c18d67c783ff0979d8a85150c57987873ac4b2357ca34cb20a2624000e.pdf", import.meta.url), mimeType: "application/pdf", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("viewof pdfFile")).define("viewof pdfFile", ["Inputs"], _pdfFile);
  main.variable(observer("pdfFile")).define("pdfFile", ["Generators", "viewof pdfFile"], (G, _) => G.input(_));
  main.variable(observer("viewof inputZipFile")).define("viewof inputZipFile", ["Inputs"], _inputZipFile);
  main.variable(observer("inputZipFile")).define("inputZipFile", ["Generators", "viewof inputZipFile"], (G, _) => G.input(_));
  main.variable(observer("saveButton")).define("saveButton", ["Inputs","saveZipFile"], _saveButton);
  main.variable(observer("viewof rects")).define("viewof rects", ["selectRects","pdfDocument","inputRects","Audios_List"], _rects);
  main.variable(observer("rects")).define("rects", ["Generators", "viewof rects"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], _6);
  main.variable(observer()).define(["rects"], _7);
  main.variable(observer("loadPdfFile")).define("loadPdfFile", ["pdfFile","mutable buf","mutable inputRects","mutable Audios_List"], _loadPdfFile);
  main.variable(observer("loadZipFile")).define("loadZipFile", ["inputZipFile","zipreader","mutable buf","mutable Audios_List","mutable inputRects"], _loadZipFile);
  main.variable(observer("saveZipFile")).define("saveZipFile", ["zip","pdfDocument","rects","DictaphoneObj"], _saveZipFile);
  main.variable(observer("defaultPdfUrl")).define("defaultPdfUrl", _defaultPdfUrl);
  main.variable(observer("teddyASketchingInterfaceFor3dFreeformDesign")).define("teddyASketchingInterfaceFor3dFreeformDesign", ["FileAttachment"], _teddyASketchingInterfaceFor3dFreeformDesign);
  main.define("initial buf", ["teddyASketchingInterfaceFor3dFreeformDesign"], _buf);
  main.variable(observer("mutable buf")).define("mutable buf", ["Mutable", "initial buf"], (M, _) => new M(_));
  main.variable(observer("buf")).define("buf", ["mutable buf"], _ => _.generator);
  main.define("initial inputRects", _inputRects);
  main.variable(observer("mutable inputRects")).define("mutable inputRects", ["Mutable", "initial inputRects"], (M, _) => new M(_));
  main.variable(observer("inputRects")).define("inputRects", ["mutable inputRects"], _ => _.generator);
  main.define("initial Audios_List", _Audios_List);
  main.variable(observer("mutable Audios_List")).define("mutable Audios_List", ["Mutable", "initial Audios_List"], (M, _) => new M(_));
  main.variable(observer("Audios_List")).define("Audios_List", ["mutable Audios_List"], _ => _.generator);
  main.variable(observer("pdfDocument")).define("pdfDocument", ["pdfjs","buf"], _pdfDocument);
  main.variable(observer("DictaphoneObj")).define("DictaphoneObj", ["Dictaphone"], _DictaphoneObj);
  main.variable(observer()).define(["md"], _18);
  const child1 = runtime.module(define1);
  main.import("pdfjs", child1);
  main.import("rectViewer", child1);
  main.import("selectRects", child1);
  const child2 = runtime.module(define2);
  main.import("zip", child2);
  main.import("zipreader", child2);
  const child3 = runtime.module(define3);
  main.import("Dictaphone", child3);
  return main;
}

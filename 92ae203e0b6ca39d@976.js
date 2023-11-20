import define1 from "./9a7362216b9c95fc@769.js";
import define2 from "./3a1a35b62fdb644d@450.js";

function _1(md){return(
md`# PDF rect zoom viewer code`
)}

async function _pdfDocument(pdfjs,FileAttachment){return(
pdfjs.getDocument(
  await FileAttachment("igarashi-et-al-1999.pdf").url()
).promise
)}

function _defaultRects(){return(
JSON.parse(
  `[{"pageNo":1,"box":[91.73553719008262,85.95041322314049,410.7438016528925,25.6198347107438]},{"pageNo":1,"box":[40.49586776859503,173.55371900826444,249.58677685950408,150.41322314049583]},{"pageNo":1,"box":[304.13223140495865,180.99173553719007,232.23140495867764,193.3884297520661]},{"pageNo":1,"box":[304.95867768595036,384.29752066115697,242.9752066115702,201.65289256198344]},{"pageNo":2,"box":[38.24875350044394,83.32764155453859,273.20538214602817,86.05969537599887]},{"pageNo":2,"box":[317.60125674475773,80.5955877330783,206.95307697561634,88.10873574209408]},{"pageNo":2,"box":[35.51669967898366,171.43637729663268,415.2721808619628,87.42572228672901]},{"pageNo":2,"box":[36.199713134348734,265.0092206816473,271.839355235298,84.01065500990366]},{"pageNo":2,"box":[311.4541356464721,262.9601803155521,216.5152653507273,86.74270883136394]},{"pageNo":2,"box":[39.3205611433645,355.1669967898366,205.5870500648862,84.69366846526873]},{"pageNo":2,"box":[258.86209958336167,353.1179564237414,275.25442251212337,88.79174919745915]},{"pageNo":3,"box":[49,80,222,204]},{"pageNo":3,"box":[301,76,251,212]},{"pageNo":3,"box":[303,302,254,153]},{"pageNo":3,"box":[313,471,246,96]},{"pageNo":4,"box":[38,80,229,94]},{"pageNo":4,"box":[34,186,245,87]},{"pageNo":4,"box":[306,79,249,166]},{"pageNo":4,"box":[306,258,243,156]},{"pageNo":5,"box":[44,632,240,109]},{"pageNo":5,"box":[302,78,234,201]},{"pageNo":5,"box":[312,575,240,166]},{"pageNo":6,"box":[35,351,253,99]},{"pageNo":6,"box":[69,614,180,96]},{"pageNo":6,"box":[301,174,247,118]},{"pageNo":6,"box":[311,504,248,89]},{"pageNo":7,"box":[31,66,266,89]},{"pageNo":7,"box":[54,291,212,104]},{"pageNo":7,"box":[36,633,253,104]}]`
)
)}

function _getRectImage(DOM){return(
async function getRectImage(pdfDocument, rect, frameWidth, frameHeight) {
  let { pageNo, box } = rect;
  const page = await pdfDocument.getPage(pageNo);
  const viewport = page.getViewport({ scale: 1 });
  if (!box) box = viewport.viewBox;
  const { width: w, height: h } = viewport;
  const [x0, y0, rwid, rhgt] = box;
  const scale = Math.min(frameWidth / rwid, frameHeight / rhgt);
  const rectViewport = page.getViewport({
    offsetX: -x0 * scale,
    offsetY: -y0 * scale,
    scale
  });
  const ctx = DOM.context2d(rwid * scale, rhgt * scale, 1);
  ctx.canvas.style.cssText = "border:1px solid gray";
  ctx.canvas.box = box;
  const renderPromise = page.render({
    canvasContext: ctx,
    transform: null,
    viewport: rectViewport
  }).promise;
  return renderPromise.then(() => ctx.canvas);
}
)}

function _getText(){return(
async function getText(pdfDocument, pageNo) {
  const page = await pdfDocument.getPage(pageNo);
  const textContent = await page.getTextContent({
    normalizeWhitespace: false
  });
  return textContent;
}
)}

function _6(getText,pdfDocument){return(
getText(pdfDocument, 1)
)}

function _rectViewer(htl,Dictaphone,Inputs,d3,Event,boxToMbr,$0,getRectImage,MBR,Vec,mbrTransf,Matrix,Audio){return(
async function rectViewer(pdfDocument, pageRectangles, options = {}) {
    const {
      width = 800,
      height = 600,
      margin = 30,
      mode = "sequential",
      zoom = 3,
      zoomPosition = "rectCenter", //
      audios = []
    } = options;
  
    // Total Number of pages
    const numPages = pdfDocument._pdfInfo.numPages;

    const soundClips = htl.html`<section class="sound-clips">`;
    const DictaphoneObj = await Dictaphone.build(soundClips );

    for (let aud in audios){
      console.log("psc aud", aud);
      console.log("psc audios[aud]", audios[aud]);
      DictaphoneObj.uploadAudio( audios[aud]);
    }
    var audio = null;
  console.log("pageRectangles", pageRectangles);
    // Insert rects without boxes in the pageRectangles variable
    // so that we have an empty beginning and end rect to start and end the
    // presentation
    pageRectangles = [{ pageNo: 1 }, ...pageRectangles, { pageNo: numPages }];
    
    // Navigation interface
    const rectNo = Inputs.range([0, pageRectangles.length - 1], {
      label: "Show selection",
      step: 1,
      value: 0
    });
  
    const PageInp = Inputs.range([1, numPages], {
      label: "Page selection",
      step: 1,
      value: 1
    });
    
    // Zoom level
    const maxZoom = Inputs.range([1, 10], {
      label: "max zoom",
      step: 0.1,
      value: zoom
    });
  
    // Zoom position
    const zoomPos = Inputs.radio(["rectCenter", "pageCenter"], {
      label: "zoom position",
      value: zoomPosition
    });
  
    // An svg for displaying the rects
    const frame = htl.html`<svg width=${width} height=${height}>`;
    frame.style.background = "gray";
  
    // Drop shadow filter
    frame.append(htl.svg`
      <defs>
      <filter id="dropShadow" x="-0.5" y="-0.5" width="200%" height="200%">
        <feOffset result="offOut" in="SourceAlpha" dx="1" dy="1" />
        <feGaussianBlur result="blurOut" in="offOut" stdDeviation="5" />
        <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
      </filter>
      </defs>
    `);
  
    // The main d3 svg selections
    const frameSel = d3.select(frame);
    // Group for displaying pages
    const pageGroup = frameSel.append("g").attr("class", "pageGroup");
    // Group for displaying the clickable areas
    const areaGroup = frameSel.append("g").attr("class", "areaGroup");
    
    const icoGroup = frameSel.append("g").attr("class", "icoGroup");
    // Group for displaying the highlighted rect selection
    const rectGroup = frameSel.append("g").attr("class", "rectGroup");
  
    const playpauseGroup = frameSel.append("g").attr("class", "playpauseGroup");
  
    // Navigation variables
    let currentPageNo = 0;
    let currentPage = null;
    let currentRect = null;
    let pageTransf = null;
    let currentRectSelected = false;
  
    // Sets an input to a given value
    function set(input, value) {
      audio = null;
      input.value = value;
      input.dispatchEvent(new Event("input"));
    }
    
    // Navigation callbacks
    const nextCallback = () =>
      set(rectNo, Math.min(pageRectangles.length - 1, rectNo.value + 1));
    const prevCallback =  () =>  set(rectNo, Math.max(0, rectNo.value - 1));
    const closeCallback =  () =>  set(rectNo, Math.max(0, rectNo.value));
    //const ChangePageCallback = () => set(PageInp, currentPageNo);
  
    // Navigation buttons
    const buttons = Inputs.button([
      ["prev", prevCallback],
      ["next", nextCallback]
    ]);
  
    // Sets an input to a given value
    function setCurrentRectStatus(value) {
      currentRectSelected = value
    }
    
    // Draws the clickable areas in the page
    function loadAreas(pageNo, delay = 500) {
      let areas = pageRectangles.filter((d) => d.pageNo == pageNo && d.box);
      //let t = d3.transition().delay(delay);
      areaGroup
        .selectAll("rect")
        .data(areas, (d) => d.box)
        .join(
          (enter) =>
            enter
              .append("rect")
  
              .each(function (d, i) {
                const sel = d3.select(this);
                const { box } = d;
                const mbr = boxToMbr(box).transform(pageTransf);
                sel
                  .attr("x", mbr.min.x)
                  .attr("y", mbr.min.y)
                  .attr("width", mbr.size().x)
                  .attr("height", mbr.size().y)
                  .attr("stroke", "red")
                  .attr("fill", "#00000000")
                  .attr("opacity", 0)
                  .transition()
                  .delay(delay)
                  .attr("opacity", 1);
              }),
          (update) => update,
          (exit) => exit.remove()
        );
      
      areaGroup
        .selectAll("rect")
        .on("click", (ev, d) => {
          let i = pageRectangles.indexOf(d);
          set(rectNo, i);
          $0.value = { d, i };
        });
      console.log("areas", areas);

      
      icoGroup
        .selectAll("image")
        .data(areas, (d) => d.box)
        .join(
          (enter) =>
            enter
            .append("image")
              .attr("class", "sound-ico")
              .attr("xlink:href", "https://thenounproject.com/api/private/icons/1583090/edit/?backgroundShape=CIRCLE&backgroundShapeColor=%23FFFFFF&backgroundShapeOpacity=1&exportSize=752&flipX=false&flipY=false&foregroundColor=%23000000&foregroundOpacity=1&imageFormat=png&rotation=0")
              .each(function (d, i) {
                //console.log("ico d.box", d.box);
                  const  { box }  = d;
                //console.log("box", box);
                  const mbr = boxToMbr(box).transform(pageTransf);
                  const sel = d3.select(this);
                    sel
                    .attr("x", mbr.min.x + 2 )
                    .attr("y", mbr.min.y + 2 )
                    .attr("width", 16)
                    .attr("height", 16)
                    .style("display", function(d, i) {
                      return (typeof d.audio == "number"? 1:"none") ; })
                    .style("text-anchor", "middle")
                    .attr("opacity", 0)
                    .transition()
                    .delay(delay)
                    .attr("opacity", 1)
                }),
          
          (update) => update,
          
          (exit) => exit.remove()
        );
      
    }
  
    // Loads page pageNo
    async function loadPage(pageNo, delay = 500) {
      console.log("loadPage", { PageInp });
      if (currentPageNo == pageNo) return 0;
      const duration = 500;
      currentPage = await getRectImage(pdfDocument, { pageNo }, width, height);
      const [x, y, w, h] = currentPage.box;
      const { width: imgWidth, height: imgHeight } = currentPage;
      const mbr1 = new MBR(Vec(x, y), Vec(x + w, y + h));
      const origin =
        width - imgWidth > height - imgHeight
          ? Vec((width - imgWidth) / 2.0)
          : Vec(0, (height - imgHeight) / 2);
      const mbr2 = new MBR(
        origin,
        origin.add(Vec(currentPage.width, currentPage.height))
        
      );
  
      // Where the page is within the svg
      pageTransf = mbrTransf(mbr1, mbr2);
  
      const url = currentPage.toDataURL();
      const enterFromBelow = !currentPageNo || pageNo > currentPageNo;
  
      pageGroup
        .selectAll("image")
        .data([{ pageNo, origin, imgHeight, url }], (d) => d.pageNo)
        .join(
          (enter) =>
            enter
              .append("image")
              .attr("href", (d) => d.url)
              .attr("transform", (d) =>
                enterFromBelow
                  ? `translate(${d.origin.x},${d.origin.y + d.imgHeight + 10})`
                  : `translate(${d.origin.x},${d.origin.y - d.imgHeight - 10})`
              )
              .transition()
              .delay(delay)
              .duration(duration)
              .attr("transform", (d) => `translate(${d.origin.x},${d.origin.y})`),
          (update) => update,
          (exit) =>
            exit
              .transition()
              .delay(delay)
              .duration(duration)
              .attr("transform", (d) =>
                enterFromBelow
                  ? `translate(${d.origin.x},${d.origin.y - d.imgHeight - 10})`
                  : `translate(${d.origin.x},${d.origin.y + d.imgHeight + 10})`
              )
              .remove()
        );
  
      loadAreas(pageNo, delay + duration);
  
      currentPageNo = pageNo;
      PageInp.value = currentPageNo;
      return delay + duration;
    }
  
    // Highlights a rect selection
    async function loadRect(rect) {
     
      let data = [];
      let icox, icoy = 0;
      
      const pageDelay = 500;
      let pageDuration = 0;
      //console.log("loadRect", { rect });
      const sameRect = ((rect == currentRect) && currentRectSelected)// It's the same rect
      
      if (rect) {
        pageDuration = await loadPage(rect.pageNo, pageDelay);
        currentRect = rect;
      }
      
      if (rect && rect.box) {
        const rectImage = (rect.rectImage =
          rect.rectImage ||
          (await getRectImage(pdfDocument, rect, width, height)));
        const url = rectImage.toDataURL();
  
        // MBR of the rectImage
        const mbr1 = new MBR(Vec(0, 0), Vec(rectImage.width, rectImage.height));
  
        // MBR of the rect within the page
        const mbr2 = boxToMbr(rect.box);
  
        // Transformation from the rectImage to its place in the page
        var { a, b, c, d, e, f } = pageTransf.mult(mbrTransf(mbr1, mbr2));
        const transf2 = `translate(${e},${f}) scale(${a},${d})`;
  
        // Compute where the highlighted rect will land at
        let mbr0;
        const rectScale = Math.min(
          maxZoom.value * a,
          width - rectImage.width < height - rectImage.height
            ? (rectImage.width - margin * 2) / rectImage.width
            : (rectImage.height - margin * 2) / rectImage.height
        );
        const halfDiagonal = Vec(rectImage.width, rectImage.height).scale(
          rectScale / 2
        );
        //console.log("loadRect", { zoomPos });
        if (zoomPos.value == "pageCenter") {
          const center = Vec(width / 2, height / 2);
          mbr0 = new MBR(center.sub(halfDiagonal), center.add(halfDiagonal));
        } else {
          // zoomPosition == "rectCenter"
          const mbr2Page = mbr2.transform(pageTransf);
          const center = mbr2Page.center();
          mbr0 = new MBR(center.sub(halfDiagonal), center.add(halfDiagonal));
          let dx = margin - mbr0.min.x;
          if (dx > 0) mbr0 = mbr0.transform(Matrix.translate(dx, 0));
          dx = width - margin - mbr0.max.x;
          if (dx < 0) mbr0 = mbr0.transform(Matrix.translate(dx, 0));
          let dy = margin - mbr0.min.y;
          if (dy > 0) mbr0 = mbr0.transform(Matrix.translate(0, dy));
          dy = height - margin - mbr0.max.y;
          if (dy < 0) mbr0 = mbr0.transform(Matrix.translate(0, dy));
        }
  
        // Transformation from the rectImage to its highlight place
        var { a, b, c, d, e, f } = mbrTransf(mbr1, mbr0);
        const transf1 = `translate(${e},${f}) scale(${a},${d})`;
        data = [{ rect, url, transf2, transf1, rectImage }];
      //console.log("rect", rect);
      
        icox = e;
        icoy = f;
        
        
      }
      //console.log("loadRect", { sameRect });
      // Update the rectGroup
      rectGroup
        .selectAll("image")
        .data(data, (d) => d.transf2)
        .join(
          (enter) => {
              enter
                .append("image")
                .attr("href", (d) => d.url)
                .on("click", closeCallback)
                //.on("click", loadRect(0))
                .attr("transform", (d) => d.transf2)
                .attr("opacity", 0)
                .transition()
                .delay(pageDuration)
                .attr("opacity", 1 )
                .attr("filter", "url(#dropShadow)")
                .transition()
                .duration(1000)
                .attr("transform", (d) => d.transf1);
          },
          (update) => {
            if (!sameRect) {
              update
                .attr("filter", "")
                .transition()
                .duration(pageDelay)
                .attr("opacity", 1)
                .attr("transform", (d) => d.transf1);
              setCurrentRectStatus(true);
            } else {
              update
                .attr("filter", "")
                .transition()
                .duration(pageDelay)
                .attr("opacity", 0)
                .attr("transform", (d) => d.transf2);
                setCurrentRectStatus(false);
            }
          },
          (exit) => {
            exit
              .attr("filter", "")
              .transition()
              .duration(pageDelay)
              .attr("transform", (d) => d.transf2)
              .remove();
          }
        );
      if (rect && rect.box && (typeof (rect.audio) == "number")) {
        console.log("icox",icox);
        let data_rect = [rect]
        console.log("data_rect", data_rect);
        playpauseGroup
          .selectAll(".playpause-ico")
          .data(data_rect, (d) => d)
          .join(
            (enter) =>
              enter
              .append("image")
                .attr("class", "playpause-ico")
                .attr("xlink:href", "https://thenounproject.com/api/private/icons/159152/edit/?backgroundShape=CIRCLE&backgroundShapeColor=%23FFFFFF&backgroundShapeOpacity=1&exportSize=752&flipX=false&flipY=false&foregroundColor=%23000000&foregroundOpacity=1&imageFormat=png&rotation=0")
                .attr("x", icox + 5 )
                .attr("y", icoy + 5 )
                .attr("width", 20)
                .attr("height", 20)
                .on("click", function (){
                  d3.select(this)
                    .each(function (d, i){
                      console.log("play clicado d", d);
                      if (typeof( d.audio) == "number"){
                         if (audio){
                           if (!audio.paused){
                             audio.pause();
                           } else {
                             audio.play();
                           }
                           //audio = null;
                         }
                        else {
                          console.log("DictaphoneObj.getAudio(d.audio)", DictaphoneObj.getAudio(d.audio))
                          audio = new Audio(DictaphoneObj.getAudio(d.audio).src);
                          audio.play();
                        }
                       }
                    });
                })
                .style("display", function(d, i) {
                  console.log("displayy d", d );
                  let display = (typeof d.audio == "number"? 1:"none");
                  console.log("display", display);
                  return display ; })
                .style("text-anchor", "middle")
                .attr("opacity", 0)
                .transition()
                .delay(1000)
                .attr("opacity", 1),
            
            (update) => {
              if (!sameRect) {
                update
                  .transition()
                  .attr("x", icox + 5 )
                .attr("y", icoy + 5 )
                .attr("width", 20)
                .attr("height", 20)
                  .delay(1000)
                  .duration(0)
                  .attr("opacity", 1);
              } else {
                update
                  .transition()
                  .attr("x", icox + 5 )
                .attr("y", icoy + 5 )
                .attr("width", 20)
                .attr("height", 20)
                  .duration(0)
                  .attr("opacity", 0)
              }
            },
            (exit) => {
              exit
                .transition()
                .duration(0)
                .remove();
            }
          );
      }
    }
  
    async function rectNoCallback() {
      //console.log("rectNoCallback", { currentPageNo });    
      await loadRect(pageRectangles[rectNo.value]);
    }
    async function PageInpCallback() {
      //console.log("PageInpCallback", { PageInp });    
      await loadPage( PageInp.value);
    }
    
    rectNo.addEventListener("input", rectNoCallback);
    maxZoom.addEventListener("input", rectNoCallback);
    zoomPos.addEventListener("input", rectNoCallback);
    PageInp.addEventListener("input", PageInpCallback);
    
    await rectNoCallback();
  
  
    return htl.html`
    <div>
      <div class="flex"><div class="center">${PageInp}</div><div class="center">${maxZoom}</div></div>
      <div class="flex"><div class="center">${zoomPos}</div></div>
      ${frame}
      <div style="display:none">
        ${soundClips}
      </div>
      <div class="flex"><div class="center">${rectNo}</div><div class="center">${buttons}</div></div>
    </div>
    <style>
    .flex {
    display: flex;
    width: ${width}px
    }
    .center {
    //margin-left: ${width/2-40}px;
      margin:auto;
    }
    .button {
      margin-left: ${width/2-40}px;
     // margin:auto;
    }
    </style>
  `;
  }
)}

function _debug(){return(
[]
)}

function _9(rectViewer,pdfDocument,defaultRects){return(
rectViewer(pdfDocument, defaultRects)
)}

function _mbrTransf(Matrix){return(
function mbrTransf(mbr1, mbr2) {
  const [p1, p2] = [mbr1.min, mbr1.max];
  const [q1, q2] = [mbr2.min, mbr2.max];
  const a = (q2.x - q1.x) / (p2.x - p1.x);
  const d = (q2.y - q1.y) / (p2.y - p1.y);
  const e = q1.x - a * p1.x;
  const f = q1.y - d * p1.y;
  return new Matrix(a, 0, 0, d, e, f);
}
)}

function _boxToMbr(MBR,Vec){return(
function boxToMbr(box) {
  return new MBR(Vec(box[0], box[1]), Vec(box[0] + box[2], box[1] + box[3]));
}
)}

function _mapImages(getRectImage,pdfDocument){return(
async function mapImages(Rectangles, wBar = 200, hBar = 90){
      let separator = 5;
      let wsize = wBar - 10;
      let hsize = hBar - 10;
      let ySum = 0;
      let xbar = (wBar - wsize) /2
      let imgs = [];
      
      for (let pr of Rectangles) {
        //if (pr.pageNo == pageNo) {
        let [x, y, w, h] = pr.box.map((x) => x );
        //  if (pr == selectedRect) ctx.fillRect(x, y, w, h);
        let h2 = Math.min((h / w)  * wsize, hsize);
        let w2 = Math.min((w / h)  * hsize, wsize);
        
        let img = await getRectImage(pdfDocument, pr, w2, h2);
        //ctx.drawImage(img, x, ySum, wsize, h);
        const url = img.toDataURL();
        const translate = `translate(${xbar},${ySum})`;
        imgs.push({ element : pr, url, x: xbar, y: ySum, wsize: w2, h: h2, translate  });
        
        ySum += h + separator;
        //}
      }
      return imgs;
    }
)}

function _13(md){return(
md`## Dependencies`
)}

async function _pdfjs(require)
{
  const lib = await require("https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js");
  lib.GlobalWorkerOptions.workerSrc =
    "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.js";
  return lib;
}


export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["igarashi-et-al-1999.pdf", {url: new URL("./files/7c017ecb74bcfc40c27ab7eece42a036a4e91b2c85e855277b42424f70d6312bac5e95c18d67c783ff0979d8a85150c57987873ac4b2357ca34cb20a2624000e.pdf", import.meta.url), mimeType: "application/pdf", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("pdfDocument")).define("pdfDocument", ["pdfjs","FileAttachment"], _pdfDocument);
  main.variable(observer("defaultRects")).define("defaultRects", _defaultRects);
  main.variable(observer("getRectImage")).define("getRectImage", ["DOM"], _getRectImage);
  main.variable(observer("getText")).define("getText", _getText);
  main.variable(observer()).define(["getText","pdfDocument"], _6);
  main.variable(observer("rectViewer")).define("rectViewer", ["htl","Dictaphone","Inputs","d3","Event","boxToMbr","mutable debug","getRectImage","MBR","Vec","mbrTransf","Matrix","Audio"], _rectViewer);
  main.define("initial debug", _debug);
  main.variable(observer("mutable debug")).define("mutable debug", ["Mutable", "initial debug"], (M, _) => new M(_));
  main.variable(observer("debug")).define("debug", ["mutable debug"], _ => _.generator);
  main.variable(observer()).define(["rectViewer","pdfDocument","defaultRects"], _9);
  main.variable(observer("mbrTransf")).define("mbrTransf", ["Matrix"], _mbrTransf);
  main.variable(observer("boxToMbr")).define("boxToMbr", ["MBR","Vec"], _boxToMbr);
  main.variable(observer("mapImages")).define("mapImages", ["getRectImage","pdfDocument"], _mapImages);
  main.variable(observer()).define(["md"], _13);
  const child1 = runtime.module(define1);
  main.import("MBR", child1);
  main.import("Vec", child1);
  main.import("Matrix", child1);
  main.variable(observer("pdfjs")).define("pdfjs", ["require"], _pdfjs);
  const child2 = runtime.module(define2);
  main.import("Dictaphone", child2);
  return main;
}

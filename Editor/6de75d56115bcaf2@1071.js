import define1 from "./9a7362216b9c95fc@769.js";
import define2 from "./3a1a35b62fdb644d@452.js";

function _1(md){return(
md`# PDF rect selector code`
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

function _mapImages(getRectImage){return(
async function mapImages(Rectangles, pdfDocument = pdfDocument, wBar = 200, hBar = 90){
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

function _selectRects(htl,mapImages,Inputs,Event,width,Dictaphone,Vec,MBR,d3,Audio,DOM){return(
async function selectRects(pdfDocument, options = {}) {
  const fw = options.width || 800;
  const fh = options.height || 600;
  
  let Rectangles = options.value || [];
  let audios_list_blb = options.audios || [];
  
  const wBar = 250;
  const margins = `top:${0}px;left:${10}px;`;
  console.log("pageRectangles", { Rectangles });
  
  const frame = htl.html`<div>`;
  frame.style.cssText = `width:${fw}px;height:${fh}px;background:gray;border:1px solid gray;overflow:scroll;position:relative;${margins}`;
  const content = htl.html`<div>`;
  content.style.cssText = `position:relative;`;
  //const sidebar = htl.html`<div>`;
  const soundClips = htl.html`<section class="sound-clips">`;
  //let currentEventSidebar = {};
  
  //new sidebar
  let sidebarRectW = wBar - 20;
  let sidebarRectH = sidebarRectW * (9/16);
  let marginRect = 5;
  var rectOrder = [];
  Rectangles.forEach(function(node, i) {
    node.index = i;
    node.y = i;
		rectOrder.push(i);
    //node.audio = null;
  	});
  let dragging = {index:null,y:null,order:null};
  
  console.log("pageRectangles", { Rectangles });
  //end new Sidebar

  
  const mI = await mapImages(Rectangles,pdfDocument, wBar)
  const hBar = mI.length ? Math.max( mI[mI.length -1].y + mI[mI.length -1].h,fh)  : fh
  
  //const sidebar = htl.html`<svg width=${wBar+5} height=${hBar}>`;
  //sidebar.style.cssText = `position:relative;`;
  //sidebar.style.background = "gray";
  
  //frame.append(sidebar);
  frame.append(content);
  
  const numPages = pdfDocument._pdfInfo.numPages;
  const pageRange = Inputs.range([1, numPages], {
    value: 1,
    label: "Page #",
    step: 1
  });

  const Selection = Inputs.range([0, Rectangles.length], {
    value: 0,
    label: "Selection #",
    step: 1
  });
  
  function set(input, value) {
    if (input.value == value) {return;}
    input.value = value;
    input.dispatchEvent(new Event("input"));
    console.log("input",input);
    console.log("value",value);
    
  }

  const buttonsPage = Inputs.button([
    ["previous page", () => set(pageRange, Math.max(1, pageRange.value - 1))],
    ["next page", () => set(pageRange, Math.min(numPages, pageRange.value + 1))]
  ]);
  const [prevpage, nextpage] = [
    ...buttonsPage.children
  ];
  
  const buttonsSelection = Inputs.button([
    ["zoom in"],
    ["zoom out"],
    ["remove selection"]
  ]);
  const [zoomin, zoomout, removerect] = [
    ...buttonsSelection.children
  ];

  const buttonsRecorder = Inputs.button([
    ["Rec"],
    ["Stop"],
    ["Delete"]
  ]);
  const [recorderStart, recorderStop, recorderDelete] = [
    ...buttonsRecorder.children
  ];
  
  const panel = htl.html`
  <div>
    <div class="flex-selector"><div class="center-selector">${pageRange}</div>
      <div class="button1-selector">${buttonsPage}</div>
    </div>
    <div class="flex-selector">
      <div class="button2-selector">${buttonsSelection}</div>
      <!-- <div class="button2-selector">${Selection}</div> -->
       <!-- <div class="button2-selector">${buttonsRecorder}</div> -->
    </div>
    <div class="flex2" >
      <div class="newSidebar" height=${fh}px></div>
      ${frame}
      <div style="display:none">
        ${soundClips}
      </div>
    </div>
  </div>
  
  <style>
  .flex-selector {
  display: flex;
  width: ${fw+wBar}px
  }
  .center-selector {
    margin:auto;
    width: 300px;
  }
  .button1-selector {
    margin-left: ${fw/4-100}px;
    //margin:auto;
  }
  .button2-selector {
    //margin-left: ${fw/4-100}px;
    margin:auto;
  }
 .newSidebar{
    position:relative;
    height: ${fh}px;
    overflow-x: hidden;
    overflow-y: auto;
  }

.cellrowImg .cellrow .label {
    cursor: move; /* fallback if grab cursor is unsupported */
    cursor: grab;
    cursor: -moz-grab;
    cursor: -webkit-grab;
}

  .flex2 {
  display: flex;
  width: ${width}px
  }
  text {
  			text-shadow: 0 1px 0 #fff, 1px 0 0 #fff, 0 -1px 0 #fff, -1px 0 0 #fff;
  			/* cursor: move; */
		}

  .sound-clips {
    flex: 1;
    overflow: auto;
    padding: 20px;
    margin-left: 20px;
    box-shadow: inset 0 3px 4px rgba(0,0,0,0.7);
    background-color: rgba(0,0,0,0.1);
    display: hide;
  }
  
  section, article {
    display: block;
  }
  
  .clip {
    padding-bottom: 1rem;
  }
  
  audio {
    width: 100%;
    display: block;
    margin: 1rem auto 0.5rem;
  }
  
  .clip p {
    display: inline-block;
    font-size: 1rem;
  }
  
  .clip button {
    font-size: 1rem;
    float: right;
  }
  </style>


`;

  panel.value = Rectangles;
  let scale = 1;
  const DictaphoneObj = await Dictaphone.build(soundClips );
  //console.log("DictaphoneObj",DictaphoneObj);

  for (let aud in audios_list_blb){
    console.log("psc aud", aud);
    console.log("psc audios_list_blb[aud]", audios_list_blb[aud]);
    DictaphoneObj.uploadAudio( audios_list_blb[aud]);
  }
  
  
    
  var audio = null;
  
    // The main d3 svg selections
  //const sidebarSel = d3.select(sidebar);
  // Group for images on sidebar
  //const imgGroup = sidebarSel.append("g").attr("class", "imgGroup");

  
  //
  // Handles one page
  //
  async function editPage(page, pageNo) {
    let [scrollLeft, scrollTop] = [0, 0];
    let [sideBarScrollLeft, sideBarScrollTop] = [0, 0];

    const { width, height } = page.getViewport({ scale: 1 });

    //
    // Rectangle Interaction
    //
    let selectedRect = null;
    let mouse = Vec(0, 0);
    let dragFunction = null;
    let top = 0;
    let left = 0;

    const drawRectangles = (ctx) => {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.strokeStyle = "red";
      ctx.fillStyle = "rgba(128,128,128,0.2)";
      for (let pr of Rectangles) {
        if (pr.pageNo == pageNo) {
          let [x, y, w, h] = pr.box.map((x) => x * scale);
          if (pr == selectedRect) ctx.fillRect(x, y, w, h);
          ctx.strokeRect(x, y, w, h);
        }
      }
      //console.log("Rectangles", { Rectangles });
    };
    
    
    const mouseDragged = (ctx, x, y) => {
      if (dragFunction) dragFunction(ctx, x, y);
    };

    const dragSelected = (ctx, x, y) => {
      selectedRect.box[0] += (x - mouse.x) * scale;
      selectedRect.box[1] += (y - mouse.y) * scale;
      drawRectangles(ctx);
      mouse = Vec(x, y);
    };

    
    let extentPoints = [];
    const extendSelected = (ctx, x, y) => {
      let points = [...extentPoints, Vec(x, y)];
      let mbr = new MBR(...points);
      let size = mbr.size();
      selectedRect.box = [mbr.min.x, mbr.min.y, size.x, size.y].map(
        (x) => x / scale
      );
      drawRectangles(ctx);
    };

    const mousePressed = (ctx, x, y) => {
      mouse = Vec(x, y);
      const dmin = 3;
      for (let pr of Rectangles) {
        if (pr.pageNo == pageNo) {
          let [x0, y0, w, h] = pr.box.map((x) => x * scale);
          let p = Vec(x0, y0);
          let q = p.add(Vec(w + 1, h + 1));
          let mbr = new MBR(p, q);
          if (mbr.pointDist(mouse) <= dmin) {
            selectedRect = pr;
            const [l, r, t, b] = [
              Math.abs(x - p.x) <= dmin,
              Math.abs(x - q.x) <= dmin,
              Math.abs(y - p.y) <= dmin,
              Math.abs(y - q.y) <= dmin
            ];
            if (l || r || t || b) {
              dragFunction = extendSelected;
              if (l && t) extentPoints = [q];
              else if (l && b) extentPoints = [Vec(q.x, p.y)];
              else if (r && t) extentPoints = [Vec(p.x, q.y)];
              else if (r && b) extentPoints = [p];
              else if (l) extentPoints = [q, Vec(q.x, p.y)];
              else if (r) extentPoints = [p, Vec(p.x, q.y)];
              else if (t) extentPoints = [q, Vec(p.x, q.y)];
              else if (b) extentPoints = [p, Vec(q.x, p.y)];
            } else dragFunction = dragSelected;
            set(Selection,Rectangles.findIndex(x => x === pr));
            return;
          }
        }
      }
      
      rectOrder.push(Rectangles.length);
      selectedRect = { pageNo, box: [mouse.x / scale, mouse.y / scale, 1, 1], index: Rectangles.length, y: Rectangles.length, audio:null };
      Rectangles.push(selectedRect);
      console.log("rectOrder", rectOrder);
      
      extentPoints = [mouse];
      dragFunction = extendSelected;
      set(Selection,Rectangles.length);
      //drawNewSidebar();
    };
    const mouseReleased = (ctx) => {
      dragFunction = null;
      drawRectangles(ctx);
      panel.dispatchEvent(new CustomEvent("input")); // Signal a change in the selections
      drawNewSidebar(ctx)
    };

    // new sidebar
    function ypos(d){
  		let defaultPos = rectOrder[d.index]*(sidebarRectH + marginRect);
  		if (dragging["y"] != null && dragging["index"] != null){
  			let defaultposdrag = dragging["order"]*(sidebarRectH + marginRect);
  			//subindo
  			if( defaultposdrag >  dragging["y"] && dragging["y"]<= defaultPos && defaultposdrag >  defaultPos ){
  				defaultPos = (rectOrder[d.index]+1)*(sidebarRectH + marginRect);
  			}
  			//descendo
  			else if (defaultposdrag <  dragging["y"] && dragging["y"]>= defaultPos && defaultposdrag <  defaultPos){
  				defaultPos = (rectOrder[d.index]-1)*(sidebarRectH + marginRect);
  			}
  		}
  		return defaultPos;
	  }
    
    function position(d) {
	  	var v = dragging["y"];
		  var idx = dragging["index"];
	  	return idx == null || idx != d.index ? ypos(d) : v;
	  }
    
    function fdrag (ctx) {

  		var drag_behavior = d3.behavior.drag();
  		var trigger;
  
  		d3.selectAll(".row").call(d3.behavior.drag()
  			.origin(function(d) { 
  				console.log("Origin=", rectOrder[d.element.index]);
          selectedRect = d.element;
          set(pageRange, d.element.pageNo);
          set(Selection,d.element.index);
          
          drawRectangles(ctx);
          console.log("rectOrder-origin", rectOrder);
  				return {y: ypos(d.element)}; 
  			})
  			.on("dragstart", function(d) {
        console.log('trigger = ' + trigger);
  				trigger = d3.event.sourceEvent.target.className.baseVal;
  						
  				if (trigger == "cellrowImg" || trigger == "cellrow" || trigger == "label") {
  					d3.selectAll(".cellrowImg").attr("opacity", 1);
  					dragging["y"] = position(d.element);
  					dragging["index"] = d.element.index;
  					dragging["order"] = rectOrder[d.element.index];
  					console.log("dragging[d.y]=", dragging["y"])
  					// Move the row that is moving on the front
  					let sel = d3.select(this);
  					sel.moveToFront();
            console.log("rectOrder-start", rectOrder);
  				}
          
  			})
  			.on("drag", function(d) {
  
  				if (trigger == "cellrowImg" || trigger == "cellrow" || trigger == "label") {
            const max = Math.max(... rectOrder);
            const index = rectOrder.indexOf(max);
  					dragging["y"] = Math.min(Math.max(fh, position( Rectangles[index]) + sidebarRectH) , Math.max(0, d3.event.y));
  
  					d3.selectAll(".row").attr("transform", function(d, i) { 
  						return "translate(0," + position(d.element) + ")"; 
  					});
            console.log("rectOrder-drag", rectOrder);
  				}
  			})
  			.on("dragend", function(d) {
        
  				if (trigger == "cellrowImg" || trigger == "cellrow" || trigger == "label") {
  
  					var order = [];
  					Rectangles.forEach(function(node, i) {
  						order.push(position(node))
  					});
  					console.log("order: ");
  					console.log(order);
  
  					order.forEach(function(p, i) {
  						rectOrder[i] = order.filter(obj => obj < p ).length ;
              Rectangles[i].y = rectOrder[i];
  					});
  					console.log("Rectangles: ");
  					console.log(Rectangles);
            console.log("rectOrder: ");
  					console.log(Rectangles);
  
  					dragging["y"] = null;
  					dragging["index"] = null;
  					dragging["order"] = null;
  
  
  					d3.selectAll(".row")
  					.transition()
  					.duration(500)
  					.attr("transform", function(data, i) { 
  						if(d.element.index === data.element.index){
  							return "transform", "translate(0," + ypos(d.element) + ")"
  						}
  						return "translate(0," + position(data.element) + ")"; 
  					});

            d3.selectAll(".row")
            .selectAll(".label")
            .transition()
  					.delay(500)
            .text(function(d, i) { return rectOrder[ d.element.index]; });
            
  					order.forEach(function(p, index) {
        
            let sel = d3.selectAll(".row")
  						          .filter(function(d, i) { 
  						          return d.element.index === index });
              sel.moveToFront();
            });
            console.log("rectOrder-end", rectOrder);
  				}
          else if (trigger == "rec-ico"){
            var beginRec = recorderStartCallback()
            console.log("beginRec", beginRec);
            if(beginRec) {
                //https://img.icons8.com/color/344/record.png 2x
                //var currAudio
                //if (typeof currAudio =="number"){
                  recorderDeleteCallback()
                //}
                d3.selectAll(".rec-ico")
                  .filter(function(p, i) { 
                    return p.element.index === d.element.index })
                  .attr("xlink:href", "https://img.icons8.com/color/344/record.png");
            }
            else {
                recorderStopCallback()
                d3.selectAll(".rec-ico")
                  .filter(function(p, i) { 
                    return p.element.index === d.element.index})
                  .attr("xlink:href", "https://img.icons8.com/ios-glyphs/452/record.png");
                
              d3.selectAll(".rmv-ico")
                  .style("display", function(d, i) {return (typeof( d.element.audio) == "number"?"unset":"none" ) });
              d3.selectAll(".playpause-ico")
                  .style("display", function(d, i) {return (typeof( d.element.audio) == "number"?"unset":"none" ) });
            }
          }//rmv-ico
           else if (trigger == "rmv-ico"){
             recorderDeleteCallback()
             d3.selectAll(".rmv-ico")
                  .style("display", function(d, i) {return (typeof( d.element.audio) == "number"?"unset":"none" ) });
             d3.selectAll(".playpause-ico")
                  .style("display", function(d, i) {return (typeof( d.element.audio) == "number"?"unset":"none" ) });
           }
          //playpause-ico
          else if (trigger == "playpause-ico"){
            if (typeof( d.element.audio) == "number"){
             if (audio){
               if (!audio.paused){
                 audio.pause();
               }
               audio = null;
             }
            else {
              audio = new Audio(DictaphoneObj.getAudio(d.element.audio).src);
              audio.play();
            }
           }
            
          }
  			})
  		);
  	}

    
    const drawNewSidebar = async (ctx) => {
      //let	c = d3.scale.category20().domain(d3.range(36));
      let data =  await mapImages(Rectangles,pdfDocument, sidebarRectW - 20, sidebarRectH);
      var offsetX = 20;
      
      var svg = d3.select(".newSidebarSVG")
      		.attr("width", wBar)
      		.attr("height", function() {

            const max = Math.max(... rectOrder);
            const index = rectOrder.indexOf(max);
            console.log("max", max);
            console.log("data[index].element", data[index].element);
            
            return position( data[index].element) + 2*sidebarRectH 
            
          })
      
      var matrix = d3.select("#matrix");
      
      var row = matrix.selectAll(".row")
      	.data(data)
      	.enter()
        .append("g")
    		.attr("class", "row")
    		.attr("transform", function(d, i) { 
			    return "translate(0," + position(d.element) + ")"; });

      var rect = row.append("rect")
        .attr("class", "cellrow")
        .attr("x", function(d) { return 0;})
        .attr("width", sidebarRectW)
        .attr("height",sidebarRectH)
        .style("fill", function (d, i){return "#F3F3F3"; })
        .attr('stroke', '#000')
        .attr('stroke-width', '1');

      row.append('svg:image')
        .attr("class", "cellrowImg")
        .attr("x", function(d) { 
            return 0; 
        })
        .attr("width",function (d, i){
            return d.wsize })
        .attr("height",function (d, i){
            return d.h })
        .attr("transform", function(d, i) { 
          //console.log("d", d);
          console.log("sidebarRectW", sidebarRectW);
			    return "translate("+ (offsetX + (sidebarRectW - d.wsize - offsetX) / 2) +"," + (sidebarRectH - d.h)/2 + ")"; })
        .attr('xlink:href', function(d) { 
            return d.url; 
        });

      row.append("rect")
        .attr("class", "cellrow")
        .attr("x", function(d) { return 0;})
        .attr("width", offsetX)
        .attr("height",sidebarRectH)
        .style("fill", function (d, i){return "#808080";});
      
      row.append("text")
      		.attr("class", "label")
        .attr("x", offsetX/2)
        .attr("y",  function(d, i) { 
			    return (sidebarRectH)/2; })
      		.text(function(d, i) { return d.element.index; })
        .style("text-anchor", "middle");

      row.append("rect")
        .attr("class", "cellrow")
        .attr("x", function(d) { return sidebarRectW - 30 ;})
        .attr("y", function(d) { return sidebarRectH - 15 ;})
        .attr("width", 30)
        .attr("height", 15)
        .style("fill", function (d, i){return "#808080";});
      
      row.append("text")
      		.attr("class", "labelpg")
        .attr("x", sidebarRectW - 2)
        .attr("y",  sidebarRectH - 5)
      		.text(function(d, i) { return "pg. " + d.element.pageNo; })
        .style("text-anchor", "end")
        .style("font-size", "12px");
      
      //gravador
      row.append("image")
            .attr("class", "rec-ico")
            .attr("xlink:href", "https://img.icons8.com/ios-glyphs/452/record.png")
            .attr("x", sidebarRectW + 2)
            .attr("y", 10)
            .attr("width", 16)
            .attr("height", 16)
            .style("cursor", "pointer");
            //.on('click', function(d,i){ recorderStartCallback  });
      //https://static.thenounproject.com/png/159152-200.png
      row.append("image")
            .attr("class", "playpause-ico")
            .attr("xlink:href", "https://static.thenounproject.com/png/159152-200.png")
            .attr("x", sidebarRectW + 2)
            .attr("y", 50)
            .attr("width", 16)
            .attr("height", 16)
            .style("cursor", "pointer")
            .style("display", function(d, i) { return (typeof d.element.audio == "number"? 1:"none") ; })
            .style("text-anchor", "middle");
        
      //lixeira
      row.append("image")
            .attr("class", "rmv-ico")
            .attr("xlink:href", "https://img.icons8.com/windows/344/delete.png")
            .attr("x", sidebarRectW + 2)
            .attr("y", 90)
            .attr("width", 16)
            .attr("height", 16)
            .style("cursor", "pointer")
            .style("display", function(d, i) { return (typeof d.element.audio == "number"? 1:"none") ; });



      
      fdrag(ctx);
      
    }
    
    
    d3.selection.prototype.moveToFront = function() {
	  	return this.each(function(){
	    	this.parentNode.appendChild(this);
	  	});
	  };

	  function transition(g) {
	  	return g.transition().duration(500);
	  }
    //new sidebar end

    
    //
    // pdf rendering
    //
    const refresh = async() => {
      const viewport = page.getViewport({ scale });
      const { width: w, height: h } = viewport;
      console.log("viewport: ", viewport);
      const top = h < fh ? (fh - h) / 2 : 0;
      const left = ( w < fw ? (fw - w) / 2 : 0); //centralizando
      const margins = `top:${top}px;left:${left}px;`;

      const ctx = DOM.context2d(w, h, 1);
      ctx.canvas.style.cssText = `position:absolute;${margins}`;

      const ctx2 = DOM.context2d(w, h, 1);

      ctx2.canvas.style.cssText = `z-index:1;position:absolute;${margins}`;
      ctx2.canvas.onmousedown = (e) => {
        mousePressed(ctx2, e.offsetX, e.offsetY);
      };
      ctx2.canvas.onmouseup = (e) => {
        mouseReleased(ctx2, e.offsetX, e.offsetY);
      };
      ctx2.canvas.onmousemove = (e) => {
        mouseDragged(ctx2, e.offsetX, e.offsetY);
      };

      const barLeft = 0;//w + left + 5
      const marginsBar = `top:${top}px;left:${barLeft}px;`;
      const ctxBar = DOM.context2d(wBar, h, 1);
      
      ctxBar.canvas.style.cssText = `z-index:2;position:absolute;${marginsBar};background:grey`;

      
      const renderPromise = page.render({
        canvasContext: ctx,
        transform: null,
        viewport
      }).promise;
      
      renderPromise.then(() => {
        content.innerHTML = "";
        content.append(ctx.canvas);
        content.append(ctx2.canvas);
        //sidebar.append(ctxBar.canvas);
        drawRectangles(ctx2);
        //drawRectanglesBar(ctxBar);
        console.log("ctxBar", { ctxBar });

        const svg = d3.select("#matrix").node()
            ? d3.select('#matrix')
            : d3.select(".newSidebar")
                .append("svg")
                .attr("class","newSidebarSVG")
                .append("g")
            		.attr("id", "matrix");
        
        drawNewSidebar(ctx2);
        
        //viewport.width += ctxBar.canvas.width + 5;
        //viewport.viewBox[2] = viewport.width; 
        console.log("viewport", { viewport });
        console.log("frame", { frame });
        //frame.clientWidth = viewport.width;
        
        setTimeout(() => {
          frame.scrollTop = scrollTop;
          frame.scrollLeft = scrollLeft;
        }, 100);
      });
      
      const removerectCallback = () => {
        if (selectedRect) {
          recorderDeleteCallback();
          
          console.log("selectedRect",selectedRect);
          const i = selectedRect.index;
          
          d3.selectAll(".row")
            .filter((d,ind) => {return d.element.index == i})
            .remove();
          
          Rectangles.splice(i, 1);
          rectOrder.splice(i, 1);
          Rectangles.forEach(function(p, i) {
  						rectOrder[i] = rectOrder.filter(obj => obj < rectOrder[i]).length;
              Rectangles[i].y = rectOrder[i];
              Rectangles[i].index = i;
  					}); 
          console.log("Rectangles",Rectangles);
          console.log("rectOrder", rectOrder);

          d3.selectAll(".row")
  					.transition()
  					.duration(500)
  					.attr("transform", function(data, i) {
  						return "translate(0," + position(data.element) + ")"; 
  					});
          
          d3.selectAll(".row")
            .selectAll(".label")
            .transition()
  					.delay(500)
            .text(function(d, i) { return d.element.index; });

          mouseReleased(ctx2);

          //drawNewSidebar();
        }
      };
      removerect.onclick = removerectCallback;
    
      
      let data =  await mapImages(Rectangles,pdfDocument);

    };
    
    

    refresh();
    //fdrag();
    
    frame.onscroll = () => {
      [scrollTop, scrollLeft] = [frame.scrollTop, frame.scrollLeft];
    };
    var newSidebar = d3.select(".newSidebar");
    newSidebar.onscroll = () => {
      [sideBarScrollLeft, sideBarScrollLeft] = [newSidebar.scrollTop, newSidebar.scrollLeft];
    };
    
    const zoominCallback = () => {
      scale *= 1.1;
      refresh();
    };
    const zoomoutCallback = () => {
      scale /= 1.1;
      refresh();
    };
    zoomin.onclick = zoominCallback;
    zoomout.onclick = zoomoutCallback;
    

    var recorderStartCallback = function () {
      //console.log("DictaphoneObj",DictaphoneObj)
      console.log("recorderStartCallback");
      if (selectedRect){
        var recorderStartCallbackret = DictaphoneObj.fRecord();
          console.log("recorderStartCallback", recorderStartCallbackret)
        return recorderStartCallbackret;
      }
      else{
        console.log("Precisa selecionar um retangulo para gravar.")
      }
    };
    
    const recorderStopCallback = () => {
      console.log("recorderStopCallback");
      if(selectedRect){
        var audioId = DictaphoneObj.fStop();
        console.log("selectedRect",selectedRect);
        var audios = DictaphoneObj.getAudios();
        console.log("audios",audios);
        
        Rectangles[selectedRect.index].audio = audioId;
        console.log("Rectangles", Rectangles);
      }else{
        console.log("Precisa selecionar um retangulo para gravar.")
      }
    };
    const recorderDeleteCallback = () => {
      console.log("selectedRect",selectedRect);
      console.log("recorderDeleteCallback");
      if(selectedRect && typeof(selectedRect.audio) == 'number' ){
        
        var audioId = selectedRect.audio
        DictaphoneObj.removeAudio(audioId)
        
        Rectangles[selectedRect.index].audio = null;
        Rectangles.forEach(function(d, index) {
          if(d.audio && d.audio > audioId){
            d.audio = d.audio-1;
          }
        })
          
        console.log("Rectangles", Rectangles);
      }else{
        console.log("Precisa selecionar um retangulo com audio para excluir gravação.")
      }
    };
    recorderStart.onclick = recorderStartCallback;
    recorderStop.onclick = recorderStopCallback;
    recorderDelete.onclick = recorderDeleteCallback;
    

  }

  let page;
  async function loadPage() {
    page = await pdfDocument.getPage(pageRange.value);
    editPage(page, pageRange.value);
  }
  await loadPage();
  pageRange.addEventListener("input", loadPage);

  return panel;
}
)}

function _rects(selectRects,pdfDocument,defaultRects){return(
selectRects(pdfDocument, {
  width: 600,
  height: 800,
  value: defaultRects
})
)}

function _10(rects){return(
rects
)}

function _11(rects){return(
JSON.stringify(rects)
)}

function _12(md){return(
md`## Dependencies`
)}

async function _pdfjs(require)
{
  const lib = await require("https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js");
  lib.GlobalWorkerOptions.workerSrc =
    "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.js";
  return lib;
}


async function _d3(require)
{
  const lib = await require("https://d3js.org/d3.v3.min.js");
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
  main.variable(observer("mapImages")).define("mapImages", ["getRectImage"], _mapImages);
  main.variable(observer("selectRects")).define("selectRects", ["htl","mapImages","Inputs","Event","width","Dictaphone","Vec","MBR","d3","Audio","DOM"], _selectRects);
  main.variable(observer("viewof rects")).define("viewof rects", ["selectRects","pdfDocument","defaultRects"], _rects);
  main.variable(observer("rects")).define("rects", ["Generators", "viewof rects"], (G, _) => G.input(_));
  main.variable(observer()).define(["rects"], _10);
  main.variable(observer()).define(["rects"], _11);
  main.variable(observer()).define(["md"], _12);
  const child1 = runtime.module(define1);
  main.import("MBR", child1);
  main.import("Vec", child1);
  main.import("Matrix", child1);
  main.variable(observer("pdfjs")).define("pdfjs", ["require"], _pdfjs);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  const child2 = runtime.module(define2);
  main.import("Dictaphone", child2);
  return main;
}

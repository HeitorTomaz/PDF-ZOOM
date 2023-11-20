function _1(md){return(
md`# Web dictaphone

This is a more or less straight port of Mozilla's [*web dictaphone*](https://developer.mozilla.org/en-US/docs/Web/API/MediaStream_Recording_API/Using_the_MediaStream_Recording_API) app to Observable. This demo of the [MediaStream Recording API](https://developer.mozilla.org/en-US/docs/Web/API/MediaStream_Recording_API) allows you to record audio snippets with your microphone and then play these. 

### Modifications 
  1. Adapted the interface somewhat to make it fit in an Observable cell.
  2. Added a button for saving the recordings.
  3. Added a checkbox to enable silence detection during the recording, i.e., pauses the recording if no sound is detected for a second or so.

`
)}

function _app(htl){return(
htl.html`<div class="wrapper">
  <header>
    <h1>Web dictaphone</h1>
  </header>

  <section class="main-controls">
    <div id="buttons">
          <button class="record">Record</button>
          <button class="stop">Stop</button>
    </div>
  </section>
  <section class="sound-clips">
  </section>
</div>`
)}

function _style(htl){return(
htl.html`<style>

.wrapper {
  width: 100%;
  position: relative;
  display: flex;
  overflow: hidden;
  flex-direction: column;
   font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: 0.8rem;
  height: 400px;
}

header h1 {
  font-family:  cursive; 
}
.wrapper h1, .wrapper h2 {
  font-size: 2rem;
  text-align: center;
  font-weight: normal;
  padding: 0.5rem 0 0 0;
  max-width:100%;
}

.main-controls {
  padding: 0.5rem 0;
}

.wrapper #buttons {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.wrapper #buttons button {
  font-size: 1rem;
  padding: 1rem;
  width: calc(50% - 0.25rem);
}

.wrapper button {
  font-size: 1rem;
  background: #0088cc;
  text-align: center;
  color: white;
  border: none;
  transition: all 0.2s;
  padding: 0.5rem;
}

button:hover, button:focus {
  box-shadow: inset 0px 0px 10px rgba(255, 255, 255, 1);
  background: #0ae;
}

button:active {
  box-shadow: inset 0px 0px 20px rgba(0,0,0,0.5);
  transform: translateY(2px);
}


/* Make the clips use as much space as possible, and
 * also show a scrollbar when there are too many clips to show
 * in the available space */
.sound-clips {
  flex: 1;
  overflow: auto;
  padding: 10px;
  box-shadow: inset 0 3px 4px rgba(0,0,0,0.7);
  background-color: rgba(0,0,0,0.1);
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

button.delete{
  background: #f00;
}

button.save {
  background: #070;
}

button.delete, button.save {
  padding: 0.5rem 0.75rem;
  margin-left: 0.2rem;
  font-size: 0.8rem;
}

/* Checkbox hack to control information box display */

label.help{
  font-size: 2rem;
  position: absolute;
  top: 2px;
  right: 3px;
  z-index: 5;
  cursor: pointer;
  background-color: black;
  border-radius: 10px;
}

input.help[type=checkbox] {
   position: absolute;
   top: -200px;
}

div.aside {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform: translateX(100%);
  transition: 0.3s all ease-out;
  background-color: #efefef;
  padding: 1rem;
}

.aside p {
  font-size: 1.2rem;
  margin: 0.5rem 0;
}

.aside a {
  color: #666;
}

/* Toggled State of information box */
input[type=checkbox]:checked ~ div.aside {
  transform: translateX(0);
}

/* Cursor when clip name is clicked over */

.clip p {
  cursor: pointer;
}

/* Adjustments for wider screens */
@media all and (min-width: 800px) {
  /* Don't take all the space as readability is lost when line length
     goes past a certain size */
  .wrapper {
    width: 90%;
    max-width: 1000px;
    margin: 0 auto;
  }
}
</style>`
)}

function _4(md){return(
md`## The interface elements`
)}

function _record(app){return(
app.querySelector(".record")
)}

function _stop(app){return(
app.querySelector(".stop")
)}

function _soundClips(app){return(
app.querySelector(".sound-clips")
)}

function _debug(){return(
""
)}

function _mainBlock(MediaRecorder,record,stop,$0,htl,soundClips)
{
  if (navigator.mediaDevices.getUserMedia) {
    const constraints = { audio: true };
    let chunks = [];

    let onSuccess = function (stream) {
      const mediaRecorder = new MediaRecorder(stream);

      visualize(stream, mediaRecorder);

      record.onclick = function () {
        mediaRecorder.start();
        record.style.background = "red";

        stop.disabled = false;
        record.disabled = true;
        $0.value = [];
      };

      stop.onclick = function () {
        mediaRecorder.stop();
        record.style.background = "";
        record.style.color = "";

        stop.disabled = true;
        record.disabled = false;
      };

      mediaRecorder.onstop = function (e) {
        const clipName = "My Unnamed clip";

        const clipContainer = htl.html`<article class="clip">`;
        const clipLabel = htl.html`<input type=text value=${clipName} >`;
        const audio = htl.html`<audio controls="">`;
        const saveButton = htl.html`<button class="save">Save`;
        const deleteButton = htl.html`<button class="delete">Delete`;

        clipContainer.append(audio, clipLabel, deleteButton, saveButton);
        soundClips.append(clipContainer);

        audio.controls = true;
        const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
        chunks = [];
        const audioURL = URL.createObjectURL(blob);
        audio.src = audioURL;

        saveButton.onclick = function (e) {
          let link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = `${clipLabel.value}.ogg`;
          link.click();
          document.removeChild(link);
        };

        deleteButton.onclick = function (e) {
          let evtTgt = e.target;
          evtTgt.parentNode.parentNode.removeChild(evtTgt.parentNode);
        };
      };

      mediaRecorder.ondataavailable = function (e) {
        chunks.push(e.data);
        $0.value.push(e);
      };
    };

    let onError = function (err) {
      console.log("The following error occured: " + err);
    };

    navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);
  } else {
    throw "getUserMedia not supported on your browser!";
  }

  const audioCtx = new AudioContext();


  function visualize(stream, recorder) {
    const source = audioCtx.createMediaStreamSource(stream);

    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 2048;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    source.connect(analyser);

  }
}


function _Dictaphone(MediaRecorder,htl){return(
class Dictaphone {
  chunks = [];
  audios = [];
  constraints = { audio: true };
  clipName = "My Unnamed clip";
  
  constructor(stream = undefined, soundClips = null) {
    
    console.log("constructor");
    if (typeof stream === 'undefined') {
            throw new Error('Cannot be called directly');
    }

    this.soundClips = soundClips;
    
    this.audioCtx = new AudioContext();

    this.stream = stream;
    this.mediaRecorder = new MediaRecorder(stream);
    this.visualize(this.stream, this.mediaRecorder);


    this.mediaRecorder.onstop = function (e) {
        //const clipName = "My Unnamed clip";

        const clipContainer = htl.html`<article class="clip">`;
        //const clipLabel = htl.html`<input type=text value=${this.clipName} >`;
        const audio = htl.html`<audio controls="">`;
        //const saveButton = htl.html`<button class="save">Save`;
        //const deleteButton = htl.html`<button class="delete">Delete`;

        clipContainer.append(audio);

        soundClips.append(clipContainer);
        
        audio.controls = true;
        const blob = new Blob(this.chunks, { type: "audio/ogg; codecs=opus" });
        

        if(!this.audios){this.audios = [];}

        this.chunks = [];
        
      
        const audioURL = URL.createObjectURL(blob);
        audio.src = audioURL;
      
        this.audios.push({src:audioURL, id: this.clipName});

      };
    
      this.mediaRecorder.ondataavailable = function (e) {
        //console.log("ondataavailable-chunks", this.chunks );
        //console.log("ondataavailable-e.data", e.data );
        if(!this.chunks){this.chunks = [];}
        this.chunks.push(e.data);
        //mutable debug.push(e);
      };
  }
  
  static build = async function (soundClips = null) {
    //console.log("build");
    var constraints = { audio: true };
    var stream = await navigator.mediaDevices.getUserMedia(constraints);
    
    var obj = new Dictaphone(stream, soundClips);
    return obj;
    //return new myClass(async_result);
  }
  
  
  visualize = function (stream, recorder) {
    const source = this.audioCtx.createMediaStreamSource(stream);

    const analyser = this.audioCtx.createAnalyser();
    analyser.fftSize = 2048;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    source.connect(analyser);

  }

  fRecord = function () {
    //console.log("fRecord");
    if(this.mediaRecorder.state == "recording") {
      console.log("Já está gravando");
      return false;
    }
    this.mediaRecorder.start();
    return true;
  };

  fStop = function (name = "My Unnamed clip") {
    //console.log("fStop");
    if(this.mediaRecorder.state != "recording") {
      console.log("não está gravando");
      return null;
    }
    if(name){this.clipName = name}
    var id = this.getAudios().length;
    this.mediaRecorder.stop();
    return id;
  };
  
  onError = function (err) {
      console.log("The following error occured: " + err);
    };

  getAudios = function () {
    var clips = document.getElementsByClassName('clip');
    var clipsArr = [];
    for (var i = 0; i < clips.length; i++) {
      clipsArr.push({src: clips[i].children[0].src})
    } 
    return clipsArr;
  }
  getAudio = function (id){
    return this.getAudios()[id];
  };
  saveAudio(id, name){
    var audio = this.getAudio(id);
    let link = document.createElement("a");
    link.href = audio.src;
    link.download = `${name}.ogg`;
    link.click();
    //document.removeChild(link);
  }
  removeAudio (id){
    var clips = document.getElementsByClassName('clip');
    clips[id].parentNode.removeChild(clips[id]);
  }


  uploadAudio (blob_audio) {
    
    const clipContainer = htl.html`<article class="clip">`;
    //const clipLabel = htl.html`<input type=text value=${this.clipName} >`;
    const audio = htl.html`<audio controls="">`;
    //const saveButton = htl.html`<button class="save">Save`;
    //const deleteButton = htl.html`<button class="delete">Delete`;

    clipContainer.append(audio);

    this.soundClips.append(clipContainer);

    audio.controls = true;
    
    if(!this.audios){this.audios = [];}

    const audioURL = URL.createObjectURL(blob_audio);
    console.log("audioURL",audioURL);
    audio.src = audioURL;

    this.audios.push({src:audioURL, id: this.clipName});

  };
}
)}

function _app2(htl){return(
htl.html`<div class="wrapper">
  <header>
    <h1>Web dictaphone</h1>
  </header>

  <section class="sound-clips">
  </section>
</div>`
)}

function _record2(app2){return(
app2.querySelector(".record")
)}

function _stop2(app2){return(
app2.querySelector(".stop")
)}

function _soundClips2(app2){return(
app2.querySelector(".sound-clips")
)}

function _DictaphoneObj(Dictaphone,soundClips2){return(
Dictaphone.build(soundClips2 )
)}

function _rec(Inputs,DictaphoneObj){return(
Inputs.button("record", {value: null, reduce: () => DictaphoneObj.fRecord()})
)}

function _18(rec){return(
rec
)}

function _sto(Inputs,DictaphoneObj){return(
Inputs.button("stop", {value: null, reduce: () => DictaphoneObj.fStop()})
)}

function _save(Inputs,DictaphoneObj){return(
Inputs.button("Save", {value: null, reduce: () => DictaphoneObj.saveAudio(0,"nome do primeiro")})
)}

function _rmv(Inputs,DictaphoneObj){return(
Inputs.button("Remove", {value: null, reduce: () => DictaphoneObj.removeAudio(1)})
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("app")).define("app", ["htl"], _app);
  main.variable(observer("style")).define("style", ["htl"], _style);
  main.variable(observer()).define(["md"], _4);
  main.variable(observer("record")).define("record", ["app"], _record);
  main.variable(observer("stop")).define("stop", ["app"], _stop);
  main.variable(observer("soundClips")).define("soundClips", ["app"], _soundClips);
  main.define("initial debug", _debug);
  main.variable(observer("mutable debug")).define("mutable debug", ["Mutable", "initial debug"], (M, _) => new M(_));
  main.variable(observer("debug")).define("debug", ["mutable debug"], _ => _.generator);
  main.variable(observer("mainBlock")).define("mainBlock", ["MediaRecorder","record","stop","mutable debug","htl","soundClips"], _mainBlock);
  main.variable(observer("Dictaphone")).define("Dictaphone", ["MediaRecorder","htl"], _Dictaphone);
  main.variable(observer("app2")).define("app2", ["htl"], _app2);
  main.variable(observer("record2")).define("record2", ["app2"], _record2);
  main.variable(observer("stop2")).define("stop2", ["app2"], _stop2);
  main.variable(observer("soundClips2")).define("soundClips2", ["app2"], _soundClips2);
  main.variable(observer("DictaphoneObj")).define("DictaphoneObj", ["Dictaphone","soundClips2"], _DictaphoneObj);
  main.variable(observer("viewof rec")).define("viewof rec", ["Inputs","DictaphoneObj"], _rec);
  main.variable(observer("rec")).define("rec", ["Generators", "viewof rec"], (G, _) => G.input(_));
  main.variable(observer()).define(["rec"], _18);
  main.variable(observer("viewof sto")).define("viewof sto", ["Inputs","DictaphoneObj"], _sto);
  main.variable(observer("sto")).define("sto", ["Generators", "viewof sto"], (G, _) => G.input(_));
  main.variable(observer("viewof save")).define("viewof save", ["Inputs","DictaphoneObj"], _save);
  main.variable(observer("save")).define("save", ["Generators", "viewof save"], (G, _) => G.input(_));
  main.variable(observer("viewof rmv")).define("viewof rmv", ["Inputs","DictaphoneObj"], _rmv);
  main.variable(observer("rmv")).define("rmv", ["Generators", "viewof rmv"], (G, _) => G.input(_));
  return main;
}

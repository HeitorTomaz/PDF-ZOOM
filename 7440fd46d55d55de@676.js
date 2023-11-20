function _1(md){return(
md`# Pass Values as URL Parameters
Tools for passing and reading values into a notebook via URL params, including light obfuscation, url formatting, and building a param list.

1. Import this notebook: \`\`\`import {getParamValue} from '@bherbertlc/pass-values-as-url-parameters'\`\`\`

2. Add url params to your notebook's url (see next block below for help): \`\`\`observablehq.com/@MY_NAME/my_notebook?username=windu&color=magenta\`\`\`
3. Access a param's value in your notebook: \`\`\`getParamValue("username")\`\`\`

See more details at the bottom`
)}

function _2(md){return(
md`## 1. Create a list of key-value-pairs below
This list will automatically fill in with this page's params. Try it out:
https://observablehq.com/@bherbertlc/pass-values-as-url-parameters?username=mace&color=magenta

You can delete a param after selecting it with the radio buttons.`
)}

function _selectedKVP(Inputs,kvpArray){return(
Inputs.table(kvpArray, {multiple: false})
)}

function _4(Inputs,selectedKVP,deleteKVP){return(
Inputs.button("Delete param: " + (selectedKVP ? selectedKVP.key : ""), {value: null, reduce: () => deleteKVP(selectedKVP.key)})
)}

function _5(md){return(
md`### Add new param:`
)}

function _inputKey(Inputs){return(
Inputs.text({label: "key"})
)}

function _inputVal(Inputs){return(
Inputs.text({label: "val"})
)}

function _8(Inputs,inputKey,addKVP,inputVal){return(
Inputs.button("Add param " + inputKey, {value: null, reduce: () => addKVP(inputKey, inputVal)})
)}

function _9(getUrlParamsFromArray,kvpArray,md){return(
md`## 2. Append one of these strings to your ObservableHQ url
raw:  
**${getUrlParamsFromArray(kvpArray, false)}**


obfuscated:   
**${getUrlParamsFromArray(kvpArray, true)}**


"Obfuscated" strings are just slightly less convenient to abuse; don't share links with sensitive params. The getter() here will deobfuscate them in your notebook, using the **prmenc** param's presence as a flag.
`
)}

function _10(md){return(
md`## 3. Read the value from your notebook
Import this function:
~~~js
     import {getParamValue} from "@bherbertlc/pass-values-as-url-parameters"
~~~

and read a value by passing in a param key name:
~~~js
     getParamValue("username")
~~~`
)}

function _11(md){return(
md`---
# Notes
Useful for creating bookmark links to Notebooks with custom values automatically inserted.

Also useful for cases where you want to share a notebook without sharing a key, but still allow a key to be easily included. For instance, if I want to use secured API functions in a notebook, I can bake my API key into a bookmarked url for my own use, or to share with my trusted teammates. Or anyone can copy the base URL (they have no knowledge of my params) and add their own key to their links.

This introduces no technical vulnerabilities, just human-error ones; beware of how you share those bookmarked param links. There's an option to "encode" values, but it's just a light scramble.

Ideally, this would be done with ObservableHQ's Secrets, but Secrets are disabled when a Notebook is shared, even for the publishing party. Hopefully they'll add a warning dialog or something to allow that functionality while addressing [the security concerns](https://talk.observablehq.com/t/secrets-for-published-notebooks/2723).`
)}

function _12(md){return(
md`---
## Init`
)}

function _ENCODE_PARAM(){return(
"prmenc"
)}

function _kvpArray(){return(
[]
)}

function _urlParams(URLSearchParams){return(
new URLSearchParams(window.location.search)
)}

function _keyValues(){return(
{}
)}

function _17(urlParams,ENCODE_PARAM,addKVP,decodeFromUrl)
{
  var isEncoded = urlParams.get(ENCODE_PARAM) != null
  console.log("encoded?" + isEncoded.toString())
  for (const key of urlParams.entries())
    addKVP(key[0], decodeFromUrl(key[1], isEncoded))
  return "Added params from url"
}


function _18(md){return(
md`## Functions`
)}

function _addKVP(ENCODE_PARAM,keyValues,$0,dictToArray){return(
function addKVP(key, val) {
  if (!key || key == ENCODE_PARAM) return
  console.log("key " + key + " val " + val)
  if (!(key in keyValues)) {
    keyValues[key] = val
  }
    
  $0.value = dictToArray(keyValues)
}
)}

function _deleteKVP(keyValues,$0,dictToArray){return(
function deleteKVP(key) {
  delete keyValues[key]
  $0.value = dictToArray(keyValues)
}
)}

function _dictToArray(keyValues){return(
function dictToArray(dict) {
  var arr = []
  for (const [key, value] of Object.entries(keyValues))
    arr.push({key : key, value : value})
  return arr
}
)}

function _getParamValue(URLSearchParams,ENCODE_PARAM,decodeFromUrl){return(
function getParamValue(param) {
  var urlParams = new URLSearchParams(window.location.search);
  if (!urlParams.has(param)) return null

  var isEncoded = urlParams.get(ENCODE_PARAM) != null

  var value = urlParams.get(param)
  value = decodeFromUrl(value, isEncoded)

  return value
}
)}

function _getUrlParamsFromArray(encodeForUrl,ENCODE_PARAM){return(
function getUrlParamsFromArray(arr, encode = true) {
  var params = "?"
  arr.forEach(e => params +=(e.key + "=" + encodeForUrl(e.value, encode)) + "&");
  if (encode) {
    params += ENCODE_PARAM + "&"
  }
  return params.slice(0,-1)
}
)}

function _getEntriesFromUrlParams(urlParams,ENCODE_PARAM,decodeFromUrl){return(
function getEntriesFromUrlParams(isEncoded = false) {
  if (urlParams.get(ENCODE_PARAM)) {
    isEncoded = true
  }
  var keyValues = {}
  for (const entry of urlParams.entries())
    keyValues[entry[0]] = decodeFromUrl(entry[1], isEncoded)

  return keyValues
}
)}

function _encodeForUrl(){return(
function encodeForUrl(p, obfuscate) {
  if (obfuscate) {
    p = btoa(p)
  }
  return encodeURI(p)
}
)}

function _decodeFromUrl(){return(
function decodeFromUrl(p, obfuscated) {
  p = decodeURI(p)
  if (obfuscated) {
    p = atob(p)
  }
  return p
}
)}

function _27(md){return(
md`## Imports`
)}

function _28(md){return(
md`## Debug`
)}

function _29(encodeForUrl){return(
encodeForUrl("appPdjAAIF7vQVVQ9", true)
)}

function _30(decodeFromUrl){return(
decodeFromUrl("YXBwUGRqQUFJRjd2UVZWUTk=", true)
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md"], _2);
  main.variable(observer("viewof selectedKVP")).define("viewof selectedKVP", ["Inputs","kvpArray"], _selectedKVP);
  main.variable(observer("selectedKVP")).define("selectedKVP", ["Generators", "viewof selectedKVP"], (G, _) => G.input(_));
  main.variable(observer()).define(["Inputs","selectedKVP","deleteKVP"], _4);
  main.variable(observer()).define(["md"], _5);
  main.variable(observer("viewof inputKey")).define("viewof inputKey", ["Inputs"], _inputKey);
  main.variable(observer("inputKey")).define("inputKey", ["Generators", "viewof inputKey"], (G, _) => G.input(_));
  main.variable(observer("viewof inputVal")).define("viewof inputVal", ["Inputs"], _inputVal);
  main.variable(observer("inputVal")).define("inputVal", ["Generators", "viewof inputVal"], (G, _) => G.input(_));
  main.variable(observer()).define(["Inputs","inputKey","addKVP","inputVal"], _8);
  main.variable(observer()).define(["getUrlParamsFromArray","kvpArray","md"], _9);
  main.variable(observer()).define(["md"], _10);
  main.variable(observer()).define(["md"], _11);
  main.variable(observer()).define(["md"], _12);
  main.variable(observer("ENCODE_PARAM")).define("ENCODE_PARAM", _ENCODE_PARAM);
  main.define("initial kvpArray", _kvpArray);
  main.variable(observer("mutable kvpArray")).define("mutable kvpArray", ["Mutable", "initial kvpArray"], (M, _) => new M(_));
  main.variable(observer("kvpArray")).define("kvpArray", ["mutable kvpArray"], _ => _.generator);
  main.variable(observer("urlParams")).define("urlParams", ["URLSearchParams"], _urlParams);
  main.variable(observer("keyValues")).define("keyValues", _keyValues);
  main.variable(observer()).define(["urlParams","ENCODE_PARAM","addKVP","decodeFromUrl"], _17);
  main.variable(observer()).define(["md"], _18);
  main.variable(observer("addKVP")).define("addKVP", ["ENCODE_PARAM","keyValues","mutable kvpArray","dictToArray"], _addKVP);
  main.variable(observer("deleteKVP")).define("deleteKVP", ["keyValues","mutable kvpArray","dictToArray"], _deleteKVP);
  main.variable(observer("dictToArray")).define("dictToArray", ["keyValues"], _dictToArray);
  main.variable(observer("getParamValue")).define("getParamValue", ["URLSearchParams","ENCODE_PARAM","decodeFromUrl"], _getParamValue);
  main.variable(observer("getUrlParamsFromArray")).define("getUrlParamsFromArray", ["encodeForUrl","ENCODE_PARAM"], _getUrlParamsFromArray);
  main.variable(observer("getEntriesFromUrlParams")).define("getEntriesFromUrlParams", ["urlParams","ENCODE_PARAM","decodeFromUrl"], _getEntriesFromUrlParams);
  main.variable(observer("encodeForUrl")).define("encodeForUrl", _encodeForUrl);
  main.variable(observer("decodeFromUrl")).define("decodeFromUrl", _decodeFromUrl);
  main.variable(observer()).define(["md"], _27);
  main.variable(observer()).define(["md"], _28);
  main.variable(observer()).define(["encodeForUrl"], _29);
  main.variable(observer()).define(["decodeFromUrl"], _30);
  return main;
}

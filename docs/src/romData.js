import * as rng from "./rng.js";

const reader = new FileReader();

function compareTimeout(arr1,arr2){
  setTimeout(function(){
    return compareArray(arr1,arr2);
  }, 1000);
}

export function compareArray(arr1,arr2){
  if(!arr1 || !arr2) return false;
  let result;
  arr1.forEach((e1,i) => arr2.forEach(e2 => {
         if(e1.length > 1 && e2.length){
            result = compareArray(e1,e2);
         }else if(e1 !== e2){
            result = false;
         }else{
            result = true;
         }
    })
  )
  return result;
}

const saveData = (function () {
  var a = document.createElement("a");
  document.body.appendChild(a);
  a.style = "display: none";
  return function (data, fileName) {
    let url = window.URL.createObjectURL(new Blob([data], {type: "octet/stream"}));
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  };
}());

export const saveRom = function() {
  let flagstring = "MMBN2_"+
    document.getElementById("passcode1").value+"_"+
    document.getElementById("passcode2").value+"_"+
    document.getElementById("passcode3").value+"_"+
    document.getElementById("passcode4").value+"_"+
    rng.roll(100000000)+".gba";
  saveData(randomizedRom,flagstring);
};

export const loadRom = function() {
  resetDom();

  const file = document.getElementById("romFile").files[0];
  reader.onload = 
    (function() { 
      return function() { 
        const view = new Uint8Array(reader.result,0xA0,16);
        const checkString = [0x4D,0x45,0x47,0x41,0x4D,0x41,0x4E,0x5F,
                             0x45,0x58,0x45,0x32,0x41,0x45,0x32,0x45];
        const romString = view.map(x => x);
        setTimeout(function(){
          if (compareArray(checkString,romString)){
            document.getElementById("romCheckOK").style.display = "";
            document.getElementById("slow").style.display = "";
            setTimeout(function(){
              resetDom();
              document.getElementById("romPicker").style.display = "none";
              document.getElementById("romFile").disabled = true;
              document.getElementById("fullAccess").style.display = "";
              randomizedRom = new Uint8Array(reader.result.slice(0));
            }, 2500);
          } else {
            document.getElementById("romCheckNG").style.display = "";
          }
        }, 1000);
      };
    })();
  reader.readAsArrayBuffer(file);

  document.getElementById(checkFileSize(file.size)).style.display = "";
};

const is8MiB = n => n === 8388608;

let randomizedRom;

const resetDom = function(){
  document.getElementById("fileSizeOK").style.display = "none";
  document.getElementById("fileSizeNG").style.display = "none";
  document.getElementById("romCheckOK").style.display = "none";
  document.getElementById("romCheckNG").style.display = "none";
};

const checkFileSize = n => is8MiB(n) ? "fileSizeOK" : "fileSizeNG";

export const getView = (offset,length) => randomizedRom.subarray(offset,offset+length);

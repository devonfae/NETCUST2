import * as rng from "./rng.js"
import * as romData from "./romData.js"

let dropTable;
let dropRecords;

export const doTheThing = function(flags){
  dropTable = romData.getView(0x125E8,0xB8*60);
  assembleDropRecord();  
}

const assembleDropRecord = function(){
  dropRecords = new Array(0xB8);
  for (let i = 0; i < 0xB8; i++){
    dropRecords[i] = new Array(3);
    for (let j = 0; j < 3; j++){
      dropRecords[i][j] = new Array(10);
      for (let k = 0; k < 10; k ++){
        dropRecords[i][j][k] = new Array(2);
        dropRecords[i][j][k][0] = dropTable[i*60+j*20+k*2];
        dropRecords[i][j][k][1] = dropTable[i*60+j*20+k*2+1];
      }
    }
  }
}

const flatten = function(enemy){
  let flat = new Array(60);
  for (let j = 0; j < 3; j++){
    for (let k = 0; k < 10; k ++){
      flat[j*20+k*2] = dropRecords[enemy][j][k][0];
      flat[j*20+k*2+1] = dropRecords[enemy][j][k][1];
    }
  }
  return flat;
}

export const copyDrops = function(destination,source){
  dropTable.set(flatten(source), destination*60);
}
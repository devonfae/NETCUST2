import * as rng from "./rng.js"
import * as romData from "./romData.js"
import * as chips from "./chips.js"

let dropTable;
let dropRecords;
const navis = [0x80, 0x83, 0x86, 0x89, 0x8C, 0x8F, 0x92, 0x98, 0x9B, 0x9E, 0xA1, 
  0xA4, 0xA7, 0xAA, 0xAD, 0xB0, 0xB3, 0xB6];
const naviChips = [0xCB, 0xCE, 0xD1, 0xD4, 0xD7, 0xDA, 0xDD, 0xE0, 0xE3, 0xE6, 0xE9, 
  0xC5, 0xC8, 0xEC, 0xEF, 0xF2, 0xF5, 0xF8];
const blankEnemies = [0x7B, 0x7C, 0x7D, 0x7E, 0x7F, 0x95, 0x96, 0x97];


export const doTheThing = function(flags){
  dropTable = romData.getView(0x125E8,0xB9*60);
  assembleDropRecord();  
  //sanitizeDrops();
  if (flags.NavisAlwaysDrop) forceNaviDrops();
  //if (flags.ShuffleSame) shuffleDrops("some");
  //if (flags.ShuffleAll) shuffleDrops("all");
  //if (flags.NoZenny) removeEntries("Zenny");
  //if (flags.NoHP) removeEntries("HP");
  //if (flags.NoChips) removeEntries("Chips");
}

const forceNaviDrops = function(){
  for (let i = 0; i < navis.length; i++){
    let chip = naviChips[i];
    let drop = [chip%256,
      Math.floor(chip/256) + 2*chips.getRandomCode(chip)];
    for (let j = 0; j < 60; j += 2){
      dropTable.set(drop,navis[i]*60+j);
    }
  }
}

const sanitizeDrops = function(){
  let droppedChipNumbers = [];
  let droppedChipCodes = []
  for (let i = 0; i < 0xB8; i++){
    for (let k = 10; k > 0; k--){
      for (let j = 3; j > 0;j--){
        if (dropRecords[i][j-1][k-1][1] < 0x40)
          droppedChipNumbers.push(dropRecords[i][j-1][k-1][0] + 256*(dropRecords[i][j-1][k-1][1]%2));
          droppedChipCodes.push(Math.floor(dropRecords[i][j-1][k-1][1]/2));
      }
    }
  }
  let shortlist = removeDuplicates(droppedChipNumbers,droppedChipCodes);
  droppedChipNumbers = shortlist[0];
  droppedChipCodes = shortlist[1];
  
}

const removeDuplicates = function(list, sublist){
  let shortlist = [];
  let shortsub = [];
  for (i = 0; i < list.length; i++){
    let unique = true;
    for (j = 0; j < shortlist.length; j++){
      if ((shortlist[j] === list[i]) && (shortsub[j] === sublist[i])) {
        unique = false;
      }
    }
    if (unique) {
      shortlist.push(list[i]);
      shortsub.push(sublist[i]);
    }
  }
  return [shortlist, shortsub];
}

const shuffleDrops = function(which){

}
const removeEntries = function(which){

}

const assembleDropRecord = function(){
  dropRecords = new Array(0xB9);
  for (let i = 0; i < 0xB9; i++){
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

export const replaceDrops = function(destination,source){
  dropTable.set(flatten(source), destination*60);
}
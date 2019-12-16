import * as rng from "./rng.js"
import * as romData from "./romData.js"

let enemyLibrary;
let enemyRecords;
let enemyNameTable;
let enemyNameRecords;

const blankEnemies = [0x7B, 0x7C, 0x7D, 0x7E, 0x7F, 0x96, 0x97];
const buggedEnemies = [0x57, 0x58, 0x59, 0x5A, 0x5B, 0x5C, 0x6F, 0x70, 0x71, 0x72, 0x73, 
  0x74, 0x75, 0x76, 0x95, 0xA1, 0xA2, 0xA3];
const allEnemies = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 
  21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 
  43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 
  65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 
  87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 
  107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 
  125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 
  143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 
  161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 
  179, 180, 181, 182, 183, 184];

export let enemyMemory;
export let naviMemory;
export let newEnemyMemory;
export let newNaviMemory;

// 0x15154
// bosses start 0x80 in
export const doTheThing = function(flags){
  enemyLibrary = romData.getView(0x15154,0xB8*8);
  assembleEnemyRecord();
  if (flags.EnemyShuffle){
    let enemies = allEnemies.filter(x => 
      !buggedEnemies.includes(x) && !blankEnemies.includes(x) && x<128);
    enemyMemory = enemies.slice(0);
    if (flags.EnemyFullShuffle) {
      rng.shuffle(enemies);
    } else {
      let tier1 = enemies.filter(x => enemyRecords[x][7] === 0); 
      let tier2 = enemies.filter(x => enemyRecords[x][7] === 1);
      let tier3 = enemies.filter(x => enemyRecords[x][7] === 2);
      enemyMemory = tier1.concat(tier2).concat(tier3);
      rng.shuffle(tier1);
      rng.shuffle(tier2);
      rng.shuffle(tier3);      
      enemies = tier1.concat(tier2).concat(tier3);
    }
    newEnemyMemory = enemies;
    exchangeEnemies(enemyMemory,enemies);
  }
  if (flags.NaviShuffle){
    let navis = allEnemies.filter(x => 
      !buggedEnemies.includes(x) && !blankEnemies.includes(x) && x>127);
    if (!flags.WWWShuffle) navis = navis.filter(x => x<173);
    let tier1 = navis.filter(x => enemyRecords[x][7] === 0); 
    let tier2 = navis.filter(x => enemyRecords[x][7] === 1);
    let tier3 = navis.filter(x => enemyRecords[x][7] === 2);
    naviMemory = tier1.concat(tier2).concat(tier3);
    rng.shuffle(tier1);
    rng.shuffle(tier2);
    rng.shuffle(tier3);      
    navis = tier1.concat(tier2).concat(tier3);
    newNaviMemory = navis;
    exchangeEnemies(naviMemory,navis,true);
  }
}

const exchangeEnemies = function(old,nu,keepHp=false){
  for (let i = 0; i < old.length; i++){
    if (!keepHp) enemyLibrary.set(enemyRecords[nu[i]],old[i]*8);
    else enemyLibrary.set(enemyRecords[nu[i]].slice(2),old[i]*8+2);
    enemyNameTable.set(enemyNameRecords[nu[i]],old[i]*2);
  }
}

const assembleEnemyRecord = function(){
  enemyRecords = new Array(0xB8);
  for (let i = 0; i < 0xB8; i++){
    enemyRecords[i] = new Array(8);
    for (let j = 0; j < 8; j++){
      enemyRecords[i][j] = enemyLibrary[i*8+j];
    }
  }
  enemyNameTable = romData.getView(0x73308C,0x0200);
  enemyNameRecords = new Array(512);
  for (let i = 0; i < 0x100; i++){
    enemyNameRecords[i] = [enemyNameTable[2*i],enemyNameTable[2*i+1]];
  }
}

const correctEnemyNames = function(){
  let oldlist = enemyMemory.concat(naviMemory);
  let newlist = newEnemyMemory.concat(newNaviMemory);
  
}
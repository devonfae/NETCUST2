import * as rng from "./rng.js";
import * as romData from "./romData.js";
import * as chips from "./chips.js";

let shopInventory;
let shopRecords;
let placedChips = [];
let unplacedChips = [];

export const doTheThing = function(flags){
  shopInventory = romData.getView(0x30184,12*8*25);
  unplacedChips = chips.allChips.filter(x => !chips.blankChips.includes(x));
  if (!flags.InclNavis) unplacedChips = unplacedChips.filter(x => !chips.naviChips.includes(x));
  if (!flags.InclSecret) unplacedChips = unplacedChips.filter(x => !chips.secretChips.includes(x));
  rng.shuffle(unplacedChips);
  assembleShopRecords();
  //if (flags.Consolidate);
  if (flags.Shuffle) shuffleShopChips();
  if (flags.Random) replaceShopChips();
  if (flags.Fill) fillEmptyShopSpaces();
  if (flags.FreeChips) makeShopEntriesFree(2);
  if (flags.FreeItems) makeShopEntriesFree(1);
}

const shuffleShopChips = function(){
  let shopChips = [];
  for (let i = 0; i < 25; i++){
    if (i === 13) i++;
    for (let j = 0; j < 8; j++){
      if (shopRecords[i][j][0] === 2) {
        let shopEntry = shopRecords[i][j];
        let chipNumber = extractChipFromShopEntry(shopEntry);
        if (i === 22) {
          let cost = getChipCost(chipNumber);
          shopEntry.splice(8,4,cost%256,Math.floor(cost/256)%256,Math.floor(cost/(256*256))%256,0);
          shopEntry[1] = 3;
        }
        if (shopEntry[6] != 0x1A) shopEntry[6] = chips.getRandomCode(chipNumber);
        shopChips.push(shopEntry);
        placedChips.push(chipNumber);
        unplacedChips.filter(x => x != chipNumber);
      }
    }
  }
  rng.shuffle(shopChips);
  for (let i = 0; i < 25; i++){
    if (i === 13) i++;
    for (let j = 0; j < 8; j++){
      if (shopRecords[i][j][0] === 2) {
        let shopEntry = shopChips.pop();
        let chipNumber = extractChipFromShopEntry(shopEntry);
        if (i === 22) {
          let cost = Math.pow(2,chips.getRarity(chipNumber));
          shopEntry.splice(8,4,cost,0,0,0);
          shopEntry[1] = 1;
        }
        shopInventory.set(shopEntry,i*8*12+j*12);
      }
    }
  }
}

const replaceShopChips = function(){
  for (let i = 0; i < 25; i++){
    if (i === 13) i++;
    for (let j = 0; j < 8; j++){
      if (shopRecords[i][j][0] === 2) {
        //let shopEntry = generateShopChip(flags.InclNavis,flags.InclSecret);
        //let chipNumber = extractChipFromShopEntry(shopEntry);
        //placedChips.push(chipNumber);
        let chipNumber = unplacedChips.pop();
        let shopEntry = createShopEntryFromChipNumber(chipNumber);
        if (i === 22) {
          let cost = Math.pow(2,chips.getRarity(chipNumber));
          shopEntry.splice(8,4,cost,0,0,0);
          shopEntry[1] = 1;
        }
        shopInventory.set(shopEntry,i*8*12+j*12);
      }
    }
  }
}

const fillEmptyShopSpaces = function(){
  for (let i = 0; i < 25; i++){
    if (i === 13) i++;
    for (let j = 0; j < 8; j++){
      if (shopRecords[i][j][0] === 0) {
        //let shopEntry = generateShopChip(flags.InclNavis,flags.InclSecret);
        //let chipNumber = extractChipFromShopEntry(shopEntry);
        //placedChips.push(chipNumber);
        let chipNumber = unplacedChips.pop();
        let shopEntry = createShopEntryFromChipNumber(chipNumber);
        if (i === 22) {
          let cost = Math.pow(2,chips.getRarity(chipNumber));
          shopEntry.splice(8,4,cost,0,0,0);
          shopEntry[1] = 1;
        }
        shopInventory.set(shopEntry,i*8*12+j*12);
      }
    }
  }
}

const makeShopEntriesFree = function(x){
  for (let i = 0; i < 25; i++){
    for (let j = 0; j < 8; j++){
      if (shopInventory[i*8*12+j*12+0] === x) shopInventory.set([0,0,0,0],i*8*12+j*12+8);
    }
  }
}
  
const extractChipFromShopEntry = shopEntry => shopEntry[4]+256*shopEntry[4+1];

const generateShopChip = function(navisOk,secretsOk){
  let chip = chips.getRandomChip(navisOk,secretsOk);
  if (containsChip(placedChips, chip)) return generateShopChip(navisOk,secretsOk);
  let cost = getChipCost(chip[0]+chip[1]*256);
  let shopEntry = [2,3,0xFF,0xFF,chip[0],chip[1],chip[2],0,cost%256,Math.floor(cost/256)%256,Math.floor(cost/(256*256))%256,0];
  return shopEntry;
}

const createShopEntryFromChipNumber = function(chipNumber){
  let cost = getChipCost(chipNumber);
  let code = chips.getRandomCode(chipNumber);
  let shopEntry = [2,3,0xFF,0xFF,chipNumber%256,Math.floor(chipNumber/256),code,0,cost%256,Math.floor(cost/256)%256,Math.floor(cost/(256*256))%256,0];
  return shopEntry;
}

const getChipCost = function(chip){
  let r = chips.getRarity(chip);
  let c = chips.getCapacity(chip);
  return Math.max(100,100*(r+1)*Math.floor(Math.log(c)/Math.log(Math.SQRT2) + r*2 - 2));
}

const containsChip = function(chiplist, chip){
  chiplist.includes(chip[0]+256*chip[1]);
}

const assembleShopRecords = function() {
  shopRecords = new Array(25);
  for (let i = 0; i < 25; i++){
    shopRecords[i] = new Array(8);
    for (let j = 0; j < 8; j++){
      shopRecords[i][j] = new Array(12);
      for (let k = 0; k < 12; k++){
        shopRecords[i][j][k] = shopInventory[8*12*i+12*j+k];
      }
    }
  }
}
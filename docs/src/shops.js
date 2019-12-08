import * as rng from "./rng.js";
import * as romData from "./romData.js";
import * as chips from "./chips.js";

let shopInventory;
let shopRecords;
let placedChips;

export const doTheThing = function(flags){
  shopInventory = romData.getView(0x30184,12*8*25);
  assembleShopRecords();
  //if (flags.Consolidate);
  console.log("Going shopping!");  
  if (flags.Shuffle){
    let chips = [];
    for (let i = 0; i < 25; i++){
      for (let j = 0; j < 8; j++){
        if (shopRecords[i][j][0] === 2) chips.push(shopRecords[i][j]);
      }
    }
    placedChips = chips;
    rng.shuffle(chips);
    for (let i = 0; i < 25; i++){
      for (let j = 0; j < 8; j++){
        if (shopRecords[i][j][0] === 2) shopInventory.set(chips.pop(),i*8*12+j*12);
      }
    }
  } else if (flags.Random){
    console.log("Replacing randomly!");
    for (let i = 0; i < 25; i++){
      for (let j = 0; j < 8; j++){
        if (shopRecords[i][j][0] === 2) shopInventory.set(
        generateChip(flags.InclNavis,flags.InclSecret),i*8*12+j*12);
      }
    }
  }
  if (flags.Fill){
    for (let i = 0; i < 25; i++){
      for (let j = 0; j < 8; j++){
        if (shopRecords[i][j][0] === 0) shopInventory.set(
        generateChip(flags.InclNavis,flags.InclSecret),i*8*12+j*12);
      }
    }
  }
  // correct prices at the bugfrag shop
  for (let j = 0; j < 8; j++){
    shopInventory.set([Math.pow(2,rng.roll(5)),0,0,0],22*8*12+j*12+8);
  }
  if (flags.FreeChips){
    for (let i = 0; i < 25; i++){
      for (let j = 0; j < 8; j++){
        if (shopRecords[i][j][0] === 2) shopInventory.set([0,0,0,0],i*8*12+j*12+8);
      }
    }
  }
  if (flags.FreeItems){
    for (let i = 0; i < 25; i++){
      for (let j = 0; j < 8; j++){
        if (shopRecords[i][j][0] === 1) shopInventory.set([0,0,0,0],i*8*12+j*12+8);
      }
    }
  }
}

const generateChip = function(navisOk,secretsOk){
  let chip = chips.getRandomChip(navisOk,secretsOk);
  while (containsChip(placedChips, chip))
    chip = chips.getRandomChip(navisOk,secretsOk);
  let cost = 50*Math.floor((Math.pow(1.5,1+chips.getRarity(chip)))*(10+chips.getCapacity(chip)));
  let shopEntry = [2,3,0xFF,0xFF,chip[0],chip[1],chip[2],0,cost%256,Math.floor(cost/256)%256,Math.floor(cost/(256*256))%256,0]
  console.log(shopEntry);
  return shopEntry;
}

const containsChip = function(chiplist, chip){
  return false;
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
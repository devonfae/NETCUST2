import * as rng from "./rng.js";
import * as romData from "./romData.js";
import * as chips from "./chips.js";

let shopInventory;
let shopRecords;
let placedChips;

export const doTheThing = function(flags){
  shopInventory = romData.getView(0x30184,12*8*25);
  assembleShopRecords();
  //if (flags.ShopConsolidate);
  console.log("Going shopping!");  
  if (flags.ShopShuffle){
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
        if (shopRecords[i][j][0] === 2) shopInventory[i*25+j*8] = chips.pop();
      }
    }
  } else if (flags.ShopRandom){
    for (let i = 0; i < 25; i++){
      for (let j = 0; j < 8; j++){
        if (shopRecords[i][j][0] === 2) shopInventory[i*25+j*8] = 
          generateChip(flag.ShopInclNavis,flag.ShopInclSecret);
      }
    }
  }
  if (flags.ShopFill){
    for (let i = 0; i < 25; i++){
      for (let j = 0; j < 8; j++){
        if (shopRecords[i][j][0] === 0) shopInventory[i*25+j*8] = 
          generateChip(flag.ShopInclNavis,flag.ShopInclSecret);
      }
    }
  }
  // correct prices at the bugfrag shop
  for (let j = 0; j < 8; j++){
    shopInventory[22*25+j*8+8] = [Math.pow(2,rng.roll(5)),0,0,0];
  }
  if (flags.ShopFreeChips){
    for (let i = 0; i < 25; i++){
      for (let j = 0; j < 8; j++){
        if (shopRecords[i][j][0] === 2) shopInventory[i*25+j*8+8] = [0,0,0,0];
      }
    }
  }
  if (flags.ShopFreeItems){
    for (let i = 0; i < 25; i++){
      for (let j = 0; j < 8; j++){
        if (shopRecords[i][j][0] === 1) shopInventory[i*25+j*8+8] = [0,0,0,0];
      }
    }
  }
}

const generateChip = function(navisOk,secretsOk){
  let chip = chips.getRandomChip(navisOk,secretsOk);
  while (containsChip(placedChip, chip))
    chip = chips.getRandomChip(navisOk,secretsOk);
  let cost = 50*Math.floor((Math.pow(1.5,1+chips.getRarity(chip)))*(10+chips.getCapacity(chip)));
  return [2,3,0xFF,0xFF,chip[0],chip[1],chip[2],0,cost%256,Math.floor(cost/256)%256,Math.floor(cost/(256*256))%256,0];
}

const assembleShopRecords = function() {
  shopRecords = new Array(25);
  for (let i = 0; i < 25; i++){
    shopRecords[i] = new Array(8);
    for (let j = 0; j < 8; j++){
      shopRecords[i][j] = new Array(12);
      for (let k = 0; k < 12; k++){
        shopRecords[i][j][k] = shopInventory[25*i+8*j+k];
      }
    }
  }
}
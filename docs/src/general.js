import * as rng from "./rng.js";
import * as chips from "./chips.js";
import * as romData from "./romData.js";

let folders;

export const doTheThing = function(flags){
  if (flags.MakeNewFolders){
    makeNewFolders();
  }
  if (flags.Allowance){
    romData.getView(0x77D8CA,6).set([0xF6,0x32,0x10,0x27,0x00,0x00],0);
  }
}

const makeNewFolders = function() {
  folders = romData.getView(0x9974,4*30*3);
  buildFolder(0,1,0,0);
  buildFolder(1,2,1,0);
  buildFolder(2,3,2,1);
}

const buildFolder = function(index, rarity1, rarity2, rarity3){
  let codes = [];
  let chip;
  for (let i = 0; i < 5; i++){
    chip = chips.getRandomChipByRarity(true,true,rarity1);
    folders[index*4*30+i*4+0] = chip[0];
    folders[index*4*30+i*4+1] = chip[1];
    folders[index*4*30+i*4+2] = chip[2];
    codes.push(chip[2]);
  } 
  for (let i = 5; i < 15; i = i + 2){
    chip = chips.getRandomChipByRarity(false,false,rarity2);
    folders[index*4*30+i*4+0] = chip[0];
    folders[index*4*30+i*4+1] = chip[1];
    folders[index*4*30+i*4+2] = chip[2];
    codes.push(chip[2]);
    folders[index*4*30+i*4+4] = chip[0];
    folders[index*4*30+i*4+5] = chip[1];
    folders[index*4*30+i*4+6] = chip[2];  
  }
  for (let i = 15; i < 25; i = i + 2){
    chip = chips.getRandomChipByRarity(false,false,rarity3);
    folders[index*4*30+i*4+0] = chip[0];
    folders[index*4*30+i*4+1] = chip[1];
    folders[index*4*30+i*4+2] = chip[2];
    codes.push(chip[2]);
    folders[index*4*30+i*4+4] = chip[0];
    folders[index*4*30+i*4+5] = chip[1];
    folders[index*4*30+i*4+6] = chip[2];  
  }
  for (let i = 25; i < 30; i++){
    do {
      chip = chips.getRandomChipByRarity(false,false,rarity3);
    } while (!codes.includes(chip[2]));
    folders[index*4*30+i*4+0] = chip[0];
    folders[index*4*30+i*4+1] = chip[1];
    folders[index*4*30+i*4+2] = chip[2];
  }   
}

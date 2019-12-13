import * as rng from "./rng.js";
import * as romData from "./romData.js";

let chipLibrary;
export let codeStrength = [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0],[9,0],
  [10,0],[11,0],[12,0],[13,0],[14,0],[15,0],[16,0],[17,0],[18,0],[19,0],[20,0],[21,0],
  [22,0],[23,0],[24,0],[25,0]];
export let starOnlyChips = [];
export let naviChips = [];
export const blankChips = [0,0x10A,0x10B,0x10C,0x10D,0x10F];
export const secretChips = [171, 249, 250, 251, 252, 253, 254, 255, 256, 257, 258, 259, 260, 
  261, 262, 263, 264, 265, 266, 267, 268, 269, 270, 271];
export const allChips = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
  20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 
  42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 
  64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 
  86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 
  106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 
  124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 
  142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 
  160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 
  178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 
  196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 
  214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 
  232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 
  250, 251, 252, 253, 254, 255, 256, 257, 258, 259, 260, 261, 262, 263, 264, 265, 266, 267, 
  268, 269, 270, 271];
let limit = 5;
let alphabet = 26;

export let chipRecords;

export const doTheThing = function(flags){
  rng.roll(20);
  chipLibrary = romData.getView(0xE450,0x21E0);
  findStarOnlys();
  findNavis();
  if (flags.LimitThree) limit = 3;
  if (flags.ShortAlphabet) alphabet = 16;  
  if (flags.AllStar || flags.Random) eraseAllNonStarCodes();
  if (flags.AllStar) starOnlyChips = allChips;
  if (flags.Random) makeRandom();
  if (flags.NoStar) removeStarCodes();
  assembleChipRecord();
}

const findStarOnlys = function(){
  for (let i = 0; i < 0x10F; i ++){
    if (getCodes(i).length === 0) starOnlyChips.push(i);
  }
}

const findNavis = function(){
  for (let i = 0; i < 0x10F; i ++){
    if (getCodes(i).length === 1) naviChips.push(i);
  }
}

const eraseAllNonStarCodes = function(){
  for (let i = 0; i < 0x10F; i ++){
    chipLibrary.set([0xFF,0xFF,0xFF,0xFF,0xFF,0x1A],i*0x20);
  }
}

const removeStarCodes = function(){
  for (let i = 0; i < 0x10F; i ++){
  //only remove star if it's not a star-only chip
    if (!starOnlyChips.includes(i)) chipLibrary.set([0xFF],i*0x20+5);
  }  
}

const makeRandom = function(){
  // first, verify 5-chip (sequential) PAs
  if (limit === 5){
    let fiveChipSeq = romData.getView(0xC0A8,0xC0);
    for (let i = 4; i < 0xC0; i += 24){
      let code = rng.roll(alphabet-5);
      for (let j = 0; j < 5; j++){
        fiveChipSeq.set([code+j],i+j*4+2);
        assignCode(fiveChipSeq[i+j*4]+256*fiveChipSeq[i+j*4+1],code+j);
      }
    }
  }
  // then, 3-chip sequential PAs
  let threeChipSeq = romData.getView(0xBD50,0x180);
  for (let i = 4; i < 0x180; i += 16){
    let codes = getCodes(threeChipSeq[i]+256*threeChipSeq[i+1]);
    if (!hasSequence(codes)){
      let code = rng.roll(alphabet-3);
      for (let j = 0; j < 3; j++){  
        threeChipSeq.set([code+j],i+j*4+2);
        assignCode(threeChipSeq[i+j*4]+256*threeChipSeq[i+j*4+1],code+j);        
      }
    }
  }
  // finally, 3-chip unique PAs
  let threeChipUniq = romData.getView(0xBED0,0x1D0);
  for (let i = 4; i < 0x1D0; i += 16){
    let share = sharesAnyCode(threeChipUniq[i]+256*threeChipUniq[i+1],
                              threeChipUniq[i+4]+256*threeChipUniq[i+4+1]);
    if (!(share && hasCode(threeChipUniq[i+8]+256*threeChipUniq[i+8+1],share))){
      let code = rng.roll(alphabet);
      assignCode(threeChipUniq[i]+256*threeChipSeq[i+1],code);
      assignCode(threeChipUniq[i+4]+256*threeChipSeq[i+4+1],code);
      assignCode(threeChipUniq[i+8]+256*threeChipSeq[i+8+1],code);  
      codeStrength[code][1] = codeStrength[code][1] + 3;      
    }
  }
  //now, fill in the rest
  for (let i = 0; i < 0x10F; i ++){
    if (!starOnlyChips.includes(i)){
      let codes = getCodes(i);
      if (naviChips.includes(i)){
        if (codes.length === 0) assignCode(i,rng.roll(alphabet));
      } else {
      	if (!(codes.length >= limit)){
      	  for (let j = codes.length; j < limit; j++){
      	    assignCode(i,rng.roll(alphabet));
      	  }
      	}
      }
    }
  }
  //console.log(codeStrength);
}

  // Take a chip number and a proposed code
const assignCode = function(chip, code){
  let codes = getCodes(chip);
  if (codes.length === 0) {
    codes = [code];
    codeStrength[code][1]++;
    if (naviChips.includes(chip)) codeStrength[code][1]++;
    chipLibrary.set(codes,chip*0x20);
    return;
  }
  for (let i = 0; i < codes.length; i++){
    if (code === codes[i]){
      assignCode(chip,rng.roll(alphabet));
      return;
    } 
    if (code < codes[i]){
      codes.splice(i,0,code);
      codeStrength[code][1]++;
      if (naviChips.includes(chip)) codeStrength[code][1]++;
      chipLibrary.set(codes,chip*0x20);
      return;
    }
  }
  codes.push(code);
  codeStrength[code][1]++;
  if (naviChips.includes(chip)) codeStrength[code][1]++;
  chipLibrary.set(codes,chip*0x20);
  return;  
}

const hasCode = (chip,code) => getCodes(chip).includes(code);
const sharesCode = (chip,chjp,code) => hasCode(chip,code) && hasCode(chjp,code);

// returns the shared code, if any
const sharesAnyCode = function(chip,chjp) { 
  let codes = getCodes(chip);
  for (let i = 0; i < codes.length; i++){
    if (sharesCode(chip,chjp,codes[i])) return codes[i];
  }
  return false;
}

export const getRandomChip = function(naviok,secretok){
  let chips = allChips.filter(x => !blankChips.includes(x));
  if (!naviok) chips = chips.filter(x => !naviChips.includes(x));
  if (!secretok) chips = chips.filter(x => !secretChips.includes(x));
  let chip = chips[rng.roll(chips.length)];
  let codes = getCodes(chip);
  let code = codes.length === 0 ? 0x1A : codes[rng.roll(codes.length)];
  return [chip%256,Math.floor(chip/256),code];
}
export const getRandomChipByRarity = function(naviok,secretok,rarity){
  let chips = allChips.filter(x => !blankChips.includes(x));
  if (!naviok) chips = chips.filter(x => !naviChips.includes(x));
  if (!secretok) chips = chips.filter(x => !secretChips.includes(x));
  chips = chips.filter(x => (chipRecords[x][0x9] === rarity));
  let chip = chips[rng.roll(chips.length)];
  let codes = getCodes(chip);
  let code = codes.length === 0 ? 0x1A : codes[rng.roll(codes.length)];
  return [chip%256,Math.floor(chip/256),code];
}

export const getCodes = function(chip){ 
  let codes = chipLibrary.slice(0x20*chip,0x20*chip+5);
  codes = codes.filter(x => !(x === 0xFF));
  if (codes.length > 0){
    let arr = [];
    for (let i = 0; i < codes.length; i++) arr[i] = codes[i];
    return arr;
  }
  return [];
}

export const getRandomCode = function(chip){
  let codes = getCodes(chip);
  if (codes.length===0) return 0x1A;
  return codes[rng.roll(codes.length)];
}

export const getRarity = chip => chipRecords[chip][9];

export const getCapacity = chip => chipRecords[chip][10];  

const hasSequence = a =>
  (a[0]+2 === a[1]+1 && a[1]+1 === a[2]) || 
  (a[1]+2 === a[2]+1 && a[3]+1 === a[2]) || 
  (a[2]+2 === a[3]+1 && a[4]+1 === a[2]);
  
const assembleChipRecord = function(){
  chipRecords = new Array(0x10F);
  for (let i = 0; i < 0x10F; i++){
    chipRecords[i] = new Array(0x20);
    for (let j = 0; j < 0x20; j++){
      chipRecords[i][j] = chipLibrary[i*0x20+j];
    }
  }
}
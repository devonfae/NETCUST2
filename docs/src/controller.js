import * as rng from "./rng.js";
import * as romData from "./romData.js";
import * as chips from "./chips.js";
import * as shops from "./shops.js";
import * as enemies from "./enemies.js";
import * as rewards from "./rewards.js";
import * as general from "./general.js";


const getRom = function (){
  romData.loadRom();
  changePasscode();
};
const makeRom = function (){
  rng.seed(document.getElementById("passcode").value,
    document.getElementById("passcode").value.toUpperCase());
  rng.roll(20);
  rng.roll(20);
  rng.roll(20);
  rng.roll(20);
  rng.roll(20);  
  chips.doTheThing(toDict(document.forms.flags.elements.Codes));
  shops.doTheThing(toDict(document.forms.flags.elements.Shop));
  //enemies.doTheThing(toDict(document.forms.flags.elements.Enemies));
  //rewards.doTheThing(toDict(document.forms.flags.elements.Reward));
  general.doTheThing(toDict(document.forms.flags.elements.Other));
  romData.saveRom();
};
const changePasscode = function(){
  document.getElementById("passcode").value = getRandomChipName();
}
const toDict = function(arr){
  let dict = {};
  arr.forEach(a => dict[a.value] = a.checked);
  return dict;
}


document.getElementById("romFile").addEventListener("change", getRom);

document.getElementById("randomizeRom").addEventListener("click", makeRom);

document.getElementById("passcodeGen").addEventListener("click", changePasscode);

const chipNames = ["Cannon", "HiCannon", "M-Cannon", "Shotgun", "V-Gun",
  "CrossGun", "Spreader", "Bubbler", "Bub-V", "BubCross", "BubSprd",
  "HeatShot", "Heat-V", "HeatCros", "HeatSprd", "MiniBomb", "LilBomb",
  "CrosBomb", "BigBomb", "TreeBom1", "TreeBom2", "TreeBom3", "Sword",
  "WideSwrd", "LongSwrd", "FireSwrd", "AquaSwrd", "ElecSwrd", "FireBlde",
  "AquaBlde", "ElecBlde", "StepSwrd", "Muramasa", "CustSwrd", "Kunai1",
  "Kunai2", "Kunai3", "Slasher", "Shockwav", "Sonicwav", "Dynawave",
  "Quake1", "Quake2", "Quake3", "GutPunch", "ColdPnch", "Atk+20", "Atk+30",
  "Navi+40", "DashAtk", "Wrecker", "CannBall", "DoubNdl", "TripNdl",
  "QuadNdl", "Trident", "Ratton1", "Ratton2", "Ratton3", "FireRat",
  "Tornado", "Twister", "Blower", "Burner", "ZapRing1", "ZapRing2",
  "ZapRing3", "Spice1", "Spice2", "Spice3", "Satelit1", "Satelit2",
  "Satelit3", "Yo-Yo1", "Yo-Yo2", "Yo-Yo3", "MagBomb1", "MagBomb2",
  "MagBomb3", "Meteor9", "Meteor12", "Meteor15", "Meteor18", "Hammer",
  "CrsShld1", "CrsShld2", "CrsShld3", "TimeBom1", "TimeBom2", "TimeBom3",
  "LilCloud", "MedCloud", "BigCloud", "Mine", "FrntSnsr", "DblSnsr",
  "Remobit1", "Remobit2", "Remobit3", "AquaBall", "ElecBall", "HeatBall",
  "Geyser", "LavaDrag", "GodStone", "OldWood", "PoisMask", "PoisFace",
  "Whirlpl", "Blckhole", "Guard", "Barrier", "PanlOut1", "PanlOut3",
  "LineOut", "Lance", "ZeusHamr", "BrnzFist", "SilvFist", "GoldFist",
  "VarSwrd", "Recov10", "Recov30", "Recov50", "Recov80", "Recov120",
  "Recov150", "Recov200", "Recov300", "PanlGrab", "AreaGrab", "GrabRvng",
  "Geddon1", "Geddon2", "Geddon3", "Catcher", "Mindbndr", "Escape",
  "AirShoes", "Repair", "Candle1", "Candle2", "Candle3", "RockCube",
  "Prism", "Guardian", "Wind", "Fan", "Anubis", "SloGauge", "FstGauge",
  "FullCust", "Invis1", "Invis2", "Invis3", "DropDown", "PopUp", "StoneBod",
  "Shadow1", "Shadow2", "Shadow3", "UnderSht", "BblWrap", "LeafShld",
  "AquaAura", "FireAura", "WoodAura", "ElecAura", "LifeAur1", "LifeAur2",
  "LifeAur3", "MagLine", "LavaLine", "IceLine", "GrassLne", "LavaStge",
  "IceStage", "GrassStg", "HolyPanl", "Jealosy", "AntiFire", "AntiElec",
  "AntiWatr", "AntiDmg", "AntiSwrd", "AntiNavi", "AntiRecv", "Atk+10",
  "Fire+40", "Aqua+40", "Wood+40", "Elec+40", "Navi+20", "Roll",
  "RollV2", "RollV3", "GutsMan", "GutsManV2", "GutsManV3",
  "ProtoMan", "ProtoMnV2", "ProtoMnV3", "AirMan", "AirManV2",
  "AirManV3", "QuickMan", "QuickMnV2", "QuickMnV3", "CutMan",
  "CutManV2", "CutManV3", "ShadoMan", "ShadoMnV2", "ShadoMnV3",
  "KnightMn", "KnghtMnV2", "KnghtMnV3", "MagnetMn",
  "MagntMnV2", "MagntMnV3", "FreezeMn", "FrzManV2",
  "FrzManV3", "HeatMan", "HeatManV2", "HeatManV3", "ToadMan",
  "ToadManV2", "ToadManV3", "ThunMan", "ThunManV2",
  "ThunManV3", "SnakeMan", "SnakeMnV2", "SnakeMnV3", "GateMan",
  "GateManV2", "GateManV3", "PlanetMn", "PlnetMnV2", "PlnetMnV3",
  "NapalmMn", "NaplmMnV2", "NaplmMnV3", "PharoMan",
  "PharoMnV2", "PharoMnV3", "Bass", "BassV2", "BassV3",
  "BgRedWav", "FreezBom", "Sparker", "GaiaSwrd", "BlkBomb", "FtrSword",
  "KngtSwrd", "HeroSwrd", "Meteors", "Poltrgst"];

const getRandomChipName = () => chipNames[Math.floor(Math.random()*chipNames.length)];

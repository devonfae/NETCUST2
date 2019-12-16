const xmur3 = function(str) {
  for(var i = 0, h = 1779033703 ^ str.length; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = h << 13 | h >>> 19;
  }
  return function() {
    h = Math.imul(h ^ h >>> 16, 2246822507);
    h = Math.imul(h ^ h >>> 13, 3266489909);
    return (h ^= h >>> 16) >>> 0;
  }
}

const sfc32 = function(a, b, c, d) {
  return function() {
    a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0; 
    var t = (a + b) | 0;
    a = b ^ b >>> 9;
    b = c + (c << 3) | 0;
    c = (c << 21 | c >>> 11);
    d = d + 1 | 0;
    t = t + d | 0;
    c = c + t | 0;
    return (t >>> 0) / 4294967296;
  }
}

let rand;

export const seed = function (a, b, c, d) {
  rand = sfc32(xmur3(a+c)(),xmur3(b+d)(),xmur3(c+b)(),xmur3(d+a)());
}

export let roll = n => Math.floor(rand()*n);

export const shuffle = function(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = roll(i + 1);
    [array[i], array[j]] = [array[j], array[i]];
  }
}
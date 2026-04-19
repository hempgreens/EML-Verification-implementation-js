class Complex {
  #r = 0;
  #i = 0;
  constructor(r, i){
    if (this.#isComplex(r)) {
      [r, i] = [r.real, r.img];
    } else if (r.real && r.img) {
      [r, i] = [r.real, r.img];
    } else if (r.abs && r.arg) {
      [r, i] = [r.abs * Math.cos(r.arg), r.abs * Math.sin(r.arg)];
    }
    this.#r = this.#isNumber(r) ? r : 0;
    this.#i = this.#isNumber(i) ? i : 0;
  }
  toString(){
    return this.toCartExpr(3);
  }
  get real(){
    return this.#r;
  }
  get img(){
    return this.#i;
  }
  get abs(){
    const a2 = Math.pow(this.real, 2);
    const b2 = Math.pow(this.img, 2);
    return Math.sqrt(a2 + b2);
  }
  get arg(){
    return Math.atan2(this.img, this.real);
  }
  #isNumber(value){
    return typeof(value) === 'number' && !isNaN(value);
  }
  #isComplex(value){
    return value instanceof Complex;
  }
  #toComplex(v){
    const isComplex = this.#isComplex(v);
    const isNumber = this.#isNumber(v);
    if (!isComplex && !isNumber) {
      throw new Error(`toComplex Error: ${typeof v} ${v}`);
    } else if (isNumber) {
      v = new Complex(v, 0);
    }
    return v;
  }
  #toFixed(value, digits){
    const isFormat = !Number.isInteger(value) && typeof(digits) === 'number' && digits;
    return isFormat ? value.toFixed(digits) : value.toString();
  }
  add(v){
    v = this.#toComplex(v);
    const r = this.real + v.real;
    const i = this.img + v.img;
    return new Complex(r, i);
  }
  sub(v){
    v = this.#toComplex(v);
    const r = this.real - v.real;
    const i = this.img - v.img;
    return new Complex(r, i);
  }
  mul(v){
    v = this.#toComplex(v);
    const r = (this.real * v.real) - (this.img * v.img);
    const i = (this.real * v.img) + (this.img * v.real);
    return new Complex(r, i);
  }
  pow(n){
    const rn = Math.pow(this.abs, n);
    const na = n * this.arg;
    return (new Complex(Math.cos(na), Math.sin(na))).mul(rn);
  }
  conj(){
    return new Complex(this.real, -1 * this.img);
  }
  isClose(v, relTol = 1e-09, absTol = 0.0){
    relTol = this.#isNumber(relTol) ? relTol : 1e-09;
    absTol = this.#isNumber(absTol) ? absTol : 0.0;
    return this.sub(v).abs <= Math.max(relTol * Math.max(this.abs, v.abs), absTol);
  }
  toPolorExpr(digits){
    const absStr = this.#toFixed(this.abs, digits);
    const aStr = this.#toFixed(this.arg, digits);
    return `abs=${absStr} arg=${aStr}`;
  }
  toCartExpr(digits){
    const rStr = this.#toFixed(this.real, digits);
    const iVal = this.img;
    const signiVal = iVal >= 0 ? '+' : '-';
    const iStr = this.#toFixed(Math.abs(iVal), digits);
    if (Number(iStr) === 0) {
      return rStr;
    } else {
      return `${rStr}${signiVal}${iStr}i`;
    }
  }
}

try {
  module.exports = Complex;
} catch (e) {
  if (e.message === 'module is not defined') {
    /* nop */
  } else {
    throw e;
  }
}

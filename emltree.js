// const Complex = require('./complex');
if (!eval('!!((() => {try{return Complex}catch(e){return null}})())')) {
  Complex = require('./complex');
}


function eml(x, y){
  const exp = (z) => (
    new Complex(Math.E ** z.real * Math.cos(z.img), Math.E ** z.real * Math.sin(z.img))
  );
  const log = (z) => (
    new Complex(Math.log(z.abs), z.arg)
  );
  return exp(x).sub(log(y));
}

const $ = '$';

function log(debug, ...args){
  if (!debug) {
    return;
  }
  let msg = '';
  for (const arg of args) {
    if (typeof(arg) === 'object') {
      msg += JSON.stringify(arg, (key, value) => {
        if (Array.isArray(value)) {
          return '[' + value.map(e => {
            if (e.isComplex && e.isComplex(e)) {
              return '(' + e.toString() + ')';
            } else {
              return e;
            }
          }).join(', ') + ']';
        }
        return value;
      }) + ' ';
    } else {
      msg += arg + ' ';
    }
  }
  console.log(msg);
}

function execEmlStackProg(stackProg, debug = false, limit = 100){
  log(debug, 'START ', stackProg);
  let ptr = 0;
  while(stackProg.length !== 1) {
    log(debug, stackProg, ptr, stackProg[ptr], stackProg.length);
    if (typeof(stackProg[ptr]) === 'number') {
      ptr++;
    } else if (stackProg[ptr] === $) {
      const x = new Complex(stackProg[ptr - 1]);
      const y = new Complex(stackProg[ptr - 2]);
      log(debug, `> eml(${x}, ${y}) => ${eml(x, y)}`)
      stackProg.splice(ptr - 2, 3, eml(x, y));
      ptr--;
    }
    if (limit-- < 0) {
      break;
    }
  }
  log(debug, 'END   ', stackProg);
  return stackProg[0].real;
}

function exp(x){
  return execEmlStackProg(
    [1, x, $]
  );
}

function E(){
  return execEmlStackProg(
    [1, 1, $]
  );
}

function ln(x){
  return execEmlStackProg(
    [1, x, 1, $, $, 1, $]
  );
}

function id(x) {
  return execEmlStackProg(
    [1, 1, x, $, 1, $, $, 1, $]
  );
}

function invert(x) {
  return execEmlStackProg(
    [1, x, $, 1, 1, 1, $, $, 1, $, 1, $, 1, $, $]
  );
}

function reciprocal(x){
  return execEmlStackProg(
    [1, x, 1, 1, 1, $, $, 1, $, 1, $, 1, $, $, $]
  );
}

function multiplication(x, y) {
  return execEmlStackProg(
    [1, 1, 1, 1, y, $, 1, $, $, 1, $, 1, x, 1, $, 1, $, $, 1, $, $, $, 1, $, $]
  );
}

function division(x, y) {
  return execEmlStackProg(
    [
      1, 1, 1, 1,
      1, y, 1, 1, 1, $, $, 1, $, 1, $, 1, $, $, $,
      $, 1, $, $, 1, $, 1, x, 1, $, 1, $, $, 1, $, $, $, 1, $, $
    ]
  );
}

function assert(msg, a, b, tolerance = 1.0e-10){
  if (Math.abs(b - a) < tolerance) {
    console.warn(msg, 'OK', a, b);
  } else {
    console.warn(msg, 'NG', a, b);
  }
}

assert('exp           ', exp(5), Math.exp(5));
assert('E             ', E(), Math.E);
assert('ln            ', ln(123), Math.log(123));
assert('id            ', id(123), 123);
assert('invert        ', invert(123), -123);
assert('reciprocal    ', reciprocal(100), 1 / 100);
assert('multiplication', multiplication(100, 36), 100 * 36);
assert('division      ', division(200, 8), 200 / 8);

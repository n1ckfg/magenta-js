!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.mm=e():t.mm=e()}(global,(function(){return function(t){var e={};function s(i){if(e[i])return e[i].exports;var n=e[i]={i,l:!1,exports:{}};return t[i].call(n.exports,n,n.exports,s),n.l=!0,n.exports}return s.m=t,s.c=e,s.d=function(t,e,i){s.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:i})},s.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},s.t=function(t,e){if(1&e&&(t=s(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var i=Object.create(null);if(s.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var n in t)s.d(i,n,function(e){return t[e]}.bind(null,n));return i},s.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return s.d(e,"a",e),e},s.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},s.p="",s(s.s=27)}({0:function(t,e){t.exports=require("@tensorflow/tfjs")},27:function(t,e,s){"use strict";s.r(e),s.d(e,"PianoGenie",(function(){return p})),s.d(e,"PianoGenieKeysig",(function(){return f})),s.d(e,"PianoGenieChord",(function(){return m})),s.d(e,"PianoGenieKeysigChordFamily",(function(){return y})),s.d(e,"PianoGenieKeysigChord",(function(){return S}));var i=s(0);function n(t){for(let e=0;e<2;++e)t.c[e].dispose(),t.h[e].dispose()}function r(t,e,s){if((e=void 0!==e?e:1)<0||e>1)throw new Error("Invalid temperature specified");let n;if(0===e)n=i.argMax(t,0);else{e<1&&(t=i.div(t,i.scalar(e,"float32")));const r=i.reshape(i.softmax(t,0),[1,-1]),o=i.multinomial(r,1,s,!0);n=i.reshape(o,[])}return n}class o extends class{constructor(t){this.checkpointURL=t,this.initialized=!1}isInitialized(){return this.initialized}async initialize(t){if(this.initialized&&this.dispose(),void 0===this.checkpointURL&&void 0===t)throw new Error("Need to specify either URI or static variables");if(void 0===t){const t=await fetch(`${this.checkpointURL}/weights_manifest.json`).then(t=>t.json()).then(t=>i.io.loadWeights(t,this.checkpointURL));this.modelVars=t}else this.modelVars=t;this.decLSTMCells=[],this.decForgetBias=i.scalar(1,"float32");for(let t=0;t<2;++t){const e=`phero_model/decoder/rnn/rnn/multi_rnn_cell/cell_${t}/lstm_cell/`;this.decLSTMCells.push((t,s,n)=>i.basicLSTMCell(this.decForgetBias,this.modelVars[e+"kernel"],this.modelVars[e+"bias"],t,s,n))}this.resetState(),this.initialized=!0,this.next(0),this.resetState()}getRnnInputFeats(){return i.tidy(()=>{const t=i.tensor1d([this.button],"float32");return i.sub(i.mul(2,i.div(t,7)),1).as1D()})}next(t,e,s){return this.nextWithCustomSamplingFunction(t,t=>r(t,e,s))}nextFromKeyWhitelist(t,e,s,n){return this.nextWithCustomSamplingFunction(t,t=>{const o=i.tensor1d(e,"int32");let a=r(t=i.gather(t,o),s,n);const l=i.gather(o,i.reshape(a,[1]));return a=i.reshape(l,[]),a})}nextWithCustomSamplingFunction(t,e){const s=this.lastState;this.button=t;const i=this.getRnnInputFeats(),[r,o]=this.evaluateModelAndSample(i,s,e);return i.dispose(),n(this.lastState),this.lastState=r,o}evaluateModelAndSample(t,e,s){if(!this.initialized)throw new Error("Model is not initialized.");const[n,r]=i.tidy(()=>{let n=i.matMul(i.expandDims(t,0),this.modelVars["phero_model/decoder/rnn_input/dense/kernel"]);n=i.add(n,this.modelVars["phero_model/decoder/rnn_input/dense/bias"]);const[r,o]=i.multiRNNCell(this.decLSTMCells,n,e.c,e.h),a={c:r,h:o};let l=i.matMul(o[1],this.modelVars["phero_model/decoder/pitches/dense/kernel"]);l=i.add(l,this.modelVars["phero_model/decoder/pitches/dense/bias"]);const c=i.reshape(l,[88]);return[a,s(c).dataSync()[0]]});return[n,r]}resetState(){void 0!==this.lastState&&n(this.lastState),this.lastState=function(){const t={c:[],h:[]};for(let e=0;e<2;++e)t.c.push(i.zeros([1,128],"float32")),t.h.push(i.zeros([1,128],"float32"));return t}()}dispose(){this.initialized&&(Object.keys(this.modelVars).forEach(t=>this.modelVars[t].dispose()),this.decForgetBias.dispose(),n(this.lastState),this.initialized=!1)}}{getRnnInputFeats(){return i.tidy(()=>{const t=[super.getRnnInputFeats()],e=this.lastOutput,s=this.lastTime,n=this.time;let r;void 0===this.deltaTimeOverride?r=(n.getTime()-s.getTime())/1e3:(r=this.deltaTimeOverride,this.deltaTimeOverride=void 0);const o=i.scalar(e,"int32"),a=i.addStrict(o,i.scalar(1,"int32")),l=i.cast(i.oneHot(a,89),"float32");t.push(l);const c=i.scalar(r,"float32"),d=i.round(i.mul(c,31.25)),u=i.minimum(d,32),h=i.cast(i.add(u,1e-4),"int32"),p=i.oneHot(h,33),m=i.cast(p,"float32");return t.push(m),this.lastTime=n,i.concat1d(t)})}nextWithCustomSamplingFunction(t,e){this.time=new Date;const s=super.nextWithCustomSamplingFunction(t,e);return this.lastOutput=s,this.lastTime=this.time,s}overrideLastOutput(t){this.lastOutput=t}overrideDeltaTime(t){this.deltaTimeOverride=t}resetState(){super.resetState(),this.lastOutput=-1,this.lastTime=new Date,this.lastTime.setSeconds(this.lastTime.getSeconds()-1e5),this.time=new Date}}var a,l;!function(t){t[t.None=0]="None",t[t.C=1]="C",t[t.Cs=2]="Cs",t[t.D=3]="D",t[t.Eb=4]="Eb",t[t.E=5]="E",t[t.F=6]="F",t[t.Fs=7]="Fs",t[t.G=8]="G",t[t.Ab=9]="Ab",t[t.A=10]="A",t[t.Bb=11]="Bb",t[t.B=12]="B"}(a||(a={})),function(t){t[t.None=0]="None",t[t.Maj=1]="Maj",t[t.Min=2]="Min",t[t.Aug=3]="Aug",t[t.Dim=4]="Dim",t[t.Seven=5]="Seven",t[t.Maj7=6]="Maj7",t[t.Min7=7]="Min7",t[t.Min7b5=8]="Min7b5"}(l||(l={}));class c extends o{getRnnInputFeats(){return i.tidy(()=>{const t=[super.getRnnInputFeats()],e=i.scalar(this.chordRoot,"int32"),s=i.subStrict(e,i.scalar(1,"int32")),n=i.cast(i.oneHot(s,12),"float32");t.push(n);const r=i.scalar(this.chordFamily,"int32"),o=i.subStrict(r,i.scalar(1,"int32")),a=i.cast(i.oneHot(o,8),"float32");return t.push(a),i.concat1d(t)})}setChordRoot(t){this.chordRoot=t}setChordFamily(t){this.chordFamily=t}resetState(){super.resetState(),this.chordRoot=a.None,this.chordFamily=l.None}}class d extends o{getRnnInputFeats(){return i.tidy(()=>{const t=[super.getRnnInputFeats()],e=i.scalar(this.keySignature,"int32"),s=i.subStrict(e,i.scalar(1,"int32")),n=i.cast(i.oneHot(s,12),"float32");return t.push(n),i.concat1d(t)})}setKeySignature(t){this.keySignature=t}resetState(){super.resetState(),this.keySignature=a.None}}class u extends d{getRnnInputFeats(){return i.tidy(()=>{const t=[super.getRnnInputFeats()],e=i.scalar(this.chordRoot,"int32"),s=i.subStrict(e,i.scalar(1,"int32")),n=i.cast(i.oneHot(s,12),"float32");t.push(n);const r=i.scalar(this.chordFamily,"int32"),o=i.subStrict(r,i.scalar(1,"int32")),a=i.cast(i.oneHot(o,8),"float32");return t.push(a),i.concat1d(t)})}setChordRoot(t){this.chordRoot=t}setChordFamily(t){this.chordFamily=t}resetState(){super.resetState(),this.chordRoot=a.None,this.chordFamily=l.None}}class h extends d{getRnnInputFeats(){return i.tidy(()=>{const t=[super.getRnnInputFeats()],e=i.scalar(this.chordFamily,"int32"),s=i.subStrict(e,i.scalar(1,"int32")),n=i.cast(i.oneHot(s,8),"float32");return t.push(n),i.concat1d(t)})}setChordFamily(t){this.chordFamily=t}resetState(){super.resetState(),this.chordFamily=l.None}}class p extends o{}class m extends c{}class f extends d{}class S extends u{}class y extends h{}}})}));
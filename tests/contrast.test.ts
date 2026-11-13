import test from 'node:test';
import assert from 'node:assert/strict';
function luminance(hex:string){const channels=hex.match(/[a-f\d]{2}/gi)!.map(c=>parseInt(c,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return channels[0]*.2126+channels[1]*.7152+channels[2]*.0722;}
function contrast(a:string,b:string){const values=[luminance(a),luminance(b)].sort((x,y)=>y-x);return (values[0]+.05)/(values[1]+.05)}
test('primary text, muted text, links and CTA meet 4.5:1 token contrast',()=>{
 const pairs=[['202124','ffffff'],['656b74','ffffff'],['656b74','fafafa'],['1967d2','ffffff'],['edf1f7','0b0f17'],['a8b2c1','121824'],['8ab4f8','0b0f17'],['ffffff','1a73e8']];
 for(const [fg,bg] of pairs)assert.ok(contrast(fg,bg)>=4.5,`${fg} on ${bg}: ${contrast(fg,bg).toFixed(2)}`);
});

import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
const manifest={};
for(const name of await fs.readdir('public/images')){
 if(!/\.(png|webp|jpe?g)$/i.test(name))continue;
 const file=path.join('public/images',name);
 const input=await fs.readFile(file);
 const output=await sharp(input).rotate().resize({width:1600,height:1600,fit:'inside',withoutEnlargement:true}).webp({quality:82}).toBuffer();
 const optimized=name.replace(/\.[^.]+$/,'.webp');
 await fs.mkdir('public/optimized',{recursive:true});
 await fs.writeFile(`public/optimized/${optimized}`,output);
 const {width,height}=await sharp(output).metadata();
 const blur=(await sharp(output).resize(12,12,{fit:'inside'}).webp({quality:35}).toBuffer()).toString('base64');
 manifest[`/images/${name}`]={src:`/optimized/${optimized}`,width,height,blur:`data:image/webp;base64,${blur}`};
}
await fs.writeFile('src/content/assets.json',JSON.stringify(manifest,null,2));
console.log(`Prepared ${Object.keys(manifest).length} local images with intrinsic dimensions and blur placeholders.`);

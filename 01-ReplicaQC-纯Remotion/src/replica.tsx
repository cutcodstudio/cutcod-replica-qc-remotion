import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame, interpolate} from 'remotion';
import logos from './logos.json';
import bg from './background.json';
import cardGeometry from './card-geometry.json';
import starKeys from './stars.json';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';

// All visible text, typography, timing, colors and geometry are editable here.
// All picture content is drawn parametrically in SVG; only the original audio is reused.
const C={ink:'#171918',lime:'#c8ff00',white:'#fff',purple:'#9684ec'};
const clamp=(x:number)=>Math.max(0,Math.min(1,x));
const mix=(a:number,b:number,t:number)=>a+(b-a)*t;
const smooth=(x:number)=>{x=clamp(x);return x*x*(3-2*x)};
const k=(f:number,frames:number[],vals:number[])=>interpolate(f,frames,vals,{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
const e=(f:number,a:number,b:number)=>smooth((f-a)/(b-a));
type TxtProps={x:number;y:number;size?:number;fill?:string;width?:number;weight?:number;anchor?:'start'|'middle'|'end';opacity?:number;children:React.ReactNode;style?:React.CSSProperties};
const Text:React.FC<TxtProps>=({x,y,size=112,fill=C.ink,width,weight=600,anchor='start',opacity=1,children,style})=><text x={x} y={y} fontFamily="Inter, Arial, sans-serif" fontSize={size} fontWeight={weight} fill={fill} textAnchor={anchor} opacity={opacity} textLength={width} lengthAdjust={width?'spacingAndGlyphs':undefined} style={style}>{children}</text>;
const Star:React.FC<{x:number;y:number;size:number;fill?:string;rotate?:number;glow?:boolean}>=({x,y,size,fill=C.lime,rotate=0,glow=false})=><g transform={`translate(${x},${y}) rotate(${rotate}) scale(${size/100})`} filter={glow?'url(#glow)':undefined}><path d="M-5 -44 Q0 -55 5 -44 C12 -16 16 -12 44 -5 Q55 0 44 5 C16 12 12 16 5 44 Q0 55 -5 44 C-12 16 -16 12 -44 5 Q-55 0 -44 -5 C-16 -12 -12 -16 -5 -44Z" fill={fill}/></g>;
function Icon({name,x,y,size=90,fill=C.ink}:{name:string;x:number;y:number;size?:number;fill?:string}){
 const a=logos[name as keyof typeof logos];
 if(a)return <svg x={x} y={y-size/2} width={size} height={size} viewBox={a.viewBox}><path d={a.path} fill={fill} fillRule="evenodd"/></svg>;
 if(name==='seed')return <g transform={`translate(${x},${y-size/2}) scale(${size/100})`} fill={fill}><path d="M4 7 L22 12 L22 85 L4 91Z M31 47 L49 52 L49 93 L31 98Z M60 43 L78 37 L78 77 L60 71Z M87 2 L105 8 L105 90 L87 96Z"/></g>;
 if(name==='gemini')return <Star x={x+size/2} y={y} size={size} fill={fill}/>;
 if(name==='google')return <Text x={x+size/2} y={y+size*.36} size={size} width={size*.83} anchor="middle" fill={fill} weight={700}>G</Text>;
 if(name==='eleven')return <g fill={fill}><rect x={x} y={y-size*.48} width={size*.2} height={size*.95}/><rect x={x+size*.31} y={y-size*.48} width={size*.2} height={size*.95}/></g>;
 return <g transform={`translate(${x},${y})`} fill="none" stroke={fill} strokeWidth={5}><path d={`M0 0 L${size/3} ${size/3} L${size/2} ${-size/3} L${size*.7} ${size/3} L${size} 0`}/></g>;
}
const models=[
 ['Higgsfield','higgs',489],['Seedance 2.0 Fast','seed',846],['Seedance 2.0 Mini','seed',830],['Kling Motion Control','kling',885],['Kling 01 Image','kling',738],['Kling 3.0','kling',406],['Seedance 2.0','seed',670],['Seedream 5.0 Pro','seed',854],['Seedream 5.0 Lite','seed',850],['Seedream 4.5','seed',695],['Gemini Omni Flash','gemini',826],['Nano Banana Pro','google',814],['Nano Banana 2','google',721],['GPT Image','gpt',576],['Wan 2.7','wan',455],['Seed 2.0','seed',453],['Minimax Audio','wan',754],['ElevenLabs Audio','eleven',828],['Seed Audio','seed',580],['GPT Image 2','gpt',646],['All top models','',691]
] as const;
const listIndex=(f:number)=>k(f,[42,46,47,48,49,50,51,52,53,54,55,57,70,73,74,75,76,77,78,79,80,81,82,83,85,88,103,107,110,111,112,113,114,115,116,117,118,119,120,122,124],[0,.4,.7,1,1.72,3.0,4.27,5.0,5.3,5.63,5.9,6,6,6.16,6.25,6.48,6.72,7,7.4,7.9,8.55,9.4,9.93,10.08,10.6,10.95,11,11.3,12.0,12.55,13,14,15,16,17,17.5,18,18.75,19,19.5,20]);
function ModelRow({i,index,f}:{i:number;index:number;f:number}){
 const [label,icon,baseWidth]=models[i];const d=i-index;const ad=Math.abs(d);if(ad>2.7)return null;
 const spacing=k(f,[40,55,60,70,78,90],[132,147,166,144,133,142]);
 const active=Math.max(0,1-ad);const accent=(i===6||i===11);
 const swell=accent&&ad<.6?k(f,[53,59,63,73,86,91,100,104],[0,.22,.12,0,.10,.10,.10,0]):0;
 const scale=mix(.64,1,Math.max(0,1-Math.max(0,ad-1)))+swell;
 const width=baseWidth*scale;const size=112*scale;
 const opacity=(ad<1?mix(1,.60,ad):k(ad,[1,2,2.7],[.6,index<7?.10:.20,0]))*(i>0?e(f,38,47):1);
 const fill=accent?(i===6?'url(#seedGradient)':'url(#googleGradient)'):C.ink;
 const y=541+d*spacing;
 const iconSize=size*(icon==='higgs'?1.2:icon==='seed'?.78:.625);
 const motion=Math.max(k(f,[76,78,80,82,84,110,112,114,116,118],[0,1,1,.7,0,0,1,1,1,0]),0);
 const shine=i===6?k(f,[56,64],[0,1700]):k(f,[89,100],[-100,1500]);
 return <g opacity={opacity} transform={`translate(1108 ${y}) skewX(${d*motion*14}) translate(-1108 ${-y})`} filter={motion>.2?'url(#rollBlur)':ad>1.5?'url(#softBlur)':undefined}>
  {icon&&<Icon name={icon} x={1108-width-iconSize-size*.25} y={y} size={iconSize} fill={fill}/>}
  <Text x={1108} y={y+size*.34} anchor="end" size={size} width={width} fill={fill}>{label}</Text>
  {accent&&ad<.6&&<><defs><linearGradient id={`shine-${i}`} gradientUnits="userSpaceOnUse" x1={shine-150} x2={shine+150}><stop stopColor="#e1ffff" stopOpacity="0"/><stop offset=".5" stopColor="#e1ffff" stopOpacity=".95"/><stop offset="1" stopColor="#e1ffff" stopOpacity="0"/></linearGradient></defs><Text x={1108} y={y+size*.34} anchor="end" size={size} width={width} fill={`url(#shine-${i})`}>{label}</Text><Icon name={icon} x={1108-width-iconSize-size*.25} y={y} size={iconSize} fill={`url(#shine-${i})`}/></>}
 </g>
}
function Opening({f}:{f:number}){
 const index=listIndex(f);
 const intro=e(f,4,20);const spread=k(f,[14,15,16,17,18,19,20,21,22],[0,.05,.17,.36,.55,.76,.92,1,1]);const logoSize=k(f,[0,2,14,22],[120,120,120,134]);
 const color=f<32?'url(#introLime)':C.ink;
 const logoX=mix(870,455,spread),titleX=mix(1025,623,spread);
 const chars='Higgsfield'.split(''),adv=[0,77,106,172,238,297,334,362,422,450];
 return <>
  {f<40?<g>
    {f<17?<svg x={logoX} y={477} width={logoSize} height={logoSize} viewBox="0 0 134 124"><path d="M4 23 C24 27 34 3 47 8 C68 17 35 35 23 48 C-2 73 16 97 35 90 C54 82 70 45 91 44 C115 38 130 62 117 91 C110 112 95 124 84 113 C66 100 92 72 108 68 L130 67" fill="none" stroke={C.ink} strokeWidth={k(f,[1,12,16],[5,7,11])} strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1-e(f,1,12)}/></svg>:<g filter={f<20?'url(#openingBlur)':undefined}><Icon name="higgs" x={logoX} y={537} size={logoSize}/></g>}
    {f>=7&&(f<24?<g filter={f>=15&&f<20?'url(#openingBlur)':undefined}>{chars.map((ch,i)=>{const a=e(f,7+i*1.25,12.5+i*1.25);const x=titleX+adv[i]+(1-a)*16;return <g key={i} transform={`translate(${x} 575) scale(1 ${a}) translate(${-x} -575)`} opacity={Math.min(1,a*3)}><Text x={x} y={575} size={112}>{ch}</Text></g>})}</g>:<Text x={titleX} y={575} size={112} width={489}>Higgsfield</Text>)}
    {f>=17&&<g filter={f<22?'url(#freeSmear)':undefined}><Text x={k(f,[17,18,19,20,22],[1920,1500,1250,1153,1153])} y={575} width={299} fill={color}>is free</Text></g>}
    {f>=17&&f<21&&<rect x={k(f,[17,18,19,20],[1800,1310,1153,1130])} y={494} width={k(f,[17,18,19,20],[200,720,420,205])} height={81} fill={f<20?'#ccf300':'#839e15'} filter="url(#smearEdge)"/>}
  </g>:<>
   {k(f,[75,77,80,82,84,109,111,113,114,115,117,119,120],[0,.25,.3,.2,0,0,.1,.45,.45,.45,.35,.15,0])>.01?
    Array.from({length:21},(_,s)=>{const amount=k(f,[75,77,80,82,84,109,111,113,114,115,117,119,120],[0,.25,.3,.2,0,0,.1,.45,.45,.45,.35,.15,0]);const ff=f+(s-10)*amount/10;return <g key={s} opacity={.085}>{models.map((_,i)=><ModelRow key={i} i={i} index={listIndex(ff)} f={ff}/>)}</g>}):models.map((_,i)=><ModelRow key={i} i={i} index={index} f={f}/>)}
   <Text x={1153} y={575} width={299}>is free</Text>
  </>}
  {f>=114&&<g transform={`translate(${k(f,[114,117,119,121,123,127,130],[1950,1825,1730,1520,1470,1260,1230])},${k(f,[114,119,123,127,130],[714,442,380,450,494])})`} opacity={1-e(f,129,132)} stroke={C.ink} strokeWidth={7} fill="none"><path d="M-27 -61 Q0 -61 0 -41 L0 40 Q0 58 -27 59 M27 -61 Q0 -61 0 -41 M27 59 Q0 59 0 40 M-10 -4 L10 -4"/></g>}
 </>
}
function AllModels({f}:{f:number}){
 const zoom=k(f,[125,126,128,132,138,145,146,147,148,149],[1,1.03,1.24,1.47,1.47,1.30,1.12,1.037,1.015,1]);
 const textY=541;const dark=f>=149;
 const starOut=1-e(f,142,148);const starIn=e(f,125,132);
 const starFrames=Object.keys(starKeys).map(Number);
 const a=starFrames.filter(n=>n<=f).at(-1)||128;const b=starFrames.find(n=>n>=f)||146;
 const prev=starKeys[String(a) as keyof typeof starKeys];const next=starKeys[String(b) as keyof typeof starKeys];
 const starDefs=prev.map((v,i)=>v.map((q,j)=>mix(q,next[i]?.[j]??q,a===b?0:(f-a)/(b-a))));
 let middle=f<132?'is':f<134?'a':f<136?'ar':'are';
 const totalW=1088;
 const freeEnd=k(f,[125,128,130,131,132,133,134,135,136,144,145,146,147,149],[1467,1452,1445,1428,1402,1404,1440,1448,1500,1500,1500,1490,1486,1486]);
 const cursorX=freeEnd-210;
 return <>
  {f>=125&&f<128&&<Star x={1006} y={519} size={k(f,[125,127],[100,124])} glow/>}
  {f>=128&&f<147&&starDefs.map(([x,y,w,h],i)=><Star key={i} x={x} y={y} size={(w+h)/2} rotate={0} glow/>)}
  <g transform={`translate(${dark?940:960} ${textY}) scale(${zoom}) translate(-960 ${-textY})`}>
   <Text x={k(f,[125,128,144,147,149],[393,416,416,399,416])} y={k(f,[125,127],[601,575])} size={112} width={k(f,[125,128],[714,689])} fill={dark?'#fff':f>=145?'#8977e5':'url(#purpleText)'} style={{filter:f>=128&&f<145?'drop-shadow(0 0 28px #9c8ed0bb)':undefined}}>All top models</Text>
   <Text x={k(f,[125,131,132,144,147],[1157,1153,1127,1127,1110])} y={575} size={112} width={middle==='are'?151:middle==='ar'?108:middle==='is'?80:70} fill={dark?'#fff':f>=147?'#b4b4b4':f>=130&&f<139?'#777':C.ink}>{middle}</Text>
   <Text x={freeEnd} y={575} size={112} anchor="end" width={188} fill={dark?'#fff':f>=147?'#b4b4b4':C.ink}>free</Text>
   {f>=129&&f<=140&&<path d={`M${cursorX} 488V602`} stroke="#343434" strokeWidth={3}/>}
  </g>
  {f===147&&<g fill={C.lime} opacity={.65} filter="url(#softBlur)"><ellipse cx={864} cy={552} rx={32} ry={2}/><ellipse cx={958} cy={528} rx={5} ry={10} transform="rotate(35 958 528)"/><ellipse cx={994} cy={572} rx={13} ry={3} transform="rotate(-20 994 572)"/><ellipse cx={960} cy={613} rx={4} ry={14} transform="rotate(-20 960 613)"/></g>}
  {f>=125&&f<131&&<g transform={`translate(${k(f,[125,128,130],[1380,1260,1230])},${k(f,[125,128,130],[444,450,494])})`} opacity={1-e(f,129,131)} stroke={C.ink} strokeWidth={7} fill="none"><path d="M-27 -61 Q0 -61 0 -41 L0 40 Q0 58 -27 59 M27 -61 Q0 -61 0 -41 M27 59 Q0 59 0 40 M-10 -4 L10 -4"/></g>}
 </>
}
function Clock({f}:{f:number}){
 const zoom=k(f,[164,165,166,167,168,169,170,171,172],[6.34,4.47,3.32,2.52,1.96,1.55,1.277,1.096,1]);
 const opacity=k(f,[163,164,165,166,167,168,169,170,171,172],[0,.21,.42,.60,.74,.83,.90,.94,.98,1]);
 const cx=709,cy=540;
 const angle=k(f,[171,174,177,179,180,184,186,187],[0,30,30,60,60,60,90,90]);
 const rad=236;const theta=angle*Math.PI/180;const ex=cx+rad*Math.sin(theta),ey=cy-rad*Math.cos(theta);
 const clockShift=e(f,187,192);
 return <g opacity={opacity} transform={`translate(684 528) scale(${zoom}) translate(-684 -528)`}>
  <g opacity={1-clockShift}>
   <path d={`M${cx} ${cy} L${cx} ${cy-rad} A${rad} ${rad} 0 0 1 ${ex} ${ey}Z`} fill="url(#clockGreen)" opacity={e(f,171,174)}/>
   {Array.from({length:12},(_,i)=>{const r=i%3===0?201:219;const a=i*Math.PI/6;return <line key={i} x1={cx+Math.sin(a)*r} y1={cy-Math.cos(a)*r} x2={cx+Math.sin(a)*239} y2={cy-Math.cos(a)*239} stroke="#6c6c6c" strokeWidth={i%3===0?6:5}/>})}
  </g>
  <Text x={k(f,[188,190,191,192,193,194,195,196,198],[709,710,711,717,735,739,742,744,744])} y={k(f,[188,190,191,192,193,194,195,196,198],[627,617,611,594,535,519,512,509,506])} size={k(f,[188,190,191,192,193,194,195,196,198],[250,230,224,207,145,128,120,117,116])} width={k(f,[188,190,191,192,193,194,195,196,198],[294,264,256,235,166,147,140,135,132])} anchor="middle" fill="#fff" style={{letterSpacing:-15}}>24</Text>
  {f<188?<g transform={`translate(${cx} ${cy}) rotate(${angle-90})`} opacity={e(f,166,170)}><Text x={282} y={42} size={154} fill="#fff" width={370}>hours</Text></g>:<Text x={k(f,[188,190,191,192,193,194,195,196,198],[991,985,975,953,873,851,842,838,836])} y={k(f,[188,190,191,192,193,194,195,196,198],[591,589,583,571,527,515,510,507,506])} size={k(f,[188,190,191,192,193,194,195,196,198],[144,142,140,137,124,119,117,116,116])} width={k(f,[188,190,191,192,193,194,195,196,198],[360,357,350,340,300,291,284,281,280])} fill="#fff">hours</Text>}
  {f>=184&&f<193&&<Sparkles x={k(f,[184,188,190,191,192],[855,965,1350,1430,1460])} y={k(f,[188,190,191,192],[595,595,612,627])} f={f}/>}
 </g>
}
function Sparkles({x,y,f,small=false}:{x:number;y:number;f:number;small?:boolean}){return <g transform={`rotate(${k(f,[184,200,218,225,240,242],[0,0,25,-10,60,90])} ${x+20} ${y+5})`}><Star x={x+32} y={y-10} size={small?31:53} glow={f<198||f>=232}/><Star x={x} y={y+20} size={small?20:32} glow={f<198||f>=232}/></g>}
function Offer({f}:{f:number}){
 const p=e(f,191,196);const exit=k(f,[220,222,223,224,225,226,229],[0,.03,.11,.4,.7,.87,1]);const headerExit=e(f,237,241);
 const bottomY=mix(640,568,exit);
 return <g>
  <Text x={960} y={mix(k(f,[194,200],[384,372]),434,exit)} size={74} width={f<195?285:456} weight={400} anchor="middle" fill="#dedede" opacity={(1-headerExit)*k(f,[193,194,195,196,198,200],[0,.3,.5,.65,.9,1])}>{f<195?'Don’t miss':'Don’t miss your'}</Text>
  {f>=200&&<Text x={678} y={506} size={116} width={440} fill="#fff" opacity={1-e(f,220,223)}>24 hours</Text>}
  <Text x={1141} y={k(f,[194,195,196,198,200],[536,529,522,514,510])} size={116} width={92} weight={400} fill="#ddd" opacity={(1-e(f,220,223))*k(f,[193,194,195,196,198],[0,.45,.65,.8,1])}>of</Text>
  <Text x={mix(398,444,exit)} y={mix(k(f,[193,198],[670,640]),568,exit)} size={mix(112,108,exit)} width={mix(1040,993,exit)} weight={400} fill={f<221?'url(#offerLime)':'#fff'} opacity={k(f,[192,193,194,196],[0,.5,.7,1])}>Unlimited Generations</Text>
  {f>=193&&<Sparkles x={1480} y={mix(k(f,[193,198],[670,640]),568,exit)-42} f={f}/>}
 </g>
}
function Cinema({f}:{f:number}){
 const card=e(f,281,286);const normal=1-card;
 const q=f>=282?cardGeometry[String(Math.min(f,304)) as keyof typeof cardGeometry].quad:null;
 const x=f>=285&&q?q[0][0]-448+k(f,[296,298,299,300,301],[0,62,125,0,0]):k(f,[242,249,256,280,285],[768,768,464,464,170]);
 return <>
  <Text x={x} y={k(f,[281,286],[574,558])} size={k(f,[281,286],[104,68])} width={k(f,[281,286],[674,424])} weight={400} fill="#fff">Cinematic video</Text>
  {f>=251&&<Text x={k(f,[251,258],[1401,1160])} y={574} size={104} width={100} fill="#fff" weight={400} opacity={e(f,251,255)*normal}>—</Text>}
  {f>=253&&<Text x={f>=285&&q?q[1][0]+k(f,[296,298,299,300,301],[28,-16,175,-12,0]):k(f,[253,258,281,286],[1480,1310,1310,1330])} y={k(f,[253,259,281,286],[628,574,574,558])} size={k(f,[281,286],[104,68])} width={k(f,[281,286],[164,110])} fill="#bcf52e" opacity={e(f,253,258)}>free</Text>}
  {f<258&&<g opacity={1-e(f,254,258)}><Sparkles x={k(f,[242,250,255],[1620,1650,1430])} y={536} f={f} small/></g>}
 </>
}
function PhotoCard({f}:{f:number}){
 const appear=e(f,281,286);const full=e(f,296,304);
 const w=k(f,[281,282,283,285,288,296,297,298,299,300,302,304],[170,230,530,640,720,720,825,1130,1570,1830,1950,1970]);
 const h=w*9/16;const scaleY=k(f,[281,282,283,285],[0,0.09,.92,1]);
 const ry=k(f,[281,288,296,300,304],[0,26,26,5,0]);
 const mat=cardGeometry[String(Math.min(f,304)) as keyof typeof cardGeometry].matrix;
 const transform=`matrix3d(${mat[0][0]},${mat[1][0]},0,${mat[2][0]},${mat[0][1]},${mat[1][1]},0,${mat[2][1]},0,0,1,0,${mat[0][2]},${mat[1][2]},0,1)`;
 const photoTransform=transform;
 const padX=k(f,[282,296,298,299,300,301,302,303,304],[12,12,12,78,26,19,13,6,0]);
 const padY=k(f,[282,296,298,299,300,301,302,303,304],[12,12,12,40,14,10,7,3,0]);
 return <><div style={{position:'absolute',left:0,top:0,width:720,height:405,transformOrigin:'0 0',transform,borderRadius:k(f,[296,298,299,302],[26,6,2,0]),background:f<297?'linear-gradient(135deg,#e8ffb3,#c8ff00 55%,#a5ff3b)':'radial-gradient(ellipse at 100% 80%,#71ffba 0%,transparent 42%),radial-gradient(ellipse at 48% 0%,#f8ffec 0%,transparent 43%),#d1ff03',overflow:'hidden'}}>
  </div>
  <div style={{position:'absolute',left:0,top:0,width:720,height:405,transformOrigin:'0 0',transform:photoTransform,overflow:'hidden',borderRadius:k(f,[298,299,300,303],[18,4,1,0])}}>
   <svg width="720" height="405" viewBox="0 0 720 405" preserveAspectRatio="none">
    <defs>
     <linearGradient id="sceneSky" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#a9bbc0"/><stop offset=".58" stopColor="#d9d9d0"/><stop offset="1" stopColor="#657278"/></linearGradient>
     <linearGradient id="sceneRoad" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#4c5960"/><stop offset="1" stopColor="#111b20"/></linearGradient>
     <linearGradient id="sceneGlassL"><stop stopColor="#102936"/><stop offset=".5" stopColor="#3e5960"/><stop offset="1" stopColor="#13232d"/></linearGradient>
     <linearGradient id="sceneGlassR"><stop stopColor="#566b73"/><stop offset=".5" stopColor="#ccd1cb"/><stop offset="1" stopColor="#273941"/></linearGradient>
     <linearGradient id="sceneShirt"><stop stopColor="#0a382b"/><stop offset=".5" stopColor="#255540"/><stop offset="1" stopColor="#09261f"/></linearGradient>
     <linearGradient id="sceneSkirt" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#fbf8eb"/><stop offset="1" stopColor="#c3c6bd"/></linearGradient>
     <filter id="sceneBlur"><feGaussianBlur stdDeviation="1.4"/></filter>
    </defs>
    <rect width="720" height="405" fill="url(#sceneSky)"/>
    <path d="M0 0H188L270 220H0Z" fill="url(#sceneGlassL)"/><path d="M25 0H43L110 220H90Z" fill="#c4d0cb" opacity=".7"/><path d="M61 0H72L137 220H124Z" fill="#162a34" opacity=".7"/>
    <path d="M720 0H548L500 220H720Z" fill="url(#sceneGlassR)"/><path d="M570 0H584L551 220H536Z" fill="#ecebe1" opacity=".7"/><path d="M616 0H628L590 220H578Z" fill="#263b43" opacity=".6"/>
    <path d="M0 246L720 214V405H0Z" fill="url(#sceneRoad)"/><path d="M0 344L720 291M0 376L720 326" stroke="#bdc6c8" strokeWidth="3" opacity=".5"/><path d="M0 350L270 326M468 314L720 297" stroke="#de6c52" strokeWidth="4" opacity=".65"/>
    <g opacity=".68" filter="url(#sceneBlur)"><ellipse cx="90" cy="327" rx="73" ry="7" fill="#ecffff"/><ellipse cx="620" cy="305" rx="90" ry="8" fill="#f6ffff"/></g>
    <g transform="translate(83 187)"><rect width="5" height="168" fill="#101a20"/><rect x="-10" y="31" width="25" height="23" rx="3" fill="#edf1e8"/><circle cx="2" cy="42" r="6" fill="#263d47"/><rect x="-8" y="59" width="21" height="20" fill="#d6c55c"/></g>
    <g transform="translate(338 72)"><ellipse cx="42" cy="50" rx="39" ry="44" fill="#c38f78"/><path d="M5 42Q10 -9 52 2Q83 12 78 58L63 44L48 27L31 48Z" fill="#302d31"/><path d="M20 94L11 205L74 205L64 94Z" fill="url(#sceneShirt)"/><path d="M13 109L-4 183L13 204L30 137ZM66 105L92 179L73 197L52 137Z" fill="#123e30"/><path d="M23 196L75 196L99 311L-4 311Z" fill="url(#sceneSkirt)"/><path d="M24 214L53 224L44 311L11 311Z" fill="#e8e8d9"/><path d="M75 213L95 311L70 311L58 225Z" fill="#bfc2ba"/><path d="M7 202L89 202" stroke="#272e2c" strokeWidth="5"/><path d="M42 102V199" stroke="#071d19" strokeWidth="2" opacity=".8"/></g>
    <g opacity=".55"><circle cx="270" cy="312" r="13" fill="#394650"/><circle cx="298" cy="301" r="10" fill="#a2aaab"/><circle cx="625" cy="276" r="10" fill="#1c2930"/></g>
   </svg>
  </div>
  {f>=298&&<div style={{position:'absolute',left:394,top:k(f,[298,299,300,301,302,304],[994,908,872,856,846,841]),width:1132,height:174,borderRadius:62,display:'flex',justifyContent:'center',alignItems:'center',background:'radial-gradient(ellipse at 60% 72%,#afb0e8,transparent 75%),radial-gradient(ellipse at 20% 72%,#b5b2f1,transparent 50%),linear-gradient(135deg,#44444f,#6f6eaa 64%,#868792)',boxShadow:'inset 0 0 3px 2px #aaa6c4',filter:`blur(${k(f,[298,299,300,302],[2,1.5,1,.6])}px)`,color:'#d9d8f3',fontFamily:'Inter',fontWeight:500,fontSize:110,letterSpacing:-4,overflow:'hidden'}}><span style={{transform:`translateY(${k(f,[298,299,300],[-85,-9,5])}px) rotate(${k(f,[298,299,301],[14,1,0])}deg)`,textShadow:'0 0 8px #c4c2ee88'}}>Ads &amp; Commercials</span></div>}
 </>
}
function CityVector({x=0,y=0,w=720,h=405}:{x?:number;y?:number;w?:number;h?:number}){
 return <g transform={`translate(${x} ${y}) scale(${w/720} ${h/405})`}>
  <defs><linearGradient id="contSky" x2="0" y2="1"><stop stopColor="#9fb4bc"/><stop offset=".55" stopColor="#d6d9d1"/><stop offset="1" stopColor="#607078"/></linearGradient><linearGradient id="contRoad" x2="0" y2="1"><stop stopColor="#55636a"/><stop offset="1" stopColor="#121a20"/></linearGradient></defs>
  <rect width="720" height="405" fill="url(#contSky)"/><path d="M0 0H188L270 220H0Z" fill="#17303d"/><path d="M720 0H548L500 220H720Z" fill="#65777d"/><path d="M0 246L720 214V405H0Z" fill="url(#contRoad)"/><path d="M0 350L270 326M468 314L720 297" stroke="#df6d50" strokeWidth="4" opacity=".7"/>
  <g transform="translate(338 72)"><ellipse cx="42" cy="50" rx="39" ry="44" fill="#c38f78"/><path d="M5 42Q10-9 52 2Q83 12 78 58L63 44L48 27L31 48Z" fill="#302d31"/><path d="M20 94L11 205L74 205L64 94Z" fill="#194c39"/><path d="M13 109L-4 183L13 204L30 137M66 105L92 179L73 197L52 137Z" fill="#123e30"/><path d="M23 196L75 196L99 311L-4 311Z" fill="#eeeede"/><path d="M7 202L89 202" stroke="#272e2c" strokeWidth="5"/></g>
 </g>
}
function CardLabel({children}:{children:React.ReactNode}){return <div style={{position:'absolute',left:80,top:300,width:560,height:76,borderRadius:28,background:'linear-gradient(120deg,#74718d,#aaa8d2)',color:'#f6f5ff',fontFamily:'Inter',fontSize:38,fontWeight:500,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 0 10px #b8b6e699'}}>{children}</div>}
function Continuation({lf}:{lf:number}){
 const fade=(a:number,b:number)=>clamp((lf-a)/(b-a));
 const scene=lf<150?0:lf<210?1:lf<270?3:lf<450?5:lf<480?4:lf<510?6:lf<630?7:lf<690?8:lf<810?9:10;
 return <AbsoluteFill style={{background:scene===7||scene===8?'#f7f7f3':'#000',overflow:'hidden'}}>
  {scene===0&&<g><svg width="1920" height="1080" viewBox="0 0 1920 1080"><CityVector x={170} y={115} w={1580} h={890}/><rect x="160" y="105" width="1600" height="910" rx="34" fill="none" stroke="#c8ff00" strokeWidth="22"/><text x="960" y="970" textAnchor="middle" fontFamily="Inter" fontSize="82" fill="#f4f3ff">Ads &amp; Commercials</text></svg></g>}
  {scene===1&&<svg width="1920" height="1080" viewBox="0 0 1920 1080"><rect width="1920" height="1080" fill="#271b42"/><path d="M0 950L500 370L850 660L1240 180L1920 980Z" fill="#4e2468"/><path d="M230 130L700 360L470 660L50 430ZM1260 120L1890 80L1780 500L1360 390Z" fill="#f3d63e"/><text x="960" y="330" textAnchor="middle" fontFamily="Inter" fontWeight="800" fontSize="180" fill="#fff" transform={`rotate(${Math.sin(lf*.2)*3} 960 330)`}>Animation</text><path d="M580 900Q750 500 930 720T1330 900" fill="none" stroke="#d4f629" strokeWidth="38"/><circle cx={820+Math.sin(lf*.12)*100} cy="620" r="85" fill="#ef5a37"/></svg>}
  {false&&<svg width="1920" height="1080" viewBox="0 0 1920 1080"><defs><linearGradient id="sunset" y2="1"><stop stopColor="#1b2344"/><stop offset=".55" stopColor="#d96e42"/><stop offset="1" stopColor="#f4c45e"/></linearGradient></defs><rect width="1920" height="1080" fill="url(#sunset)"/><circle cx="1510" cy="390" r="170" fill="#fff0b2" opacity=".85"/><path d="M0 840L420 670L820 780L1250 620L1920 820V1080H0Z" fill="#252033"/><path d={`M${820+Math.sin(lf*.08)*80} 450Q900 600 830 840L720 1010H1080L970 840Q900 600 1000 450Z`} fill="#111823"/><path d="M835 520L700 690M965 520L1100 690" stroke="#111823" strokeWidth="48"/><text x="960" y="980" textAnchor="middle" fontFamily="Inter" fontSize="84" fill="#fff">Music videos</text></svg>}
  {scene===3&&<svg width="1920" height="1080" viewBox="0 0 1920 1080"><rect width="1920" height="1080" fill="#000"/><text x="960" y="500" textAnchor="middle" fontFamily="Inter" fontSize="108" fill="#fff">Action scenes?</text><path d="M960 620q50-50 100 0" fill="none" stroke="#c8ff00" strokeWidth="12"/><circle cx={1060+Math.sin(lf*.2)*120} cy="620" r="10" fill="#c8ff00"/></svg>}
  {scene===4&&<svg width="1920" height="1080" viewBox="0 0 1920 1080"><rect width="1920" height="1080" fill="#000"/><rect x="700" y="300" width="520" height="270" rx="35" fill="#242424" stroke="#555"/><text x="760" y="400" fontFamily="Inter" fontSize="48" fill="#c8ff00">Action Fight scene</text><text x="765" y="475" fontFamily="Inter" fontSize="30" fill="#aaa">✦ Seedance 2.0</text><rect x="1000" y="450" width="165" height="58" rx="28" fill="#c8ff00"/><text x="1082" y="490" textAnchor="middle" fontFamily="Inter" fontSize="26" fill="#101010">Generate ✦4</text></svg>}
  {scene===5&&<svg width="1920" height="1080" viewBox="0 0 1920 1080"><defs><linearGradient id="battle" y2="1"><stop stopColor="#92a1ab"/><stop offset="1" stopColor="#1f2a32"/></linearGradient></defs><rect width="1920" height="1080" fill="url(#battle)"/><path d="M0 830L380 620L700 760L1080 610L1530 760L1920 600V1080H0Z" fill="#293740"/><g transform={`translate(${600+Math.sin(lf*.09)*55} 200)`}><circle cx="100" cy="180" r="55" fill="#523f39"/><path d="M45 245L10 680H220L165 245Z" fill="#171b22"/><path d="M70 320L-120 510M160 320L350 500" stroke="#111820" strokeWidth="44"/><path d="M-110 510L420 260" stroke="#d8dde0" strokeWidth="12"/></g><g transform="translate(1200 240)"><circle cx="100" cy="150" r="54" fill="#694c41"/><path d="M50 215L0 680H220L160 215Z" fill="#4c232b"/><path d="M85 300L-80 530M155 300L340 500" stroke="#3b1822" strokeWidth="44"/><path d="M-70 530L420 220" stroke="#d8dde0" strokeWidth="12"/></g><g transform={`translate(${980-Math.sin(lf*.1)*70} 230) scale(.9)`}><circle cx="100" cy="150" r="54" fill="#694c41"/><path d="M50 215L0 680H220L160 215Z" fill="#4c232b"/><path d="M85 300L-80 530M155 300L340 500" stroke="#3b1822" strokeWidth="44"/><path d="M-70 530L420 220" stroke="#d8dde0" strokeWidth="12"/></g><path d="M300 760Q960 420 1620 760" fill="none" stroke="#d2ff28" strokeWidth="8" opacity=".45"/><text x="960" y="940" textAnchor="middle" fontFamily="Inter" fontSize="88" fill="#fff">Action scenes</text></svg>}
  {scene===6&&<svg width="1920" height="1080" viewBox="0 0 1920 1080"><rect width="1920" height="1080" fill="#f8f8f5"/><text x="960" y="560" textAnchor="middle" fontFamily="Inter" fontSize="90" fill="#101010">But that’s just the beginning</text></svg>}
  {scene===7&&<svg width="1920" height="1080" viewBox="0 0 1920 1080"><rect width="1920" height="1080" fill="#f5f5f0"/><text x="220" y="500" fontFamily="Inter" fontSize="86" fill="#151515">But that’s just <tspan fill="#aee600">the beginning</tspan></text><rect x="1120" y="700" width="470" height="190" rx="30" fill="#dfff22"/><text x="1355" y="815" textAnchor="middle" fontFamily="Inter" fontSize="66" fill="#111">Generate ✦0</text><rect x="110" y="150" width="1700" height="18" fill="#d4d4c8"/></svg>}
  {scene===8&&<svg width="1920" height="1080" viewBox="0 0 1920 1080"><rect width="1920" height="1080" fill="#000"/><rect x="330" y="280" width="1260" height="160" rx="80" fill="none" stroke="#b9d76a" strokeWidth="3"/><text x="960" y="385" textAnchor="middle" fontFamily="Inter" fontSize="65" fill="#fff">Visual effects – <tspan fill="#c8ff00">free</tspan></text><rect x="760" y="600" width="400" height="170" rx="36" fill="#c8ff00"/><text x="960" y="705" textAnchor="middle" fontFamily="Inter" fontSize="65" fill="#101010">Generate ✦0</text></svg>}
  {scene===9&&<svg width="1920" height="1080" viewBox="0 0 1920 1080"><rect width="1920" height="1080" fill="#000"/><text x="960" y="260" textAnchor="middle" fontFamily="Inter" fontSize="84" fill="#fff">Photorealistic images</text><rect x="160" y="360" width="380" height="500" rx="28" fill="#63805a"/><circle cx="350" cy="540" r="105" fill="#e3b78d"/><path d="M220 690Q350 590 480 690L520 860H180Z" fill="#eee6dc"/><rect x="700" y="200" width="1050" height="680" fill="#1a1a1a" stroke="#777" strokeWidth="5"/><text x="1225" y="520" textAnchor="middle" fontFamily="Inter" fontSize="72" fill="#fff">Generate ✦0</text></svg>}
  {scene===9&&<svg width="1920" height="1080" viewBox="0 0 1920 1080"><rect width="1920" height="1080" fill="#ebce9d"/><rect x="100" y="90" width="1720" height="900" fill="#f6e8c6" stroke="#815932" strokeWidth="18"/><path d="M150 230Q500 120 850 250T1740 210" fill="none" stroke="#d34a38" strokeWidth="38"/><path d="M300 900Q430 560 650 640T1000 900" fill="#e7c1a8"/><circle cx="520" cy="470" r="100" fill="#b7765b"/><path d="M420 430Q520 300 630 420" fill="none" stroke="#251f23" strokeWidth="38"/><text x="960" y="840" textAnchor="middle" fontFamily="Inter" fontSize="190" fontWeight="800" fill="#c5372d">One more thing</text></svg>}
 </AbsoluteFill>
}
export const Replica:React.FC<{includeAudio?:boolean}>=({includeAudio=true})=>{
 const f=useCurrentFrame();
 return <AbsoluteFill style={{background:'#000',overflow:'hidden'}}>
  <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}}>
   <defs>
    <radialGradient id="yellow"><stop stopColor="#f7fbdc"/><stop offset="1" stopColor="#fff" stopOpacity="0"/></radialGradient>
    <radialGradient id="lavender"><stop stopColor="#e4dffe"/><stop offset="1" stopColor="#fff" stopOpacity="0"/></radialGradient>
    <linearGradient id="seedGradient"><stop stopColor="#278cc0"/><stop offset=".5" stopColor="#35b3c9"/><stop offset="1" stopColor="#73d9e1"/></linearGradient>
    <linearGradient id="googleGradient"><stop stopColor="#43c797"/><stop offset=".27" stopColor="#2baeb8"/><stop offset=".44" stopColor="#617baa"/><stop offset=".66" stopColor="#c63231"/><stop offset="1" stopColor="#e9ba1d"/></linearGradient>
    <linearGradient id="introLime"><stop stopColor={f<25?'#97be39':f<28?'#8ba237':f<31?'#5b721e':'#303b13'}/><stop offset="1" stopColor={f<25?'#c6ed69':f<28?'#93ae37':f<31?'#5b721e':'#303b13'}/></linearGradient>
    <linearGradient id="purpleText"><stop stopColor={f<128?'#80709d':'#b9b0f0'}/><stop offset=".42" stopColor={f<128?'#262329':'#9384d9'}/><stop offset="1" stopColor={f<128?'#171918':'#45389f'}/></linearGradient>
    <linearGradient id="offerLime"><stop stopColor="#d1f234"/><stop offset=".5" stopColor="#a3f03b"/><stop offset="1" stopColor="#d4ee31"/></linearGradient>
    <radialGradient id="clockGreen" cx="10%" cy="98%" r="110%"><stop stopColor="#172000" stopOpacity="0"/><stop offset=".8" stopColor="#8cac00" stopOpacity=".5"/><stop offset="1" stopColor="#b0cc00" stopOpacity=".8"/></radialGradient>
    <filter id="glow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="14"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <filter id="softBlur"><feGaussianBlur stdDeviation="1.8"/></filter>
    <filter id="openingBlur" x="-30%" width="160%"><feGaussianBlur stdDeviation={`${k(f,[15,17,19,20],[1,10,4,0])} 0`}/></filter>
    <filter id="freeSmear" x="-150%" width="400%"><feGaussianBlur stdDeviation={`${k(f,[17,18,19,20,21,22],[150,140,90,40,10,0])} 0`}/></filter>
    <filter id="smearEdge" x="-50%" width="200%"><feGaussianBlur stdDeviation="12 0"/></filter>
    <filter id="rollBlur" x="-20%" width="140%" y="-100%" height="300%"><feGaussianBlur stdDeviation={`3 ${k(f,[111,113,114,115,117,119],[4,7,10,10,5,3])}`}/></filter>
   </defs>
   {f<147&&<g><rect width="1920" height="1080" fill="#fff"/>{[0,1].map(i=>{const [x,y,sx,sy,r,g,b]=bg.slice(i*7,i*7+7);return <g key={i}><defs><radialGradient id={`bg-${i}`}>{Array.from({length:21},(_,s)=><stop key={s} offset={s/20} stopColor={`rgb(${255-r},${255-g},${255-b})`} stopOpacity={Math.exp(-.5*(s*3.5/20)**2)}/>)}</radialGradient></defs><ellipse cx={x} cy={y} rx={sx*3.5} ry={sy*3.5} fill={`url(#bg-${i})`}/></g>})}</g>}
   {f>=147&&f<149&&<g opacity={f===147?1:.5}><defs><radialGradient id="darkyellow"><stop stopColor="#172000"/><stop offset="1" stopColor="#000" stopOpacity="0"/></radialGradient><radialGradient id="darkpurple"><stop stopColor="#090319"/><stop offset="1" stopColor="#000" stopOpacity="0"/></radialGradient></defs><ellipse cx="200" cy="180" rx="750" ry="830" fill="url(#darkyellow)"/><ellipse cx="1640" cy="880" rx="840" ry="930" fill="url(#darkpurple)"/></g>}
   {f===146&&<circle cx="960" cy="540" r="194" fill="#000"/>}
   {f<=124&&<Opening f={f}/>}
   {f>=125&&f<165&&<g opacity={1-e(f,163,165)}><AllModels f={f}/></g>}
   {f>=164&&f<200&&<Clock f={f}/>}
   {f>=191&&f<242&&<Offer f={f}/>}
   {f>=242&&<Cinema f={f}/>}
  </svg>
  {f>=282&&<PhotoCard f={f}/>}
  {includeAudio&&<Audio src={staticFile('reference-audio.m4a')}/>}
 </AbsoluteFill>
}

export const ContinuedReplica:React.FC=()=>{
 const f=useCurrentFrame();
 return <AbsoluteFill style={{background:'#000'}}>{f<310?<Replica includeAudio={false}/>:<Continuation lf={f-310}/>}</AbsoluteFill>;
};

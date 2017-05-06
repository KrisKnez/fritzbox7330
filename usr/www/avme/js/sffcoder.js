function SFF(){SFFheader=[0x53,0x66,0x66,0x66,0x01,0x00,0x61,0x6b,0x00,0x00,28,0,0,0,0,0,0,0,0,0,0x28,0x63,0x29,0x20,0x41,0x56,0x4d,0x20];SFFpage=[254,0x10,1,0,0,0,0xc0,0x06,0,0,1,0,0,0,0,0,0,0,];var actByte=0;var BitPos=0;var huffCode;var SFFfile;this.Canvas2SFF=function(canvasIDs){SFFfile=Array();SFFfile=SFFfile.concat(SFFheader);for(var n=0;n<canvasIDs.length;n++){var canvas=document.getElementById(canvasIDs[n]);if(canvas.width!=1728){alert((n+1)+".Canvas("+canvasIDs[n]+")muss1728Pixelbreitsein,ist"+canvas.width);continue;}var ctx=canvas.getContext("2d");var imgd=ctx.getImageData(0,0,canvas.width,canvas.height);var pix=imgd.data;for(var pp=0;pp<SFFpage.length;pp++)SFFfile.push(SFFpage[pp]);var lOff=0;for(var y=0;y<canvas.height;y++){lOff+=4*canvas.width;SFFLineInit();SFFencodeLine(pix,lOff);SFFEndOfLine(0,1);}}SFFfile.push(0xfe);SFFfile.push(0x00);return SFFfile;}
function SFFLineInit(){actByte=0;BitPos=0;huffCode=Array();}
function SFFEndOfLine(fill,nLines){var nbuff=[];var rest;while(fill>=16){SFFhuffCode(16,0);fill-=16;}if(fill)SFFhuffCode(fill,0);rest=8-(BitPos&0x07);if(rest!=8)SFFhuffCode(rest,0);var numBytes=huffCode.length;while(nLines--){if(numBytes>216){SFFfile.push(0x00);SFFfile.push((numBytes)&0x0ff);SFFfile.push((numBytes>>8)&0x0ff);}else SFFfile.push(numBytes&0x0ff);SFFfile.push.apply(SFFfile,huffCode);}}
function SFFhuffCode(nBits,code){lCode=(actByte<<nBits)|(code>>(16-nBits));sumBits=(BitPos&0x07)+nBits;if(sumBits>15){bits=8-(sumBits&7);xCode=lCode<<bits;huffCode.push(revByte((xCode>>16))&0x0ff);huffCode.push(revByte((xCode>>8))&0x0ff);}else if(sumBits>7){bits=8-(sumBits&7);xCode=lCode<<bits;huffCode.push(revByte((xCode>>8))&0x0ff);}BitPos+=nBits;actByte=lCode&0x0ff;}
function revByte(val){var rev=0;if(val&0x01){rev|=0x80;}if(val&0x02){rev|=0x40;}if(val&0x04){rev|=0x20;}if(val&0x08){rev|=0x10;}if(val&0x10){rev|=0x08;}if(val&0x20){rev|=0x04;}if(val&0x40){rev|=0x02;}if(val&0x80){rev|=0x01;}return rev;}
function SFFcodeRun(white,len){ht=white?HUFwhiteTable:HUFblackTable;if(len>=64){ind=(len>>6)+63;SFFhuffCode(ht[ind][0],ht[ind][1]);ind=len-((ind-63)<<6);SFFhuffCode(ht[ind][0],ht[ind][1]);}else {SFFhuffCode(ht[len][0],ht[len][1]);}}
function SFFencodeLine(pix,x4){var actColor;var isWhite=true;var runLen=0;for(var x=0;x<1728;x++,x4+=4){actWhite=pix[x4]>128?true:false;if(isWhite!=actWhite){SFFcodeRun(isWhite,runLen);isWhite=actWhite;runLen=1;}else runLen++;}if(runLen!=0){SFFcodeRun(isWhite,runLen);}}HUFwhiteTable=[[8,0x3500],[6,0x1c00],[4,0x7000],[4,0x8000],[4,0xb000],[4,0xc000],[4,0xe000],[4,0xf000],[5,0x9800],[5,0xa000],[5,0x3800],[5,0x4000],[6,0x2000],[6,0x0c00],[6,0xd000],[6,0xd400],[6,0xa800],[6,0xac00],[7,0x4e00],[7,0x1800],[7,0x1000],[7,0x2e00],[7,0x0600],[7,0x0800],[7,0x5000],[7,0x5600],[7,0x2600],[7,0x4800],[7,0x3000],[8,0x0200],[8,0x0300],[8,0x1a00],[8,0x1b00],[8,0x1200],[8,0x1300],[8,0x1400],[8,0x1500],[8,0x1600],[8,0x1700],[8,0x2800],[8,0x2900],[8,0x2a00],[8,0x2b00],[8,0x2c00],[8,0x2d00],[8,0x0400],[8,0x0500],[8,0x0a00],[8,0x0b00],[8,0x5200],[8,0x5300],[8,0x5400],[8,0x5500],[8,0x2400],[8,0x2500],[8,0x5800],[8,0x5900],[8,0x5a00],[8,0x5b00],[8,0x4a00],[8,0x4b00],[8,0x3200],[8,0x3300],[8,0x3400],[5,0xd800],[5,0x9000],[6,0x5c00],[7,0x6e00],[8,0x3600],[8,0x3700],[8,0x6400],[8,0x6500],[8,0x6800],[8,0x6700],[9,0x6600],[9,0x6680],[9,0x6900],[9,0x6980],[9,0x6a00],[9,0x6a80],[9,0x6b00],[9,0x6b80],[9,0x6c00],[9,0x6c80],[9,0x6d00],[9,0x6d80],[9,0x4c00],[9,0x4c80],[9,0x4d00],[6,0x6000],[9,0x4d80],[11,0x0100],[11,0x0180],[11,0x01a0],[12,0x0120],[12,0x0130],[12,0x0140],[12,0x0150],[12,0x0160],[12,0x0170],[12,0x01c0],[12,0x01d0],[12,0x01e0],[12,0x01f0],[12,0x0010],];HUFblackTable=[[10,0x0dc0],[3,0x4000],[2,0xc000],[2,0x8000],[3,0x6000],[4,0x3000],[4,0x2000],[5,0x1800],[6,0x1400],[6,0x1000],[7,0x0800],[7,0x0a00],[7,0x0e00],[8,0x0400],[8,0x0700],[9,0x0c00],[10,0x05c0],[10,0x0600],[10,0x0200],[11,0x0ce0],[11,0x0d00],[11,0x0d80],[11,0x06e0],[11,0x0500],[11,0x02e0],[11,0x0300],[12,0x0ca0],[12,0x0cb0],[12,0x0cc0],[12,0x0cd0],[12,0x0680],[12,0x0690],[12,0x06a0],[12,0x06b0],[12,0x0d20],[12,0x0d30],[12,0x0d40],[12,0x0d50],[12,0x0d60],[12,0x0d70],[12,0x06c0],[12,0x06d0],[12,0x0da0],[12,0x0db0],[12,0x0540],[12,0x0550],[12,0x0560],[12,0x0570],[12,0x0640],[12,0x0650],[12,0x0520],[12,0x0530],[12,0x0240],[12,0x0370],[12,0x0380],[12,0x0270],[12,0x0280],[12,0x0580],[12,0x0590],[12,0x02b0],[12,0x02c0],[12,0x05a0],[12,0x0660],[12,0x0670],[10,0x03c0],[12,0x0c80],[12,0x0c90],[12,0x05b0],[12,0x0330],[12,0x0340],[12,0x0350],[13,0x0360],[13,0x0368],[13,0x0250],[13,0x0258],[13,0x0260],[13,0x0268],[13,0x0390],[13,0x0398],[13,0x03a0],[13,0x03a8],[13,0x03b0],[13,0x03b8],[13,0x0290],[13,0x0298],[13,0x02a0],[13,0x02a8],[13,0x02d0],[13,0x02d8],[13,0x0320],[13,0x0328],[11,0x0100],[11,0x0180],[11,0x01a0],[12,0x0120],[12,0x0130],[12,0x0140],[12,0x0150],[12,0x0160],[12,0x0170],[12,0x01c0],[12,0x01d0],[12,0x01e0],[12,0x01f0],[12,0x0010]];}
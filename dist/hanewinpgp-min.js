/**
 * hanewinpgp - PGP / GnuPG / OpenPGP Message Encryption in JavaScript by Herbert Hanewinkel.
 * @version v0.1.0
 * @link https://www.hanewin.net/encrypt/
 * @license SEE LICENSE IN LICENSE
 */
"use strict";function randomByte(){return 255&Math.round(255*Math.random())}function timeByte(){return(new Date).getTime()>>>2&255}function rnTimer(){for(var r=timeByte(),e=0;e<256;e++)r^=randomByte(),rnArray[255&rnNext++]^=r;stop||setTimeout(rnTimer,128|randomByte())}function randomString(r,e){for(var t="",n=timeByte(),o=0;o<r;)n^=rnArray[255&rnRead++]^mouseByte()^keyByte(),0==n&&e||(o++,t+=String.fromCharCode(n));return t}function hex2s(r){var e="";r.length%2&&(r+="0");for(var t=0;t<r.length;t+=2)e+=String.fromCharCode(parseInt(r.slice(t,t+2),16));return e}function crc24(r){for(var e=11994318,t=0;t<r.length;t++){e^=(255&r.charCodeAt(t))<<16;for(var n=0;n<8;n++)e<<=1,16777216&e&&(e^=25578747)}return String.fromCharCode(e>>16&255)+String.fromCharCode(e>>8&255)+String.fromCharCode(255&e)}function GPGencrypt(r,e){var t,n,o=e.length,a=(r.length,new Array(bpbl)),s=new Array(bpbl),i=new Array(bpbl+2),c=new Array,u="";if(o%bpbl)for(t=o%bpbl;t<bpbl;t++)e+="\0";for(c=keyExpansion(r),t=0;t<bpbl;t++)a[t]=0,s[t]=randomByte();for(a=AESencrypt(a,c),t=0;t<bpbl;t++)i[t]=a[t]^=s[t];for(a=AESencrypt(a,c),i[bpbl]=a[0]^s[bpbl-2],i[bpbl+1]=a[1]^s[bpbl-1],t=0;t<bpbl+2;t++)u+=String.fromCharCode(i[t]);for(a=i.slice(2,bpbl+2),n=0;n<e.length;n+=bpbl)for(a=AESencrypt(a,c),t=0;t<bpbl;t++)a[t]^=e.charCodeAt(n+t),u+=String.fromCharCode(a[t]);return u.substr(0,o+bpbl+2)}function GPGpkt(r,e){e>255&&(r+=1);var t=String.fromCharCode(r);return e>255&&(t+=String.fromCharCode(e/256)),t+=String.fromCharCode(e%256)}function GPGpkesk(r,e,t,n,o){var a=new Array,s=new Array,i="",c=r2s(o),u=Math.floor((256*c.charCodeAt(0)+c.charCodeAt(1)+7)/8);if(a=mpi2b(c.substr(0,u+2)),e){var h=new Array,d=new Array,f=new Array,b=new Array,m=Math.floor((256*c.charCodeAt(u+2)+c.charCodeAt(u+3)+7)/8)+2;h=mpi2b(c.substr(u+2,m)),d=mpi2b(c.substr(u+2+m)),s[0]=9,f=bmodexp(h,s,a),b=bmodexp(d,s,a)}else s=mpi2b(c.substr(u+2));for(var l=n.length,v=0,y=0;y<l;y++)v+=n.charCodeAt(y);v&=65535;var p=8*(u-2)+2,C=String.fromCharCode(p/256)+String.fromCharCode(p%256)+String.fromCharCode(2)+randomString(u-l-6,1)+"\0"+String.fromCharCode(t)+n+String.fromCharCode(v/256)+String.fromCharCode(255&v);return e?(i=b2mpi(f)+b2mpi(bmod(bmul(mpi2b(C),b),a)),GPGpkt(132,i.length+10)+String.fromCharCode(3)+r+String.fromCharCode(16)+i):(i=b2mpi(bmodexp(mpi2b(C),s,a)),GPGpkt(132,i.length+10)+String.fromCharCode(3)+r+String.fromCharCode(1)+i)}function GPGld(r){return r.indexOf("\r\n")==-1&&(r=r.replace(/\n/g,"\r\n")),GPGpkt(172,r.length+10)+"t"+String.fromCharCode(4)+"file\0\0\0\0"+r}function GPGsed(r,e){var t=GPGencrypt(r,GPGld(e));return GPGpkt(164,t.length)+t}function doEncrypt(r,e,t,n){var o=7,a=[16,24,32],s=a[o-7],i=randomString(s,0);r=hex2s(r);var c=GPGpkesk(r,e,o,i,t)+GPGsed(i,n);return"-----BEGIN PGP MESSAGE-----\nVersion: haneWIN JavascriptPG v2.0\n\n"+s2r(c)+"\n="+s2r(crc24(c))+"\n-----END PGP MESSAGE-----\n"}function s2hex(r){for(var e="",t=0;t<r.length;t++){var n=r.charCodeAt(t);e+=(n<16?"0":"")+n.toString(16)}return e}function getPublicKey(r){var e,t=0,n=r.indexOf("-----BEGIN PGP PUBLIC KEY BLOCK-----");if(n==-1)return alert("No PGP Public Key Block"),this.vers="",this.fp="",this.keyid="",this.user="",void(this.pkey="");var o=r.indexOf("\n\n",n);o>0?o+=2:(o=r.indexOf("\n\r\n",n),o>0&&(o+=3));var a=r.indexOf("\n=",n);if(!(o>0&&a>0))return alert("Invalid PGP Public Key Block"),this.vers="",this.fp="",this.keyid="",this.user="",void(this.pkey="");r=r.slice(o,a);for(var s=r2s(r),n=0;n<s.length;){var i=s.charCodeAt(n++);if(0==(128&i))break;if(64&i?(i&=63,e=s.charCodeAt(n++),e>191&&e<224?e=(e-192<<8)+s.charCodeAt(n++):255==e?e=(s.charCodeAt(n++)<<24)+(s.charCodeAt(n++)<<16)+(s.charCodeAt(n++)<<8)+s.charCodeAt(n++):e>223&&e<255&&(e=1<<(31&e))):(e=3&i,i=i>>2&15,e=0==e?s.charCodeAt(n++):1==e?(s.charCodeAt(n++)<<8)+s.charCodeAt(n++):2==e?(s.charCodeAt(n++)<<24)+(s.charCodeAt(n++)<<16)+(s.charCodeAt(n++)<<8)+s.charCodeAt(n++):s.length-1),6==i||14==i){var c=n,u=s.charCodeAt(n++);t=1,this.vers=u;(s.charCodeAt(n++)<<24)+(s.charCodeAt(n++)<<16)+(s.charCodeAt(n++)<<8)+s.charCodeAt(n++);if(2==u||3==u){s.charCodeAt(n++)<<8+s.charCodeAt(n++)}var h=s.charCodeAt(n++);if(1==h||2==h){var d=n,f=Math.floor((256*s.charCodeAt(n)+s.charCodeAt(n+1)+7)/8);n+=f+2;var b=s.substr(d,f+2),m=Math.floor((256*s.charCodeAt(n)+s.charCodeAt(n+1)+7)/8);if(n+=m+2,this.pkey=s2r(s.substr(d,f+m+4)),this.type="RSA",3==u)this.fp="",this.keyid=s2hex(b.substr(b.length-8,8));else if(4==u){var l=String.fromCharCode(153)+String.fromCharCode(e>>8)+String.fromCharCode(255&e)+s.substr(c,e),v=str_sha1(l);this.fp=s2hex(v),this.keyid=s2hex(v.substr(v.length-8,8))}else this.fp="",this.keyid="";t=2}else if(16!=h&&20!=h||4!=u)n=c+e;else{var d=n,y=Math.floor((256*s.charCodeAt(n)+s.charCodeAt(n+1)+7)/8);n+=y+2;var p=Math.floor((256*s.charCodeAt(n)+s.charCodeAt(n+1)+7)/8);n+=p+2;var C=Math.floor((256*s.charCodeAt(n)+s.charCodeAt(n+1)+7)/8);n+=C+2,this.pkey=s2r(s.substr(d,y+p+C+6));var l=String.fromCharCode(153)+String.fromCharCode(e>>8)+String.fromCharCode(255&e)+s.substr(c,e),v=str_sha1(l);this.fp=s2hex(v),this.keyid=s2hex(v.substr(v.length-8,8)),this.type="ELGAMAL",t=3}}else 13==i?(this.user=s.substr(n,e),n+=e):n+=e}t<2&&(this.vers="",this.fp="",this.keyid="",0==t?this.user="No public key packet found.":1==t&&(this.user="public key algorithm is "+h+" not RSA or ELGAMAL."),this.pkey="")}function B0(r){return 255&r}function B1(r){return r>>8&255}function B2(r){return r>>16&255}function B3(r){return r>>24&255}function F1(r,e,t,n){return B1(T1[255&r])|B1(T1[e>>8&255])<<8|B1(T1[t>>16&255])<<16|B1(T1[n>>>24])<<24}function packBytes(r){var e,t,n=r.length,o=new Array(n/4);if(r&&!(n%4)){for(e=0,t=0;t<n;t+=4)o[e++]=r[t]|r[t+1]<<8|r[t+2]<<16|r[t+3]<<24;return o}}function unpackBytes(r){var e,t=0,n=r.length,o=new Array(4*n);for(e=0;e<n;e++)o[t++]=B0(r[e]),o[t++]=B1(r[e]),o[t++]=B2(r[e]),o[t++]=B3(r[e]);return o}function keyExpansion(r){var e,t,n,o,a,s,i=new Array(maxrk+1),c=r.length,u=new Array(maxkc),h=new Array(maxkc),d=0;if(16==c)s=10,e=4;else if(24==c)s=12,e=6;else{if(32!=c)return void alert("Invalid AES key length "+c);s=14,e=8}for(t=0;t<maxrk+1;t++)i[t]=new Array(4);for(t=0,n=0;n<c;n++,t+=4)u[n]=r.charCodeAt(t)|r.charCodeAt(t+1)<<8|r.charCodeAt(t+2)<<16|r.charCodeAt(t+3)<<24;for(n=e-1;n>=0;n--)h[n]=u[n];for(o=0,a=0,n=0;n<e&&o<s+1;){for(;n<e&&a<4;n++,a++)i[o][a]=h[n];4==a&&(o++,a=0)}for(;o<s+1;){var f=h[e-1];if(h[0]^=S[B1(f)]|S[B2(f)]<<8|S[B3(f)]<<16|S[B0(f)]<<24,h[0]^=Rcon[d++],8!=e)for(n=1;n<e;n++)h[n]^=h[n-1];else{for(n=1;n<e/2;n++)h[n]^=h[n-1];for(f=h[e/2-1],h[e/2]^=S[B0(f)]|S[B1(f)]<<8|S[B2(f)]<<16|S[B3(f)]<<24,n=e/2+1;n<e;n++)h[n]^=h[n-1]}for(n=0;n<e&&o<s+1;){for(;n<e&&a<4;n++,a++)i[o][a]=h[n];4==a&&(o++,a=0)}}return{rounds:s,rk:i}}function AESencrypt(r,e){var t,n,o,a,s,i=packBytes(r),c=e.rounds,u=i[0],h=i[1],d=i[2],f=i[3];for(t=0;t<c-1;t++)n=u^e.rk[t][0],o=h^e.rk[t][1],a=d^e.rk[t][2],s=f^e.rk[t][3],u=T1[255&n]^T2[o>>8&255]^T3[a>>16&255]^T4[s>>>24],h=T1[255&o]^T2[a>>8&255]^T3[s>>16&255]^T4[n>>>24],d=T1[255&a]^T2[s>>8&255]^T3[n>>16&255]^T4[o>>>24],f=T1[255&s]^T2[n>>8&255]^T3[o>>16&255]^T4[a>>>24];return t=c-1,n=u^e.rk[t][0],o=h^e.rk[t][1],a=d^e.rk[t][2],s=f^e.rk[t][3],i[0]=F1(n,o,a,s)^e.rk[c][0],i[1]=F1(o,a,s,n)^e.rk[c][1],i[2]=F1(a,s,n,o)^e.rk[c][2],i[3]=F1(s,n,o,a)^e.rk[c][3],unpackBytes(i)}function s2r(r){var e,t,n,o="",a=0,s=0,i=r.length;for(n=0;n<i;n++)t=r.charCodeAt(n),0==s?(o+=b64s.charAt(t>>2&63),e=(3&t)<<4):1==s?(o+=b64s.charAt(e|t>>4&15),e=(15&t)<<2):2==s&&(o+=b64s.charAt(e|t>>6&3),a+=1,a%60==0&&(o+="\n"),o+=b64s.charAt(63&t)),a+=1,a%60==0&&(o+="\n"),s+=1,3==s&&(s=0);return s>0&&(o+=b64s.charAt(e),a+=1,a%60==0&&(o+="\n"),o+="=",a+=1),1==s&&(a%60==0&&(o+="\n"),o+="="),o}function r2s(r){var e,t,n="",o=0,a=0,s=r.length;for(t=0;t<s;t++)e=b64s.indexOf(r.charAt(t)),e>=0&&(o&&(n+=String.fromCharCode(a|e>>6-o&255)),o=o+2&7,a=e<<o&255);return n}function rc4Init(){var r,e,t=new Array(256);for(r=0;r<256;r++)s[r]=r,t[r]=randomByte()^timeByte();for(y=0,r=0;r<2;r++)for(x=0;x<256;x++)y=(t[r]+s[x]+y)%256,e=s[x],s[x]=s[y],s[y]=e;x=0,y=0}function rc4Next(r){var e;return x=x+1&255,y=s[x]+y&255,e=s[x],s[x]=s[y],s[y]=e,255&(r^s[(s[x]+s[y])%256])}function keyByte(){return keyArray[keyRead++%keyNext]}function keyPressEntropy(r){keyArray[keyNext++%256]^=timeByte()}function mouseByte(){return mouseArray[mouseRead++%mouseNext]}function mouseMoveEntropy(r){var e;r||(r=window.event),mouseMoveSkip--<=0&&(e=oldMoveHandler?r.clientX<<4|15&r.clientY:r.screenX<<4|15&r.screenY,mouseArray[mouseNext++%256]^=rc4Next(255&e),mouseArray[mouseNext++%256]^=rc4Next(timeByte()),mouseMoveSkip=7&randomByte())}function eventsEnd(){document.removeEventListener?(document.removeEventListener("mousemove",mouseMoveEntropy,!1),document.removeEventListener("keypress",keyPressEntropy,!1)):document.detachEvent?(document.detachEvent("onmousemove",mouseMoveEntropy),document.detachEvent("onkeypress",keyPressEntropy)):document.releaseEvents?(document.releaseEvents(EVENT.MOUSEMOVE),document.onMousemove=0,document.releaseEvents(EVENT.KEYPRESS),document.onKeypress=0):(document.onMousemove=oldMoveHandler,document.onKeypress=oldKeyHandler)}function eventsCollect(){document.implementation.hasFeature("Events","2.0")&&document.addEventListener?(document.addEventListener("mousemove",mouseMoveEntropy,!1),document.addEventListener("keypress",keyPressEntropy,!1)):document.attachEvent?(document.attachEvent("onmousemove",mouseMoveEntropy),document.attachEvent("onkeypress",keyPressEntropy)):document.captureEvents?(document.captureEvents(Event.MOUSEMOVE),document.onMousemove=mouseMoveEntropy,document.captureEvents(Event.KEYPRESS),document.onMousemove=keyPressEntropy):(oldMoveHandler=document.onmousemove,document.onMousemove=mouseMoveEntropy,oldKeyHandler=document.onkeypress,document.onKeypress=keyPressEntropy),rc4Init()}function zeros(r){for(var e=new Array(r);r-- >0;)e[r]=0;return e}function zclip(r){var e=r.length;if(r[e-1])return r;for(;e>1&&0==r[e-1];)e--;return r.slice(0,e)}function nbits(r){var e,t=1;return 0!=(e=r>>>16)&&(r=e,t+=16),0!=(e=r>>8)&&(r=e,t+=8),0!=(e=r>>4)&&(r=e,t+=4),0!=(e=r>>2)&&(r=e,t+=2),0!=(e=r>>1)&&(r=e,t+=1),t}function badd(r,e){var t=r.length,n=e.length;if(t<n)return badd(e,r);for(var o=new Array(t),a=0,s=0;s<n;s++)a+=r[s]+e[s],o[s]=a&bm,a>>>=bs;for(;s<t;s++)a+=r[s],o[s]=a&bm,a>>>=bs;return a&&(o[s]=a),o}function bsub(r,e){var t=r.length,n=e.length;if(n>t)return[];if(n==t){if(e[n-1]>r[n-1])return[];if(1==n)return[r[0]-e[0]]}for(var o=new Array(t),a=0,s=0;s<n;s++)a+=r[s]-e[s],o[s]=a&bm,a>>=bs;for(;s<t;s++)a+=r[s],o[s]=a&bm,a>>=bs;return a?[]:zclip(o)}function ip(r,e,t,n,o){var a=t&bdm,s=t>>bd,i=n&bdm,c=n>>bd,u=s*i+c*a,h=a*i+((u&bdm)<<bd)+r[e]+o;return r[e]=h&bm,o=s*c+(u>>bd)+(h>>bs)}function bsqr(r){var e,t,n=r.length,o=2*n,a=zeros(o),s=0;for(e=0;e<n;e++){for(s=ip(a,2*e,r[e],r[e],0),t=e+1;t<n;t++)s=ip(a,e+t,2*r[t],r[e],s);a[e+n]=s}return zclip(a)}function bmul(r,e){var t,n,o,a=r.length,s=e.length,i=zeros(a+s-1);for(n=0;n<s;n++){for(t=0,o=0;o<a;o++)t=ip(i,n+o,r[o],e[n],t);i[n+a]=t}return zclip(i)}function toppart(r,e,t){for(var n=0;e>=0&&t-- >0;)n=n*bx2+r[e--];return n}function bdiv(r,e){var t=r.length-1,n=e.length-1,o=t-n;if(t<n||t==n&&(r[t]<e[t]||t>0&&r[t]==e[t]&&r[t-1]<e[t-1]))return{q:[0],mod:r};if(t==n&&toppart(r,n,2)/toppart(e,n,2)<4){for(var a,s=r.concat(),i=0;a=bsub(s,e),0!=a.length;)s=a,i++;return{q:[i],mod:s}}var c=Math.floor(Math.log(e[n])/log2)+1,u=bs-c,s=r.concat(),h=e.concat();if(u){for(d=n;d>0;d--)h[d]=h[d]<<u&bm|h[d-1]>>c;for(h[0]=h[0]<<u&bm,s[t]&(bm<<c&bm)&&(s[++t]=0,o++),d=t;d>0;d--)s[d]=s[d]<<u&bm|s[d-1]>>c;s[0]=s[0]<<u&bm}for(var d,f,b=zeros(o+1),m=zeros(o).concat(h);f=bsub(s,m),0!=f.length;)b[o]++,s=f;var l=h[n],v=toppart(h,n,2);for(d=t;d>n;d--){var y=d-n-1;d>=s.length?b[y]=1:s[d]==l?b[y]=bm:b[y]=Math.floor(toppart(s,d,2)/l);for(var p=toppart(s,d,3);b[y]*v>p;)b[y]--;m=m.slice(1),f=bsub(s,bmul([b[y]],m)),0==f.length&&(b[y]--,f=bsub(s,bmul([b[y]],m))),s=f}if(u){for(d=0;d<s.length-1;d++)s[d]=s[d]>>u|s[d+1]<<c&bm;s[s.length-1]>>=u}return{q:zclip(b),mod:zclip(s)}}function simplemod(r,e){for(var t,n=0,o=r.length-1;o>=0;o--)t=r[o],n=((t>>bd)+(n<<bd))%e,n=((t&bdm)+(n<<bd))%e;return n}function bmod(r,e){if(1==e.length){if(1==r.length)return[r[0]%e[0]];if(e[0]<bdm)return[simplemod(r,e[0])]}var t=bdiv(r,e);return t.mod}function bmod2(r,e,t){var n=r.length-(e.length<<1);if(n>0)return bmod2(r.slice(0,n).concat(bmod2(r.slice(n),e,t)),e,t);var o,a=e.length+1,s=e.length-1,i=bmul(r.slice(s),t).slice(a),c=r.slice(0,a),u=bmul(i,e).slice(0,a),h=bsub(c,u);0==h.length&&(c[a]=1,h=bsub(c,u));for(var d=0;o=bsub(h,e),0!=o.length;d++)if(h=o,d>=3)return bmod2(h,e,t);return h}function bexpmod(r,e,t){for(var n=r.concat(),o=e.length-1,a=nbits(e[o])-2;o>=0;o--){for(;a>=0;a-=1)n=bmod(bsqr(n),t),e[o]&1<<a&&(n=bmod(bmul(n,r),t));a=bs-1}return n}function bmodexp(r,e,t){var n=r.concat(),o=e.length-1,a=2*t.length,s=zeros(a+1);for(s[a]=1,s=bdiv(s,t).q,a=nbits(e[o])-2;o>=0;o--){for(;a>=0;a-=1)n=bmod2(bsqr(n),t,s),e[o]&1<<a&&(n=bmod2(bmul(n,r),t,s));a=bs-1}return n}function RSAencrypt(r,e,t){return bexpmod(r,e,t)}function RSAdecrypt(r,e,t,n,o){var a=bmodexp(bmod(r,t),bmod(e,bsub(t,[1])),t),s=bmodexp(bmod(r,n),bmod(e,bsub(n,[1])),n),i=bsub(s,a);return 0==i.length?(i=bsub(a,s),i=bmod(bmul(i,o),n),i=bsub(n,i)):i=bmod(bmul(i,o),n),badd(bmul(i,t),a)}function mpi2b(r){var e,t=1,n=[0],o=0,a=256,s=r.length;if(s<2)return alert("string too short, not a MPI"),0;var i=8*(s-2),c=256*r.charCodeAt(0)+r.charCodeAt(1);if(c>i||c<i-8)return alert("not a MPI, bits="+c+",len="+i),0;for(var u=0;u<i;u++)(a<<=1)>255&&(a=1,e=r.charCodeAt(--s)),t>bm&&(t=1,n[++o]=0),e&a&&(n[o]|=t),t<<=1;return n}function b2mpi(r){var e,t=1,n=0,o=[0],a=1,s=0,i=r.length*bs,c="";for(e=0;e<i;e++)r[n]&t&&(o[s]|=a),(a<<=1)>255&&(a=1,o[++s]=0),(t<<=1)>bm&&(t=1,n++);for(;s&&0==o[s];)s--;for(t=256,i=8;i>0&&!(o[s]&(t>>=1));i--);if(i+=8*s,c+=String.fromCharCode(i/256)+String.fromCharCode(i%256),i)for(e=s;e>=0;e--)c+=String.fromCharCode(o[e]);return c}function hex_sha1(r){return binb2hex(core_sha1(str2binb(r),r.length*chrsz))}function b64_sha1(r){return binb2b64(core_sha1(str2binb(r),r.length*chrsz))}function str_sha1(r){return binb2str(core_sha1(str2binb(r),r.length*chrsz))}function hex_hmac_sha1(r,e){return binb2hex(core_hmac_sha1(r,e))}function b64_hmac_sha1(r,e){return binb2b64(core_hmac_sha1(r,e))}function str_hmac_sha1(r,e){return binb2str(core_hmac_sha1(r,e))}function sha1_vm_test(){return"a9993e364706816aba3e25717850c26c9cd0d89d"==hex_sha1("abc")}function core_sha1(r,e){r[e>>5]|=128<<24-e%32,r[(e+64>>9<<4)+15]=e;for(var t=Array(80),n=1732584193,o=-271733879,a=-1732584194,s=271733878,i=-1009589776,c=0;c<r.length;c+=16){for(var u=n,h=o,d=a,f=s,b=i,m=0;m<80;m++){m<16?t[m]=r[c+m]:t[m]=rol(t[m-3]^t[m-8]^t[m-14]^t[m-16],1);var l=safe_add(safe_add(rol(n,5),sha1_ft(m,o,a,s)),safe_add(safe_add(i,t[m]),sha1_kt(m)));i=s,s=a,a=rol(o,30),o=n,n=l}n=safe_add(n,u),o=safe_add(o,h),a=safe_add(a,d),s=safe_add(s,f),i=safe_add(i,b)}return Array(n,o,a,s,i)}function sha1_ft(r,e,t,n){return r<20?e&t|~e&n:r<40?e^t^n:r<60?e&t|e&n|t&n:e^t^n}function sha1_kt(r){return r<20?1518500249:r<40?1859775393:r<60?-1894007588:-899497514}function core_hmac_sha1(r,e){var t=str2binb(r);t.length>16&&(t=core_sha1(t,r.length*chrsz));for(var n=Array(16),o=Array(16),a=0;a<16;a++)n[a]=909522486^t[a],o[a]=1549556828^t[a];var s=core_sha1(n.concat(str2binb(e)),512+e.length*chrsz);return core_sha1(o.concat(s),672)}function safe_add(r,e){var t=(65535&r)+(65535&e),n=(r>>16)+(e>>16)+(t>>16);return n<<16|65535&t}function rol(r,e){return r<<e|r>>>32-e}function str2binb(r){for(var e=Array(),t=(1<<chrsz)-1,n=0;n<r.length*chrsz;n+=chrsz)e[n>>5]|=(r.charCodeAt(n/chrsz)&t)<<24-n%32;return e}function binb2str(r){for(var e="",t=(1<<chrsz)-1,n=0;n<32*r.length;n+=chrsz)e+=String.fromCharCode(r[n>>5]>>>24-n%32&t);return e}function binb2hex(r){for(var e=hexcase?"0123456789ABCDEF":"0123456789abcdef",t="",n=0;n<4*r.length;n++)t+=e.charAt(r[n>>2]>>8*(3-n%4)+4&15)+e.charAt(r[n>>2]>>8*(3-n%4)&15);return t}function binb2b64(r){for(var e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",t="",n=0;n<4*r.length;n+=3)for(var o=(r[n>>2]>>8*(3-n%4)&255)<<16|(r[n+1>>2]>>8*(3-(n+1)%4)&255)<<8|r[n+2>>2]>>8*(3-(n+2)%4)&255,a=0;a<4;a++)t+=8*n+6*a>32*r.length?b64pad:e.charAt(o>>6*(3-a)&63);return t}var rnArray=new Array(256),rnNext=0,rnRead=0;rnTimer();var bpbl=16;module.exports.encrypt=function(r,e){return doEncrypt(r.id,r.type,r.key,e)};var stop=!1;module.exports.stop=function(){stop=!0},module.exports.extract=function(r){var e=new getPublicKey(r);return{version:e.vers,user:e.user,id:e.keyid,type:"RSA"==e.type?0:1,key:e.pkey.replace(/\n/g,"")}};var Rcon=[1,2,4,8,16,32,64,128,27,54,108,216,171,77,154,47,94,188,99,198,151,53,106,212,179,125,250,239,197,145],S=[99,124,119,123,242,107,111,197,48,1,103,43,254,215,171,118,202,130,201,125,250,89,71,240,173,212,162,175,156,164,114,192,183,253,147,38,54,63,247,204,52,165,229,241,113,216,49,21,4,199,35,195,24,150,5,154,7,18,128,226,235,39,178,117,9,131,44,26,27,110,90,160,82,59,214,179,41,227,47,132,83,209,0,237,32,252,177,91,106,203,190,57,74,76,88,207,208,239,170,251,67,77,51,133,69,249,2,127,80,60,159,168,81,163,64,143,146,157,56,245,188,182,218,33,16,255,243,210,205,12,19,236,95,151,68,23,196,167,126,61,100,93,25,115,96,129,79,220,34,42,144,136,70,238,184,20,222,94,11,219,224,50,58,10,73,6,36,92,194,211,172,98,145,149,228,121,231,200,55,109,141,213,78,169,108,86,244,234,101,122,174,8,186,120,37,46,28,166,180,198,232,221,116,31,75,189,139,138,112,62,181,102,72,3,246,14,97,53,87,185,134,193,29,158,225,248,152,17,105,217,142,148,155,30,135,233,206,85,40,223,140,161,137,13,191,230,66,104,65,153,45,15,176,84,187,22],T1=[2774754246,2222750968,2574743534,2373680118,234025727,3177933782,2976870366,1422247313,1345335392,50397442,2842126286,2099981142,436141799,1658312629,3870010189,2591454956,1170918031,2642575903,1086966153,2273148410,368769775,3948501426,3376891790,200339707,3970805057,1742001331,4255294047,3937382213,3214711843,4154762323,2524082916,1539358875,3266819957,486407649,2928907069,1780885068,1513502316,1094664062,49805301,1338821763,1546925160,4104496465,887481809,150073849,2473685474,1943591083,1395732834,1058346282,201589768,1388824469,1696801606,1589887901,672667696,2711000631,251987210,3046808111,151455502,907153956,2608889883,1038279391,652995533,1764173646,3451040383,2675275242,453576978,2659418909,1949051992,773462580,756751158,2993581788,3998898868,4221608027,4132590244,1295727478,1641469623,3467883389,2066295122,1055122397,1898917726,2542044179,4115878822,1758581177,0,753790401,1612718144,536673507,3367088505,3982187446,3194645204,1187761037,3653156455,1262041458,3729410708,3561770136,3898103984,1255133061,1808847035,720367557,3853167183,385612781,3309519750,3612167578,1429418854,2491778321,3477423498,284817897,100794884,2172616702,4031795360,1144798328,3131023141,3819481163,4082192802,4272137053,3225436288,2324664069,2912064063,3164445985,1211644016,83228145,3753688163,3249976951,1977277103,1663115586,806359072,452984805,250868733,1842533055,1288555905,336333848,890442534,804056259,3781124030,2727843637,3427026056,957814574,1472513171,4071073621,2189328124,1195195770,2892260552,3881655738,723065138,2507371494,2690670784,2558624025,3511635870,2145180835,1713513028,2116692564,2878378043,2206763019,3393603212,703524551,3552098411,1007948840,2044649127,3797835452,487262998,1994120109,1004593371,1446130276,1312438900,503974420,3679013266,168166924,1814307912,3831258296,1573044895,1859376061,4021070915,2791465668,2828112185,2761266481,937747667,2339994098,854058965,1137232011,1496790894,3077402074,2358086913,1691735473,3528347292,3769215305,3027004632,4199962284,133494003,636152527,2942657994,2390391540,3920539207,403179536,3585784431,2289596656,1864705354,1915629148,605822008,4054230615,3350508659,1371981463,602466507,2094914977,2624877800,555687742,3712699286,3703422305,2257292045,2240449039,2423288032,1111375484,3300242801,2858837708,3628615824,84083462,32962295,302911004,2741068226,1597322602,4183250862,3501832553,2441512471,1489093017,656219450,3114180135,954327513,335083755,3013122091,856756514,3144247762,1893325225,2307821063,2811532339,3063651117,572399164,2458355477,552200649,1238290055,4283782570,2015897680,2061492133,2408352771,4171342169,2156497161,386731290,3669999461,837215959,3326231172,3093850320,3275833730,2962856233,1999449434,286199582,3417354363,4233385128,3602627437,974525996],T2=[1667483301,2088564868,2004348569,2071721613,4076011277,1802229437,1869602481,3318059348,808476752,16843267,1734856361,724260477,4278118169,3621238114,2880130534,1987505306,3402272581,2189565853,3385428288,2105408135,4210749205,1499050731,1195871945,4042324747,2913812972,3570709351,2728550397,2947499498,2627478463,2762232823,1920132246,3233848155,3082253762,4261273884,2475900334,640044138,909536346,1061125697,4160222466,3435955023,875849820,2779075060,3857043764,4059166984,1903288979,3638078323,825320019,353708607,67373068,3351745874,589514341,3284376926,404238376,2526427041,84216335,2593796021,117902857,303178806,2155879323,3806519101,3958099238,656887401,2998042573,1970662047,151589403,2206408094,741103732,437924910,454768173,1852759218,1515893998,2694863867,1381147894,993752653,3604395873,3014884814,690573947,3823361342,791633521,2223248279,1397991157,3520182632,0,3991781676,538984544,4244431647,2981198280,1532737261,1785386174,3419114822,3200149465,960066123,1246401758,1280088276,1482207464,3486483786,3503340395,4025468202,2863288293,4227591446,1128498885,1296931543,859006549,2240090516,1162185423,4193904912,33686534,2139094657,1347461360,1010595908,2678007226,2829601763,1364304627,2745392638,1077969088,2408514954,2459058093,2644320700,943222856,4126535940,3166462943,3065411521,3671764853,555827811,269492272,4294960410,4092853518,3537026925,3452797260,202119188,320022069,3974939439,1600110305,2543269282,1145342156,387395129,3301217111,2812761586,2122251394,1027439175,1684326572,1566423783,421081643,1936975509,1616953504,2172721560,1330618065,3705447295,572671078,707417214,2425371563,2290617219,1179028682,4008625961,3099093971,336865340,3739133817,1583267042,185275933,3688607094,3772832571,842163286,976909390,168432670,1229558491,101059594,606357612,1549580516,3267534685,3553869166,2896970735,1650640038,2442213800,2509582756,3840201527,2038035083,3890730290,3368586051,926379609,1835915959,2374828428,3587551588,1313774802,2846444e3,1819072692,1448520954,4109693703,3941256997,1701169839,2054878350,2930657257,134746136,3132780501,2021191816,623200879,774790258,471611428,2795919345,3031724999,3334903633,3907570467,3722289532,1953818780,522141217,1263245021,3183305180,2341145990,2324303749,1886445712,1044282434,3048567236,1718013098,1212715224,50529797,4143380225,235805714,1633796771,892693087,1465364217,3115936208,2256934801,3250690392,488454695,2661164985,3789674808,4177062675,2560109491,286335539,1768542907,3654920560,2391672713,2492740519,2610638262,505297954,2273777042,3924412704,3469641545,1431677695,673730680,3755976058,2357986191,2711706104,2307459456,218962455,3216991706,3873888049,1111655622,1751699640,1094812355,2576951728,757946999,252648977,2964356043,1414834428,3149622742,370551866],T3=[1673962851,2096661628,2012125559,2079755643,4076801522,1809235307,1876865391,3314635973,811618352,16909057,1741597031,727088427,4276558334,3618988759,2874009259,1995217526,3398387146,2183110018,3381215433,2113570685,4209972730,1504897881,1200539975,4042984432,2906778797,3568527316,2724199842,2940594863,2619588508,2756966308,1927583346,3231407040,3077948087,4259388669,2470293139,642542118,913070646,1065238847,4160029431,3431157708,879254580,2773611685,3855693029,4059629809,1910674289,3635114968,828527409,355090197,67636228,3348452039,591815971,3281870531,405809176,2520228246,84545285,2586817946,118360327,304363026,2149292928,3806281186,3956090603,659450151,2994720178,1978310517,152181513,2199756419,743994412,439627290,456535323,1859957358,1521806938,2690382752,1386542674,997608763,3602342358,3011366579,693271337,3822927587,794718511,2215876484,1403450707,3518589137,0,3988860141,541089824,4242743292,2977548465,1538714971,1792327274,3415033547,3194476990,963791673,1251270218,1285084236,1487988824,3481619151,3501943760,4022676207,2857362858,4226619131,1132905795,1301993293,862344499,2232521861,1166724933,4192801017,33818114,2147385727,1352724560,1014514748,2670049951,2823545768,1369633617,2740846243,1082179648,2399505039,2453646738,2636233885,946882616,4126213365,3160661948,3061301686,3668932058,557998881,270544912,4293204735,4093447923,3535760850,3447803085,202904588,321271059,3972214764,1606345055,2536874647,1149815876,388905239,3297990596,2807427751,2130477694,1031423805,1690872932,1572530013,422718233,1944491379,1623236704,2165938305,1335808335,3701702620,574907938,710180394,2419829648,2282455944,1183631942,4006029806,3094074296,338181140,3735517662,1589437022,185998603,3685578459,3772464096,845436466,980700730,169090570,1234361161,101452294,608726052,1555620956,3265224130,3552407251,2890133420,1657054818,2436475025,2503058581,3839047652,2045938553,3889509095,3364570056,929978679,1843050349,2365688973,3585172693,1318900302,2840191145,1826141292,1454176854,4109567988,3939444202,1707781989,2062847610,2923948462,135272456,3127891386,2029029496,625635109,777810478,473441308,2790781350,3027486644,3331805638,3905627112,3718347997,1961401460,524165407,1268178251,3177307325,2332919435,2316273034,1893765232,1048330814,3044132021,1724688998,1217452104,50726147,4143383030,236720654,1640145761,896163637,1471084887,3110719673,2249691526,3248052417,490350365,2653403550,3789109473,4176155640,2553000856,287453969,1775418217,3651760345,2382858638,2486413204,2603464347,507257374,2266337927,3922272489,3464972750,1437269845,676362280,3752164063,2349043596,2707028129,2299101321,219813645,3211123391,3872862694,1115997762,1758509160,1099088705,2569646233,760903469,253628687,2960903088,1420360788,3144537787,371997206],T4=[3332727651,4169432188,4003034999,4136467323,4279104242,3602738027,3736170351,2438251973,1615867952,33751297,3467208551,1451043627,3877240574,3043153879,1306962859,3969545846,2403715786,530416258,2302724553,4203183485,4011195130,3001768281,2395555655,4211863792,1106029997,3009926356,1610457762,1173008303,599760028,1408738468,3835064946,2606481600,1975695287,3776773629,1034851219,1282024998,1817851446,2118205247,4110612471,2203045068,1750873140,1374987685,3509904869,4178113009,3801313649,2876496088,1649619249,708777237,135005188,2505230279,1181033251,2640233411,807933976,933336726,168756485,800430746,235472647,607523346,463175808,3745374946,3441880043,1315514151,2144187058,3936318837,303761673,496927619,1484008492,875436570,908925723,3702681198,3035519578,1543217312,2767606354,1984772923,3076642518,2110698419,1383803177,3711886307,1584475951,328696964,2801095507,3110654417,0,3240947181,1080041504,3810524412,2043195825,3069008731,3569248874,2370227147,1742323390,1917532473,2497595978,2564049996,2968016984,2236272591,3144405200,3307925487,1340451498,3977706491,2261074755,2597801293,1716859699,294946181,2328839493,3910203897,67502594,4269899647,2700103760,2017737788,632987551,1273211048,2733855057,1576969123,2160083008,92966799,1068339858,566009245,1883781176,4043634165,1675607228,2009183926,2943736538,1113792801,540020752,3843751935,4245615603,3211645650,2169294285,403966988,641012499,3274697964,3202441055,899848087,2295088196,775493399,2472002756,1441965991,4236410494,2051489085,3366741092,3135724893,841685273,3868554099,3231735904,429425025,2664517455,2743065820,1147544098,1417554474,1001099408,193169544,2362066502,3341414126,1809037496,675025940,2809781982,3168951902,371002123,2910247899,3678134496,1683370546,1951283770,337512970,2463844681,201983494,1215046692,3101973596,2673722050,3178157011,1139780780,3299238498,967348625,832869781,3543655652,4069226873,3576883175,2336475336,1851340599,3669454189,25988493,2976175573,2631028302,1239460265,3635702892,2902087254,4077384948,3475368682,3400492389,4102978170,1206496942,270010376,1876277946,4035475576,1248797989,1550986798,941890588,1475454630,1942467764,2538718918,3408128232,2709315037,3902567540,1042358047,2531085131,1641856445,226921355,260409994,3767562352,2084716094,1908716981,3433719398,2430093384,100991747,4144101110,470945294,3265487201,1784624437,2935576407,1775286713,395413126,2572730817,975641885,666476190,3644383713,3943954680,733190296,573772049,3535497577,2842745305,126455438,866620564,766942107,1008868894,361924487,3374377449,2269761230,2868860245,1350051880,2776293343,59739276,1509466529,159418761,437718285,1708834751,3610371814,2227585602,3501746280,2193834305,699439513,1517759789,504434447,2076946608,2835108948,1842789307,742004246],maxkc=8,maxrk=14,b64s="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";const alert=function(r){throw new Error(r)};var oldKeyHandler,keyRead=0,keyNext=0,keyArray=new Array(256),mouseMoveSkip=0,oldMoveHandler,mouseRead=0,mouseNext=0,mouseArray=new Array(256),s=new Array(256),x,y,bs=28,bx2=1<<bs,bm=bx2-1,bx=bx2>>1,bd=bs>>1,bdm=(1<<bd)-1,log2=Math.log(2),hexcase=0,b64pad="",chrsz=8;
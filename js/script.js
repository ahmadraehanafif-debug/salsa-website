const CONFIG = {
  whatsappNumber: "6287724976891", // GANTI dengan nomor WhatsApp tujuan, tanpa + atau spasi.
  music: {
    volume: 0.45, // 0 sampai 1
    // Tiap lagu mulai di layar tertentu (startAt), menggantikan lagu sebelumnya dengan transisi halus.
    // Pilihan startAt: "opening", "photos", "letter", "offer", "form", "agreement", "final", atau "after"
    tracks: [
      // from: "1:46" = lagu diputar mulai menit 1:46 sampai habis. Hapus "from" untuk mulai dari awal.
      {src: "assets/audio/lagu1.m4a", startAt: "photos", from: "1:46"}, // lagu 1: mulai saat foto terbuka
      // startAt: "after" = otomatis menyambung begitu lagu sebelumnya habis, lalu mengulang sendiri.
      {src: "assets/audio/lagu2.mp3", startAt: "after"}                 // lagu 2: lanjutan setelah lagu 1 habis
    ]
  },
  // Urutan tampil = urutan di daftar ini. Tambah foto: salin file ke assets/images/ lalu tambah satu baris di sini.
  // File .mp4 otomatis tampil sebagai video. caption boleh diisi tulisan kecil di bawah foto.
  photos: [
    // Urutan: foto mendatar dulu, lalu kotak, lalu tegak, video paling akhir. Di tiap kelompok urutannya diacak.
    // --- foto mendatar (landscape) ---
    {src:"assets/images/foto52.jpg", caption:""},
    {src:"assets/images/foto41.jpg", caption:""},
    {src:"assets/images/foto37.jpg", caption:""},
    {src:"assets/images/foto24.jpg", caption:""},
    {src:"assets/images/foto53.jpg", caption:""},
    {src:"assets/images/foto49.jpg", caption:""},
    {src:"assets/images/foto42.jpg", caption:""},
    {src:"assets/images/foto45.jpg", caption:""},
    {src:"assets/images/foto34.jpg", caption:""},
    {src:"assets/images/foto46.jpg", caption:""},
    {src:"assets/images/foto17.jpg", caption:""},
    {src:"assets/images/foto55.jpg", caption:""},
    {src:"assets/images/foto47.jpg", caption:""},
    {src:"assets/images/foto15.jpg", caption:""},
    {src:"assets/images/foto48.jpg", caption:""},
    {src:"assets/images/foto54.jpg", caption:""},
    // --- foto kotak ---
    {src:"assets/images/foto12.jpg", caption:""},
    {src:"assets/images/foto51.jpg", caption:""},
    {src:"assets/images/foto13.jpg", caption:""},
    // --- foto tegak (portrait) ---
    {src:"assets/images/foto04.jpg", caption:""},
    {src:"assets/images/foto33.jpg", caption:""},
    {src:"assets/images/foto08.jpg", caption:""},
    {src:"assets/images/foto31.jpg", caption:""},
    {src:"assets/images/foto50.jpg", caption:""},
    {src:"assets/images/foto07.jpg", caption:""},
    {src:"assets/images/foto57.jpg", caption:""},
    {src:"assets/images/foto10.jpg", caption:""},
    {src:"assets/images/foto20.jpg", caption:""},
    {src:"assets/images/foto43.jpg", caption:""},
    {src:"assets/images/foto18.jpg", caption:""},
    {src:"assets/images/foto14.jpg", caption:""},
    {src:"assets/images/foto30.jpg", caption:""},
    {src:"assets/images/foto27.jpg", caption:""},
    {src:"assets/images/foto26.jpg", caption:""},
    {src:"assets/images/foto35.jpg", caption:""},
    {src:"assets/images/foto25.jpg", caption:""},
    {src:"assets/images/foto03.jpg", caption:""},
    {src:"assets/images/foto22.jpg", caption:""},
    {src:"assets/images/foto56.jpg", caption:""},
    {src:"assets/images/foto29.jpg", caption:""},
    {src:"assets/images/foto23.jpg", caption:""},
    {src:"assets/images/foto09.jpg", caption:""},
    {src:"assets/images/foto36.jpg", caption:""},
    {src:"assets/images/foto01.jpg", caption:""},
    {src:"assets/images/foto32.jpg", caption:""},
    {src:"assets/images/foto11.jpg", caption:""},
    {src:"assets/images/foto28.jpg", caption:""},
    {src:"assets/images/foto21.jpg", caption:""},
    {src:"assets/images/foto05.jpg", caption:""},
    {src:"assets/images/foto19.jpg", caption:""},
    {src:"assets/images/foto38.jpg", caption:""},
    {src:"assets/images/foto44.jpg", caption:""},
    {src:"assets/images/foto16.jpg", caption:""},
    {src:"assets/images/foto06.jpg", caption:""},
    // --- video ditaruh paling akhir ---
    {src:"assets/images/foto02.mp4", caption:""},  // video (diputar otomatis tanpa suara)
    {src:"assets/images/foto39.mp4", caption:""},  // video (diputar otomatis tanpa suara)
    {src:"assets/images/foto40.mp4", caption:""},  // video (diputar otomatis tanpa suara)
  ]
};

const state = {
  screen: "opening",
  photoIndex: 0,
  photoDecision: "",
  deleteReason: "",
  mainChoice: "",
  noCount: 0,
  date: "",
  time: "",
  activities: [],
  place: "",
  request: "",
  customRequest: "",
  noReason: "",
  signature: false
};

const noLines = [
  "Yakin gamau?",
  "Beneran?",
  "Coba pikir lagi deh.",
  "Ketemu bentar aja kok.",
  "Makan bareng gamau?",
  "Ngobrol bentar aja gimana?",
  "Masih gamau juga?",
  "Hmm... yakin banget nih?",
  "Yaudah deh, aku nyerah wkwk."
];

const noFaces = ["🥺","😳","🤔","🙏","🍜","☕","😢","🫠","🏳️"];

const app = document.getElementById("app");
const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function escapeHTML(s=""){
  return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
}
function setScreen(html, quiet=false){ app.classList.toggle("quiet",quiet); app.innerHTML = html; if(!quiet) window.scrollTo({top:0,behavior:"smooth"}); }
function btn(text, action, cls="btn"){ return `<button class="${cls}" data-action="${action}">${text}</button>`; }
function toast(text){const t=document.createElement("div");t.className="toast";t.textContent=text;document.body.appendChild(t);setTimeout(()=>t.remove(),2200)}

// Layar paling awal: kotak surat. Ditekan -> pintunya terbuka, surat keluar, lalu masuk ke layar pembuka.
const MAILBOX_SVG = `<svg viewBox="0 0 240 300" aria-hidden="true">
 <defs>
  <linearGradient id="mbDoor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e59ab4"/><stop offset="1" stop-color="#b3607f"/></linearGradient>
  <linearGradient id="mbSide" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8a4763"/><stop offset="1" stop-color="#6d3550"/></linearGradient>
 </defs>
 <ellipse cx="120" cy="291" rx="74" ry="8" fill="rgba(0,0,0,.28)"/>
 <rect x="108" y="168" width="24" height="124" rx="5" fill="#7a5645"/>
 <rect x="108" y="168" width="9" height="124" rx="4" fill="#8d6753"/>
 <g class="flag"><rect x="196" y="92" width="6" height="62" rx="3" fill="#c8a66a"/><path d="M202 92 h30 l-8 11 l8 11 h-30z" fill="#e8cf96"/></g>
 <path d="M64 166 V99 a70 70 0 0 1 140 0 V166 Z" fill="url(#mbSide)"/>
 <path d="M50 172 V105 a70 70 0 0 1 140 0 V172 Z" fill="#1d0a13"/>
 <g class="env">
  <rect x="80" y="108" width="80" height="54" rx="6" fill="#fff7ef"/>
  <path d="M82 112 L120 140 L158 112" fill="none" stroke="#d9a6b8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M120 150 c-9 -7 -13 -11 -13 -15.500 a6.500 6.500 0 0 1 13 -2.500 a6.500 6.500 0 0 1 13 2.500 c0 4.500 -4 8.500 -13 15.500z" fill="#e0688f"/>
 </g>
 <g class="door">
  <path d="M50 172 V105 a70 70 0 0 1 140 0 V172 Z" fill="url(#mbDoor)" stroke="#f8dbe4" stroke-width="3"/>
  <path d="M120 142 c-16 -12 -23 -19 -23 -27 a11.500 11.500 0 0 1 23 -5 a11.500 11.500 0 0 1 23 5 c0 8 -7 15 -23 27z" fill="#fff7ef" fill-opacity=".92"/>
  <circle cx="120" cy="62" r="6" fill="#e8cf96"/>
 </g>
</svg>`;
function renderMailbox(){
 setScreen(`<section class="screen"><div class="mail-wrap">
  <div class="eyebrow">ada surat buat kamu</div>
  <button class="mailbox" type="button" data-action="openMailbox" aria-label="Buka kotak surat">${MAILBOX_SVG}</button>
  <p class="hint">ketuk kotak suratnya ya</p>
 </div></section>`);
}
function openMailbox(){
 const box=document.querySelector(".mailbox");
 if(!box||box.classList.contains("open"))return;
 if(REDUCED)return renderOpening();
 box.classList.add("open");
 const wrap=box.closest(".mail-wrap");
 wrap.classList.add("opened");
 setTimeout(()=>burst(box,10),900);
 setTimeout(()=>wrap.classList.add("leaving"),1900);
 setTimeout(renderOpening,2400);
}

function renderOpening(){
 musicCue("opening");
 setScreen(`<section class="screen">
  <div class="decor flower" style="left:8%;top:12%">✿</div><div class="decor teddy" style="right:7%;bottom:10%">🧸</div>
  <div class="card center">
   <div class="eyebrow">a little something</div>
   <h1>For Salsabilla.</h1>
   <div class="actions">${btn("Lihat dulu","memoryIntro")}</div>
  </div>
 </section>`);
}

// Layar ini jalan sendiri: kalimat muncul satu per satu, lalu memudar dan lanjut ke foto.
const MEMORY_INTRO = {
  perLine: 2400,  // jeda antar kalimat (ms)
  hold: 3500      // waktu diam setelah kalimat terakhir sebelum memudar (ms)
};
let memoryTimer = null;
function leaveMemoryIntro(){
 if(memoryTimer===null)return;
 clearTimeout(memoryTimer);memoryTimer=null;
 const card=document.querySelector(".auto-card");
 if(card)card.classList.add("leaving");
 setTimeout(renderPhotos,700);
}
function renderMemoryIntro(){
 const lines=[
  "Oh iya, sebelum lanjut ke bagian selanjutnya, aku masih nyimpen beberapa foto kita.",
  "Kalau dipikir-pikir, kita ternyata jarang banget foto ya.",
  "Kadang aku yang nggak mau, kadang kamu juga, tapi kalau dipikir-pikir... kayaknya lebih sering aku yang nggak mau deh.",
  "Sekarang malah jadi nyesel sendiri.",
  "Jadi sebelum lanjut, aku mau lihat-lihat sebentar kenangan yang masih aku simpan."
 ];
 setScreen(`<section class="screen"><div class="card auto-card" data-action="skipMemoryIntro">
  <div class="eyebrow">oh iya...</div>
  <h2>Sebelum lanjut</h2>
  ${lines.map((t,i)=>`<p class="reveal" style="animation-delay:${i*MEMORY_INTRO.perLine+400}ms">${t}</p>`).join("")}
 </div></section>`);
 memoryTimer=setTimeout(leaveMemoryIntro,(lines.length-1)*MEMORY_INTRO.perLine+400+MEMORY_INTRO.hold);
}

const isVideo=s=>/\.(mp4|webm|mov)$/i.test(s)||/^data:video\//.test(s);
function renderPhotos(){
 musicCue("photos");
 const p=CONFIG.photos[state.photoIndex] || CONFIG.photos[0];
 const total=CONFIG.photos.length;
 const src=p.src;
 const nx=CONFIG.photos[state.photoIndex+1]; // muat foto berikutnya lebih dulu supaya pindahnya mulus
 if(nx&&!isVideo(nx.src)){const pre=new Image();pre.src=nx.src;}
 setScreen(`<section class="screen"><div class="card center">
  <div class="counter">Foto ${state.photoIndex+1} dari ${total}</div>
  <div class="progress"><span style="width:${((state.photoIndex+1)/total)*100}%"></span></div>
  <div class="polaroid-wrap"><div class="polaroid">
   <div class="photo-frame"><span class="photo-missing">Foto belum dimasukkan<small>${escapeHTML(src.startsWith("data:")?"":src)}</small></span>${isVideo(src)
     ? `<video src="${src}" autoplay muted loop playsinline onerror="this.parentNode.classList.add('missing');this.remove()"></video>`
     : `<img src="${src}" alt="Foto kenangan ${state.photoIndex+1}" onerror="this.parentNode.classList.add('missing');this.remove()">`}</div>
   ${p.caption ? `<div class="caption">${escapeHTML(p.caption)}</div>` : ""}
  </div></div>
  <div class="actions">${state.photoIndex < total-1 ? btn("Lanjut","nextPhoto") : btn("Selesai lihat foto","photoQuestion")}</div>
 </div></section>`);
}

function renderPhotoQuestion(){
 setScreen(`<section class="screen"><div class="card center">
  <div class="eyebrow">satu pertanyaan</div>
  <h2>Menurut kamu...</h2>
  <p>Foto-foto ini lebih baik dihapus apa dibiarin aja?</p>
  <div class="actions">
   ${btn("Hapus","deletePhotos","btn alt")}
   ${btn("Dibiarin aja","keepPhotos","btn sage")}
  </div>
 </div></section>`);
}

function renderDeleteReason(){
 setScreen(`<section class="screen"><div class="card">
  <div class="eyebrow">aku boleh tahu?</div>
  <h2>Sebelum aku hapus semuanya...</h2>
  <p>Menurut kamu, kenapa foto-foto ini lebih baik dihapus?</p>
  <div class="field dark"><textarea id="deleteReason" placeholder="Tulis alasan kamu di sini...">${escapeHTML(state.deleteReason)}</textarea></div>
  <div class="actions">${btn("Kirim alasan","submitDeleteReason")}</div>
 </div></section>`);
}
function renderDeleteThanks(){
 setScreen(`<section class="screen"><div class="card center">
  <h2>Makasih ya udah jujur.</h2>
  <p>Aku nggak akan memperdebatkan jawaban kamu. Kalau menurut kamu memang lebih baik dihapus, aku akan menghargai itu.</p>
  <div class="actions">${btn("Lanjut","letter")}</div>
 </div></section>`);
}
function renderKeep(){
 setScreen(`<section class="screen"><div class="card center">
  <h2>Baiklah...</h2>
  <p>Berarti untuk sekarang mereka masih boleh tinggal.</p>
  <p>Mungkin memang nggak semua kenangan harus dibuang cuma karena ceritanya sudah berubah.</p>
  <div class="actions">${btn("Lanjut","letter")}</div>
 </div></section>`);
}

function renderLetter(){
 musicCue("letter");
 setScreen(`<section class="screen"><div class="card">
  <div class="eyebrow">yang ingin aku sampaikan</div>
  <h2>Aku cuma mau jujur.</h2>
  <p>Aku ingin menyelesaikan apa yang pernah aku mulai. Beberapa keputusan dan risiko yang aku ambil waktu itu adalah keputusan aku sendiri.</p>
  <p>Aku juga sadar aku mengambil beberapa keputusan tanpa melibatkan kamu terlebih dulu. Aku nggak mau kamu merasa harus ikut menanggung akibat dari keputusan yang memang aku pilih sendiri.</p>
  <p>Mungkin kedengarannya nggak masuk akal, tapi yaa begitu kenyataannya.</p>
  <p>Sekarang 23 juta itu udah selesai. Sampai sekarang aku sendiri nggak tahu gimana akhirnya aku bisa menyelesaikannya.</p>
  <p>Aku juga nggak tahu keadaan kamu sekarang. Mungkin kamu sudah punya pasangan baru, mungkin juga belum. Aku nggak mau berasumsi dan nggak mau mengganggu kehidupan kamu.</p>
  <p>Aku cuma mau bilang makasih. Banyak banget kenangan sama kamu yang berarti dalam hidup aku.</p>
  <p class="script" style="font-size:2.8rem">Makasih.</p>
  <div class="line"></div>
  <p>Dan aku nggak datang ke sini buat ngajak kamu balikan.</p>
  <p>Aku cuma kangen kamu.</p>
  <p>Bukan kangen hubungan kita.</p>
  <p>Bukan kangen masa lalu.</p>
  <p>Bukan kangen apa yang pernah kita lakukan.</p>
  <p><strong>Aku kangen kamu.</strong></p>
  <div class="actions">${btn("Lanjut","offer")}</div>
 </div></section>`);
}

function renderOffer(){
 musicCue("offer");
 setScreen(`<section class="screen"><div class="decor flower" style="right:8%;top:14%">✿</div><div class="card center">
  <div class="eyebrow">jadi...</div>
  <h2>Mau pergi jalan-jalan sama aku?</h2>
  <p>Nggak harus ke mana-mana yang spesial. Bisa makan, ngopi, jalan, ngobrol, atau sekadar ketemu sebentar.</p>
  <div class="actions">
   ${btn("Mau","chooseYes","btn gold")}
   ${btn("Nggak mau","chooseNo","btn alt")}
  </div>
 </div></section>`);
}

function renderNo(){
 if(state.noCount>=9) return renderNoReason();
 setScreen(`<section class="screen"><div class="card center">
  <div class="eyebrow">eh...</div>
  <div class="face">${noFaces[state.noCount]}</div>
  <h2>${noLines[state.noCount]}</h2>
  <div class="actions"><button class="btn gold" data-action="chooseYes" style="font-size:${(1+state.noCount*0.09).toFixed(2)}rem">Eh, mau deh</button>${btn(state.noCount>=8?"Lanjut":"Nggak mau","noAgain","btn alt")}</div>
 </div></section>`);
}

function renderNoReason(){
 setScreen(`<section class="screen"><div class="card">
  <div class="eyebrow">oke, aku nyerah</div>
  <h2>Tapi aku boleh tahu nggak?</h2>
  <p>Tulis aja sejujurnya, nggak apa-apa. Aku cuma pengin tau aja.</p>
  <div class="field dark"><textarea id="noReason" placeholder="Tulis alasan kamu...">${escapeHTML(state.noReason)}</textarea></div>
  <div class="actions">${btn("Kirim jawaban","submitNoReason")}</div>
 </div></section>`);
}

const TERSERAH = "Terserah, nanti kita atur";
function dayType(iso){
 if(!iso)return "";
 const d=new Date(iso+"T00:00:00").getDay();
 return d===0?"minggu":d===6?"sabtu":"biasa";
}
function dayHint(iso){
 const t=dayType(iso);
 if(!t)return "";
 const nama=new Date(iso+"T00:00:00").toLocaleDateString("id-ID",{weekday:"long"});
 if(t==="biasa")return `Itu hari ${nama}. Aku bisanya dari jam 5 sore ke atas ya.`;
 if(t==="sabtu")return "Itu hari Sabtu. Aku bisa dari jam 2 siang ke atas.";
 return "Itu hari Minggu. Aku bisa dari pagi, ketemu pagi juga bisa hehehe.";
}
function timeOptions(){
 const t=dayType(state.date);
 if(t==="biasa")return ["Sore (jam 5 ke atas)","Malam",TERSERAH];
 if(t==="sabtu")return ["Siang (jam 2 ke atas)","Sore","Malam",TERSERAH];
 return ["Pagi","Siang","Sore","Malam",TERSERAH];
}
function renderYesForm(step=1, quiet=false){
 musicCue("form");
 let content="";
 if(step===1) content=`<div class="field dark"><label>Kamu kosong kapan?</label><p class="small">Pilih aja hari yang kira-kira paling enak buat kamu.</p><input id="date" type="date" min="${todayISO()}" value="${escapeHTML(state.date)}"><p class="day-hint" id="dayHint">${dayHint(state.date)}</p></div>
 <div class="note"><div class="note-title">📝 Catatan kecil dari aku</div>
  <ul>
   <li><strong>Senin – Jumat</strong> bisanya dari jam 5 sore ke atas</li>
   <li><strong>Sabtu</strong> bisa dari jam 2 siang ke atas</li>
   <li><strong>Minggu</strong> bisa dari pagi, ketemu pagi juga bisa hehehe</li>
  </ul></div>`;
 if(step===2) content=`<label>Kalau jamnya...</label><p class="small">Kamu lebih suka ketemu kapan?</p><p class="day-hint">${dayHint(state.date)}</p><div class="grid">
 ${timeOptions().map(x=>`<button class="choice ${state.time===x?"selected":""}" data-time="${x}">${x}</button>`).join("")}</div>`;
 if(step===3) content=`<label>Terus nanti kita ngapain?</label><p class="small">Bebas kok, aku ngikut kamu.</p><div class="grid">
 ${["Makan","Ngopi","Nonton","Keliling","Jalan-jalan","Ngobrol aja"].map(x=>`<button class="activity ${state.activities.includes(x)?"selected":""}" data-activity="${x}">${x}</button>`).join("")}</div>`;
 if(step===4) content=`<div class="field dark"><label>Kamu pengin ke mana?</label><p class="small">Ada tempat yang lagi kamu pengin datengin?</p><textarea id="place" placeholder="Tulis tempat yang kamu mau...">${escapeHTML(state.place)}</textarea><p class="small">Kalau nggak ada juga gapapa. Biar aku yang mikirin.</p></div>`;
 if(step===5) content=`<label>Sebelum kita pergi...</label><p class="small">Ada request kecil dari kamu?</p><div class="grid">
 ${["Mau makan sesuatu","Mau dibawain sesuatu","Mau tempat yang tenang","Mau tempat yang rame","Jangan terlalu banyak jalan","Aku ikut aja"].map(x=>`<button class="choice ${state.request===x?"selected":""}" data-request="${x}">${x}</button>`).join("")}
 <button class="choice ${state.request==="custom"?"selected":""}" data-request="custom">Ada request lain</button></div>
 ${state.request==="custom"?`<div class="field dark"><textarea id="customRequest" placeholder="Tulis request kamu...">${escapeHTML(state.customRequest||"")}</textarea></div>`:""}`;
 const nextText=step===5?"Lanjut ke surat":"Lanjut";
 setScreen(`<section class="screen"><div class="card">
  <div class="eyebrow">let's plan our day</div><div class="counter">Bagian ${step} dari 5</div><div class="progress"><span style="width:${step*20}%"></span></div>
  ${content}
  <div class="actions">${btn(nextText,`yesNext${step}`,"btn gold")}</div>
 </div></section>`, quiet);
}

const PEN_SVG = `<svg class="pen" viewBox="0 0 44 44" aria-hidden="true">
 <path d="M2 42 L5 30 L14 39 Z" fill="#2b1b24"/>
 <path d="M5 30 L14 39 L19 34 L10 25 Z" fill="#c8a66a"/>
 <path d="M10 25 L19 34 L41 12 L32 3 Z" fill="#a95b78"/>
 <path d="M32 3 L41 12 L43 8 Q44 4 40 2 Q36 0 34 1 Z" fill="#5b243d"/>
</svg>`;
function sigMarkup(done){
 return `<div class="sig-wrap ${done?"done":""}" id="sigWrap">
   <div class="signature" id="sigText">Salsabilla</div>
   <svg class="sig-line" viewBox="0 0 300 30" aria-hidden="true"><path id="sigPath" d="M6 16 C 60 2, 110 30, 170 14 S 262 4, 294 15"/></svg>
   ${PEN_SVG}
  </div><div class="stamp ${done?"show":""}" id="stamp">SAH ♡</div>`;
}
function signedActions(){
 return `<p>✓ Sah! Perjanjian sudah ditandatangani oleh Salsabilla.</p>${btn("Jadi sekarang nggak bisa pura-pura lupa ya wkwk. Lanjut","final","btn gold")}`;
}
function burst(el, n=16){
 if(REDUCED||!el)return;
 const r=el.getBoundingClientRect(), cx=r.left+r.width/2, cy=r.top+r.height/2;
 const icons=["💗","🌸","💕","🌷","✿"];
 for(let i=0;i<n;i++){
  const s=document.createElement("span");s.className="spark";s.textContent=icons[i%icons.length];
  const ang=Math.random()*Math.PI*2, dist=70+Math.random()*120;
  s.style.left=cx+"px";s.style.top=cy+"px";
  s.style.setProperty("--dx",Math.cos(ang)*dist+"px");
  s.style.setProperty("--dy",(Math.sin(ang)*dist-40)+"px");
  s.style.setProperty("--r",(Math.random()*240-120)+"deg");
  document.body.appendChild(s);setTimeout(()=>s.remove(),1100);
 }
}
function playSignature(){
 const box=document.getElementById("signatureBox"), actions=document.getElementById("signActions");
 if(!box||box.dataset.busy)return;
 box.dataset.busy="1";
 box.innerHTML=sigMarkup(false);
 actions.innerHTML=`<p class="signing">Bentar, lagi ditandatangani...</p>`;
 const wrap=document.getElementById("sigWrap"), text=document.getElementById("sigText"),
       path=document.getElementById("sigPath"), pen=wrap.querySelector(".pen"), stamp=document.getElementById("stamp");
 const len=path.getTotalLength?path.getTotalLength():320;
 path.style.strokeDasharray=len;path.style.strokeDashoffset=len;
 const place=(x,y,rot)=>{pen.style.transform=`translate(${x-2}px,${y-42}px) rotate(${rot}deg)`};
 const finish=()=>{
  text.style.clipPath="";path.style.strokeDashoffset=0;
  pen.style.opacity=0;
  wrap.classList.add("done");stamp.classList.add("show");
  state.signature=true;delete box.dataset.busy;
  actions.innerHTML=signedActions();
  burst(box,22);
 };
 if(REDUCED)return finish();
 const T1=1900, T2=650, t0=performance.now();
 pen.style.opacity=1;
 function frame(now){
  const t=now-t0;
  if(t<T1){ // pulpen menulis nama
   const p=t/T1, wob=Math.sin(p*28);
   text.style.clipPath=`inset(-20% ${(1-p)*100}% -20% -5%)`;
   place(text.offsetLeft+p*text.offsetWidth, text.offsetTop+text.offsetHeight*(.55+wob*.16), wob*7);
  }else if(t<T1+T2){ // garis bawah
   text.style.clipPath="none";
   const q=(t-T1)/T2, svg=path.ownerSVGElement, sr=svg.getBoundingClientRect(), wr=wrap.getBoundingClientRect();
   const pt=path.getPointAtLength(q*len), s=sr.width/300;
   path.style.strokeDashoffset=len*(1-q);
   place(sr.left-wr.left+pt.x*s, sr.top-wr.top+pt.y*s, -4);
  }else return finish();
  requestAnimationFrame(frame);
 }
 requestAnimationFrame(frame);
}

function renderAgreement(){
 musicCue("agreement");
 setScreen(`<section class="screen"><div class="paper">
  <div class="eyebrow" style="color:#a95b78">terakhir, sah-sahan dulu</div>
  <h2>Tanda Tangan Perjanjian</h2>
  <div class="line"></div>
  <h3 style="font-family:'Cormorant Garamond',serif;font-size:1.8rem">SURAT PERJANJIAN JALAN-JALAN</h3>
  <p>Dengan ini, <strong>Salsabilla</strong> menyatakan bahwa saya bersedia pergi jalan-jalan bersama <strong>Achmad Raihan Afif</strong> pada waktu yang sudah disepakati bersama.</p>
  <p>Walaupun awalnya agak terpaksa...</p>
  <p>Tapi yaudah lah.</p>
  <p>Lumayan juga, soalnya ternyata aku agak kangen sama orangnya.</p>
  <p><strong>Dengan catatan:</strong><br>kalau nanti ternyata seru, mungkin aku nggak akan nolak kalau diajak lagi.</p>
  <p>Kalau nanti malah bingung mau ngobrol apa...</p>
  <p>yaudah, cari makanan aja. Biasanya kalau lagi makan nggak terlalu awkward.</p>
  <p>Dan kalau ternyata hari itu seru banget...</p>
  <p>yaudah, jangan seneng dulu.</p>
  <p>Surat ini dibuat dengan sadar, tanpa paksaan, dan setelah melewati proses memilih “Mau”.</p>
  <div class="center"><strong>Tertanda,</strong></div>
  <div class="signature-box" id="signatureBox">${state.signature?sigMarkup(true):`<span class="sig-placeholder">tanda tangan di sini ya ✍️</span>`}</div>
  <div class="actions" id="signActions">${state.signature?signedActions():btn("✍️ Tanda Tangani","sign","btn gold")}</div>
 </div></section>`);
}

function renderFinal(){
 musicCue("final");
 setScreen(`<section class="screen"><div class="card center">
  <div class="decor flower" style="left:5%;top:8%">✿</div><div class="decor teddy" style="right:4%;bottom:5%">🧸</div>
  <div class="eyebrow">the end</div><h2>Semua sudah selesai.</h2>
  <p>Makasih ya udah sampai di bagian paling akhir.</p>
  <p>Sekarang tinggal kirim jawabannya ke aku.</p>
  <div class="actions">${btn("KIRIM JAWABAN","sendWhatsApp","btn gold")}</div>
 </div></section>`);
}

function todayISO(){const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`}
function formatDate(iso){
 if(!iso)return "-";
 const d=new Date(iso+"T00:00:00");
 return isNaN(d)?iso:d.toLocaleDateString("id-ID",{weekday:"long",day:"numeric",month:"long",year:"numeric"});
}
function photoLine(){
 if(state.photoDecision==="keep")return "Soal foto: dibiarin aja.\n\n";
 if(state.photoDecision==="delete")return `Soal foto: menurutku dihapus aja.\nAlasannya: ${state.deleteReason||"-"}\n\n`;
 return "";
}
function buildWhatsAppMessage(){
 if(state.mainChoice==="mau"){
   const req = state.request==="custom" ? (state.customRequest||"") : state.request;
   return `Hai, aku udah selesai lihat semuanya.

${photoLine()}Aku pilih MAU buat jalan sama kamu.

Tanggal: ${formatDate(state.date)}
Waktu: ${state.time||"-"}
Mau ngapain: ${state.activities.join(", ")||"-"}
Tempat: ${state.place||"-"}
Request: ${req||"-"}

Oh iya, surat perjanjiannya juga udah aku tanda tangan wkwk.

Sekarang tinggal kamu yang atur sisanya.`;
 }
 return `Hai, aku udah selesai lihat semuanya.

${photoLine()}Aku pilih NGGAK MAU buat jalan.

Alasanku:
${state.noReason||"-"}

Aku udah jawab sejujurnya ya.

Makasih udah bikin ini sampai segininya.`;
}

function sendWhatsApp(){
 if(CONFIG.whatsappNumber.includes("X")) return toast("Isi nomor WhatsApp di js/script.js dulu ya.");
 const url=`https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(buildWhatsAppMessage())}`;
 window.location.href=url;
}

function handleClick(e){
 const el=e.target.closest("[data-action]");
 if(!el)return;
 const action=el.dataset.action;
 if(action==="openMailbox")openMailbox();
 else if(action==="memoryIntro")renderMemoryIntro();
 else if(action==="skipMemoryIntro")leaveMemoryIntro();
 else if(action==="nextPhoto"){state.photoIndex++;renderPhotos();}
 else if(action==="photoQuestion")renderPhotoQuestion();
 else if(action==="deletePhotos")renderDeleteReason();
 else if(action==="keepPhotos"){state.photoDecision="keep";renderKeep();}
 else if(action==="submitDeleteReason"){const v=document.getElementById("deleteReason").value.trim();if(v.length<3){document.getElementById("deleteReason").focus();return toast("Alasannya ditulis dulu ya, baru bisa lanjut.");}state.deleteReason=v;state.photoDecision="delete";renderDeleteThanks();}
 else if(action==="letter")renderLetter();
 else if(action==="offer")renderOffer();
 else if(action==="chooseYes"){burst(el,20);state.mainChoice="mau";renderYesForm(1);}
 else if(action==="chooseNo"){state.mainChoice="tidak";state.noCount=0;renderNo();}
 else if(action==="noAgain"){state.noCount++;renderNo();}
 else if(action==="submitNoReason"){const v=document.getElementById("noReason").value.trim();if(v.length<3){document.getElementById("noReason").focus();return toast("Alasannya ditulis dulu ya, baru bisa dikirim.");}state.noReason=v;renderFinal();}
 else if(action==="yesNext1"){state.date=document.getElementById("date").value;if(!state.date)return toast("Pilih tanggal dulu ya.");if(!timeOptions().includes(state.time))state.time="";renderYesForm(2);}
 else if(action==="yesNext2"){if(!state.time)return toast("Pilih waktunya dulu ya.");renderYesForm(3);}
 else if(action==="yesNext3"){if(!state.activities.length)return toast("Pilih minimal satu kegiatan ya.");renderYesForm(4);}
 else if(action==="yesNext4"){state.place=document.getElementById("place").value.trim();renderYesForm(5);}
 else if(action==="yesNext5"){if(state.request==="custom")state.customRequest=document.getElementById("customRequest")?.value.trim()||"";renderAgreement();}
 else if(action==="sign")playSignature();
 else if(action==="final")renderFinal();
 else if(action==="sendWhatsApp")sendWhatsApp();
}

document.addEventListener("click",e=>{
 const t=e.target.closest("[data-time],[data-activity],[data-request]");
 if(!t)return;
 if(t.matches("[data-time]")){state.time=t.dataset.time;renderYesForm(2,true)}
 if(t.matches("[data-activity]")){const v=t.dataset.activity;state.activities=state.activities.includes(v)?state.activities.filter(x=>x!==v):[...state.activities,v];renderYesForm(3,true)}
 if(t.matches("[data-request]")){const c=document.getElementById("customRequest");if(c)state.customRequest=c.value;state.request=t.dataset.request;renderYesForm(5,true)}
});

document.addEventListener("click",handleClick);

document.addEventListener("change",e=>{
 if(e.target.id==="date"){const h=document.getElementById("dayHint");if(h)h.textContent=dayHint(e.target.value);}
});

const FLOWER_COLORS=["#f7c6d4","#eea3bb","#fde6ec","#dca4b8","#fff3e8","#f2b8c6","#e58fab"];
function flowerSVG(){
 const c=FLOWER_COLORS[Math.floor(Math.random()*FLOWER_COLORS.length)], r=Math.random();
 if(r<.45){ // sakura 5 kelopak
  return `<svg viewBox="-20 -20 40 40">${[0,72,144,216,288].map(a=>`<path transform="rotate(${a})" d="M0 -2 C -8 -8,-7 -17,-2 -18 L0 -15.5 L2 -18 C 7 -17,8 -8,0 -2Z" fill="${c}" fill-opacity=".93"/>`).join("")}<circle r="3" fill="#e9c98b"/><circle r="1.3" fill="#c8964f"/></svg>`;
 }
 if(r<.7){ // bunga kecil 6 kelopak
  return `<svg viewBox="-20 -20 40 40">${[0,60,120,180,240,300].map(a=>`<ellipse transform="rotate(${a})" cx="0" cy="-10" rx="4.6" ry="8.5" fill="${c}" fill-opacity=".92"/>`).join("")}<circle r="4" fill="#f0d49a"/></svg>`;
 }
 // kelopak lepas
 return `<svg viewBox="-20 -20 40 40"><path d="M0 -15 C 10 -8,9 8,0 15 C -7 7,-9 -7,0 -15Z" fill="${c}" fill-opacity=".9"/></svg>`;
}
function spawnFlower(prefill=false){
 const box=document.getElementById("petals");
 if(!box||box.childElementCount>70)return;
 const p=document.createElement("span");p.className="petal";
 const size=14+Math.random()*24, dur=9+Math.random()*8;
 p.style.left=(Math.random()*104-2)+"%";
 p.style.width=p.style.height=size+"px";
 p.style.opacity=(.5+Math.random()*.5).toFixed(2);
 p.style.animationDuration=dur+"s";
 if(prefill)p.style.animationDelay=(-Math.random()*dur)+"s";
 p.innerHTML=`<span class="sway" style="animation-duration:${(2.2+Math.random()*2.6).toFixed(2)}s">${flowerSVG()}</span>`;
 p.firstChild.firstChild.style.animationDuration=(5+Math.random()*9).toFixed(1)+"s";
 if(Math.random()<.5)p.firstChild.firstChild.style.animationDirection="reverse";
 p.addEventListener("animationend",e=>{if(e.target===p)p.remove()});
 box.appendChild(p);
}
function petals(){
 if(REDUCED)return;
 for(let i=0;i<28;i++)spawnFlower(true);
 setInterval(()=>{if(!document.hidden)spawnFlower()},330);
}
// ---------- Lagu latar ----------
// Tiap lagu punya layar mulainya sendiri (CONFIG.music.tracks). Saat layar itu terbuka,
// lagu sebelumnya memudar dan lagu baru masuk pelan-pelan.
// Ketukan pertama Salsa dipakai untuk "membuka izin" audio secara senyap, supaya lagu boleh
// bunyi sendiri di layar berikutnya tanpa perlu ketukan lagi.
let musicCue=()=>{};
const musicState={current:-1, audios:[]};
function setupMusic(){
 const cfg=CONFIG.music;
 const tracks=((cfg&&cfg.tracks)||[]).filter(t=>t&&t.src);
 if(!tracks.length)return;
 const target=Math.min(1,Math.max(0,cfg.volume??0.45));
 const GESTURES=["pointerup","touchend","keydown","click"];
 const on=(fn)=>GESTURES.forEach(g=>document.addEventListener(g,fn,true));
 const off=(fn)=>GESTURES.forEach(g=>document.removeEventListener(g,fn,true));
 const toSec=v=>{if(typeof v==="number")return v;if(!v)return 0;return String(v).split(":").reduce((s,x)=>s*60+(parseFloat(x)||0),0)};
 const seek=(a,t)=>{const go=()=>{try{a.currentTime=t}catch(_){}};if(a.readyState>=1)go();else a.addEventListener("loadedmetadata",go,{once:true})};
 let switchTo=()=>{};
 const audios=tracks.map((t,i)=>{
  const a=new Audio(t.src);a.from=toSec(t.from);a.preload="auto";
  const chained=!!(tracks[i+1]&&tracks[i+1].startAt==="after"); // ada lagu lanjutan setelah lagu ini habis
  a.loop=!a.from&&!chained;
  a.addEventListener("ended",()=>{
   if(a!==audios[musicState.current])return;
   if(chained&&!audios[i+1].broken)return switchTo(i+1);
   seek(a,a.from);a.play().catch(()=>{}); // tidak ada lanjutan: ulang dari titik "from"
  });
  a.addEventListener("error",()=>{a.broken=true});
  return a;
 });
 musicState.audios=audios;
 const b=document.createElement("button");
 b.className="music-btn";b.type="button";b.hidden=true;
 let userMuted=false;
 const cur=()=>audios[musicState.current];
 const paint=()=>{const a=cur(), playing=a&&!a.paused;b.textContent=playing?"🎵":"🔇";b.setAttribute("aria-label",playing?"Matikan lagu":"Nyalakan lagu");b.classList.toggle("playing",!!playing)};
 const ramp=(a,to,done)=>{clearInterval(a.fade);const step=target/25;a.fade=setInterval(()=>{
   const v=to>a.volume?Math.min(to,a.volume+step):Math.max(to,a.volume-step);a.volume=v;
   if(v===to){clearInterval(a.fade);done&&done()}},80)};
 const play=(a)=>{a.volume=0;return a.play().then(()=>{ramp(a,target);paint()}).catch(()=>{
   paint(); // masih diblokir browser: mulai di sentuhan berikutnya
   const retry=e=>{if(e.target===b)return;off(retry);if(a===cur()&&!userMuted&&a.paused)play(a)};
   on(retry);
 })};
 const unlock=()=>{
  off(unlock);
  audios.forEach(a=>{
   if(a===cur()||a.broken)return;
   a.muted=true;
   a.play().then(()=>{if(a!==cur()){a.pause();a.currentTime=0}a.muted=false}).catch(()=>{a.muted=false});
  });
 };
 on(unlock);
 switchTo=(i)=>{
  if(i<0||i===musicState.current||!audios[i]||audios[i].broken)return;
  const prev=cur(), next=audios[i];
  musicState.current=i;
  if(prev)ramp(prev,0,()=>prev.pause());
  next.muted=false;
  seek(next,next.from);
  b.hidden=false;
  if(userMuted)paint();else play(next);
 };
 musicCue=(name)=>{if(name!=="after")switchTo(tracks.findIndex(t=>t.startAt===name))};
 b.addEventListener("click",e=>{e.stopPropagation();const a=cur();if(!a)return;if(a.paused){userMuted=false;play(a)}else{userMuted=true;clearInterval(a.fade);a.pause();paint()}});
 document.addEventListener("visibilitychange",()=>{const a=cur();if(!a)return;if(document.hidden){clearInterval(a.fade);a.pause();paint()}else if(!userMuted)play(a)});
 document.body.appendChild(b);
}
setupMusic();
petals();
renderMailbox();

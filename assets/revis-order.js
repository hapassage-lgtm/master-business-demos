const configs={
designed:{sizes:[["קוטר 10 ס״מ",180],["קוטר 14 ס״מ",220],["קוטר 16 ס״מ",300],["קוטר 18 ס״מ",380]],flavors:["וניל","שוקולד"],fill:true},
garden:{sizes:[["A4",180],["A3",230]],flavors:["שוקולד"],fill:false},
bouquet:{sizes:[["7 יחידות",200],["12 יחידות",320]],flavors:["וניל","וניל עם שוקולד צ׳יפס","שוקולד"],fill:false}
};
let currentType="designed";
function goOrder(){document.getElementById("order").scrollIntoView({behavior:"smooth"})}
function setType(type,scroll=true){
 currentType=type;
 ["Designed","Garden","Bouquet"].forEach(function(x){document.getElementById("tab"+x).classList.remove("active")});
 document.getElementById("tab"+type.charAt(0).toUpperCase()+type.slice(1)).classList.add("active");
 const c=configs[type],s=document.getElementById("size"),f=document.getElementById("flavor");
 s.innerHTML=c.sizes.map(function(x,i){return '<option value="'+i+'">'+x[0]+"</option>"}).join("");
 f.innerHTML=c.flavors.map(function(x){return "<option>"+x+"</option>"}).join("");
 document.getElementById("fillWrap").style.display=c.fill?"grid":"none";
 updateBuilder();
 if(scroll)goOrder();
}
function updateBuilder(){const c=configs[currentType],idx=Number(document.getElementById("size").value||0);document.getElementById("estimate").textContent="₪"+c.sizes[idx][1]}
function chooseInspiration(text){document.getElementById("inspiration").value=text;goOrder();toast("הסגנון נוסף לבקשה ✓")}
function filterGallery(cat,btn){
 document.querySelectorAll(".filter").forEach(function(b){b.classList.remove("active")});btn.classList.add("active");
 document.querySelectorAll(".gallery-card").forEach(function(card){card.style.display=(cat==="all"||card.dataset.cat.indexOf(cat)>-1)?"block":"none"})
}
function typeLabel(){return currentType==="designed"?"עוגה מעוצבת":currentType==="garden"?"עוגת גן":"זר קאפקייקס"}
function makeSummary(){
 const c=configs[currentType],idx=Number(document.getElementById("size").value||0),lines=[];
 lines.push("היי ריווי, אשמח לבדוק אפשרות להזמנה 🌸","");
 lines.push("מוצר: "+typeLabel());
 lines.push("גודל / כמות: "+c.sizes[idx][0]);
 lines.push("מחיר בסיס באתר: ₪"+c.sizes[idx][1]);
 lines.push("טעם: "+document.getElementById("flavor").value);
 if(c.fill)lines.push("מילוי: "+document.getElementById("filling").value);
 [["colors","צבעים / סגנון"],["date","תאריך מבוקש"],["writing","כיתוב"],["inspiration","השראה"],["notes","דגשים"]].forEach(function(m){
   const v=document.getElementById(m[0]).value.trim();if(v)lines.push(m[1]+": "+v)
 });
 lines.push("","מבינה שהמחיר הסופי, העיצוב והתאריך כפופים לאישור.");
 return lines.join("\n");
}
function openSummary(){document.getElementById("summaryText").textContent=makeSummary();document.getElementById("summaryModal").classList.add("open");document.body.style.overflow="hidden"}
function closeSummary(){document.getElementById("summaryModal").classList.remove("open");document.body.style.overflow=""}
async function copySummary(){try{await navigator.clipboard.writeText(makeSummary());toast("הסיכום הועתק ✓");closeSummary()}catch(e){toast("אפשר לסמן ולהעתיק את הסיכום ידנית")}}
function toast(t){const el=document.getElementById("toast");el.textContent=t;el.classList.add("show");setTimeout(function(){el.classList.remove("show")},2200)}
setType("designed",false);
const productQuickView={
 designed:{
  title:"עוגות מעוצבות",
  eyebrow:"עיצוב אישי",
  desc:"עוגה שנבנית סביב האירוע שלכם — בחירת קוטר, טעם, מילוי, צבעים, כיתוב וסגנון. המחיר הסופי משתנה לפי מורכבות העיצוב.",
  price:"החל מ־180 ₪",
  image:"https://lh3.googleusercontent.com/d/1BX8EkgQQwkYAt7Ir59D0GXvduZlIERQe=w1400"
 },
 garden:{
  title:"עוגות גן",
  eyebrow:"A4 / A3",
  desc:"עוגת שוקולד עם גנאש, דף סוכר מעוצב וזילופי קרם בהתאם לעיצוב. מתאימה במיוחד לחגיגות גן ואירועים עם הרבה ילדים.",
  price:"180–230 ₪",
  image:"https://lh3.googleusercontent.com/d/10VCCh67FxrquxXd9_bh8dv4_rjLXurX9=w1400"
 },
 bouquet:{
  title:"זרי קאפקייקס",
  eyebrow:"7 / 12 יחידות",
  desc:"זר אכיל שנראה כמו מתנה — זילופי פרחים בעבודת יד, עם בחירת צבעים וטעמים מתוך האפשרויות של ריווי.",
  price:"החל מ־200 ₪",
  image:"https://lh3.googleusercontent.com/d/18n5sCn1CjJr31IhRF0qoedd_DLRRSt6C=w1400"
 }
};
function openProduct(type){
 const p=productQuickView[type]; if(!p)return;
 document.getElementById("productModalTitle").textContent=p.title;
 document.getElementById("productModalEyebrow").textContent=p.eyebrow;
 document.getElementById("productModalDesc").textContent=p.desc;
 document.getElementById("productModalPrice").textContent=p.price;
 const img=document.getElementById("productModalImage"); img.src=p.image; img.alt=p.title;
 const btn=document.getElementById("productModalOrder");
 btn.onclick=function(){closeProduct();setType(type)};
 document.getElementById("productModal").classList.add("open");
 document.body.style.overflow="hidden";
}
function closeProduct(){
 document.getElementById("productModal").classList.remove("open");
 if(!document.getElementById("summaryModal").classList.contains("open")) document.body.style.overflow="";
}
document.addEventListener("keydown",function(e){
 if(e.key==="Escape"){closeProduct();closeSummary()}
 if((e.key==="Enter"||e.key===" ") && document.activeElement && document.activeElement.classList.contains("featured-card")){
   e.preventDefault(); document.activeElement.click();
 }
});

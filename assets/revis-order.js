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
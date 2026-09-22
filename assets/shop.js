const DEMO_KEY='master_demo_orders_v3';
function money(n){return new Intl.NumberFormat('he-IL',{style:'currency',currency:'ILS',maximumFractionDigits:0}).format(Number(n)||0)}
function brandKey(){return document.body.dataset.brand||'demo'}
function cartKey(){return 'cart_'+brandKey()}
function getCart(){try{return JSON.parse(localStorage.getItem(cartKey())||'[]')}catch{return[]}}
function saveCart(c){localStorage.setItem(cartKey(),JSON.stringify(c));renderCart()}
function addToCart(name,price,img=''){let c=getCart();const e=c.find(x=>x.name===name);if(e)e.qty++;else c.push({name,price:Number(price),qty:1,img});saveCart(c);toast(name+' נוסף לסל');openCart()}
function changeQty(name,d){let c=getCart().map(x=>x.name===name?{...x,qty:x.qty+d}:x).filter(x=>x.qty>0);saveCart(c)}
function openCart(){document.getElementById('cartDrawer')?.classList.add('open');renderCart()}
function closeCart(){document.getElementById('cartDrawer')?.classList.remove('open')}
function cartSubtotal(){return getCart().reduce((s,i)=>s+i.price*i.qty,0)}
function shippingFee(){const mode=document.getElementById('shipMode')?.value||'delivery';if(mode==='pickup')return 0;return cartSubtotal()>=250?0:25}
function couponDiscount(){const code=(document.getElementById('couponCode')?.value||'').trim().toUpperCase();return code==='DEMO10'?Math.round(cartSubtotal()*0.1):0}
function ensureExtras(){
 const list=document.getElementById('cartLines'); if(!list||document.getElementById('cartExtras')) return;
 const box=document.createElement('div'); box.id='cartExtras'; box.innerHTML='<div style="margin-top:14px"><label><b>אופן קבלה</b></label><select id="shipMode" class="field" onchange="renderCart()"><option value="delivery">משלוח</option><option value="pickup">איסוף עצמי</option></select></div><div style="margin-top:10px"><label><b>קופון דמו</b></label><div style="display:flex;gap:8px"><input id="couponCode" class="field" placeholder="נסו DEMO10"><button class="btn soft" onclick="renderCart()">החל</button></div><small style="color:#64748b">קופון DEMO10 נותן 10% הנחה לצורך ההדגמה.</small></div><div id="cartBreakdown" style="margin-top:12px"></div>';
 list.after(box);
}
function renderCart(){
 const c=getCart(),list=document.getElementById('cartLines'),count=document.querySelectorAll('[data-cart-count]');
 count.forEach(x=>x.textContent=c.reduce((s,i)=>s+i.qty,0));
 if(!list)return;
 list.innerHTML=c.length?c.map(x=>'<div class="cart-line"><div><b>'+x.name+'</b><div><button class="tab" onclick="changeQty(\''+x.name.replaceAll("'","&#39;")+'\',-1)">−</button> '+x.qty+' <button class="tab" onclick="changeQty(\''+x.name.replaceAll("'","&#39;")+'\',1)">+</button></div></div><b>'+money(x.price*x.qty)+'</b></div>').join(''):'<p>הסל עדיין ריק.</p>';
 ensureExtras();
 const sub=cartSubtotal(),discount=couponDiscount(),ship=shippingFee(),total=Math.max(0,sub-discount)+ship;
 const t=document.getElementById('cartTotal');if(t)t.textContent=money(total);
 const b=document.getElementById('cartBreakdown');if(b)b.innerHTML='<div class="cart-line"><span>סכום ביניים</span><b>'+money(sub)+'</b></div><div class="cart-line"><span>הנחה</span><b>'+(discount?'-'+money(discount):money(0))+'</b></div><div class="cart-line"><span>משלוח</span><b>'+(ship?money(ship):'חינם')+'</b></div><div class="cart-line"><span><b>סה״כ להזמנת דמו</b></span><b>'+money(total)+'</b></div>';
}
function checkoutDemo(){
 const c=getCart();if(!c.length){alert('הסל ריק');return}
 const name=document.getElementById('coName')?.value.trim(),phone=document.getElementById('coPhone')?.value.trim();
 if(!name||!phone){alert('יש למלא שם וטלפון');return}
 const mode=document.getElementById('shipMode')?.value||'delivery',sub=cartSubtotal(),discount=couponDiscount(),ship=shippingFee(),total=Math.max(0,sub-discount)+ship;
 const id=brandKey().toUpperCase().slice(0,3)+'-'+String(Date.now()).slice(-6);
 const orders=JSON.parse(localStorage.getItem(DEMO_KEY)||'[]');
 orders.push({id,brand:brandKey(),name,phone,items:c,subtotal:sub,discount,shipping:ship,total,delivery_mode:mode,created:Date.now(),step:1});
 localStorage.setItem(DEMO_KEY,JSON.stringify(orders));localStorage.removeItem(cartKey());location.href='tracking.html?order='+encodeURIComponent(id)+'&brand='+encodeURIComponent(brandKey())
}
function trackingOrder(id){const a=JSON.parse(localStorage.getItem(DEMO_KEY)||'[]');return a.find(x=>x.id===id)}
function demoTrackNext(id){const a=JSON.parse(localStorage.getItem(DEMO_KEY)||'[]'),o=a.find(x=>x.id===id);if(o){o.step=Math.min(4,(o.step||1)+1);localStorage.setItem(DEMO_KEY,JSON.stringify(a));location.reload()}}
function toast(text){let t=document.getElementById('demoToast');if(!t){t=document.createElement('div');t.id='demoToast';t.style='position:fixed;right:20px;bottom:80px;z-index:80;background:#0f172a;color:white;padding:12px 16px;border-radius:12px;box-shadow:0 10px 30px #0004;transition:.25s';document.body.appendChild(t)}t.textContent=text;t.style.opacity='1';clearTimeout(window.__toastTimer);window.__toastTimer=setTimeout(()=>t.style.opacity='0',1800)}
document.addEventListener('DOMContentLoaded',renderCart);
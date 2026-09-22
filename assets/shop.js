const DEMO_KEY='master_demo_orders_v2';
function money(n){return new Intl.NumberFormat('he-IL',{style:'currency',currency:'ILS',maximumFractionDigits:0}).format(Number(n)||0)}
function brandKey(){return document.body.dataset.brand||'demo'}
function cartKey(){return 'cart_'+brandKey()}
function getCart(){try{return JSON.parse(localStorage.getItem(cartKey())||'[]')}catch{return[]}}
function saveCart(c){localStorage.setItem(cartKey(),JSON.stringify(c));renderCart()}
function addToCart(name,price,img=''){let c=getCart();const e=c.find(x=>x.name===name);if(e)e.qty++;else c.push({name,price:Number(price),qty:1,img});saveCart(c);openCart()}
function changeQty(name,d){let c=getCart().map(x=>x.name===name?{...x,qty:x.qty+d}:x).filter(x=>x.qty>0);saveCart(c)}
function openCart(){document.getElementById('cartDrawer')?.classList.add('open');renderCart()}
function closeCart(){document.getElementById('cartDrawer')?.classList.remove('open')}
function renderCart(){const c=getCart(),list=document.getElementById('cartLines'),count=document.querySelectorAll('[data-cart-count]');count.forEach(x=>x.textContent=c.reduce((s,i)=>s+i.qty,0));if(!list)return;list.innerHTML=c.length?c.map(x=>'<div class="cart-line"><div><b>'+x.name+'</b><div><button class="tab" onclick="changeQty(\''+x.name+'\',-1)">−</button> '+x.qty+' <button class="tab" onclick="changeQty(\''+x.name+'\',1)">+</button></div></div><b>'+money(x.price*x.qty)+'</b></div>').join(''):'<p>הסל עדיין ריק.</p>';const total=c.reduce((s,i)=>s+i.price*i.qty,0);const t=document.getElementById('cartTotal');if(t)t.textContent=money(total)}
function checkoutDemo(){const c=getCart();if(!c.length){alert('הסל ריק');return}const name=document.getElementById('coName')?.value.trim(),phone=document.getElementById('coPhone')?.value.trim();if(!name||!phone){alert('יש למלא שם וטלפון');return}const id=brandKey().toUpperCase().slice(0,3)+'-'+String(Date.now()).slice(-6);const orders=JSON.parse(localStorage.getItem(DEMO_KEY)||'[]');orders.push({id,brand:brandKey(),name,phone,items:c,total:c.reduce((s,i)=>s+i.price*i.qty,0),created:Date.now(),step:1});localStorage.setItem(DEMO_KEY,JSON.stringify(orders));localStorage.removeItem(cartKey());location.href='tracking.html?order='+encodeURIComponent(id)+'&brand='+encodeURIComponent(brandKey())}
function trackingOrder(id){const a=JSON.parse(localStorage.getItem(DEMO_KEY)||'[]');return a.find(x=>x.id===id)}
function demoTrackNext(id){const a=JSON.parse(localStorage.getItem(DEMO_KEY)||'[]'),o=a.find(x=>x.id===id);if(o){o.step=Math.min(4,(o.step||1)+1);localStorage.setItem(DEMO_KEY,JSON.stringify(a));location.reload()}}
document.addEventListener('DOMContentLoaded',renderCart);
const whatsapp = "59898583117";
const cart = [];
const cartEl = document.querySelector('#cart');
const backdrop = document.querySelector('#backdrop');
const itemsEl = document.querySelector('#cartItems');
const totalEl = document.querySelector('#cartTotal');
const countEl = document.querySelector('#cartCount');
const sendButton = document.querySelector('#sendOrder');
const formatPrice = price => `$ ${price.toLocaleString('es-UY')}`;
function toggleCart(open) { cartEl.classList.toggle('open', open); backdrop.classList.toggle('open', open); cartEl.setAttribute('aria-hidden', String(!open)); }
function renderCart() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  countEl.textContent = count; totalEl.textContent = formatPrice(total); sendButton.disabled = !cart.length;
  if (!cart.length) { itemsEl.innerHTML = '<div class="empty-cart">Todavía no agregaste pizzas.<br /><button id="startOrder">Ver el menú</button></div>'; document.querySelector('#startOrder').onclick = () => { toggleCart(false); document.querySelector('#menu').scrollIntoView(); }; return; }
  itemsEl.innerHTML = cart.map((item, index) => `<div class="cart-row"><div><h3>${item.name}</h3><p>${formatPrice(item.price)} c/u</p><div class="qty"><button data-qty="-1" data-index="${index}">−</button><b>${item.quantity}</b><button data-qty="1" data-index="${index}">+</button></div></div><div><strong>${formatPrice(item.price * item.quantity)}</strong><button class="remove" data-remove="${index}">Quitar</button></div></div>`).join('');
  itemsEl.querySelectorAll('[data-qty]').forEach(button => button.onclick = () => { const index=Number(button.dataset.index); cart[index].quantity += Number(button.dataset.qty); if(cart[index].quantity<1)cart.splice(index,1); renderCart(); });
  itemsEl.querySelectorAll('[data-remove]').forEach(button => button.onclick = () => { cart.splice(Number(button.dataset.remove), 1); renderCart(); });
}
document.querySelectorAll('.add-button').forEach(button => button.onclick = () => { const name=button.dataset.name, price=Number(button.dataset.price), existing=cart.find(item=>item.name===name); if(existing)existing.quantity++;else cart.push({name,price,quantity:1});renderCart();toggleCart(true); });
document.querySelector('#cartButton').onclick=()=>toggleCart(true);
document.querySelector('#closeCart').onclick=()=>toggleCart(false);
backdrop.onclick=()=>toggleCart(false);
const direct=document.querySelector('#whatsappDirect');direct.href=`https://wa.me/${whatsapp}?text=${encodeURIComponent('Hola Venancio, quiero hacer un pedido.')}`;direct.target='_blank';
sendButton.onclick=()=>{const message=['Hola Venancio, quiero hacer este pedido:','',...cart.map(item=>`• ${item.quantity}x ${item.name} — ${formatPrice(item.price*item.quantity)}`),'',`Total: ${totalEl.textContent}`,'','¿Me confirman disponibilidad?'].join('\n');window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`,'_blank','noopener');};
document.querySelectorAll('.filter').forEach(button=>button.onclick=()=>{document.querySelectorAll('.filter').forEach(b=>b.classList.remove('active'));button.classList.add('active');const value=button.dataset.filter;document.querySelectorAll('.pizza-card').forEach(card=>card.hidden=value!=='all'&&card.dataset.category!==value);});
const navToggle=document.querySelector('#navToggle'),nav=document.querySelector('#nav');navToggle.onclick=()=>{const open=nav.classList.toggle('open');navToggle.setAttribute('aria-expanded',String(open));};nav.querySelectorAll('a').forEach(link=>link.onclick=()=>{nav.classList.remove('open');navToggle.setAttribute('aria-expanded','false');});
renderCart();
const demoOrders = [
  { id:'#0184', name:'Lucía Martínez', detail:'2× Prosciutto · 1× Margherita', type:'Delivery', state:'pending', label:'Nuevo', total:'$ 1.730' },
  { id:'#0183', name:'Juan Pérez', detail:'1× La Bianca · 1× Calabresa', type:'Retiro', state:'preparing', label:'En horno', total:'$ 1.170' },
  { id:'#0182', name:'María Costa', detail:'2× Margherita', type:'Delivery', state:'preparing', label:'En horno', total:'$ 980' },
  { id:'#0181', name:'Sofía Ramos', detail:'1× Prosciutto', type:'Retiro', state:'pending', label:'Nuevo', total:'$ 620' },
  { id:'#0180', name:'Tomás Pereira', detail:'1× Calabresa · 1× Margherita', type:'Delivery', state:'ready', label:'Listo', total:'$ 1.070' }
];
function renderDemoOrders(filter='all') {
  const visible = demoOrders.filter(order => filter === 'all' || order.state === filter);
  const preview = document.querySelector('#activeOrders');
  if (preview) preview.innerHTML = demoOrders.slice(0,3).map(order => `<div class="mini-order"><span>${order.id}</span><p><b>${order.name}</b><small>${order.detail}</small></p><span class="status ${order.state}">${order.label}</span></div>`).join('');
  const list = document.querySelector('#ordersList');
  if (list) list.innerHTML = visible.map((order, i) => `<div class="order-row"><b>${order.id}</b><span>${order.name}<small>Hace ${8 + i * 3} min</small></span><span>${order.detail}</span><span>${order.type}</span><select data-status="${order.id}"><option ${order.state === 'pending' ? 'selected' : ''}>Nuevo</option><option ${order.state === 'preparing' ? 'selected' : ''}>En horno</option><option ${order.state === 'ready' ? 'selected' : ''}>Listo</option></select><strong>${order.total}</strong></div>`).join('') || '<p style="padding:25px">No hay pedidos en esta etapa.</p>';
}
function openAdmin() { document.querySelector('#adminPanel').classList.add('open'); document.querySelector('#adminPanel').setAttribute('aria-hidden','false'); document.body.style.overflow='hidden'; renderDemoOrders(); }
function closeAdmin() { document.querySelector('#adminPanel').classList.remove('open'); document.querySelector('#adminPanel').setAttribute('aria-hidden','true'); document.body.style.overflow=''; }
document.querySelector('#openAdmin').onclick = openAdmin;
document.querySelector('#closeAdmin').onclick = closeAdmin;
document.querySelectorAll('[data-admin-view]').forEach(button => button.onclick = () => { const view=button.dataset.adminView; document.querySelectorAll('.admin-nav').forEach(item=>item.classList.toggle('active',item.dataset.adminView===view)); document.querySelectorAll('.admin-view').forEach(item=>item.classList.toggle('active',item.id===view)); document.querySelector('#adminTitle').textContent=view==='orders'?'Pedidos de esta noche.':view==='menu'?'Tu carta, al día.':view==='customers'?'Clientes que eligen volver.':'Buenas noches, Venancio.'; });
document.querySelectorAll('.order-filter').forEach(button => button.onclick = () => { document.querySelectorAll('.order-filter').forEach(item=>item.classList.remove('active')); button.classList.add('active'); renderDemoOrders(button.dataset.orderFilter); });
renderDemoOrders();

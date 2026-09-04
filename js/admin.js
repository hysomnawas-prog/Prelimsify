const SUPABASE_URL = "https://fzwsmvwvraruktyyiscr.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_E2ghL9KbeoQ-GghejXbrQw_ie0wrjH_";
const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
const $=id=>document.getElementById(id);
function status(msg,ok=false){$('adminStatus').textContent=msg||'';$('adminStatus').className='admin-status '+(ok?'admin-ok':'admin-error');}
function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
async function boot(){
  const {data:{session}}=await client.auth.getSession();
  if(!session){location.href='index.html';return;}
  const {data:me,error}=await client.from('profiles').select('id,username,role,can_use_app').eq('id',session.user.id).single();
  if(error){
    console.error('Admin profile lookup failed:', error);
    document.body.innerHTML='<main class="admin-page"><div class="admin-wrap"><h1>Could not verify admin access</h1><p style="color:#8c1d17">'+esc(error.message||String(error))+'</p><p class="admin-note">Details logged to the browser console too.</p><a class="btn" href="index.html">Back to app</a></div></main>';
    return;
  }
  if(me?.role!=='admin'){
    document.body.innerHTML='<main class="admin-page"><div class="admin-wrap"><h1>Access denied</h1><p>Only an administrator can open this page. (role on file: '+esc(me?.role||'none')+')</p><a class="btn" href="index.html">Back to app</a></div></main>';
    return;
  }
  $('adminIdentity').textContent=`Signed in as ${me.username||'admin'}`;
  await loadUsers();
}
async function loadUsers(){
  $('adminUsers').innerHTML='<tr><td colspan="5" class="admin-loading">Loading users…</td></tr>';
  const {data,error}=await client.from('profiles').select('id,username,role,can_use_app,created_at').order('created_at',{ascending:true});
  if(error){status(error.message);return;}
  $('adminUsers').innerHTML=(data||[]).map(u=>`<tr><td><strong>${esc(u.username||'—')}</strong></td><td>${esc(u.role)}</td><td>••••••••</td><td>${u.can_use_app?'Granted':'Revoked'}</td><td><button class="permission-btn ${u.can_use_app?'revoke':'grant'}" data-id="${esc(u.id)}" data-value="${u.can_use_app?'false':'true'}">${u.can_use_app?'Revoke':'Grant'}</button></td></tr>`).join('')||'<tr><td colspan="5">No users found.</td></tr>';
  document.querySelectorAll('.permission-btn').forEach(btn=>btn.addEventListener('click',async()=>{
    const id=btn.dataset.id, value=btn.dataset.value==='true';
    btn.disabled=true;
    const {error}=await client.from('profiles').update({can_use_app:value}).eq('id',id);
    btn.disabled=false;
    if(error){status(error.message);return;}
    status(`Permission ${value?'granted':'revoked'} successfully.`,true); await loadUsers();
  }));
}
$('adminLogout').addEventListener('click',async()=>{await client.auth.signOut();location.href='index.html';});
boot();

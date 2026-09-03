const SUPABASE_URL = "https://fzwsmvwvraruktyyiscr.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_E2ghL9KbeoQ-GghejXbrQw_ie0wrjH_";
const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
const $=id=>document.getElementById(id);
function status(msg,ok=false){$('adminStatus').textContent=msg||'';$('adminStatus').className='admin-status '+(ok?'admin-ok':'admin-error');}
function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
async function boot(){
  const {data:{session}}=await client.auth.getSession();
  if(!session){location.href='index.html';return;}

  // Use the security-definer admin RPC instead of selecting the profiles table
  // directly. This avoids recursive RLS policies blocking administrator access.
  const {data:me,error:meError}=await client.rpc('admin_get_me');
  if(meError || !me || me.length===0){
    document.body.innerHTML='<main class="admin-page"><div class="admin-wrap"><h1>Access denied</h1><p>Only an administrator can open this page.</p><a class="btn" href="index.html">Back to app</a></div></main>';
    return;
  }
  $('adminIdentity').textContent=`Signed in as ${me[0].username||'admin'}`;
  await loadUsers();
}
async function loadUsers(){
  $('adminUsers').innerHTML='<tr><td colspan="5" class="admin-loading">Loading users…</td></tr>';
  const {data,error}=await client.rpc('admin_list_users');
  if(error){status(error.message);return;}
  $('adminUsers').innerHTML=(data||[]).map(u=>`<tr><td><strong>${esc(u.username||'—')}</strong></td><td>${esc(u.role||'student')}</td><td>••••••••</td><td>${u.can_use_app?'Granted':'Revoked'}</td><td>${u.role==='admin' ? '<span class="admin-protected">Administrator</span>' : `<button class="permission-btn ${u.can_use_app?'revoke':'grant'}" data-id="${esc(u.id)}" data-value="${u.can_use_app?'false':'true'}">${u.can_use_app?'Revoke':'Grant'}</button>`}</td></tr>`).join('')||'<tr><td colspan="5">No users found.</td></tr>';
  document.querySelectorAll('.permission-btn').forEach(btn=>btn.addEventListener('click',async()=>{
    const id=btn.dataset.id, value=btn.dataset.value==='true';
    btn.disabled=true;
    const {error}=await client.rpc('admin_set_user_permission',{target_user_id:id,new_permission:value});
    btn.disabled=false;
    if(error){status(error.message);return;}
    status(`Permission ${value?'granted':'revoked'} successfully.`,true); await loadUsers();
  }));
}
$('adminLogout').addEventListener('click',async()=>{await client.auth.signOut();location.href='index.html';});
boot();

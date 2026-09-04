
const CATALOG = {"Astra Tech Implant EV": [["26301", "3.0", "S", "8"], ["26302", "3.0", "S", "9"], ["26303", "3.0", "S", "11"], ["26304", "3.0", "S", "13"], ["26305", "3.0", "S", "15"], ["26310", "3.6", "S", "6"], ["26311", "3.6", "S", "8"], ["26312", "3.6", "S", "9"], ["26313", "3.6", "S", "11"], ["26314", "3.6", "S", "13"], ["26315", "3.6", "S", "15"], ["26316", "3.6", "S", "17"], ["26320", "4.2", "M", "6"], ["26321", "4.2", "M", "8"], ["26322", "4.2", "M", "9"], ["26323", "4.2", "M", "11"], ["26324", "4.2", "M", "13"], ["26325", "4.2", "M", "15"], ["26326", "4.2", "M", "17"], ["26331", "4.2", "M", "8"], ["26332", "4.2", "M", "9"], ["26333", "4.2", "M", "11"], ["26334", "4.2", "M", "13"], ["26335", "4.2", "M", "15"], ["26336", "4.2", "M", "17"], ["26340", "4.8", "L", "6"], ["26341", "4.8", "L", "8"], ["26342", "4.8", "L", "9"], ["26343", "4.8", "L", "11"], ["26344", "4.8", "L", "13"], ["26345", "4.8", "L", "15"], ["26346", "4.8", "L", "17"], ["26351", "4.8", "L", "8"], ["26352", "4.8", "L", "9"], ["26353", "4.8", "L", "11"], ["26354", "4.8", "L", "13"], ["26355", "4.8", "L", "15"], ["26356", "4.8", "L", "17"], ["26360", "5.4", "XL", "6"], ["26361", "5.4", "XL", "8"], ["26362", "5.4", "XL", "9"], ["26363", "5.4", "XL", "11"], ["26364", "5.4", "XL", "13"], ["26365", "5.4", "XL", "15"]], "PrimeTaper EV": [["68011085", "3.0", "XS", "8"], ["68011086", "3.0", "XS", "9"], ["68011087", "3.0", "XS", "11"], ["68011088", "3.0", "XS", "13"], ["68011089", "3.0", "XS", "15"], ["68011090", "3.6", "S", "8"], ["68011091", "3.6", "S", "9"], ["68011092", "3.6", "S", "11"], ["68011093", "3.6", "S", "13"], ["68011094", "3.6", "S", "15"], ["68011095", "3.6", "S", "17"], ["68011096", "4.2", "M", "6.5"], ["68011097", "4.2", "M", "8"], ["68011098", "4.2", "M", "9"], ["68011099", "4.2", "M", "11"], ["68011100", "4.2", "M", "13"], ["68011101", "4.2", "M", "15"], ["68011102", "4.2", "M", "17"], ["68011103", "4.8", "L", "6.5"], ["68011104", "4.8", "L", "8"], ["68011105", "4.8", "L", "9"], ["68011106", "4.8", "L", "11"], ["68011107", "4.8", "L", "13"], ["68011108", "4.8", "L", "15"], ["68011109", "4.8", "L", "17"], ["68011110", "5.4", "L", "6.5"], ["68011111", "5.4", "L", "8"], ["68011112", "5.4", "L", "9"], ["68011113", "5.4", "L", "11"], ["68011114", "5.4", "L", "13"], ["68011115", "5.4", "L", "15"]], "Astra EV Profile": [["26371", "4.2", "PS", "8"], ["26372", "4.2", "PS", "9"], ["26373", "4.2", "PS", "11"], ["26374", "4.2", "PS", "13"], ["26375", "4.2", "PS", "15"], ["26376", "4.2", "PS", "17"], ["26381", "4.2", "PC", "8"], ["26382", "4.2", "PC", "9"], ["26383", "4.2", "PC", "11"], ["26384", "4.2", "PC", "13"], ["26385", "4.2", "PC", "15"], ["26386", "4.2", "PC", "17"]], "Heal Abutments": [], "HealDesign EV": [["68013005", "S", "Ø4.0 × 2.5 mm", ""], ["68013006", "S", "Ø4.0 × 3.5 mm", ""], ["68013007", "S", "Ø4.0 × 4.5 mm", ""], ["68013008", "S", "Ø4.0 × 6.5 mm", ""]]};
const IMAGES = [];
let activeTab = "Astra Tech EV";
let mode = "receive";
let inventory = JSON.parse(localStorage.getItem("implantInventory") || "null") || {
  "26344": [{lot:"482446",exp:"2026-11-25",qty:2,own:"Consignment",expected:2}],
  "68011099": [{lot:"546529",exp:"2031-05-19",qty:2,own:"Practice Owned",expected:0}],
  "68013007": [{lot:"546217",exp:"2031-05-08",qty:4,own:"Consignment",expected:6}]
};
let transactions = JSON.parse(localStorage.getItem("implantTransactions") || "[]");

function allItems(){
  let a=[]; for(const [group,rows] of Object.entries(CATALOG)) for(const r of rows) a.push({group,ref:r[0],size:r[1],kind:r[2],length:r[3]});
  return a;
}
function item(ref){ return allItems().find(x=>x.ref===String(ref)); }
function save(){localStorage.setItem("implantInventory",JSON.stringify(inventory));localStorage.setItem("implantTransactions",JSON.stringify(transactions));}
function daysTo(d){return Math.ceil((new Date(d+"T00:00:00")-new Date())/86400000)}
function status(lot){let d=daysTo(lot.exp); if(d<0)return ["Expired","bad"]; if(d<=548)return ["≤18 mo","warn"]; return ["OK","good"]}
function renderTabs(){
  const t=document.getElementById("tabs"); t.innerHTML="";
  for(const k of Object.keys(CATALOG)){
    const b=document.createElement("button");
    b.className="tab "+(k===activeTab?"active":"");
    b.textContent=k;
    b.onclick=()=>{activeTab=k;document.getElementById("sectionTitle").textContent=k+" — Product Master";render();};
    t.appendChild(b);
  }
}
function render(){
  renderTabs();
  const q=document.getElementById("search").value.toLowerCase();
  const own=document.getElementById("ownershipFilter").value;
  const rows=(CATALOG[activeTab]||[]).filter(r=>(r.join(" ").toLowerCase().includes(q)||activeTab.toLowerCase().includes(q)));
  const cards=document.getElementById("cards"); cards.innerHTML="";
  if(Object.keys(CATALOG).length===0){
    cards.innerHTML=`<div style="grid-column:1/-1;padding:35px;text-align:center;color:var(--muted)">
    <b>No products loaded yet.</b><br>Upload the official catalog images first, then the product master can be populated.</div>`;
    renderSummary(); renderTx(); return;
  }
  for(const r of rows){
    const ref=r[0], lots=inventory[ref]||[];
    const filteredLots=lots.filter(x=>own==="all"||x.own===own);
    const on=filteredLots.reduce((s,x)=>s+x.qty,0);
    const exp=filteredLots.filter(x=>x.own==="Consignment").reduce((s,x)=>s+x.expected,0);
    const d=on-exp;
    const div=document.createElement("div");div.className="product";
    div.innerHTML=`<span class="badge">${activeTab}</span>
      <div class="ref">REF ${ref}</div>
      <div class="meta">${r[1] ? "Size / connection: "+r[1] : ""} ${r[2] ? " • "+r[2] : ""} ${r[3] ? " • "+r[3]+" mm" : ""}</div>
      <div class="nums"><div class="num"><b>${on}</b>On hand</div><div class="num"><b>${exp}</b>Expected</div><div class="num"><b class="${d===0?'good':(d<0?'bad':'warn')}">${d>0?"+":""}${d}</b>Diff</div></div>
      <div class="meta">${lots.length?lots.map(x=>`Lot ${x.lot} · ${x.qty} · ${x.own} · <span class="${status(x)[1]}">${status(x)[0]}</span>`).join("<br>"):"No inventory recorded"}</div>
      <div class="actions"><button onclick="openReceive('${ref}')">Receive</button><button class="alt" onclick="openPull('${ref}')">Pull</button></div>`;
    cards.appendChild(div);
  }
  renderSummary(); renderTx();
}
function renderSummary(){
  let on=0,target=0,alert=0,diff=0;
  for(const lots of Object.values(inventory)) for(const x of lots){on+=x.qty;if(x.own==="Consignment"){target+=x.expected;diff+=x.qty-x.expected} if(daysTo(x.exp)<=548)alert+=x.qty;}
  document.getElementById("onHand").textContent=on;document.getElementById("consTarget").textContent=target;document.getElementById("diff").textContent=diff;document.getElementById("alerts").textContent=alert;
}
function renderTx(){
 const body=document.getElementById("tx");body.innerHTML="";
 transactions.slice().reverse().slice(0,20).forEach(t=>{const tr=document.createElement("tr");tr.innerHTML=`<td>${t.time}</td><td>${t.action}</td><td>${t.ref}</td><td>${t.lot||""}</td><td>${t.qty}</td><td>${t.own}</td>`;body.appendChild(tr)})
}
function previewCatalog(e){
 const box=document.getElementById("catalogPreview"); box.innerHTML="";
 [...e.target.files].forEach(f=>{
   const r=new FileReader();
   r.onload=()=>{
     const img=document.createElement("img");
     img.src=r.result;
     img.style="max-width:100%;max-height:180px;margin:5px;border-radius:8px";
     box.appendChild(img);
   };
   r.readAsDataURL(f);
 });
}
function parseGS1(s){
 let out={raw:s};
 const clean=s.replace(/\u001d/g,"");
 let m=clean.match(/\(01\)(\d{14})/); if(m)out.gtin=m[1];
 m=clean.match(/\(11\)(\d{6})/); if(m)out.mfg="20"+m[1].slice(0,2)+"-"+m[1].slice(2,4)+"-"+m[1].slice(4,6);
 m=clean.match(/\(17\)(\d{6})/); if(m)out.exp="20"+m[1].slice(0,2)+"-"+m[1].slice(2,4)+"-"+m[1].slice(4,6);
 m=clean.match(/\(10\)([A-Za-z0-9.-]+?)(?=\(01\)|\(11\)|\(17\)|$)/); if(m)out.lot=m[1];
 return out;
}
function scan(){
 const s=document.getElementById("scanInput").value.trim(); const p=parseGS1(s);
 let found=item(s) || item(p.ref) || null;
 // Known demo mappings from supplied package examples.
 if(!found && p.gtin){found = p.gtin==="07392532214431"?item("26344"):p.gtin==="07392532276729"?item("68011099"):null}
 const box=document.getElementById("scanResult");box.style.display="block";
 box.innerHTML=found?`<b>${found.group}</b><br>REF <b>${found.ref}</b> · ${found.size} ${found.kind||""} ${found.length?found.length+" mm":""}<br>Lot: ${p.lot||"not read"} · Exp: ${p.exp||"not read"}<div class="actions"><button onclick="openReceive('${found.ref}')">Receive this package</button><button class="alt" onclick="openPull('${found.ref}')">Pull this package</button></div>`:`<b>No catalog match yet.</b><br>Parsed: ${JSON.stringify(p)}<br>Add the REF to the product master or scan the package's GS1 code.`;
}
function updateSelectedProduct(){const ref=document.getElementById("mRef").value.trim();const it=item(ref);document.getElementById("selectedProductName").textContent=it?(it.group+" — Ø"+it.size+(it.length?" × "+it.length+" mm":"")):"Enter or select a REF";document.getElementById("selectedProductMeta").textContent=it?("REF "+it.ref+" · "+(it.kind||"Product")):"REF is the catalog identifier.";}
function setEntryMode(m){document.getElementById('scanChoice').classList.toggle('active',m==='scan');document.getElementById('findChoice').classList.toggle('active',m==='find');document.getElementById('scanHelp').style.display=m==='scan'?'block':'none';document.getElementById('findPanel').style.display=m==='find'?'block':'none';if(m==='find')renderFindResults();}
function renderFindResults(){const q=(document.getElementById('productSearch').value||'').toLowerCase().trim();const arr=allItems().filter(x=>!q||[x.group,x.ref,x.size,x.length,x.kind].join(' ').toLowerCase().includes(q)).slice(0,20);document.getElementById('findResults').innerHTML=arr.map(x=>`<div class="find-item" onclick="selectFindProduct('${x.ref}')"><b>${x.group}</b><br><span class="meta">Ø${x.size}${x.length?' × '+x.length+' mm':''} · REF ${x.ref}</span></div>`).join('')||'<div class="meta" style="padding:10px">No matching catalog product.</div>';}
function selectFindProduct(ref){document.getElementById('mRef').value=ref;updateSelectedProduct();setEntryMode('find');document.getElementById('mLot').focus();}
function openReceive(ref=""){mode="receive";document.getElementById("modalTitle").textContent="Receive Inventory";document.getElementById("saveAction").textContent="Receive into Inventory";document.getElementById("patientWrap").style.display="none";document.getElementById("mRef").value=ref;document.getElementById("mLot").value="";document.getElementById("mExp").value="";document.getElementById("mQty").value=1;document.getElementById("mOwn").value="Consignment";document.getElementById("mLocation").value="Implant Cabinet";setEntryMode(ref?'scan':'find');updateSelectedProduct();document.getElementById("modal").classList.add("show");}
function openPull(ref=""){mode="pull";document.getElementById("modalTitle").textContent="Use / Scan Out";document.getElementById("saveAction").textContent="Remove from Inventory";document.getElementById("patientWrap").style.display="block";document.getElementById("mRef").value=ref;document.getElementById("mLot").value="";document.getElementById("mExp").value="";document.getElementById("mQty").value=1;document.getElementById("mOwn").value="Consignment";document.getElementById("mLocation").value="Implant Cabinet";document.getElementById("mPatient").value="";setEntryMode(ref?'scan':'find');updateSelectedProduct();document.getElementById("modal").classList.add("show");}
function closeModal(){document.getElementById("modal").classList.remove("show")}
function saveModal(){
 const ref=document.getElementById("mRef").value.trim(),lot=document.getElementById("mLot").value.trim(),exp=document.getElementById("mExp").value,qty=+document.getElementById("mQty").value,own=document.getElementById("mOwn").value,expected=0;
 if(!item(ref)){updateSelectedProduct();alert("Please select a valid catalog product or enter a valid REF.");return}
 if(!lot||!qty){alert("Enter the lot number and quantity.");return}
 if(exp && !/^\d{4}-\d{2}-\d{2}$/.test(exp)){alert("Please enter a valid expiration date.");return}
 if(!inventory[ref])inventory[ref]=[];
 if(mode==="receive"){let x=inventory[ref].find(x=>x.lot===lot&&x.own===own);if(!x){x={lot,exp:exp||"2099-12-31",qty:0,own,expected:0};inventory[ref].push(x)}x.qty+=qty;}
 else {let remaining=qty; for(const x of inventory[ref]){if(lot && x.lot!==lot)continue;const take=Math.min(x.qty,remaining);x.qty-=take;remaining-=take;if(!remaining)break} if(remaining){alert("Not enough units on hand for that lot.");return}}
 transactions.push({time:new Date().toLocaleString(),action:mode==="receive"?"RECEIVE":"PULL",ref,lot,qty,own});
 save();closeModal();render();
}
function showTransactions(){document.querySelector(".section:nth-of-type(3)")?.scrollIntoView({behavior:"smooth"})}
document.getElementById("search").addEventListener("input",render);document.getElementById("ownershipFilter").addEventListener("change",render);
render();
  // V21 Cloud Sync setup — Supabase-compatible shared database
  const CLOUD_KEY='implantCloudConfigV1';
  function cloudConfig(){try{return JSON.parse(localStorage.getItem(CLOUD_KEY)||'{}')}catch(e){return {}}}
  function saveCloudConfig(c){localStorage.setItem(CLOUD_KEY,JSON.stringify(c))}
  function cloudTenantPolicySQL(){return `
drop policy if exists tenant_select on public.inventory_records; create policy tenant_select on public.inventory_records for select to authenticated using (public.is_practice_member(practice_id));
drop policy if exists tenant_insert on public.inventory_records; create policy tenant_insert on public.inventory_records for insert to authenticated with check (public.is_practice_member(practice_id));
drop policy if exists tenant_update on public.inventory_records; create policy tenant_update on public.inventory_records for update to authenticated using (public.is_practice_member(practice_id)) with check (public.is_practice_member(practice_id));
drop policy if exists tenant_delete on public.inventory_records; create policy tenant_delete on public.inventory_records for delete to authenticated using (public.is_practice_member(practice_id));

-- Repeat the same tenant boundary for transactions, cases, recalls, team and audit rows.

create policy if not exists tenant_select_tx on public.inventory_transactions for select to authenticated using (public.is_practice_member(practice_id));
create policy if not exists tenant_insert_tx on public.inventory_transactions for insert to authenticated with check (public.is_practice_member(practice_id));
create policy if not exists tenant_select_cases on public.implant_cases for select to authenticated using (public.is_practice_member(practice_id));
create policy if not exists tenant_insert_cases on public.implant_cases for insert to authenticated with check (public.is_practice_member(practice_id));
create policy if not exists tenant_update_cases on public.implant_cases for update to authenticated using (public.is_practice_member(practice_id)) with check (public.is_practice_member(practice_id));
create policy if not exists tenant_delete_cases on public.implant_cases for delete to authenticated using (public.is_practice_member(practice_id));
create policy if not exists tenant_select_recalls on public.recall_notices for select to authenticated using (public.is_practice_member(practice_id));
create policy if not exists tenant_insert_recalls on public.recall_notices for insert to authenticated with check (public.is_practice_member(practice_id));
create policy if not exists tenant_update_recalls on public.recall_notices for update to authenticated using (public.is_practice_member(practice_id)) with check (public.is_practice_member(practice_id));
create policy if not exists tenant_delete_recalls on public.recall_notices for delete to authenticated using (public.is_practice_member(practice_id));
create policy if not exists tenant_select_team on public.team_members for select to authenticated using (public.is_practice_member(practice_id));
create policy if not exists tenant_insert_team on public.team_members for insert to authenticated with check (public.is_practice_member(practice_id));
create policy if not exists tenant_update_team on public.team_members for update to authenticated using (public.is_practice_member(practice_id)) with check (public.is_practice_member(practice_id));
create policy if not exists tenant_delete_team on public.team_members for delete to authenticated using (public.is_practice_member(practice_id));
create policy if not exists tenant_select_audit on public.audit_log for select to authenticated using (public.is_practice_member(practice_id));
create policy if not exists tenant_insert_audit on public.audit_log for insert to authenticated with check (public.is_practice_member(practice_id));
`; }
function cloudSQL(){return `-- Dentsply Implant Inventory V23 / multi-practice Supabase schema
create table if not exists public.practices (id uuid primary key default gen_random_uuid(), name text not null, created_by uuid not null references auth.users(id) on delete cascade, created_at timestamptz default now());
create table if not exists public.practice_members (practice_id uuid not null references public.practices(id) on delete cascade, user_id uuid not null references auth.users(id) on delete cascade, role text not null default 'Admin', active boolean default true, created_at timestamptz default now(), primary key(practice_id,user_id));
create index if not exists practice_members_user_idx on public.practice_members(user_id);
alter table public.inventory_records add column if not exists practice_id uuid references public.practices(id) on delete cascade;
alter table public.inventory_transactions add column if not exists practice_id uuid references public.practices(id) on delete cascade;
alter table public.implant_cases add column if not exists practice_id uuid references public.practices(id) on delete cascade;
alter table public.recall_notices add column if not exists practice_id uuid references public.practices(id) on delete cascade;
alter table public.team_members add column if not exists practice_id uuid references public.practices(id) on delete cascade;
alter table public.audit_log add column if not exists practice_id uuid references public.practices(id) on delete cascade;
create unique index if not exists inventory_practice_ref_lot_uniq on public.inventory_records(practice_id,ref,lot);
create or replace function public.create_practice(p_name text) returns uuid language plpgsql security definer set search_path='' as $$ declare pid uuid; begin if auth.uid() is null then raise exception 'Not authenticated'; end if; if nullif(trim(p_name),'') is null then raise exception 'Practice name is required'; end if; insert into public.practices(name,created_by) values(trim(p_name),auth.uid()) returning id into pid; insert into public.practice_members(practice_id,user_id,role) values(pid,auth.uid(),'Admin'); return pid; end; $$;
create or replace function public.claim_unassigned_inventory(p_practice_id uuid) returns integer language plpgsql security definer set search_path='' as $$ declare n integer; begin if not exists(select 1 from public.practice_members where practice_id=p_practice_id and user_id=auth.uid() and active) then raise exception 'Not a practice member'; end if; update public.inventory_records set practice_id=p_practice_id where practice_id is null; get diagnostics n=row_count; return n; end; $$;
revoke all on public.practices from anon; revoke all on public.practice_members from anon; revoke all on public.inventory_records from anon; revoke all on public.inventory_transactions from anon; revoke all on public.implant_cases from anon; revoke all on public.recall_notices from anon; revoke all on public.team_members from anon; revoke all on public.audit_log from anon;
grant select on public.practices, public.practice_members to authenticated;
grant select,insert,update,delete on public.inventory_records, public.inventory_transactions, public.implant_cases, public.recall_notices, public.team_members, public.audit_log to authenticated;
alter table public.practices enable row level security; alter table public.practice_members enable row level security; alter table public.inventory_records enable row level security; alter table public.inventory_transactions enable row level security; alter table public.implant_cases enable row level security; alter table public.recall_notices enable row level security; alter table public.team_members enable row level security; alter table public.audit_log enable row level security;
create or replace function public.is_practice_member(p_practice_id uuid) returns boolean language sql security definer set search_path='' stable as $$ select exists(select 1 from public.practice_members where practice_id=p_practice_id and user_id=auth.uid() and active); $$;
revoke all on function public.is_practice_member(uuid) from public; grant execute on function public.is_practice_member(uuid) to authenticated;
-- Recreate tenant policies safely
drop policy if exists practice_select on public.practices; create policy practice_select on public.practices for select to authenticated using (id in (select practice_id from public.practice_members where user_id=auth.uid() and active));
drop policy if exists member_select on public.practice_members; create policy member_select on public.practice_members for select to authenticated using (user_id=auth.uid() or public.is_practice_member(practice_id));
-- Data tables: every row must belong to a practice the signed-in user belongs to.
`;

for (const t of ['inventory_records','inventory_transactions','implant_cases','recall_notices','team_members','audit_log']) {
  // generated SQL below is intentionally explicit for easy copy/paste
}
return cloudTenantPolicySQL()+`
`; }
  window.openCloudSync=function(){setNavActive('Cloud Sync');const c=cloudConfig();const sess=authSession();const profile=localProfile();showUtility('Cloud Sync',`<div class="panel"><div class="panel-head"><h3>Office Login & Practice</h3><span class="pill ${sess?.access_token?'good':''}">${sess?.access_token?'Signed In':'Sign In Required'}</span></div><div style="padding:18px">${sess?.access_token?`<div style="display:flex;gap:10px;align-items:center;justify-content:space-between;flex-wrap:wrap"><div><b>${esc(profile?.email||'Signed-in user')}</b><small style="display:block;color:#718096">${esc(profile?.practice_name||'No practice selected')}</small></div><button class="alt" onclick="signOutCloud()">Sign Out</button></div><div style="margin-top:14px"><label>Practice / Office Name<input id="practiceName" value="${esc(profile?.practice_name||'')}" placeholder="e.g. Price Dental"></label><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px"><button class="primary" onclick="createOrSelectPractice()">Create / Connect Practice</button><button class="alt" onclick="claimLocalData()">Claim Local Data</button></div></div>`:`<div class="cloud-form"><label>Email<input id="authEmail" type="email" placeholder="you@office.com"></label><label>Password<input id="authPassword" type="password" placeholder="Password"></label></div><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px"><button class="primary" onclick="signInCloud()">Sign In</button><button class="alt" onclick="signUpCloud()">Create Account</button></div>`}<div id="authStatus" style="margin-top:12px"></div></div></div><div class="panel"><div class="panel-head"><h3>Shared Cloud Database</h3><span class="pill ${c.url?'good':''}">${c.url?'Configured':'Not Connected'}</span></div><div style="padding:18px"><p style="margin-top:0;color:#52657a">Connect this app to Supabase. V23 uses sign-in + practice membership so each office has its own private cloud workspace.</p><div class="cloud-form"><label>Supabase Project URL<input id="cloudUrl" value="${esc(c.url||'')}" placeholder="https://your-project.supabase.co"></label><label>Supabase Anon / Publishable Key<input id="cloudKey" type="password" value="${esc(c.key||'')}" placeholder="Paste the public client key"></label></div><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:14px"><button class="primary" onclick="saveCloudConnection()">Save & Test Connection</button><button class="primary" onclick="syncCloudNow()">☁ Sync Now</button><button class="alt" onclick="clearCloudConnection()">Disconnect</button></div><div style="margin-top:12px;display:flex;gap:10px;align-items:center;flex-wrap:wrap"><label style="display:flex;gap:8px;align-items:center"><input id="autoSync" type="checkbox" ${localStorage.getItem('implantAutoSync')!=='0'?'checked':''} onchange="enableAutoSync(this.checked)"> Auto-sync every 30 seconds</label><span style="color:#718096;font-size:12px">Last sync: ${localStorage.getItem('implantCloudLastSync')?new Date(localStorage.getItem('implantCloudLastSync')).toLocaleString():'Never'}</span></div><div id="cloudStatus" style="margin-top:14px"></div></div></div><div class="panel" style="margin-top:16px"><div class="panel-head"><h3>Set up the database</h3><button class="alt" onclick="copyCloudSQL()">Copy SQL</button></div><div style="padding:18px"><p style="color:#52657a">In Supabase, open SQL Editor, paste the schema below, and run it. The app will then have the tables needed for shared inventory.</p><textarea id="cloudSQL" readonly style="min-height:220px;font-family:ui-monospace,monospace;font-size:12px">${esc(cloudSQL())}</textarea></div></div><div class="panel" style="margin-top:16px"><div class="panel-head"><h3>Local backup</h3></div><div style="padding:18px"><p style="color:#52657a">Keep a local backup before your first cloud sync. Cloud data is protected by authenticated practice membership and database Row Level Security. Keep a local backup before the first migration.</p><button class="primary" onclick="exportFullBackup()">Export Full Backup</button><label style="display:inline-block;margin-left:8px"><input type="file" id="restoreBackupFile" accept="application/json" onchange="restoreFullBackup(event)" hidden><button class="alt" onclick="document.getElementById('restoreBackupFile').click()">Restore Backup</button></label></div></div>`)}
  window.saveCloudConnection=async function(){const url=(document.getElementById('cloudUrl')?.value||'').trim().replace(/\/$/,'');const key=(document.getElementById('cloudKey')?.value||'').trim();const box=document.getElementById('cloudStatus');if(!url||!key){box.innerHTML='<div class="cloud-bad">Enter both the Project URL and public client key.</div>';return}saveCloudConfig({url,key});box.innerHTML='<div class="cloud-warn">Testing connection…</div>';try{const r=await fetch(url+'/rest/v1/',{headers:{apikey:key,Authorization:'Bearer '+key}});box.innerHTML=r.ok?'<div class="cloud-good">✓ Supabase connection works. Database tables still need to be created with the SQL above.</div>':'<div class="cloud-bad">Connection reached the project but was rejected. Check the URL and public key.</div>'}catch(e){box.innerHTML='<div class="cloud-bad">Could not reach the Supabase project. Check the URL and internet connection.</div>'}}
  window.clearCloudConnection=function(){localStorage.removeItem(CLOUD_KEY);openCloudSync()}
  window.copyCloudSQL=function(){const text=cloudSQL();navigator.clipboard?.writeText(text).then(()=>alert('Cloud database SQL copied.')).catch(()=>prompt('Copy this SQL:',text))}
  window.exportFullBackup=function(){const keys=['implantInventory','implantTransactions','implantMinStock','implantCurrentUser','implantTeamV1','implantAuditV1','implantCasesV1','implantRecallV1','implantQuarantineV1','implantReorderV1'];const data={version:'V21',exportedAt:new Date().toISOString()};keys.forEach(k=>{const v=localStorage.getItem(k);if(v!==null){try{data[k]=JSON.parse(v)}catch(e){data[k]=v}}});const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));a.download='implant-inventory-backup-V21.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
  window.restoreFullBackup=function(ev){const f=ev.target.files?.[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{const d=JSON.parse(r.result);if(!d.version||!confirm('Restore this backup? Existing local inventory data will be replaced.'))return;Object.keys(d).filter(k=>k.startsWith('implant')).forEach(k=>localStorage.setItem(k,typeof d[k]==='string'?d[k]:JSON.stringify(d[k])));alert('Backup restored.');location.reload()}catch(e){alert('That backup file could not be read.')}};r.readAsText(f)}


  // V23 — authenticated multi-practice tenant support
  const AUTH_KEY='implantAuthSessionV1', PROFILE_KEY='implantPracticeProfileV1';
  function authSession(){try{return JSON.parse(localStorage.getItem(AUTH_KEY)||'null')}catch(e){return null}}
  function saveAuthSession(x){if(x)localStorage.setItem(AUTH_KEY,JSON.stringify(x));else localStorage.removeItem(AUTH_KEY)}
  function localProfile(){try{return JSON.parse(localStorage.getItem(PROFILE_KEY)||'null')}catch(e){return null}}
  function saveLocalProfile(x){localStorage.setItem(PROFILE_KEY,JSON.stringify(x))}
  async function authRequest(path,body,method='POST'){const c=cloudConfig();if(!c.url||!c.key)throw new Error('Set the Supabase Project URL and public client key first.');const h={'apikey':c.key,'Content-Type':'application/json'};const r=await fetch(c.url+'/auth/v1/'+path,{method,headers:h,body:body?JSON.stringify(body):undefined});const j=await r.json().catch(()=>({}));if(!r.ok)throw new Error(j.msg||j.message||j.error_description||'Authentication request failed.');return j}
  window.signInCloud=async function(){const email=(document.getElementById('authEmail')?.value||'').trim(),password=document.getElementById('authPassword')?.value||'',box=document.getElementById('authStatus');if(!email||!password){box.innerHTML='<div class="cloud-bad">Enter your email and password.</div>';return}try{box.innerHTML='<div class="cloud-warn">Signing in…</div>';const d=await authRequest('token?grant_type=password',{email,password});saveAuthSession(d);saveLocalProfile({email,practice_id:localProfile()?.practice_id||null,practice_name:localProfile()?.practice_name||''});box.innerHTML='<div class="cloud-good">✓ Signed in.</div>';openCloudSync()}catch(e){box.innerHTML='<div class="cloud-bad">'+esc(e.message)+'</div>'}}
  window.signUpCloud=async function(){const email=(document.getElementById('authEmail')?.value||'').trim(),password=document.getElementById('authPassword')?.value||'',box=document.getElementById('authStatus');if(!email||password.length<8){box.innerHTML='<div class="cloud-bad">Use a valid email and a password of at least 8 characters.</div>';return}try{box.innerHTML='<div class="cloud-warn">Creating account…</div>';const d=await authRequest('signup',{email,password});if(d.access_token){saveAuthSession(d);saveLocalProfile({email,practice_id:null,practice_name:''});box.innerHTML='<div class="cloud-good">✓ Account created and signed in.</div>';openCloudSync()}else box.innerHTML='<div class="cloud-good">✓ Account created. Check your email to confirm the account, then sign in.</div>'}catch(e){box.innerHTML='<div class="cloud-bad">'+esc(e.message)+'</div>'}}
  window.signOutCloud=async function(){try{const s=authSession(),c=cloudConfig();if(s?.access_token&&c.url&&c.key)await fetch(c.url+'/auth/v1/logout',{method:'POST',headers:{apikey:c.key,Authorization:'Bearer '+s.access_token}})}catch(e){}saveAuthSession(null);saveLocalProfile(null);openCloudSync()}
  window.createOrSelectPractice=async function(){const name=(document.getElementById('practiceName')?.value||'').trim(),box=document.getElementById('authStatus');if(!name){box.innerHTML='<div class="cloud-bad">Enter the practice/office name.</div>';return}try{const s=authSession();if(!s?.access_token)throw new Error('Sign in first.');box.innerHTML='<div class="cloud-warn">Creating practice…</div>';const d=await cloudRequestRPC('create_practice',{p_name:name});const pid=Array.isArray(d)?d[0]:d;saveLocalProfile({email:localProfile()?.email||'',practice_id:pid,practice_name:name});box.innerHTML='<div class="cloud-good">✓ Practice created. This account is the Practice Admin.</div>';openCloudSync()}catch(e){box.innerHTML='<div class="cloud-bad">'+esc(e.message)+'</div>'}}
  async function cloudRequestRPC(fn,body){const c=cloudConfig(),s=authSession();if(!s?.access_token)throw new Error('Sign in first.');const r=await fetch(c.url+'/rest/v1/rpc/'+fn,{method:'POST',headers:{apikey:c.key,Authorization:'Bearer '+s.access_token,'Content-Type':'application/json'},body:JSON.stringify(body||{})});const j=await r.json().catch(()=>null);if(!r.ok)throw new Error(j?.message||j?.hint||'Cloud function failed.');return j}
  window.claimLocalData=async function(){const box=document.getElementById('authStatus');try{const pid=localProfile()?.practice_id;if(!pid)throw new Error('Create/connect a practice first.');const n=await cloudRequestRPC('claim_unassigned_inventory',{p_practice_id:pid});box.innerHTML='<div class="cloud-good">✓ Claimed '+n+' unassigned cloud inventory records for this practice.</div>';await cloudSyncInventory();render()}catch(e){box.innerHTML='<div class="cloud-bad">'+esc(e.message)+'</div>'}}
  async function refreshAuthSession(){const s=authSession();if(!s?.refresh_token)return;try{const d=await authRequest('token?grant_type=refresh_token',{refresh_token:s.refresh_token});saveAuthSession(d)}catch(e){saveAuthSession(null);saveLocalProfile(null)}}
  refreshAuthSession();

  // V22 — actual two-way inventory cloud synchronization
  let cloudSyncBusy=false;
  function cloudHeaders(){const c=cloudConfig(),s=authSession();return c.url&&c.key&&s?.access_token?{apikey:c.key,Authorization:'Bearer '+s.access_token,'Content-Type':'application/json','Prefer':'resolution=merge-duplicates,return=minimal'}:null}
  function cloudUrl(table){const c=cloudConfig();return c.url+'/rest/v1/'+table}
  function localInventoryRows(){const rows=[],practice_id=localProfile()?.practice_id||null;if(!practice_id)return rows;for(const [ref,lots] of Object.entries(inventory)){for(const x of (lots||[])){rows.push({practice_id,ref:String(ref),lot:String(x.lot||''),qty:Number(x.qty||0),exp:x.exp||null,own:x.own||'Practice Owned',location:x.location||'Implant Cabinet',expected_qty:Number(x.expected||0),quarantined:!!x.quarantined,updated_at:new Date(x._updatedAt||Date.now()).toISOString()})}}return rows}
  async function cloudRequest(table,opts={}){const h=cloudHeaders();if(!h)throw new Error('Cloud is not configured');const r=await fetch(cloudUrl(table),{...opts,headers:{...h,...(opts.headers||{})}});if(!r.ok){let msg='Request failed ('+r.status+')';try{const j=await r.json();msg=j.message||j.hint||j.details||msg}catch(e){}throw new Error(msg)}return r.status===204?null:r.json().catch(()=>null)}
  async function cloudSyncInventory(){if(cloudSyncBusy)return;const c=cloudConfig();if(!c.url||!c.key)throw new Error('Connect Supabase first.');if(!authSession()?.access_token)throw new Error('Sign in and select a practice first.');if(!localProfile()?.practice_id)throw new Error('Create or connect your practice first.');cloudSyncBusy=true;try{
    const localRows=localInventoryRows();
    if(localRows.length) await cloudRequest('inventory_records',{method:'POST',body:JSON.stringify(localRows)});
    const remote=await cloudRequest('inventory_records',{method:'GET',headers:{Prefer:'return=representation'}}) || [];
    const merged={};
    for(const r of remote){const ref=String(r.ref),lot=String(r.lot||'');(merged[ref]||(merged[ref]=[])).push({lot,exp:r.exp||'2099-12-31',qty:Number(r.qty||0),own:r.own||'Practice Owned',expected:Number(r.expected_qty||0),location:r.location||'Implant Cabinet',quarantined:!!r.quarantined,_updatedAt:new Date(r.updated_at||0).getTime()});}
    // Keep local-only records if a newly connected database is empty/does not yet contain them.
    for(const [ref,lots] of Object.entries(inventory)){for(const x of (lots||[])){if(!merged[ref])merged[ref]=[];if(!merged[ref].some(y=>y.lot===String(x.lot||''))){merged[ref].push(x)}}}
    inventory=merged;save();localStorage.setItem('implantCloudLastSync',new Date().toISOString());
    try{await cloudRequest('inventory_transactions',{method:'POST',body:JSON.stringify((transactions||[]).slice(-100).map(t=>({practice_id:localProfile()?.practice_id||null,action:t.action||'',ref:t.ref||'',lot:t.lot||'',qty:Number(t.qty||0),own:t.own||'',user_name:localStorage.getItem('implantCurrentUser')||'Inventory Manager'})))});}catch(e){}
    return remote.length;
  }finally{cloudSyncBusy=false}}
  window.syncCloudNow=async function(){const box=document.getElementById('cloudStatus');if(box)box.innerHTML='<div class="cloud-warn">☁ Syncing inventory…</div>';try{const n=await cloudSyncInventory();if(box)box.innerHTML='<div class="cloud-good">✓ Inventory synced. '+n+' cloud lot records checked · '+new Date().toLocaleTimeString()+'</div>';render();}catch(e){if(box)box.innerHTML='<div class="cloud-bad">Sync failed: '+esc(e.message)+'</div>';}}
  window.enableAutoSync=function(on){localStorage.setItem('implantAutoSync',on?'1':'0');if(on){if(window._syncTimer)clearInterval(window._syncTimer);window._syncTimer=setInterval(()=>{if(document.visibilityState!=='hidden')cloudSyncInventory().then(()=>render()).catch(()=>{});},30000)}else if(window._syncTimer){clearInterval(window._syncTimer);window._syncTimer=null}}
  // Start periodic sync when a cloud connection is configured.
  if(cloudConfig().url&&cloudConfig().key&&localStorage.getItem('implantAutoSync')!=='0')enableAutoSync(true);
  const _oldSave=save;
  save=function(){_oldSave();if(cloudConfig().url&&cloudConfig().key&&localStorage.getItem('implantAutoSync')!=='0')setTimeout(()=>cloudSyncInventory().then(()=>render()).catch(()=>{}),150)};

  // V20 Team + Audit Activity
  const TEAM_KEY='implantTeamV1', AUDIT_KEY='implantAuditV1';
  function team(){try{return JSON.parse(localStorage.getItem(TEAM_KEY)||'[]')}catch(e){return []}}
  function saveTeam(a){localStorage.setItem(TEAM_KEY,JSON.stringify(a))}
  function audit(){try{return JSON.parse(localStorage.getItem(AUDIT_KEY)||'[]')}catch(e){return []}}
  function saveAudit(a){localStorage.setItem(AUDIT_KEY,JSON.stringify(a.slice(-500)))}
  function logAudit(action,detail){const a=audit();a.push({id:String(Date.now()+Math.random()),at:Date.now(),user:localStorage.getItem('implantCurrentUser')||'Inventory Manager',action,detail});saveAudit(a)}
  window.setCurrentUser=function(){const el=document.getElementById('currentUserInput');const v=(el?.value||'').trim();if(!v)return;localStorage.setItem('implantCurrentUser',v);logAudit('User switched',v);openTeam();dash();}
  window.addTeamMember=function(){const n=(document.getElementById('teamName')?.value||'').trim(),r=document.getElementById('teamRole')?.value||'Assistant';if(!n){alert('Enter a name.');return;}const a=team();a.push({id:String(Date.now()),name:n,role:r,active:true,createdAt:Date.now()});saveTeam(a);logAudit('Team member added',n+' · '+r);openTeam();}
  window.toggleTeamMember=function(id){const a=team();const x=a.find(v=>v.id===String(id));if(!x)return;x.active=!x.active;saveTeam(a);logAudit(x.active?'Team member activated':'Team member deactivated',x.name);openTeam();}
  window.openTeam=function(){setNavActive('Team');const members=team(),current=localStorage.getItem('implantCurrentUser')||'Inventory Manager';showUtility('Team & Users',`<div class="panel"><div class="panel-head"><h3>Current user</h3></div><div style="padding:18px;display:flex;gap:10px;align-items:end;flex-wrap:wrap"><label style="flex:1;min-width:220px">Name<input id="currentUserInput" value="${esc(current)}" placeholder="e.g. Stacy"></label><button class="primary" onclick="setCurrentUser()">Save current user</button></div></div><div class="panel" style="margin-top:16px"><div class="panel-head"><h3>Add team member</h3></div><div style="padding:18px;display:grid;grid-template-columns:1fr 180px auto;gap:10px;align-items:end"><label>Name<input id="teamName" placeholder="Name"></label><label>Role<select id="teamRole"><option>Admin</option><option>Inventory Manager</option><option>Doctor</option><option>Assistant</option><option>Read Only</option></select></label><button class="primary" onclick="addTeamMember()">Add</button></div></div><div class="panel" style="margin-top:16px"><div class="panel-head"><h3>Team members</h3><span>${members.filter(x=>x.active).length} active</span></div>${members.length?members.map(x=>`<div class="reorder-row"><div><b>${esc(x.name)}</b><small>${esc(x.role)} · Added ${new Date(x.createdAt).toLocaleDateString()}</small></div><div><span class="pill ${x.active?'':'bad'}">${x.active?'Active':'Inactive'}</span></div><div class="row-action"><button class="alt" onclick="toggleTeamMember('${esc(x.id)}')">${x.active?'Deactivate':'Activate'}</button></div></div>`).join(''):'<div style="padding:24px;color:#718096;text-align:center">No team members added yet.</div>'}</div><div class="panel" style="margin-top:16px"><div class="panel-head"><h3>Cloud sharing</h3></div><div style="padding:18px"><b>Current mode: Local device</b><p style="color:#718096;margin:8px 0 0">V20 prepares users and audit history for the shared cloud database. The next cloud connection will sync inventory, cases, recalls, documents and activity across authorized devices.</p></div></div>`)}
  window.openActivity=function(){setNavActive('Activity');const a=audit().slice().reverse();showUtility('Activity & Audit History',`<div class="panel"><div class="panel-head"><h3>Recent activity</h3><button class="alt" onclick="if(confirm('Clear activity history?')){localStorage.removeItem(AUDIT_KEY);openActivity();}">Clear History</button></div>${a.length?a.slice(0,200).map(x=>`<div class="reorder-row"><div><b>${esc(x.action)}</b><small>${esc(x.detail||'')}</small></div><div><small>User</small><b>${esc(x.user)}</b></div><div><small>Date</small><b>${new Date(x.at).toLocaleString()}</b></div></div>`).join(''):'<div style="padding:24px;color:#718096;text-align:center">No activity recorded yet.</div>'}</div>`)}
  // Wrap key inventory mutations with audit logging without changing their existing behavior.
  const _origReceive=window.receiveInventory; if(typeof _origReceive==='function'){window.receiveInventory=function(){logAudit('Inventory received','Received inventory');return _origReceive.apply(this,arguments)}}
  const _origPull=window.pullInventory; if(typeof _origPull==='function'){window.pullInventory=function(){logAudit('Inventory used','Pulled/used inventory');return _origPull.apply(this,arguments)}}



let selectedSystem = null;
let selectedSize = null;

function openSystem(system){
  selectedSystem = system;
  selectedSize = null;
  document.querySelector('.home-selection').style.display='none';
  document.getElementById('utilityView').style.display='none';
  document.getElementById('catalogView').style.display='block';
  document.getElementById('catalogTitle').textContent = system;
  document.getElementById('catalogSearch').value='';
  renderCatalogSelection();
}

function backHome(){
  document.getElementById('catalogView').style.display='none';
  document.getElementById('utilityView').style.display='none';
  document.querySelector('.home-selection').style.display='block';
}

function catalogRows(){
  return (CATALOG[selectedSystem] || []);
}

function renderCatalogSelection(){
  const rows = catalogRows();
  const q = (document.getElementById('catalogSearch')?.value || '').toLowerCase();
  const filtered = rows.filter(r => r.join(' ').toLowerCase().includes(q));
  const sizes = [...new Set(filtered.map(r=>r[1]).filter(Boolean))];

  const sizeBox = document.getElementById('sizeSelection');
  sizeBox.innerHTML = sizes.map(s => `
    <button class="size-btn ${selectedSize===s?'active':''}" onclick="selectSize('${s.replace(/'/g,"\\'")}')">
      <b>${s}</b><span>Diameter / connection</span>
    </button>`).join('');

  if(!filtered.length){
    document.getElementById('productSelection').innerHTML =
      '<div style="padding:28px;text-align:center;color:var(--muted)">No catalog items match this selection.</div>';
    return;
  }

  const shown = selectedSize ? filtered.filter(r=>r[1]===selectedSize) : filtered;
  document.getElementById('productSelection').innerHTML = `
    <div style="font-size:13px;color:var(--muted);margin-bottom:8px">
      ${selectedSize ? 'Select an implant length / configuration:' : 'Select a size above or choose from all catalog items:'}
    </div>
    ${shown.map(r=>`
      <div class="product-row">
        <div class="info">
          <b>REF ${r[0]}</b>
          <span>${r[1]||''} ${r[2]||''}${r[3]?' • '+r[3]+' mm':''}</span>
        </div>
        <button onclick="chooseProduct('${r[0]}')">Select</button>
      </div>`).join('')}`;
}

function selectSize(size){
  selectedSize=size;
  renderCatalogSelection();
}

function chooseProduct(ref){
  const row=catalogRows().find(r=>r[0]===ref);
  if(!row)return;
  showProductDetail(ref);
}
function productMinStock(ref){const x=JSON.parse(localStorage.getItem('implantMinStock')||'{}');return Number.isFinite(+x[ref])?+x[ref]:0;}
function saveProductMinStock(ref,val){const x=JSON.parse(localStorage.getItem('implantMinStock')||'{}');x[ref]=Math.max(0,parseInt(val||0,10)||0);localStorage.setItem('implantMinStock',JSON.stringify(x));}
function showProductDetail(ref){
  const it=item(ref);if(!it)return;const lots=(inventory[ref]||[]).filter(x=>+x.qty>0);const on=lots.reduce((s,x)=>s+(+x.qty||0),0);const cons=lots.filter(x=>x.own==='Consignment').reduce((s,x)=>s+(+x.qty||0),0);const min=productMinStock(ref);const low=min>0&&on<min;const statusText=min>0?(low?'LOW STOCK':'STOCK OK'):'MINIMUM NOT SET';
  showUtility('Product Detail',`<div class="product-detail-grid"><div class="panel"><div class="product-detail-hero"><div class="product-detail-icon">${esc(it.group==='PrimeTaper EV'?'P':'A')}</div><div><div class="eyebrow">PRODUCT</div><h2 style="margin:0;color:#19324f">${esc(it.group)}</h2><div class="detail-ref">REF ${esc(it.ref)}</div></div></div><div class="detail-specs"><div><span>Diameter / size</span><b>${esc(it.size)}</b></div><div><span>Connection</span><b>${esc(it.kind||'Product')}</b></div><div><span>Length</span><b>${it.length?esc(it.length)+' mm':'—'}</b></div><div><span>On hand</span><b>${on}</b></div><div><span>Consignment</span><b>${cons}</b></div><div><span>Stock status</span><b class="${low?'bad':'good'}">${statusText}</b></div></div><div class="detail-actions"><button onclick="openReceive('${esc(ref)}')">＋ Receive</button><button class="alt" onclick="openPull('${esc(ref)}')">− Pull / Use</button><button class="alt" onclick="openInventoryForRef('${esc(ref)}')">View Lots</button></div></div><div class="panel"><div class="panel-head"><h3>Inventory & Reorder</h3></div><div style="padding:16px"><label style="font-size:12px;font-weight:700;color:#52657a">Minimum stock level<input id="minStockInput" type="number" min="0" value="${min}" style="width:100%;margin-top:5px"></label><button class="primary" style="margin-top:10px;width:100%" onclick="saveProductMinStock('${esc(ref)}',document.getElementById('minStockInput').value);showProductDetail('${esc(ref)}')">Save minimum stock</button><div class="reorder-box ${low?'bad':''}"><b>${low?'⚠ Reorder recommended':'✓ No reorder alert'}</b><span>${min>0?`On hand ${on} · Minimum ${min}`:'Set a minimum stock level to enable reorder alerts.'}</span></div></div></div></div><div class="panel" style="margin-top:16px"><div class="panel-head"><h3>Lots on Hand</h3><button class="linkbtn" onclick="openInventoryForRef('${esc(ref)}')">View all inventory</button></div><div>${lots.length?`<table class="inventory-table"><thead><tr><th>Lot</th><th>Expiration</th><th>Ownership</th><th>Qty</th><th>Status</th></tr></thead><tbody>${lots.map(x=>{const st=status(x)[1];return `<tr><td><b>${esc(x.lot)}</b></td><td>${esc(x.exp||'—')}</td><td>${esc(x.own)}</td><td><b>${esc(x.qty)}</b></td><td><span class="pill ${st==='bad'?'bad':st==='warn'?'warn':''}">${esc(status(x)[0])}</span></td></tr>`}).join('')}</tbody></table>`:'<div style="padding:22px;color:#718096;text-align:center">No inventory recorded for this REF.</div>'}</div></div>`);
}

function openScanner(){
  document.querySelector('.home-selection').style.display='none';
  document.getElementById('catalogView').style.display='none';
  const u=document.getElementById('utilityView');
  u.style.display='block';
  document.getElementById('utilityTitle').textContent='Scan Package';
  document.getElementById('utilityContent').innerHTML=`
    <div class="panel">
      <h3 style="margin-top:0">Scan package</h3>
      <div class="bigscan"><input id="homeScan" placeholder="Scan GS1 barcode or type REF"><button onclick="homeScanIdentify()">Identify</button></div>
      <div class="note">The scanner workflow will identify the catalog item, lot, expiration and then offer Receive or Pull.</div>
    </div>`;
}
function homeScanIdentify(){
  const v=document.getElementById('homeScan').value.trim();
  alert(v ? `Package received: ${v}\\n\\nConnect this screen to the inventory transaction workflow for Receive/Pull.` : 'Scan a package first.');
}
function openInventory(){
  document.querySelector('.home-selection').style.display='none';
  document.getElementById('catalogView').style.display='none';
  const u=document.getElementById('utilityView');u.style.display='block';
  document.getElementById('utilityTitle').textContent='Inventory';
  document.getElementById('utilityContent').innerHTML='<div class="panel"><h3 style="margin-top:0">Inventory</h3><p class="note">Choose a catalog from the home screen to view inventory by implant size, REF, lot and ownership.</p></div>';
}
function openTransactions(){
  document.querySelector('.home-selection').style.display='none';
  document.getElementById('catalogView').style.display='none';
  const u=document.getElementById('utilityView');u.style.display='block';
  document.getElementById('utilityTitle').textContent='Transactions';
  document.getElementById('utilityContent').innerHTML='<div class="panel"><h3 style="margin-top:0">Transaction History</h3><p class="note">Receive and pull activity will appear here with REF, lot, quantity, ownership and date/time.</p></div>';
}


function setNavActive(label){document.querySelectorAll('.nav-item').forEach(b=>b.classList.remove('active'));const b=[...document.querySelectorAll('.nav-item')].find(x=>x.textContent.trim()===label);if(b)b.classList.add('active');}
const _openScanner=openScanner,_openInventory=openInventory,_openTransactions=openTransactions,_openSystem=openSystem;
openScanner=function(){setNavActive('Scan Package');_openScanner();setTimeout(()=>openCameraScanner(),300);};
openInventory=function(){setNavActive('Inventory');_openInventory();};
openTransactions=function(){setNavActive('Transactions');_openTransactions();};
openSystem=function(name){setNavActive('Catalog');_openSystem(name);};
const _backHome=backHome; backHome=function(){setNavActive('Dashboard');_backHome();};


function downloadApp(){
  const html='<!doctype html>\n'+document.documentElement.outerHTML;
  const blob=new Blob([html],{type:'text/html;charset=utf-8'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url; a.download='Dental_Implant_Inventory_App.html';
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
}


let inventoryScanner=null, scannerControls=null, scannerRunning=false;
function openCameraScanner(){
 const modal=document.getElementById('cameraScanModal'); modal.classList.add('open');
 const r=document.getElementById('scanResult'); r.style.display='block';
 r.innerHTML='<strong>Ready</strong><br>Tap <b>Scan Live with Phone</b> or take a close-up photo of the small square Data Matrix.';
}
async function startPhoneScanner(){
 const r=document.getElementById('scanResult'); r.style.display='block';
 if(!window.ZXing || !window.ZXing.BrowserDatamatrixCodeReader){r.innerHTML='<strong>Scanner library is loading…</strong><br>Wait a moment and tap again.';return;}
 try{
   if(scannerRunning)return;
   const readerEl=document.getElementById('reader'); readerEl.style.display='block';
   r.innerHTML='<strong>Camera ready</strong><br>Move the package until the small square Data Matrix is large, sharp and well lit.';
   inventoryScanner=new ZXing.BrowserDatamatrixCodeReader();
   scannerControls=await inventoryScanner.decodeFromConstraints({video:{facingMode:{ideal:'environment'},width:{ideal:1920},height:{ideal:1080},focusMode:'continuous'},audio:false},readerEl,(result,error,controls)=>{
      if(result && !scannerRunning){
        scannerRunning=true;
        handleInventoryBarcode(result.text);
        try{controls.stop();}catch(e){}
      }
   });
   scannerRunning=true;
 }catch(e){
   scannerRunning=false;
   r.innerHTML='<strong>Camera could not start.</strong><br>Allow camera access, then try again. If live scanning still fails, use <b>Take / Choose Photo</b>.';
 }
}
async function scanImageFile(file){
 if(!file)return;
 const r=document.getElementById('scanResult'); r.style.display='block';
 if(!window.ZXing || !window.ZXing.BrowserDatamatrixCodeReader){r.innerHTML='<strong>Scanner library is loading…</strong>';setTimeout(()=>scanImageFile(file),800);return;}
 r.innerHTML='<strong>Reading Data Matrix…</strong><br>Processing the full-resolution phone image.';
 const url=URL.createObjectURL(file);
 try{
   const readers=[new ZXing.BrowserDatamatrixCodeReader(), new ZXing.BrowserMultiFormatReader()];
   let result=null;
   for(const reader of readers){
     try{result=await reader.decodeFromImageUrl(url);if(result)break;}catch(e){}
   }
   if(result){handleInventoryBarcode(result.text);}
   else{throw new Error('No code');}
 }catch(e){
   r.innerHTML='<strong>Could not read the Data Matrix.</strong><br>Retake the photo with the code much larger, square to the camera, sharp and without glare.';
 }finally{URL.revokeObjectURL(url);}
}
function closeCameraScanner(){
 try{if(scannerControls)scannerControls.stop();}catch(e){}
 try{if(inventoryScanner&&inventoryScanner.reset)inventoryScanner.reset();}catch(e){}
 scannerRunning=false; scannerControls=null; inventoryScanner=null;
 document.getElementById('cameraScanModal').classList.remove('open');
}
function parseGS1(raw){
 let t=String(raw||'').replace(/\u001d/g,'|');
 let gtin=(t.match(/(?:\(01\)|01)(\d{14})/)||[])[1]||'';
 let exp=(t.match(/(?:\(17\)|17)(\d{6})/)||[])[1]||'';
 let lot=(t.match(/\(10\)([^()|]{1,30})/)||[])[1]||'';
 if(!lot){let m=t.match(/(?:^|\|)10([^|]{1,30})/);if(m)lot=m[1];}
 return {gtin,exp,lot};
}
function handleInventoryBarcode(text){
 const r=document.getElementById('scanResult');r.style.display='block';
 const raw=String(text||''); const d=parseGS1(raw);
 r.innerHTML='<strong>Barcode detected!</strong><br>GTIN: '+(d.gtin||'detected')+'<br>LOT: '+(d.lot||'detected')+'<br>EXP: '+(d.exp||'detected');
 const input=document.querySelector('input[placeholder*="Scan GS1"],input[placeholder*="barcode"],input[placeholder*="REF"]');
 if(input){input.value=raw;input.dispatchEvent(new Event('input',{bubbles:true}));}
 const btn=[...document.querySelectorAll('button')].find(b=>/identify/i.test(b.textContent));
 if(btn)setTimeout(()=>btn.click(),250);
 setTimeout(closeCameraScanner,1800);
}


(function(){
  function esc(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
  function allLots(){const a=[]; for(const [ref,lots] of Object.entries(inventory||{})){const it=item(ref); (lots||[]).forEach(l=>a.push({ref,it,lot:l}));} return a;}
  function counts(){const rows=allLots(); let units=0, exp=0, expired=0, consExpected=0, consActual=0; rows.forEach(x=>{units+=+x.lot.qty||0; const d=daysTo(x.lot.exp); if(d<0)expired+=+x.lot.qty||0; else if(d<=548)exp+=+x.lot.qty||0; if(x.lot.own==='Consignment'){consActual+=+x.lot.qty||0;consExpected+=+x.lot.expected||0;}}); return {units,exp,expired,disc:consActual-consExpected};}
  function dash(){
    const c=counts();
    const s=document.getElementById('dashStats'); if(s)s.innerHTML=`<button class="stat-card clickable" onclick="openInventory()"><div class="label">Units on hand</div><div class="num">${c.units}</div><div class="sub">Across all tracked products · View inventory</div></button><button class="stat-card clickable ${c.exp?'alert':''}" onclick="openAlerts('expiring')"><div class="label">Expiring ≤18 months</div><div class="num">${c.exp}</div><div class="sub">Use FIFO first · View expiring</div></button><button class="stat-card clickable ${c.expired?'alert':''}" onclick="openAlerts('expired')"><div class="label">Expired</div><div class="num">${c.expired}</div><div class="sub">Remove from usable stock · View expired</div></button><button class="stat-card clickable ${c.disc?'alert':''}" onclick="openConsignment()"><div class="label">Consignment variance</div><div class="num">${c.disc>0?'+':''}${c.disc}</div><div class="sub">Actual minus expected · Review consignment</div></button>`;
    const ar=document.getElementById('dashAlerts'); if(ar){let alerts=[]; allLots().forEach(x=>{if(!x.lot.qty)return;const d=daysTo(x.lot.exp);if(d<0)alerts.push(`<button class="alert-row alert-click" onclick="openInventoryForRef('${esc(x.ref)}')"><i class="dot bad"></i><div><b>Expired: REF ${esc(x.ref)}</b><span>Lot ${esc(x.lot.lot)} · ${esc(x.lot.exp)}</span></div></button>`);else if(d<=548)alerts.push(`<button class="alert-row alert-click" onclick="openInventoryForRef('${esc(x.ref)}')"><i class="dot"></i><div><b>Expires within 18 months: REF ${esc(x.ref)}</b><span>Lot ${esc(x.lot.lot)} · ${esc(x.lot.exp)}</span></div></button>`);}); const cc=c.disc; if(cc)alerts.push(`<div class="alert-row"><i class="dot"></i><div><b>Consignment discrepancy</b><span>Actual ${c.disc+c.units-c.units} vs expected — review consignment lots</span></div></div>`); ar.innerHTML=alerts.slice(0,5).join('')||'<div style="padding:18px;color:#6f7d8e">No inventory alerts right now.</div>';}
    const tb=document.getElementById('dashTable'); if(tb){const map={}; allLots().forEach(x=>{if(!x.lot.qty)return; if(!map[x.ref])map[x.ref]={it:x.it,qty:0,cons:0};map[x.ref].qty+=+x.lot.qty||0;if(x.lot.own==='Consignment')map[x.ref].cons+=+x.lot.qty||0;});const rows=Object.values(map).sort((a,b)=>b.qty-a.qty).slice(0,8);tb.innerHTML=`<table class="inventory-table"><thead><tr><th>Product</th><th>REF</th><th>On hand</th><th>Consignment</th></tr></thead><tbody>${rows.map(x=>`<tr><td><b>${esc(x.it?.group||'Product')}</b><br><span style="color:#718096">${esc(x.it?.size||'')} ${esc(x.it?.kind||'')} ${esc(x.it?.length||'')}${x.it?.length?' mm':''}</span></td><td>${esc(x.it?.ref||'')}</td><td><b>${x.qty}</b></td><td>${x.cons}</td></tr>`).join('')||'<tr><td colspan="4" style="text-align:center;color:#718096">No inventory received yet.</td></tr>'}</tbody></table>`;}
  }
  function showUtility(title,body){document.querySelector('.home-selection').style.display='none';document.getElementById('catalogView').style.display='none';const u=document.getElementById('utilityView');u.style.display='block';document.getElementById('utilityTitle').textContent=title;document.getElementById('utilityContent').innerHTML=body;}
  window.openInventory=function(){setNavActive('Inventory'); const rows=allLots().filter(x=>x.lot.qty>0);showUtility('Inventory',`<div class="panel"><div class="panel-head"><h3>All inventory</h3><button class="primary" onclick="openReceive()">＋ Add inventory</button></div><div style="padding:12px 0"><table class="inventory-table"><thead><tr><th>Product</th><th>REF</th><th>Lot</th><th>Expiration</th><th>Ownership</th><th>Qty</th><th></th></tr></thead><tbody>${rows.map(x=>{const st=status(x.lot)[1];return `<tr><td><b>${esc(x.it?.group||'')}</b><br>${esc(x.it?.size||'')} ${esc(x.it?.kind||'')} ${esc(x.it?.length||'')}${x.it?.length?' mm':''}</td><td>${esc(x.ref)}</td><td>${esc(x.lot.lot)}</td><td><span class="pill ${st==='bad'?'bad':st==='warn'?'warn':''}">${esc(x.lot.exp)}</span></td><td>${esc(x.lot.own)}</td><td><b>${x.lot.qty}</b></td><td><button class="alt" onclick="openPull('${esc(x.ref)}')">Pull</button></td></tr>`}).join('')||'<tr><td colspan="7" style="text-align:center;padding:30px;color:#718096">No inventory yet. Scan or add a package.</td></tr>'}</tbody></table></div></div>`);};
  window.openTransactions=function(){setNavActive('Transactions');showUtility('Activity',`<div class="panel"><div class="panel-head"><h3>Transaction history</h3></div><table class="inventory-table"><thead><tr><th>Date / Time</th><th>Action</th><th>REF</th><th>Lot</th><th>Qty</th><th>Ownership</th></tr></thead><tbody>${(transactions||[]).slice().reverse().map(t=>`<tr><td>${esc(t.time)}</td><td><span class="pill ${t.action==='PULL'?'warn':''}">${esc(t.action)}</span></td><td>${esc(t.ref)}</td><td>${esc(t.lot)}</td><td>${esc(t.qty)}</td><td>${esc(t.own||'')}</td></tr>`).join('')||'<tr><td colspan="6" style="text-align:center;padding:30px;color:#718096">No transactions yet.</td></tr>'}</tbody></table></div>`);};
  window.backHome=function(){setNavActive('Dashboard');document.getElementById('catalogView').style.display='none';document.getElementById('utilityView').style.display='none';document.querySelector('.home-selection').style.display='block';dash();};
  const oldOpenScanner=window.openScanner; window.openScanner=function(){setNavActive('Scan Package'); oldOpenScanner();};
  window.openInventoryForRef=function(ref){
    setNavActive('Inventory');
    const rows=allLots().filter(x=>x.lot.qty>0 && (!ref || x.ref===ref));
    showUtility('Inventory',`<div class="panel"><div class="panel-head"><h3>${ref?'Inventory for REF '+esc(ref):'All inventory'}</h3><button class="primary" onclick="openReceive()">＋ Add inventory</button></div><div style="padding:12px 0"><table class="inventory-table"><thead><tr><th>Product</th><th>REF</th><th>Lot</th><th>Expiration</th><th>Ownership</th><th>Qty</th><th></th></tr></thead><tbody>${rows.map(x=>{const st=status(x.lot)[1];return `<tr><td><b>${esc(x.it?.group||'')}</b><br>${esc(x.it?.size||'')} ${esc(x.it?.kind||'')} ${esc(x.it?.length||'')}${x.it?.length?' mm':''}</td><td>${esc(x.ref)}</td><td>${esc(x.lot.lot)}</td><td><span class="pill ${st==='bad'?'bad':st==='warn'?'warn':''}">${esc(x.lot.exp)}</span></td><td>${esc(x.lot.own)}</td><td><b>${x.lot.qty}</b></td><td><button class="alt" onclick="openPull('${esc(x.ref)}')">Pull</button></td></tr>`}).join('')||'<tr><td colspan="7" style="text-align:center;padding:30px;color:#718096">No matching inventory.</td></tr>'}</tbody></table></div></div>`);
  };
  window.openAlerts=function(filter=''){
    setNavActive('Alerts');
    const rows=allLots().filter(x=>x.lot.qty>0).filter(x=>{const d=daysTo(x.lot.exp); return filter==='expired'?d<0:filter==='expiring'?d>=0&&d<=548:(d<0||d<=548);});
    showUtility('Alerts',`<div class="panel"><div class="panel-head"><h3>${filter==='expired'?'Expired inventory':filter==='expiring'?'Expiring within 18 months':'Inventory alerts'}</h3><button class="alt" onclick="openInventory()">View inventory</button></div><div style="padding:6px 0">${rows.map(x=>{const d=daysTo(x.lot.exp),bad=d<0;return `<button class="alert-row alert-click" onclick="openInventoryForRef('${esc(x.ref)}')"><i class="dot ${bad?'bad':''}"></i><div><b>${bad?'Expired':'Expires within 18 months'}: REF ${esc(x.ref)}</b><span>Lot ${esc(x.lot.lot)} · ${esc(x.lot.exp)} · Qty ${esc(x.lot.qty)}</span></div></button>`}).join('')||'<div style="padding:24px;color:#718096">No matching alerts.</div>'}</div></div>`);
  };
  window.openConsignment=function(){
    setNavActive('Consignment');
    const map={}; allLots().forEach(x=>{if(x.lot.own==='Consignment'){if(!map[x.ref])map[x.ref]={it:x.it,expected:0,actual:0};map[x.ref].expected+=+x.lot.expected||0;map[x.ref].actual+=+x.lot.qty||0;}});
    const rows=Object.entries(map);
    showUtility('Consignment',`<div class="panel"><div class="panel-head"><h3>Consignment reconciliation</h3><button class="primary" onclick="openReceive()">＋ Receive consignment</button></div><div style="padding:12px 0"><table class="inventory-table"><thead><tr><th>Product</th><th>REF</th><th>Expected</th><th>Actual</th><th>Variance</th></tr></thead><tbody>${rows.map(([ref,x])=>{const v=x.actual-x.expected;return `<tr><td><b>${esc(x.it?.group||'')}</b><br>${esc(x.it?.size||'')} ${esc(x.it?.length||'')}${x.it?.length?' mm':''}</td><td>${esc(ref)}</td><td>${x.expected}</td><td>${x.actual}</td><td><span class="pill ${v?'warn':''}">${v>0?'+':''}${v}</span></td></tr>`}).join('')||'<tr><td colspan="5" style="text-align:center;padding:30px;color:#718096">No consignment inventory yet.</td></tr>'}</tbody></table></div></div>`);
  };
  window.openReports=function(){
    setNavActive('Reports');
    const c=counts(); const totalTx=(transactions||[]).length;
    showUtility('Reports',`<div class="dash-grid"><div class="panel"><div class="panel-head"><h3>Inventory summary</h3></div><div style="padding:18px"><p><b>${c.units}</b> units on hand</p><p><b>${c.exp}</b> units expiring within 18 months</p><p><b>${c.expired}</b> expired units</p><p><b>${c.disc}</b> consignment variance</p></div></div><div class="panel"><div class="panel-head"><h3>Transactions</h3></div><div style="padding:18px"><p><b>${totalTx}</b> recorded transactions</p><button class="primary" onclick="openTransactions()">View activity</button></div></div></div>`);
  };
  window.openSettings=function(){
    setNavActive('Settings');
    showUtility('Settings',`<div class="panel"><div class="panel-head"><h3>App settings</h3></div><div style="padding:18px"><p><b>Inventory mode:</b> Local browser storage</p><p><b>Expiration alert:</b> 18 months</p><p><b>Default location:</b> Implant Cabinet</p><p style="color:#718096">Use Cloud Sync to connect a Supabase project for shared multi-device inventory. Local backup/restore remains available.</p></div></div>`);
  };



  // V18 Reorder Center + Recall Center
  const RECALL_KEY='implantRecallRecords';
  const QUARANTINE_KEY='implantQuarantineLots';
  const ORDER_KEY='implantReorderList';
  function recallRecords(){try{return JSON.parse(localStorage.getItem(RECALL_KEY)||'[]')}catch(e){return[]}}
  function saveRecallRecords(a){localStorage.setItem(RECALL_KEY,JSON.stringify(a))}
  function quarantineLots(){try{return JSON.parse(localStorage.getItem(QUARANTINE_KEY)||'{}')}catch(e){return{}}}
  function isQuarantined(ref,lot){return !!quarantineLots()[ref+'|'+lot]}
  function setQuarantine(ref,lot,on=true){const q=quarantineLots();const k=ref+'|'+lot;if(on)q[k]={ref,lot,at:Date.now()};else delete q[k];localStorage.setItem(QUARANTINE_KEY,JSON.stringify(q))}
  function reorderList(){try{return JSON.parse(localStorage.getItem(ORDER_KEY)||'[]')}catch(e){return[]}}
  function saveReorderList(a){localStorage.setItem(ORDER_KEY,JSON.stringify(a))}
  function refInfo(ref){const it=item(ref);return it?`${it.group} · Ø${it.size}${it.length?' × '+it.length+' mm':''}`:`REF ${ref}`}
  function reorderCandidates(){return allItems().map(it=>{const lots=inventory[it.ref]||[];const on=lots.filter(x=>!isQuarantined(it.ref,x.lot)).reduce((s,x)=>s+(+x.qty||0),0);const min=productMinStock(it.ref);return {it,on,min,need:Math.max(0,min-on)}}).filter(x=>x.min>0&&x.on<x.min).sort((a,b)=>b.need-a.need)}
  function renderOrderList(){const list=reorderList();return list.length?`<div class="order-list">${list.map(x=>`<div class="order-item"><div><b>${esc(x.ref)}</b><small>${esc(refInfo(x.ref))}</small></div><div style="display:flex;align-items:center;gap:8px"><b>${x.qty}</b><button class="alt" onclick="removeFromOrder('${esc(x.ref)}')">Remove</button></div></div>`).join('')}<div style="display:flex;justify-content:space-between;align-items:center;padding-top:12px"><span class="order-total">${list.reduce((s,x)=>s+x.qty,0)} units requested</span><div style="display:flex;gap:8px"><button class="alt" onclick="copyReorderList()">Copy List</button><button class="primary" onclick="downloadReorderCSV()">Export CSV</button></div></div></div>`:'<div class="support-empty" style="padding:20px">No products are on the order list yet. Add low-stock products from the Reorder Center.</div>'}
  window.addToOrder=function(ref,qty){qty=Math.max(1,parseInt(qty||1,10)||1);const a=reorderList();const x=a.find(v=>v.ref===ref);if(x)x.qty=qty;else a.push({ref,qty});saveReorderList(a);openReorder();}
  window.removeFromOrder=function(ref){saveReorderList(reorderList().filter(x=>x.ref!==ref));openReorder();}
  window.copyReorderList=function(){const text=reorderList().map(x=>`${x.ref} — ${refInfo(x.ref)} — Qty ${x.qty}`).join('\n');if(!text){alert('Order list is empty.');return;}navigator.clipboard?.writeText(text).then(()=>alert('Order list copied.')).catch(()=>prompt('Copy this order list:',text));}
  window.downloadReorderCSV=function(){const rows=[['REF','Product','Quantity']].concat(reorderList().map(x=>[x.ref,refInfo(x.ref),x.qty]));const csv=rows.map(r=>r.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(',')).join('\n');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));a.download='implant-reorder-list.csv';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
  window.openReorder=function(){setNavActive('Reorder');const candidates=reorderCandidates(),order=reorderList();showUtility('Reorder Center',`<div class="reorder-summary"><div class="mini-stat"><span>Products below minimum</span><b>${candidates.length}</b></div><div class="mini-stat"><span>Units needed</span><b>${candidates.reduce((s,x)=>s+x.need,0)}</b></div><div class="mini-stat"><span>Order list</span><b>${order.length}</b></div></div><div class="panel"><div class="panel-head"><h3>Recommended Reorders</h3><button class="alt" onclick="openCatalog()">Open Catalog</button></div>${candidates.length?candidates.map(x=>`<div class="reorder-row"><div><b>${esc(x.it.group)}</b><small>REF ${esc(x.it.ref)} · Ø${esc(x.it.size)}${x.it.length?' × '+esc(x.it.length)+' mm':''}</small></div><div><small>On hand</small><b class="stock-bad">${x.on}</b></div><div><small>Minimum</small><b>${x.min}</b></div><div><small>Suggested</small><b>${x.need}</b></div><div class="row-action"><button class="primary" onclick="addToOrder('${esc(x.it.ref)}',${x.need})">Add to Order</button></div></div>`).join(''):'<div style="padding:26px;color:#718096;text-align:center">No reorder recommendations. Set minimum stock levels from a product detail page to activate automatic recommendations.</div>'}</div><div class="panel" style="margin-top:16px"><div class="panel-head"><h3>Current Order List</h3><button class="linkbtn" onclick="saveReorderList([]);openReorder()">Clear</button></div>${renderOrderList()}</div>`)}
  window.openRecall=function(){setNavActive('Recall Center');const rec=recallRecords();showUtility('Recall Center',`<div class="panel"><div class="panel-head"><h3>Check a REF or LOT</h3></div><div class="recall-form"><label>REF<input id="recallRef" placeholder="e.g. 26344"></label><label>LOT<input id="recallLot" placeholder="e.g. 482446"></label><label>Recall / reason<select id="recallReason"><option>Manufacturer recall</option><option>Safety notice</option><option>Quality concern</option><option>Other</option></select></label><label>Status<select id="recallStatus"><option>Active</option><option>Resolved</option></select></label><label style="grid-column:1/-1">Notes<textarea id="recallNotes" placeholder="Reason, notice number, manufacturer instructions, etc."></textarea></label></div><div class="recall-actions"><button class="primary" onclick="checkRecallMatch()">Check Inventory</button><button class="alt" onclick="saveRecall()">Save Recall</button></div><div id="recallMatch"></div></div><div class="panel" style="margin-top:16px"><div class="panel-head"><h3>Saved Recall Notices</h3></div>${rec.length?rec.slice().reverse().map(r=>{const hits=allLots().filter(x=>x.lot.qty>0&&(!r.ref||x.ref===r.ref)&&(!r.lot||x.lot.lot===r.lot));return `<div class="recall-row ${hits.length?'recall-hit':'recall-safe'}"><div><b>${esc(r.reason)}</b><small>${r.ref?'REF '+esc(r.ref):'All products'}${r.lot?' · LOT '+esc(r.lot):''} · ${esc(r.status)}</small></div><div><small>Inventory match</small><b>${hits.reduce((s,x)=>s+(+x.lot.qty||0),0)} units</b></div><div><small>Created</small><b>${esc(new Date(r.createdAt).toLocaleDateString())}</b></div><div><small>Notes</small><span>${esc(r.notes||'—')}</span></div><div class="row-action"><button class="alt" onclick="loadRecall('${esc(r.id)}')">Review</button></div></div>`}).join(''):'<div style="padding:26px;color:#718096;text-align:center">No recall notices saved. Use this screen to record a REF, LOT or safety notice and check your current inventory.</div>'}</div>`)}
  window.checkRecallMatch=function(){const ref=(document.getElementById('recallRef')?.value||'').trim();const lot=(document.getElementById('recallLot')?.value||'').trim();if(!ref&&!lot){alert('Enter a REF or LOT to check.');return;}const hits=allLots().filter(x=>x.lot.qty>0&&(!ref||x.ref===ref)&&(!lot||x.lot.lot===lot));const box=document.getElementById('recallMatch');box.innerHTML=`<div style="padding:14px 16px;border-top:1px solid #edf1f5">${hits.length?`<div class="recall-hit" style="padding:12px;border-radius:10px"><b>⚠ Matching inventory found</b>${hits.map(x=>`<div style="margin-top:8px"><b>${esc(x.it?.group||'')} · REF ${esc(x.ref)}</b><br><small>LOT ${esc(x.lot.lot)} · Qty ${esc(x.lot.qty)} · ${esc(x.lot.own)}${isQuarantined(x.ref,x.lot.lot)?' · QUARANTINED':''}</small><br><button class="alt" style="margin-top:6px" onclick="toggleQuarantine('${esc(x.ref)}','${esc(x.lot.lot)}')">${isQuarantined(x.ref,x.lot.lot)?'Release Quarantine':'Quarantine Lot'}</button></div>`).join('')}</div>`:'<div class="recall-safe" style="padding:12px;border-radius:10px"><b>✓ No matching inventory found</b><br><small>No current on-hand units match the REF/LOT entered.</small></div>'}</div>`}
  window.toggleQuarantine=function(ref,lot){setQuarantine(ref,lot,!isQuarantined(ref,lot));checkRecallMatch();dash();}
  window.saveRecall=function(){const ref=(document.getElementById('recallRef')?.value||'').trim(),lot=(document.getElementById('recallLot')?.value||'').trim();if(!ref&&!lot){alert('Enter a REF or LOT before saving the recall.');return;}const a=recallRecords();a.push({id:String(Date.now()),ref,lot,reason:document.getElementById('recallReason').value,status:document.getElementById('recallStatus').value,notes:document.getElementById('recallNotes').value.trim(),createdAt:Date.now()});saveRecallRecords(a);alert('Recall notice saved.');openRecall();}
  window.loadRecall=function(id){const r=recallRecords().find(x=>x.id===String(id));if(!r)return;openRecall();setTimeout(()=>{document.getElementById('recallRef').value=r.ref||'';document.getElementById('recallLot').value=r.lot||'';document.getElementById('recallReason').value=r.reason;document.getElementById('recallStatus').value=r.status;document.getElementById('recallNotes').value=r.notes||'';checkRecallMatch()},30)}

  // V16 Support document library. Files are stored locally in IndexedDB on this device/browser.
  const SUPPORT_DB='implantSupportDB'; const SUPPORT_STORE='documents';
  function supportDB(){return new Promise((resolve,reject)=>{const r=indexedDB.open(SUPPORT_DB,1);r.onupgradeneeded=()=>{const db=r.result;if(!db.objectStoreNames.contains(SUPPORT_STORE)){const s=db.createObjectStore(SUPPORT_STORE,{keyPath:'id',autoIncrement:true});s.createIndex('category','category');s.createIndex('name','name');}};r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});}
  async function supportAll(){const db=await supportDB();return new Promise((resolve,reject)=>{const t=db.transaction(SUPPORT_STORE,'readonly');const s=t.objectStore(SUPPORT_STORE);const a=s.getAll();a.onsuccess=()=>resolve(a.result.sort((x,y)=>(y.addedAt||0)-(x.addedAt||0)));a.onerror=()=>reject(a.error);});}
  async function supportAdd(doc){const db=await supportDB();return new Promise((resolve,reject)=>{const t=db.transaction(SUPPORT_STORE,'readwrite');const r=t.objectStore(SUPPORT_STORE).add(doc);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});}
  async function supportDelete(id){const db=await supportDB();return new Promise((resolve,reject)=>{const t=db.transaction(SUPPORT_STORE,'readwrite');const r=t.objectStore(SUPPORT_STORE).delete(Number(id));r.onsuccess=()=>resolve();r.onerror=()=>reject(r.error);});}
  async function supportGet(id){const db=await supportDB();return new Promise((resolve,reject)=>{const t=db.transaction(SUPPORT_STORE,'readonly');const r=t.objectStore(SUPPORT_STORE).get(Number(id));r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});}
  function supportFileSize(n){if(n<1024) return n+' B'; if(n<1048576) return (n/1024).toFixed(1)+' KB'; return (n/1048576).toFixed(1)+' MB';}
  function supportIcon(type,name){const n=(name||'').toLowerCase(); if(type==='application/pdf'||n.endsWith('.pdf'))return 'PDF'; if(type.startsWith('image/'))return 'IMG'; if(/\.docx?$/.test(n))return 'DOC'; if(/\.xlsx?$/.test(n))return 'XLS'; return 'FILE';}
  function supportDate(ts){try{return new Date(ts).toLocaleDateString(undefined,{year:'numeric',month:'short',day:'numeric'});}catch(e){return '';}}
  function renderSupportDocs(){const q=(document.getElementById('supportSearch')?.value||'').toLowerCase().trim(); const cat=document.getElementById('supportFilter')?.value||'All'; const wrap=document.getElementById('supportList'); if(!wrap)return; supportAll().then(docs=>{const rows=docs.filter(d=>(cat==='All'||d.category===cat)&&(!q||[d.name,d.category,d.description||''].join(' ').toLowerCase().includes(q))); wrap.innerHTML=rows.length?rows.map(d=>`<div class="support-doc"><div class="doc-icon">${esc(supportIcon(d.type,d.name))}</div><div class="doc-main"><b title="${esc(d.name)}">${esc(d.title||d.name)}</b><small><span class="support-badge">${esc(d.category)}</span> · ${esc(d.name)} · ${supportFileSize(d.size)} · Added ${supportDate(d.addedAt)}</small>${d.description?`<small>${esc(d.description)}</small>`:''}</div><div class="doc-actions"><button class="alt" onclick="openSupportDoc(${d.id})">Open</button><button class="alt" onclick="downloadSupportDoc(${d.id})">Download</button><button class="alt" onclick="removeSupportDoc(${d.id})">Delete</button></div></div>`).join(''):`<div class="support-empty">${q||cat!=='All'?'No documents match your search.':'No support documents uploaded yet. Add your catalogs, warranty forms, order forms, manuals or other reference documents here.'}</div>`;}).catch(()=>{wrap.innerHTML='<div class="support-empty">Unable to load the support library on this browser.</div>';});}
  window.openSupport=function(){setNavActive('Support');showUtility('Support',`<div class="support-grid"><div class="panel"><div class="panel-head"><h3>Document Library</h3></div><div class="support-upload"><div class="support-drop"><div style="font-size:30px">▣</div><h3 style="margin:6px 0">Upload support documents</h3><p style="margin:0;color:#718096">Keep catalogs, warranty forms, order forms, surgical manuals and other reference files with your inventory app.</p><input id="supportFile" type="file" accept=".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx,.xls,.xlsx" multiple><div class="support-fields"><label>Category<select id="supportCategory"><option>Catalog</option><option>Warranty / RMA</option><option>Order Form</option><option>Surgical / Technique</option><option>Pricing</option><option>Other</option></select></label><label>Document title<input id="supportTitle" placeholder="e.g. Astra EV Catalog"></label><label style="grid-column:1/-1">Notes (optional)<textarea id="supportNotes" placeholder="Add a short description or what this document is used for"></textarea></label></div><button class="primary" style="margin-top:12px" onclick="uploadSupportDocs()">＋ Add to Support Library</button><div class="support-note">Files are saved on this device/browser for now. Cloud sharing can be added later. Maximum recommended file size is 50 MB per file.</div></div></div></div><div class="panel"><div class="panel-head"><h3>Your Support Documents</h3><div style="display:flex;gap:8px"><input id="supportSearch" placeholder="Search documents…" oninput="renderSupportDocs()"><select id="supportFilter" onchange="renderSupportDocs()"><option>All</option><option>Catalog</option><option>Warranty / RMA</option><option>Order Form</option><option>Surgical / Technique</option><option>Pricing</option><option>Other</option></select></div></div><div id="supportList" class="support-list"><div class="support-empty">Loading…</div></div></div></div>`); setTimeout(renderSupportDocs,30);};
  window.uploadSupportDocs=async function(){const input=document.getElementById('supportFile'); const files=[...(input?.files||[])]; if(!files.length){alert('Choose at least one file first.');return;} const cat=document.getElementById('supportCategory').value; const title=document.getElementById('supportTitle').value.trim(); const notes=document.getElementById('supportNotes').value.trim(); const tooBig=files.find(f=>f.size>50*1024*1024); if(tooBig){alert(`${tooBig.name} is larger than 50 MB. Please choose a smaller file.`);return;} try{for(const f of files){await supportAdd({name:f.name,title:title||(files.length===1?f.name:f.name.replace(/\.[^.]+$/,'')),category:cat,description:notes,type:f.type||'application/octet-stream',size:f.size,addedAt:Date.now(),blob:f});} alert(`${files.length} document${files.length===1?'':'s'} added to Support.`); input.value=''; document.getElementById('supportTitle').value=''; document.getElementById('supportNotes').value=''; renderSupportDocs();}catch(e){console.error(e);alert('The file could not be saved. Your browser may be out of storage space.');}};
  window.openSupportDoc=async function(id){const d=await supportGet(id);if(!d)return;const url=URL.createObjectURL(d.blob);const w=window.open(url,'_blank');if(!w){alert('Pop-up blocked. Use Download instead.');}setTimeout(()=>URL.revokeObjectURL(url),60000);};
  window.downloadSupportDoc=async function(id){const d=await supportGet(id);if(!d)return;const url=URL.createObjectURL(d.blob);const a=document.createElement('a');a.href=url;a.download=d.name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
  window.removeSupportDoc=async function(id){const d=await supportGet(id);if(!d)return;if(!confirm(`Delete "${d.title||d.name}" from Support?`))return;await supportDelete(id);renderSupportDocs();};

  window.openCatalog=function(){setNavActive('Catalog');_openSystem('Astra Tech Implant EV');};
  // Better GS1 parsing + package identification workflow.
  window.parseGS1=function(raw){let t=String(raw||'').replace(/\u001d/g,'|');let gtin=(t.match(/(?:\(01\)|\b01)(\d{14})/)||[])[1]||'';let exp=(t.match(/(?:\(17\)|\b17)(\d{6})/)||[])[1]||'';let lot=(t.match(/\(10\)([^()|]{1,30})/)||[])[1]||'';if(!lot){let m=t.match(/(?:^|\|)10([^|]{1,30})/);if(m)lot=m[1];}let iso='';if(exp)iso='20'+exp.slice(0,2)+'-'+exp.slice(2,4)+'-'+exp.slice(4,6);return {gtin,exp:iso,lot,raw};};
  const GTIN_TO_REF={'07392532214431':'26344','07392532276729':'68011099'};
  window.handleInventoryBarcode=function(text){const d=parseGS1(text);let ref=GTIN_TO_REF[d.gtin]||''; if(!ref){const digits=String(text).match(/\b6\d{7,11}\b/);if(digits&&item(digits[0]))ref=digits[0];}const it=ref?item(ref):null;const r=document.getElementById('scanResult');if(!r)return;r.style.display='block';if(it){r.innerHTML=`<div style="font-size:12px;text-transform:uppercase;color:#718096;font-weight:800">Package identified</div><h3 style="margin:5px 0;color:#19324f">${esc(it.group)}</h3><div style="font-size:20px;font-weight:800">Ø${esc(it.size)} × ${esc(it.length)} mm</div><div style="margin-top:8px;color:#516277"><b>REF ${esc(it.ref)}</b> · LOT ${esc(d.lot||'Not read')} · EXP ${esc(d.exp||'Not read')}</div><div class="actions" style="margin-top:14px"><button onclick="openReceive('${esc(it.ref)}');document.getElementById('mLot').value='${esc(d.lot)}';document.getElementById('mExp').value='${esc(d.exp)}'">Receive / Scan In</button><button class="alt" onclick="openPull('${esc(it.ref)}');document.getElementById('mLot').value='${esc(d.lot)}';document.getElementById('mExp').value='${esc(d.exp)}'">Pull / Scan Out</button></div>`;}else{r.innerHTML=`<b>Package detected, but product match is missing.</b><br>GTIN: ${esc(d.gtin||'not read')} · LOT: ${esc(d.lot||'not read')} · EXP: ${esc(d.exp||'not read')}<br><button class="alt" style="margin-top:10px" onclick="openReceive()">Enter REF manually</button>`;}}
  // Re-render dashboard whenever inventory changes by wrapping save.
  const oldSave=window.save; window.save=function(){oldSave();dash();};
  document.addEventListener('DOMContentLoaded',dash); setTimeout(dash,100);
})();


(function(){
 const CASE_KEY='implantCasesV1';
 function cases(){try{return JSON.parse(localStorage.getItem(CASE_KEY)||'[]')}catch(e){return[]}}
 function saveCases(a){localStorage.setItem(CASE_KEY,JSON.stringify(a))}
 function caseEsc(v){return esc(String(v||''))}
 function caseProduct(ref){return item(ref)||null}
 function warrantyStatus(c){if(c.warrantyStatus==='Not Registered')return ['Not Registered','warranty-warn']; if(c.warrantyStatus==='Submitted')return ['Submitted','warranty-warn']; return ['Registered','warranty-good']}
 function caseFormHTML(c={}){return `<div class="panel"><div class="panel-head"><h3>${c.id?'Edit':'Add'} Implant Case</h3></div><div class="case-form">
 <label>Patient / Case ID<input id="casePatient" value="${caseEsc(c.patient)}" placeholder="Patient name or chart ID"></label>
 <label>Date Placed<input id="caseDate" type="date" value="${caseEsc(c.date||new Date().toISOString().slice(0,10))}"></label>
 <label>Doctor<input id="caseDoctor" value="${caseEsc(c.doctor)}" placeholder="Doctor"></label>
 <label>Tooth / Site<input id="caseTooth" value="${caseEsc(c.tooth)}" placeholder="e.g. #30 / UR anterior"></label>
 <label>REF<input id="caseRef" value="${caseEsc(c.ref)}" placeholder="e.g. 26344" oninput="caseProductPreview()"></label>
 <label>LOT<input id="caseLot" value="${caseEsc(c.lot)}" placeholder="Lot number"></label>
 <label>Quantity<input id="caseQty" type="number" min="1" value="${c.qty||1}"></label>
 <label>Warranty Status<select id="caseWarranty"><option>Not Registered</option><option>Submitted</option><option>Registered</option></select></label>
 <label class="full">Notes<textarea id="caseNotes" placeholder="Implant details, graft, membrane, manufacturer notes, etc.">${caseEsc(c.notes)}</textarea></label>
 <div class="full" id="caseProductPreview" style="padding:10px 12px;border-radius:10px;background:#f5f9fc;color:#52657a">Enter a REF to verify the product.</div>
 <div class="full case-actions"><button class="primary" onclick="saveCase('${caseEsc(c.id)}')">Save Case</button><button class="alt" onclick="openCases()">Cancel</button></div></div></div>`}
 window.caseProductPreview=function(){const ref=document.getElementById('caseRef')?.value.trim();const it=caseProduct(ref);const b=document.getElementById('caseProductPreview');if(!b)return;b.innerHTML=it?`<b>${caseEsc(it.group)}</b> · REF ${caseEsc(it.ref)} · Ø${caseEsc(it.size)}${it.length?' × '+caseEsc(it.length)+' mm':''}`:'Enter a valid catalog REF to verify the product.';}
 window.openCases=function(){setNavActive('Cases / Warranty');showUtility('Cases / Warranty',`<div class="case-wrap"><div><div class="panel"><div class="panel-head"><h3>Case & Warranty Tracking</h3><button class="primary" onclick="openCaseForm()">＋ Add Case</button></div><div class="case-kpis"><div class="case-kpi"><span>Total Cases</span><b id="caseTotal">0</b></div><div class="case-kpi"><span>Warranty Registered</span><b id="caseRegistered">0</b></div><div class="case-kpi"><span>Needs Registration</span><b id="caseNeeds">0</b></div></div><div style="padding:0 16px 12px"><input id="caseSearch" placeholder="Search patient, REF, LOT, tooth or doctor…" oninput="renderCases()"></div></div><div class="panel" style="margin-top:16px"><div class="panel-head"><h3>Cases</h3></div><div id="caseList" class="case-list"></div></div></div><div id="caseEditor"></div></div>`);setTimeout(renderCases,20)};
 window.openCaseForm=function(id=''){const c=cases().find(x=>x.id===id)||{};document.getElementById('caseEditor').innerHTML=caseFormHTML(c);if(c.warrantyStatus)document.getElementById('caseWarranty').value=c.warrantyStatus;caseProductPreview();};
 window.saveCase=function(id=''){const patient=document.getElementById('casePatient').value.trim(),date=document.getElementById('caseDate').value,doctor=document.getElementById('caseDoctor').value.trim(),tooth=document.getElementById('caseTooth').value.trim(),ref=document.getElementById('caseRef').value.trim(),lot=document.getElementById('caseLot').value.trim(),qty=+document.getElementById('caseQty').value,warrantyStatus=document.getElementById('caseWarranty').value,notes=document.getElementById('caseNotes').value.trim();if(!patient||!date||!ref||!lot||!qty){alert('Patient / Case ID, date, REF, LOT and quantity are required.');return}if(!item(ref)){alert('Enter a valid catalog REF.');return}const a=cases();const obj={id:id||String(Date.now()),patient,date,doctor,tooth,ref,lot,qty,warrantyStatus,notes,updatedAt:Date.now(),createdAt:id?(a.find(x=>x.id===id)?.createdAt||Date.now()):Date.now()};const i=a.findIndex(x=>x.id===obj.id);if(i>=0)a[i]=obj;else a.push(obj);saveCases(a);openCases();};
 window.renderCases=function(){const wrap=document.getElementById('caseList');if(!wrap)return;const q=(document.getElementById('caseSearch')?.value||'').toLowerCase().trim();const a=cases().filter(c=>!q||[c.patient,c.doctor,c.tooth,c.ref,c.lot,c.notes].join(' ').toLowerCase().includes(q)).sort((x,y)=>(y.date||'').localeCompare(x.date||''));document.getElementById('caseTotal').textContent=cases().length;document.getElementById('caseRegistered').textContent=cases().filter(c=>c.warrantyStatus==='Registered').length;document.getElementById('caseNeeds').textContent=cases().filter(c=>c.warrantyStatus!=='Registered').length;wrap.innerHTML=a.length?a.map(c=>{const it=item(c.ref),ws=warrantyStatus(c);return `<div class="case-row"><div><b>${caseEsc(c.patient)}</b><small>${caseEsc(c.date)} · ${caseEsc(c.tooth||'Site not entered')}</small></div><div><b>${caseEsc(it?.group||'Unknown product')}</b><small>REF ${caseEsc(c.ref)}</small></div><div><b>LOT ${caseEsc(c.lot)}</b><small>Qty ${caseEsc(c.qty)}</small></div><div><span class="case-badge ${ws[1]}">${ws[0]}</span><small>${caseEsc(c.doctor||'Doctor not entered')}</small></div><div class="row-action"><button class="alt" onclick="openCaseDetail('${caseEsc(c.id)}')">View</button></div></div>`}).join(''):'<div style="padding:28px;text-align:center;color:#718096">No cases yet. Add an implant case to begin lot and warranty tracking.</div>';};
 window.openCaseDetail=function(id){const c=cases().find(x=>x.id===id);if(!c)return;const it=item(c.ref),ws=warrantyStatus(c);document.getElementById('caseEditor').innerHTML=`<div class="panel"><div class="panel-head"><h3>Case Details</h3><div class="case-actions"><button class="alt" onclick="openCaseForm('${caseEsc(id)}')">Edit</button><button class="alt" onclick="deleteCase('${caseEsc(id)}')">Delete</button></div></div><div class="case-detail"><h2 style="margin-top:0;color:#19324f">${caseEsc(c.patient)}</h2><div class="case-detail-grid"><div><span>Date Placed</span><b>${caseEsc(c.date)}</b></div><div><span>Doctor</span><b>${caseEsc(c.doctor||'—')}</b></div><div><span>Tooth / Site</span><b>${caseEsc(c.tooth||'—')}</b></div><div><span>Warranty</span><b class="${ws[1]}">${ws[0]}</b></div><div><span>Product</span><b>${caseEsc(it?.group||'Unknown')} · REF ${caseEsc(c.ref)}</b></div><div><span>LOT</span><b>${caseEsc(c.lot)} · Qty ${caseEsc(c.qty)}</b></div></div><div style="margin-top:14px;padding:12px;border-radius:10px;background:#f7fafc"><b>Notes</b><div style="margin-top:5px;color:#52657a">${caseEsc(c.notes||'No notes entered.')}</div></div><div class="case-actions" style="margin-top:14px"><button onclick="markWarranty('${caseEsc(id)}','Registered')">Mark Warranty Registered</button><button class="alt" onclick="openRecallForCase('${caseEsc(c.ref)}','${caseEsc(c.lot)}')">Check Recall for LOT</button></div></div></div>`;};
 window.deleteCase=function(id){if(!confirm('Delete this case record?'))return;saveCases(cases().filter(c=>c.id!==id));openCases()};
 window.markWarranty=function(id,status){const a=cases(),c=a.find(x=>x.id===id);if(!c)return;c.warrantyStatus=status;c.updatedAt=Date.now();saveCases(a);openCaseDetail(id)};
 window.openRecallForCase=function(ref,lot){openRecall();setTimeout(()=>{document.getElementById('recallRef').value=ref;document.getElementById('recallLot').value=lot;checkRecallMatch()},40)};
 // Capture existing pull transaction and create a case shortcut when patient is entered.
 const priorSaveModal=window.saveModal;
 window.saveModal=function(){const patient=document.getElementById('mPatient')?.value.trim()||'';const before=transactions.length;priorSaveModal();if(mode==='pull'&&patient&&transactions.length>before){const t=transactions[transactions.length-1];const existing=cases();if(!existing.some(c=>c.patient===patient&&c.ref===t.ref&&c.lot===t.lot&&c.date===new Date().toISOString().slice(0,10))){existing.push({id:String(Date.now()),patient,date:new Date().toISOString().slice(0,10),doctor:'',tooth:'',ref:t.ref,lot:t.lot,qty:t.qty,warrantyStatus:'Not Registered',notes:'Created from Scan Out / Pull transaction.',createdAt:Date.now(),updatedAt:Date.now()});saveCases(existing)}}};
})();

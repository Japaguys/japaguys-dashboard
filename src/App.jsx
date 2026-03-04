import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAB269a1r0ki9YBCo8oqRmXieV6rXKgyno",
  authDomain: "japaguys-dashboard.firebaseapp.com",
  projectId: "japaguys-dashboard",
  storageBucket: "japaguys-dashboard.firebasestorage.app",
  messagingSenderId: "265849413817",
  appId: "1:265849413817:web:22935a210c843b022f7b68"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const SHEET_URL = "https://script.google.com/macros/s/AKfycby-uepqjBAAjUXMBV1DzEteIs2j1XjjEQD9FBfi33a07222thD0jS3ZO7K7Yqic_HKx/exec";

// APPLICANTS columns (row index, 0-based, data starts row 3 = index 2):
// 0=Full Name, 1=Email, 2=Phone, 3=Address, 4=Level, 5=Field,
// 6=Service, 7=Payable, 8=Paid, 9=Outstanding(formula-skip), 10=Documents, 11=Year

// APPLICATIONS columns (data starts row 3 = index 2):
// 0=Applicant Name, 1=University, 2=Country, 3=Programme, 4=Period,
// 5=App Fee, 6=Tuition, 7=Our Progress, 8=School Status, 9=Notes

const SC = {
  "Submitted":         {bg:"#1e3a5f",color:"#60a5fa",border:"#3b82f6"},
  "Pending - Japaguys":{bg:"#431407",color:"#fb923c",border:"#ea580c"},
  "Pending - Applicant":{bg:"#3d2e0a",color:"#fbbf24",border:"#f59e0b"},
  "Not Started":       {bg:"#1f2937",color:"#9ca3af",border:"#4b5563"},
};
const KC = {
  "Admission Granted":  {bg:"#064e3b",color:"#34d399",border:"#10b981"},
  "Admission Denied":   {bg:"#450a0a",color:"#f87171",border:"#ef4444"},
  "Awaiting Response":  {bg:"#1e3a5f",color:"#60a5fa",border:"#3b82f6"},
  "Awaiting Entrance Exam":{bg:"#2e1b5e",color:"#a78bfa",border:"#8b5cf6"},
  "Invited for Interview":{bg:"#2e1b5e",color:"#c4b5fd",border:"#8b5cf6"},
  "Pending":            {bg:"#3d2e0a",color:"#fbbf24",border:"#f59e0b"},
  "No Status Yet":      {bg:"#1f2937",color:"#9ca3af",border:"#4b5563"},
};

const Bdg = ({l,m})=>{ const s=(m&&m[l])||{bg:"#1f2937",color:"#9ca3af",border:"#4b5563"}; return <span style={{background:s.bg,color:s.color,border:`1px solid ${s.border}`,borderRadius:20,padding:"3px 10px",fontSize:11,fontWeight:700,whiteSpace:"nowrap",display:"inline-block"}}>{l||"N/A"}</span>; };
const MC = ({label,value,accent,sub})=><div style={{background:"#0f1923",border:"1px solid #1e2d3d",borderRadius:12,padding:"18px 20px",borderTop:`3px solid ${accent}`}}><div style={{fontSize:11,color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8}}>{label}</div><div style={{fontSize:28,fontWeight:900,color:accent,fontFamily:"'Syne',sans-serif",lineHeight:1}}>{value}</div>{sub&&<div style={{fontSize:11,color:"#4b5563",marginTop:4}}>{sub}</div>}</div>;
const PB = ({label,val,total,color})=><div style={{marginBottom:14}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><span style={{fontSize:13,color:"#d1d5db"}}>{label}</span><span style={{fontSize:13,fontWeight:700,color}}>{val}</span></div><div style={{height:6,background:"#1e2d3d",borderRadius:3}}><div style={{height:6,background:color,borderRadius:3,width:`${total?(val/total*100):0}%`,transition:"width 0.8s"}}/></div></div>;

function Login(){
  const [e,sE]=useState(""); const [p,sP]=useState(""); const [err,sErr]=useState(""); const [ld,sLd]=useState(false);
  const go=async()=>{ if(!e||!p){sErr("Enter email and password.");return;} sLd(true);sErr(""); try{await signInWithEmailAndPassword(auth,e,p);}catch{sErr("Incorrect email or password.");} sLd(false); };
  const inp={width:"100%",background:"#060d14",border:"1px solid #1e2d3d",borderRadius:8,padding:"11px 14px",color:"#f9fafb",fontSize:14,outline:"none",boxSizing:"border-box",fontFamily:"'DM Sans',sans-serif"};
  return(
    <div style={{minHeight:"100vh",background:"#060d14",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'DM Sans',sans-serif"}}>
      <div style={{width:400}}>
        <div style={{textAlign:"center",marginBottom:40}}>
          <div style={{fontSize:13,color:"#d97706",fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:10}}>Internal Portal</div>
          <div style={{fontSize:44,fontWeight:900,color:"#f9fafb",fontFamily:"'Syne',sans-serif",lineHeight:1}}>Japaguys</div>
          <div style={{color:"#4b5563",marginTop:8,fontSize:13}}>Study Abroad Operations Dashboard</div>
        </div>
        <div style={{background:"#0f1923",border:"1px solid #1e2d3d",borderRadius:16,padding:"36px 32px"}}>
          <div style={{marginBottom:18}}><label style={{fontSize:12,color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.08em",display:"block",marginBottom:8}}>Email</label><input value={e} onChange={x=>sE(x.target.value)} type="email" placeholder="you@example.com" onKeyDown={x=>x.key==="Enter"&&go()} style={inp}/></div>
          <div style={{marginBottom:24}}><label style={{fontSize:12,color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.08em",display:"block",marginBottom:8}}>Password</label><input value={p} onChange={x=>sP(x.target.value)} type="password" placeholder="••••••••" onKeyDown={x=>x.key==="Enter"&&go()} style={inp}/></div>
          {err&&<div style={{color:"#f87171",fontSize:13,marginBottom:16,background:"#450a0a",padding:"10px 14px",borderRadius:8}}>{err}</div>}
          <button onClick={go} disabled={ld} style={{width:"100%",background:"#d97706",border:"none",borderRadius:8,padding:"13px",color:"#fff",fontWeight:700,fontSize:15,cursor:ld?"not-allowed":"pointer",opacity:ld?0.7:1,fontFamily:"'DM Sans',sans-serif"}}>{ld?"Signing in...":"Sign In"}</button>
        </div>
      </div>
    </div>
  );
}

export default function App(){
  const [user,sU]=useState(null); const [ready,sR]=useState(false);
  const [data,sD]=useState(null); const [ld,sL]=useState(true);
  const [view,sV]=useState("summary"); const [sel,sSel]=useState(null);
  const [search,sS]=useState(""); const [filt,sFilt]=useState({country:"",status:"",school:"",service:"",year:""});
  const [now,sN]=useState(new Date()); const [tab,sTab]=useState("applications");

  useEffect(()=>{ const u=onAuthStateChanged(auth,u=>{sU(u);sR(true);}); return u; },[]);
  useEffect(()=>{ const t=setInterval(()=>sN(new Date()),1000); return()=>clearInterval(t); },[]);

  useEffect(()=>{
    if(!user)return;
    sL(true);
    fetch(SHEET_URL)
      .then(r=>r.json())
      .then(raw=>{
        // Skip row 1 (blank) and row 2 (headers) — data starts at index 2
        const appRows = raw.applicants.slice(2).filter(r=>r[0]&&String(r[0]).trim());
        const applicants = appRows.map((r,i)=>{
          const payable = Number(r[7])||0;
          const paid    = Number(r[8])||0;
          return {
            id:          `JAP${String(i+1).padStart(3,"0")}`,
            name:        String(r[0]||"").trim(),
            email:       String(r[1]||"").trim(),
            phone:       String(r[2]||"").trim(),
            address:     String(r[3]||"").trim(),
            level:       String(r[4]||"").trim(),
            field:       String(r[5]||"").trim(),
            service:     String(r[6]||"").trim(),
            payable,
            paid,
            outstanding: payable - paid,   // calculate ourselves, ignore formula in col 9
            documents:   r[10] ? String(r[10]).split(",").map(d=>d.trim()).filter(Boolean) : [],
            year:        String(r[11]||"").trim(),
          };
        });

        const appliRows = raw.applications.slice(2).filter(r=>r[0]&&r[1]);
        const applications = appliRows.map(r=>({
          clientName:  String(r[0]||"").trim(),
          university:  String(r[1]||"").trim(),
          country:     String(r[2]||"").trim(),
          programme:   String(r[3]||"").trim(),
          period:      String(r[4]||"").trim(),
          appFee:      String(r[5]||"Free").trim(),
          tuition:     String(r[6]||"").trim(),
          ourProgress: String(r[7]||"").trim(),
          schoolStatus:String(r[8]||"").trim(),
          notes:       String(r[9]||"").trim(),
        }));

        // Link each application to its applicant by matching name
        const linked = applications.map(ap=>{
          const match = applicants.find(a=>a.name.toLowerCase()===ap.clientName.toLowerCase());
          return {...ap, clientId: match ? match.id : null};
        });

        sD({applicants, applications:linked});
        sL(false);
      })
      .catch(err=>{ console.error("Sheet fetch error:",err); sL(false); });
  },[user]);

  if(!ready)return null;
  if(!user)return <Login/>;

  const nm  = user.email.split("@")[0];
  const hr  = now.getHours();
  const gr  = hr<12?"Good morning":hr<17?"Good afternoon":"Good evening";
  const fT  = d=>d.toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit",second:"2-digit"});
  const fD  = d=>d.toLocaleDateString("en-GB",{weekday:"long",year:"numeric",month:"long",day:"numeric"});

  if(ld||!data)return(
    <div style={{minHeight:"100vh",background:"#060d14",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'DM Sans',sans-serif"}}>
      <div style={{textAlign:"center"}}>
        <div style={{width:40,height:40,border:"3px solid #1e2d3d",borderTop:"3px solid #d97706",borderRadius:"50%",animation:"spin 0.8s linear infinite",margin:"0 auto 16px"}}/>
        <div style={{color:"#6b7280"}}>Loading from Google Sheets...</div>
      </div>
    </div>
  );

  const {applicants, applications} = data;
  const tot = applications.length;
  const tc  = applicants.length;
  const sub = applications.filter(a=>a.ourProgress==="Submitted").length;
  const pC  = applications.filter(a=>a.ourProgress==="Pending - Applicant").length;
  const pU  = applications.filter(a=>a.ourProgress==="Pending - Japaguys").length;
  const nS  = applications.filter(a=>a.ourProgress==="Not Started").length;
  const adm = applications.filter(a=>a.schoolStatus==="Admission Granted").length;
  const den = applications.filter(a=>a.schoolStatus==="Admission Denied").length;
  const owed= applicants.reduce((s,c)=>s+(c.outstanding>0?c.outstanding:0),0);

  // Build country stats
  const cMap = {};
  applications.forEach(a=>{
    if(!a.country) return;
    const c = a.country.trim();
    if(!cMap[c]) cMap[c]={total:0,appFees:new Set(),tuitions:new Set(),statuses:{}};
    cMap[c].total++;
    if(a.appFee) cMap[c].appFees.add(a.appFee);
    if(a.tuition) cMap[c].tuitions.add(a.tuition);
    if(a.schoolStatus) cMap[c].statuses[a.schoolStatus]=(cMap[c].statuses[a.schoolStatus]||0)+1;
  });
  const countries = Object.entries(cMap).sort((a,b)=>b[1].total-a[1].total);

  const allC  = [...new Set(applications.map(a=>a.country?.trim()).filter(Boolean))].sort();
  const allSt = [...new Set(applications.map(a=>a.ourProgress).filter(Boolean))].sort();
  const allSc = [...new Set(applications.map(a=>a.schoolStatus).filter(Boolean))].sort();
  const allY  = [...new Set(applicants.map(a=>a.year).filter(Boolean))].sort();

  const filtered = applicants.filter(c=>{
    const ms = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.id.toLowerCase().includes(search.toLowerCase()) || c.field.toLowerCase().includes(search.toLowerCase());
    const ca = applications.filter(a=>a.clientId===c.id);
    return ms
      && (!filt.country  || ca.some(a=>a.country?.trim()===filt.country))
      && (!filt.status   || ca.some(a=>a.ourProgress===filt.status))
      && (!filt.school   || ca.some(a=>a.schoolStatus===filt.school))
      && (!filt.service  || c.service===filt.service)
      && (!filt.year     || c.year===filt.year);
  });

  const cApps = sel ? applications.filter(a=>a.clientId===sel.id) : [];
  const SI = {background:"#0f1923",border:"1px solid #1e2d3d",borderRadius:8,padding:"8px 12px",color:"#f9fafb",fontSize:13,fontFamily:"'DM Sans',sans-serif",outline:"none",cursor:"pointer"};
  const isActive = id => view===id || (view==="client" && id==="clients");

  return <>
    <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@300;400;500;600;700&display=swap');@keyframes spin{to{transform:rotate(360deg)}}*{box-sizing:border-box;margin:0;padding:0}body{background:#060d14}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:#060d14}::-webkit-scrollbar-thumb{background:#1e2d3d;border-radius:3px}input::placeholder{color:#374151}select option{background:#0f1923}`}</style>
    <div style={{display:"flex",minHeight:"100vh",fontFamily:"'DM Sans',sans-serif",background:"#060d14",color:"#f9fafb"}}>

      {/* ── SIDEBAR ── */}
      <div style={{width:230,background:"#0a1520",borderRight:"1px solid #1e2d3d",display:"flex",flexDirection:"column",padding:"28px 0",position:"fixed",height:"100vh",zIndex:100}}>
        <div style={{padding:"0 24px 32px"}}>
          <div style={{fontSize:10,color:"#d97706",fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:6}}>Japaguys</div>
          <div style={{fontSize:20,fontWeight:900,color:"#f9fafb",fontFamily:"'Syne',sans-serif"}}>Operations</div>
          <div style={{fontSize:11,color:"#4b5563",marginTop:2}}>Study Abroad Dashboard</div>
        </div>
        {[{id:"summary",icon:"▦",label:"Overview"},{id:"clients",icon:"👥",label:"All Clients"},{id:"countries",icon:"🌍",label:"Countries & Fees"}].map(item=>(
          <button key={item.id} onClick={()=>{sV(item.id);sSel(null);sS("");}}
            style={{display:"flex",alignItems:"center",gap:12,padding:"12px 24px",background:isActive(item.id)?"#1e2d3d":"none",border:"none",borderLeft:isActive(item.id)?"3px solid #d97706":"3px solid transparent",color:isActive(item.id)?"#f9fafb":"#6b7280",cursor:"pointer",fontSize:14,fontWeight:isActive(item.id)?600:400,fontFamily:"'DM Sans',sans-serif",textAlign:"left",width:"100%"}}>
            <span>{item.icon}</span>{item.label}
            {item.id==="clients"&&<span style={{marginLeft:"auto",fontSize:11,background:"#1e3a5f",color:"#60a5fa",padding:"1px 7px",borderRadius:10}}>{tc}</span>}
          </button>
        ))}
        <div style={{marginTop:"auto",padding:"0 24px"}}>
          <div style={{borderTop:"1px solid #1e2d3d",paddingTop:20}}>
            <div style={{fontSize:11,color:"#374151",marginBottom:4}}>Signed in as</div>
            <div style={{fontSize:12,color:"#9ca3af",fontWeight:600,marginBottom:14,wordBreak:"break-all"}}>{user.email}</div>
            <button onClick={()=>signOut(auth)} style={{width:"100%",background:"#1e2d3d",border:"1px solid #2d4a6b",borderRadius:8,padding:"9px",color:"#9ca3af",fontSize:13,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>Sign Out</button>
          </div>
        </div>
      </div>

      {/* ── MAIN ── */}
      <div style={{marginLeft:230,flex:1,padding:"36px 40px",minHeight:"100vh"}}>

        {/* Top bar */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:36,flexWrap:"wrap",gap:16}}>
          <div>
            {view==="client"&&sel&&<div style={{fontSize:12,marginBottom:6}}>
              <button onClick={()=>{sV("clients");sSel(null);}} style={{background:"none",border:"none",color:"#6b7280",cursor:"pointer",fontSize:12,fontFamily:"'DM Sans',sans-serif"}}>← All Clients</button>
              <span style={{margin:"0 6px",color:"#374151"}}>/</span>
              <span style={{color:"#d97706"}}>{sel.id}</span>
            </div>}
            <div style={{fontSize:13,color:"#d97706",fontWeight:600,letterSpacing:"0.08em",marginBottom:4}}>{gr}, {nm} 👋</div>
            <div style={{fontSize:30,fontWeight:900,color:"#f9fafb",fontFamily:"'Syne',sans-serif"}}>{view==="summary"?"Overview":view==="clients"?"All Clients":view==="countries"?"Countries & Fees":sel?.name||""}</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:24,fontWeight:700,color:"#f9fafb",fontFamily:"'Syne',sans-serif",letterSpacing:"0.05em"}}>{fT(now)}</div>
            <div style={{fontSize:12,color:"#6b7280",marginTop:3}}>{fD(now)}</div>
          </div>
        </div>

        {/* ── SUMMARY ── */}
        {view==="summary"&&<div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(148px,1fr))",gap:14,marginBottom:32}}>
            <MC label="Total Clients"       value={tc}  accent="#d97706"/>
            <MC label="Total Applications"  value={tot} accent="#3b82f6"/>
            <MC label="Submitted"           value={sub} accent="#10b981"/>
            <MC label="Pending — Us"        value={pU}  accent="#f97316"/>
            <MC label="Pending — Client"    value={pC}  accent="#f59e0b"/>
            <MC label="Not Started"         value={nS}  accent="#6b7280"/>
            <MC label="Admissions Granted"  value={adm} accent="#8b5cf6"/>
            <MC label="Admissions Denied"   value={den} accent="#ef4444"/>
            <MC label="Total Outstanding"   value={`₦${Math.round(owed/1000)}k`} accent="#d97706" sub={`₦${owed.toLocaleString()}`}/>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginBottom:28}}>
            <div style={{background:"#0f1923",border:"1px solid #1e2d3d",borderRadius:12,padding:24}}>
              <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,color:"#f9fafb",marginBottom:20,fontSize:15}}>Our Progress</div>
              <PB label="Submitted"           val={sub} total={tot} color="#3b82f6"/>
              <PB label="Pending — Us"        val={pU}  total={tot} color="#f97316"/>
              <PB label="Pending — Applicant" val={pC}  total={tot} color="#f59e0b"/>
              <PB label="Not Started"         val={nS}  total={tot} color="#6b7280"/>
            </div>
            <div style={{background:"#0f1923",border:"1px solid #1e2d3d",borderRadius:12,padding:24}}>
              <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,color:"#f9fafb",marginBottom:20,fontSize:15}}>School Responses</div>
              <PB label="Awaiting Response" val={applications.filter(a=>a.schoolStatus==="Awaiting Response").length} total={tot} color="#3b82f6"/>
              <PB label="Admission Granted" val={adm} total={tot} color="#10b981"/>
              <PB label="Admission Denied"  val={den} total={tot} color="#ef4444"/>
              <PB label="Other / Pending"   val={applications.filter(a=>!["Awaiting Response","Admission Granted","Admission Denied"].includes(a.schoolStatus)).length} total={tot} color="#6b7280"/>
            </div>
          </div>

          <div style={{background:"#0f1923",border:"1px solid #1e2d3d",borderRadius:12,padding:24}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,color:"#f9fafb",fontSize:15}}>Applications by Country</div>
              <button onClick={()=>sV("countries")} style={{background:"none",border:"1px solid #1e2d3d",borderRadius:8,padding:"5px 14px",color:"#d97706",fontSize:12,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>Full breakdown →</button>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:12}}>
              {countries.map(([country,info])=>(
                <div key={country} style={{background:"#060d14",border:"1px solid #1e2d3d",borderRadius:10,padding:"14px 16px"}}>
                  <div style={{fontSize:13,color:"#f9fafb",fontWeight:600,marginBottom:4}}>{country}</div>
                  <div style={{fontSize:24,fontWeight:900,color:"#3b82f6",fontFamily:"'Syne',sans-serif"}}>{info.total}</div>
                  <div style={{fontSize:11,color:"#6b7280"}}>applications</div>
                </div>
              ))}
            </div>
          </div>
        </div>}

        {/* ── CLIENTS ── */}
        {view==="clients"&&<div>
          <div style={{background:"#0f1923",border:"1px solid #1e2d3d",borderRadius:12,padding:"20px 24px",marginBottom:24}}>
            <div style={{fontSize:11,color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:14}}>Search & Filter</div>
            <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
              <input placeholder="Search name or field..." value={search} onChange={e=>sS(e.target.value)} style={{...SI,width:240,padding:"9px 14px"}}/>
              <select value={filt.country} onChange={e=>sFilt(f=>({...f,country:e.target.value}))} style={SI}><option value="">All Countries</option>{allC.map(c=><option key={c}>{c}</option>)}</select>
              <select value={filt.status}  onChange={e=>sFilt(f=>({...f,status:e.target.value}))}  style={SI}><option value="">All Progress</option>{allSt.map(s=><option key={s}>{s}</option>)}</select>
              <select value={filt.school}  onChange={e=>sFilt(f=>({...f,school:e.target.value}))}  style={SI}><option value="">All School Statuses</option>{allSc.map(s=><option key={s}>{s}</option>)}</select>
              <select value={filt.service} onChange={e=>sFilt(f=>({...f,service:e.target.value}))} style={SI}><option value="">All Services</option><option>Done-For-You</option><option>Do-It-Yourself</option></select>
              <select value={filt.year}    onChange={e=>sFilt(f=>({...f,year:e.target.value}))}    style={SI}><option value="">All Years</option>{allY.map(y=><option key={y}>{y}</option>)}</select>
              <button onClick={()=>{sFilt({country:"",status:"",school:"",service:"",year:""});sS("");}} style={{...SI,background:"#1e2d3d",color:"#9ca3af"}}>✕ Clear</button>
            </div>
            <div style={{marginTop:12,fontSize:12,color:"#4b5563"}}>Showing <strong style={{color:"#f9fafb"}}>{filtered.length}</strong> of {tc} clients</div>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:14}}>
            {filtered.map(client=>{
              const ca   = applications.filter(a=>a.clientId===client.id);
              const hA   = ca.some(a=>a.schoolStatus==="Admission Granted");
              const sCnt = ca.filter(a=>a.ourProgress==="Submitted").length;
              const pCnt = ca.filter(a=>a.ourProgress?.includes("Pending")).length;
              return(
                <button key={client.id}
                  onClick={()=>{sSel(client);sV("client");sTab("applications");}}
                  onMouseEnter={e=>e.currentTarget.style.background="#131f2e"}
                  onMouseLeave={e=>e.currentTarget.style.background="#0f1923"}
                  style={{background:"#0f1923",border:"1px solid #1e2d3d",borderRadius:12,padding:"18px 20px",textAlign:"left",cursor:"pointer",borderLeft:hA?"3px solid #10b981":client.outstanding>0?"3px solid #f59e0b":"3px solid #1e2d3d",fontFamily:"'DM Sans',sans-serif",width:"100%"}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:8,alignItems:"flex-start"}}>
                    <div>
                      <div style={{fontSize:10,color:"#4b5563",marginBottom:3,fontWeight:600}}>{client.id}</div>
                      <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,color:"#f9fafb",fontSize:15}}>{client.name}</div>
                    </div>
                    {client.outstanding>0&&<span style={{fontSize:11,color:"#f59e0b",background:"#3d2e0a",padding:"2px 8px",borderRadius:20,border:"1px solid #f59e0b33",whiteSpace:"nowrap",flexShrink:0}}>₦{client.outstanding.toLocaleString()}</span>}
                  </div>
                  <div style={{fontSize:12,color:"#6b7280",marginBottom:10}}>{client.field} · {client.level} · {client.year}</div>
                  <div style={{display:"flex",gap:8,flexWrap:"wrap",fontSize:11}}>
                    <span style={{color:"#6b7280"}}>{ca.length} apps</span>
                    {sCnt>0&&<><span style={{color:"#374151"}}>·</span><span style={{color:"#60a5fa"}}>{sCnt} submitted</span></>}
                    {pCnt>0&&<><span style={{color:"#374151"}}>·</span><span style={{color:"#fbbf24"}}>{pCnt} pending</span></>}
                    {hA&&<><span style={{color:"#374151"}}>·</span><span style={{color:"#34d399",fontWeight:700}}>🎉 Admitted</span></>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>}

        {/* ── CLIENT DETAIL ── */}
        {view==="client"&&sel&&<div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:16,marginBottom:28}}>
            <div>
              <div style={{display:"flex",gap:14,flexWrap:"wrap",marginTop:8}}>
                {[{i:"📧",v:sel.email},{i:"📞",v:sel.phone},{i:"📍",v:sel.address}].filter(x=>x.v&&x.v.trim()).map((x,i)=><span key={i} style={{fontSize:13,color:"#6b7280"}}>{x.i} {x.v}</span>)}
              </div>
              <div style={{marginTop:10,display:"flex",gap:10,flexWrap:"wrap"}}>
                <span style={{fontSize:12,background:"#1e2d3d",color:"#9ca3af",padding:"3px 10px",borderRadius:20}}>{sel.level}</span>
                <span style={{fontSize:12,background:"#1e2d3d",color:"#9ca3af",padding:"3px 10px",borderRadius:20}}>{sel.field}</span>
                <span style={{fontSize:12,background:sel.service==="Done-For-You"?"#064e3b":"#1e3a5f",color:sel.service==="Done-For-You"?"#34d399":"#60a5fa",padding:"3px 10px",borderRadius:20}}>{sel.service}</span>
              </div>
            </div>
            <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
              {[
                {label:"Service Fee",  val:`₦${sel.payable.toLocaleString()}`,          color:"#9ca3af",bg:"#0f1923"},
                {label:"Amount Paid",  val:`₦${sel.paid.toLocaleString()}`,              color:"#34d399",bg:"#0f1923"},
                {label:"Outstanding",  val:`₦${Math.max(0,sel.outstanding).toLocaleString()}`, color:sel.outstanding>0?"#fbbf24":"#34d399",bg:sel.outstanding>0?"#3d2e0a":"#064e3b"},
              ].map((x,i)=>(
                <div key={i} style={{background:x.bg,border:"1px solid #1e2d3d",borderRadius:12,padding:"14px 18px",textAlign:"center"}}>
                  <div style={{fontSize:11,color:"#6b7280",marginBottom:4}}>{x.label}</div>
                  <div style={{fontFamily:"'Syne',sans-serif",fontSize:18,fontWeight:800,color:x.color}}>{x.val}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{display:"flex",gap:4,borderBottom:"1px solid #1e2d3d",marginBottom:24}}>
            {[{id:"applications",label:`Applications (${cApps.length})`},{id:"documents",label:`Documents (${sel.documents.length})`},{id:"payment",label:"Payment"}].map(t=>(
              <button key={t.id} onClick={()=>sTab(t.id)} style={{background:"none",border:"none",padding:"10px 20px",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontSize:14,fontWeight:tab===t.id?700:400,color:tab===t.id?"#d97706":"#6b7280",borderBottom:tab===t.id?"2px solid #d97706":"2px solid transparent",marginBottom:-1}}>{t.label}</button>
            ))}
          </div>

          {tab==="applications"&&(
            cApps.length===0
              ? <div style={{color:"#6b7280",padding:20}}>No applications found.</div>
              : <div style={{display:"flex",flexDirection:"column",gap:14}}>
                  {cApps.map((app,i)=>(
                    <div key={i} style={{background:"#0f1923",border:"1px solid #1e2d3d",borderRadius:12,padding:"20px 24px"}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12,marginBottom:12}}>
                        <div>
                          <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:17,color:"#f9fafb",marginBottom:3}}>{app.university}</div>
                          <div style={{fontSize:13,color:"#6b7280"}}>{app.programme} · <span style={{color:"#d97706"}}>{app.country}</span></div>
                        </div>
                        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}><Bdg l={app.ourProgress} m={SC}/><Bdg l={app.schoolStatus} m={KC}/></div>
                      </div>
                      <div style={{display:"flex",gap:20,flexWrap:"wrap",fontSize:12,color:"#4b5563"}}>
                        {app.period&&<span>📅 {app.period}</span>}
                        {app.appFee&&<span>💳 {app.appFee}</span>}
                        {app.tuition&&<span>🎓 {app.tuition}</span>}
                      </div>
                      {app.notes&&<div style={{background:"#060d14",borderRadius:8,padding:"10px 14px",fontSize:13,color:"#9ca3af",fontStyle:"italic",border:"1px solid #1e2d3d",marginTop:12}}>📝 {app.notes}</div>}
                    </div>
                  ))}
                </div>
          )}

          {tab==="documents"&&(
            <div style={{background:"#0f1923",border:"1px solid #1e2d3d",borderRadius:12,padding:24}}>
              <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,color:"#f9fafb",marginBottom:18,fontSize:15}}>Documents ({sel.documents.length})</div>
              {sel.documents.length===0
                ? <div style={{color:"#6b7280",fontSize:13}}>No documents recorded.</div>
                : <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))",gap:10}}>
                    {sel.documents.map((doc,i)=>(
                      <div key={i} style={{display:"flex",alignItems:"center",gap:10,background:"#064e3b",border:"1px solid #10b98133",borderRadius:8,padding:"10px 14px"}}>
                        <span style={{color:"#34d399",fontWeight:700}}>✓</span>
                        <span style={{fontSize:13,color:"#d1d5db"}}>{doc}</span>
                      </div>
                    ))}
                  </div>}
            </div>
          )}

          {tab==="payment"&&(
            <div style={{background:"#0f1923",border:"1px solid #1e2d3d",borderRadius:12,padding:"28px 32px",maxWidth:460}}>
              <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,color:"#f9fafb",fontSize:16,marginBottom:24}}>Payment Summary</div>
              {[{label:"Service Fee",val:`₦${sel.payable.toLocaleString()}`,color:"#f9fafb"},{label:"Amount Paid",val:`₦${sel.paid.toLocaleString()}`,color:"#34d399"}].map((x,i)=>(
                <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"14px 0",borderBottom:"1px solid #1e2d3d"}}>
                  <span style={{color:"#6b7280",fontSize:14}}>{x.label}</span>
                  <span style={{color:x.color,fontSize:14,fontWeight:600}}>{x.val}</span>
                </div>
              ))}
              <div style={{display:"flex",justifyContent:"space-between",padding:"20px 0"}}>
                <span style={{color:"#f9fafb",fontSize:16,fontWeight:700}}>Outstanding</span>
                <span style={{fontFamily:"'Syne',sans-serif",fontSize:26,fontWeight:900,color:sel.outstanding>0?"#fbbf24":"#34d399"}}>₦{Math.max(0,sel.outstanding).toLocaleString()}</span>
              </div>
              {sel.outstanding<=0&&<div style={{background:"#064e3b",border:"1px solid #10b98133",borderRadius:8,padding:"10px 14px",fontSize:13,color:"#34d399",textAlign:"center"}}>✓ Fully paid up</div>}
            </div>
          )}
        </div>}

        {/* ── COUNTRIES ── */}
        {view==="countries"&&(
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:18}}>
            {countries.map(([country,info])=>{
              const fees    = [...info.appFees].filter(f=>f&&f!=="Free"&&f!=="0");
              const hasFree = [...info.appFees].some(f=>f==="Free");
              const tuitions= [...info.tuitions].filter(t=>t&&t!=="Fully Funded"&&t!=="Tuition Free");
              const hasFunded=[...info.tuitions].some(t=>t==="Fully Funded"||t==="Tuition Free");
              return(
                <div key={country} style={{background:"#0f1923",border:"1px solid #1e2d3d",borderRadius:14,padding:"22px 24px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
                    <div>
                      <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:22,color:"#f9fafb"}}>{country}</div>
                      <div style={{fontSize:12,color:"#6b7280",marginTop:3}}>{info.total} application{info.total!==1?"s":""}</div>
                    </div>
                    <div style={{fontFamily:"'Syne',sans-serif",fontSize:38,fontWeight:900,color:"#3b82f6",lineHeight:1}}>{info.total}</div>
                  </div>

                  {hasFunded&&<div style={{background:"#064e3b",border:"1px solid #10b98133",borderRadius:8,padding:"8px 12px",marginBottom:14,fontSize:12,color:"#34d399"}}>🎓 Fully funded options available</div>}

                  <div style={{marginBottom:12}}>
                    <div style={{fontSize:11,color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6}}>Application Fee</div>
                    <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                      {hasFree&&<span style={{fontSize:12,background:"#064e3b",color:"#34d399",padding:"3px 10px",borderRadius:20,border:"1px solid #10b98133"}}>Free</span>}
                      {fees.map((f,i)=><span key={i} style={{fontSize:12,background:"#1e2d3d",color:"#d1d5db",padding:"3px 10px",borderRadius:20,border:"1px solid #2d4a6b"}}>{f}</span>)}
                      {!hasFree&&fees.length===0&&<span style={{fontSize:12,color:"#4b5563"}}>Not specified</span>}
                    </div>
                  </div>

                  {tuitions.length>0&&<div style={{marginBottom:14}}>
                    <div style={{fontSize:11,color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6}}>Tuition Range</div>
                    <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{tuitions.map((t,i)=><span key={i} style={{fontSize:12,background:"#1e3a5f",color:"#93c5fd",padding:"3px 10px",borderRadius:20,border:"1px solid #3b82f633"}}>{t}</span>)}</div>
                  </div>}

                  <div style={{borderTop:"1px solid #1e2d3d",paddingTop:14}}>
                    <div style={{fontSize:11,color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8}}>School Status</div>
                    <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                      {Object.entries(info.statuses).map(([st,cnt])=>{
                        const s=KC[st]||{bg:"#1f2937",color:"#9ca3af",border:"#4b5563"};
                        return <span key={st} style={{fontSize:11,background:s.bg,color:s.color,border:`1px solid ${s.border}33`,padding:"2px 8px",borderRadius:20,fontWeight:600}}>{cnt}× {st}</span>;
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  </>;
}

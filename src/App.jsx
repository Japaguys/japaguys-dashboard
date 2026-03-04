import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile } from "firebase/auth";

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

const LOGO = "data:image/png;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCACQAlUDASIAAhEBAxEB/8QAHQABAAIDAQEBAQAAAAAAAAAAAAYHBAUIAwIBCf/EAFEQAAEDAwEDBwQKDwcEAwEAAAEAAgMEBREGBxIhEzFBUWFxgTZ0kbIIFRciMnKhscHRFBYzNTdCUlVic4KSk7PSI1R1lKLC8BhTVuEklfFD/8QAHAEBAAMBAQEBAQAAAAAAAAAAAAUGBwQDAggB/8QAQBEAAQMCAwMJBAcHBQEAAAAAAQACAwQRBQYhEjFBE1FhcYGRscHRFCI0oRUWMjVy4fAjM0JTouLxUmNkgrJD/9oADAMBAAIRAxEAPwCodC6ToLPbYZ5oGTXCRgfJI9uSwkZ3W9WOvp+RSlEX6Co6OGjhEMLbAfrvWNVNTJUyGSQ3JRERdK50REREREREREREREREIBBBGQVA9p2lKKe0zXehgZBVUzd+QRtAEjOnIHSOfPZ3Yni1mrPJa7eYzeoVG4vRw1dJIyUX0Nug23hd2G1MlPUsdGbajtXPSIiwZa+iIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIumERbrRFgk1RqqhsMVSymfVvc0SubvBuGl3N4L9ESyNiYZHmwAueoLFY43SPDGjU6BaVFen/TldP/ACej/wAs760/6crp/wCT0f8AlnfWoP604T/OHc70Ut9X8R/lfMeqotFLNqOip9CaggtFRXxVr5qVtSJI4ywAF724wT+h8qiamaeojqIxLEbtO4qLmhfA8xyCxG9ERSfR2gdV6s9/ZrTLJT5wamQiOIftO5+4ZK/s08UDC+VwaOcmy/kUMkztiNpJ6FGEV7WX2OdfIxr7zqSmp3dMdLAZf9Ti35lIaf2O2mmj+3vt3kP6Ajb87SoCXNuFRm3KX6gfRTMeXMQeL7Fushc0IulKr2Oun3NIpb/dIndBkZG8fIAorqD2POoKVjpLLeKK4gcRHMwwPPYPhNz3kL6gzXhUx2eVt1gj52svmXLuIRi/J36iD+apVazVnktdvMZvUKlOpdN33TdYKS+WupoZTxbyjfev+K4cHeBKi2rPJa7eYzeoVL1EjJKV72G4LTqNeCjYWOZUNa4WII8Vz0iIvz+tkREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREXTCnGwb8Ldg/XP/AJT1B1ONg34W7B+uf/Ket8xX4Gb8DvArHsO+Li/E3xC7IREWBrYVy/7LP8I1v/wiP+dMqhjY+SRscbHPe4hrWtGSSeYAK3vZZ/hGt/8AhEf86ZZ/sXtExXG4TauuMG/BRSCOia4cHTYyX/sgjHaesLYqDEI8PwKOok4N3c54BZnWUT63F3ws4nuHOpDsg2KUlFBDetY07KmscA+K3vGY4erlB+M79HmHb0XdFHHFE2KJ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";
const ICON = "data:image/png;base64,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";

// Brand colors from Japaguys logo
const BLUE = "#1565F5";
const BLUE_DARK = "#0f1923";
const BLUE_MID = "#1a2740";
const BG = "#060d14";
const BORDER = "#1e2d3d";

// Progress badge colors
const SC = {
  "Submitted":          {bg:"#0d2d6b",color:"#93c5fd",border:"#1565F5"},
  "Pending - Japaguys": {bg:"#431407",color:"#fb923c",border:"#ea580c"},
  "Pending - Applicant":{bg:"#3d2e0a",color:"#fbbf24",border:"#f59e0b"},
  "Not Started":        {bg:"#1f2937",color:"#9ca3af",border:"#4b5563"},
};
const KC = {
  "Admission Granted":      {bg:"#064e3b",color:"#34d399",border:"#10b981"},
  "Admission Denied":       {bg:"#450a0a",color:"#f87171",border:"#ef4444"},
  "Awaiting Response":      {bg:"#0d2d6b",color:"#93c5fd",border:"#1565F5"},
  "Awaiting Entrance Exam": {bg:"#2e1b5e",color:"#a78bfa",border:"#8b5cf6"},
  "Invited for Interview":  {bg:"#2e1b5e",color:"#c4b5fd",border:"#8b5cf6"},
  "Pending":                {bg:"#3d2e0a",color:"#fbbf24",border:"#f59e0b"},
  "No Status Yet":          {bg:"#1f2937",color:"#9ca3af",border:"#4b5563"},
};

// Format large numbers
const fmtNum = n => {
  if(n >= 1000000) return (n/1000000).toFixed(1).replace(/\.0$/,"") + "M";
  if(n >= 1000)    return (n/1000).toFixed(1).replace(/\.0$/,"") + "K";
  return String(n);
};

// Parse deadline from period string — returns Date or null
const parseDeadline = (period) => {
  if(!period) return null;
  const p = period.trim();
  const now = new Date();
  const yr  = now.getFullYear();

  // "Till Mar 31", "Till Apr 30" etc
  const tillMatch = p.match(/^Till\s+(\w+)\s+(\d+)$/i);
  if(tillMatch) {
    const d = new Date(`${tillMatch[1]} ${tillMatch[2]} ${yr}`);
    if(!isNaN(d)) return d;
  }

  // "Mar 2026", "Dec 2026", "Feb 2026" etc — single month+year
  const myMatch = p.match(/^(\w+)\s+(20\d\d)$/i);
  if(myMatch) {
    const d = new Date(`${myMatch[1]} 1 ${myMatch[2]}`);
    if(!isNaN(d)){ d.setMonth(d.getMonth()+1); d.setDate(0); return d; }
  }

  // "Aug 2025 - Mar 2026" — take end
  const rangeYrMatch = p.match(/(\w+)\s+20\d\d\s*-\s*(\w+)\s+(20\d\d)/i);
  if(rangeYrMatch) {
    const d = new Date(`${rangeYrMatch[2]} 1 ${rangeYrMatch[3]}`);
    if(!isNaN(d)){ d.setMonth(d.getMonth()+1); d.setDate(0); return d; }
  }

  // "Oct 2025 - Feb 2026"
  const rangeYrMatch2 = p.match(/(\w+\s+20\d\d)\s*-\s*(\w+\s+20\d\d)/i);
  if(rangeYrMatch2) {
    const d = new Date(rangeYrMatch2[2] + " 1");
    if(!isNaN(d)){ d.setMonth(d.getMonth()+1); d.setDate(0); return d; }
  }

  // "Jan 10 - Feb 20", "Mar 10 - Mar 18" — no year, assume current or next year
  const rangeMatch = p.match(/(\w+)\s+\d+\s*-\s*(\w+)\s+(\d+)$/i);
  if(rangeMatch) {
    let d = new Date(`${rangeMatch[2]} ${rangeMatch[3]} ${yr}`);
    if(!isNaN(d)){
      if(d < now) d = new Date(`${rangeMatch[2]} ${rangeMatch[3]} ${yr+1}`);
      return d;
    }
  }

  // "Apr 16", "Jul 31", "Mar 10" — day only, no year
  const dayMatch = p.match(/^(\w+)\s+(\d+)$/i);
  if(dayMatch) {
    let d = new Date(`${dayMatch[1]} ${dayMatch[2]} ${yr}`);
    if(!isNaN(d)){
      if(d < now) d = new Date(`${dayMatch[1]} ${dayMatch[2]} ${yr+1}`);
      return d;
    }
  }

  // "Aug - Oct", "Mar - Jun", "Nov - Jul" — month range no year, use end month
  const moRangeMatch = p.match(/^\w+\s*-\s*(\w+)$/i);
  if(moRangeMatch) {
    let d = new Date(`${moRangeMatch[1]} 1 ${yr}`);
    if(!isNaN(d)){
      d.setMonth(d.getMonth()+1); d.setDate(0);
      if(d < now){ d = new Date(`${moRangeMatch[1]} 1 ${yr+1}`); d.setMonth(d.getMonth()+1); d.setDate(0); }
      return d;
    }
  }

  // "Feb 2 - Jul", "Nov - Jul" partial
  const partMatch = p.match(/^\w+.*-\s*(\w+)$/i);
  if(partMatch) {
    let d = new Date(`${partMatch[1]} 1 ${yr}`);
    if(!isNaN(d)){
      d.setMonth(d.getMonth()+1); d.setDate(0);
      if(d < now){ d = new Date(`${partMatch[1]} 1 ${yr+1}`); d.setMonth(d.getMonth()+1); d.setDate(0); }
      return d;
    }
  }

  return null;
};

const isActive = (period) => {
  if(!period) return false;
  const deadline = parseDeadline(period);
  if(!deadline) return true; // if we can't parse, show it
  const today = new Date(); today.setHours(0,0,0,0);
  return deadline >= today;
};

const Bdg = ({l,m})=>{ const s=(m&&m[l])||{bg:"#1f2937",color:"#9ca3af",border:"#4b5563"}; return <span style={{background:s.bg,color:s.color,border:`1px solid ${s.border}`,borderRadius:4,padding:"3px 10px",fontSize:11,fontWeight:600,whiteSpace:"nowrap",display:"inline-block",letterSpacing:"0.02em"}}>{l||"N/A"}</span>; };
const MC = ({label,value,accent,sub})=><div style={{background:BLUE_DARK,border:`1px solid ${BORDER}`,borderRadius:10,padding:"18px 20px",borderTop:`3px solid ${accent}`}}><div style={{fontSize:11,color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:8,fontWeight:600}}>{label}</div><div style={{fontSize:28,fontWeight:700,color:accent,fontFamily:"Arial,sans-serif",lineHeight:1}}>{value}</div>{sub&&<div style={{fontSize:11,color:"#4b5563",marginTop:4}}>{sub}</div>}</div>;
const PB = ({label,val,total,color})=><div style={{marginBottom:14}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><span style={{fontSize:13,color:"#d1d5db"}}>{label}</span><span style={{fontSize:13,fontWeight:600,color}}>{val}</span></div><div style={{height:5,background:BORDER,borderRadius:3}}><div style={{height:5,background:color,borderRadius:3,width:`${total?(val/total*100):0}%`,transition:"width 0.8s"}}/></div></div>;

function Login(){
  const [e,sE]=useState(""); const [p,sP]=useState(""); const [err,sErr]=useState(""); const [ld,sLd]=useState(false);
  const go=async()=>{ if(!e||!p){sErr("Enter email and password.");return;} sLd(true);sErr(""); try{await signInWithEmailAndPassword(auth,e,p);}catch{sErr("Incorrect email or password.");} sLd(false); };
  const inp={width:"100%",background:BG,border:`1px solid ${BORDER}`,borderRadius:6,padding:"11px 14px",color:"#f9fafb",fontSize:14,outline:"none",boxSizing:"border-box",fontFamily:"Arial,sans-serif"};
  return(
    <div style={{minHeight:"100vh",background:BG,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Arial,sans-serif"}}>
      <div style={{width:420}}>
        <div style={{textAlign:"center",marginBottom:40}}>
          <img src={LOGO} alt="JapaGuys" style={{height:44,marginBottom:24,mixBlendMode:"screen"}}/>
          <div style={{color:"#6b7280",fontSize:13}}>Operations Dashboard — Internal Access Only</div>
        </div>
        <div style={{background:BLUE_DARK,border:`1px solid ${BORDER}`,borderRadius:12,padding:"36px 32px"}}>
          <div style={{marginBottom:18}}><label style={{fontSize:12,color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.08em",display:"block",marginBottom:8,fontWeight:600}}>Email</label><input value={e} onChange={x=>sE(x.target.value)} type="email" placeholder="you@japaguys.com" onKeyDown={x=>x.key==="Enter"&&go()} style={inp}/></div>
          <div style={{marginBottom:24}}><label style={{fontSize:12,color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.08em",display:"block",marginBottom:8,fontWeight:600}}>Password</label><input value={p} onChange={x=>sP(x.target.value)} type="password" placeholder="••••••••" onKeyDown={x=>x.key==="Enter"&&go()} style={inp}/></div>
          {err&&<div style={{color:"#f87171",fontSize:13,marginBottom:16,background:"#450a0a",padding:"10px 14px",borderRadius:6}}>{err}</div>}
          <button onClick={go} disabled={ld} style={{width:"100%",background:BLUE,border:"none",borderRadius:6,padding:"13px",color:"#fff",fontWeight:700,fontSize:15,cursor:ld?"not-allowed":"pointer",opacity:ld?0.7:1,fontFamily:"Arial,sans-serif",letterSpacing:"0.02em"}}>{ld?"Signing in...":"Sign In"}</button>
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
  const [menuOpen,sMenu]=useState(false);
  const [namePrompt,sNamePrompt]=useState(false);
  const [nameInput,sNameInput]=useState("");
  const [savingName,sSavingName]=useState(false);

  useEffect(()=>{ const u=onAuthStateChanged(auth,u=>{ sU(u); sR(true); if(u&&!u.displayName) sNamePrompt(true); }); return u; },[]);
  useEffect(()=>{ if(user&&!user.displayName&&!auth.currentUser?.displayName) sNamePrompt(true); },[user]);

  const saveName = async () => {
    if(!nameInput.trim()) return;
    sSavingName(true);
    try {
      await updateProfile(auth.currentUser, { displayName: nameInput.trim() });
      sU({...auth.currentUser, displayName: nameInput.trim()});
      sNamePrompt(false);
    } catch(e) { console.error(e); }
    sSavingName(false);
  };
  useEffect(()=>{ const t=setInterval(()=>sN(new Date()),1000); return()=>clearInterval(t); },[]);

  // Set favicon
  useEffect(()=>{
    const link = document.querySelector("link[rel*='icon']") || document.createElement("link");
    link.type="image/png"; link.rel="shortcut icon"; link.href=ICON;
    document.head.appendChild(link);
    document.title="Japaguys Dashboard";
  },[]);

  useEffect(()=>{
    if(!user) return;
    sL(true);
    fetch(SHEET_URL).then(r=>r.json()).then(raw=>{
      const appRows = raw.applicants.slice(2).filter(r=>r[0]&&String(r[0]).trim());
      const applicants = appRows.map((r,i)=>{
        const payable=Number(r[7])||0, paid=Number(r[8])||0;
        return { id:`JAP${String(i+1).padStart(3,"0")}`, name:String(r[0]||"").trim(), email:String(r[1]||"").trim(), phone:String(r[2]||"").trim(), address:String(r[3]||"").trim(), level:String(r[4]||"").trim(), field:String(r[5]||"").trim(), service:String(r[6]||"").trim(), payable, paid, outstanding:payable-paid, documents:r[10]?String(r[10]).split(",").map(d=>d.trim()).filter(Boolean):[], year:String(r[11]||"").trim() };
      });
      const appliRows = raw.applications.slice(2).filter(r=>r[0]&&r[1]);
      const applications = appliRows.map(r=>({
        clientName:String(r[0]||"").trim(), university:String(r[1]||"").trim(), country:String(r[2]||"").trim(), programme:String(r[3]||"").trim(), period:String(r[4]||"").trim(), appFee:String(r[5]||"Free").trim(), tuition:String(r[6]||"").trim(), ourProgress:String(r[7]||"").trim(), schoolStatus:String(r[8]||"").trim(), notes:String(r[9]||"").trim(),
      }));
      const linked = applications.map(ap=>({...ap, clientId:(applicants.find(a=>a.name.toLowerCase()===ap.clientName.toLowerCase())||{}).id||null}));
      sD({applicants,applications:linked}); sL(false);
    }).catch(err=>{console.error(err);sL(false);});
  },[user]);

  if(!ready) return null;
  if(!user)  return <Login/>;

  const nm=(user.displayName||auth.currentUser?.displayName||user.email.split("@")[0]);
  const hr=now.getHours();
  const gr=hr<12?"Good morning":hr<17?"Good afternoon":"Good evening";
  const fT=d=>d.toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit",second:"2-digit"});
  const fD=d=>d.toLocaleDateString("en-GB",{weekday:"long",year:"numeric",month:"long",day:"numeric"});

  if(ld||!data) return(
    <div style={{minHeight:"100vh",background:BG,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Arial,sans-serif"}}>
      <div style={{textAlign:"center"}}><div style={{width:36,height:36,border:`3px solid ${BORDER}`,borderTop:`3px solid ${BLUE}`,borderRadius:"50%",animation:"spin 0.8s linear infinite",margin:"0 auto 16px"}}/><div style={{color:"#6b7280",fontSize:14}}>Loading from Google Sheets...</div></div>
    </div>
  );

  const {applicants,applications}=data;
  const tot=applications.length, tc=applicants.length;
  const sub=applications.filter(a=>a.ourProgress==="Submitted").length;
  const pC =applications.filter(a=>a.ourProgress==="Pending - Applicant").length;
  const pU =applications.filter(a=>a.ourProgress==="Pending - Japaguys").length;
  const nS =applications.filter(a=>a.ourProgress==="Not Started").length;
  const adm=applications.filter(a=>a.schoolStatus==="Admission Granted").length;
  const den=applications.filter(a=>a.schoolStatus==="Admission Denied").length;
  const owed=applicants.reduce((s,c)=>s+(c.outstanding>0?c.outstanding:0),0);

  // Country stats for summary grid
  const cMap={};
  applications.forEach(a=>{
    if(!a.country) return;
    const c=a.country.trim();
    if(!cMap[c]) cMap[c]={total:0,statuses:{}};
    cMap[c].total++;
    if(a.schoolStatus) cMap[c].statuses[a.schoolStatus]=(cMap[c].statuses[a.schoolStatus]||0)+1;
  });
  const countries=Object.entries(cMap).sort((a,b)=>b[1].total-a[1].total);

  // Countries & Fees — only active deadlines, deduplicated by university
  const seen = new Set();
  const activeSchools = applications
    .filter(a => isActive(a.period))
    .filter(a => {
      const key = a.university + "|" + a.country;
      if(seen.has(key)) return false;
      seen.add(key); return true;
    })
    .sort((a,b)=>a.country.localeCompare(b.country));

  const allC=[...new Set(applications.map(a=>a.country?.trim()).filter(Boolean))].sort();
  const allSt=[...new Set(applications.map(a=>a.ourProgress).filter(Boolean))].sort();
  const allSc=[...new Set(applications.map(a=>a.schoolStatus).filter(Boolean))].sort();
  const allY=[...new Set(applicants.map(a=>a.year).filter(Boolean))].sort();

  const filtered=applicants.filter(c=>{
    const ms=!search||c.name.toLowerCase().includes(search.toLowerCase())||c.id.toLowerCase().includes(search.toLowerCase())||c.field.toLowerCase().includes(search.toLowerCase());
    const ca=applications.filter(a=>a.clientId===c.id);
    return ms&&(!filt.country||ca.some(a=>a.country?.trim()===filt.country))&&(!filt.status||ca.some(a=>a.ourProgress===filt.status))&&(!filt.school||ca.some(a=>a.schoolStatus===filt.school))&&(!filt.service||c.service===filt.service)&&(!filt.year||c.year===filt.year);
  });

  const cApps=sel?applications.filter(a=>a.clientId===sel.id):[];
  const SI={background:BLUE_DARK,border:`1px solid ${BORDER}`,borderRadius:6,padding:"8px 12px",color:"#f9fafb",fontSize:13,fontFamily:"Arial,sans-serif",outline:"none",cursor:"pointer"};
  const navActive = id => view===id||(view==="client"&&id==="clients");

  const TH = {padding:"11px 16px",fontSize:11,fontWeight:700,color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.08em",textAlign:"left",borderBottom:`1px solid ${BORDER}`,background:"#0a1520",whiteSpace:"nowrap"};
  const TD = {padding:"12px 16px",fontSize:13,color:"#d1d5db",borderBottom:`1px solid ${BORDER}`,verticalAlign:"middle"};

  return <>
    <style>{`@keyframes spin{to{transform:rotate(360deg)}}*{box-sizing:border-box;margin:0;padding:0}html,body{max-width:100%;overflow-x:hidden}body{background:${BG};font-family:Arial,sans-serif}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:${BG}}::-webkit-scrollbar-thumb{background:${BORDER};border-radius:3px}input::placeholder{color:#374151}select option{background:#0f1923}.hamburger{display:none!important}@media(max-width:768px){.hamburger{display:flex!important}.sidebar{transform:translateX(-100%);transition:transform 0.25s}.sidebar.open{transform:translateX(0)}.overlay{display:block!important}.main-content{margin-left:0!important;padding:64px 12px 20px!important;width:100%!important;max-width:100vw!important;overflow-x:hidden!important;box-sizing:border-box!important}.metric-grid{grid-template-columns:1fr 1fr!important;gap:8px!important}.chart-grid{grid-template-columns:1fr!important}.client-grid{grid-template-columns:1fr!important}.filter-row{flex-direction:column!important}.filter-row select,.filter-row input{width:100%!important}table{font-size:11px;width:100%!important}.table-wrap{overflow-x:auto;-webkit-overflow-scrolling:touch}table td,table th{padding:8px 6px!important;white-space:nowrap}.topbar-right{display:none!important}.greeting-bar{margin-bottom:16px!important}}`}</style>
    <div style={{display:"flex",minHeight:"100vh",fontFamily:"Arial,sans-serif",background:BG,color:"#f9fafb"}}>
      {/* MOBILE OVERLAY */}
      <div className="overlay" onClick={()=>sMenu(false)} style={{display:"none",position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",zIndex:99}}/>

      {/* SIDEBAR */}
      <div className={`sidebar${menuOpen?" open":""}`} style={{width:220,background:"#0a1520",borderRight:`1px solid ${BORDER}`,display:"flex",flexDirection:"column",padding:"24px 0",position:"fixed",height:"100vh",zIndex:100}}>
        <div style={{padding:"0 20px 28px"}}>
          <img src={LOGO} alt="JapaGuys" style={{height:32,marginBottom:4,mixBlendMode:"screen"}}/>
          <div style={{fontSize:11,color:"#4b5563",marginTop:6,letterSpacing:"0.05em"}}>Operations Dashboard</div>
        </div>
        {[{id:"summary",icon:"⊞",label:"Overview"},{id:"clients",icon:"👥",label:"All Clients"},{id:"countries",icon:"🌍",label:"Current Openings"}].map(item=>(
          <button key={item.id} onClick={()=>{sV(item.id);sSel(null);sS("");sMenu(false);}}
            style={{display:"flex",alignItems:"center",gap:10,padding:"11px 20px",background:navActive(item.id)?"#1a2740":"none",border:"none",borderLeft:navActive(item.id)?`3px solid ${BLUE}`:"3px solid transparent",color:navActive(item.id)?"#f9fafb":"#6b7280",cursor:"pointer",fontSize:13,fontWeight:navActive(item.id)?700:400,fontFamily:"Arial,sans-serif",textAlign:"left",width:"100%",letterSpacing:"0.01em"}}>
            <span style={{fontSize:14}}>{item.icon}</span>{item.label}
            {item.id==="clients"&&<span style={{marginLeft:"auto",fontSize:11,background:"#0d2d6b",color:"#93c5fd",padding:"1px 7px",borderRadius:10,fontWeight:700}}>{tc}</span>}
            {item.id==="countries"&&<span style={{marginLeft:"auto",fontSize:11,background:"#064e3b",color:"#34d399",padding:"1px 7px",borderRadius:10,fontWeight:700}}>{activeSchools.length}</span>}
          </button>
        ))}
        <div style={{marginTop:"auto",padding:"0 20px"}}>
          <div style={{borderTop:`1px solid ${BORDER}`,paddingTop:20}}>
            <div style={{fontSize:11,color:"#374151",marginBottom:4}}>Signed in as</div>
            <div style={{fontSize:12,color:"#9ca3af",fontWeight:600,marginBottom:14,wordBreak:"break-all"}}>{user.email}</div>
            <button onClick={()=>signOut(auth)} style={{width:"100%",background:BLUE_MID,border:`1px solid ${BORDER}`,borderRadius:6,padding:"9px",color:"#9ca3af",fontSize:13,cursor:"pointer",fontFamily:"Arial,sans-serif"}}>Sign Out</button>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div className="main-content" style={{marginLeft:220,flex:1,padding:"32px 40px",minHeight:"100vh"}}>
        {/* HAMBURGER */}
        <button onClick={()=>sMenu(o=>!o)} style={{display:"flex",position:"fixed",top:12,left:12,zIndex:201,background:BLUE,border:"none",borderRadius:8,padding:"10px 12px",cursor:"pointer",flexDirection:"column",gap:5,alignItems:"center",justifyContent:"center"}} className="hamburger">
          <span style={{display:"block",width:20,height:2,background:"#fff",borderRadius:2}}/>
          <span style={{display:"block",width:20,height:2,background:"#fff",borderRadius:2}}/>
          <span style={{display:"block",width:20,height:2,background:"#fff",borderRadius:2}}/>
        </button>
        <div className="greeting-bar" style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:32,flexWrap:"wrap",gap:8}}>
          <div>
            {view==="client"&&sel&&<div style={{fontSize:12,marginBottom:6}}>
              <button onClick={()=>{sV("clients");sSel(null);window.scrollTo(0,0);}} style={{background:"none",border:"none",color:"#6b7280",cursor:"pointer",fontSize:12,fontFamily:"Arial,sans-serif"}}>← All Clients</button>
              <span style={{margin:"0 6px",color:"#374151"}}>/</span>
              <span style={{color:BLUE}}>{sel.id}</span>
            </div>}
            <div style={{fontSize:12,color:BLUE,fontWeight:700,letterSpacing:"0.08em",marginBottom:4,textTransform:"uppercase"}}>{gr}, {nm} 👋</div>
            <div style={{fontSize:26,fontWeight:700,color:"#f9fafb",fontFamily:"Arial,sans-serif",letterSpacing:"-0.01em"}}>{view==="summary"?"Overview":view==="clients"?"All Clients":view==="countries"?"Current Openings":sel?.name||""}</div>
          </div>
          <div className="topbar-right" style={{textAlign:"right"}}>
            <div style={{fontSize:22,fontWeight:700,color:"#f9fafb",fontFamily:"Arial,sans-serif",letterSpacing:"0.05em"}}>{fT(now)}</div>
            <div style={{fontSize:12,color:"#6b7280",marginTop:3}}>{fD(now)}</div>
          </div>
        </div>

        {/* ── SUMMARY ── */}
        {view==="summary"&&<div>
          <div className="metric-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(148px,1fr))",gap:12,marginBottom:28}}>
            <MC label="Total Clients"      value={tc}             accent={BLUE}/>
            <MC label="Total Applications" value={tot}            accent="#3b82f6"/>
            <MC label="Submitted"          value={sub}            accent="#10b981"/>
            <MC label="Pending — Us"       value={pU}             accent="#f97316"/>
            <MC label="Pending — Client"   value={pC}             accent="#f59e0b"/>
            <MC label="Not Started"        value={nS}             accent="#6b7280"/>
            <MC label="Admitted"           value={adm}            accent="#8b5cf6"/>
            <MC label="Denied"             value={den}            accent="#ef4444"/>
            <MC label="Outstanding"        value={"₦"+fmtNum(owed)} accent={BLUE} sub={"₦"+owed.toLocaleString()}/>
          </div>
          <div className="chart-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18,marginBottom:24}}>
            <div style={{background:BLUE_DARK,border:`1px solid ${BORDER}`,borderRadius:10,padding:22}}>
              <div style={{fontWeight:700,color:"#f9fafb",marginBottom:18,fontSize:14,letterSpacing:"0.02em"}}>Our Progress</div>
              <PB label="Submitted"           val={sub} total={tot} color={BLUE}/>
              <PB label="Pending — Us"        val={pU}  total={tot} color="#f97316"/>
              <PB label="Pending — Applicant" val={pC}  total={tot} color="#f59e0b"/>
              <PB label="Not Started"         val={nS}  total={tot} color="#6b7280"/>
            </div>
            <div style={{background:BLUE_DARK,border:`1px solid ${BORDER}`,borderRadius:10,padding:22}}>
              <div style={{fontWeight:700,color:"#f9fafb",marginBottom:18,fontSize:14,letterSpacing:"0.02em"}}>School Responses</div>
              <PB label="Awaiting Response" val={applications.filter(a=>a.schoolStatus==="Awaiting Response").length} total={tot} color={BLUE}/>
              <PB label="Admission Granted" val={adm} total={tot} color="#10b981"/>
              <PB label="Admission Denied"  val={den} total={tot} color="#ef4444"/>
              <PB label="Other / Pending"   val={applications.filter(a=>!["Awaiting Response","Admission Granted","Admission Denied"].includes(a.schoolStatus)).length} total={tot} color="#6b7280"/>
            </div>
          </div>
          <div style={{background:BLUE_DARK,border:`1px solid ${BORDER}`,borderRadius:10,padding:22}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
              <div style={{fontWeight:700,color:"#f9fafb",fontSize:14}}>Applications by Country</div>
              <button onClick={()=>sV("countries")} style={{background:"none",border:`1px solid ${BORDER}`,borderRadius:6,padding:"5px 14px",color:BLUE,fontSize:12,cursor:"pointer",fontFamily:"Arial,sans-serif",fontWeight:600}}>View openings →</button>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))",gap:10}}>
              {countries.map(([country,info])=>(
                <div key={country} style={{background:BG,border:`1px solid ${BORDER}`,borderRadius:8,padding:"12px 14px"}}>
                  <div style={{fontSize:13,color:"#f9fafb",fontWeight:600,marginBottom:4}}>{country}</div>
                  <div style={{fontSize:22,fontWeight:700,color:BLUE}}>{info.total}</div>
                  <div style={{fontSize:11,color:"#6b7280"}}>applications</div>
                </div>
              ))}
            </div>
          </div>
        </div>}

        {/* ── CLIENTS ── */}
        {view==="clients"&&<div>
          <div style={{background:BLUE_DARK,border:`1px solid ${BORDER}`,borderRadius:10,padding:"18px 22px",marginBottom:20}}>
            <div style={{fontSize:11,color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:12,fontWeight:600}}>Search & Filter</div>
            <div className="filter-row" style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              <input placeholder="Search name or field..." value={search} onChange={e=>sS(e.target.value)} style={{...SI,width:230,padding:"9px 14px"}}/>
              <select value={filt.country} onChange={e=>sFilt(f=>({...f,country:e.target.value}))} style={SI}><option value="">All Countries</option>{allC.map(c=><option key={c}>{c}</option>)}</select>
              <select value={filt.status}  onChange={e=>sFilt(f=>({...f,status:e.target.value}))}  style={SI}><option value="">All Progress</option>{allSt.map(s=><option key={s}>{s}</option>)}</select>
              <select value={filt.school}  onChange={e=>sFilt(f=>({...f,school:e.target.value}))}  style={SI}><option value="">All School Statuses</option>{allSc.map(s=><option key={s}>{s}</option>)}</select>
              <select value={filt.service} onChange={e=>sFilt(f=>({...f,service:e.target.value}))} style={SI}><option value="">All Services</option><option>Done-For-You</option><option>Do-It-Yourself</option></select>
              <select value={filt.year}    onChange={e=>sFilt(f=>({...f,year:e.target.value}))}    style={SI}><option value="">All Years</option>{allY.map(y=><option key={y}>{y}</option>)}</select>
              <button onClick={()=>{sFilt({country:"",status:"",school:"",service:"",year:""});sS("");}} style={{...SI,background:BLUE_MID,color:"#9ca3af"}}>✕ Clear</button>
            </div>
            <div style={{marginTop:10,fontSize:12,color:"#4b5563"}}>Showing <strong style={{color:"#f9fafb"}}>{filtered.length}</strong> of {tc} clients</div>
          </div>
          <div className="client-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:12}}>
            {filtered.map(client=>{
              const ca=applications.filter(a=>a.clientId===client.id);
              const hA=ca.some(a=>a.schoolStatus==="Admission Granted");
              const sCnt=ca.filter(a=>a.ourProgress==="Submitted").length;
              const pCnt=ca.filter(a=>a.ourProgress?.includes("Pending")).length;
              return(
                <button key={client.id} onClick={()=>{sSel(client);sV("client");sTab("applications");}}
                  onMouseEnter={e=>e.currentTarget.style.background="#131f2e"}
                  onMouseLeave={e=>e.currentTarget.style.background=BLUE_DARK}
                  style={{background:BLUE_DARK,border:`1px solid ${BORDER}`,borderRadius:10,padding:"16px 18px",textAlign:"left",cursor:"pointer",borderLeft:hA?"3px solid #10b981":client.outstanding>0?"3px solid #f59e0b":`3px solid ${BORDER}`,fontFamily:"Arial,sans-serif",width:"100%"}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:6,alignItems:"flex-start"}}>
                    <div><div style={{fontSize:10,color:"#4b5563",marginBottom:2,fontWeight:700,letterSpacing:"0.05em"}}>{client.id}</div><div style={{fontWeight:700,color:"#f9fafb",fontSize:14}}>{client.name}</div></div>
                    {client.outstanding>0&&<span style={{fontSize:11,color:"#f59e0b",background:"#3d2e0a",padding:"2px 8px",borderRadius:4,border:"1px solid #f59e0b33",whiteSpace:"nowrap",flexShrink:0,fontWeight:600}}>₦{fmtNum(client.outstanding)}</span>}
                  </div>
                  <div style={{fontSize:12,color:"#6b7280",marginBottom:8}}>{client.field} · {client.level} · {client.year}</div>
                  <div style={{display:"flex",gap:8,flexWrap:"wrap",fontSize:11}}>
                    <span style={{color:"#6b7280"}}>{ca.length} apps</span>
                    {sCnt>0&&<><span style={{color:"#374151"}}>·</span><span style={{color:"#93c5fd"}}>{sCnt} submitted</span></>}
                    {pCnt>0&&<><span style={{color:"#374151"}}>·</span><span style={{color:"#fbbf24"}}>{pCnt} pending</span></>}
                    {hA&&<><span style={{color:"#374151"}}>·</span><span style={{color:"#34d399",fontWeight:700}}>✓ Admitted</span></>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>}

        {/* ── CLIENT DETAIL ── */}
        {view==="client"&&sel&&<div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:16,marginBottom:24}}>
            <div>
              <div style={{display:"flex",gap:16,flexWrap:"wrap",marginTop:6}}>
                {[{i:"📧",v:sel.email},{i:"📞",v:sel.phone},{i:"📍",v:sel.address}].filter(x=>x.v&&x.v.trim()).map((x,i)=><span key={i} style={{fontSize:13,color:"#6b7280"}}>{x.i} {x.v}</span>)}
              </div>
              <div style={{marginTop:10,display:"flex",gap:8,flexWrap:"wrap"}}>
                <span style={{fontSize:12,background:BLUE_MID,color:"#9ca3af",padding:"3px 10px",borderRadius:4,border:`1px solid ${BORDER}`}}>{sel.level}</span>
                <span style={{fontSize:12,background:BLUE_MID,color:"#9ca3af",padding:"3px 10px",borderRadius:4,border:`1px solid ${BORDER}`}}>{sel.field}</span>
                <span style={{fontSize:12,background:sel.service==="Done-For-You"?"#064e3b":"#0d2d6b",color:sel.service==="Done-For-You"?"#34d399":"#93c5fd",padding:"3px 10px",borderRadius:4}}>{sel.service}</span>
              </div>
            </div>
            <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
              {[{label:"Service Fee",val:`₦${sel.payable.toLocaleString()}`,color:"#9ca3af",bg:BLUE_DARK},{label:"Amount Paid",val:`₦${sel.paid.toLocaleString()}`,color:"#34d399",bg:BLUE_DARK},{label:"Outstanding",val:`₦${Math.max(0,sel.outstanding).toLocaleString()}`,color:sel.outstanding>0?"#fbbf24":"#34d399",bg:sel.outstanding>0?"#3d2e0a":"#064e3b"}].map((x,i)=>(
                <div key={i} style={{background:x.bg,border:`1px solid ${BORDER}`,borderRadius:10,padding:"12px 16px",textAlign:"center"}}>
                  <div style={{fontSize:11,color:"#6b7280",marginBottom:4,textTransform:"uppercase",letterSpacing:"0.08em",fontWeight:600}}>{x.label}</div>
                  <div style={{fontSize:16,fontWeight:700,color:x.color}}>{x.val}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{display:"flex",gap:0,borderBottom:`1px solid ${BORDER}`,marginBottom:22,overflowX:"auto"}}>
            {[{id:"applications",label:`Applications (${cApps.length})`},{id:"documents",label:`Documents (${sel.documents.length})`},{id:"payment",label:"Payment"}].map(t=>(
              <button key={t.id} onClick={()=>sTab(t.id)} style={{background:"none",border:"none",padding:"10px 20px",cursor:"pointer",fontFamily:"Arial,sans-serif",fontSize:13,fontWeight:tab===t.id?700:400,color:tab===t.id?BLUE:"#6b7280",borderBottom:tab===t.id?`2px solid ${BLUE}`:"2px solid transparent",marginBottom:-1,letterSpacing:"0.01em"}}>{t.label}</button>
            ))}
          </div>
          {tab==="applications"&&(cApps.length===0?<div style={{color:"#6b7280",padding:20}}>No applications found.</div>:
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              {cApps.map((app,i)=>(
                <div key={i} style={{background:BLUE_DARK,border:`1px solid ${BORDER}`,borderRadius:10,padding:"18px 22px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12,marginBottom:10}}>
                    <div><div style={{fontWeight:700,fontSize:15,color:"#f9fafb",marginBottom:2}}>{app.university}</div><div style={{fontSize:13,color:"#6b7280"}}>{app.programme} · <span style={{color:BLUE}}>{app.country}</span></div></div>
                    <div style={{display:"flex",gap:8,flexWrap:"wrap"}}><Bdg l={app.ourProgress} m={SC}/><Bdg l={app.schoolStatus} m={KC}/></div>
                  </div>
                  <div style={{display:"flex",gap:18,flexWrap:"wrap",fontSize:12,color:"#4b5563"}}>
                    {app.period&&<span>📅 {app.period}</span>}{app.appFee&&<span>💳 {app.appFee}</span>}{app.tuition&&<span>🎓 {app.tuition}</span>}
                  </div>
                  {app.notes&&<div style={{background:BG,borderRadius:6,padding:"8px 12px",fontSize:13,color:"#9ca3af",fontStyle:"italic",border:`1px solid ${BORDER}`,marginTop:10}}>📝 {app.notes}</div>}
                </div>
              ))}
            </div>
          )}
          {tab==="documents"&&(
            <div style={{background:BLUE_DARK,border:`1px solid ${BORDER}`,borderRadius:10,padding:22}}>
              <div style={{fontWeight:700,color:"#f9fafb",marginBottom:16,fontSize:14}}>Documents ({sel.documents.length})</div>
              {sel.documents.length===0?<div style={{color:"#6b7280",fontSize:13}}>No documents recorded.</div>:
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:8}}>
                  {sel.documents.map((doc,i)=>(
                    <div key={i} style={{display:"flex",alignItems:"center",gap:10,background:"#064e3b",border:"1px solid #10b98133",borderRadius:6,padding:"9px 12px"}}>
                      <span style={{color:"#34d399",fontWeight:700}}>✓</span><span style={{fontSize:13,color:"#d1d5db"}}>{doc}</span>
                    </div>
                  ))}
                </div>}
            </div>
          )}
          {tab==="payment"&&(
            <div style={{background:BLUE_DARK,border:`1px solid ${BORDER}`,borderRadius:10,padding:"26px 30px",maxWidth:440}}>
              <div style={{fontWeight:700,color:"#f9fafb",fontSize:15,marginBottom:22}}>Payment Summary</div>
              {[{label:"Service Fee",val:`₦${sel.payable.toLocaleString()}`,color:"#f9fafb"},{label:"Amount Paid",val:`₦${sel.paid.toLocaleString()}`,color:"#34d399"}].map((x,i)=>(
                <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"13px 0",borderBottom:`1px solid ${BORDER}`}}>
                  <span style={{color:"#6b7280",fontSize:14}}>{x.label}</span><span style={{color:x.color,fontSize:14,fontWeight:600}}>{x.val}</span>
                </div>
              ))}
              <div style={{display:"flex",justifyContent:"space-between",padding:"18px 0"}}>
                <span style={{color:"#f9fafb",fontSize:15,fontWeight:700}}>Outstanding</span>
                <span style={{fontSize:22,fontWeight:700,color:sel.outstanding>0?"#fbbf24":"#34d399"}}>₦{Math.max(0,sel.outstanding).toLocaleString()}</span>
              </div>
              {sel.outstanding<=0&&<div style={{background:"#064e3b",border:"1px solid #10b98133",borderRadius:6,padding:"9px 12px",fontSize:13,color:"#34d399",textAlign:"center"}}>✓ Fully paid up</div>}
            </div>
          )}
        </div>}

        {/* ── CURRENT OPENINGS ── */}
        {view==="countries"&&<div>
          <div style={{marginBottom:16,fontSize:13,color:"#6b7280"}}>
            Showing <strong style={{color:"#f9fafb"}}>{activeSchools.length}</strong> schools with active deadlines as of today ({new Date().toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"})})
          </div>
          <div className="table-wrap" style={{background:BLUE_DARK,border:`1px solid ${BORDER}`,borderRadius:10,overflow:"hidden"}}>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead>
                <tr>
                  <th style={TH}>#</th>
                  <th style={TH}>School / Institution</th>
                  <th style={TH}>Country</th>
                  <th style={TH}>Tuition Fee</th>
                  <th style={TH}>Application Fee</th>
                  <th style={TH}>Deadline</th>
                </tr>
              </thead>
              <tbody>
                {activeSchools.map((s,i)=>(
                  <tr key={i} onMouseEnter={e=>e.currentTarget.style.background="#0d1e30"} onMouseLeave={e=>e.currentTarget.style.background="transparent"} style={{transition:"background 0.1s"}}>
                    <td style={{...TD,color:"#4b5563",width:40}}>{i+1}</td>
                    <td style={{...TD,color:"#f9fafb",fontWeight:600}}>{s.university}</td>
                    <td style={{...TD}}><span style={{background:"#0d2d6b",color:"#93c5fd",padding:"2px 8px",borderRadius:4,fontSize:12,fontWeight:600}}>{s.country}</span></td>
                    <td style={{...TD,color:s.tuition==="Fully Funded"||s.tuition==="Tuition Free"?"#34d399":"#d1d5db",fontWeight:s.tuition==="Fully Funded"||s.tuition==="Tuition Free"?700:400}}>{s.tuition||"—"}</td>
                    <td style={{...TD,color:s.appFee==="Free"?"#34d399":"#d1d5db",fontWeight:s.appFee==="Free"?700:400}}>{s.appFee||"—"}</td>
                    <td style={{...TD,color:"#9ca3af",fontSize:12}}>{s.period||"—"}</td>
                  </tr>
                ))}
                {activeSchools.length===0&&(
                  <tr><td colSpan={6} style={{...TD,textAlign:"center",color:"#4b5563",padding:"40px"}}>No active openings found for today.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>}

      </div>
    </div>
  </>;
}

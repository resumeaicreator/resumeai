import { useState } from "react";
import ReactDOM from "react-dom";

const TEMPLATES = [
  { id:"executive", title:"Executive",  desc:"Serif, commanding" },
  { id:"modern",    title:"Modern",     desc:"Two-col sidebar" },
  { id:"minimal",   title:"Minimal",    desc:"Ultra clean" },
  { id:"elegant",   title:"Elegant",    desc:"Centered warmth" },
  { id:"bold",      title:"Bold",       desc:"Dark header" },
  { id:"navy",      title:"Navy",       desc:"Corporate blue" },
  { id:"creative",  title:"Creative",   desc:"Purple gradient" },
];

function ThumbExecutive() {
  return (
    <div style={{width:"100%",height:"100%",background:"#fff",padding:"10px 12px",fontFamily:"Georgia,serif",boxSizing:"border-box"}}>
      <div style={{fontSize:8,fontWeight:700,color:"#1a1a2e",marginBottom:1}}>ALEXANDRA CHEN</div>
      <div style={{fontSize:5,color:"#8a8a96",fontStyle:"italic",marginBottom:4}}>Chief Product Officer</div>
      <div style={{height:1.5,background:"linear-gradient(90deg,#1a1a2e,transparent)",marginBottom:3}}/>
      <div style={{fontSize:4,color:"#666",marginBottom:6}}>alex@email.com · NYC · linkedin</div>
      {["PROFILE","EXPERIENCE","EDUCATION","SKILLS"].map((s,i)=>(
        <div key={s} style={{marginBottom:5}}>
          <div style={{fontSize:4.5,fontWeight:700,letterSpacing:1,color:"#1a1a2e",borderBottom:"0.5px solid #1a1a2e44",paddingBottom:1,marginBottom:2}}>{s}</div>
          {[90,75,60].slice(0,i===0?2:3).map((w,j)=>(
            <div key={j} style={{height:2.5,width:`${w}%`,background:"#e8e8e8",borderRadius:1,marginBottom:1.5}}/>
          ))}
        </div>
      ))}
    </div>
  );
}

function ThumbModern() {
  return (
    <div style={{width:"100%",height:"100%",background:"#fff",display:"flex",fontFamily:"sans-serif",boxSizing:"border-box"}}>
      <div style={{width:"38%",background:"#0f4c81",padding:"10px 6px",flexShrink:0}}>
        <div style={{width:24,height:24,borderRadius:"50%",background:"rgba(255,255,255,0.2)",margin:"0 auto 6px"}}/>
        <div style={{fontSize:5.5,fontWeight:700,color:"#fff",textAlign:"center",marginBottom:1}}>Alex Chen</div>
        <div style={{fontSize:4,color:"rgba(255,255,255,0.7)",textAlign:"center",marginBottom:8}}>CPO</div>
        {["CONTACT","SKILLS"].map(s=>(
          <div key={s} style={{marginBottom:6}}>
            <div style={{fontSize:4,fontWeight:700,color:"#7eb3d4",letterSpacing:0.5,marginBottom:3}}>{s}</div>
            {[85,70,90,65].slice(0,s==="SKILLS"?4:3).map((w,i)=>(
              <div key={i} style={{marginBottom:3}}>
                <div style={{height:2,background:"rgba(255,255,255,0.15)",borderRadius:1}}>
                  <div style={{height:"100%",width:`${w}%`,background:"#7eb3d4",borderRadius:1}}/>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div style={{flex:1,padding:"10px 8px"}}>
        {["ABOUT ME","EXPERIENCE","EDUCATION"].map((s,i)=>(
          <div key={s} style={{marginBottom:6}}>
            <div style={{fontSize:4.5,fontWeight:700,color:"#0f4c81",borderBottom:"0.5px solid #0f4c8133",paddingBottom:1,marginBottom:2}}>{s}</div>
            {[90,75,i===0?0:85,70].filter(Boolean).slice(0,i===0?2:3).map((w,j)=>(
              <div key={j} style={{height:2.5,width:`${w}%`,background:"#eee",borderRadius:1,marginBottom:1.5}}/>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function ThumbMinimal() {
  return (
    <div style={{width:"100%",height:"100%",background:"#fff",padding:"14px 14px",fontFamily:"Georgia,serif",boxSizing:"border-box"}}>
      <div style={{fontSize:9,fontWeight:400,color:"#2c2c2c",marginBottom:2}}>Alex Chen</div>
      <div style={{fontSize:4.5,color:"#aaa",letterSpacing:2,marginBottom:6}}>PRODUCT OFFICER</div>
      <div style={{height:0.5,background:"#eee",marginBottom:4}}/>
      <div style={{fontSize:3.5,color:"#888",marginBottom:8}}>alex@email.com · NYC</div>
      {["SUMMARY","EXPERIENCE","EDUCATION","SKILLS"].map((s,i)=>(
        <div key={s} style={{marginBottom:6}}>
          <div style={{fontSize:3.5,color:"#aaa",letterSpacing:1,marginBottom:2}}>{s}</div>
          <div style={{height:0.5,background:"#f0f0f0",marginBottom:3}}/>
          {[90,75,i<2?60:0].filter(Boolean).map((w,j)=>(
            <div key={j} style={{height:2,width:`${w}%`,background:"#f0f0f0",borderRadius:1,marginBottom:1.5}}/>
          ))}
        </div>
      ))}
    </div>
  );
}

function ThumbElegant() {
  return (
    <div style={{width:"100%",height:"100%",background:"#fffdf9",padding:"10px 12px",fontFamily:"Georgia,serif",boxSizing:"border-box"}}>
      <div style={{textAlign:"center",marginBottom:5,paddingBottom:5,borderBottom:"0.5px solid #6b4c3b44"}}>
        <div style={{fontSize:8,fontWeight:400,color:"#6b4c3b",marginBottom:2}}>Alexandra Chen</div>
        <div style={{fontSize:4.5,color:"#9a7b6b",fontStyle:"italic",marginBottom:3}}>Chief Product Officer</div>
        <div style={{fontSize:3.5,color:"#bbb"}}>alex@email.com · NYC</div>
      </div>
      {["PROFILE","EXPERIENCE","EDUCATION","SKILLS"].map((s,i)=>(
        <div key={s} style={{marginBottom:5}}>
          <div style={{fontSize:4,fontWeight:700,letterSpacing:1,color:"#9a7b6b",borderBottom:"0.5px solid #6b4c3b33",paddingBottom:1,marginBottom:2}}>{s}</div>
          {[88,72,i<2?58:0].filter(Boolean).map((w,j)=>(
            <div key={j} style={{height:2.5,width:`${w}%`,background:"#f0e8e0",borderRadius:1,marginBottom:1.5}}/>
          ))}
        </div>
      ))}
    </div>
  );
}

function ThumbBold() {
  return (
    <div style={{width:"100%",height:"100%",background:"#fff",fontFamily:"sans-serif",boxSizing:"border-box",overflow:"hidden"}}>
      <div style={{background:"#111",padding:"10px 12px"}}>
        <div style={{fontSize:7.5,fontWeight:800,color:"#fff",marginBottom:1}}>ALEX CHEN</div>
        <div style={{fontSize:4.5,color:"#e8c96d",fontWeight:600,letterSpacing:1,marginBottom:4}}>CHIEF PRODUCT OFFICER</div>
        <div style={{fontSize:3.5,color:"rgba(255,255,255,0.5)"}}>alex@email.com · NYC</div>
      </div>
      <div style={{padding:"8px 12px"}}>
        {["PROFILE","EXPERIENCE","EDUCATION","SKILLS"].map((s,i)=>(
          <div key={s} style={{marginBottom:5}}>
            <div style={{fontSize:4.5,fontWeight:700,color:"#111",borderBottom:"1.5px solid #111",paddingBottom:1,marginBottom:2}}>{s}</div>
            {[88,72,i<2?60:0].filter(Boolean).map((w,j)=>(
              <div key={j} style={{height:2.5,width:`${w}%`,background:"#e8e8e8",borderRadius:1,marginBottom:1.5}}/>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function ThumbNavy() {
  return (
    <div style={{width:"100%",height:"100%",background:"#fff",fontFamily:"sans-serif",boxSizing:"border-box",display:"flex",overflow:"hidden"}}>
      <div style={{width:3,background:"#1b3a5c",flexShrink:0}}/>
      <div style={{flex:1}}>
        <div style={{background:"#e8f0f7",padding:"8px 10px",borderBottom:"2px solid #1b3a5c"}}>
          <div style={{fontSize:7,fontWeight:700,color:"#1b3a5c",marginBottom:1}}>Alex Chen</div>
          <div style={{fontSize:4.5,color:"#5a7a9a",marginBottom:3}}>Chief Product Officer</div>
          <div style={{fontSize:3.5,color:"#666"}}>alex@email.com · NYC</div>
        </div>
        <div style={{padding:"6px 10px"}}>
          {["PROFESSIONAL SUMMARY","WORK EXPERIENCE","CORE SKILLS"].map((s,i)=>(
            <div key={s} style={{marginBottom:5}}>
              <div style={{fontSize:4,fontWeight:700,color:"#1b3a5c",borderBottom:"0.5px solid #1b3a5c33",paddingBottom:1,marginBottom:2}}>{s}</div>
              {s==="CORE SKILLS"?(
                <div style={{display:"flex",gap:2,flexWrap:"wrap"}}>
                  {[30,25,35,28].map((w,j)=>(
                    <div key={j} style={{height:5,width:w,background:"#e8f0f7",borderRadius:2,border:"0.5px solid #1b3a5c22"}}/>
                  ))}
                </div>
              ):(
                [88,72,60].slice(0,i===0?2:3).map((w,j)=>(
                  <div key={j} style={{height:2.5,width:`${w}%`,background:"#eee",borderRadius:1,marginBottom:1.5}}/>
                ))
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ThumbCreative() {
  return (
    <div style={{width:"100%",height:"100%",background:"#fff",fontFamily:"sans-serif",boxSizing:"border-box",overflow:"hidden"}}>
      <div style={{background:"linear-gradient(135deg,#5b2d8e,#9b59b6)",padding:"10px 12px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
          <div>
            <div style={{fontSize:7,fontWeight:700,color:"#fff",marginBottom:1}}>Alex Chen</div>
            <div style={{fontSize:4,color:"rgba(255,255,255,0.85)"}}>Chief Product Officer</div>
          </div>
          <div style={{textAlign:"right"}}>
            {["alex@email.com","NYC"].map((t,i)=>(
              <div key={i} style={{fontSize:3,color:"rgba(255,255,255,0.65)"}}>{t}</div>
            ))}
          </div>
        </div>
      </div>
      <div style={{display:"flex",height:"calc(100% - 44px)"}}>
        <div style={{flex:"0 0 60%",padding:"6px 8px",borderRight:"0.5px solid #eee"}}>
          {["ABOUT","EXPERIENCE","EDUCATION"].map((s,i)=>(
            <div key={s} style={{marginBottom:5}}>
              <div style={{fontSize:4,fontWeight:700,color:"#5b2d8e",borderBottom:"0.5px solid #5b2d8e33",paddingBottom:1,marginBottom:2}}>{s}</div>
              {[88,72,i===0?0:60].filter(Boolean).map((w,j)=>(
                <div key={j} style={{height:2.5,width:`${w}%`,background:"#eee",borderRadius:1,marginBottom:1.5}}/>
              ))}
            </div>
          ))}
        </div>
        <div style={{flex:1,padding:"6px 6px",background:"#faf8ff"}}>
          <div style={{fontSize:4,fontWeight:700,color:"#5b2d8e",marginBottom:4}}>SKILLS</div>
          {[["React",80],["Python",65],["Design",90],["SQL",70]].map(([name,pct],i)=>(
            <div key={i} style={{marginBottom:4}}>
              <div style={{fontSize:3.5,color:"#333",marginBottom:1}}>{name}</div>
              <div style={{height:3,background:"#e8d5f5",borderRadius:2}}>
                <div style={{height:"100%",width:`${pct}%`,background:"linear-gradient(90deg,#5b2d8e,#9b59b6)",borderRadius:2}}/>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const THUMBS = {
  executive: ThumbExecutive,
  modern:    ThumbModern,
  minimal:   ThumbMinimal,
  elegant:   ThumbElegant,
  bold:      ThumbBold,
  navy:      ThumbNavy,
  creative:  ThumbCreative,
};

function Popup({ id, x, y }) {
  const ThumbComponent = THUMBS[id];
  const label = TEMPLATES.find(t=>t.id===id)?.title || "";
  const left  = Math.min(x + 20, window.innerWidth - 200);
  const top   = Math.max(y - 240, 10);

  return ReactDOM.createPortal(
    <div style={{
      position:"fixed", left, top,
      width:180, height:254,
      zIndex:999999,
      borderRadius:8,
      boxShadow:"0 24px 64px rgba(0,0,0,0.8)",
      overflow:"hidden",
      pointerEvents:"none",
      border:"2px solid #c9a84c",
    }}>
      <div style={{width:"100%",height:230}}>
        <ThumbComponent />
      </div>
      <div style={{
        position:"absolute",bottom:0,left:0,right:0,
        padding:"5px 10px",
        background:"rgba(0,0,0,0.9)",
        textAlign:"center",fontSize:11,fontWeight:600,color:"#c9a84c"
      }}>
        {label}
      </div>
    </div>,
    document.body
  );
}

export default function TemplateSelector({ value, onChange }) {
  const [hovered, setHovered] = useState(null);
  const [pos, setPos]         = useState({ x:0, y:0 });

  return (
    <>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(110px,1fr))", gap:10 }}>
        {TEMPLATES.map(t => (
          <div
            key={t.id}
            className={`mode-card${value===t.id?" active":""}`}
            onClick={()=>onChange(t.id)}
            onMouseEnter={e=>{ setHovered(t.id); setPos({x:e.clientX,y:e.clientY}); }}
            onMouseMove={e=>setPos({x:e.clientX,y:e.clientY})}
            onMouseLeave={()=>setHovered(null)}
            style={{ padding:16, cursor:"pointer", border:value===t.id?"1px solid var(--gold)":"1px solid var(--ghost-border)" }}
          >
            <div style={{ fontWeight:500, fontSize:13, marginBottom:3, color:value===t.id?"var(--gold)":"#e2e2ea" }}>{t.title}</div>
            <div style={{ fontSize:11, color:"var(--ash)" }}>{t.desc}</div>
          </div>
        ))}
      </div>

      {hovered && <Popup id={hovered} x={pos.x} y={pos.y} />}
    </>
  );
}

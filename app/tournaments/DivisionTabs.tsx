"use client";
import { useState } from "react";

export default function DivisionTabs({divisions,playoffs}:{divisions:any[];playoffs:any[]}){
  const [active,setActive]=useState(divisions[0]?.id??""); const division=divisions.find(d=>d.id===active);
  if(!division)return <article className="card wide"><p>Divisions are being prepared.</p></article>;
  const groups:string[]=[...new Set<string>(division.standings.map((r:any)=>String(r.group_name??"Standings")))]; const divisionPlayoffs=playoffs.filter(m=>m.division_id===division.id);
  return <section className="grid"><nav className="division-tabs" aria-label="Tournament divisions">{divisions.map(d=><button key={d.id} className={d.id===active?"active":""} onClick={()=>setActive(d.id)}>{d.name}<small>{d.kind}</small></button>)}</nav><article className="card wide"><p className="eyebrow">{division.kind} · round robin</p><h2>{division.name}</h2>{groups.map(group=><section className="standings-group" key={group}><h3>{group==="Standings"?"Standings":`Group ${group}`}</h3><table><thead><tr><th>Entrant</th><th>W</th><th>L</th><th>+/-</th><th>Current Elo</th></tr></thead><tbody>{division.standings.filter((r:any)=>(r.group_name??"Standings")===group).map((r:any)=><tr key={r.id}><td>{r.name}</td><td>{r.wins}</td><td>{r.losses}</td><td>{r.point_difference}</td><td>{r.elo??"—"}</td></tr>)}</tbody></table></section>)}</article><article className="card wide"><h2>{division.name} playoffs</h2>{divisionPlayoffs.length?divisionPlayoffs.map((m:any)=><div className="match" key={m.id}><span>{m.side_one} <span className="dim">vs</span> {m.side_two}</span><strong>{m.score_one??"—"} : {m.score_two??"—"}</strong></div>):<p>No playoff matches have been generated.</p>}</article></section>;
}

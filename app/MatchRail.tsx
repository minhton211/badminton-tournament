"use client";

import { useEffect, useRef, useState } from "react";

type RailMatch = {
  id:string; stage:string; stage_label?:string; category:"singles"|"doubles"; status:string;
  court_number?:number|null; score_one?:number|null; score_two?:number|null;
  side_one:string; side_two:string; compact_one?:string; compact_two?:string; elo_changes?:{name:string;change:number}[];
};

export default function MatchRail({ history, upcoming }: { history:RailMatch[]; upcoming:RailMatch[] }) {
  const rail=useRef<HTMLDivElement>(null);
  const latest=useRef<HTMLButtonElement>(null);
  const [selected,setSelected]=useState<RailMatch|null>(null);
  useEffect(() => { if(rail.current&&latest.current) rail.current.scrollLeft=Math.max(0,latest.current.offsetLeft-rail.current.offsetLeft); }, []);
  const cards=[...history,...upcoming];
  if(!cards.length) return <section className="match-rail-empty"><strong>Matches will appear here.</strong><span>Results and the upcoming queue are published as the tournament progresses.</span></section>;
  return <>
    <section className="match-rail-wrap" aria-label="Match history and upcoming matches">
      <div className="match-rail" ref={rail}>
        {cards.map((match,index) => {
          const complete=match.status==="completed",live=match.status==="assigned"||match.status==="in_progress";
          const isLatest=complete&&index===history.length-1;
          return <button key={match.id} ref={isLatest?latest:undefined} className={`rail-card ${complete?"completed":live?"live":"upcoming"}`} onClick={()=>setSelected(match)}>
            <span className="rail-meta"><span>{match.stage_label ?? match.stage}</span><span className={live?"live-status":""}>{live&&<i className="live-dot" aria-hidden="true"/>}{complete?"Result":live?"Live":"Upcoming"}</span></span>
            <span className="rail-sides"><span>{match.compact_one ?? match.side_one}<b>{complete?match.score_one:""}</b></span><span>{match.compact_two ?? match.side_two}<b>{complete?match.score_two:""}</b></span></span>
            <span className="rail-footer">{match.court_number ? `Court ${match.court_number}` : complete ? "Completed" : match.status === "held" ? "Held" : "Court TBC"}<em>View ›</em></span>
          </button>;
        })}
      </div>
    </section>
    {selected&&<div className="match-dialog-backdrop" role="presentation" onMouseDown={()=>setSelected(null)}><section className="match-dialog" role="dialog" aria-modal="true" aria-labelledby="match-detail-title" onMouseDown={event=>event.stopPropagation()}>
      <button className="dialog-close" aria-label="Close match details" onClick={()=>setSelected(null)}>×</button>
      <p className="eyebrow">{selected.category === "singles" ? "Singles" : "Doubles"} · {selected.stage_label ?? selected.stage}</p><h2 id="match-detail-title">Match detail</h2>
      <div className="detail-score"><span>{selected.side_one}</span><strong>{selected.score_one ?? "—"}</strong><span>{selected.side_two}</span><strong>{selected.score_two ?? "—"}</strong></div>
      {selected.elo_changes?.length?<div className="detail-elo"><strong>Elo update</strong>{selected.elo_changes.map(change=><span key={change.name}>{change.name}<b className={change.change>0?"gain":"loss"}>{change.change>0?"+":""}{change.change}</b></span>)}</div>:null}
      <p>{selected.status === "completed" ? "Completed" : selected.status === "held" ? "Held" : selected.status === "assigned"||selected.status === "in_progress" ? "Live" : "Upcoming"} · {selected.court_number ? `Court ${selected.court_number}` : "Court to be assigned"}</p>
    </section></div>}
  </>;
}

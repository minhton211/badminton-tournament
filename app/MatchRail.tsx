"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "./LocaleProvider";

type RailMatch = {
  id:string; stage:string; stage_label?:string; category:"singles"|"doubles"; status:string;
  court_number?:number|null; score_one?:number|null; score_two?:number|null;
  side_one:string; side_two:string; compact_one?:string; compact_two?:string; elo_changes?:{name:string;change:number}[];
};

export default function MatchRail({ history, upcoming, onMatch }: { history:RailMatch[]; upcoming:RailMatch[]; onMatch?:(match:RailMatch)=>void }) {
  const rail=useRef<HTMLDivElement>(null);
  const [selected,setSelected]=useState<RailMatch|null>(null);
  const {t}=useLocale();
  const cards=[...new Map([...history,...upcoming].map(match=>[match.id,match])).values()];
  const activeId=cards.find(match=>match.status==="assigned"||match.status==="in_progress")?.id;
  useEffect(()=>{const container=rail.current;if(!container)return;const active=activeId?container.querySelector(`[data-match-id="${activeId}"]`):null;if(active instanceof HTMLElement)container.scrollTo({left:Math.max(0,active.offsetLeft-container.offsetLeft),behavior:"smooth"});else container.scrollLeft=0;},[activeId]);
  if(!cards.length) return <section className="match-rail-empty"><strong>{t("matchesAppear")}</strong><span>{t("resultsPublished")}</span></section>;
  return <>
    <section className="match-rail-wrap" aria-label={`${t("allMatches")} · ${t("upcoming")}`}>
      <div className="match-rail" ref={rail}>
        {cards.map(match => {
          const complete=match.status==="completed",live=match.status==="assigned"||match.status==="in_progress";
          return <button key={match.id} data-match-id={match.id} className={`rail-card ${complete?"completed":live?"live":"upcoming"}`} onClick={()=>onMatch&&match.status!=="pending"?onMatch(match):setSelected(match)}>
            <span className="rail-meta"><span>{match.stage_label ?? match.stage}</span><span className={live?"live-status":""}>{live&&<i className="live-dot" aria-hidden="true"/>}{complete?t("result"):live?t("live"):t("upcoming")}</span></span>
            <span className="rail-sides"><span>{match.compact_one ?? match.side_one}<b>{complete?match.score_one:""}</b></span><span>{match.compact_two ?? match.side_two}<b>{complete?match.score_two:""}</b></span></span>
            <span className="rail-footer">{match.court_number ? `${t("court")} ${match.court_number}` : complete ? t("completed") : match.status === "held" ? t("held") : t("courtTbc")}<em>{t("view")} ›</em></span>
          </button>;
        })}
      </div>
    </section>
    {selected&&<div className="match-dialog-backdrop" role="presentation" onMouseDown={()=>setSelected(null)}><section className="match-dialog" role="dialog" aria-modal="true" aria-labelledby="match-detail-title" onMouseDown={event=>event.stopPropagation()}>
      <button className="dialog-close" aria-label={t("closeMatch")} onClick={()=>setSelected(null)}>×</button>
      <p className="eyebrow">{selected.category === "singles" ? t("singles") : t("doubles")} · {selected.stage_label ?? selected.stage}</p><h2 id="match-detail-title">{t("matchDetail")}</h2>
      <div className="detail-score"><span>{selected.side_one}</span><strong>{selected.score_one ?? "—"}</strong><span>{selected.side_two}</span><strong>{selected.score_two ?? "—"}</strong></div>
      {selected.elo_changes?.length?<div className="detail-elo"><strong>{t("eloUpdate")}</strong>{selected.elo_changes.map(change=><span key={change.name}>{change.name}<b className={change.change>0?"gain":"loss"}>{change.change>0?"+":""}{change.change}</b></span>)}</div>:null}
      <p>{selected.status === "completed" ? t("completed") : selected.status === "held" ? t("held") : selected.status === "assigned"||selected.status === "in_progress" ? t("live") : t("upcoming")} · {selected.court_number ? `${t("court")} ${selected.court_number}` : t("courtAssigned")}</p>
    </section></div>}
  </>;
}

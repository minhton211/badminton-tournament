import { NextResponse } from "next/server";
import { requireOrganizer } from "@/lib/auth";
import { deleteTournament, generatePlayoffs, getDashboard, organizer, recordResult, type Kind, type PlayoffSize } from "@/lib/db";

export async function POST(request:Request) {
  try {
    requireOrganizer(); const b=await request.json(); const tid=String(b.tournamentId??"");
    if(b.action==="createTournament") { const name=String(b.name??"").trim(); if(!name) throw Error("Tournament name is required."); return NextResponse.json({ok:true,id:await organizer.createTournament(name,b.date?String(b.date):null)}); }
    if(b.action==="deleteTournament") { await deleteTournament(tid,String(b.confirmation??"")); return NextResponse.json({ok:true,deleted:true}); }
    if(b.action==="importPlayers") { const result=await organizer.importPlayers(tid,b.rows??[]); return NextResponse.json({ok:true,...result,dashboard:await getDashboard(tid)}); }
    if(b.action==="updateTournament") await organizer.updateTournament(tid,{name:String(b.name),date:b.date?String(b.date):null,courtCount:Number(b.courtCount)});
    else if(b.action==="setup") await organizer.setup(tid,b.step);
    else if(b.action==="lifecycle") await organizer.lifecycle(tid,b.status);
    else if(b.action==="feature") await organizer.feature(tid,b.featured!==false);
    else if(b.action==="addDivision") await organizer.addDivision(tid,{name:String(b.name),kind:b.kind as Kind,groupCount:Number(b.groupCount),playoffSize:Number(b.playoffSize) as PlayoffSize});
    else if(b.action==="updateDivision") await organizer.updateDivision(tid,String(b.divisionId),{name:String(b.name),kind:b.kind as Kind,groupCount:Number(b.groupCount),playoffSize:Number(b.playoffSize) as PlayoffSize});
    else if(b.action==="deleteDivision") await organizer.deleteDivision(tid,String(b.divisionId),b.confirmDelete===true);
    else if(b.action==="enroll") await organizer.enroll(tid,String(b.divisionId),String(b.playerId));
    else if(b.action==="removeEntry") await organizer.removeEntry(tid,String(b.divisionId),String(b.playerId));
    else if(b.action==="editPlayer") await organizer.editPlayer(tid,String(b.playerId),String(b.name),Number(b.elo));
    else if(b.action==="rating") await organizer.rating(tid,{kFactor:Number(b.kFactor),ratingScale:Number(b.ratingScale),marginWeight:Number(b.marginWeight)});
    else if(b.action==="assignSlot") await organizer.assignSlot(tid,String(b.divisionId),String(b.slotId),Array.isArray(b.playerIds)?b.playerIds.map(String):[]);
    else if(b.action==="autoFillDoubles") await organizer.autoFillDoubles(tid,String(b.divisionId),b.mode==="shuffle"?"shuffle":"balanced");
    else if(b.action==="qualifiers") await organizer.qualifiers(tid,String(b.divisionId),b.qualifiers as string[]);
    else if(b.action==="playoffs") await generatePlayoffs(tid,String(b.divisionId));
    else if(b.action==="result") await recordResult(tid,String(b.matchId),Number(b.scoreOne),Number(b.scoreTwo),b.confirmReset===true);
    else if(b.action==="clearResult") await organizer.clearResult(tid,String(b.matchId),b.confirmReset===true);
    else if(b.action==="hold") await organizer.hold(tid,String(b.matchId));
    else if(b.action==="move") await organizer.move(tid,String(b.matchId),Number(b.courtNumber));
    else throw Error("Unsupported organizer action.");
    return NextResponse.json({ok:true,dashboard:tid?await getDashboard(tid):undefined});
  } catch(error) { return NextResponse.json({error:error instanceof Error?error.message:"Request failed"},{status:400}); }
}

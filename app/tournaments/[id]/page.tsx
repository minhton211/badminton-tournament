import Link from "next/link";
import LiveRefresh from "@/app/LiveRefresh";
import { getDashboard } from "@/lib/db";
import EventView from "../EventView";
export const dynamic="force-dynamic";
export default async function TournamentPage({params}:{params:{id:string}}){const d=await getDashboard(params.id);return <main><LiveRefresh/><header><div><div className="brand">TOURNAMENT</div><h1>{d.event.name}</h1><p>{d.event.date??d.event.status}</p></div><div className="header-actions"><Link className="tag" href="/">Tournament hub</Link><Link className="tag" href="/organizer">Organizer sign in</Link></div></header><EventView data={d}/></main>}

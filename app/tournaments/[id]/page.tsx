import LiveRefresh from "@/app/LiveRefresh";
import { getDashboard } from "@/lib/db";
import EventView from "../EventView";
import SiteHeader from "@/app/SiteHeader";
export const dynamic="force-dynamic";
export default async function TournamentPage({params}:{params:{id:string}}){const d=await getDashboard(params.id);return <main><LiveRefresh/><SiteHeader kind="tournament" title={d.event.name} subtitle={d.event.date??d.event.status}/><EventView data={d}/></main>}

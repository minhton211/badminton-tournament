import Link from "next/link";
import OrganizerPanel from "./OrganizerPanel";
import { getDashboard, getOrganizerData } from "@/lib/db";
import { isOrganizer } from "@/lib/auth";
export const dynamic="force-dynamic";
export default async function OrganizerPage({searchParams}:{searchParams:{tournament?:string}}){const signed=isOrganizer();const data=signed?await getOrganizerData():null;const selected=data?.tournaments.find(t=>t.id===searchParams.tournament)?.id;const dashboard=signed&&selected?await getDashboard(selected):null;return <main><header><div><div className="brand">TOURNAMENT CONTROL</div><h1>{dashboard?dashboard.event.name:"Organizer desk"}</h1></div><Link className="tag" href="/">View public site</Link></header><OrganizerPanel initialSignedIn={signed} data={data} dashboard={dashboard}/></main>}

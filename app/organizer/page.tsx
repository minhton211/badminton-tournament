import OrganizerPanel from "./OrganizerPanel";
import { getDashboard, getOrganizerData } from "@/lib/db";
import { isOrganizer } from "@/lib/auth";
import SiteHeader from "@/app/SiteHeader";
export const dynamic="force-dynamic";
export default async function OrganizerPage({searchParams}:{searchParams:{tournament?:string}}){const signed=isOrganizer();const data=signed?await getOrganizerData():null;const selected=data?.tournaments.find(t=>t.id===searchParams.tournament)?.id;const dashboard=signed&&selected?await getDashboard(selected):null;return <main><SiteHeader kind="organizer" title={dashboard?.event.name}/><OrganizerPanel initialSignedIn={signed} data={data} dashboard={dashboard}/></main>}

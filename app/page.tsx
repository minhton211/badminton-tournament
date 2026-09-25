import { getHome } from "@/lib/db";
import HomeContent from "./HomeContent";
export const dynamic="force-dynamic";
export default async function Home(){return <HomeContent data={await getHome()}/>}

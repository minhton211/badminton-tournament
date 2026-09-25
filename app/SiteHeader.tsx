"use client";
import Link from "next/link";
import LanguageToggle from "./LanguageToggle";
import { useLocale } from "./LocaleProvider";
export default function SiteHeader({kind,title,subtitle}:{kind:"home"|"tournament"|"organizer";title?:string;subtitle?:string}){const {t}=useLocale();const brand=kind==="home"?t("homeBrand"):kind==="tournament"?t("tournament"):t("control");const heading=title??(kind==="home"?t("hub"):t("organizerDesk"));return <header><div><div className="brand">{brand}</div><h1>{heading}</h1>{subtitle&&<p>{subtitle}</p>}</div><div className="header-actions"><LanguageToggle/>{kind==="tournament"&&<Link className="tag" href="/">{t("tournamentHub")}</Link>}{kind!=="organizer"&&<Link className="tag" href="/organizer">{t("signIn")}</Link>}{kind==="organizer"&&<Link className="tag" href="/">{t("publicSite")}</Link>}</div></header>}

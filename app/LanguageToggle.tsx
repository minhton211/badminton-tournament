"use client";
import { useLocale } from "./LocaleProvider";
export default function LanguageToggle(){const {locale,setLocale,t}=useLocale();return <div className="language-toggle" role="group" aria-label={t("language")}><button className={locale==="vi"?"active":""} onClick={()=>setLocale("vi")} aria-pressed={locale==="vi"}>{t("vietnamese")}</button><button className={locale==="en"?"active":""} onClick={()=>setLocale("en")} aria-pressed={locale==="en"}>{t("english")}</button></div>}

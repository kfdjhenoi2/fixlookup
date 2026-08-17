import { permanentRedirect } from "next/navigation";
import { defaultLocale } from "@/lib/i18n/config";
import { paths } from "@/lib/i18n/routing";

export default function RootPage() {
  permanentRedirect(paths.home(defaultLocale));
}

import type { TrustedClient } from "@/lib/sanitySite";
import trustedByFallback from "@/data/trusted-by.json";
import timelapseIcon from "@/assets/client-icons/timelapse.png";
import noamFiruzIcon from "@/assets/client-icons/noam-firuz.png";
import xaufundedIcon from "@/assets/client-icons/xaufunded.png";
import mbIcon from "@/assets/client-icons/MB.png";
import itayDahariIcon from "@/assets/client-icons/itay-dahari.png";
import margoaNataniaIcon from "@/assets/client-icons/margoa-natania.png";
import paletJewlryIcon from "@/assets/client-icons/palet-jewlry.png";
import saritFarjunIcon from "@/assets/client-icons/sarit-farjun.png";
import shapoDigitalIcon from "@/assets/client-icons/shapo-digital.png";
import theBoldCrewIcon from "@/assets/client-icons/the-bold-crew.png";

const iconMap: Record<string, string> = {
  timelapse: timelapseIcon,
  "noam-firuz": noamFiruzIcon,
  xaufunded: xaufundedIcon,
  MB: mbIcon,
  "itay-dahari": itayDahariIcon,
  "margoa-natania": margoaNataniaIcon,
  "palet-jewlry": paletJewlryIcon,
  "sarit-farjun": saritFarjunIcon,
  "shapo-digital": shapoDigitalIcon,
  "the-bold-crew": theBoldCrewIcon,
};

export type ResolvedTrustedClient = {
  id: string;
  name: string;
  iconSrc?: string;
  url?: string;
};

export const resolveTrustedClients = (
  trustedClients: TrustedClient[]
): ResolvedTrustedClient[] => {
  if (trustedClients.length > 0) {
    return trustedClients.map((client) => ({
      id: client.id,
      name: client.name,
      iconSrc: client.logoUrl || (client.iconKey ? iconMap[client.iconKey] : undefined),
      url: client.url,
    }));
  }

  return (trustedByFallback as Array<{ name: string; icon: string; url: string | null }>).map(
    (client, index) => ({
      id: `${client.name}-${index}`,
      name: client.name,
      iconSrc: iconMap[client.icon],
      url: client.url ?? undefined,
    })
  );
};

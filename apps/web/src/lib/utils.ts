import { clsx, type ClassValue } from"clsx"
import { twMerge } from"tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getAssetImage(categoryName: string) {
  if (!categoryName) return "/images/assets/server.png"
  const cat = categoryName.toLowerCase()
  
  // IT Infrastructure
  if (cat.includes("server") || cat.includes("compute") || cat.includes("mainframe")) return "/images/assets/server.png"
  if (cat.includes("chassis") || cat.includes("subrack") || cat.includes("enclosure")) return "/images/assets/chassis.png"
  if (cat.includes("switch") || cat.includes("network")) return "/images/assets/switch.png"
  if (cat.includes("router")) return "/images/assets/router.png"
  if (cat.includes("firewall") || cat.includes("security")) return "/images/assets/firewall.png"
  if (cat.includes("storage") || cat.includes("san")) return "/images/assets/storage.png"
  if (cat.includes("rack") || cat.includes("cabinet")) return "/images/assets/rack.png"
  if (cat.includes("transceiver") || cat.includes("sfp")) return "/images/assets/transceiver.png"
  if (cat.includes("odf") || cat.includes("patch")) return "/images/assets/odf.png"
  if (cat.includes("access point") || cat.includes("wifi")) return "/images/assets/access_point.png"
  
  // Power Systems
  if (cat.includes("ups")) return "/images/assets/ups.png"
  if (cat.includes("battery") || cat.includes("baterai")) return "/images/assets/battery.png"
  if (cat.includes("rectifier")) return "/images/assets/rectifier.png"
  if (cat.includes("genset") || cat.includes("generator")) return "/images/assets/genset.png"
  if (cat.includes("pdu") || cat.includes("power distribution")) return "/images/assets/pdu.png"
  if (cat.includes("mdp") || cat.includes("sdp")) return "/images/assets/mdp.png"
  if (cat.includes("ats") || cat.includes("transfer switch")) return "/images/assets/ats.png"
  if (cat.includes("panel") || cat.includes("listrik")) return "/images/assets/mdp.png"

  // Cooling Systems
  if (cat.includes("pac") || cat.includes("precision")) return "/images/assets/pac.png"
  if (cat.includes("crac") || cat.includes("crah")) return "/images/assets/pac.png"
  if (cat.includes("chiller")) return "/images/assets/chiller.png"
  if (cat.includes("split")) return "/images/assets/ac_wall.png"
  if (cat.includes("ac") || cat.includes("aircon") || cat.includes("cooling") || cat.includes("standing")) return "/images/assets/ac_standing.png"
  if (cat.includes("humidifier")) return "/images/assets/humidifier.png"

  // Security & Physical
  if (cat.includes("nvr") || cat.includes("dvr")) return "/images/assets/nvr.png"
  if (cat.includes("webcam")) return "/images/assets/webcam.png"
  if (cat.includes("cctv") || cat.includes("camera")) return "/images/assets/cctv.png"
  if (cat.includes("monitor") || cat.includes("display") || cat.includes("tv")) return "/images/assets/monitor.png"
  if (cat.includes("key") || cat.includes("kunci")) return "/images/assets/keybox.png"
  if (cat.includes("access") || cat.includes("biometric") || cat.includes("door")) return "/images/assets/biometric.png"
  if (cat.includes("turnstile")) return "/images/assets/turnstile.png"

  // Fire Suppression
  if (cat.includes("cylinder") || cat.includes("agent")) return "/images/assets/cylinder.png"
  if (cat.includes("panel") && (cat.includes("fire") || cat.includes("fss"))) return "/images/assets/fss_panel.png"
  if (cat.includes("nozzle")) return "/images/assets/nozzle.png"
  if (cat.includes("evacuate") || cat.includes("sign")) return "/images/assets/evacuate_sign.png"
  if (cat.includes("alarm") || cat.includes("push") || cat.includes("horn") || cat.includes("strobe") || cat.includes("abort")) return "/images/assets/alarm.png"
  if (cat.includes("detector") || cat.includes("vesda") || cat.includes("photoelectric")) return "/images/assets/vesda.png"
  if (cat.includes("fire") || cat.includes("fm200")) return "/images/assets/fm200.png"
  
  // Environmental
  if (cat.includes("sensor") || cat.includes("environmental")) return "/images/assets/sensor.png"
  if (cat.includes("controller") || cat.includes("iop")) return "/images/assets/iop.png"

  return "/images/assets/server.png"
}

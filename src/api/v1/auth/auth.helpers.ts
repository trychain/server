// packages
import geo from "geoip-lite";

export async function sendAuthEmail(): Promise<boolean> {
  // in future code the email sending function
  return true;
}

export function getGeoDetails(ip: string): { city: string; country: string } {
  const geoDetails = geo.lookup(ip);

  if (!geoDetails) {
    return { city: "unknown", country: "unknown" };
  }

  return geoDetails!;
}

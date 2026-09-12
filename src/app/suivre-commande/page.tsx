import type { Metadata } from "next";
import TrackOrderForm from "@/components/site/TrackOrderForm";

export const metadata: Metadata = { title: "Suivre ma commande — Mary'sens" };

export default function TrackOrderPage() {
  return <TrackOrderForm />;
}
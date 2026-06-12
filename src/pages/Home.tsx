import SummaryHeader from "@/components/SummaryHeader";
import CalendarStrip from "@/components/CalendarStrip";
import BuildingList from "@/components/BuildingList";
import { buildings } from "@/data/buildings";

export default function Home() {
  return (
    <div className="min-h-screen bg-bg-warm">
      <SummaryHeader buildings={buildings} />
      <CalendarStrip />
      <BuildingList buildings={buildings} />
    </div>
  );
}
import WatchlistGrid from "../components/watchlist/WatchlistGrid";
import DashboardLayout from "../components/shared/DashboardLayout";

export default function WatchlistPage() {
  return (
    <DashboardLayout role="buyer">
      <WatchlistGrid />
    </DashboardLayout>
  );
}

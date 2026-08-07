import MobileBottomNav from "@components/BottomNavBar";
import DesktopNav from "@components/DesktopNav";

export default function Navigation() {
	return (
		<>
			<DesktopNav />
			<MobileBottomNav />
		</>
	);
}

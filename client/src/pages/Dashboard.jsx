import DashSidebar from "../components/DashSidebar";
import DashProfile from "../components/DashProfile";

export default function Dashboard() {
    return (
        <div className="flex">
            <div className="min-h-screen border w-60">
                <DashSidebar />
            </div>
            <div className="w-full border">
                <DashProfile />
            </div>
        </div>
    );
}

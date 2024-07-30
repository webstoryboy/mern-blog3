import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSidebar from "../components/DashSidebar";
import DashProfile from "../components/DashProfile";
import DashPosts from "../components/DashPosts";
import DashUsers from "../components/DashUsers";
import DashComments from "../components/DashComments";
import DashboardComp from "../components/DashboardComp";

export default function Dashboard() {
    const location = useLocation();
    const [tab, setTab] = useState("");

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabFromUrl = urlParams.get("tab");
        // console.log(tabFromUrl);
        if (tabFromUrl) {
            setTab(tabFromUrl);
        }
    }, [location.search]);

    return (
        <div className="flex">
            <div className="min-h-screen border w-60">
                <DashSidebar />
            </div>
            <div className="w-full border">
                {tab === "profile" && <DashProfile />}
                {tab === "posts" && <DashPosts />}
                {tab === "users" && <DashUsers />}
                {tab === "comments" && <DashComments />}
                {tab === "dash" && <DashboardComp />}
            </div>
        </div>
    );
}

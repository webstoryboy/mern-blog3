import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { IoPersonCircleSharp, IoArrowRedoSharp } from "react-icons/io5";

import { signoutSuccess } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

export default function DashSidebar() {
    const location = useLocation();
    const [tab, setTab] = useState("");
    const dispatch = useDispatch();

    const { currentUser } = useSelector((state) => state.user);

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabFromUrl = urlParams.get("tab");
        // console.log(tabFromUrl);

        if (tabFromUrl) {
            setTab(tabFromUrl);
        }
    }, [location.search]);

    const handleSignout = async () => {
        try {
            const res = await fetch("/api/user/signout", {
                method: "POST",
            });
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
            } else {
                dispatch(signoutSuccess());
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <div>
            <ul className="flex flex-col gap-3 p-3 ">
                <li className={`profile ${tab === "profile" ? "text-red-500 bg-red-100" : ""}`}>
                    <Link to="/dashboard?tab=profile" className="flex items-center gap-2 p-2">
                        <IoPersonCircleSharp /> profile
                        <span>{currentUser.isAdmin ? "Admin" : "User"}</span>
                    </Link>
                </li>
                {currentUser.isAdmin && (
                    <li className="bg-slate-300">
                        <Link to="/dashboard?tab=posts" className="flex items-center gap-2 p-2">
                            <IoArrowRedoSharp />
                            posts
                        </Link>
                    </li>
                )}

                <li className="bg-slate-300">
                    <Link className="flex items-center gap-2 p-2" onClick={handleSignout}>
                        <IoArrowRedoSharp />
                        signout
                    </Link>
                </li>
            </ul>
        </div>
    );
}

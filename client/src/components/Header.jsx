import { FiLogOut } from "react-icons/fi";
import { FaMoon, FaSun } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice";
import { AiOutlineSearch } from "react-icons/ai";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Header() {
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state) => state.user);
    const { theme } = useSelector((state) => state.theme);
    const location = useLocation();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");

    console.log(searchTerm);

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get("searchTerm");
        if (searchTermFromUrl) {
            setSearchTerm(searchTermFromUrl);
        }
    }, [location.search]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(location.search);
        urlParams.set("searchTerm", searchTerm);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    };

    return (
        <section className="flex items-center justify-between py-3 mx-auto border-b max-w-7xl">
            <h1>
                <Link className="font-['Orbitron'] text-xl" to="/">
                    websloper
                </Link>
            </h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Search..."
                    className="hidden border lg:inline"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="w-12 h-10">
                    <AiOutlineSearch />
                </button>
            </form>

            <nav>
                <ul className="flex gap-4">
                    <li className="px-4 py-1 transition-all rounded-full hover:bg-slate-200">
                        <Link to="/">Home</Link>
                    </li>
                    <li className="px-4 py-1 transition-all rounded-full hover:bg-slate-200">
                        <Link to="/sign-up">signUp</Link>
                    </li>
                    <li className="px-4 py-1 transition-all rounded-full hover:bg-slate-200">
                        <Link to="/sign-in">signIn</Link>
                    </li>
                </ul>
            </nav>
            <div className="flex">
                <button
                    className="p-3 mr-1 border rounded-full hover:bg-slate-100"
                    onClick={() => dispatch(toggleTheme())}
                >
                    {theme === "light" ? <FaSun /> : <FaMoon />}
                </button>
                <button className="p-3 mr-1 border rounded-full hover:bg-slate-100">
                    <FiLogOut />
                </button>
                {currentUser ? (
                    <>
                        <img className="mr-5 rounded-full w-11 h-11" src={currentUser.profilePicture} />

                        <div className="absolute flex flex-col p-4 border top-20 right-5 w-60">
                            <span>{currentUser.username}</span>
                            <span>{currentUser.email}</span>
                            <Link to={"/dashboard?tab=profile"}>profile</Link>
                            <span>sign out</span>
                        </div>
                    </>
                ) : (
                    <Link className="border" to={"/sign-in"}>
                        sign in
                    </Link>
                )}
            </div>
        </section>
    );
}

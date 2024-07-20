import { Link } from "react-router-dom";
import { FaMoon, FaSun } from "react-icons/fa";

export default function Header() {
    const theme = "light";
    return (
        <section className="flex items-center justify-between py-3 mx-auto border-b max-w-7xl">
            <h1>
                <Link className="font-['Orbitron'] text-xl" to="/">
                    websloper
                </Link>
            </h1>
            <nav>
                <ul className="flex gap-4 font-['NanumSquareNeo']">
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
                <button className="w-11 h-11 flex items-center justify-center mr-1 border rounded-full hover:bg-slate-100">
                    {theme === "light" ? <FaSun /> : <FaMoon />}
                </button>
                <div className="w-11 h-11">
                    <img
                        src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                        className="mr-5 rounded-full w-full h-full"
                    />
                </div>
                <div className="absolute flex flex-col p-4 border top-20 right-5 w-60 font-['NanumSquareNeo']">
                    <span>currentUser.username</span>
                    <span>currentUser.email</span>
                    <Link to={"/dashboard?tab=profile"}>profile</Link>
                    <span>sign out</span>
                </div>
            </div>
        </section>
    );
}

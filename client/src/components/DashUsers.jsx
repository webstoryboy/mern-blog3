import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FaCheck, FaTimes } from "react-icons/fa";

export default function DashUsers() {
    const { currentUser } = useSelector((state) => state.user);
    const [users, setUsers] = useState([]);
    const [showMore, setShowMore] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [userIdToDelete, setUserIdToDelete] = useState("");

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch(`/api/user/getusers`);
                const data = await res.json();
                console.log(data);
                if (res.ok) {
                    setUsers(data.users);
                    if (data.users.length < 9) {
                        setShowMore(false);
                    }
                }
            } catch (error) {
                console.log(error.message);
            }
        };
        if (currentUser.isAdmin) {
            fetchUsers();
        }
    }, [currentUser._id]);

    const handleShowMore = async () => {
        const startIndex = users.length;
        try {
            const res = await fetch(`/api/user/getusers?startIndex=${startIndex}`);
            const data = await res.json();
            if (res.ok) {
                setUsers((prev) => [...prev, ...data.users]);
                if (data.users.length < 9) {
                    setShowMore(false);
                }
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    const handleDeleteUser = async () => {
        try {
            const res = await fetch(`/api/user/delete/${userIdToDelete}`, {
                method: "DELETE",
            });
            const data = await res.json();
            if (res.ok) {
                setUsers((prev) => prev.filter((user) => user._id !== userIdToDelete));
                setShowModal(false);
            } else {
                console.log(data.message);
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <div>
            {currentUser.isAdmin && users.length > 0 ? (
                <>
                    <table className="w-full p-3 mt-40 overflow-x-scroll table-auto md:mx-auto scrollbar">
                        <caption>Date Updated</caption>
                        <thead>
                            <tr>
                                <th className="p-2 border">Data Created</th>
                                <th className="p-2 border">User image</th>
                                <th className="p-2 border">Username</th>
                                <th className="p-2 border">Useremail</th>
                                <th className="p-2 border">Admin</th>
                                <th className="p-2 border">Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, index) => (
                                <tr key={index} className="bg-white dard:border-gray-700 dark:bg-gray-800">
                                    <td className="p-2 border">{new Date(user.createdAt).toLocaleDateString()}</td>
                                    <td className="p-2 border">
                                        <img
                                            src={user.profilePicture}
                                            alt={user.username}
                                            className="object-cover w-10 h-10 bg-gray-500 rounded-full"
                                        />
                                    </td>
                                    <td className="p-2 border">{user.username}</td>
                                    <td className="p-2 border">{user.email}</td>
                                    <td className="p-2 border">
                                        {user.isAdmin ? (
                                            <FaCheck className="text-green-500" />
                                        ) : (
                                            <FaTimes className="text-red-500" />
                                        )}
                                    </td>
                                    <td className="p-2 border">
                                        <span
                                            onClick={() => {
                                                setShowModal(true);
                                                setUserIdToDelete(user._id);
                                            }}
                                            className="font-medium text-red-500 cursor-pointer hover:underline"
                                        >
                                            Delete
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {showMore && (
                        <button onClick={handleShowMore} className="self-center w-full text-sm text-teal-500 py-7">
                            Show more
                        </button>
                    )}
                </>
            ) : (
                <p>회원이 없습니다.</p>
            )}
            {showModal && (
                <div className="p-4 mt-10 bg-white border">
                    <h3 className="mb-4">게시글을 정말 삭제하겠습니까?</h3>
                    <button className="block p-2 mb-2 text-white bg-red-500" onClick={handleDeleteUser}>
                        Yes
                    </button>
                    <button className="block p-2 bg-gray-300" onClick={() => setShowModal(false)}>
                        No, cancel
                    </button>
                </div>
            )}
        </div>
    );
}

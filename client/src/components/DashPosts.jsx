import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function DashPosts() {
    const { currentUser } = useSelector((state) => state.user);
    const [userPosts, setUserPosts] = useState([]);
    const [showMore, setShowMore] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [postIdToDelete, setPostIdToDelete] = useState("");
    console.log(userPosts);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`);
                const data = await res.json();
                console.log(data);
                if (res.ok) {
                    setUserPosts(data.posts);
                    if (data.posts.length < 9) {
                        setShowMore(false);
                    }
                }
            } catch (error) {
                console.log(error.message);
            }
        };
        if (currentUser.isAdmin) {
            fetchPosts();
        }
    }, [currentUser._id]);

    const handleShowMore = async () => {
        const startIndex = userPosts.length;
        try {
            const res = await fetch(`/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`);
            const data = await res.json();
            if (res.ok) {
                setUserPosts((prev) => [...prev, ...data.posts]);
                if (data.posts.length < 9) {
                    setShowMore(false);
                }
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    const handleDeletePost = async () => {
        setShowModal(false);
        try {
            const res = await fetch(`/api/post/deletepost/${postIdToDelete}/${currentUser._id}`, {
                method: "DELETE",
            });
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
            } else {
                setUserPosts((prev) => prev.filter((post) => post._id !== postIdToDelete));
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <div>
            {currentUser.isAdmin && userPosts.length > 0 ? (
                <>
                    <table className="w-full p-3 mt-40 overflow-x-scroll table-auto md:mx-auto scrollbar">
                        <caption>Date Updated</caption>
                        <thead>
                            <tr>
                                <th className="p-2 border">Data Updated</th>
                                <th className="p-2 border">post image</th>
                                <th className="p-2 border">post title</th>
                                <th className="p-2 border">category</th>
                                <th className="p-2 border">delete</th>
                                <th className="p-2 border">edit</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userPosts.map((post, index) => (
                                <tr key={index} className="bg-white dard:border-gray-700 dark:bg-gray-800">
                                    <td className="p-2 border">{new Date(post.updatedAt).toLocaleDateString()}</td>
                                    <td className="p-2 border">
                                        <Link to={`/post/${post.slug}`}>
                                            <img
                                                src={post.image}
                                                alt={post.title}
                                                className="object-cover w-20 h-10 bg-gray-500"
                                            />
                                        </Link>
                                    </td>
                                    <td className="p-2 border">
                                        <Link
                                            className="font-medium text-gray-900 dark:text-white"
                                            to={`/post/${post.slug}`}
                                        >
                                            {post.title}
                                        </Link>
                                    </td>
                                    <td className="p-2 border">{post.category}</td>
                                    <td className="p-2 border">
                                        <span
                                            onClick={() => {
                                                setShowModal(true);
                                                setPostIdToDelete(post._id);
                                            }}
                                            className="font-medium text-red-500 cursor-pointer hover:underline"
                                        >
                                            Delete
                                        </span>
                                    </td>
                                    <td className="p-2 border">
                                        <Link className="text-teal-500 hover:underline" to={`/update-post/${post._id}`}>
                                            edit
                                        </Link>
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
                <p>아직 글이 없습니다.</p>
            )}
            {showModal && (
                <div className="p-4 mt-10 bg-white border">
                    <h3 className="mb-4">게시글을 정말 삭제하겠습니까?</h3>
                    <button className="block p-2 mb-2 text-white bg-red-500" onClick={handleDeletePost}>
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

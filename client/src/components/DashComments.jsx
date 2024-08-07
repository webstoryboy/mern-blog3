import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function DashComments() {
    const { currentUser } = useSelector((state) => state.user);
    const [comments, setComments] = useState([]);
    const [showMore, setShowMore] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [commentIdToDelete, setCommentIdToDelete] = useState("");

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await fetch(`/api/comment/getcomments`);
                const data = await res.json();
                console.log(data);
                if (res.ok) {
                    setComments(data.comments);
                    if (data.comments.length < 9) {
                        setShowMore(false);
                    }
                }
            } catch (error) {
                console.log(error.message);
            }
        };
        if (currentUser.isAdmin) {
            fetchComments();
        }
    }, [currentUser._id]);

    const handleShowMore = async () => {
        const startIndex = comments.length;
        try {
            const res = await fetch(`/api/user/getcomments?startIndex=${startIndex}`);
            const data = await res.json();
            if (res.ok) {
                setComments((prev) => [...prev, ...data.comments]);
                if (data.comments.length < 9) {
                    setShowMore(false);
                }
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    const handleDeleteComment = async () => {
        setShowModal(false);

        try {
            const res = await fetch(`/api/user/delete/${commentIdToDelete}`, {
                method: "DELETE",
            });
            const data = await res.json();
            if (res.ok) {
                setComments((prev) => prev.filter((comment) => comment._id !== commentIdToDelete));
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
            {currentUser.isAdmin && comments.length > 0 ? (
                <>
                    <table className="w-full p-3 mt-40 overflow-x-scroll table-auto md:mx-auto scrollbar">
                        <caption>Date Comments</caption>
                        <thead>
                            <tr>
                                <th className="p-2 border">Data updated</th>
                                <th className="p-2 border">Comment content</th>
                                <th className="p-2 border">Number of likes</th>
                                <th className="p-2 border">PostId</th>
                                <th className="p-2 border">UserId</th>
                                <th className="p-2 border">Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {comments.map((comment) => (
                                <tr key={comment._id} className="bg-white dard:border-gray-700 dark:bg-gray-800">
                                    <td className="p-2 border">{new Date(comment.updatedAt).toLocaleDateString()}</td>
                                    <td className="p-2 border">{comment.content}</td>
                                    <td className="p-2 border">{comment.numberOfLikes}</td>
                                    <td className="p-2 border">{comment.postId}</td>
                                    <td className="p-2 border">{comment.userId}</td>
                                    <td className="p-2 border">
                                        <span
                                            onClick={() => {
                                                setShowModal(true);
                                                setCommentIdToDelete(comment._id);
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
                <p>댓글이 없습니다.</p>
            )}
            {showModal && (
                <div className="p-4 mt-10 bg-white border">
                    <h3 className="mb-4">게시글을 정말 삭제하겠습니까?</h3>
                    <button className="block p-2 mb-2 text-white bg-red-500" onClick={handleDeleteComment}>
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

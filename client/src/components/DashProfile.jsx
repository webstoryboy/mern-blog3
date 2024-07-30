import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { app } from "../firebase";

import {
    updateStart,
    updateSuccess,
    updateFailure,
    deleteUserStart,
    deleteUserSuccess,
    deleteUserFailure,
    signoutSuccess,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

export default function DashProfile() {
    const { currentUser, error, loading } = useSelector((state) => state.user);
    const [imageFile, setImageFile] = useState(null);
    const [imageFileUrl, setImageFileUrl] = useState(null);
    const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
    const [imageFileUploadError, setImageFileUploadError] = useState(null);
    const [imageFileUploading, setImageFileUploading] = useState(false);
    const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
    const [updateUserError, setUpdateUserError] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // console.log(imageFileUploadProgress, imageFileUploadError);

    const [formData, setFormData] = useState({});
    const filePickerRef = useRef();
    const dispatch = useDispatch();

    const handleImageChange = (e) => {
        // setImageFile(e.target.files[0]);
        // console.log(imageFile);
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImageFileUrl(URL.createObjectURL(file));
            setImageFileUploadError(null);
        }
    };
    // console.log(imageFile, imageFileUrl);

    useEffect(() => {
        if (imageFile) {
            uploadImage();
        }
    }, [imageFile]);

    const uploadImage = async () => {
        //service firebase.storage {
        //   match /b/{bucket}/o {
        //     match /{allPaths=**} {
        //       allow read;
        //       allow write: if
        //       request.resource.size < 2 * 1024 * 1024 &&
        //       request.resource.contentType.matches('image/.*')
        //       }
        //   }
        // }
        // console.log("uploading image...");
        setImageFileUploading(true);
        setImageFileUploadError(null);
        const storage = getStorage(app);
        const fileName = new Date().getTime() + imageFile.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, imageFile);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setImageFileUploadProgress(progress.toFixed(0));
            },
            (error) => {
                setImageFileUploadError("이미지는 2메가를 초과할 수 없습니다.");
                setImageFileUploadProgress(null);
                setImageFile(null);
                setImageFileUrl(null);
                setImageFileUploading(false);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setImageFileUrl(downloadURL);
                    setFormData({ ...formData, profilePicture: downloadURL });
                    setImageFileUploading(false);
                });
            }
        );
    };

    const handleChange = (e) => {
        setFormData((prevFormData) => ({ ...prevFormData, [e.target.id]: e.target.value }));
    };

    // console.log(formData);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdateUserError(null);
        setUpdateUserSuccess(null);

        if (Object.keys(formData).length === 0) {
            setUpdateUserError("변경된 것이 없습니다.");
            return;
        }

        if (imageFileUploading) {
            setUpdateUserError("이미지 업로드 중입니다.");
            return;
        }

        try {
            dispatch(updateStart());
            const res = await fetch(`/api/user/update/${currentUser._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message);
            }
            dispatch(updateSuccess(data));
            setUpdateUserSuccess("프로필 업데이트가 성공했습니다.");
        } catch (error) {
            dispatch(updateFailure(error.message));
            setUpdateUserError(error.message);
        }
    };

    const handleDeleteUser = async () => {
        setShowModal(false);
        try {
            dispatch(deleteUserStart());
            const res = await fetch(`/api/user/delete/${currentUser._id}`, {
                method: "DELETE",
            });
            const data = await res.json();
            if (!res.ok) {
                dispatch(deleteUserFailure(data.message));
            } else {
                dispatch(deleteUserSuccess(data));
                alert("계정이 성공적으로 삭제되었습니다.");
            }
        } catch (error) {
            dispatch(deleteUserFailure(error.message));
        }
    };

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
        <div className="max-w-lg mx-auto">
            <h1 className="w-full p-10 text-2xl text-center">profile</h1>
            <form className="flex flex-col" onSubmit={handleSubmit}>
                <input type="file" accept="image/*" onChange={handleImageChange} ref={filePickerRef} hidden />

                <div
                    className="relative self-center w-32 h-32 cursor-pointer"
                    onClick={() => filePickerRef.current.click()}
                >
                    <img
                        className="rounded-full w-full h-full object-cover border-8 border-[lightgray]"
                        src={imageFileUrl || currentUser.profilePicture}
                        alt="user"
                    />
                    <span className="absolute left-3 top-11">{`${imageFileUploadProgress}%`}</span>
                </div>

                <input
                    type="text"
                    id="username"
                    placeholder="이름"
                    className="p-5 px-10 mt-5 border rounded-full text-slate-600"
                    defaultValue={currentUser.username}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    id="email"
                    placeholder="이메일"
                    className="p-5 px-10 mt-5 border rounded-full text-slate-600"
                    defaultValue={currentUser.email}
                    onChange={handleChange}
                />
                <input
                    type="password"
                    id="password"
                    placeholder="비밀번호"
                    className="p-5 px-10 mt-5 border rounded-full text-slate-600"
                    defaultValue="********"
                    onChange={handleChange}
                />
                <button
                    type="submit"
                    className="p-5 px-10 mt-5 text-white rounded-full bg-slate-600"
                    disabled={loading || imageFileUploading}
                >
                    {loading ? "Loading..." : "Update"}
                </button>
                {currentUser.isAdmin && (
                    <Link to={"/create-post"}>
                        <button type="button" className="w-full p-5 px-10 mt-2 text-white bg-red-600 rounded-full">
                            Create a post
                        </button>
                    </Link>
                )}
                <div className="flex justify-between mt-3 text-red-500">
                    <span className="cursor-pointer" onClick={() => setShowModal(true)}>
                        계정 삭제
                    </span>
                    <span className="cursor-pointer" onClick={handleSignout}>
                        로그아웃
                    </span>
                </div>
                {imageFileUploadError && <div color="failure">{imageFileUploadError}</div>}
                {updateUserSuccess && <div className="bg-red-300">{updateUserSuccess}</div>}
                {updateUserError && <div className="bg-red-300">{updateUserError}</div>}
                {error && <div className="bg-red-300">{error}</div>}
            </form>
            {showModal && (
                <div className="p-4 mt-10 bg-white border">
                    <h3 className="mb-4">계정을 정말 삭제하겠습니까?</h3>
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

import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

// PrivateRoute 컴포넌트를 정의합니다.
export default function PrivateRoute() {
    // Redux store에서 currentUser 상태를 가져옵니다.
    const { currentUser } = useSelector((state) => state.user);

    // currentUser가 존재하면 <Outlet /> 컴포넌트를 반환하여 자식 라우트를 렌더링합니다.
    // currentUser가 존재하지 않으면 "/sign-in" 경로로 리디렉션합니다.
    return currentUser ? <Outlet /> : <Navigate to="/sign-in" />;
}

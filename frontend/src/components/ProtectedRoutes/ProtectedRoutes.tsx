import {AppUser} from "../../types/AppUser.ts";
import {Navigate, Outlet} from "react-router-dom";

type ProtectedRoutesProps = {
    user: AppUser | null | undefined;
}

export default function ProtectedRoutes(props: Readonly<ProtectedRoutesProps>) {
    if(props.user === undefined) {
        return <div>Loading...</div>
    }
    if (props.user === null) {
        return <Navigate to="/login" />
    }
    return <Outlet />

}
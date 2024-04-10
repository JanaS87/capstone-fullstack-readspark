import {AppUser} from "../types/AppUser.ts";
import {useEffect, useState} from "react";
import axios from "axios";

export default function useAppUser() {
    const [appUser, setAppUser] = useState<AppUser | null | undefined>(undefined);

    function fetchMe() {
        axios.get("/api/users/me")
            .then(response => setAppUser(response.data))
            .catch(() => setAppUser(null));
    }

    useEffect(() => {
        fetchMe();
    }, []);

    function login() {
        const host = window.location.host === 'localhost:5173' ? 'http://localhost:8080': window.location.origin

        window.open(host + '/oauth2/authorization/github', '_self')
    }

    function logout() {
        const host = window.location.host === 'localhost:5173' ? 'http://localhost:8080' : window.location.origin
        setAppUser(null)

        window.open(host + '/logout', '_self')
    }
    return {appUser, login, logout};
}
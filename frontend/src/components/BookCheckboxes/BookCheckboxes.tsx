import Checkboxes from "../Checkboxes/Checkboxes.tsx";
import React from "react";


type BookCheckboxesProps = {
    isRead: boolean,
    isFavorite: boolean,
    setIsRead: React.Dispatch<React.SetStateAction<boolean>>,
    setIsFavorite: React.Dispatch<React.SetStateAction<boolean>>,
}

export default function BookCheckboxes({isFavorite, isRead, setIsRead, setIsFavorite}: Readonly<BookCheckboxesProps>) {
    return (
        <div className={"checkbox-wrapper"}>
            <Checkboxes
                checked={isRead}
                onChange={(e) => setIsRead(e.target.checked)}
                label={"Gelesen"}/>
            <Checkboxes
                checked={isFavorite}
                onChange={(e) => setIsFavorite(e.target.checked)}
                label={"Favorit"}/>
        </div>
    )
}
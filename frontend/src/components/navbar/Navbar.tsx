import * as React from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeIcon from '@mui/icons-material/Home';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PlusIcon from '@mui/icons-material/Add';
import './Navbar.css'
import {useNavigate} from "react-router-dom";

type NavbarProps = {
    fetchBooks: () => void,
    fetchFavoriteBooks: () => void
}

export default function Navbar({fetchBooks, fetchFavoriteBooks}: Readonly<NavbarProps>) {
    const [value, setValue] = React.useState(0);
    const navigate = useNavigate();

    function handleChangeNavigation(_: React.SyntheticEvent<Element, Event>, newValue: number) {
        setValue(newValue);

        switch (newValue) {
            case 0:
                fetchBooks();
                navigate('/');
                break;
            case 1:
                navigate('/add');
                break;
            case 2:
                fetchFavoriteBooks();
                navigate('/favorites');
                break;
            default:
               break;
        }
    }


    return (
        <div className={"nav-wrapper"}>
            <BottomNavigation
                showLabels
                value={value}
                onChange={handleChangeNavigation}
                sx={{display: 'flex', justifyContent: 'center' ,width: 400, position: 'fixed', bottom: 0,  gap: 8, background: 'transparent'} }
            >
                <BottomNavigationAction label="Übersicht" icon={<HomeIcon fontSize={"large"} />}  />
                <BottomNavigationAction label="Buch hinzufügen" icon={<PlusIcon fontSize={"large"} />}  />
                <BottomNavigationAction label="Favoriten" icon={<FavoriteIcon fontSize={"large"} />}  />
            </BottomNavigation>
        </div>
    );
}
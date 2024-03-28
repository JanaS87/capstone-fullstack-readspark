import * as React from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeIcon from '@mui/icons-material/Home';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PlusIcon from '@mui/icons-material/Add';
import './Navbar.css'

export default function SimpleBottomNavigation() {
    const [value, setValue] = React.useState(0);


    return (
        <div className={"nav-wrapper"}>
            <BottomNavigation
                showLabels
                value={value}
                onChange={(event: React.SyntheticEvent<Element, Event>, newValue) => {
                    setValue(newValue);
                    console.log(event.timeStamp)
                }}
                sx={{display: 'flex', justifyContent: 'center' ,width: 300, position: 'fixed', bottom: 0,  gap: 8}}
            >
                <BottomNavigationAction label="Übersicht" icon={<HomeIcon />}  />
                <BottomNavigationAction label="Buch hinzufügen" icon={<PlusIcon />}  />
                <BottomNavigationAction label="Favoriten" icon={<FavoriteIcon />}  />
            </BottomNavigation>
        </div>
    );
}
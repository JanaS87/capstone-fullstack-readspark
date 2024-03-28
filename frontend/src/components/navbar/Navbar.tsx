import * as React from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import RestoreIcon from '@mui/icons-material/Restore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
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
                <BottomNavigationAction label="Recents" icon={<RestoreIcon />}  />
                <BottomNavigationAction label="Favorites" icon={<FavoriteIcon />}  />
                <BottomNavigationAction label="Nearby" icon={<LocationOnIcon />}  />
            </BottomNavigation>
        </div>
    );
}
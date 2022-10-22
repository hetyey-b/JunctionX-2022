import React from 'react';
import axios from 'axios';
import Map from './components/Map';

import BurgerMenu from './components/BurgerMenu';
import MyLocation from './components/burgerMenuPopups/MyLocation';

import {FaMapMarkerAlt} from 'react-icons/fa';
import {BiTrip} from 'react-icons/bi';
import {BsFillPinMapFill} from 'react-icons/bs'

const dots = [
    {
        lat: 40.416775, //Madrid
        lon: -3.703790,
        color: '#ffb619',
    },
    {
        lat: 59.334591,
        lon: 18.063240,
        color: '#ffb619',
    },
]

const lines = [
    {
        color: '#ffb619',
        from: {
            lat: 47.497913, //Budapest
            lon: 19.040236,
        },
        to: {
            lat: 51.509865, //London
            lon: -0.118092
        }
    },
]

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function App() {
  const [burgerMenuOpen, setBurgerMenuOpen] = React.useState(false);
  const [openPopUp, setOpenPopUp] = React.useState(null);
  const [cities, setCities] = React.useState([
    'Madrid', 'Budapest', 'Stockholm', 'Helsinki', 'Amsterdam', 'London', 'Paris'
  ]);

  const closeOpenPopUp = () => {
    setOpenPopUp(null);
  }

  return (
    <div 
      className=' w-full flex justify-between px-2 py-1 bg-brandBlue'
    >
      <div>
        <MyLocation cities={cities} currencies={['HUF', 'EUR']} onClose={closeOpenPopUp} visible={openPopUp === 'MyLocation'}/>
        <BurgerMenu 
          open={burgerMenuOpen}
          setOpen={setBurgerMenuOpen}
          content={[
            {
              text: 'My Location',
              onClick: () => {
                if (openPopUp === 'MyLocation') {
                  closeOpenPopUp();
                  return;
                }
                setOpenPopUp('MyLocation')
              },
              icon: <FaMapMarkerAlt className='h-[30px] w-[30px]'/>
            },
            {
              text: 'Plan Trip',
              onClick: () => console.log('Plan Trip'),
              icon: <BiTrip className='h-[30px] w-[30px]'/>
            },
            {
              text: 'Saved Trips',
              onClick: () => console.log('Saved Trips'),
              icon: <BsFillPinMapFill className='h-[30px] w-[30px]'/>
            },
          ]}
        />
        <Map
         lines={lines}
         dots={dots}
         onClick={() => {setBurgerMenuOpen(false); closeOpenPopUp();}}
        />
      </div>
    </div>
  );
}

export default App;
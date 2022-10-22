import React from 'react';
import axios from 'axios';
import Map from './components/Map';

import BurgerMenu from './components/BurgerMenu';
import MyLocation from './components/burgerMenuPopups/MyLocation';
import NewTrip from './components/burgerMenuPopups/NewTrip';
import MyTrips from './components/burgerMenuPopups/MyTrips';

import {FaMapMarkerAlt} from 'react-icons/fa';
import {BiTrip} from 'react-icons/bi';
import {BsFillPinMapFill} from 'react-icons/bs'

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function App() {
  const [burgerMenuOpen, setBurgerMenuOpen] = React.useState(false);
  const [openPopUp, setOpenPopUp] = React.useState(null);
  const [cities, setCities] = React.useState([]);
  const [dots, setDots] = React.useState([]);
  const [lines, setLines] = React.useState([]);
  const [selectedTrip, setSelectedTrip] = React.useState(null);
  
  React.useEffect(() => {
    if (localStorage.getItem('currency') === '') {
      localStorage.setItem('currency', 'eur');
    }

    if (!localStorage.getItem('myTrips')) {
      localStorage.setItem('myTrips', []);
    }

    const fetchCities = async () => {
      const response = await axios.get(`${BACKEND_URL}/cities`);
      
      if (response.status === 200) {
        setCities(response.data.cities);
      }

      setDots(response.data.cities.map((city) => {
        return {
          lon: city.long,
          lat: city.lat,
          color: '#ffb619',
        }
      }))
    }

    fetchCities();
  }, []);

  // React.useEffect(() => {
  //   const fetchTripResults = async () => {
  //     const response = await 
  //   }
  // }, [selectedTrip]);

  const handleMenuPopUpClick = (popUpName) => {
    if (openPopUp === popUpName) {
      closeOpenPopUp();
      return;
    }

    setOpenPopUp(popUpName);
  }

  const closeOpenPopUp = () => {
    setOpenPopUp(null);
  }

  return (
    <div 
      className=' w-full flex justify-between px-2 py-1 bg-brandBlue'
    >
      <div>
        <MyLocation cities={cities} currencies={['HUF', 'EUR']} onClose={closeOpenPopUp} visible={openPopUp === 'MyLocation'}/>
        <NewTrip cities={cities} onClose={closeOpenPopUp} visible={openPopUp === 'NewTrip'} />
        <MyTrips setSelectedTrip={setSelectedTrip} onClose={closeOpenPopUp} visible={openPopUp === 'MyTrips'} />
        <BurgerMenu 
          open={burgerMenuOpen}
          setOpen={setBurgerMenuOpen}
          content={[
            {
              text: 'My Location',
              onClick: () => handleMenuPopUpClick('MyLocation'),
              icon: <FaMapMarkerAlt className='h-[30px] w-[30px]'/>
            },
            {
              text: 'Plan Trip',
              onClick: () => handleMenuPopUpClick('NewTrip'),
              icon: <BiTrip className='h-[30px] w-[30px]'/>
            },
            {
              text: 'Saved Trips',
              onClick: () => handleMenuPopUpClick('MyTrips'),
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
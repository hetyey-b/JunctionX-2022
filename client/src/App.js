import React from 'react';
import axios from 'axios';
import Map from './components/Map';
import {recommendationFilter} from './util/recommendationFilter';

import BurgerMenu from './components/BurgerMenu';
import MyLocation from './components/burgerMenuPopups/MyLocation';
import NewTrip from './components/burgerMenuPopups/NewTrip';
import MyTrips from './components/burgerMenuPopups/MyTrips';

import {FaMapMarkerAlt} from 'react-icons/fa';
import {MdSavings} from 'react-icons/md'
import {BiTrip} from 'react-icons/bi';
import {BsFillPinMapFill} from 'react-icons/bs'
import SelectedDot from './components/burgerMenuPopups/SelectedDot';
import TrackedTrips from './components/burgerMenuPopups/TrackedTrips';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function App() {
  const [burgerMenuOpen, setBurgerMenuOpen] = React.useState(false);
  const [openPopUp, setOpenPopUp] = React.useState(null);
  const [cities, setCities] = React.useState([]);
  const [dots, setDots] = React.useState([]);
  const [lines, setLines] = React.useState([]);
  const [selectedTrip, setSelectedTrip] = React.useState(null);
  const [recommendations, setRecommendations] = React.useState([]);
  const [selectedDot, setSelectedDot] = React.useState(null);
  
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

      // setDots(response.data.cities.map((city) => {
      //   return {
      //     lon: city.long,
      //     lat: city.lat,
      //     color: '#ffb619',
      //   }
      // }))
    }

    fetchCities();
  }, []);

  React.useEffect(() => {
    if(!selectedTrip) {
      return;
    }

    const fetchRecommendation = async () => {
      const response = await axios.post(
          `${BACKEND_URL}/recommendations?location=${selectedTrip.startingCity}&currency=${localStorage.getItem('currency').toUpperCase()}`,
          {
            budget: selectedTrip.budget,
            people: selectedTrip.numberOfTravellers,
            nights: selectedTrip.days,
            accommodation: selectedTrip.accommodation,
            outings: selectedTrip.outings,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            }
          }
      );

      if (response.status === 200) {
        const colors = recommendationFilter(response.data.recommendations, selectedTrip.onlyCityCenter);

        setDots(colors.colors.map((recommendation,ind) => {
          return {
            lon: recommendation.city.long,
            lat: recommendation.city.lat,
            color: recommendation.color,
            ind,
          };
        }));

        setRecommendations(colors);
      }
    }

    fetchRecommendation();
  }, [selectedTrip]);

  const handleDotSelect = (ind) => {
    if (ind === -1) {
      return;
    }
    setLines([
      {
        from: {
          lon: recommendations.originCity.city.long,
          lat: recommendations.originCity.city.lat,
        },
        to: {
          lon: recommendations.colors[ind].city.long,
          lat: recommendations.colors[ind].city.lat,
        },
        color: recommendations.colors[ind].color,
      },
    ]);
    setSelectedDot({
      target: recommendations.colors[ind],
      origin: recommendations.originCity,
    });
  }

  const handleMenuPopUpClick = (popUpName) => {
    closeSelectedDotDisplay();
    if (openPopUp === popUpName) {
      closeOpenPopUp();
      return;
    }
    setOpenPopUp(popUpName);
  }

  const closeOpenPopUp = () => {
    setOpenPopUp(null);
  }

  const closeSelectedDotDisplay = () => {
    closeOpenPopUp();
    setLines([]);
    setDots([]);
    setSelectedDot(null);
  }

  const handleOnTrackedTripSelect = (trip) => {
    setDots([
      {
        lon: trip.data.origin.city.long,
        lat: trip.data.origin.city.lat,
        color: '#00b9ff',
        ind: -1,
      },
      {
        lon: trip.data.target.city.long,
        lat: trip.data.target.city.lat,
        color: trip.data.target.color,
        ind: -1,
      },
    ]);
    setLines([
      {
        from: {
          lon: trip.data.origin.city.long,
          lat: trip.data.origin.city.lat,
        },
        to: {
          lon: trip.data.target.city.long,
          lat: trip.data.target.city.lat,
        },
        color: trip.data.target.color,
      },
    ]);
    setSelectedDot({
      ...trip.data, 
      wise: trip.wise,
    });
    closeOpenPopUp();
    setBurgerMenuOpen(false);
  }

  return (
    <div 
      className=' w-full flex justify-between px-2 py-1 bg-white'
    >
      <div>
        <MyLocation cities={cities} currencies={['HUF', 'EUR']} onClose={closeOpenPopUp} visible={openPopUp === 'MyLocation'}/>
        <NewTrip cities={cities} onClose={closeOpenPopUp} visible={openPopUp === 'NewTrip'} />
        <MyTrips setSelectedTrip={setSelectedTrip} onClose={closeOpenPopUp} visible={openPopUp === 'MyTrips'} />
        <TrackedTrips visible={openPopUp === 'TrackedTrips'} onClose={closeOpenPopUp} onSelect={handleOnTrackedTripSelect}/>
        <SelectedDot 
          onDotSelect={handleDotSelect}
          onClose={() => closeSelectedDotDisplay()} 
          visible={selectedDot !== null} 
          data={selectedDot} 
        />
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
              text: 'Saved Plans',
              onClick: () => handleMenuPopUpClick('MyTrips'),
              icon: <BsFillPinMapFill className='h-[30px] w-[30px]'/>
            },
            {
              text: 'Tracked Savings',
              onClick: () => handleMenuPopUpClick('TrackedTrips'),
              icon: <MdSavings className='h-[30px] w-[30px]' />
            }
          ]}
        />
        <Map
         lines={lines}
         dots={dots}
         onDotSelect={handleDotSelect}
         onClick={() => {setBurgerMenuOpen(false); closeOpenPopUp();}}
        />
      </div>
    </div>
  );
}

export default App;
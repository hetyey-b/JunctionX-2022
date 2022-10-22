import React from 'react';

import {BsPeopleFill} from 'react-icons/bs';

const MyTrips = ({setSelectedTrip,visible,onClose}) => {
    const [trips, setTrips] = React.useState([]);

    React.useEffect(() => {
        const myTripsString = localStorage.getItem('myTrips') || '[]';
        const myTrips = JSON.parse(myTripsString);
        setTrips(myTrips);
    },[visible]);

    const handleTripOnClick = (trip) => {
        setSelectedTrip(trip);
        onClose();
    } 

    return(
        <div className={`absolute bg-brandBlue w-[33vw] max-h-[40vh] overflow-y-scroll top-1/3 left-1/2 p-1 rounded-xl shadow-2xl
                        text-bgGray ${visible ? 'scale-100' : 'scale-0'} animatingUI`}>
            <ul>
                {
                    trips.map((trip,ind) => 
                        <li
                            key={`myTrip-li-${ind}-${trip.startingCity}`}
                            className={`flex justify-between cursor-pointer hover:bg-brandBlueHover
                                        ${ind===0 ? 'rounded-t-lg' : ''} ${ind===trips.length - 1 ? 'rounded-b-lg' : ''}
                                        uppercase w-full h-[50px] font-lg inline-flex items-center text-center 
                                        px-4 border-b border-x ${ind===0?'border-t':''}`}
                            onClick={handleTripOnClick(trip)}
                        >
                            <div>
                                <span className='font-bold text-lg'>{trip.targetCity || '???'}</span>
                                - {trip.days} nights - {<BsPeopleFill className='inline mx-1'/>}{trip.numberOfTravellers}
                                <i className='itallic normal-case ml-5'>leaving from: <span className='capitalize'>{trip.startingCity}</span></i>
                            </div>
                        </li>
                    )
                }
            </ul>
        </div>
    )
}

export default MyTrips;
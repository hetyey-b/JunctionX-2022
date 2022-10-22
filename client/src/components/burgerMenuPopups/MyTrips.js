import React from 'react';

import {MdRestaurant} from 'react-icons/md';
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
        <div className={`w-[33vw] max-h-[40vh] overflow-y-scroll top-1/3 left-1/2 form p-1 ${visible ? 'scale-100' : 'scale-0'}`}>
            <ul>
                {
                    trips.map((trip,ind) => 
                        <li
                            key={`myTrip-li-${ind}-${trip.startingCity}`}
                            className={`flex justify-between cursor-pointer hover:text-wiseNavyHighlight
                                        ${ind===0 ? 'rounded-t-lg' : ''} ${ind===trips.length - 1 ? 'rounded-b-lg' : ''}
                                        uppercase w-full h-[50px] font-lg inline-flex items-center text-center 
                                        px-4 border-b border-x ${ind===0?'border-t':''}`}
                            onClick={() => handleTripOnClick(trip)}
                        >
                            <div>
                                <span className='font-bold text-lg'>{trip.targetCity || '???'}</span>
                                 - {trip.days} nights - {<BsPeopleFill className='inline mx-1'/>}{trip.numberOfTravellers}
                                 - {<MdRestaurant className='inline mx-1'/>}{trip.outings}
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
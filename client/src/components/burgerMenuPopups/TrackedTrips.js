import axios from "axios";
import React from "react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const WISE_TOKEN = process.env.REACT_APP_WISE_TOKEN;

const TrackedTrips = ({visible, onClose, onSelect}) => {
    const [trackedTrips, setTrackedTrips] = React.useState(localStorage.getItem('trackedTrips') ?
                                                                JSON.parse(localStorage.getItem('trackedTrips')) :
                                                                []);
   const [trackedTripsWiseData, setTrackedTripsWiseData] = React.useState([]);

    React.useEffect(() => {
        if (localStorage.getItem('trackedTrips')) {
            setTrackedTrips(JSON.parse(localStorage.getItem('trackedTrips')));
        }
    }, [visible]);

    React.useEffect(() => {
        const fetchData = async () => {
            let newWiseData = [];
            
            for(let i = 0; i < trackedTrips.length; i++) {
                const response = await axios.get(`${BACKEND_URL}/savings?token=${WISE_TOKEN}&balance_id=${trackedTrips[i].token}`);
                if (response.status === 200) {
                    newWiseData.push({
                        wise:response.data,
                        ...trackedTrips[i]
                    });
                }
            }

            setTrackedTripsWiseData(newWiseData);
        }

        fetchData();
    }, [trackedTrips]);
    
    const handleTripOnClick = (trip) => {
        onSelect(trip);
        onClose();
    }

    return (
        <div className={`w-[33vw] max-h-[40vh] min-h-[100px] overflow-y-scroll top-1/3 left-1/2 form p-1 ${visible ? 'scale-100' : 'scale-0'}`}>
            {
                trackedTripsWiseData.map((el) => 
                    <div 
                        key={el.token} 
                        className='cursor-pointer hover:text-wiseNavyHighlight flex justify-between w-full h-[50px] font-lg inline-flex items-center text-center px-4'
                        onClick={() => handleTripOnClick(el)}
                    >
                        <span className='font-bold'>{el.wise[0].name}</span>
                        <span>{el.wise[0].amount.value} {el.wise[0].amount.currency}</span>
                    </div>
                )
            }
        </div>
    )
} 

export default TrackedTrips;
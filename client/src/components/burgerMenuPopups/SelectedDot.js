import React from 'react';
import axios from 'axios';
import {FaPlaneDeparture,FaTrain,FaCar} from 'react-icons/fa';
import CostAverageDisplay from '../CostAverageDisplay';

const transportIcons = [
    <FaPlaneDeparture className='inline-block'/>,
    <FaCar className='inline-block'/>,
    <FaTrain className='inline-block'/>,
];

const formatNumber = (num) => {
    return Number(Math.round(num)).toLocaleString();
}

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const WISE_TOKEN = process.env.REACT_APP_WISE_TOKEN;

const SelectedDot = ({data,visible,onClose}) => {
    if (!data || !data.target) {
        return <div></div>
    }

    const handleWiseButtonClick = async () => {
        const response = await axios.post(
            `${BACKEND_URL}/create-savings?token=${WISE_TOKEN}&account_name=${'Trip to ' + data.target.city.name}&currency=${localStorage.getItem('currency').toUpperCase()}`,
            {},
            {
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json', 
                }
            }
        );

        if (response.status === 200 || response.status === 201) {
            const oldTrackedTrips = localStorage.getItem('trackedTrips') || '[]';
            const newTrackedTrips = [...JSON.parse(oldTrackedTrips), {data, token: response.data}];
            localStorage.setItem('trackedTrips', JSON.stringify(newTrackedTrips));
            onClose();
        }
    }

    return (
        <div className={`top-[5%] left-[43%] w-[55vw] form ${visible ? 'scale-100' : 'scale-0'} text-lg`}>
            <h1 className='uppercase font-bold text-xl'>
                {
                    data.wise && data.wise[0] ? 
                    data.wise[0].name :
                    `${data.target.city.name} (${data.target.city.country})`
                }
            </h1>
            {
                data.wise &&
                (
                <div className='block flex justify-between'>
                    <span className='font-bold'>Currently saved: </span>
                    <span>{data.wise[0].amount.value} {data.wise[0].amount.currency}</span>
                </div>
                )
            }
            <span className='block italic'>Leaving from {data.origin.city.name} ({data.origin.city.country})</span>
            <hr className='my-2 border-t-disabledGray'/>
            <span className='block'>{data.target.budget.nights} nights / {data.target.budget.people} people</span>
            <hr className='my-2 border-t-disabledGray'/>
            <span className='block'>Accommodation in {data.target.budget.accommodation}</span>
            <ul>
                {
                    data.target.data.accommodation.map((accommodation) =>
                        <li className='flex justify-between'><span>{accommodation.name}</span> <CostAverageDisplay data={accommodation}/></li>
                    )
                }
            </ul>
            <hr className='my-2 border-t-disabledGray'/>
            <span>Travel by...</span>
            <ul>
                {
                    data.target.data.travel.map((travel,ind) =>
                        <li className='flex justify-between'>{transportIcons[ind]} <CostAverageDisplay data={travel}/></li>
                    )
                }
            </ul>
            <hr className='my-2 border-t-disabledGray'/>
            <span>Outings: {data.target.budget.outings}</span>
            <ul>
                {
                    data.target.data.outings.map((outing,ind) =>
                        <li className='flex justify-between'>{'$'.repeat(ind+1)} <CostAverageDisplay data={outing} /></li>
                    )
                }
            </ul>
            <hr className='my-2 border-t-disabledGray'/>
            <div className='flex justify-between'>
                <span>Overall estimate</span>
                <span>{
                    `${formatNumber(data.target.yellowSum)} - ${formatNumber(data.target.greenSum)} ${localStorage.getItem('currency') || 'EUR'}` 
                }</span>
            </div>

            <div className='flex justify-between'>
                <button
                    type='button'
                    onClick={onClose}
                    className='mt-3 formButton'
                >
                    Close
                </button>
                <button
                    type='button'
                    onClick={handleWiseButtonClick}
                    className={`mt-3 formButtonWise ${data.wise ? 'hidden' : ''}`}
                >
                    Create Savings Account
                </button>
            </div>
        </div>
    )

}

export default SelectedDot;
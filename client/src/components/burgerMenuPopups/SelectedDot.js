import React from 'react';
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

const SelectedDot = ({data,visible,onClose}) => {
    if (!data || !data.target) {
        return <div></div>
    }
    return (
        <div className={`top-[5%] left-[54%] w-[45vw] form ${visible ? 'scale-100' : 'scale-0'} text-lg`}>
            <h1 className='uppercase font-bold text-xl'>{data.target.city.name} ({data.target.city.country})</h1>
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
                    `${formatNumber(data.target.greenSum)} - ${formatNumber(data.target.yellowSum)} ${localStorage.getItem('currency') || 'EUR'}` 
                }</span>
            </div>
        
            <button
                type='button'
                onClick={onClose}
                className='mt-3 formButton'
            >
                Close
            </button>
        </div>
    )

}

export default SelectedDot;
import React from 'react';
import {FaPlaneDeparture,FaTrain,FaCar} from 'react-icons/fa';
import CostAverageDisplay from '../CostAverageDisplay';

const transportIcons = [
    <FaPlaneDeparture className='inline-block'/>,
    <FaCar className='inline-block'/>,
    <FaTrain className='inline-block'/>,
];

const SelectedDot = ({data,visible,onClose}) => {
    if (!data || !data.target) {
        return <div></div>
    }
    return (
        <div className={`absolute bg-brandBlue top-[5%] left-[57%] w-[40vw] p-10 rounded-xl shadow-2xl
                        text-bgGray ${visible ? 'scale-100' : 'scale-0'} animatingUI text-lg`}>
            <h1 className='uppercase font-bold text-xl'>{data.target.city.name} ({data.target.city.country})</h1>
            <span className='block italic'>Leaving from {data.origin.city.name} ({data.origin.city.country})</span>
            <hr className='my-2'/>
            <span className='block'>{data.target.budget.nights} nights / {data.target.budget.people} people</span>
            <hr className='my-2'/>
            <span className='block'>Accommodation in {data.target.budget.accommodation}</span>
            <ul>
                {
                    data.target.data.accommodation.map((accommodation) =>
                        <li className='flex justify-between'>{accommodation.name} <CostAverageDisplay data={accommodation}/></li>

                    )
                }
            </ul>
            <hr className='my-2'/>
            <span>Travel by...</span>
            <ul>
                {
                    data.target.data.travel.map((travel,ind) =>
                        <li className='flex justify-between'>{transportIcons[ind]} <CostAverageDisplay data={travel}/></li>
                    )
                }
            </ul>
            <hr className='my-2'/>
            <span>Outings: {data.target.budget.outings}</span>
            <ul>
                {
                    data.target.data.outings.map((outing,ind) =>
                        <li className='flex justify-between'>{'$'.repeat(ind+1)} <CostAverageDisplay data={outing} /></li>
                    )
                }
            </ul>
        
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
import React from 'react';

const NewTrip = ({cities, visible, onClose}) => {
    const [startingCity, setStartingCity] = React.useState(localStorage.getItem('homeCity') || '');
    const [accommodation, setAccommodation] = React.useState('AIRBNB'); 
    const [onlyCityCenter, setOnlyCityCenter] = React.useState(false);
    const [numberOfTravellers, setNumberOfTravellers] = React.useState(1);
    const [outings, setOutings] = React.useState(3);
    const [days,setDays] = React.useState(2);
    const [budget,setBudget] = React.useState(localStorage.getItem('currency') === 'HUF' ? 200000 : 500);
    const [currency,setCurrency] = React.useState(localStorage.getItem('currency') || 'EUR');

    const handleOnSubmit = (e) => {
        e.preventDefault();
       
        const myTripsString = localStorage.getItem('myTrips') || '[]';
        const myTrips = JSON.parse(myTripsString);
        localStorage.setItem('myTrips', JSON.stringify([...myTrips, {
            startingCity, accommodation, onlyCityCenter, outings, days, numberOfTravellers, budget
        }]));

        onClose();
    }

    React.useEffect(() => {
        if (visible) {
            setStartingCity(localStorage.getItem('homeCity') || '');
            setCurrency(localStorage.getItem('currency') || 'EUR');
        }
    }, [visible]);
    
    const handleBudgetOnChange = (e) =>{
        if (e.target.value <= 0) {
            return;
        }
        setBudget(e.target.value);
    }
    
    const handleDaysOnChange = (e) => {
        if (e.target.value <= 0) {
            return;
        }
        setDays(e.target.value);
    }
    
    const handleStartingCityOnChange = (e) => {
        if (e.target.value === '') {
            return;
        }
        setStartingCity(e.target.value);
    }
    
    const handleAccommodationOnChange = (e) => {
        if (e.target.value === '') {
            return;
        }
        setAccommodation(e.target.value);
    }

    const handleOnlyCityCenterChange = () => {
        setOnlyCityCenter(!onlyCityCenter);
    }
    
    const handleNumberOfTravellersOnChange = (e) => {
        if (e.target.value <= 0) {
            return;
        } 
        setNumberOfTravellers(Math.round(e.target.value));
    }

    const handleOutingsOnChange = (e) => {
        if (e.target.value <= 0) {
            return;
        } 
        setOutings(e.target.value);
    }

    return(
        <div className={`top-1/4 left-1/2 form ${visible ? 'scale-100' : 'scale-0'} `}>
            <form onSubmit={handleOnSubmit}>
                <label
                    className='formLabel block'
                    htmlFor='startingCitySelect'
                >
                    Starting City
                </label>
                <select
                    id='startingCitySelect'
                    className='formSelect'
                    value={startingCity}
                    onChange={handleStartingCityOnChange}
                >
                    <option value=''>--Choose City--</option>
                    {
                        cities.map((city) => 
                            <option value={city.name} key={`city-option-${city.name.toLowerCase()}`}>{city.name}</option>
                        )
                    }
                </select>
                
                <label
                    className='formLabel block'
                    htmlFor='accommodationSelect'
                >
                    Accommodation
                </label>
                <select
                    id='accommodationSelect'
                    className='formSelect'
                    value={accommodation}
                    onChange={handleAccommodationOnChange}
                >
                    <option value='AIRBNB'>Airbnb</option>
                    <option value='HOTEL'>Hotel</option>
                </select>
                
                <label 
                    className='formLabel block'
                    htmlFor='onlyCityCenterCheckbox'
                >
                    <input 
                        id='onlyCityCenterCheckbox'
                        type='checkbox' 
                        className='mr-2 w-4 h-4 accent-wiseNavyDark rounded border-bgGray'
                        checked={onlyCityCenter}
                        onChange={handleOnlyCityCenterChange}
                    />
                    Only in city center
                </label>

                <div className='block'>
                    <label
                        htmlFor='daysInput'
                        className='formLabel inline-block'
                    >
                        Nights
                    </label>
                    <input
                        id='daysInput'
                        className='formNumber ml-5' 
                        value={days}
                        onChange={handleDaysOnChange}
                        step={1}
                    />
                </div>

                <div className='block mt-2'>
                    <label
                        htmlFor='numberOfTravellersInput'
                        className='formLabel inline-block'
                    >
                        Number of travellers
                    </label>
                    <input
                        id='numberOfTravellersInput'
                        className='formNumber ml-5' 
                        value={numberOfTravellers}
                        onChange={handleNumberOfTravellersOnChange}
                        step={1}
                    />
                </div>

                <div className='block mt-2'>
                    <label
                        htmlFor='outingsInput'
                        className='formLabel inline-block'
                    >
                        Number of outings
                    </label>
                    <input
                        id='outingsInput'
                        className='formNumber ml-5' 
                        value={outings}
                        onChange={handleOutingsOnChange}
                        step={1}
                    />
                </div>

                <div className='mt-2'>
                    <label
                        htmlFor='budgetInput'
                        className='formLabel'
                    >
                        Budget
                    </label>
                    <div
                        className='flex'
                    >
                        <span className='inline-flex items-center rounded-l-lg border-l border-y bg-wiseNavyBlue text-bgGray px-3'>
                            {currency}
                        </span>
                        <input
                            id='budgetInput'
                            className='formNumber rounded-l-none'
                            value={budget}
                            onChange={handleBudgetOnChange}
                            step={1}
                        />
                    </div>
                </div>
        
                <div className='mt-4 flex justify-between'>
                    <button
                        className='formButton'
                        type='button'
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className='formButton'
                        type='submit'
                        onClick={handleOnSubmit}
                    >
                        Save
                    </button>
                </div>

            </form>
        </div>
    )
}

export default NewTrip;
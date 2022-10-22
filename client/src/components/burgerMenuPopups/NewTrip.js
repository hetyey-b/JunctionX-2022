import React from 'react';

const NewTrip = ({cities, visible, onClose}) => {
    const [startingCity, setStartingCity] = React.useState(localStorage.getItem('homeCity') || '');
    const [accommodation, setAccommodation] = React.useState('average'); 
    const [onlyCityCenter, setOnlyCityCenter] = React.useState(false);
    const [numberOfTravellers, setNumberOfTravellers] = React.useState(1);
    const [spendingMoney, setSpendingMoney] = React.useState(localStorage.getItem('currency') === 'huf' ? 20000 : 50);
    const [days,setDays] = React.useState(2);

    const handleOnSubmit = (e) => {
        e.preventDefault();
       
        const myTripsString = localStorage.getItem('myTrips') || '[]';
        const myTrips = JSON.parse(myTripsString);
        localStorage.setItem('myTrips', JSON.stringify([...myTrips, {
            startingCity, accommodation, onlyCityCenter, numberOfTravellers, spendingMoney, days
        }]));

        onClose();
    }

    React.useEffect(() => {
        if (visible) {
            setStartingCity(localStorage.getItem('homeCity') || '');
        }
    }, [visible]);
    
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

    const handleSpendingMoneyOnChange = (e) => {
        if (e.target.value <= 0) {
            return;
        } 
        setSpendingMoney(Math.round(e.target.value));
    }

    return(
        <div className={`absolute bg-brandBlue top-1/3 left-1/2 px-10 pt-3 pb-5 rounded-xl shadow-2xl
                        text-bgGray ${visible ? 'scale-100' : 'scale-0'} animatingUI`}>
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
                            <option value={city.name.toLowerCase()} key={`city-option-${city.name.toLowerCase()}`}>{city.name}</option>
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
                    <option value='frugal'>Frugal</option>
                    <option value='average'>Average</option>
                    <option value='lavish'>Lavish</option>
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

                <div className='mt-2'>
                    <label
                        htmlFor='spendingMoneyInput'
                        className='formLabel'
                    >
                        Spending money
                    </label>
                    <div
                        className='flex'
                    >
                        <span className='inline-flex items-center rounded-l-lg border-l border-y bg-brandBlueHover px-3'>
                            {localStorage.getItem('curency') || 'EUR'}
                        </span>
                        <input
                            id='spendingMoneyInput'
                            className='formNumber rounded-l-none'
                            value={spendingMoney}
                            onChange={handleSpendingMoneyOnChange}
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
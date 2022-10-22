import React from 'react';

const MyLocation = ({cities, currencies, onClose, visible}) => {
    const [selectedCity, setSelectedCity] = React.useState(localStorage.getItem('homeCity') || '');
    const [selectedCurrency, setSelectedCurrency] = React.useState(localStorage.getItem('currency') || '');

    
    const handleCurrencyOnChange = (e) => {
        if (e.target.value === '') {
            return;
        }

        setSelectedCurrency(e.target.value);
    }

    const handleCityOnChange = (e) => {
        if (e.target.value === '') {
            return;
        }

        setSelectedCity(e.target.value);
    }
    
    const handleOnSubmit = (e) => {
        e.preventDefault();
        localStorage.setItem('homeCity', selectedCity);
        localStorage.setItem('currency', selectedCurrency);
        onClose();
    }

    return (
        <div className={`absolute bg-brandBlue top-1/3 left-1/2 w-[30vw] p-10 rounded-xl shadow-2xl
                        text-bgGray ${visible ? 'scale-100' : 'scale-0'} animatingUI`}>
            <form onSubmit={handleOnSubmit}>
                <label 
                    htmlFor='citySelect'
                    className='formLabel block'
                >
                    City
                </label>
                <select 
                    id='citySelect'
                    value={selectedCity} 
                    onChange={handleCityOnChange}
                    className='formSelect'
                >
                    <option value=''>--Choose City--</option>
                    {
                        cities.map((city) => 
                            <option value={city.name.toLowerCase()} key={`city-option-${city.name.toLowerCase()}`}>{city.name}</option>
                        )
                    }
                </select>
                <label 
                    htmlFor='currencySelect'
                    className='formLabel block'
                >
                    Currency
                </label>
                <select
                    id='currencySelect'
                    value={selectedCurrency} 
                    onChange={handleCurrencyOnChange}
                    className='formSelect'
                >
                    <option value=''>--Choose Currency--</option>
                    {
                        currencies.map(currency => 
                            <option value={currency.toLowerCase()} key={`currency-option-${currency.toLowerCase()}`}>{currency}</option>
                        )
                    }
                </select>
                <div className='flex justify-between mt-8'>
                    <button type='button' onClick={onClose} className='formButton'>Cancel</button>
                    <button type='submit' onClick={handleOnSubmit} className='formButton'>Save</button>
                </div>
            </form>
        </div>
    )
}

export default MyLocation;
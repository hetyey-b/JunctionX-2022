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
        onClose();
    }

    return (
        <div className={`absolute bg-brandBlue top-1/3 left-1/2 w-[30vw] p-10 rounded-xl shadow-2xl
                        text-bgGray ${visible ? 'scale-100' : 'scale-0'} animatingUI`}>
            <form onSubmit={handleOnSubmit}>
                <label 
                    htmlFor='citySelect'
                    className='block mb-2 uppercase font-bold'
                >
                    City
                </label>
                <select 
                    id='citySelect'
                    value={selectedCity} 
                    onChange={handleCityOnChange}
                    className='bg-brandBlue border border-bgGray rounded-lg block w-full p-2.5 uppercase'
                >
                    <option value=''>--Choose City--</option>
                    {
                        cities.map((city) => 
                            <option value={city.toLowerCase()}>{city}</option>
                        )
                    }
                </select>
                <label 
                    htmlFor='currencySelect'
                    className='block my-2 uppercase font-bold'
                >
                    Currency
                </label>
                <select
                    id='currencySelect'
                    value={selectedCurrency} 
                    onChange={handleCurrencyOnChange}
                    className='bg-brandBlue border border-bgGray rounded-lg block w-full p-2.5 uppercase'
                >
                    <option value=''>--Choose Currency--</option>
                    {
                        currencies.map(currency => 
                            <option value={currency.toLowerCase()}>{currency}</option>
                        )
                    }
                </select>
                <div className='flex justify-between mt-8'>
                    <button type='button' onClick={onClose} className='border border-bgGray py-1 px-2 rounded hover:bg-brandBlueHover'>Cancel</button>
                    <button type='submit' onClick={handleOnSubmit} className='border border-bgGray py-1 px-2 rounded hover:bg-brandBlueHover'>Save</button>
                </div>
            </form>
        </div>
    )
}

export default MyLocation;
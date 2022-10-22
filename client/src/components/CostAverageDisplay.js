import React from 'react';

const myData = {
    high:26256.659999999996,
    low:16471.559999999998,
    mean:21397.95
}

const formatNumber = (num) => {
    return Number(Math.round(num)).toLocaleString();
}

const CostAverageDisplay = ({data}) => {
    return(
        <div className='inline-block'>
            <span className='inline-block mr-6'>{formatNumber(data.mean)} {localStorage.getItem('currency')}</span>
            <div className='inline-block'>
                {formatNumber(data.low)} {localStorage.getItem('currency')}
                <div 
                    className='bg-wiseGreen w-[100px] rounded-full h-2.5 inline-block mx-2' 
                >
                    <div 
                        className='bg-wiseNavyDark h-2.5 w-[5px]'
                        style={{
                            marginLeft: `${100*(data.mean-data.low)/(data.high-data.low)}px`
                        }}
                    />
                </div>
                {formatNumber(data.high)} {localStorage.getItem('currency')}
            </div>
        </div>
    )
}

export default CostAverageDisplay;
import React from 'react';
import {ImCross, ImMenu} from 'react-icons/im'

const BurgerMenu = ({content}) => {
    const [open,setOpen] = React.useState(false);

    const handleOnClick = () => {
        console.log('click!');
        setOpen(!open); 
    }

    return(
        <div className='absolute'>
            {
                open ?
                <ImCross 
                    className='text-bgGray w-[20px] h-[20px] m-3 cursor-pointer'
                    onClick={handleOnClick}
                />
                :
                <ImMenu 
                    className='text-bgGray w-[25px] h-[25px] m-2 cursor-pointer'
                    onClick={handleOnClick}
                />
            }
            <div
                className={`bg-brandBlue text-bgGray w-[30vw] py-2 px-4 mx-1 
                            ${open ? 'translate-x-0 visible opacity-100' : 'translate-x-[-100%] invisible opacity-0'}
                            ease-in-out duration-300`}
            >
                {content}
            </div>
        </div>
    )
};

export default BurgerMenu;
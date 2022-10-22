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
                (
                    <div>
                        <ImCross 
                            className='text-brandBlue w-[40px] h-[40px] m-3 hover:text-brandBlueHover cursor-pointer'
                            onClick={handleOnClick}
                        />
                    </div>    
                )
                :
                (
                    <ImMenu 
                        className='text-brandBlue w-[50px] h-[50px] m-2 hover:text-brandBlueHover cursor-pointer'
                        onClick={handleOnClick}
                    />
                )
            }
        </div>
    )
};

export default BurgerMenu;
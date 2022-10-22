import React from 'react';
import {ImCross, ImMenu} from 'react-icons/im'

const BurgerMenu = ({content, open, setOpen}) => {
    const handleOnClick = () => {
        setOpen(!open); 
    }

    return(
        <div className={`absolute ${open ? 'shadow-xl' : ''}`}>
            {
                open ?
                    <ImCross 
                        className='text-wiseNavyBlue w-[20px] h-[20px] m-3 cursor-pointer hover:text-wiseNavyHighlight'
                        onClick={handleOnClick}
                    />
                    :
                    <ImMenu 
                        className='text-wiseNavyBlue w-[25px] h-[25px] m-2 cursor-pointer hover:text-wiseNavyHighlight'
                        onClick={handleOnClick}
                    />
            }
            <div
                className={`bg-bgGray text-wiseNavyBlue w-[30vw] py-2 px-4 h-[93vh] shadow-inner shadow-lg rounded
                            ${open ? 'translate-x-0 visible opacity-100' : 'translate-x-[-100%] invisible opacity-0'}
                            animatingUI`}
            >
                <ul>
                    {content.map((menuOption, ind) => 
                        <li
                            onClick={menuOption.onClick}
                            className={`w-full cursor-pointer hover:text-wiseNavyHighlight flex justify-between
                                        px-2 py-4 border-bgGray font-bold`}
                            key={`burgerMenu-li-${ind}-${menuOption.text}`}
                        >
                            <div className='inline-block'>
                                {menuOption.icon}
                            </div>
                            <div className='inline-block uppercase text-xl'>
                                {menuOption.text}
                            </div>
                        </li>
                    )
                    }
                </ul>
            </div>
        </div>
    )
};

export default BurgerMenu;
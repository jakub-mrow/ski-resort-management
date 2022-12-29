import React, { useEffect, useState } from 'react'
import { AiOutlineMenu } from 'react-icons/ai';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';

import { useStateContext } from '../context/ContextProvider';

import avatar from '../data/avatar.jpg';

import { UserProfile } from '.';
import { MdKeyboardArrowDown } from 'react-icons/md';

const NavButton = ( {title, customFunc, icon, color, dotColor}) => (
  <TooltipComponent content={title} position="BottomCenter">
    <button type="button" onClick={customFunc} style={{color}} 
      className="relative pt-5 pb-5 text-xl rounded-full p-3 hover:bg-light-grey ">
      <span style={{ background: dotColor}}
        className="absolute inline-flex rounded-full h-2 w-2 right-2 top-2"
      />
      {icon}
    </button>
  </TooltipComponent>
)


const Navbar = () => {
  const { activeMenu, setActiveMenu, 
    isClicked, setIsClicked, 
    handleClick, 
    screenSize, setScreenSize} = useStateContext();

    useEffect(() => {
      const handleResize = () => setScreenSize(window.innerWidth);
      window.addEventListener('resize', handleResize);

      handleResize();
      return () => window.removeEventListener('resize', handleResize);
    }, []);


    useEffect(() => {
      if (screenSize <= 900){
        setActiveMenu(false);
      } else {
        setActiveMenu(true);
      }
    }, [screenSize]);

  return (
    <div className="flex justify-between p-2 md:mx-6 relative">
      <NavButton title="Menu" 
        color="#5fceed"
        icon={<AiOutlineMenu></AiOutlineMenu>}
        customFunc={() => setActiveMenu((prevActiveMenu) => !prevActiveMenu)}/>

      <div className="flex">
        <TooltipComponent content="Profile" position="BottomCenter">
          <div className="flex items-center gap-2 cursor-pointer p-1 hover:bg-light-gray rounded-lg"
            onClick={() => handleClick('userProfile')}>
            <img className="rounded-full w-8 h-8" src={avatar}/>
            <p>
              <span className="text-14"> Hi, </span> {' '}
              <span className="font-bold ml-1 text-14">Jakub</span>
            </p>
            <MdKeyboardArrowDown className="text-14"/>


          </div>
        </TooltipComponent>

        {isClicked.userProfile && <UserProfile/>}



        </div>
    </div>
  )
}

export default Navbar
import React from 'react';
import { Link, NavLink } from 'react-router-dom';

import { SiShopware} from 'react-icons/si';
import { MdOutlineCancel } from 'react-icons/md';
import { AiOutlineMenu } from 'react-icons/ai';

import { sidebarLinks } from '../data/sidebar-links';
import { useStateContext } from '../context/ContextProvider';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';

const SideBar = () => {
    const { activeMenu, setActiveMenu, screenSize } = useStateContext();

    const handleCloseSideBar = () => {
        if (activeMenu && screenSize <= 900) {
            setActiveMenu(false);
        }
    }

    const activeLink = 'flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-white text-md m-2';
    const normalLink = "flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-md text-gray-700 dark:text-gray-200 dark:hover:text-black hover:bg-indigo-200 m-2";


  return (
    <div className="ml-3 h-screen md:overflow-hidden overflow-auto   
        md:hover:overflow-auto pb-10">
            {activeMenu && (<>
                <div className="flex justify-between items-center">
                    <Link to="/" onClick={handleCloseSideBar} 
                        className="items-center gap-3 ml-0 mt-4 
                                flex text-xl font-extrabold tracking-tight dark:text-white text-slate-900">
                        <SiShopware/>
                        <span>Ski</span>
                        <span style={{color: '#5fceed'}}>Resort</span>
                    </Link>

                    <TooltipComponent content="Menu" position="BottomCenter">
                        <button type="button"
                            onClick={() => setActiveMenu((prevActiveMenu) => !prevActiveMenu)}
                            className="text-xl p-3 mt-4 rounded-full hover:bg-light-gray block"
                        >
                            <MdOutlineCancel></MdOutlineCancel>
                        </button>
                    </TooltipComponent>
                </div>

                <div className="mt-10">
                    {sidebarLinks.map( (item) => (
                        <div key={item.title}>
                            <p className="text-black-400 m-3 mt-4 uppercase">
                                {item.title}
                            </p>

                            {item.links.map( (link) => (
                                <NavLink to={`/${link.name}`}
                                    key={link.name}
                                    onClick={handleCloseSideBar}
                                    className={({ isActive }) => isActive ? activeLink : normalLink}
                                    style={({ isActive }) => ({
                                        backgroundColor: isActive ? '#5fceed' : ''
                                    })}
                                >
                                    {link.icon}
                                    <span className="capitalize">
                                        {link.name}
                                    </span>
                                </NavLink>
                            ))}

                        </div>
                    ))}
                </div>



            </>)}
    </div>
  )
}

export default SideBar
import React from 'react';
import { AiOutlineCalendar, AiOutlineShoppingCart, AiOutlineAreaChart, AiOutlineBarChart, AiOutlineStock } from 'react-icons/ai';
import { FiShoppingBag, FiEdit, FiPieChart, FiBarChart, FiCreditCard, FiStar, FiShoppingCart } from 'react-icons/fi';
import { BsKanban, BsBarChart, BsBoxSeam, BsCurrencyDollar, BsShield, BsChatLeft } from 'react-icons/bs';
import { BiColorFill } from 'react-icons/bi';
import { IoMdContacts } from 'react-icons/io';
import { RiContactsLine, RiStockLine } from 'react-icons/ri';
import {FaUtensils, FaCookieBite, FaSkiing, FaMapMarkerAlt, FaTasks, FaDoorOpen} from 'react-icons/fa';
import { MdOutlineSupervisorAccount } from 'react-icons/md';
import { HiOutlineRefresh } from 'react-icons/hi';
import { TiTick } from 'react-icons/ti';
import { GiLouvrePyramid } from 'react-icons/gi';
import { GrLocation } from 'react-icons/gr';

import avatar from './avatar.jpg';


export const sidebarLinks = [
    {
      title: 'Hotel',
      links: [
        {
          name: 'information',
          icon: <FiShoppingBag />,
        },
      ],
    },
  
    {
      title: 'Management',
      links: [
        {
          name: 'reservations',
          icon: <AiOutlineShoppingCart />,
        },
        {
          name: 'employees',
          icon: <IoMdContacts />,
        },
        {
          name: 'guests',
          icon: <RiContactsLine />,
        },
        {
          name: 'dishes',
          icon: <FaUtensils />,
        },
        {
          name: 'desserts',
          icon: <FaCookieBite />,
        },
        {
          name: 'gear',
          icon: <FaSkiing />,
        },
        {
          name: 'localizations',
          icon: <FaMapMarkerAlt />,
        },
        {
          name: 'tasks',
          icon: <FaTasks />,
        },
        {
          name: 'rooms',
          icon: <FaDoorOpen />,
        },
      ],
    },
    // {
    //   title: 'Apps',
    //   links: [
    //     {
    //       name: 'calendar',
    //       icon: <AiOutlineCalendar />,
    //     },
    //     {
    //       name: 'kanban',
    //       icon: <BsKanban />,
    //     },
    //     {
    //       name: 'editor',
    //       icon: <FiEdit />,
    //     },
    //     {
    //       name: 'color-picker',
    //       icon: <BiColorFill />,
    //     },
    //   ],
    // }
  ];



  export const userProfileData = [
    {
      icon: <BsCurrencyDollar />,
      title: 'My Profile',
      desc: 'Account Settings',
      iconColor: '#03C9D7',
      iconBg: '#E5FAFB',
    },
    {
      icon: <BsShield />,
      title: 'My Inbox',
      desc: 'Messages & Emails',
      iconColor: 'rgb(0, 194, 146)',
      iconBg: 'rgb(235, 250, 242)',
    },
    {
      icon: <FiCreditCard />,
      title: 'My Tasks',
      desc: 'To-do and Daily Tasks',
      iconColor: 'rgb(255, 244, 229)',
      iconBg: 'rgb(254, 201, 15)',
    },
  ];


  export const employeesData = [
    {
      EmployeeID: 1,
      Name: 'Nancy Davolio',
      Title: 'Sales Representative',
      HireDate: '01/02/2021',
      Country: 'USA',
      ReportsTo: 'Carson',
      EmployeeImage:
      avatar,
    },
    {
      EmployeeID: 2,
      Name: 'Nasimiyu Danai',
      Title: 'Marketing Head',
      HireDate: '01/02/2021',
      Country: 'USA',
      ReportsTo: 'Carson',
      EmployeeImage:
      avatar,
    },
    {
      EmployeeID: 3,
      Name: 'Iulia Albu',
      Title: 'HR',
      HireDate: '01/02/2021',
      Country: 'USA',
      ReportsTo: 'Carson',
      EmployeeImage:
      avatar,
    },
    {
      EmployeeID: 4,
      Name: 'Siegbert Gottfried',
      Title: 'Marketing Head',
      HireDate: '01/02/2021',
      Country: 'USA',
      ReportsTo: 'Carson',
      EmployeeImage:
      avatar,
    },
    {
      EmployeeID: 5,
      Name: 'Omar Darobe',
      Title: 'HR',
      HireDate: '01/02/2021',
      Country: 'USA',
      ReportsTo: 'Carson',
      EmployeeImage:
      avatar,
    },
    {
      EmployeeID: 4,
      Name: 'Penjani Inyene',
      Title: 'Marketing Head',
      HireDate: '01/02/2021',
      Country: 'USA',
      ReportsTo: 'Carson',
      EmployeeImage:
        avatar,
    },
    {
      EmployeeID: 5,
      Name: 'Miron Vitold',
      Title: 'HR',
      HireDate: '01/02/2021',
      Country: 'USA',
      ReportsTo: 'Carson',
      EmployeeImage:
      avatar,
    },
    {
      EmployeeID: 1,
      Name: 'Nancy Davolio',
      Title: 'Sales Representative',
      HireDate: '01/02/2021',
      Country: 'USA',
      ReportsTo: 'Carson',
      EmployeeImage:
      avatar,
  
    },
    {
      EmployeeID: 2,
      Name: 'Nasimiyu Danai',
      Title: 'Marketing Head',
      HireDate: '01/02/2021',
      Country: 'USA',
      ReportsTo: 'Carson',
      EmployeeImage:
      avatar,
    },
    {
      EmployeeID: 3,
      Name: 'Iulia Albu',
      Title: 'HR',
      HireDate: '01/02/2021',
      Country: 'USA',
      ReportsTo: 'Carson',
      EmployeeImage:
      avatar,
    },
    {
      EmployeeID: 4,
      Name: 'Siegbert Gottfried',
      Title: 'Marketing Head',
      HireDate: '01/02/2021',
      Country: 'USA',
      ReportsTo: 'Carson',
      EmployeeImage:
      avatar,
    },
    {
      EmployeeID: 5,
      Name: 'Omar Darobe',
      Title: 'HR',
      HireDate: '01/02/2021',
      Country: 'USA',
      ReportsTo: 'Carson',
      EmployeeImage:
        avatar,
    },
    {
      EmployeeID: 4,
      Name: 'Penjani Inyene',
      Title: 'Marketing Head',
      HireDate: '01/02/2021',
      Country: 'USA',
      ReportsTo: 'Carson',
      EmployeeImage:
        avatar,
    },
    {
      EmployeeID: 5,
      Name: 'Miron Vitold',
      Title: 'HR',
      HireDate: '01/02/2021',
      Country: 'USA',
      ReportsTo: 'Carson',
      EmployeeImage:
      avatar,
    },
  ];


const gridEmployeeProfile = (props) => (
  <div className="flex items-center gap-2">
    <img
      className="rounded-full w-10 h-10"
      src={props.EmployeeImage}
      alt="employee"
    />
    <p>{props.Name}</p>
  </div>
);

const gridEmployeeCountry = (props) => (
  <div className="flex items-center justify-center gap-2">
    <GrLocation />
    <span>{props.Country}</span>
  </div>
);


export const employeesGrid = [
  { headerText: 'Employee',
    width: '150',
    template: gridEmployeeProfile,
    textAlign: 'Center' },
  { field: 'Name',
    headerText: '',
    width: '0',
    textAlign: 'Center',
  },
  { field: 'Title',
    headerText: 'Designation',
    width: '170',
    textAlign: 'Center',
  },
  { headerText: 'Country',
    width: '120',
    textAlign: 'Center',
    template: gridEmployeeCountry },

  { field: 'HireDate',
    headerText: 'Hire Date',
    width: '135',
    format: 'yMd',
    textAlign: 'Center' },

  { field: 'ReportsTo',
    headerText: 'Reports To',
    width: '120',
    textAlign: 'Center' },
  { field: 'EmployeeID',
    headerText: 'Employee ID',
    width: '125',
    textAlign: 'Center' },
];
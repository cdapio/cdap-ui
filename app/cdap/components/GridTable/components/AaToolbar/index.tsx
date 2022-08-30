import React, { Component } from 'react';
import Box from '@material-ui/core/Box';
import Aaitems from '../Aaitems';
import {
  SVG1,
  SVG2,
  SVG3,
  SVG4,
  SVG5,
  SVG6,
  SVG7,
  SVG12,
  SVG11,
  SVG9,
  SVG10,
  menuIcon,
} from './images';
import './index.scss';
import { IconButton } from '@material-ui/core';
import NestedMenu from '../NestedMenu';

const listItems = [
  { id: 1, imgUrl: SVG2 },
  { id: 2, imgUrl: SVG3 },
  { id: 3, imgUrl: SVG4 },
  { id: 4, imgUrl: menuIcon },
  { id: 5, imgUrl: SVG6 },
  { id: 6, imgUrl: SVG7 },
  { id: 7, imgUrl: SVG4 },
  { id: 8, imgUrl: SVG9 },
  { id: 9, imgUrl: SVG10 },
  { id: 10, imgUrl: SVG2 },
  { id: 11, imgUrl: SVG5 },
  { id: 12, imgUrl: SVG11 },
];

const ToolBarList = () => {
  return (
    <Box className="cont">
      <Box className="bgcont">
        <NestedMenu icon={menuIcon} submitMenuOption={(a) => console.log('menu-z', a)} />
        {listItems.map((eachItem) => (
          <Aaitems details={eachItem} key={eachItem.id} />
        ))}
        <Box className="bgcont1">
          <IconButton> {SVG1}</IconButton>
          <input type="search" placeholder="Search for Functions" className="searchh" />
        </Box>
      </Box>
      <IconButton>{SVG12}</IconButton>
    </Box>
  );
};

export default ToolBarList;

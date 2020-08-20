//
// Copyright 2018 DXOS.org
//

import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import MiniCard from './MiniCard';

const useStyles = makeStyles(() => ({
  cardContainer: {
    '&:not(:last-child)': {
      marginBottom: 10
    }
  }
}));

const DraggableCard = ({ card, provided, onOpenCard, listDeleted, labelnames }) => {
  const classes = useStyles();

  return (
    <div
      className={classes.cardContainer}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      ref={provided.innerRef}
    >
      <MiniCard
        listDeleted={listDeleted}
        cardProperties={card.properties}
        onOpenCard={() => onOpenCard(card.id)}
        style={provided.draggableProps.style}
        labelnames={labelnames}
      />
    </div>
  );
};

export default DraggableCard;

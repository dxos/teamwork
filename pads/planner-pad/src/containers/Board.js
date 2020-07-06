//
// Copyright 2020 DXOS.org
//

import clsx from 'clsx';
import React, { useState, Fragment } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

import { makeStyles } from '@material-ui/core/styles';
import SettingsIcon from '@material-ui/icons/Settings';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';

import { useClient } from '@dxos/react-client';

import { useArrayModel } from '../model/useArrayModel';
import { ArrayModel } from '../model/array';
import BoardSettings from './BoardSettings';
import List, { LIST_TYPE, CARD_TYPE } from './List';
import { BOARD_TYPE, useBoard } from '../model/board';
import { LIST_TYPE, useList } from '../model/list';

const useStyles = makeStyles(() => {
  return {
    root: {
      display: 'flex',
      flexDirection: 'row',
      height: '100%',
      padding: 10
    },

    scrollBox: {
      // TODO(sfvisser): Don't hardcode the sidebar width and toolbar height,
      // but fix the current container mess.
      width: 'calc(100vw - 250px)',
      overflow: 'scroll',
      height: 'calc(100% - 50px)'
    },

    topbar: {
      display: 'flex',
      background: 'white',
      padding: 10,
      justifyContent: 'space-between'
    },

    list: {
      '&:not(:last-child)': {
        marginRight: 10
      }
    }
  };
});

export const Board = ({ topic, viewId }) => {
  const classes = useStyles();
  const client = useClient();
  const boardId = `${BOARD_TYPE}/${viewId}`;

  const viewModel = useBoard(topic, viewId);
  const board = viewModel.getById(viewId);
  const listsModel = useArrayModel(topic, LIST_TYPE, { boardId });

  const myListModel = useList(topic, viewId);
  const myLists = myListModel.getObjectsByType(LIST_TYPE);

  const [settingsOpen, setSettingsOpen] = useState(false);
  if (!board || !listsModel) {
    return <div className={classes.root}>Loading board...</div>;
  }

  const lists = listsModel.getItems();

  const handleAddList = () => {
    listsModel.push({ boardId, title: 'New List' });
    myListModel.createItem(LIST_TYPE, { title: 'New List' });
  };

  const handleUpdateList = (listId) => (properties) => {
    listsModel.updateItem(listId, properties);
    myListModel.updateItem(listId, properties);
  };

  const onDragEnd = async (result) => {
    const { source, destination } = result;
    console.log(source, destination);

    // No drop target, skip this no-op.
    if (!destination) {
      return;
    }

    // Dragging entire lists.
    if (source.droppableId === board.viewId) {
      listsModel.moveItemByIndex(source.index, destination.index);
      return;
    }

    // Same list card move movement
    if (source.droppableId === destination.droppableId) {
      // eslint-disable-next-line no-debugger
      debugger;
      const model = await client.modelFactory.createModel(
        ArrayModel, { type: CARD_TYPE, topic, source }
      );
      client.modelFactory.destroyModel(model);

      console.log('card dragging within');
      return;
    }

    console.log('card from one list to another');
  };

  const Topbar = () => (
    <div className={clsx(classes.topbar, 'MuiDrawer-paperAnchorDockedTop')}>
      <Button
        variant="outlined"
        size="small"
        startIcon={<AddIcon fontSize="small" />}
        onClick={handleAddList}
      >
        Add List
      </Button>
      <Button
        variant="outlined"
        size="small"
        startIcon={<SettingsIcon fontSize="small" />}
        onClick={() => setSettingsOpen(!settingsOpen)}
      >
        Settings
      </Button>
    </div>
  );

  const Lists = () => (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable direction="horizontal" type="column" droppableId={board.viewId}>
        {(provided) => (
          <div ref={provided.innerRef} className={classes.scrollBox}>
            <div className={classes.root}>
              {lists.map((list, index) => (
                <Draggable key={list.id} draggableId={list.id} index={index}>
                  {(provided) => (
                    <div
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      ref={provided.innerRef}
                      style={provided.draggableProps.style}
                      className={classes.list}
                    >
                      <List
                        key={list.id}
                        topic={topic}
                        list={list}
                        onUpdateList={handleUpdateList(list.id)}
                        onOpenCard={() => { }}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
            </div>
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );

  const MyLists = () => (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable direction="horizontal" type="column" droppableId={board.viewId}>
        {(provided) => (
          <div ref={provided.innerRef} className={classes.scrollBox}>
            <div className={classes.root}>
              {myLists.map((list, index) => (
                <Draggable key={list.id} draggableId={list.id} index={index}>
                  {(provided) => (
                    <div
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      ref={provided.innerRef}
                      style={provided.draggableProps.style}
                      className={classes.list}
                    >
                      <List
                        key={list.id}
                        topic={topic}
                        list={list}
                        onUpdateList={handleUpdateList(list.id)}
                        onOpenCard={() => { }}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
            </div>
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );

  return (
    <Fragment>
      <Topbar />
      {/* {Lists()} */}
      <MyLists />
      <BoardSettings
        board={board}
        onRename={displayName => viewModel.renameView(viewId, displayName)}
        onUpdate={opts => viewModel.updateView(viewId, opts)}
        onDelete={() => viewModel.deleteView(viewId)}
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </Fragment>
  );
};

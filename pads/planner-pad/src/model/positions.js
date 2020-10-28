//
// Copyright 2020 DXOS.org
//

export const positionCompare = (a, b) => a.model.getProperty('position') - b.model.getProperty('position');

export function getLastPosition (list) {
  if (list.length === 0) {
    return 0;
  } else {
    return list[list.length - 1].model.getProperty('position') + 1;
  }
}
/**
 * Changing position when moving to a different list
 */
export function getInsertedPositionAtIndex (list, index) {
  if (list.length === 0) {
    return 0;
  } else if (index === 0) {
    return list[0].model.getProperty('position') - 1;
  } else if (index > list.length - 1) {
    return list[list.length - 1].model.getProperty('position') + 1;
  } else {
    return (list[index - 1].model.getProperty('position') + list[index].model.getProperty('position')) / 2;
  }
}
/**
 * Changing position within the same list / board
 */
export function getChangedPositionAtIndex (list, index, movingDown = false) {
  if (list.length === 0) {
    return 0;
  } else if (index === 0) {
    return list[0].model.getProperty('position') - 1;
  } else if (index >= list.length - 1) {
    return list[list.length - 1].model.getProperty('position') + 1;
  } else if (movingDown) {
    return (list[index].model.getProperty('position') + list[index + 1].model.getProperty('position')) / 2;
  } else {
    return (list[index - 1].model.getProperty('position') + list[index].model.getProperty('position')) / 2;
  }
}

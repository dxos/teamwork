//
// Copyright 2020 DxOS, Inc.
//

import React from 'react';
import DefaultIcon from '@material-ui/icons/DescriptionOutlined';

import { keyToString } from '@dxos/crypto';

import { useItemList } from '../model';
import { supportedPads } from '../common';
import { PartyItem } from './PartyItem';

export interface PartyGroupProps {
  party: any,
}

export const PartyGroup = ({ party }: PartyGroupProps) => {
  const topic = keyToString(party.publicKey);
  const { items, createItem, editItem } = useItemList(topic, supportedPads.map(pad => pad.type));

  return (<>
    <div>Party: {party.displayName}</div>
    <div>Documents in this party:</div>
    {items.map((item: any, i: number) => <PartyItem key={i} item={item} />)}
  </>);
};

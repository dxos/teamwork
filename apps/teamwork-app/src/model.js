//
// Copyright 2020 DXOS.org
//

import { Chance } from 'chance';
import assert from 'assert';

import { useModel } from '@dxos/react-client';
import { ViewModel } from '@dxos/view-model';
import { usePads } from '@dxos/react-appkit';

const chance = new Chance();

/**
 * Provides item list and item creator.
 * @returns {ViewModel}
 */
export const useItems = (topic) => {
  const [pads] = usePads();
  const model = useModel({ model: ViewModel, options: { type: pads.map(pad => pad.type), topic } });

  return {
    model: model ?? new ViewModel(),
    createItem: (type) => {
      assert(model);
      const title = `item-${chance.word()}`;
      return model.createView(type, title);
    }
  };
};

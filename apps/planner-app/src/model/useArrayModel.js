//
// Copyright 2020 Wireline, Inc.
//

import { useModel } from '@dxos/react-client';

import { ArrayModel } from './array';

export const useArrayModel = (topic, type, options = {}) => useModel({
  model: ArrayModel,
  options: {
    type,
    topic,
    ...options
  }
});

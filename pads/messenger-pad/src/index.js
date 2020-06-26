//
// Copyright 2020 DXOS.org
//

import Icon from '@material-ui/icons/Chat';

import { Channel } from './containers/Channel';
import { TYPE_MESSENGER_CHANNEL } from './model';

export * from './model';

export default {
  // TODO(elmasse): READ THIS FROM PAD.YML
  name: 'example.com/messenger',
  displayName: 'Messenger',

  icon: Icon,
  main: Channel,
  type: TYPE_MESSENGER_CHANNEL,
  description: 'Chat with friends'
};
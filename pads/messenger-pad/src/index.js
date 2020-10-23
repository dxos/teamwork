//
// Copyright 2020 DXOS.org
//

import Icon from '@material-ui/icons/Chat';

import { MessengerModel } from '@dxos/messenger-model';
import { ObjectModel } from '@dxos/object-model';

import { Channel, MessengerSettingsDialog } from './containers';
import { TYPE_MESSENGER_CHANNEL, TYPE_MESSENGER_MESSAGE } from './model';

export * from './model';

export default {
  // TODO(elmasse): READ THIS FROM PAD.YML
  name: 'example.com/messenger',
  displayName: 'Messenger',

  icon: Icon,
  main: Channel,
  type: TYPE_MESSENGER_CHANNEL,
  contentType: TYPE_MESSENGER_MESSAGE,
  description: 'Chat with friends',
  settings: MessengerSettingsDialog,
  register: async (client) => {
    await client.registerModel(MessengerModel);
  },
  create: async ({ client, party }, { name }) => {
    const item = await party.database.createItem({
      model: ObjectModel,
      type: TYPE_MESSENGER_CHANNEL,
      props: { title: name || 'untitled' }
    });
    await party.database.createItem({
      model: MessengerModel,
      type: TYPE_MESSENGER_MESSAGE,
      parent: item.id
    });
    return item;
  }
};

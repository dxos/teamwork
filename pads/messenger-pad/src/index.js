//
// Copyright 2020 DXOS.org
//

import Icon from '@material-ui/icons/Chat';

import { MessengerModel } from '@dxos/messenger-model';
import { ObjectModel } from '@dxos/object-model';

import { Channel, MessengerSettingsDialog } from './containers';
import { MESSENGER_PAD, MESSENGER_TYPE_CHANNEL, MESSENGER_TYPE_MESSAGE } from './model';

export * from './model';

export default {
  name: MESSENGER_PAD,
  type: MESSENGER_TYPE_CHANNEL,
  contentType: MESSENGER_TYPE_MESSAGE,
  displayName: 'Messenger',
  description: 'Group messaging',
  icon: Icon,
  main: Channel,
  settings: MessengerSettingsDialog,
  register: async (client) => {
    await client.registerModel(MessengerModel);
  },
  create: async ({ client, party }, { name }) => {
    const item = await party.database.createItem({
      model: ObjectModel,
      type: MESSENGER_TYPE_CHANNEL,
      props: { title: name || 'untitled' }
    });

    await party.database.createItem({
      model: MessengerModel,
      type: MESSENGER_TYPE_MESSAGE,
      parent: item.id
    });

    return item;
  }
};

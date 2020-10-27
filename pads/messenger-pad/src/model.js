//
// Copyright 2020 DXOS.org
//

import assert from 'assert';

import { createId, humanize, keyToBuffer, keyToString } from '@dxos/crypto';
import { MessengerModel } from '@dxos/messenger-model';
import { useMembers } from '@dxos/react-appkit';
import { useItems, useProfile, useClient, useParty } from '@dxos/react-client';

export const TYPE_MESSENGER_CHANNEL = 'wrn_dxos_org_teamwork_messenger_channel';
export const TYPE_MESSENGER_MESSAGE = 'wrn_dxos_org_teamwork_messenger_message';

/**
 * Provides channel messages and appender.
 * @param topic
 * @param channelId
 * @returns {[Object[], function]}
 */
export const useChannelMessages = (topic, channelId) => {
  assert(topic);
  assert(channelId);
  const partyKey = keyToBuffer(topic);
  const party = useParty(partyKey);
  const members = useMembers(party);
  const profile = useProfile();
  const client = useClient();

  client.registerModel(MessengerModel);

  const member = members.find(member => keyToString(member.publicKey) === profile.publicKey);
  const sender = member?.displayName ?? humanize(profile.publicKey);

  const [messenger] = useItems({ partyKey, parent: channelId, type: TYPE_MESSENGER_MESSAGE });

  if (!messenger) return [[], () => {}];
  return [messenger.model.messages, text => {
    messenger.model.sendMessage({
      id: createId(),
      text,
      sender,
      timestamp: Date.now().toString()
    });
  }];
};

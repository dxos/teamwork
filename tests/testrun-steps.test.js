//
// Copyright 2020 DXOS.org
//

import chai from 'chai';
import mocha from 'mocha';

import { launchUsers } from './utils/launch-users.js';

const { expect } = chai;
const { before, after, describe, it } = mocha;

describe('Perform testrun steps', function () {
  this.timeout(1e6);

  let userA, userB, partyName;

    before(async function () {
        const setup = await launchUsers();
        userA = setup.userA;
        userB = setup.userB;
        partyName = setup.partyName;
    });

    // after(async function () {
    //   userA && await userA.closeBrowser();
    //   userB && await userB.closeBrowser();
    // });

    it('User A creates new Messenger and both users can get in', async function () {
      const messengerName = 'New Chat';
      await userA.partyManager.addItemToParty(partyName, 'Messenger', messengerName);
      await userB.partyManager.enterItemInParty(partyName, messengerName);

      const message = 'This is very secret message';
      await userA.messengerManager.sendMessage(message);
      // eslint-disable-next-line no-unused-expressions
      expect(await userB.messengerManager.isMessageExisting(message)).to.be.true;
    });

    it('Both users go to Home page', async function () {
      await userA.goToHomePage();
      await userB.goToHomePage();
    });
});

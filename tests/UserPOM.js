//
// Copyright 2020 DXOS.org
//
import { BrowserPOM } from './BrowserPOM.js';

export class UserPOM extends BrowserPOM {
    name = ''

    constructor (_name) {
        super();
        this.name = _name;
    }

    async createWallet () {
        const walletButtonSelector = textButtonSelector('Create Wallet');
        await this.page.waitForSelector(walletButtonSelector);
        await this.page.click(walletButtonSelector);

        await this.page.waitForSelector('input');
        await this.page.fill('input', this.name);

        const nextButtonSelector = textButtonSelector('Next');
        await this.page.click(nextButtonSelector);
        await this.page.waitForSelector(nextButtonSelector);
        await this.page.click(nextButtonSelector);

        const finishButtonSelector = textButtonSelector('Finish');
        await this.page.waitForSelector(finishButtonSelector);
        await this.page.click(finishButtonSelector);
    }

    async createParty () {
        const cardsSelector = '//div[contains(@class,\'MuiGrid-item\')]';
        const cardTitlesSelector = '//div[contains(@class,\'MuiGrid-item\')]//h2';
        await this.page.waitForSelector(cardsSelector);
        const initialPartyNames = await this.getPartyNames();

        const newPartyButtonSelector = '(//button[@name=\'new-party\'])[1]';
        await this.page.waitForSelector(newPartyButtonSelector);
        await this.page.click(newPartyButtonSelector);

        while (initialPartyNames.length === (await this.page.$$(cardTitlesSelector)).length) {
            await this.page.waitForTimeout(50);
        }

        const currentPartyNames = await this.page.$$eval(cardTitlesSelector, textTags => textTags.map(textTag => textTag.innerHTML));
        const newCardName = currentPartyNames.filter(card => !initialPartyNames.includes(card))[0];

        return newCardName;
    }

    async clickSharePartyButton (partyIdx) {
        const shareButtonSelector = `(//div[@name='share'])[${partyIdx}]`;
        await this.page.waitForSelector(shareButtonSelector);
        await this.page.click(shareButtonSelector);
    }

    async closeSharePartyDialog () {
        const doneButtonSelector = textButtonSelector('Done');
        await this.page.waitForSelector(doneButtonSelector);
        await this.page.click(doneButtonSelector);
    }

    async inviteUnknownUserToParty (partyIdx) {
        await this.clickSharePartyButton(partyIdx);

        const inviteUserButtonSelector = textButtonSelector('Invite User');
        await this.page.waitForSelector(inviteUserButtonSelector);
        const shareLink = { url: null };
        await this.subscribeForLink(shareLink);
        await this.page.click(inviteUserButtonSelector);
        await this.waitUntil(() => !!shareLink.url);

        return shareLink.url;
    }

    async inviteKnownUserToParty (partyName, userName) {
        await this.shareParty(partyName);
        const addUserButtonSelector = `//*[contains(@class,'MuiDialog-container')]//td[text()='${userName}']/following::*[contains(@class,'MuiIconButton-label')]`;
        await this.page.waitForSelector(addUserButtonSelector);

        const shareLink = { url: null };
        await this.subscribeForLink(shareLink);
        await this.page.click(addUserButtonSelector);
        await this.waitUntil(() => !!shareLink.url);

        return shareLink.url;
    }

    async shareParty (partyName) {
        const cardsSelector = '//div[contains(@class,\'MuiGrid-item\')]';
        const cardTitlesSelector = '//div[contains(@class,\'MuiGrid-item\')]//h2';
        await this.page.waitForSelector(cardsSelector);
        const initialCardNames = await this.page.$$eval(cardTitlesSelector, textTags => textTags.map(textTag => textTag.innerHTML));

        const partyIdx = initialCardNames.findIndex(cardName => cardName === partyName) + 1;
        await this.clickSharePartyButton(partyIdx);
    }

    async subscribeForLink (shareLink) {
        const linkRegex = /(https?:\/\/)/g;

        this.page.waitForEvent('console', message => {
            if (message.text().match(linkRegex)) {
                shareLink.url = message.text();
                return true;
            }
            return false;
        });
    }

    async getPasscode () {
        const passcodeSelector = '//span[contains(@class,\'passcode\')]';
        await this.page.waitForSelector(passcodeSelector);
        return await this.page.$eval(passcodeSelector, passcode => passcode.innerHTML);
    }

    async fillPasscode (passcode) {
        await this.page.waitForSelector('input');
        await this.page.fill('input', passcode);
    }

    async isPartyExisting (partyName) {
        const partyNameSelector = `//*[contains(text(),'${partyName}')]`;
        try {
            await this.page.waitForSelector(partyNameSelector, { timeout: 1e5 });
        } catch (error) {
            console.log('Party: ' + partyName + ' does not exist');
            return false;
        }
        return true;
    }

    async isUserInParty (partyName, username) {
        if (!(await this.isPartyExisting(partyName))) {
            return false;
        }
        const avatarGroupSelector = '//div[contains(@class,\'MuiAvatarGroup-root\')]';
        const userAvatarSelector = `${avatarGroupSelector}/*[@title='${username}']`;
        try {
            await this.page.waitForSelector(userAvatarSelector, { timeout: 1e5 });
        } catch (error) {
            console.log('User: ' + username + ' does not exist in party: ' + partyName);
            return false;
        }
        return await this.page.$eval(userAvatarSelector, avatar => !!avatar);
    }

    async getPartyNames () {
        const partyNamesSelector = '//div[contains(@class,\'MuiGrid-item\')]//*[contains(@class,\'MuiCardHeader-content\')]/*';
        try {
            await this.page.waitForSelector(partyNamesSelector, { timeout: 2 * 1e3 });
        } catch (error) {
            console.log(`${this.name} did not select any party name`);
            return [];
        }
        try {
            const partyNames = await this.page.$$eval(partyNamesSelector, partyNamesTags => {
                return partyNamesTags.map(tag => tag.innerHTML);
            });
            return partyNames;
        } catch (error) {
            console.log(`${this.name} did not select any party name`);
            return null;
        }
    }
}

const textButtonSelector = (text) => `//span[contains(@class,'MuiButton-label') and contains(text(),'${text}')]`;
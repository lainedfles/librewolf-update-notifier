/*
    Firefox Add-on "Update Notifier"
    Copyright (C) 2024  Manuel Reimer <manuel.reimer@gmx.de>

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
/*
    Librewolf addon "Librewolf Update Notifier"
    Modified by Self Denial <selfdenial@pm.me>
*/

async function CheckForUpdates() {
  if (! await VersionChecker.isUpToDate())
    OpenNotification(false);
}

browser.runtime.onStartup.addListener(CheckForUpdates);
browser.runtime.onInstalled.addListener(CheckForUpdates);

async function OpenNotification(clicked = true) {
  let res;
  try {
    res = await browser.storage.managed.get('notiftype');
  } catch (error) {
    console.error(error);
  }
  if (typeof res === 'undefined') {
    res = await browser.storage.sync.get('notiftype');
  }
  if (res.notiftype === 'popup' || res.notiftype === 'both' || clicked !== false) {
    browser.tabs.create({
      active: true,
      url: browser.runtime.getURL("notification/message.html")
    });
  }
  if (res.notiftype === 'notif' || res.notiftype === 'both') {
    let msg = 'New version available!';
    let icon = browser.extension.getURL("notification/images/warning-icon.svg")
    if (VersionChecker.error) {
      msg = 'Error checking update!'
      icon = browser.extension.getURL("notification/images/error-icon.svg")
    }
    browser.notifications.create({
      type: "basic",
      iconUrl: icon,
      title: 'Librewolf Update Notifier',
      message: msg,
    });
  }
}

browser.browserAction.onClicked.addListener(OpenNotification);
browser.menus.onClicked.addListener((info, tab) => {
  switch (info.menuItemId) {
    case "open_options":
      browser.runtime.openOptionsPage();
      break;
  }
});
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
  console.debug("background CheckForUpdates(): checking for updates")
  if (! await VersionChecker.isUpToDate())
    OpenNotification(false);
}

// Handle options
async function init() {
  const res = await browser.storage.sync.get();
  if (typeof res.notiftype === "undefined" || typeof res.alarmtimer === "undefined") {
    console.debug("background init(): setting default options");
    await browser.storage.sync.set({
      notiftype: "both",
      alarmtimer: "720"
    });
  }
  CheckForUpdates();
  await ScheduleAlarm.update();
}

browser.runtime.onStartup.addListener(init);
browser.runtime.onInstalled.addListener(init);

// Notifications
async function OpenNotification(clicked = true) {
  let res;
  try {
    res = await browser.storage.managed.get("notiftype");
  } catch (e) {
    this.error = e;
  }
  if (typeof res === "undefined") {
    res = await browser.storage.sync.get("notiftype");
  }
  if (res.notiftype === "popup" || res.notiftype === "both" || clicked !== false) {
    browser.tabs.create({
      active: true,
      url: browser.runtime.getURL("notification/message.html")
    });
  }
  if ((res.notiftype === "notif" || res.notiftype === "both") && clicked == false) {
    let msg = browser.i18n.getMessage("notificationContentWarn");
    let icon = browser.runtime.getURL("notification/images/warning-icon.svg");
    if (VersionChecker.error) {
      msg = browser.i18n.getMessage("notificationContentErr");
      icon = browser.runtime.getURL("notification/images/error-icon.svg");
    }
    browser.notifications.create({
      type: "basic",
      iconUrl: icon,
      title: browser.i18n.getMessage("extensionName"),
      message: msg
    });
  }
}

browser.browserAction.onClicked.addListener(OpenNotification);

// Menus
browser.menus.create({
  id: "open_options",
  title: browser.i18n.getMessage("menuOpenSettings"),
  icons: { "16": "notification/images/ok-icon.svg" },
  contexts: ["browser_action"],
});

browser.menus.onClicked.addListener((info) => {
  switch (info.menuItemId) {
    case "open_options":
      browser.runtime.openOptionsPage();
      break;
  }
});

function updateMenuItem(id, title) {
  browser.menus.update(id, {
    title: title,
  });
  browser.menus.refresh();
}

browser.menus.onShown.addListener((info) => {
  const id = "open_options";
  if (!info.menuIds.includes(id)) {
    return;
  }
  updateMenuItem(id, browser.i18n.getMessage("menuOpenSettings"));
});

// Schedule alarm to poll for updates
browser.alarms.onAlarm.addListener(CheckForUpdates);
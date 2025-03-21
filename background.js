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

async function CheckForUpdates() {
  if (! await VersionChecker.isUpToDate())
    OpenNotification();
}

browser.runtime.onStartup.addListener(CheckForUpdates);
browser.runtime.onInstalled.addListener(CheckForUpdates);

function OpenNotification() {
  browser.tabs.create({
    active: true,
    url: browser.runtime.getURL("notification/message.html")
  });
}

browser.browserAction.onClicked.addListener(OpenNotification);

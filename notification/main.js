/*
    Firefox addon "Update Notifier"
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

async function init() {
  // Get the version of the currently running browser
  const info = await browser.runtime.getBrowserInfo();
  const localVersion = info.version;
  document.getElementById("local_version").textContent = localVersion;

  // Get the details div
  const infoDetails = document.getElementById('info_details');
  infoDetails.open = false;

  // Check version
  if (await VersionChecker.isUpToDate()) {
    browser.browserAction.setIcon({
      path: {
        "16": "images/ok-icon.svg",
        "24": "images/ok-icon.svg",
        "32": "images/ok-icon.svg",
        "48": "images/ok-icon.svg",
        "64": "images/ok-icon.svg",
        "96": "images/ok-icon.svg"
      },
    });
    document.getElementById("img_ok").classList.remove("hidden");
    document.getElementById("remote_version").textContent = localVersion;
  }
  else {
    if (VersionChecker.error) {
      alert(VersionChecker.error);
      browser.browserAction.setIcon({
      path: {
        "16": "images/error-icon.svg",
        "24": "images/error-icon.svg",
        "32": "images/error-icon.svg",
        "48": "images/error-icon.svg",
        "64": "images/error-icon.svg",
        "96": "images/error-icon.svg"
      },
      });
      document.getElementById("img_error").classList.remove("hidden");
      infoDetails.open = true;
    }
    else {
      browser.browserAction.setIcon({
      path: {
        "16": "images/warning-icon.svg",
        "24": "images/warning-icon.svg",
        "32": "images/warning-icon.svg",
        "48": "images/warning-icon.svg",
        "64": "images/warning-icon.svg",
        "96": "images/warning-icon.svg"
      },
      });
      document.getElementById("img_warning").classList.remove("hidden");
      document.getElementById("remote_version").textContent = VersionChecker.remoteVersion.join(", ");
      infoDetails.open = true;
    }
  }
}

init();
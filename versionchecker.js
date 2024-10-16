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

const VersionChecker = {
  isUpToDate: async function() {
    // Catch potential errors when working with the Mozilla API
    try {
      // Fetch remote version info
      const response = await fetch("https://product-details.mozilla.org/1.0/firefox_versions.json");
      const json = await response.json();

      // Prepare storage for the version information
      this.remoteVersions = {
        "release": [],
        "esr": [],
        "developer": [],
        "beta": []
      }

      // Parse JSON response from the product details API
      for (let key in json) {
        if (key == "LATEST_FIREFOX_DEVEL_VERSION") {
          this.remoteVersions["developer"].push(json[key]);
          this.remoteVersions["beta"].push(json[key]);
        }
        else if (key == "LATEST_FIREFOX_VERSION")
          this.remoteVersions["release"].push(json[key]);
        else if (key.startsWith("FIREFOX_ESR") && json[key])
          this.remoteVersions["esr"].push(json[key].replace("esr", ""));
      }
    }
    catch(e) {
      this.error = e;
      return false;
    }
    this.error = false;

    // Get the version choices valid for the selected channel
    const prefs = await Storage.get();
    const channel = prefs.updatechannel;
    this.remoteVersion = this.remoteVersions[channel];

    // Get the version of the currently running browser
    const info = await browser.runtime.getBrowserInfo();
    this.localVersion = info.version;

    // Finally do the comparison and return the result
    return this.remoteVersion.includes(this.localVersion);
  }
};

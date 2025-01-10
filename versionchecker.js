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

const VersionChecker = {
  isUpToDate: async function() {
    // Catch potential errors when working with the Mozilla API
    try {
      // Fetch remote version info
      const response = await fetch("https://gitlab.com/api/v4/projects/44042130/releases");
      const json = await response.json();

      // Prepare storage for the version information
      this.remoteVersions = {
        "release": []
      }

      // Parse JSON response from the product details API
      this.remoteVersions["release"].push(json[0].tag_name);
    }
    catch(e) {
      this.error = e;
      return false;
    }
    this.error = false;

    this.remoteVersion = this.remoteVersions["release"];

    // Get the version of the currently running browser
    const info = await browser.runtime.getBrowserInfo();
    this.localVersion = info.version;

    // Finally do the comparison and return the result
    return this.remoteVersion.includes(this.localVersion);
  }
};

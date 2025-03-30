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
    // Prepare timeout abort controller
    const controller = new AbortController();
    const timeoutPromise = new Promise((_, abort) => {
      setTimeout(abort, 30000);
    });

    // Catch potential errors when working with the Mozilla API
    try {
      // Fetch remote version info
      const url = "https://gitlab.com/api/v4/projects/44042130/releases";
      const response = await Promise.race([
        fetch(url, { signal: controller.signal }),
        timeoutPromise
      ]);
      const json = await response.json();

      // Prepare storage for the version information
      this.remoteVersions = {
        "release": []
      }

      // Parse JSON response from the product details API
      this.remoteVersions["release"].push(json[0].tag_name);
    } catch(e) {
      this.error = e;
      if (e.name === "AbortError") {
        console.error("VersionChecker() fetch timed out", url);
      } else {
        console.error("VersionChecker() fetch failed:", e.message);
      }
      return false;
    } finally {
      // Cleanup abort the controller
      controller.abort();
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

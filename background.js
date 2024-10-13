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
  console.log("START");
  const response = await fetch("https://product-details.mozilla.org/1.0/firefox_versions.json");
  const json = await response.json();
  console.log(json);
}

browser.runtime.onStartup.addListener(CheckForUpdates);

CheckForUpdates(); // Only enable for debugging and development

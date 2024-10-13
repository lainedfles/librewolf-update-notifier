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

'use strict';

async function ChannelChanged(e) {
  let channel = e.target.id.split("_")[1];
  await Storage.set({
    updatechannel: channel
  });
  await browser.runtime.sendMessage({type: "OptionsChanged"});
}

async function init() {
  await loadOptions();

  let channeloptions = document.getElementsByName("updatechannel_options");
  channeloptions.forEach((option) => {
    option.addEventListener("click", ChannelChanged);
  });
}

async function loadOptions() {
  const prefs = await Storage.get();

  // Update channel
  document.getElementById("updatechannel_" + prefs.updatechannel).checked = true;
}

// Register event listener to receive option update notifications
browser.runtime.onMessage.addListener((data, sender) => {
  if (data.type == "OptionsChanged")
    loadOptions();
});

init();

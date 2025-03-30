/*
    Librewolf addon "Librewolf Update Notifier"
    Copyright (C) 2024  Self Denial <selfdenial@pm.me>

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

async function saveOptions(e) {
  e.preventDefault();
  await browser.storage.sync.set({
    notiftype: document.getElementById("notif_type").value,
    alarmtimer: document.getElementById("alarm_timer").value
  });
  document.getElementById("submit_button").disabled = "disabled";
  await ScheduleAlarm.update();
}

async function restoreOptions() {
  let res;
  try {
    res = await browser.storage.managed.get();
    document.getElementById("managed_options").style.display = "block";
    document.getElementById("notif_type").disabled = "disabled";
    document.getElementById("alarm_timer").disabled = "disabled";
    document.getElementById("notif_type").value = res.notiftype;
    document.getElementById("alarm_timer").value = res.alarmtimer;
    await browser.storage.sync.set({
      notiftype: res.notiftype,
      alarmtimer: res.alarmtimer
    });
  } catch (e) {
    this.error = e;
  }
  if (typeof res === "undefined") {
    res = await browser.storage.sync.get();
    document.getElementById("notif_type").value = res.notiftype;
    document.getElementById("alarm_timer").value = res.alarmtimer;
  }
  await optionsOnChange();
}

async function optionsOnChange() {
  const res = await browser.storage.sync.get();
  if (document.getElementById("notif_type").value !== res.notiftype || document.getElementById("alarm_timer").value !== res.alarmtimer) {
    document.getElementById("submit_button").disabled = "";
  } else {
    document.getElementById("submit_button").disabled = "disabled";
  }
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.getElementById("options_form").addEventListener("submit", saveOptions);
document.getElementById("options_form").addEventListener("reset", optionsOnChange);
document.getElementById("notif_type").addEventListener("change", optionsOnChange);
document.getElementById("alarm_timer").addEventListener("change", optionsOnChange);
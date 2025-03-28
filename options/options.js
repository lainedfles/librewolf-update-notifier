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
    notiftype: document.querySelector("#notif-type").value
  });
  document.querySelector("#submit-button").disabled = 'disabled';
}

async function restoreOptions() {
  let res;
  try {
    res = await browser.storage.managed.get('notiftype');
    document.querySelector("#managed-options").style.display = 'block';
    document.querySelector("#notif-type").disabled = 'disabled';
    document.querySelector("#submit-button").disabled = 'disabled';
    document.querySelector("#notif-type").value = res.notiftype;
    await browser.storage.sync.set({
      notiftype: res.notiftype
    });
  } catch (error) {
    console.error(error);
  }
  if (typeof res === 'undefined') {
    res = await browser.storage.sync.get('notiftype');
    document.querySelector("#notif-type").value = res.notiftype || 'both';
  }
  await optionsOnChange();
}

async function optionsOnChange() {
  let res = await browser.storage.sync.get('notiftype');
  if (document.querySelector("#notif-type").value === res.notiftype) {
    document.querySelector("#submit-button").disabled = 'disabled';
  } else {
    document.querySelector("#submit-button").disabled = '';
  }
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
document.querySelector("#notif-type").addEventListener("change", optionsOnChange);
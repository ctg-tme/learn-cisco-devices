/********************************************************
Copyright (c) 2025 Cisco and/or its affiliates.
This software is licensed to you under the terms of the Cisco Sample
Code License, Version 1.1 (the "License"). You may obtain a copy of the
License at
               https://developer.cisco.com/docs/licenses
All use of the material herein must be in accordance with the terms of
the License. All rights not expressly granted by the License are
reserved. Unless required by applicable law or agreed to separately in
writing, software distributed under the License is distributed on an "AS
IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
or implied.
*********************************************************

 * Author(s):               Robert(Bobby) McGonigle Jr
 *                          Technical Marketing Engineer
 *                          Cisco Systems
 * 
 * Consulting Engineer(s):  Peter Welburn
 *                          Principle Technical Marketing Engineer
 *                          Cisco Systems
 * 
 * Released: September 15, 2025
 * Updated: September 15, 2025
 * 
 * Compatibility
 *    OnPrem : Yes
 *     Cloud : Yes
 *      Edge : Yes
 *       MTR : Yes
 * 
 * Minimum RoomOS Version
 *  11.32.1.1
 * 
 * Description: 
 *    - This Macro generate a Panel Button for RoomOS devices that's designed to open
 *      - https://ctg-tme.github.io/learn-cisco-devices
 *    - This macro will auto-detect the platform in order to generate the panel in an appropriate location for the platform in use
 *    - This macro will apply the appropriate URL parameters as needed
 *    - This macro will modify the path of the site to simplify content when opened on a RoomOS device
 *    - There is a small configuration section that allows you to customize a few properties
*/

import xapi from 'xapi';

/**
 * @typedef {object} UserInterfaceConfig
 * @property {string} Name - The name of the Panel Icon as well as the DisplayName for the WebApp on load.
 * @property {'Auto'|'HomeScreen'|'HomeScreenAndCallControls'|'CallControls'|'ControlPanel'|'Hidden'} Location - Determines the placement of the Panel.
 *   'Auto' will place the Panel in a default location for either MTR or RoomOS.
 *   Any conflicts based on Software Platform will fall back to 'Auto'.
 * @property {number} PanelPosition - The position this panel sits amongst other Custom Panels.
 *   Note, in-built OS panels cannot be moved.
 * @property {string} Icon - The UI Extension Icon to use.
 *   Note, if an IconURL is provided, the IconURL will override this value.
 * @property {string} IconUrl - The URL for a custom icon image.
 */
/**
 * @typedef {object} SiteSettingsConfig
 * @property {boolean} AutoTimeout - If true, the panel will automatically time out.
 * @property {'Auto'|'On'|'Off'} QRCode - Controls the display of the QR code.
 *   'Auto' will only show a QR code if the User Agent reports that a RoomOS device is in use.
 *   'On' will force the QR Code on.
 *   'Off' will force the QR Code Off.
 */
/**
 * @typedef {object} Config
 * @property {UserInterfaceConfig} UserInterface - Configuration for the user interface elements.
 * @property {SiteSettingsConfig} SiteSettings - Configuration for site-wide settings.
 */
/**
 * @type {Config}
 */
const config = {
  UserInterface: {
    Name: 'Learn Cisco Devices',// The name of the Panel Icon as well the the DisplayName for the WebApp on load
    Location: 'Auto',           // Auto/HomeScreen/HomeScreenAndCallControls/CallControls/ControlPanel/Hidden. Auto will place the Panel in a default location for either MTR or RoomOS. Any conflicts based on Software Platform will fall back to Auto
    PanelPosition: 999,         // The position thi panel sits amongst other Custom Panels. Note, in-built OS panels can not be moved
    Icon: 'Lightbulb',          // The UI Extension Icon you'd like to use. Note, if an IconURL is provided, the IconURL will override this value
    IconUrl: 'https://avatars.githubusercontent.com/u/159071680?s=200&v=4'
  },
  SiteSettings: {
    AutoTimeout: true,
    QRCode: 'Auto'              // Auto/On/Off. Auto will only show a QR code if the User Agent reports that a RoomOS device is in use. On will for the QR Code on, Off will force the QR Code Off
  }
}

/******************************************
 *                                       *
 *      Do Not Edit Below this Line      *
 *                                       *
******************************************/

/**
 * @typedef {object} PlatformOverrideConfig
 * @property {boolean} Mode - Overrides Platform detection to the platform specified below.
 *   This alters how the Macro instantiates itself and behaves; it does not alter the device platform.
 * @property {'mtr'|'roomos'} Platform - Specifies the platform to override to ('mtr' or 'roomos').
 */

/**
 * @typedef {object} DeveloperConfig
 * @property {boolean} Mode - Enables Debugging in both this Macro and Web Application.
 * @property {PlatformOverrideConfig} PlatformOverride - Configuration for overriding platform detection.
 */

/**
 * @type {DeveloperConfig}
 */
const developer = {
  Mode: false,                 // Enables Debugging in both this Macro and Web Application
  PlatformOverride: {
    Mode: false,               // Overrides Platform detection to the platform specified below. This alters how the Macro instantiates itself and behaves, it does not alter the device platform
    Platform: 'mtr'           // mtr or roomos
  }
}

/**
 * @type {string}
 * @description The current version of the macro
 */
const version = '1.0.0';

/**
 * @type {string}
 * @description The minimun version of RoomOS required
 */
const minimumRoomOSversion = '11.32.1.1';

/**
 * @type {string}
 * @description The current platform detected by the device
 */
let osPlatform = 'roomos';

/**
 * @type {string}
 * @description The url to open for this solution
 */
let url = `https://ctg-tme.github.io/learn-cisco-devices`;

const oldLog = console.log;
const oldInfo = console.info;
const oldWarn = console.warn;
const oldDebug = console.debug;
const oldError = console.debug;

console.log = function (...args) { oldLog(`Log:`, ...args) };
console.info = function (...args) { oldInfo(`Info:`, ...args) };
console.warn = function (...args) { oldWarn(`Warning:`, ...args) };
console.debug = function (...args) { if (developer.Mode) { oldInfo(`Debug:`, ...args); } else { oldDebug(`Debug:`, ...args); }; };
console.error = function (...args) { oldError(`Error:`, ...args) };


/**
 * @typedef {object} OpenAppOptions
 * @property {'OSD'|'ControlPanel'} [Target='OSD'] Specifies where the web view should be displayed.
 *   'OSD' typically means On-Screen Display, 'ControlPanel' means within the device's control panel.
 * @property {'Modal'|'Full'|'Minimized'} [Mode='Modal'] Specifies the display mode of the web view.
 *   'Modal' typically means a pop-up, 'Full' means full screen, 'Minimized' means a smaller view.
 * @property {string} [Url] The URL to be loaded in the web view. This is set internally.
 * @property {string} [Title] The title for the web view. This is set internally based on `config.UserInterface.Name`.
 */

/**
 * Opens a web application view on the Cisco device.
 * It sets default values for `Target` and `Mode` if not provided,
 * then assigns the global `url` and `config.UserInterface.Name` to the options,
 * and finally displays the web view using the xAPI command.
 *
 * @param {OpenAppOptions} options Configuration options for opening the web view.
 * @returns {Promise<void>} A promise that resolves when the web view display command is sent.
 */
async function openApp(options) {
  if (!options.Target) {
    options.Target = 'OSD'
  }
  if (!options.Mode) {
    options.Mode = 'Modal'
  }

  options.Url = url;
  options.Title = config.UserInterface.Name;

  console.warn(options)

  await xapi.Command.UserInterface.WebView.Display(options)
}


/**
 * @typedef {object} FetchIconSuccessResponse
 * @property {string} Message A success message, e.g., "Icon Applied".
 * @property {string} PanelId The ID of the panel to which the icon was applied.
 * @property {string} IconId The ID of the downloaded icon.
 */

/**
 * @typedef {object} FetchIconErrorResponse
 * @property {string} Context A description of the error context.
 * @property {string} [IconUrl] The URL that was attempted to be fetched (if applicable).
 * @property {string} [PanelId] The panel ID involved in the operation (if applicable).
 * @property {object} [Error] The underlying error object from the xAPI command (if applicable).
 */

/**
 * Fetches an icon from a given URL and applies it to a specified UI panel.
 * It first validates the input parameters and the URL format.
 * Then, it downloads the icon using `xapi.Command.UserInterface.Extensions.Icon.Download`
 * and updates the panel's icon using `xapi.Command.UserInterface.Extensions.Panel.Update`.
 *
 * @param {string} iconUrl The URL of the icon image to fetch. Must be a valid HTTP/HTTPS URL.
 * @param {string} panelId The ID of the custom panel to which the icon should be applied.
 * @returns {Promise<FetchIconSuccessResponse>} A promise that resolves with a success object containing
 *   a message, the panel ID, and the new icon ID if the operation is successful.
 * @throws {Promise<FetchIconErrorResponse>} A promise that rejects with an error object if:
 *   `iconUrl` or `panelId` is undefined.
 *   `iconUrl` is not a valid URL format.
 *   Any xAPI command fails during the icon download or panel update process.
 */
async function fetchIconByUrl(iconUrl, panelId) {
  return new Promise(async (resolve, reject) => {
    if (!iconUrl) reject({ Context: `iconUrl parameter "undefined"`, IconUrl: iconUrl });
    if (!panelId) reject({ Context: `panelId parameter "undefined"`, PanelId: panelId });
    if (!/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(iconUrl)) reject({ Context: `iconUrl parameter does not contain a valid Url`, iconUrl });
    try {
      const getIcon = (await xapi.Command.UserInterface.Extensions.Icon.Download({ Url: iconUrl }));
      console.debug(`Icon Fetch Response: `, getIcon);
      const iconId = getIcon.IconId
      const uploadIcon = await xapi.Command.UserInterface.Extensions.Panel.Update({ IconId: iconId, Icon: 'Custom', PanelId: panelId });
      console.debug('Icon Upload Response:', uploadIcon);
      resolve({ Message: `Icon Applied`, PanelId: panelId, IconId: iconId });
    } catch (e) {
      let err = {
        Context: `Failed to Fetch Icon`,
        IconUrl: iconUrl,
        Error: e
      }
      reject(err);
    }
  })
}

/** Used to validate the RoomOS version of the device
 * 
 * @param {String} minimumOs 
 * @returns 
 */
async function Validate_RoomOS_Version(minimumOs) {
  const reg = /^\D*(?<MAJOR>\d*)\.(?<MINOR>\d*)\.(?<EXTRAVERSION>\d*)\.(?<BUILDID>\d*).*$/i;
  const minOs = minimumOs;
  const os = await xapi.Status.SystemUnit.Software.Version.get();
  const x = (reg.exec(os)).groups;
  const y = (reg.exec(minOs)).groups;
  if (parseInt(x.MAJOR) > parseInt(y.MAJOR)) return true;
  if (parseInt(x.MAJOR) < parseInt(y.MAJOR)) return false;
  if (parseInt(x.MINOR) > parseInt(y.MINOR)) return true;
  if (parseInt(x.MINOR) < parseInt(y.MINOR)) return false;
  if (parseInt(x.EXTRAVERSION) > parseInt(y.EXTRAVERSION)) return true;
  if (parseInt(x.EXTRAVERSION) < parseInt(y.EXTRAVERSION)) return false;
  if (parseInt(x.BUILDID) > parseInt(y.BUILDID)) return true;
  if (parseInt(x.BUILDID) < parseInt(y.BUILDID)) return false;
  return false;
}

/**
 * Asynchronously builds and configures the user interface panel for the application.
 * This function determines the appropriate display location for the panel based on
 * the `osPlatform` (assumed to be a globally accessible variable) and the
 * `config.UserInterface.Location` setting.
 *
 * It then saves the panel configuration using the xAPI command
 * `UserInterface.Extensions.Panel.Save`, including its order, location, icon, and name.
 * If an `IconUrl` is provided in the configuration, it attempts to fetch and apply
 * a custom icon using the `fetchIconByUrl` function.
 *
 * @returns {Promise<void>} A promise that resolves when the UI panel has been built
 *   and configured, and any custom icon has been fetched and applied.
 * @global config Assumes `config` object (specifically `config.UserInterface`) is
 *   available in the scope, containing UI configuration details.
 * @global osPlatform Assumes `osPlatform` string ('mtr' or 'roomos') is available
 *   in the scope, indicating the current operating system.
 * @throws {Error} If any `xapi` command fails during the panel saving or icon fetching process.
 */
async function buildUI() {
  console.debug('Building UserInterface Panel...');
  let location = 'ControlPanel';

  if (osPlatform == 'mtr') {
    // Handles Placement of Panel for MTR systems
    switch (config.UserInterface.Location.toLowerCase()) {
      case 'callcontrols':
        location = 'CallControls' // Only Visible in Webex/SIP calls on MTR in the Call Controls UI
        break;
      case 'hidden':
        location = 'Hidden' // Hides the Panel
        break;
      case 'auto': case 'homescreen': case 'controlpanel': case 'homescreenandcallcontrols': default:
        location = 'ControlPanel' // Handles Conflicts and places panel in the ControlPanel location, which is always accessible in MTR
        break;
    }
  } else {
    // Handles Placement for Panel in RoomOS systems
    switch (config.UserInterface.Location.toLowerCase()) {
      case 'callcontrols':
        location = 'CallControls'
        break;
      case 'hidden':
        location = 'Hidden'
        break;
      case 'homescreen':
        location = 'HomeScreen'
        break;
      case 'controlpanel':
        location = 'ControlPanel'
        break;
      case 'homescreenandcallcontrols': case 'auto': default:
        location = 'HomeScreenAndCallControls'
        break;
    }
  }

  console.debug(`Panel location determined and is placed in [${location}]`);

  let panelId = 'learn_cisco_devices'

  await xapi.Command.UserInterface.Extensions.Panel.Save({ PanelId: panelId }, `<Extensions><Panel><Order>${config.UserInterface.PanelPosition}</Order><Origin>local</Origin><Location>${location}</Location><Icon>${config.UserInterface.Icon}</Icon><Name>${config.UserInterface.Name}</Name><ActivityType>Custom</ActivityType></Panel></Extensions>`);

  if (config.UserInterface.IconUrl != '' && config.UserInterface.IconUrl.includes('http')) {
    await fetchIconByUrl(config.UserInterface.IconUrl, panelId)
  }

  console.info('UserInterface Panel Built!');
}

/**
 * @typedef {object} UpdateUrlResult
 * @property {string} URL The final constructed URL after applying platform-specific paths and query parameters.
 */

/**
 * Asynchronously updates a global `url` variable by appending platform-specific paths
 * and query parameters based on developer and site settings.
 *
 * The function first removes any trailing slash from the base `url`.
 * If `osPlatform` is 'mtr', it appends '/mtr-navigator' to the URL.
 * It then adds query parameters for debugging (`debug=true` if `developer.Mode` is true),
 * auto-timeout (`timeout=true/false` based on `config.SiteSettings.AutoTimeout`),
 * and QR code display (`qr=true/false` based on `config.SiteSettings.QRCode`).
 *
 * @returns {Promise<UpdateUrlResult>} A promise that resolves with an object containing the updated URL.
 * @global url Assumes `url` (string) is a globally accessible variable that will be modified.
 * @global osPlatform Assumes `osPlatform` (string, 'mtr' or 'roomos') is globally accessible.
 * @global developer Assumes `developer` object (specifically `developer.Mode`) is globally accessible.
 * @global config Assumes `config` object (specifically `config.SiteSettings.AutoTimeout` and `config.SiteSettings.QRCode`) is globally accessible.
 */
async function updateUrl() {
  return new Promise(resolve => {
    console.debug(`Updating URL:`, url)
    let params = [];

    // remove trailing / if found in url path
    url = url.endsWith('/') ? url.slice(0, -1) : url;

    // append mtr content path if in MTR
    if (osPlatform.toLowerCase() == 'mtr') {
      url += '/mtr-navigator'
    } else {
      // url += '/roomos-navigator' // Not available as route yet
    }

    if (developer.Mode) {
      params.push(`debug=true`);
    }

    params.push(`timeout=${config.SiteSettings.AutoTimeout ? true : false}`);

    switch (config.SiteSettings.QRCode.toString().toLowerCase()) {
      case 'on': case 'true':
        params.push(`qr=true`);
        break;
      case 'off': case 'false':
        params.push(`qr=false`);
        break;
      case 'auto':
        break;
      default:
        break;
    }

    if (params.length > 0) {
      url += '?';
      let paramString = params.join('&');
      url += paramString;
    }
    console.info(`URL Updated:`, url)
    resolve({ URL: url });
  })
}

/**
 * @typedef {object} PanelClickEvent
 * @property {string} Origin Indicates the origin of the panel click, which can be used as a target for opening an application (e.g., 'OSD', 'ControlPanel').
 * @property {string} PanelId The identifier of the panel that was clicked.
 * @property {string} PeripheralId The identifier of the peripheral associated with the click (though not used in this function's logic).
 */

/**
 * Handles click events from UI panels.
 * This function logs the event details and, if the clicked panel's ID matches 'learn_cisco_devices',
 * it calls the `openApp` function, passing the `Origin` of the click as the target for the app.
 *
 * @param {PanelClickEvent} event An object containing details about the panel click event.
 * @returns {Promise<void>} A promise that resolves when the handling of the panel click is complete.
 * @global openApp Assumes `openApp` function is available in the global scope.
 */
async function handlePanelClick({ Origin, PanelId, PeripheralId }) {
  console.log(Origin, PanelId, PeripheralId);

  if (PanelId == 'learn_cisco_devices') {
    await openApp({ Target: Origin });
  }
}

/**
 * @typedef {object} AlertMessage
 * @property {string} Title The title of the alert message.
 * @property {string} Text The main text content of the alert message.
 * @property {string} [MoreDetails] Additional details for the alert, used when throwing an error.
 */

/**
 * Initializes the application by performing several setup steps:
 * 1. Clears any existing user interface alerts.
 * 2. Validates the RoomOS version against a `minimumRoomOSversion`. If the version is too low,
 *    it displays an alert and throws an error.
 * 3. Attempts to detect if the system is an MTR (Microsoft Teams Room) device by checking
 *    `xapi.Status.MicrosoftTeams.Software.get()`. If detected, it sets the global `osPlatform` to 'mtr'.
 * 4. Applies a platform override if `developer.Mode` and `developer.PlatformOverride.Mode` are enabled,
 *    forcing `osPlatform` to 'mtr' or 'roomos' as specified.
 * 5. Calls `updateUrl()` to prepare the application URL.
 * 6. Calls `buildUI()` to construct and display the custom user interface panel.
 * 7. Sets up an event listener for `UserInterface.Extensions.Panel.Clicked` events,
 *    delegating handling to `handlePanelClick`.
 *
 * @returns {Promise<void>} A promise that resolves when all initialization steps are complete.
 * @global xapi Assumes `xapi` object is globally available for interacting with the Cisco device API.
 * @global minimumRoomOSversion Assumes `minimumRoomOSversion` (string) is globally accessible.
 * @global _main_macro_name Assumes `_main_macro_name()` (function) is globally accessible to get the macro's name.
 * @global osPlatform Assumes `osPlatform` (string) is a globally accessible variable that will be set ('mtr' or 'roomos').
 * @global developer Assumes `developer` object (specifically `developer.Mode` and `developer.PlatformOverride`) is globally accessible.
 * @global updateUrl Assumes `updateUrl()` function is globally accessible.
 * @global buildUI Assumes `buildUI()` function is globally accessible.
 * @global handlePanelClick Assumes `handlePanelClick()` function is globally accessible.
 * @throws {Error} If the RoomOS version is below the `minimumRoomOSversion`.
 */
async function init() {
  console.log(`Initializing Macro...`)
  await xapi.Command.UserInterface.Message.Alert.Clear();

  const checkRoomOS = await Validate_RoomOS_Version(minimumRoomOSversion);

  if (!checkRoomOS) {
    let msg = { Title: `Macro Requires a RoomOS Update`, Text: `The [${_main_macro_name()}] macro requires RoomOS Version ${minimumRoomOSversion} or higher for optimal use. Check Macro Log for more details` };

    await xapi.Command.UserInterface.Message.Alert.Display(msg);

    msg['MoreDetails'] = `This solution is using new API parameters found in RoomOS ${minimumRoomOSversion}. Using older RoomOS software can lead to a poor UX or Errors. Please update your system to the latest Stable Release software or newer`

    throw new Error(msg)
  }

  try {
    const check4mtr = await xapi.Status.MicrosoftTeams.Software.get()

    if (check4mtr?.Version?.Android) {
      console.debug('MTR System Detected')
      osPlatform = 'mtr';
    }
  } catch (e) {
    console.debug({ Context: 'MTR Not detected, this error is ok to ignore', Error: e.message });
  }

  if (developer.Mode && developer.PlatformOverride.Mode) {
    switch (developer.PlatformOverride.Platform.toLowerCase()) {
      case 'mtr': case 'roomos':
        osPlatform = developer.PlatformOverride.Platform.toLowerCase();
        console.warn(`Platform Override Detected. The Macro will now behave as if it were applied to a [${developer.PlatformOverride.Platform.toLowerCase()}] system`)
        break
    }
  }

  updateUrl();
  await buildUI();

  xapi.Event.UserInterface.Extensions.Panel.Clicked.on(handlePanelClick);

  console.log(`Macro fully initialized and ready!`)
}

xapi.on('ready', init)
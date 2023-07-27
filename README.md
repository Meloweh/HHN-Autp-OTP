# HHN-Autp-OTP

## Automatically redirects through the login page of the ILIAS page of the college HHN Heilbronn.

## About
This open source add-on is made as an quality-of-life improvement - to improve usability of our online dashboard on ILIAS of our college.
This extension allows you to skip manually pressing the "continue" or "login" button and as a bonus it will auto-fill the otp codes for you, so that you don't have to pick up your phone every 30 minutes when the session expires.

** You will need to safe your college credentials in the firefox password manager and toggle the password autofill setting in the firefox settings for the username and password to auto complete and therefore automate the login to the fullest. **

Another convenience is that the OTP setup is fully automated.
You just have to press the "Setup" button and it will setup a Cookie with the OTP access key with the help of the setup manual at login.hs-heilbronn.de.
You can delete the cookie if you like by just pressing the "Delete Cookie" button on the add-on popup.

The buttons only work on sites with permission.
These are:
"*://login.hs-heilbronn.de/*", "*://ilias.hs-heilbronn.de/*"

You don't have to do much more :) (that is the point of the add-on anyway).

Issues:
This add-on assumes html ids and structure to be static. If it changes,then i will need to update the code.

Planned Features:
There are some planned features for the future like an EZ semester course planer by scraping the SPO and module manual, but it depends of how many students want this feature.
I am happy about any further ideas or suggestions for this add-on too.

## Note
Reaching the OTP input page, the html mutation observer will not be triggered after transitioning to this page for some reason. For that reason i provisionally implemented a timout loop that should be executed once on every page.

## Screenshot
![popup](https://github.com/Meloweh/HHN-Autp-OTP/assets/49780209/892dc7fb-28f2-494f-bf61-5e76010ec7f9)

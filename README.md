# Snapchat-page-check
checking if a account is gone or not. useful if you got lots of accs you wanna watch over
STEP 1: Creating a bot
    Go to 'https://discord.com/developers/applications' and click 'New Application".
    Open the app, and click on the 'Bot' tab. Click the 'Add Bot' button.
    You can edit information such as the bot's username, profile picture and description on the "Bot" tab.

STEP 2: Adding the bot to your server(s)
    On the discord developer portal, click the tab 'OAuth2' and go to 'URL Generator'. 
    In the 'scopes' section, select 'bot'.
    A new section 'bot permissions' will open. Select all the permissions that you want the bot to have in your server.
    The 'read Messages/View Channels', 'Read Message History' and 'Send Messages' permission are needed for almost any bot,
        but for many bots more permissions are needed (like 'Kick/Ban Members', 'Add Reactions', etc.) 
        These permissions are the same as the discord role permissions, so it should be clear what most of them are needed for.
    If you fully trust the bot, you can give it the 'Administrator' permission to have all permissions in the server.
    Open the URL shown at the bottom of the page, select the server you want to add the bot to and press 'Authorise'.

STEP 3: Setting up the program
    To run the bot in this folder, first make sure NodeJS is installed (https://nodejs.org/en/download/).
    After installing this, open a command prompt, use `cd <folder_path>` to make your way to this folder.
    Run the command `npm install` to install all the necessary packages for the bot to function.

STEP 4: Setting up the bot
    The only thing left to do before the bot is ready to start is linking the program with your newly created bot.
    To do this, open the 'bot.js' file in this folder with any program/text editor. 
    Navigate back to the 'Bot' section on the discord developer portal, and copy the token (Located just below the username).
    In the bot.js file, it says `const TOKEN = ''`. Place the token in between the quotation marks and save the file.

    For some bots you may also have to set some other variables. These will also be at the top,
        right after the token and right before a few lines of empty space.

STEP 5: Starting the bot 
    Run the 'node bot.js'

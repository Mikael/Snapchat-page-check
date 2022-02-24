// Put your discord bot token here
const TOKEN = "token"

// put the prefix for the bot's commands here.
const PREFIX = '!'

// amount of fails in a row before a link is seen as invalid
const FAILCOUNT = 3



// necessary packages
const request = require('request');
const discord = require("discord.js");
const fs = require('fs');
var file = require('./links.json');

//start bot
const client = new discord.Client();

client.on('ready', async function(){
    client.user.setActivity("Snapchat Page Statuses", {type: "WATCHING"})
    console.log("started!")
})

client.on('message', async function(msg){
    // ignore bots and messages that don't start with the prefix
    if(msg.author.bot) return;
    if (!msg.content.toLowerCase().startsWith(PREFIX)) return;

    // find commands and command arguments
    const args = msg.content.slice(PREFIX.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();

    // add server to list if it isn't in there yet
    if(!file.servers[msg.guild.id]) {
        file.servers[msg.guild.id] = {"links": [], channelID: false, index: 0}
    }

    if(command == "check") {
        let link = args[0].trim()
        if(!link) return msg.channel.send("You need to specify a link!") // require a link
        else if(!validURL(link)) return msg.channel.send("This is an invalid link. Link requires to include `http(s)://`!") // require a valid link
        else {
            // add link to list
            file.servers[msg.guild.id].links.push({url:link,user:msg.author.id,fails:0})

            // send message back
            msg.channel.send("Added " + link + " to the checking list!") 
            if(!file.servers[msg.guild.id].channelID) msg.channel.send("Make sure to set a channel with " + PREFIX + "setchannel to recieve updates for the links!")
        }
    }

    if(command == "setchannel") {
        // set channel
        file.servers[msg.guild.id].channelID = String(msg.channel.id)
        msg.channel.send("The channel has been updated to this channel!")
    }
})

// log the bot in
client.login(TOKEN)

// check if a url exists
function checkURL(url, index, s, c, u) {
    request(url, function (error, response, body) {
        console.log("checking url " + url + " | failed counts so far: " + file.servers[s].links[index].fails)
        //console.log(url, response.statusCode)
        if(!error && response.statusCode == 200) file.servers[s].links[index].fails = 0
        else if(response.statusCode == 404 && body.includes('Well, this is awkward!')) {

            file.servers[s].links[index].fails++

            if(!error) console.log(url + " invalid: status: " + response.statusCode + ", fail count: " + file.servers[s].links[index].fails)
            else console.log(url + " invalid: error in URL. fail count: " + file.servers[s].links[index].fails)
            
            if(file.servers[s].links[index].fails >= FAILCOUNT) {
                // remove url from list
                file.servers[s].links.splice(index,1)
                // send update message
                console.log(url + " no longer exists.")
                client.channels.cache.get(c).send('<@'+ u + '>, ' + url + ' no longer exists!')
            }
            
        }
    })
}

// check if a given url is valid
function validURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(str);
}

// check a link for each server every 5 seconds
setInterval(async function() {
    // loop through all servers the file is in
    for(let s in file.servers) {
        let server = file.servers[s]
        // if the server has a channel set and given links, check for one of its links
        if(server.channelID && server.links.length > 0) {
            // do the check for the url
            if(server.links[server.index]) {
                checkURL(server.links[server.index].url, server.index, s, server.channelID, server.links[server.index].user)
            }

            // update which url is checked next
            server.index++
            if(server.index >= server.links.length) server.index = 0
        }
    }

    // update file
    fs.writeFile('./links.json', JSON.stringify(file), 'utf8', function (err) {
        if (err) return console.log(err);
    })
}, 5000)
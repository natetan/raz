const Discord = require('discord.js');
const discordUtils = require('../utils/discordUtils');
const Jimp = require('jimp');

module.exports = {
  name: 'auction',
  desc: 'Creates auction channels.',
  commandType: 'general',
  usage: '<channelName>',
  args: true,
  async execute(message, args, client) {
    try {
      const channelName = args[0];
      const allowedRoleId = process.env.auction_role_id || require('../auth.json').bot_test_role_id;
      const categoryId = process.env.auction_category_id || require('../auth.json').bot_test_text_category_id;
      const hasPermission = message.member.roles.cache.has(allowedRoleId);
      if (!hasPermission) {
        return message.channel.send(`${message.author}, you do not have permission to use this command.`);
      }
      const channel = await message.guild.channels.create(channelName, {
        type: 'text',
        permissionOverwites: [
          {
            id: allowedRoleId, // Allowed role: auction
            allow: ['VIEW_CHANNEL']
          }

        ],
        parent: categoryId // auction category id
      });
      return message.channel.send(`Created channel <#${channel.id}>`);
    } catch (err) {
      console.log(`ERROR: Command <auction> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
    }
  }
}
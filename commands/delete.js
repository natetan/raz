const Discord = require('discord.js');
const discordUtils = require('../utils/discordUtils');
const Jimp = require('jimp');

module.exports = {
  name: 'delete',
  desc: 'delet.',
  commandType: 'special',
  category: 'imgen',
  async execute(message, args, client) {
    let m = await message.channel.send('Processing imgen...');
    try {
      const avatars = discordUtils.getAvatars(message, client);
      let target = await Jimp.read(avatars.target);
      let base = await Jimp.read('https://raw.githubusercontent.com/natetan/warrior/master/resources/images/memes/delete.png');
      let outputName = 'delete.png';

      target.resize(195, 195);
      await base.composite(target, 120, 135);
      let error, res = await base.getBufferAsync(Jimp.MIME_PNG);
      const attachment = new Discord.MessageAttachment(res, outputName);
      await message.channel.send('', attachment);
      return m.delete();
    } catch (err) {
      console.log(`ERROR: Command <delete> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
      await m.edit('Sorry, there was an error.');
    }
  }
}
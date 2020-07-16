const getMeme = require('../services/getMeme');
const eu = require('../utils/embedUtils');

module.exports = {
  name: 'meme',
  desc: 'Random meme from r/memes, r/dankmemes, r/meirl, or a specified one.',
  usage: '[subreddit]',
  commandType: 'general',
  async execute(message, args, client, logger) {
    let subreddit = args.join('');
    let m;
    if (subreddit) {
      m = await message.channel.send(`Fetching meme from r/${subreddit}`);
    } else {
      m = await message.channel.send('Fetching random meme from r/memes, r/dankmemes, and r/meirl');
    }
    try {
      let meme = await getMeme(subreddit);
      logger.info({
        user: message.author.username,
        channel: message.channel.type === 'text' ? message.channel.name : null,
        content: message.content,
        guild: message.guild ? message.guild.name : null,
        query: subreddit,
        meme: meme,
      });
      if (meme.status_code === 404) {
        return m.edit(`Subreddit r/${subreddit} not found.`);
      }
      if (meme.status_code === 500) {
        return m.edit(meme.message);
      }
      let embed = eu.createMemeEmbed(meme);
      await message.channel.send(embed);
      return m.delete();
    } catch (err) {
      logger.error({
        user: message.author.username,
        channel: message.channel.name,
        content: message.content,
        error: err,
      });
      return m.edit('Sorry, an error occured.');
    }
  }
}
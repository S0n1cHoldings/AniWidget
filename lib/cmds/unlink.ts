import { Command, MessageFlags } from '@warsam-e/echo';
import { _db_anilist_auth_delete } from '$anilist/db.ts';
import { discord_delete_profile } from '$discord.ts';
import type { AniWidget } from '$index.ts';

export default new Command<AniWidget>({
	name: 'unlink',
	description: 'unlink profile',
}).addHandler('chat_input', async (bot, int) => {
	if (!bot.is_whitelisted(int.user)) return int.reply({ content: `Sorry ${int.user}, but this ain't for you...` });
	await int.deferReply({ flags: [MessageFlags.Ephemeral] });
	await _db_anilist_auth_delete(int.user.id);
	await discord_delete_profile(int.user.id);
	await int.editReply('done.');
});

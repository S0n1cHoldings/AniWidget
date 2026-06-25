import { Command, inlineCode, MessageFlags } from '@warsam-e/echo';
import { _db_anilist_auth_get } from '$anilist/db.ts';
import { anilist_profile } from '$anilist/index.ts';
import { discord_payload, discord_update_profile } from '$discord.ts';
import type { AniWidget } from '$index.ts';
import { schema_widget_data } from '$types.ts';
import { schema_assert } from '$utils.ts';

export default new Command<AniWidget>({
	name: 'update',
	description: 'update the stats from AniList.',
}).addHandler('chat_input', async (bot, int) => {
	if (!bot.is_whitelisted(int.user)) return int.reply({ content: `Sorry ${int.user}, but this ain't for you...` });

	await int.deferReply({ flags: [MessageFlags.Ephemeral] });

	if (!(await _db_anilist_auth_get(int.user.id)))
		return int.editReply("You're not logged into AniList! run the /login command rn.");

	const user = await anilist_profile(int.user.id);
	const pfp = user.avatar?.large ?? 'https://s4.anilist.co/file/anilistcdn/user/avatar/large/default.png';

	if (!user.statistics?.anime || !user.statistics.manga || !user.createdAt)
		return int.editReply('something is up with this');

	const data = schema_assert(schema_widget_data, {
		username: user.name,
		pfp,
		total_anime: user.statistics.anime.count,
		days_watched: (+(user.statistics.anime.minutesWatched / 60 / 24)).toFixed(1),
		anime_mean_score: user.statistics.anime.meanScore.toFixed(1),
		total_manga: user.statistics.manga.count,
		chapters_read: user.statistics.manga.chaptersRead,
		manga_mean_score: user.statistics.manga.meanScore.toFixed(1),
		joined_on: new Date(user.createdAt * 1000).toLocaleDateString('en-US', {
			month: 'long',
			day: 'numeric',
			year: 'numeric',
		}),
	});

	const payload = discord_payload(data);

	await discord_update_profile(int.user.id, payload);

	await int.editReply(`Profile data updated from ${inlineCode(payload.username)}!`);
});

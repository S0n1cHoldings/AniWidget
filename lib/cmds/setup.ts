import { ButtonBuilder, ButtonStyle, Command, ContainerBuilder, MessageFlags, resolveColor } from '@warsam-e/echo';
import type { AniWidget } from '$index.ts';

export default new Command<AniWidget>({
	name: 'setup',
	description: 'Setup the widget',
}).addHandler('chat_input', async (bot, int) => {
	if (!bot.is_whitelisted(int.user)) return int.reply({ content: `Sorry ${int.user}, but this ain't for you...` });
	await int.deferReply({ flags: [MessageFlags.Ephemeral] });

	const container = new ContainerBuilder()
		.addSectionComponents((s) => {
			s.addTextDisplayComponents((t) =>
				t.setContent(['## AniWidget', 'Click the button below to setup the Widget connection.'].join('\n')),
			);
			const thumbnail = bot.self.avatarURL();
			if (thumbnail) s.setThumbnailAccessory((t) => t.setURL(thumbnail));
			return s;
		})
		.addActionRowComponents((a) =>
			a.setComponents(
				new ButtonBuilder().setLabel('Setup Widget').setStyle(ButtonStyle.Link).setURL(bot.discord_oauth_url),
			),
		)
		.setAccentColor(resolveColor(bot.color));

	return int.editReply({
		flags: [MessageFlags.IsComponentsV2],
		components: [container],
	});
});

import {
	ButtonBuilder,
	ButtonStyle,
	bold,
	Command,
	ContainerBuilder,
	MessageFlags,
	resolveColor,
} from '@warsam-e/echo';
import type { AniWidget } from '$index.ts';

export default new Command<AniWidget>({
	name: 'invite',
	description: 'send bot invite',
}).addHandler('chat_input', (bot, int) => {
	if (!bot.is_whitelisted(int.user)) return int.reply({ content: `Sorry ${int.user}, but this ain't for you...` });
	const container = new ContainerBuilder()
		.addSectionComponents((s) => {
			s.addTextDisplayComponents((t) =>
				t.setContent(
					[`## ${bot.name}`, `Click the link below to add ${bold(bot.name)} to your account.`].join('\n'),
				),
			);
			const thumbnail = bot.self.avatarURL();
			if (thumbnail) s.setThumbnailAccessory((t) => t.setURL(thumbnail));

			return s;
		})
		.addActionRowComponents((a) =>
			a.setComponents(new ButtonBuilder().setLabel('Add App').setStyle(ButtonStyle.Link).setURL(bot.invite)),
		)
		.setAccentColor(resolveColor(bot.color));

	return int.reply({
		flags: [MessageFlags.IsComponentsV2],
		components: [container],
	});
});

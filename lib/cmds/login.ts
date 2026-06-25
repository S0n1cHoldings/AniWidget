import { Command, inlineCode, MessageFlags, ModalBuilder, TextInputStyle } from '@warsam-e/echo';
import { _db_anilist_auth_set } from '$anilist/db.ts';
import { anilist_login_url, anilist_profile } from '$anilist/index.ts';
import type { AniWidget } from '$index.ts';

export default new Command<AniWidget>({
	name: 'login',
	description: 'login to anilist',
})
	.addHandler('modal_submit', async (_bot, int) => {
		await int.deferReply({ flags: [MessageFlags.Ephemeral] });
		const token = int.fields.getTextInputValue('token');
		if (!looksLikeJwt(token)) return int.editReply('Thats not a valid token buddy');

		await _db_anilist_auth_set(int.user.id, token);

		const profile = await anilist_profile(int.user.id);

		return int.editReply(`authenticated to ${inlineCode(profile.name)}.`);
	})
	.addHandler('chat_input', async (_bot, int) => {
		await int.showModal(
			new ModalBuilder()
				.setCustomId('login-modal')
				.setTitle('Login')
				.addTextDisplayComponents((t) =>
					t.setContent(
						[
							`the way we're gonna do this is basically, you'll [open this link](${anilist_login_url()}), which will take you to AniList to authenticate, and then it will redirect to AniList's other page that contains the access token itself. Paste that access token in the field below and submit.`,
						].join('\n'),
					),
				)
				.addLabelComponents((l) =>
					l
						.setLabel('Token')
						.setTextInputComponent((t) =>
							t.setCustomId('token').setStyle(TextInputStyle.Paragraph).setRequired(true),
						),
				),
		);
	});

function looksLikeJwt(value: string): boolean {
	const parts = value.split('.');
	if (parts.length !== 3) return false;

	if (!parts.every((part) => part && /^[A-Za-z0-9_-]+$/.test(part))) return false;

	try {
		JSON.parse(Buffer.from(parts[0], 'base64url').toString('utf8'));
		JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'));
		return true;
	} catch {
		return false;
	}
}

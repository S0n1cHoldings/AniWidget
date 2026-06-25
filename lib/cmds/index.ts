import { ApplicationIntegrationType, InteractionContextType } from '@warsam-e/echo';
import invite from './invite.ts';
import login from './login.ts';
import setup from './setup.ts';
import unlink from './unlink.ts';
import update from './update.ts';

export default [invite, login, setup, unlink, update].map((c) => {
	c.contexts = [InteractionContextType.BotDM, InteractionContextType.PrivateChannel, InteractionContextType.Guild];
	c.integration_types = [ApplicationIntegrationType.UserInstall, ApplicationIntegrationType.GuildInstall];
	return c;
});

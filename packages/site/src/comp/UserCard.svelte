<script lang="ts">
	import type { AniWidgetUser } from "@aniwidget/core";
	import { glyphs } from "../assets";

	interface Props {
		user: AniWidgetUser;
	}

	const { user }: Props = $props();

	const pfp = $derived(user.avatar);
	const display_name = $derived(user.display_name);
	const username = $derived(user.username);
</script>

<div class="card">
	<div class="card-inner">
		<img src={pfp} alt="" class="size-20 rounded-full line" />
		<div class="flex items-center gap-1">
			<span class="font-semibold">{display_name}</span>
			<span class="text-sm opacity-50">@{username}</span>
		</div>

		<img src={glyphs.discord} alt="" class="glyph" />
	</div>
</div>

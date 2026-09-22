<script lang="ts">
	import type { AniWidgetUser } from "@aniwidget/core";
	import { cn } from "cn";
	import { glyphs } from "../assets";

	interface Props {
		user: AniWidgetUser;
	}

	const { user }: Props = $props();

	const anilist = $derived(user.anilist);

	const login = () => (location.href = "/api/auth/anilist");
</script>

<button
	type="button"
	class={cn`${anilist ? "card" : "card-placeholder"}`}
	onclick={login}
>
	{#if anilist}
		<div class="card-inner">
			<img src={anilist.pfp} alt="" class="size-20" />
			<div class="flex items-center gap-1">
				<span class="font-semibold">{anilist.username}</span>
			</div>
			<img src={glyphs.anilist} alt="" class="glyph" />
		</div>
	{:else}
		<div class="card-inner-placeholder">
			<div class="font-bold">AniList not Linked</div>
			<div class="text-sm text-center">
				Click here to link your profile!
			</div>
		</div>

		<div class="card-footer">
			<img src={glyphs.anilist} alt="" class="glyph" />
		</div>
	{/if}
</button>

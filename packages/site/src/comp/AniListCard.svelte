<script lang="ts">
	import type { AniWidgetUser } from "@aniwidget/core";
	import { glyphs } from "../assets";
	import { goto } from "$app/navigation";
	import cn from "cnfast";

	interface Props {
		user: AniWidgetUser;
	}

	const { user }: Props = $props();

	const anilist = $derived(user.anilist);

	const login = () => goto("/api/auth/anilist");
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class={cn`${anilist ? "card" : "card-placeholder"}`} onclick={login}>
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
</div>

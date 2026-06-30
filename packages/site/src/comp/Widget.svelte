<script lang="ts">
	import type { AniWidgetUser } from "@aniwidget/core";
	import cn from "cnfast";
	import AniWidget from "./AniWidget.svelte";
	import { aniwidget_set, aniwidget_update } from "$lib/aniwidget";

	interface Props {
		user: AniWidgetUser;
	}

	const { user }: Props = $props();

	const widget = $derived(user.widget);

	const set = () => aniwidget_set();
	const update = () => aniwidget_update();
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
{#if user.anilist}
	<AniWidget data={widget ?? user.anilist} />
	{#if widget}
		<div
			class={cn([
				// blah
				"mt-4 card rounded-xl",
				"bg-green-300/10 shadow-none border border-green-300/50",
				"text-xs",
				"text-green-300",
				"grid grid-cols-[2fr_1fr] items-center",
			])}
		>
			<div class="flex items-center gap-2">
				<span class="live"></span>
				<span
					><b>The stats are live on Discord!</b>
					<i>Add to widgets list if you haven't yet.</i></span
				>
			</div>
			<div class="flex justify-end w-full">
				<div class="btn bg-green-300 text-black/60" onclick={update}>
					Update Stats
				</div>
			</div>
		</div>
	{:else}
		<div class="mt-4 card rounded-xl">
			<div class="font-semibold">You're almost done!</div>
			<div class="text-xs">
				Just press the button below now to add these stats to Discord
				for the first time.
			</div>

			<div class="btn inline-block float-right mt-5" onclick={update}>
				Set Stats
			</div>
		</div>
	{/if}
{/if}

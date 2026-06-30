<script lang="ts">
	import type { DiscordWidgetData } from "@aniwidget/core";
	import { glyphs } from "../assets";
	import cn from "cnfast";

	interface Props {
		data: DiscordWidgetData;
	}

	const { data }: Props = $props();

	const stats = $derived([
		{
			label: "Total Anime",
			value: data.stats.total_anime.toLocaleString(),
		},
		{ label: "Days Watched", value: data.stats.days_watched },
		{
			label: "Anime Mean Score",
			value: data.stats.anime_mean_score,
		},
		{ label: "Total Manga", value: data.stats.total_manga },
		{
			label: "Chapters Read",
			value: data.stats.chapters_read,
		},
		{
			label: "Manga Mean Score",
			value: data.stats.manga_mean_score,
		},
	]);
</script>

<div class="mt-8 card bg-white/2 line-light rounded-xl p-0">
	<div class="flex items-center gap-1 absolute top-0 left-0 p-3">
		<img src={glyphs.aniwidget} alt="" class="size-4 rounded" />
		<span class="text-xs font-bold">AniWidget</span>
	</div>
	<div class="border-b border-b-white/5 relative p-3">
		<img
			src={data.pfp}
			alt=""
			class={cn([
				"absolute right-0 bottom-0",
				"h-33",
				"w-45",
				"object-top",
				"object-cover",
			])}
		/>
		<div class="flex flex-col justify-center gap-2 h-20 mt-5">
			<div class="font-semibold">{data.username}</div>
			<div class="text-sm">Joined on: {data.joined_on}</div>
		</div>
	</div>
	<div class="grid grid-cols-3 p-3 gap-6">
		{#each stats as stat, i}
			<div>
				<div class="flex flex-col gap-1">
					<span class="text-xs font-bold">{stat.value}</span>
					<span class="text-xs opacity-80">{stat.label}</span>
				</div>
			</div>
		{/each}
	</div>
</div>

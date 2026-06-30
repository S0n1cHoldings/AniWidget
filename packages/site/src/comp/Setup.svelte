<script lang="ts">
	import cn from "cnfast";
	import logo from "../assets/aniwidget.png?url";
	import { goto } from "$app/navigation";

	const login = () => goto("/api/auth/discord");
</script>

<div
	class={cn([
		"absolute top-0 left-0 right-0 bottom-0",
		"flex items-center justify-center",
	])}
>
	<div class="flex flex-col items-center">
		<img
			src={logo}
			alt=""
			class="size-30 border border-white/5 rounded-4xl"
		/>
		<div class="text-2xl mt-8">AniWidget</div>
		<div class="text-sm mt-4">
			Beautifully display your AniList stats, on Discord.
		</div>
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class={cn([
				// blah
				"mt-8",
				"btn",
			])}
			onclick={login}
		>
			Get Started
		</div>
	</div>
</div>

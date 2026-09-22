<script lang="ts">
	import { fade } from "svelte/transition";
	import { aniwidget_init } from "$lib/aniwidget";
	import { mounted, user_token } from "$lib/stores";
	import "./layout.css";
	import "framework7-icons/css/framework7-icons.css";
	import { glyphs } from "../assets";

	let { children } = $props();

	$effect(() => {
		aniwidget_init($user_token);
	});
</script>

<svelte:head>
	<link rel="icon" href={glyphs.aniwidget} />
	<title>AniWidget</title>
</svelte:head>

{#if $mounted}
	<main in:fade={{ duration: 200 }} class="max-w-130 mx-auto py-8 px-4">
		{@render children()}
	</main>
{/if}

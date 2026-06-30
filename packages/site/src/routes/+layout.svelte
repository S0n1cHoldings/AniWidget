<script lang="ts">
	import { aniwidget_init } from "$lib/aniwidget";
	import { mounted, user_token } from "$lib/stores";
	import { fade } from "svelte/transition";
	import "./layout.css";
	import "framework7-icons/css/framework7-icons.css";

	let { children } = $props();

	$effect(() => {
		aniwidget_init($user_token);
	});
</script>

{#if $mounted}
	<main in:fade={{ duration: 200 }} class="max-w-130 mx-auto py-8 px-4">
		{@render children()}
	</main>
{/if}

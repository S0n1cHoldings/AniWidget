<script lang="ts">
	import Cards from "$comp/Cards.svelte";
	import Nav from "$comp/Nav.svelte";
	import Setup from "$comp/Setup.svelte";
	import Widget from "$comp/Widget.svelte";
	import { user } from "$lib/stores";
</script>

{#if $user}
	<div class="flex flex-col gap-4">
		<Nav />
		<Cards user={$user} />
		<Widget user={$user} />
	</div>
{:else}
	<Setup />
{/if}

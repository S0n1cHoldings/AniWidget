<script lang="ts">
	import Cards from "$comp/Cards.svelte";
	import Nav from "$comp/Nav.svelte";
	import Setup from "$comp/Setup.svelte";
	import Widget from "$comp/Widget.svelte";
	import { user as _user } from "$lib/stores";

	const user = $derived($_user);
</script>

{#if user}
	<div class="flex flex-col gap-4">
		<Nav />
		<Cards {user} />
		<Widget {user} />
	</div>
{:else}
	<Setup />
{/if}

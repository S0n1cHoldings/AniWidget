<script lang="ts">
	import { onMount } from "svelte";
	import { goto } from "$app/navigation";
	import { page } from "$app/state";
	import { user_token } from "$lib/stores";

	onMount(async () => {
		if (!page.url.hash.length) return goto("/", { replaceState: true });
		const search = new URLSearchParams(page.url.hash.slice(1));
		const token = search.get("token");
		if (!token) return goto("/", { replaceState: true });
		$user_token = token;
		return goto("/", { replaceState: true });
	});
</script>

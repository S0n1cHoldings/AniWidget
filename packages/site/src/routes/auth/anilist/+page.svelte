<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/state";
	import { aniwidget_anilist_auth } from "$lib/aniwidget";
	import { api } from "$lib/api";
	import { user } from "$lib/stores";
	import { onMount } from "svelte";

	onMount(async () => {
		if (!page.url.hash.length) return goto("/", { replaceState: true });
		if (!$user) return goto("/", { replaceState: true });
		const search = new URLSearchParams(page.url.hash.slice(1));
		const token = search.get("token");
		if (!token) return goto("/", { replaceState: true });
		await aniwidget_anilist_auth(token);
		return goto("/", { replaceState: true });
	});
</script>

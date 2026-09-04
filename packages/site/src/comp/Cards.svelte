<script lang="ts">
	import type { AniWidgetUser } from "@aniwidget/core";
	import AniListCard from "./AniListCard.svelte";
	import UserCard from "./UserCard.svelte";

	interface Props {
		user: AniWidgetUser;
	}

	const { user }: Props = $props();
</script>

<div class="grid grid-cols-2 gap-4">
	<UserCard {user} />
	<AniListCard {user} />
</div>

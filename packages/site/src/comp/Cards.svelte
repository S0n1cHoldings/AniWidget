<script lang="ts">
	import type { AniWidgetUser } from "@aniwidget/core";

	import UserCard from "./UserCard.svelte";
	import AniListCard from "./AniListCard.svelte";

	interface Props {
		user: AniWidgetUser;
	}

	const { user }: Props = $props();
</script>

<div class="grid grid-cols-2 gap-4">
	<UserCard {user} />
	<AniListCard {user} />
</div>

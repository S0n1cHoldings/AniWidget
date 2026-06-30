<script lang="ts">
	import { user_token } from "$lib/stores";
	import { glyphs } from "../assets";

	const logout = () => user_token.set(null);
</script>

<nav class="flex items-center justify-between">
	<img src={glyphs.aniwidget} alt="" class="size-15" />
	<div>
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<i class="f7-icons text-red-400 link" onclick={logout}
			>arrow_right_to_line_alt</i
		>
	</div>
</nav>

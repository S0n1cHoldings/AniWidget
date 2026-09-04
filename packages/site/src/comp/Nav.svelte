<script lang="ts">
	import { user_token } from "$lib/stores";
	import { glyphs } from "../assets";

	const logout = () => user_token.set(null);
</script>

<nav class="flex items-center justify-between">
	<img src={glyphs.aniwidget} alt="" class="size-15" />
	<div>
		<button type="button" onclick={logout}>
			<i class="f7-icons text-red-400 link">arrow_right_to_line_alt</i>
		</button>
	</div>
</nav>

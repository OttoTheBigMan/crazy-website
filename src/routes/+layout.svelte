<script lang="ts">
	import '../app.postcss';
	import '@fortawesome/fontawesome-free/css/all.css';
	// Floating UI for Popups
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { AppBar, AppShell, storePopup } from '@skeletonlabs/skeleton';
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });
</script>

<AppShell>
	<svelte:fragment slot="header">
		
		<AppBar gridColumns="grid-cols-3" slotDefault="place-self-center" slotTrail="place-content-end">
			<svelte:fragment slot="lead"><a href="/"><i class="fa-solid fa-house fa-2x"></i></a></svelte:fragment>
			
			<svelte:fragment slot="trail">
				<a href="/profile"><i class="fa-solid fa-user fa-2x"></i></a>
			</svelte:fragment>
		</AppBar>

	</svelte:fragment>
	
	<slot />
</AppShell>
<!-- <slot /> -->
<script lang="ts">
	import '../app.postcss';
	import '@fortawesome/fontawesome-free/css/all.css';
	// Floating UI for Popups
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { AppBar, AppShell, storePopup, type PopupSettings, popup } from '@skeletonlabs/skeleton';
    import type { LayoutData } from './$types';
    import { enhance } from '$app/forms';
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

	const popupClick: PopupSettings = {
		event: 'click',
		target: 'popupClick',
		placement: 'bottom'
	};

	export let data : LayoutData;
</script>

<!-- <AppShell>
	<svelte:fragment slot="header">
		
		<AppBar gridColumns="grid-cols-3" slotDefault="place-self-center" slotTrail="place-content-end">
			<svelte:fragment slot="lead"><a href="/"><i class="fa-solid fa-house fa-2x"></i></a></svelte:fragment>
			
			<svelte:fragment slot="trail">
				<a href="/profile"><i class="fa-solid fa-user fa-2x"></i></a>
			</svelte:fragment>
		</AppBar>

	</svelte:fragment>
	
	<slot />
</AppShell> -->

<button class="btn-icon variant-ghost-primary absolute right-5 top-5" use:popup={popupClick}><i class="fa-solid fa-user"></i></button>
<div class="card p-4 variant-filled-primary" data-popup="popupClick">
	<div class="flex-col flex gap-4">
		{#if data.userExists}
			<form action="/login?/logout" use:enhance method="post"><button class="btn variant-filled-secondary">Log Out</button></form>
			<a href="/profile" class="btn variant-filled-secondary">View Profile</a>
			{:else}
			<a href="/login" class="btn variant-filled-secondary">Log In</a>
		{/if}
	</div>
	<div class="arrow variant-filled-primary" />
</div>
<slot />
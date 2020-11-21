import Widget from "./Widget.svelte";

HomePortal.registerWidget({
	name: "svelte-demo",
	mount: el => {
		new Widget({
			target: el,
			props: {
				name: "Svelte"
			}
		});

		return el;
	}
});

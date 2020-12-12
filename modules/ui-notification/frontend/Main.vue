<template>
	<div id="notifications">
		<div v-if="activeItem" class="notification-container">
			<message v-if="activeItem.type == 'message'" :item="activeItem" @close="closePressed" @button="buttonPressed" />
		</div>
	</div>
</template>

<script>
const gsap = HomePortal.dependencies.gsap;

import Message from "./components/Message";

export default {
	name: "NotificationMain",
	components: {
		Message
	},

	data() {
		return {
			list: null,
			activeItem: null,
			expireTimer: null,
		}
	},

	events: {
		async "home-portal.frontend.ready"(ctx) {
			const list = await ctx.call("notifications.list");
			this.list = list;
		},

		"notification.added"(ctx) {
			if (this.list == null) return; // not initialized yet

			const item = ctx.params.item;
			const found = this.list.find(t => t.id == item.id);
			if (!found)
				this.list.push(item);

			this.findActiveItem();
		},

		"notification.removed"(ctx) {
			if (this.list == null) return; // not initialized yet

			this.removeItem(ctx.params.item.id)
			this.findActiveItem();
		}
	},

	methods: {
		async findActiveItem() {
			let newItem;
			if (this.list && this.list.length > 0) {
				newItem = this.list[0];
			} else {
				newItem = null;
			}

			const different = newItem != this.activeItem

			if (this.activeItem && different) {
				await new Promise(resolve => {
					gsap.to(
						this.$el.querySelectorAll(".notification-container"),
						{
							opacity: 0,
							duration: 0.5,
							ease: "power4.out",
							onComplete: resolve
						}
					);
					gsap.to(
						this.$el.querySelectorAll(".notification-message"),
						{
							scale: 0,
							duration: 0.5,
							ease: "power4.out",
							onComplete: resolve
						}
					);
				});
			}

			this.activeItem = newItem;
			if (newItem && different) {
				if (this.expireTimer) {
					clearTimeout(this.expireTimer);
				}
				this.$nextTick(() => {
					gsap.fromTo(
						this.$el.querySelectorAll(".notification-container"),
						{ opacity: 0 },
						{
							opacity: 1,
							duration: 1,
							ease: "elastic.out(1, 0.5)",
						}
					);
					gsap.fromTo(
						this.$el.querySelectorAll(".notification-message"),
						{ scale: 0 },
						{
							scale: 1,
							duration: 1,
							ease: "elastic.out(1, 0.5)",
						}
					);
				});

				if (newItem.time > 0) {
					this.expireTimer = setTimeout(() => {
						this.expireTimer = null;
						if (newItem == this.activeItem) {
							this.removeActiveItem();
						}
					}, newItem.time * 1000);
				}
			}
		},

		removeItem(id) {
			const found = this.list.findIndex(t => t.id == id);
			if (found !== -1)
				this.list.splice(found, 1);
		},

		removeActiveItem() {
			if (this.activeItem) {
				if (this.expireTimer) {
					clearTimeout(this.expireTimer);
					this.expireTimer = null;
				}

				this.removeItem(this.activeItem.id)
			}

			this.findActiveItem();
		},

		closePressed() {
			this.removeActiveItem();
		},

		buttonPressed(btn) {
			console.log("Button pressed", btn);
			this.removeActiveItem();
		}
	}
};
</script>

<style lang="scss" scoped>
.notification-container {
	position: absolute;
	left: 0;
	top: 0;
	right: 0;
	bottom: 0;
	width: 100%;
	height: 100%;
	background: rgba(black, 0.5);

	display: flex;
	justify-content: center;
	align-items: center;
}

</style>

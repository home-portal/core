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
			this.findActiveItem();
		},

		"notification.added"(ctx) {
			if (this.list == null) return;
			const item = ctx.params.item;
			const found = this.list.find(t => t._id == item._id);
			if (!found) this.list.push(item);
			this.findActiveItem();
		},

		"notification.removed"(ctx) {
			if (this.list == null) return;
			this.removeItem(ctx.params.item._id);
			this.findActiveItem();
		},

		"notification.confirmed"(ctx) {
			if (this.list == null) return;
			this.removeItem(ctx.params.item._id);
			this.findActiveItem();
		}
	},

	async mounted() {
		// If frontend is already ready, load notifications immediately
		if (window.HomePortal && window.HomePortal.ready) {
			const broker = this.$root.broker || window.broker;
			if (broker) {
				this.list = await broker.call("notifications.list");
				this.findActiveItem();
			}
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
					this.expireTimer = null;
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

				if (!newItem.persistent && newItem.time > 0) {
					this.expireTimer = setTimeout(() => {
						this.expireTimer = null;
						if (newItem == this.activeItem) {
							this.confirmAndRemoveActiveItem();
						}
					}, newItem.time * 1000);
				}
			}
		},

		removeItem(id) {
			const found = this.list.findIndex(t => t._id == id);
			if (found !== -1)
				this.list.splice(found, 1);
		},

		async confirmAndRemoveActiveItem() {
			if (this.activeItem) {
				if (this.expireTimer) {
					clearTimeout(this.expireTimer);
					this.expireTimer = null;
				}

				const id = this.activeItem._id;
				this.removeItem(id);
				try {
					await this.$root.broker.call("notifications.confirm", { id });
				} catch(e) {
					console.warn("notifications.confirm failed", e);
				}
			}

			this.findActiveItem();
		},

		closePressed() {
			this.confirmAndRemoveActiveItem();
		},

		buttonPressed(btn) {
			console.log("Button pressed", btn);
			this.confirmAndRemoveActiveItem();
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

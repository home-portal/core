<template>
	<div :class="'notification-message severity-' + item.severity">
		<div class="section">
			<div class="icon">
				<i :class="severityIcon"></i>
			</div>
			<div class="content">
				<div class="title">{{ item.title }}</div>
				<div v-if="item.description" class="description">{{ item.description }}</div>
			</div>
			<div v-if="item.closeable" class="close" @click="$emit('close')">
				<i class="fas fa-times"></i>
			</div>
		</div>
		<div class="actions" :class="{ single: buttons.length == 1 }">
			<div
				v-for="btn in buttons"
				:key="btn.id"
				class="button"
				:class="{ outlined: btn.outlined }"
				@click="$emit('button', btn)"
			>
				{{ btn.caption }}
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "NotificationMessage",

	props: {
		item: Object
	},

	computed: {
		severityIcon() {
			switch (this.item.severity) {
				case "error":
					return "fas fa-times-circle";
				case "warning":
					return "fas fa-exclamation-circle";
				case "success":
					return "fas fa-check-circle";
			}

			return "fas fa-info-circle";
		},

		buttons() {
			if (Array.isArray(this.item.buttons) && this.item.buttons.length > 0)
				return Array.from(this.item.buttons).reverse();

			return [{ id: "ok", caption: "OK" }];
		}
	}
};
</script>

<style lang="scss" scoped>
.notification-message {
	$c: #007bc2;

	max-width: 80%;
	background: white;
	border-radius: 0.33em;
	box-shadow: 0 0 20px rgba(black, 0.8);
	color: black;
	font-size: 1.5rem;
	padding: 0.5em;
	border: 0.25em solid $c;

	.section {
		display: flex;
		//align-items: center;

		.icon {
			margin-top: -0.2em;
			margin-right: 0.5em;
			font-size: 1.5em;
			color: $c;
		}

		.content {
			flex: 1;
			.title {
				font-weight: bold;
			}

			.description {
				color: #888;
				font-weight: normal;
				font-size: 0.8em;
				text-align: justify;
			}
		}

		.close {
			margin: 0;
			margin-left: 1em;
			color: #888;
		}
	}

	.actions {
		display: flex;
		justify-content: flex-end;
		font-size: 0.8em;
		margin-top: 1em;

		&.single {
			justify-content: center;
		}

		.button {
			user-select: none;
			min-width: 5em;
			margin: 0 0.5em;
			padding: 0.5em 1em;
			cursor: pointer;
			background-color: $c;
			color: white;
			font-weight: normal;
			text-align: center;
			border-radius: 0.5em;

			transition: background-color 0.2s;

			&:hover {
				background-color: darken($c, 10%);
			}

			&:active {
				box-shadow: none;
				transform: translate(2px, 2px);
			}

			&.outlined {
				background-color: transparent;
				border: 2px solid $c;
				color: $c;

				&:hover {
					background-color: lighten($c, 50%);
				}
			}
		}
	}

	&.severity-error {
		$c: #b40707;
		border-color: $c;

		.section .icon {
			color: $c;
		}

		.actions .button {
			background-color: $c;

			&:hover {
				background-color: darken($c, 10%);
			}

			&.outlined {
				background-color: transparent;
				border: 2px solid $c;
				color: $c;

				&:hover {
					background-color: lighten($c, 50%);
				}
			}
		}
	}

	&.severity-success {
		$c: #02a034;
		border-color: $c;

		.section .icon {
			color: $c;
		}

		.actions .button {
			background-color: $c;

			&:hover {
				background-color: darken($c, 10%);
			}

			&.outlined {
				background-color: transparent;
				border: 2px solid $c;
				color: $c;

				&:hover {
					background-color: lighten($c, 50%);
				}
			}
		}
	}

	&.severity-warning {
		$c: #da9b13;
		border-color: $c;

		.section .icon {
			color: $c;
		}

		.actions .button {
			background-color: $c;

			&:hover {
				background-color: darken($c, 10%);
			}

			&.outlined {
				background-color: transparent;
				border: 2px solid $c;
				color: $c;

				&:hover {
					background-color: lighten($c, 50%);
				}
			}
		}
	}
}
</style>

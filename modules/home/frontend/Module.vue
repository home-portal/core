<template>
	<div class="page">
		<div class="overlay"></div>
		<div class="page-title">
			Home Portal
		</div>
		<div class="page-content">
			<div class="header">
				<div class="functions">
					<div class="btn-today">
						<i class="fa fa-play"></i>
					</div>
					<div class="btn-settings">
						<i class="fa fa-cog"></i>
					</div>
				</div>
			</div>

			<div class="panel toolbar">
				<div class="item">
					<i class="fa fa-cloud-sun"></i>
					<div class="title"></div>
				</div>
				<div class="item">
					<i class="fa fa-calendar-alt"></i>
					<div class="title"></div>
				</div>
				<div class="item">
					<i class="fa fa-globe-americas"></i>
					<div class="title"></div>
				</div>
				<div class="item">
					<i class="fa fa-tasks"></i>
					<div class="title"></div>
				</div>
				<div class="item">
					<i class="fa fa-video"></i>
					<div class="title"></div>
				</div>
				<div class="item">
					<i class="fa fa-newspaper"></i>
					<div class="title"></div>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.page {
	background-image: url("./images/background.jpg");
}

.header {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	width: 100%;

	display: flex;
	justify-content: flex-end;

	.functions {
		padding: 0.3em;
		display: flex;

		> div {
			margin: 0 0.75rem;
			font-size: 2.0em;
			cursor: pointer;
			color: var(--primary);

			opacity: 0.3;
			transition: opacity 0.2s linear;

			&:hover {
				opacity: 0.8;
			}
		}
	}
}

.toolbar {
	position: absolute;
	width: 100%;
	bottom: 0;
	padding: 2% 0;

	display: flex;

	.item {
		flex: 1;
		font-size: 2.5em;
		text-align: center;
		cursor: pointer;

		i {
			border: 0.15em solid var(--bg1);
			border-radius: 50%;
			width: 2.0em;
			height: 2.0em;
			line-height: 1.7em;

			color: white;
			transition: background-color 0.2s linear;
		}

		.title {
			font-size: 1rem;
			text-align: center;
			text-transform: uppercase;
			display: none;
		}

		&:hover {
			i {
				background-color: var(--bg1);
			}
		}
	}
}
</style>

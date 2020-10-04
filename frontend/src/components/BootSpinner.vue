<template>
	<div class="loader">
		<div class="inner one"></div>
		<div class="inner two"></div>
		<div class="inner three"></div>
	</div>
</template>

<style lang="scss" scoped>

.loader {
	$size: 4em;
	$time: 1.5s;

	width: $size;
	height: $size;
	margin: 0 auto;
	perspective: 800px;

	.inner {
		position: absolute;
		box-sizing: border-box;
		width: 100%;
		height: 100%;
		border-radius: 50%;
	}

	.inner.one {
		left: 0%;
		top: 0%;
		animation: rotate-one $time linear infinite;
		border-bottom: 3px solid #efeffa;
	}

	.inner.two {
		right: 0%;
		top: 0%;
		animation: rotate-two $time linear infinite;
		border-right: 3px solid #efeffa;
	}

	.inner.three {
		right: 0%;
		bottom: 0%;
		animation: rotate-three $time linear infinite;
		border-top: 3px solid #efeffa;
	}
}


@keyframes rotate-one {
  0% {
    transform: rotateX(35deg) rotateY(-45deg) rotateZ(0deg);
  }
  100% {
    transform: rotateX(35deg) rotateY(-45deg) rotateZ(360deg);
  }
}

@keyframes rotate-two {
  0% {
    transform: rotateX(50deg) rotateY(10deg) rotateZ(0deg);
  }
  100% {
    transform: rotateX(50deg) rotateY(10deg) rotateZ(360deg);
  }
}

@keyframes rotate-three {
  0% {
    transform: rotateX(35deg) rotateY(55deg) rotateZ(0deg);
  }
  100% {
    transform: rotateX(35deg) rotateY(55deg) rotateZ(360deg);
  }
}
</style>

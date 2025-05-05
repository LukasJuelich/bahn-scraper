<!-- <script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <HelloWorld msg="Vite + Vue" />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style> -->

<template>
	<div class="bg-white sm:mx-5 md:mx-16 lg:mx-32 xl:mx-40 2xl:mx-52 shadow-2xl">
		<div class="bg-white sm:h-10" />
		<nav 
			class="text-center sm:py-5 py-2 shadow-lg" 
			style="background:#FF0000"
			>
			<ul>
				<li>
					<router-link 
						to="/" 
						class="text-white text-3xl filter drop-shadow-lg">
							Bahn Stats
					</router-link>
				</li>
			</ul>
		</nav>
		<div>
			<router-view class="p-5"/>
		</div>
	</div>
</template>

<script lang="ts">
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
</style>

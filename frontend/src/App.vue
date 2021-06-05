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
import { Options, Vue } from 'vue-class-component';

@Options({
  components: {
  },
})
export default class App extends Vue {}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
</style>

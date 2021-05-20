<template>
	<div class="bg-white w-auto shadow-2xl">
		<div class="bg-white h-10" />
		<nav 
			class="text-left p-5 mb-5 shadow-lg" 
			style="background:#FF0000"
			>
			<ul>
				<li>
					<router-link 
						to="/records" 
						class="text-white text-3xl filter drop-shadow-lg">
							Bahn Stats
					</router-link>
				</li>
			</ul>
		</nav>
		<div class="container h-screen">
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

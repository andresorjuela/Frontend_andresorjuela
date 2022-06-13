<template lang="pug">
b-container#app(fluid).p-0
  .text-center
    b-link(href="https://www.andresorjuela.com") Andres Orjuela Website
    p.m-0.small.text-center -*-  
    b-link(href="https://www.andresorjuela.com" target="_blank")
      b-img(src="./assets/AndresOrjuela.jpg" height="300px" style="max-height: 300px;")

  router-view

</template>

<script>
import baseMix from '@/mixins/base'
export default {
  name: 'PublicLayout',
  components: {},
  mixins: [
    baseMix
  ],
}
</script>

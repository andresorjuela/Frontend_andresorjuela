<template lang="pug">
b-container#app(fluid).p-0
  .text-center
    b-link(href="https://www.apigrate.com") My App
    p.m-0.small.text-center by  
    b-link(href="https://www.apigrate.com" target="_blank")
      b-img(src="https://apigrate-static-content.s3.us-west-2.amazonaws.com/brand/apigrate-rect-logo-bitter-transp.png" height="40px" style="max-height: 40px;")

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

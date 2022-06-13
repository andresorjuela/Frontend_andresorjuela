<template lang="pug">
Base(title="About")
  //- b-alert(variant="info") About this app...
  b-container(style="max-width: 800px;")
    .text-center.mt-4
    h4(style="color: #3abcd9;") Heading Example
    .text-dark.p-2
    p Hello World
</template>
<script>
import Base from '@/components/Base.vue';

export default {
  name: 'About',

  mixins: [],

  components: {
    Base,
  },

  props: {},

  data(){
    return {};
  },

  computed: {
    //...mapGetters(['something','else']),
  },

  created(){
  },

  methods: {
    // ...mapActions(['loadSomething','createSomething','updateSomething','deleteSomething']),
  },
};
</script>
<style>
</style>
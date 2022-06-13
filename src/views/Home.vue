<template lang="pug">
Base(title="Home")
  //- b-alert(variant="info") About this app...
  b-container(style="max-width: 800px;")
    .text-center.mt-4
    h4(style="color: #3abcd9;") Heading Example
    .text-dark.p-2
    p You are Home
</template>
<script>
import Base from '@/components/Base.vue';
import { callApi } from '../lib/api';

export default {
  name: 'Home',

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

  async created(){
    try {
      let response=await callApi(null, {
        url:'/api/v1/accounts/1', method:'get'
      });
      console.log(response)
    } catch (error) {
      console.error(error)
    }
  },

  methods: {
    // ...mapActions(['loadSomething','createSomething','updateSomething','deleteSomething']),
  },
};
</script>
<style>
</style>
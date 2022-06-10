<template lang="pug">
  Base(title="About")
    b-alert(variant="info") About this app...
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
    //...mapActions(['loadSomething','createSomething','updateSomething','deleteSomething']),
  },
};
</script>
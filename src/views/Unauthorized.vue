<template lang="pug">
  Base(title="Not Authorized")
    b-alert(variant="warning") Not authorized.
</template>
<script>
import Base from '@/components/Base.vue'

export default {
  name: 'Unauthorized',

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
}
</script>
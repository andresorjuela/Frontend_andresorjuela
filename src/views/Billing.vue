<template lang="pug">
  Base(title="Billing Info")
    
</template>
<script>
import Base from '@/components/Base.vue'
import baseMix from '@/mixins/base'
import {mapGetters, mapActions} from 'vuex'

export default {
  name: 'Billing',

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
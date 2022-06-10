<template lang="pug">
  Base(view_title="Admin Home")
    p From here you can:
    b-list-group
      b-list-group-item Do this.
      b-list-group-item Do that.

</template>

<script>
import Base from '@/components/Base.vue'

export default {
  name: 'AdminHome',

  mixins: [],
  
  components: {
    Base,
  },
  
  props: {},

  data(){
    return {};
  },

  created(){},

  methods: {},
}
</script>

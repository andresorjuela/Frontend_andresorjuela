<template lang="pug">
b-container#app(fluid).p-0
  b-overlay(:show="has_global_error")
    template( #overlay )
      div.text-center.text-danger
        b-icon-exclamation-triangle
        p {{global_error}}
    router-view
</template>

<script>
import {BIcon, BIconPersonFill} from 'bootstrap-vue';
import authMixin from './mixins/auth'
import { mapGetters } from 'vuex'
export default {
  components: {
    BIcon,
    BIconPersonFill,
  },

  mixins: [
    authMixin
  ],

  computed: {
    ...mapGetters(['message','error','errors','busy','global_error','has_error','has_global_error','has_message','user','is_client','is_admin']),
  },

  created(){
    if(!this.$router.currentRoute.name){
      //Empty routes default to home
      this.$router.push({name:"Home"});
    } else if(this.$root.open_routes.includes(this.$router.currentRoute.name)){
      //Open routes don't require login. Don't redirect. 
    }
    
  },
}
</script>

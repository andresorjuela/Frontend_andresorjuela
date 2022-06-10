<template lang="pug">
  b-container(fluid)
    b-card
      .row
        .col.h5 {{title}}
        .col.text-center(v-if="has_error || has_message")
          b-alert.m-0.mb-1.p-0(variant="warning" :show="!busy && has_error" ) {{error}}
          b-alert.m-0.mb-1.p-0(variant="info" dismissable fade :show="!busy && has_message" ) {{message}}
        .col.text-right
          //- b-button.mb-1(size="sm" variant="light" @click="$router.go(-1)")
          //-   b-icon-arrow-left-short
      b-card-text
        b-overlay(:show="busy")
        slot

</template>

<script>
import {mapGetters} from 'vuex';

export default {
  name: 'Base',

  props:{
    title: String,
  },

  data(){
    return {};
  },

  computed: {
    ...mapGetters(['message','error','busy','has_error','has_message',])
  },
};
</script>

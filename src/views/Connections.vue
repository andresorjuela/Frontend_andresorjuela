<template lang="pug">
  Base(view_title="Connections")
    template(v-slot:bottom-center)
      small
        b-icon-check-circle-fill(variant="success" ) 
        span.ml-1 connected
      small.ml-2
        b-icon-x-circle-fill(variant="danger" ) 
        span.ml-1 disconnected 
    b-list-group(v-if="connections")
      ConnectionWidget(:connection="toggl_connection" title="Toggl Track" type="token")
      ConnectionWidget(:connection="qbo_connection" title="QuickBooks Online" type="oauth" :oauth_url_provider="getQuickBooksAuthorizationUrl")

</template>

<script>
import {mapActions, mapGetters} from 'vuex';
import baseMix from '@/mixins/base';
import Base from '@/components/Base.vue';
import ConnectionWidget from '@/components/ConnectionWidget.vue';

export default {
  name: 'Connections',

  mixins: [baseMix],
  
  components: {
    Base,
    ConnectionWidget,
  },
  
  computed: {
    ...mapGetters(["error","jwt","connections"]),

    toggl_connection(){
      if(this.connections) return this.connections.find(c=>c.service==='toggl');
      return {status:"inactive"};
    },

    qbo_connection(){
      if(this.connections) return this.connections.find(c=>c.service==='qbo');
      return {status:"inactive"};
    },

  },

  data(){
    return {
      testing: "",

      qbo_confirming_disconnect: false,
      qbo_testing: false,
    };
  },

  async created(){
    await this.loadConnections(this.subscription_id);
  },

  methods: {
    ...mapActions(["getQuickBooksAuthorizationUrl","loadConnections"]),

    async load(){
      this.loadConnections(this.subscription_id);
    },
  }

}
</script>
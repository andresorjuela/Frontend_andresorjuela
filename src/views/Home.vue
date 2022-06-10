<template lang="pug">
Base(view_title="Dashboard" v-if="subscription")
  .row
    .col
      h5 Status
      div.text-info.h7(v-if="pending") MyApp configuration is incomplete.

      div.text-success.h7(v-else-if="active") MyApp is active.
        
        .p-2.border.bg-light.text-info
          b-form-checkbox( switch variant="info" v-model="settings.auto_sync" value="on" unchecked-value="off" @change="toggleAutoSync") Auto-Sync is {{ settings.auto_sync ? settings.auto_sync.toUpperCase() : "OFF" }}
          
          small(v-if="settings.auto_sync==='on'") 
            span MyApp checks every {{settings.poll_interval_minutes}} minutes for unsynced Toggl entries logged for dates up to {{settings.sync_horizon}} days ago.
          small(v-else) 
            span MyApp is not actively syncing Toggl time entries. You can manually sync entries:
            button.btn.btn-outline-success.ml-2(type="button" @click="syncNow" )
              b-icon-lightning
              span.ml-1 Sync Now

      .text-success.h7(v-if="subscription.status==='suspended'") MyApp is suspended. Please check your billing details.

    .col
      h5 Subscription
      div(v-if="billing_subscription")
        p.text-info.h7(v-if="billing_subscription.status==='trialing'") In the trial period. The period ends on {{ formatDateSeconds(billing_subscription.trial_end) }}.
        p.text-success.h7(v-if="billing_subscription.status==='active'") Active. The current billing period started on {{ formatDateSeconds(billing_subscription.current_period_start) }}. 
        p.text-warning.h7(v-if="billing_subscription.status==='past_due'") Past due. Update your payment method to continue service.
        p.text-warning.h7(v-if="billing_subscription.status==='unpaid'") Unpaid. Update your payment method to continue service.
        p.text-dark.h7(v-if="billing_subscription.status==='canceled'") Canceled on {{ formatDateSeconds(billing_subscription.canceled_at) }}.
      div(v-else)
        p.text-dark.h7 Your subscription was removed after expiration.
  .row
    .col
      h5 News
    .col
      h5 To Do

</template>

<script>
import Base from '@/components/Base.vue'
import baseMix from '@/mixins/base'
import {DateTime} from 'luxon';
import {mapGetters, mapActions} from 'vuex'

export default {
  name: 'Home',

  mixins: [baseMix],
  
  components: {
    Base,
  },
  
  props: {},

  data(){
    return {};
  },

  computed:{
    ...mapGetters(['billing_subscription','connections','settings','subscription',]),
    // db subscription statuses
    active(){ return this.subscription && this.subscription.status==='active'; },
    pending(){ return this.subscription && this.subscription.status==='pending'; },
    suspended(){ return this.subscription && this.subscription.status==='suspended'; },
    // billing statuses
    billing_ok(){ return this.billing_subscripton && ['trialing','active'].includes(this.billing_subscription.status) },
    billing_bad(){ return this.billing_subscripton && !['trialing','active'].includes(this.billing_subscription.status) },
  },

  created(){
    this.validate();//also loads
  },

  methods: {
    ...mapActions(['validate']),
    toggleAutoSync(){

    },
    
    syncNow(){
      this.$router.push({name:"SyncNow"});
    },
    formatDateSeconds(s){
      if(!s) return "";
      return DateTime.fromSeconds(s).toLocaleString(DateTime.DATETIME_MED);
    },
    formatDateSQO(sql){
      if(!sql) return "";
      return DateTime.fromSQL(sql).toLocaleString(DateTime.DATETIME_MED);
    }

  },
}
</script>
<style scoped>
.status-block{
  display: inline-block;
  min-width: 30vw; 
  max-width: 30vw;
  min-height: 30vh; 
  max-width: 30vh;
}
</style>
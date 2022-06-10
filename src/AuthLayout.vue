<template lang="pug">
b-container#app(fluid).p-0
  .row.no-gutters
    .col.bg-dark(style="max-width: 250px; height: 100vh;")
      b-nav(variant="dark" vertical)
        b-nav-text 
          .text-center.pl-2
            b-link(href="https://www.apigrate.com") My App
        b-nav-item(link-classes="text-light" to="/" :active="a('Home')") Dashboard
        b-nav-item(link-classes="text-light" to="/connections" :active="a('Connections')") App Connections
        b-nav-item(link-classes="text-light" to="/settings" :active="a('Settings')") Settings
        b-nav-item(link-classes="text-light" to="/xrefs/user" :active="a('UserXrefs')") User Xrefs
        b-nav-item(link-classes="text-light" to="/xrefs/client" :active="a('ClientXrefs')") Client Xrefs
        b-nav-item(link-classes="text-light" to="/xrefs/project" :active="a('ProjectXrefs')") Project Xrefs
        b-nav-item(link-classes="text-light" to="/tools/toggl-tags" :active="a('TogglTagging')") Toggl Tagging
        b-nav-item(link-classes="text-light" to="/tools/qbo-time" :active="a('QboTimeEntries')") QuickBooks Time Entries
        b-nav-item(link-classes="text-light" to="/tools/sync-now" :active="a('tools')") Sync Now
        b-nav-item(link-classes="text-light" to="/billing" :active="a('Billing')") Billing
        
      .fixed-bottom.mb-2
        b-button.ml-2(variant="outline-light" @click="logout")
          b-icon-box-arrow-left
          span.ml-2 Logout
    .col
      router-view
</template>

<script>
import authMixin from '@/mixins/auth'
import baseMix from '@/mixins/base'
export default {
  name: 'AuthLayout',
  components: {},

  mixins: [
    authMixin,
    baseMix,
  ],

  created(){
    this.loadAuthState();
    this.$store.commit('hydrateStoreFromOffline');

  },

  methods:{ 
    //...mapActions(['','']),
    a(menutest){
      return this.$router.currentRoute.name === 'menutest';
    }
  }

}
</script>

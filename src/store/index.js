import Vue from 'vue'
import Vuex from 'vuex'
import { VueOfflineStorage } from 'vue-offline'
import { callApi, ApiError, ApiAuthorizationError, ApiNotAvailableError } from '../lib/api'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    account: null,
    billing_customer: null,
    billing_subscription: null,
    billing_methods: [],
    connections: [],
    settings: null, //aggregate of properties
    subscription: null,
    xrefs: [],
    
    auth_error_count: 0,
    dirty: false,
    error: null,
    errors: null,
    global_error: null,
    in_process: 0,
    jwt: null,
    message: null,
    realm_id: null,
    user: null,
  },

  getters: {
    account: state => state.account,
    billing_subscription: state => state.billing_subscription,
    connection: state => state.connection,
    connections: state => state.connections,
    subscription: state => state.subscription,
    settings: state => state.settings,
    xrefs: state => state.xrefs,
    
    auth_error_count: state => state.auth_error_count,
    busy: state => state.in_process>0,
    dirty: state => state.dirty,
    error: state => state.error,
    errors: state => state.errors,
    global_error: state => state.global_error,
    has_error: state => state.error || (state.errors && state.errors.length > 0 ) ? true : false,
    has_global_error: state => state.global_error ? true : false,
    has_message: state => state.message ? true : false,
    in_process: state => state.in_process,
    is_admin: state => state.user && state.user.roles && state.user.roles.includes("admin"),
    is_client: state => state.user && state.user.roles && state.user.roles.includes("client"),
    jwt: state => state.jwt,
    message: state => state.message,
    realm_id: state => state.realm_id,
    user: state => state.user,
  },

  mutations: {
    setBillingCustomer(state, data){ 
      state.billing_customer = data;
      VueOfflineStorage.set("tsbillcust", data); 
    },
    setBillingMethods(state, data){ 
      state.billing_methods = data;
      VueOfflineStorage.set("tsbillmethods", data);
    },
    setBillingSubscription(state, data){ 
      state.billing_subscription = data;
      VueOfflineStorage.set("tsbillsub", data);
    },
    setConnections(state, data){ 
      state.connections = data;
      VueOfflineStorage.set("tsconns", data);
    },
    setConnection(state, data){ 
      state.connection = data;
      // Also mutate the array member if it exists.
      let idx = state.connections.findIndex(c=>c.service==data.service);
      if(idx >= 0){
        Vue.set(state.connections, idx, data);
      }
    },
    setSettings(state, data){ 
      state.settings = data;
      VueOfflineStorage.set("tssettings", data); 
    },
    setSubscription(state, data){ 
      state.subscription = data;
      VueOfflineStorage.set("tssub", data); 
    },
    setXrefs(state, data){ state.xrefs = data; }, 

    hydrateStoreFromOffline(){
      //auth handled separately

      let ol_billing_customer = VueOfflineStorage.get("tsbillcust");
      if(ol_billing_customer) this.state.billing_customer = ol_billing_customer;

      let ol_billing_methods = VueOfflineStorage.get("tsbillmethods");
      if(ol_billing_methods) this.state.billing_methods = ol_billing_methods;

      let ol_billing_subscription = VueOfflineStorage.get("tsbillsub");
      if(ol_billing_subscription) this.state.billing_subscription = ol_billing_subscription;

      let ol_connections = VueOfflineStorage.get("tsconns");
      if(ol_connections) this.state.connections = ol_connections;

      let ol_settings = VueOfflineStorage.get("tssettings");
      if(ol_settings) this.state.settings = ol_settings;

      let ol_subscription = VueOfflineStorage.get("tssub");
      if(ol_subscription) this.state.subscription = ol_subscription;

    },

    clearMessageAndErrors(state){
      state.global_error = null;
      state.message = null;
      state.error = null;
      state.errors = null;
    },
    incrementAuthErrorCount(state){
      if(state.auth_error_count === null) state.auth_error_count=0;
      state.auth_error_count++;
    },
    incrementInProcess(state){
      state.in_process++;
    },
    decrementInProcess(state){
      state.in_process--;
    },
    setAccount(state, account) {
      state.account = account;
    },
    setAuthErrorCount(state, auth_error_count){
      state.auth_error_count = auth_error_count;
    },
    setDirty(state, dirty){
      state.dirty = dirty;
    },
    setError(state, error){
      state.error = error;
    },
    setErrors(state, errors){
      state.errors = errors;
    },
    setGlobalError(state, global_error){
      state.global_error = global_error;
    },
    setJwt(state, jwt) {
      state.jwt = jwt;
    },
    setMessage(state, message){
      state.message = message;
    },
    setRealmId(state, realm_id) {
      state.realm_id = realm_id;
    },
    setUser(state, user) {
      state.user = user;
    },
  },
  
  actions: {
    async api({commit, dispatch}, callOptions){
      // let {method, url, parms, body, selector, mutator, flash} = callOptions
      try{
        commit('clearMessageAndErrors');
        commit('incrementInProcess');
        let data = await callApi(this.state.jwt, callOptions);
        if(data && data.message){
          if(!callOptions.flash){
            commit('setMessage', data.message);
          } else {
            dispatch('flashMessage', data.message);
          }
        }
        if(callOptions.mutator){
          if(callOptions.selector){
            commit(callOptions.mutator, data[callOptions.selector]);
          } else {
            commit(callOptions.mutator, data);
          }
        }
        // Regardless of mutator, selector options, the raw data is returned.
        return data;
      }catch(ex){
        // console.error('error handling in store: %o \n  %s', ex.name, ex.message);
        if(ex instanceof ApiNotAvailableError){
          commit('setGlobalError', ex.message);
        } else if(ex instanceof ApiError){
          if(ex instanceof ApiAuthorizationError){ 
            commit('incrementAuthErrorCount');
          }
          console.error(ex);
          console.error(ex.data);
          if(ex.data){
            if(ex.data.message) commit('setError', ex.data.message);//data.message is readable
            if(ex.data.error) console.error(ex.data.error);//data.error may not be readable
            if(ex.data.errors) commit('setErrors', ex.data.errors);//data.errors are readable field level errors
          }
        } else {
          commit('setError', "Error. "+ex.message);
          console.error(ex);
        }
      } finally {
        commit('decrementInProcess')
      }
    },

    async apiGet({dispatch}, callOptions) {
      callOptions.method = 'get';
      return await dispatch('api',callOptions);
    },
    async apiPost({dispatch}, callOptions) {
      callOptions.method = 'post';
      return await dispatch('api',callOptions);
    },
    async apiPut({dispatch}, callOptions) {
      callOptions.method = 'put';
      return await dispatch('api',callOptions);
    },
    async apiDelete({dispatch}, callOptions) {
      callOptions.method = 'delete';
      return await dispatch('api',callOptions);
    },

    flashMessage({commit}, message){
      commit('setMessage', message);
      setTimeout(()=>{
        commit('setMessage', null);
        commit('setDirty', false);
      }, 3000)
    },

    /*
      API Actions

      The following conventions are used for action naming:
      
      Methods that do NOT modify state
      - get{Entity|Entities} gets an entity and returns it, but does NOT mutate the state

      Methods that modify state
      - load{Entity|Entities} gets an entity and returns it, AND mutates the corresponding state property
      - create{Entity|Entities} create an entity and return it, mutating the state
      - update{Entity|Entities} update an entity and return it, mutating the state
      - save{Entity|Entities} create or update an entity (depending on whether `id` is present) and return it, mutating the state
      
      Methods that MAY modify state
      - delete{Entity|Entities} delete an entity, state may or may not be mutated, depending on the action
      - modify{Entity|Entities} update an entity, state may or may not be mutated, depending on the action
      
      ... all other action names are independent of the conventions.
    */

    
    async validate({dispatch, commit}){
      let response = await dispatch('apiGet', { url: `/api/v1/my/status` });
      let {billing_subscription, connections, error, errors, settings, subscription } = response;
      
      if(error) commit('setError', error);
      if(errors && errors.length > 0) commit('setErrors', errors);
      if(subscription) commit('setSubscription', subscription);
      if(billing_subscription) commit('setBillingSubscription', billing_subscription);
      if(connections) commit('setConnections', connections);
      if(settings) commit('setSettings', settings);

      return response;
    },

    async createXref({dispatch}, xref ) {
      let response = await dispatch('apiPost', {url: `/api/v1/my/xrefs/${xref.id}`, body: xref, mutator: 'setXref' });
      if(!this.getters.has_error) dispatch('flashMessage', "Cross reference saved.");
      return response;
    },

    async deleteXref({dispatch}, xref ) {
      let response = await dispatch('apiDelete', {url: `/api/v1/my/xrefs/${xref.id}`});
      if(!this.getters.has_error) dispatch('flashMessage', "Cross reference removed.");
      return response;
    },

    async loadBillingCustomer({dispatch}) {
      return await dispatch('apiGet', {url: `/api/v1/my/billing/customer`, mutator: 'setBillingCustomer'}); 
    },

    async loadBillingMethods({dispatch}) {
      return await dispatch('apiGet', {url: `/api/v1/my/billing/methods`, mutator: 'setBillingMethods', selector: 'items'}); 
    },

    async loadBillingSubscription({dispatch}) {
      return await dispatch('apiGet', {url: `/api/v1/my/billing/subscription`, mutator: 'setBillingSubscription'}); 
    },


    async loadSettings({dispatch}) {
      return await dispatch('apiGet', {url: `/api/v1/my/settings`, mutator: 'setSettings'}); 
    },
    
    async loadSubscription({dispatch}) {
      return await dispatch('apiGet', {url: `/api/v1/my`, mutator: 'setSubscription'}); 
    },

    async loadXrefs({dispatch}) {
      return await dispatch('apiGet', {url: `/api/v1/my/xrefs`, mutator: 'setXrefs', selector: 'subscription_xrefs'});
    },

    async updateSettings({dispatch}, settings ) {
      let response = await dispatch('apiPut', {url: `/api/v1/my/settings/`, body: settings, mutator: 'setSettings' });
      if(!this.getters.has_error) dispatch('flashMessage', "Settings saved.");
      return response;
    },
    
    async updateXref({dispatch}, xref ) {
      let response = await dispatch('apiPost', {url: `/api/v1/my/xrefs/${xref.id}`, body: xref, mutator: 'setXref' });
      if(!this.getters.has_error) dispatch('flashMessage', "Cross reference saved.");
      return response;
    },


    //
    // Connection-related actions
    //
    async getQuickBooksAuthorizationUrl({dispatch}){
      return await dispatch('apiGet', {url: `/auth/quickbooks/connect` });
    },

    async disconnect({dispatch}, connection_id) {  
      await dispatch('apiPut', {url: `/api/v1/my/connections/${connection_id}/disconnect`, selector:"connection", mutator:"setConnection" });
    },

    async loadConnections({dispatch}) {
      return await dispatch('apiGet', {url: `/api/v1/my/connections`, mutator: 'setConnections'});
    },

    /*
      Tests the connection, potentially updating the status of the connection.
    */
    async testConnection({dispatch}, connection_id ) {
      await dispatch('apiPut', {url: `/api/v1/my/connections/${connection_id}/test`, selector:"connection", mutator:"setConnection", flash: true });
    },

    /**
     * Updates the connection with the latest info and tests it after saving the update.
     */
    async updateConnection({dispatch}, connection ) {
      await dispatch('apiPut', {url: `/api/v1/my/connections/${connection.id}`, body: connection, flash: true});// let test api mutate the connection.
      if(!this.getters.has_error){
        await dispatch('apiPut', {url: `/api/v1/my/connections/${connection.id}/test`, selector:"connection", mutator:"setConnection", flash: true });
      }
    },



    //
    // User, Auth actions
    //
    // save a password reset.
    async savePassword({dispatch}, payload){
      await dispatch('apiPost', {url: `/reset-password`, body: {token: payload.token, password: payload.password}});
    }

  }//actions
})


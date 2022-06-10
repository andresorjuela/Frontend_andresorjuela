<template lang="pug">
b-list-group-item
  span.d-flex.justify-content-between(v-if="connection.status==='active'")
    span
      b-icon-check-circle-fill(variant="success") 
      span.ml-2 {{title}}

    small.mt-1(v-if="connection.name")
      span Connected as 
        code {{connection.name}}
    
    b-button-group
      b-button(variant="outline-secondary" size="sm" @click="test('toggl')" :disabled="busy")
        b-icon-cloud-upload(v-if="!testing" )
        b-icon-cloud-upload-fill(v-if="testing" )
        span.ml-1 Test
        
      b-button( v-if="!editing && type!=='oauth'" size="sm" variant="outline-info" @click="edit" :disabled="busy") Edit
      b-button( v-if="!confirming_disconnect" size="sm" variant="outline-danger" @click="promptConfirmDisconnect" :disabled="busy") Disconnect
      b-button( v-if="confirming_disconnect" size="sm" variant="danger" @click="disconnectFrom"  ) Click Again to Disconnect
      
  
  span.d-flex.justify-content-between(v-else-if="connection.status==='inactive'")
    span
      b-icon-x-circle-fill(variant="danger" ) 
      span.ml-2 {{title}}
    b-button-group
      b-button( v-if="!editing" size="sm" variant="outline-success" @click="connect"  ) Connect

  b-form.mt-2(v-if="editing")
    b-form-row( v-if="['token'].includes(type)")
      b-form-group.col(:label="token_label || 'Token'")
        b-form-input(type="text" v-model="local_value.token" :class="validate('token')")
        small.invalid-feedback {{validationMessage('token')}}
    
    b-form-row( v-if="['other','basic'].includes(type)")
      b-form-group.col(:label="user_label || 'User'")
        b-form-input(type="text" v-model="local_value.user" :class="validate('user')")
        small.invalid-feedback {{validationMessage('user')}}
      b-form-group.col(:label="password_label || 'Password'")
        b-form-input(type="password" v-model="local_value.token" :class="validate('token')")
        small.invalid-feedback {{validationMessage('token')}}
    b-form-row( v-if="editing && ['other'].includes(type)")
      b-form-group.col(:label="property1_label || 'Secret'")
        b-form-input(type="text" v-model="local_value.user" :class="validate('user')")
        small.invalid-feedback {{validationMessage('user')}}
      b-form-group.col(:label="password_label || 'Password'")
        b-form-input(type="password" v-model="local_value.token" :class="validate('token')")
        small.invalid-feedback {{validationMessage('token')}}
    b-form-row
      b-col
        b-button( size="sm" variant="secondary" @click="edit") Close
        b-button( size="sm" variant="outline-success" @click="save") Save


</template>

<script>
import {mapActions} from 'vuex';
import baseMix from '@/mixins/base';
import ssvalidation from '@/mixins/ss-validation';

export default {
  name: 'ConnectionWidget',
  
  mixins: [baseMix, ssvalidation],

  props:{
    title: {type: String, required: true},
    connection: {type: Object, required: true},
    type: {type: String, required: true, default: 'basic'},//basic, token, oauth 
    oauth_url: {type: Object, required: false},
    oauth_url_provider: {type: Function, required: false},
    token_label: {type: String, required: false},
    user_label: {type: String, required: false},
    password_label: {type: String, required: false},
    property1_label: {type: String, required: false},
  },

  data(){
    return {
      local_value: null,
      testing: false,
      editing: false,
      confirming_disconnect: false,
      oauth_connection_url: null,
    };
  },

  computed: {
    // ...mapGetters(['connection']),
  },

  async mounted(){
    this.local_value = this.connection;
    if(this.type==='oauth'){
      if(!this.oauth_url && !this.oauth_url_provider) throw new Error(`Either 'oauth_url' or 'oauth_url_provider' are required.`);
    }
  },

  methods: {
    ...mapActions(['','disconnect','testConnection','updateConnection',]),
    connect(){
      if(this.type==='oauth'){
        this.connectOAuth();
      } else {
        this.edit()
      }
    },

    async connectOAuth(){
      if(!this.oauth_connection_url){
        if(this.oauth_url){ 
          this.oauth_connection_url = this.oauth_url;
        } else {
          let provider_result = await this.oauth_url_provider(this.connection);
          this.oauth_connection_url = provider_result ? provider_result.url : null;
        }
      }
      // Redirect window to begin oauth dialog.
      if(this.oauth_connection_url){
        window.location = this.oauth_connection_url;
      }
    },
    async disconnectFrom(){
      if(this.connection){
        this.disconnect(this.connection.id);
        this.$emit("disconnected", this.connection);
      }
    },
    
    edit(){
      this.editing = !this.editing;
    },

    promptConfirmDisconnect(){
      this.confirming_disconnect = true;
      setTimeout(()=>{ this.confirming_disconnect = false; }, 5000);
    },

    async save(){
      await this.updateConnection(this.local_value);
      this.$emit("saved", this.local_value); 
    },

    async test(){
      this.testing = true;
      try{
        if(this.local_value){
          await this.testConnection(this.local_value.id);
          this.$emit("tested", this.local_value);
        }
      }catch(err){
        console.error(err);
      } finally {
        this.testing = false;
      }
    },
    
    

  }
}
</script>

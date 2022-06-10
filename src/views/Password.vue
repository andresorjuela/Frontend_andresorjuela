<template lang="pug">
  b-container
    b-card
      b-card-title
        h4 Set Password
      b-card-text
        b-spinner(variant="secondary" v-if="busy" size="sm") {{message}}
        b-alert(variant="warning" v-if="!busy && has_error"   show ) {{error}}
        b-alert(variant="info"    v-if="!busy && has_message" show dismissable fade ) {{message}}
        
      b-form(v-if="!complete")
        b-form-group(label="Password" label-cols="3")
          b-form-input(type="password" v-model="password" :class="validate('password')")
          small.invalid-feedback {{validationMessage('password')}}
        b-form-group(label="Password Again" label-cols="3")
          b-form-input(type="password" v-model="confirm" :class="confirmMatch")
          small.invalid-feedback Confirm your password. The passwords must match.
        b-form-row
          b-col
            b-button.float-right(variant="success" @click="submitNewPassword" :disabled="confirmMatch==='is-invalid'") Set Password
          b-col
            b-button(variant="secondary" onclick="history.go(-1)") Back 
      
      .d-flex.justify-content-center(v-if="complete") 
        b-button(variant="primary" to="/login") Please login.
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
import ssvalidation from '@/mixins/ss-validation'
export default {
  name: 'Password',

  components: {
  },

  mixins: [ssvalidation],

  data(){
    return {
      token: null,
      password: "",
      confirm: "",
    };
  },

  async created(){
    this.token = this.$route.params.token;
  },

  computed: {
    ...mapGetters(['message','error','errors','busy','has_error','has_message','password_result']),
    confirmMatch(){
      if(this.confirm==="" && this.password==="") return "";
      return this.confirm && this.password && this.confirm===this.password ? "is-valid" : "is-invalid";
    },
    complete(){
      return this.password_result && this.password_result.success;
    }
  },

  methods: {
    ...mapActions(["savePassword"]),

    async submitNewPassword(){
      await this.savePassword({token: this.token, password: this.password});
    },

  }
}
</script>

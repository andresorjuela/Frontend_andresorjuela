<template lang="pug">
  b-container
    b-card(v-if="!forgot")
      b-card-body
        b-card-title 
          h4 Login
        b-card-text
          b-alert(variant="warning" v-if="!busy && has_error" show ) {{error}}
          b-alert(variant="info" dismissable fade v-if="!busy && has_message" show ) {{message}}
          b-form
            input(type="hidden" name="redirect_uri" value=redirect_uri||"")
            b-form-group(label="Username" )
              b-form-input(name="username" v-model="username")
            b-form-group(label="Password")
              b-form-input(type="password" v-model="password")
            b-row
              b-col
                b-button(variant="primary" @click="login") Login
            b-row
              b-col.pt-3
                b-link.text-secondary(@click="toggleForgot") Forgot password?
    b-card(v-if="forgot")
      b-card-body
        b-card-title 
          h4 Reset your Password
        b-card-text
          b-alert(variant="warning" :show="!busy && has_error" ) {{error}}
          b-alert(variant="info" dismissable fade :show="!busy && has_message" ) {{message}}
          b-form
            b-form-group(label="Email" )
              b-form-input(name="email" v-model="email")
            b-row
              b-col
                b-button(variant="primary" @click="resetPassword") Reset My Password
            b-row
              b-col.pt-3
                b-link.text-secondary(@click="toggleForgot") Login
</template>

<script>
import {mapGetters} from 'vuex'
import auth from '@/mixins/auth'
export default {
  name: 'Login',

  mixins: [auth],

  computed: {
    ...mapGetters(['message','error','errors','busy','has_error','has_message']),
  },

  data(){
    return {
      forgot: false
    };
  },

  methods: {
    toggleForgot(){
      this.forgot = !this.forgot;
    }
  }

}
</script>

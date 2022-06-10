/**
 * JWT-enabled auth mixin for views.
 */
import { parseJwt } from '@/lib/jwt-helper';
import { ApiError, ApiNotAvailableError } from '@/lib/api';
import { mapGetters, mapActions } from 'vuex';

export const ADMIN_ROLE = "admin";
export const USER_ROLE = "user";

export default {
  data() {
    return {
      username: null,
      password: null,
      email: null,
      jwt: null,
    };
  },

  computed: {
    isLoggedIn(){
      if(!this.jwt) return false;
      try{
        let parsed = parseJwt(this.jwt);
        let now = Math.floor(Date.now()/1000);
        return (parsed.exp > now);
      } catch(err) {
        return false;
      }
    },
    ...mapGetters(['auth_error_count']),

    is_user(){
      return this.$store.state.user && this.$store.state.user.roles && this.$store.state.user.roles.includes(USER_ROLE);
    },

    is_admin(){
      return this.$store.state.user && this.$store.state.user.roles && this.$store.state.user.roles.includes(ADMIN_ROLE);
    }
  },

  watch:{
    /** 
     * Watches overall auth error count (in vuex store). If greater than threshold, forces a logout.
     */
    auth_error_count(current_count){
      const ERR_COUNT_THRESHOLD = 1;
      if( current_count > ERR_COUNT_THRESHOLD ){
        this.logout();
      }
    }
  },

  
  methods: {
    ...mapActions(['apiPost']),

    async login(){

      try{

        this.$store.commit("setMessage", "Logging in...");
    
        if(!this.username || !this.password){
          this.$store.commit("clearMessageAndErrors");
          this.$store.commit("setError","Credentials not provided.");
          return;
        }

        let loginResponse = await this.apiPost({url: `/login`, body: {username: this.username, password: this.password}});
        
        if(loginResponse && loginResponse.token){
          
          this.jwt = loginResponse.token;

          parseJwt(loginResponse.token, this.$store);

          if( this.$store.state.user && this.$store.state.user.roles && this.$store.state.user.roles.includes(ADMIN_ROLE) ){
            this.$router.push({name:'AdminHome'});
          
          } else if ( this.$store.state.user && this.$store.state.user.roles && this.$store.state.user.roles.includes(USER_ROLE) ){
            this.$router.push({name:'Home'});
          }

        } else {
          this.$store.commit("setError","Invalid credentials.");
          return;
        }
      }catch(ex){

        if (ex instanceof ApiNotAvailableError) {
          this.$store.commit("setGlobalError", ex.message);
        } else {
          this.$store.commit("clearMessageAndErrors");
          if (ex instanceof ApiError) throw ex;
          this.$store.commit("setError", "Invalid credentials.");
        }
      } finally {
        this.password = null;
        this.$store.commit("decrementInProcess");
      }

    },

    getAuthTokenParm(){
      let url = new URL(window.location);
      return url.searchParams.get("token");
    },
    
    logout(){
      let keys = this.$offlineStorage.keys;
      if(keys){ JSON.parse(this.$offlineStorage.keys).forEach(k => {this.$offlineStorage.set(k, null);}); }
      this.$store.commit('setJwt', null);
      this.$store.commit('setUser', null);
      this.$store.commit('setAccount', null);
      this.$store.commit('setSubscription', null);
      this.$store.commit('setAuthErrorCount', 0);
      this.$store.commit('clearMessageAndErrors');

      //Clear out other app-specific stuff here...
      if(this.$router.currentRoute.path !== "/login"){
        this.$router.push("/login");
      }
    },

    async resetPassword(){
      await this.apiPost({method: 'post', url: `/forgot-password`, body: {email: this.email} });
    },
  }
};
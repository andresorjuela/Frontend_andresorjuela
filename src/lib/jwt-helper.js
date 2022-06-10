import { VueOfflineStorage } from 'vue-offline';
import jwtdecode from 'jwt-decode';

/**
 * Hydrates base authorization state from offline storage (JWT), placing it into the VUEX store
 * after parsing and validating the token.
 * 
 * @param {object} store the Vuex store
 * @throws InvalidTokenError on an invalid JWT
 */
export function loadAuthState(store){
  console.debug(`Loading auth state.`)
  let t = VueOfflineStorage.get('jwt');
  if(t){
    parseToken(t, store);
  }
}

/**
 * Parses a JWT, setting offline storage. Mutates the store if provided.
 * @param {string} t jwt token 
 * @param {object} store the store to set
 * @returns parsed JWT info if available.
 * @throws InvalidTokenError on an invalid JWT
 */
export function parseJwt(t, store){
  if(!t) return;
  console.debug(`Parsing jwt.`)
  let parsed = jwtdecode(t);//throws error if invalid

  if(store){
    console.debug(`Setting state into store.`)
    store.state.jwt = t;
    VueOfflineStorage.set('jwt', t);

    if(parsed.user){
      store.state.user = parsed.user;
      VueOfflineStorage.set('user', parsed.user);
    }
    
    if(parsed.account){
      store.state.account = parsed.account;
      VueOfflineStorage.set('account', parsed.account);
    }
    
    if(parsed.subscription){
      store.state.subscription = parsed.subscription;
      VueOfflineStorage.set('subscription', parsed.subscription);
    }
    
  }

  return parsed;
} 

          
import {mapGetters} from 'vuex';
import { DateTime } from "luxon";
export default {
  computed:{
    ...mapGetters(['message','error','errors','busy','has_error','has_message','user']),
  },
  methods:{
    /**
     * Format a datetime string as a common format.
     * @param {*} string an ISO string represntation of date
     * @param {*} format_string example: "MMM dd, yyyy HH:mma"
     * @returns 
     */
    formatDateTime(string){
      if(!string) return '';
      let date = DateTime.fromSQL(string, {zone: 'UTC'});
      let out = date.setZone(this.user.timezone||'UTC').toLocaleString(DateTime.DATETIME_FULL)
      return out;
    }
  }
};
export default {
  methods: {
    validate(name){
      if(this.validationMessage(name)) return "is-invalid";
      return null;
    },
    validationMessage(name){
      if(this.errors){
        let specific_error = this.errors.find(e=>e.key===name);
        if(specific_error) return specific_error.error;
      }
      return null;
    },
  }
};
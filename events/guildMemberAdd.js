// This event executes when a new member joins a server. Let's welcome them!

module.exports = class {
  constructor (client) {
    this.client = client;
  }

  async run (member) {
    
    console.log("Welcome message.")
  }
};

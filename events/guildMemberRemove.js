// This event executes when a member leaves.

module.exports = class 
{
    constructor(client) 
    {
        this.client = client;
    }

    async run(member) 
    {
        const cmd = this.client.commands.get("updatememberinfo") || this.client.commands.get(this.client.aliases.get("updatememberinfo"));
        console.log("Updating Member Info")
        cmd.run(member,"", 0);
    }
};

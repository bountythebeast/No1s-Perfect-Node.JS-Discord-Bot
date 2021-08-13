const Command = require("../base/Command.js");
const { Invoices } = require('paypal-invoices')
const configdata = require("../config.json");
PP_INVOICER:LOG=true


class paypalinvoice extends Command 
{
	constructor (client) 
	{
		super(client, 
		{
			name: "paypalinvoice", //command name, should match class.
			description: "PayPalInvoice constructor command", //description
			usage: "N/A" //usage details. Should match the name and class
		});
	}

	async run (message, args, level) 
	{
        const api = new Invoices()
        //const api = new Invoices(configdata.paypalClientID, configdata.paypalSecret,true)
      
        // Initialize the API
        try 
        {
            await api.initialize();
        } 
        catch (e) 
        {
            console.log("Could not initialize");
            return;
        }
        
        const test = await api.listInvoices();
        // Get the next Invoice number
        const invoiceNum = await api.generateInvoiceNumber();
        
        
        // Create a new Invoice draft
        //const link = await api.createDraftInvoice(/* Invoice Object*/);
        
        // Get the created invoice
        //const invoiceDraft = await api.getInvoiceByLink(link);
        
        // Send the new Invoice to the recipient
        //await api.sendInvoice(invoiceDraft.id);
        
	}
}

module.exports = paypalinvoice; //<------------ Don't forget this one!

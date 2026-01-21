const client = require("./whatsapp");
const setupListener = require("./listener");

setupListener(client);
client.initialize();

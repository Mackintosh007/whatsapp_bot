const { recentlyMessaged } = require("./database");
const { queueDM } = require("./dmQueue");
const { TARGET_GROUP_ID } = require("./config");


async function getAdmins(chat) {
  return chat.participants
    .filter(p => p.isAdmin || p.isSuperAdmin)
    .map(p => p.id._serialized);
}

function setupListener(client) {
  client.on("message", async message => {
    console.log("Message from:", message.from, "Sender:", message.author);

    if (message.from !== TARGET_GROUP_ID) return;

    const chat = await message.getChat();
    const sender = message.author;
    if (!sender) return;

    const admins = await getAdmins(chat);

    if (admins.includes(sender)) return;
    if (sender === client.info.wid._serialized) return;
    if (await recentlyMessaged(sender)) return;
console.log("Group ID:", message.from);


    queueDM(client, sender);
  });
}

module.exports = setupListener;

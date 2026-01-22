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

    // ✅ Only group messages
    if (!message.from.endsWith("@g.us")) return;

    // ✅ Only target group
    if (message.from !== TARGET_GROUP_ID) return;

    const chat = await message.getChat();

    // ✅ Only real senders
    const sender = message.author;
    if (!sender) return;

    // ❌ Skip LID users
    if (sender.endsWith("@lid")) {
      console.log("⛔ Skipping LID user:", sender);
      return;
    }

    const admins = await getAdmins(chat);

    // ❌ Skip admins
    if (admins.includes(sender)) return;

    // ❌ Skip bot itself
    if (sender === client.info.wid._serialized) return;

    // ❌ Skip if already messaged
    if (await recentlyMessaged(sender)) return;

    console.log("✅ Queueing DM for:", sender);
    queueDM(client, sender);
  });
}

module.exports = setupListener;

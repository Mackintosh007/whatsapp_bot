const { logMessage } = require("./database");

function randomDelay(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

async function queueDM(client, user) {
  const delay = randomDelay(60_000, 180_000); // 1–3 mins

  setTimeout(async () => {
    await client.sendMessage(
      user,
      "Hi 👋 I saw your listing on Omoku Market Square group. Incase you you need more visibility there's a new website built specifically for business people in Omoku and ONELGA, you can check it out and maybe signup if you find the site helpful."
    );
    logMessage(user);
  }, delay);
}

module.exports = { queueDM };

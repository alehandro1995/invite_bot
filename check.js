const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const { Api } = require("telegram/tl");
const input = require("input"); // npm i input
const fs = require("fs");
//const { sleep } = require("telegram/Helpers");

const apiId = 28303926;
const apiHash = "7883d5805795b785fdde6f6f29546809";
const stringSession = new StringSession(""); // fill this later with the value from session.save()

function getTodayDate() {
	const today = new Date();
	const day = String(today.getDate()).padStart(2, '0');
	const month = String(today.getMonth() + 1).padStart(2, '0');
	const year = today.getFullYear();

	return `${day}.${month}.${year}`;
}

(async () => {
  console.log("Loading interactive example...");
  const client = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
  });

  await client.start({
    phoneNumber: async () => '+7 987 577 8925',
    password: async () => 'nintendo27',
    phoneCode: async () => await input.text("Please enter the code you received: "),
    onError: (err) => console.log(err),
  });

  console.log("You should now be connected.");
  console.log(client.session.save()); // Save this string to avoid logging in again

  const channel = "https://t.me/escort_vip_piter";
	const channelURL = "https://t.me/EscSochi";
	const OFFSET = 100;
	const LIMIT = 100;

  async function getEntity(client, userId) {
    try {
      const entity = await client.getEntity(userId);
      return entity;
    } catch (error) {
      console.log(`Error getting entity for user ID ${userId}:`, error);
      return null;
    }
  }

  try {
    const result = await client.invoke(
      new Api.channels.GetParticipants({
        channel: channelURL,
        filter: new Api.ChannelParticipantsRecent(),
        offset: OFFSET,
        limit: LIMIT, // Максимальное количество участников за один запрос (до 100)
        hash: 0
      })
    );

		
    const users = result.users;
		let i = 1;
    for (const user of users) {
      const entity = await getEntity(client, user.id);
			const userInfo = `${i} - ${entity.id} - ${entity.username} - ${entity.bot}`;
			console.log(userInfo);
			await new Promise(resolve => setTimeout(resolve, 1000));
			i++;
    }

		const data = `From: ${channelURL} - To: ${channel} - Offset: ${OFFSET} - Limit: ${LIMIT} - Date: ${getTodayDate()}\n`;
		fs.appendFileSync('check_log_data.txt', data, (err) => {
      if (err) throw err;
    });
	  
  } catch (error) {
    console.log("Error invoking GetParticipants:", error);
  }

})();
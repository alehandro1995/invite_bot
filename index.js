const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const { Api } = require("telegram/tl");
const input = require("input"); // npm i input
const fs = require("fs");

const apiId = 28303926;
const apiHash = "7883d5805795b785fdde6f6f29546809";
const stringSession = new StringSession("");

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
    phoneNumber: async () => '+79319520993',
    password: async () => 'nintendo27',
    phoneCode: async () => await input.text("Please enter the code you received: "),
    onError: (err) => console.log(err),
  });

  console.log("You should now be connected.");
  console.log(client.session.save()); // Save this string to avoid logging in again

  const channel = "https://t.me/davalki_kzn";
  const channelURL = "https://t.me/vstrechiKZNchat";
	const OFFSET = 250;
	const LIMIT = 50;
	const USER = 'jim_bro'

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
		
		let i = 0;
		const users = result.users;
		let intervale = setInterval(async () => {
			let user = users[i];

			try {
				// Find the user by username
				const userEntity = await client.getEntity(user);
				if(userEntity && !userEntity.bot){
					const result = await client.invoke(
						new Api.channels.InviteToChannel({
							channel: channel,
							users: [userEntity],
						})
					);

					console.log(`InviteToChannel - ${i}`);
				}else{
					const userInfo = `${i} - ${userEntity.id} - ${userEntity.username} - ${userEntity.bot}`;
					console.log(userInfo);
				}
			} catch (error) {
				console.log("Error invoking getEntity or writing to file:", error);
			}
			
			i++;
			if (i >= users.length) {
				clearInterval(intervale);
				console.log("All users invited");
				const data = `User: ${USER} - From: ${channelURL} - To: ${channel} - Offset: ${OFFSET} - Limit: ${LIMIT} - Date: ${getTodayDate()}\n`;
				fs.appendFileSync('log/start_log_data.txt', data, (err) => {
          if (err) throw err;
        });
			}
			
		}, 1000 * 60 * 20); // 20 minutes
  } catch (error) {
    console.log("Error invoking GetParticipants:", error);
  }

})();

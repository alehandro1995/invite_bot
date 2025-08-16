const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const { Api } = require("telegram");
const input = require("input");
const fs = require("fs");

const apiId = 28303926;
const apiHash = "7883d5805795b785fdde6f6f29546809";
const stringSession = new StringSession("");

const delay = 3000; // 3 секунды между сообщениями

(async () => {
  console.log("Loading interactive example...");
  const client = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
  });

  await client.start({
    phoneNumber: async () => '+16504773726',
    password: async () => 'nintendo27',
    phoneCode: async () => await input.text("Please enter the code you received: "),
    onError: (err) => console.log(err),
  });

  console.log("You should now be connected.");

  const message = "Привет друг!!!\nПриглашаем в наш чат, где мы делимся актуальными связками по обработке трафика и предоставляем доступ к проверенным площадкам.\nhttps://t.me/+q27GKlPEo2tlNTFh";
  //const contacts = JSON.parse(fs.readFileSync("data/mailing_list.json", "utf-8"));
	const result = await client.invoke(new Api.contacts.GetContacts({}));
	const contacts = result.users;
  for (const contact of contacts) {

    try {		
      console.log(`Sending message to ${contact.firstName || 'Unknown'} (${contact.phone || contact.id || 'no id'})...`);
      // Получаем entity (после добавления в контакты шанс выше)
      let entity;
      try {
        entity = await client.getEntity(contact.id);
      } catch (e) {
        console.error(`❌ Cannot get entity for ${contact.firstName || 'Unknown'} (ID: ${contact.id})`);
        fs.appendFileSync('./log/message_errors.log', `[${new Date().toISOString()}] Entity not found for ${contact.id}\n`);
        continue;
      }

      // Отправляем сообщение
      await client.sendMessage(entity, { message });
			fs.appendFileSync("./log/message.log", `[${new Date().toISOString()}] Message sent to ${contact.firstName || 'Unknown'} | ${contact.id}\n`);
      console.log(`✅ Message sent to ${contact.firstName || 'Unknown'}`);

      if (contacts.indexOf(contact) < contacts.length - 1) {
        console.log(`⏳ Waiting ${delay / 1000} seconds before next message...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
		
    } catch (err) {
      console.error(`❌ Failed to send message to ${contact.firstName || 'Unknown'}: ${err.message}`);
      fs.appendFileSync('./log/message_errors.log', `[${new Date().toISOString()}] Error sending to ${contact.id}: ${err.message}\n`);
    }
  }

  console.log("📨 Finished sending messages to all contacts");
  await client.disconnect();
})();

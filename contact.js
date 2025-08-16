const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const { Api } = require("telegram/tl");
const input = require("input"); // For user input
const fs = require("fs");

const apiId = 11207257;
const apiHash = "bee101d6246ecf374bbae1b06fd6cc06";
const stringSession = new StringSession(""); // Empty string for first-time login

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

  console.log("You are now connected.");
  console.log("Your session string:", client.session.save());
  console.log("You are now connected.");
	/*
  // Читаем контакты из файла
  const contactsData = JSON.parse(fs.readFileSync("data/mailing_list.json", "utf-8"));
  console.log("Contacts loaded:", contactsData.length);
  // Формируем запрос для добавления контактов
  const contacts = contactsData.map(
    (contact) =>
      new Api.InputPhoneContact({
        clientId: Date.now(), // Уникальный идентификатор для контакта
        phone: contact.phone,
        firstName: contact.firstName,
        lastName: contact.lastName,
      })
  );

  // Добавляем контакты
  const result = await client.invoke(
    new Api.contacts.ImportContacts({
      contacts: contacts,
    })
  );

  // Выводим результат
  console.log("Contacts added:", result.imported.length);
  console.log("Total contacts in your Telegram:", result.users.length);

  await client.disconnect();
	*/
  
  // Fetch contacts
  const result = await client.invoke(new Api.contacts.GetContacts({}));
	
	
  // Process contacts into a readable format
  const contacts = result.users.map((user) => ({
    id: user.id,
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    username: user.username || "",
    phone: user.phone || "",
  }));

  console.log("Fetched contacts:", contacts);

  // Save contacts to a file
	const filePath = "./data/mailing_list.json";
  fs.writeFileSync(filePath, JSON.stringify(contacts, null, 2), "utf-8");
  console.log(`Contacts saved to ${filePath}.`);
  await client.disconnect();
})();
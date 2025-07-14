const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const cron = require('node-cron');
//const { Api } = require("telegram/tl");
const input = require("input"); // npm i input
//const fs = require("fs");
const {groups} = require("./component/groups");
const { sendMessageToGroups } = require("./component/func.js");


const apiId = 11207257;
const apiHash = "bee101d6246ecf374bbae1b06fd6cc06";
const stringSession = new StringSession(""); // fill this later with the value from session.save()
const msg = "**🔥РЕАЛЬНАЯ ИНДИ🔥**\n\nСовсем недавно в вашем городе, помогу раслабится состоятельному мужчине.\n Работаю только на выезд, есть экспресс программа.\n__Пиши все условия обсуждаю индивидуально💋__ ";

(async () => {
	console.log("Loading interactive example...");
	const client = new TelegramClient(stringSession, apiId, apiHash, {
			connectionRetries: 5,
	});

	await client.start({
		phoneNumber: async () => '+7 938 535 1095',
		password: async () => 'nintendo27',
		phoneCode: async () => await input.text("Please enter the code you received: "),
		onError: (err) => console.log(err),
	});

	console.log("You should now be connected.");
	console.log(client.session.save());
	//sendMessageToGroups(client, groups, msg);
	cron.schedule('0 * * * *', () => {
		sendMessageToGroups(client, groups, msg);
	});
})();


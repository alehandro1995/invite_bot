const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const cron = require('node-cron');
//const { Api } = require("telegram/tl");
//const input = require("input"); // npm i input
//const fs = require("fs");
const {groups} = require("./data/groups");
const { sendMessageToGroups } = require("./component/func.js");

require("dotenv").config();

const apiId = 11207257;
const apiHash = "bee101d6246ecf374bbae1b06fd6cc06";
const stringSession = new StringSession(process.env.TG_SESSION_2);
const msg = "**🔥РЕАЛЬНАЯ ИНДИ🔥**\n\nСовсем недавно в вашем городе, помогу раслабится состоятельному мужчине.\n Работаю только на выезд, есть экспресс программа.\n__Пиши все условия обсуждаю индивидуально💋__ ";

(async () => {
	console.log("🚀 Запуск Telegram клиента...");
	const client = new TelegramClient(stringSession, apiId, apiHash, {
		connectionRetries: 5,
	});

	await client.connect(); // не start, потому что уже авторизованы
	console.log("✅ Клиент готов к работе");
	console.log(client.session.save());
	sendMessageToGroups(client, groups, msg);
	/*
	cron.schedule('0 * * * *', () => {
		sendMessageToGroups(client, groups, msg);
	});
	*/
})();


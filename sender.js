const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const cron = require('node-cron');
//const { Api } = require("telegram/tl");
const input = require("input"); // npm i input
//const fs = require("fs");
const {groups} = require("./component/znakomstva");
const { sendMessageToGroups } = require("./component/func.js");


const apiId = 11207257;
const apiHash = "bee101d6246ecf374bbae1b06fd6cc06";
const stringSession = new StringSession(""); // fill this later with the value from session.save()
const msg = [
	`Составим компанию щедрому господину\nВстречи только на нейтральной территории`,
	`Будем рады новым знакомствам\nМальчики пишите нестесняйтесь\n`,
	`Хотим познакомится с мужчиной\nДля постоянных встреч на материальной основе`,
	`Сегодня свободны и готовы к ночным приключениям`,
	`Всем привет 💋💋💋\nХотим весело провести время 👃🥂🍾\nОчень любим 🥥🎁💵`,
];

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
	console.log(client.session.save());
	/*
	let i = 0;
	const interval = setInterval(async () => {
		
		try {
			const message = msg[i];
			const chat = await client.getEntity("https://t.me/sosalki_spb");
			await client.sendMessage(chat, {message, parse_mode:"html"});
			console.log(`Message sent to ${msg[i]}`);
		} catch (error) {
			console.error(`Failed to send message:`, error);
		}

		i++;
	}, 1000 * 10);
	*/

	//sendMessageToGroups(client, groups, msg);
	
	let i = 0;
	cron.schedule('*/30 * * * *', () => {
		const message = msg[i];
		sendMessageToGroups(client, groups, message);
		i++;
		if(i >= msg.length) i = 0;
	});
})();

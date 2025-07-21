// auth.js
const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const input = require("input");

const apiId = 11207257;
const apiHash = "bee101d6246ecf374bbae1b06fd6cc06";
const stringSession = new StringSession(""); // пустая строка для начала

(async () => {
	const client = new TelegramClient(stringSession, apiId, apiHash, {
		connectionRetries: 5,
	});

	await client.start({
		phoneNumber: async () => await input.text("📞 Введите номер телефона: "),
		password: async () => await input.text("🔒 Введите пароль (если есть): "),
		phoneCode: async () => await input.text("📩 Введите код из Telegram: "),
		onError: (err) => console.log("❌ Ошибка:", err),
	});

	console.log("\n✅ Успешная авторизация!");
	console.log("👉 Скопируй значение ниже и вставь его в .env файл:\n");
	console.log("TG_SESSION=" + client.session.save());
	process.exit();
})();

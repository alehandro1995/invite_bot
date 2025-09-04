const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const cron = require('node-cron');
require("dotenv").config();

const apiId = 28303926;
const apiHash = "7883d5805795b785fdde6f6f29546809";
const stringSession = new StringSession(process.env.TG_SESSION);

// Сообщение с HTML-разметкой для жирного текста
const MESSAGE_TEXT = `
📣 *ПОДРАБОТКА ДЛЯ ВСЕХ*
💵 Скину на карту *5000 рублей*
✅ За выполнение простого задания
🕑 10 минут и деньги у тебя в кармане
👉 За подробностями пиши в лс`;

(async () => {
	try{
		console.log("🚀 Запуск Telegram клиента...");
		const client = new TelegramClient(stringSession, apiId, apiHash, {
			connectionRetries: 5,
		});

		await client.connect(); // не start, потому что уже авторизованы
		console.log("✅ Клиент готов к работе");

		// Запускаем первую рассылку сразу
		console.log("🚀 Запуск первой рассылки...");
		await sendBroadcast(client);
		
		// Настраиваем cron на ежечасную рассылку
		cron.schedule('0 * * * *', async () => {
			await sendBroadcast(client);
		});
		
		console.log("⏰ Cron настроен на ежечасную рассылку (в 0 минут каждого часа)");
	} catch (error) {
    console.log("❌ Ошибка инициализации:", error);
    process.exit(1);
  }
})();

process.on('SIGINT', async () => {
    console.log("\n🛑 Остановка программы...");
    if (client) {
        await client.disconnect();
        console.log("🔌 Отключились от Telegram");
    }
    process.exit(0);
});

async function sendBroadcast(client) {
    console.log("\n⏰ Запуск ежечасной рассылки...");
    console.log("⏰ Время:", new Date().toLocaleString());

    try {
        // Проверяем соединение
        if (!client.connected) {
            console.log("🔁 Переподключаемся...");
            await client.connect();
        }

        // Получаем список диалогов
        const dialogs = await client.getDialogs({});
        console.log(`📋 Загружено диалогов: ${dialogs.length}`);

        let sentCount = 0;
        let errorCount = 0;
        let skippedCount = 0;

        for (const dialog of dialogs) {
            // Фильтруем только группы и каналы
            if (dialog.isGroup) {
                try {
                    console.log(`\n📨 Отправляем в: ${dialog.name} (ID: ${dialog.id})`);
                    
                    // Отправляем сообщение с HTML-разметкой
                    await client.sendMessage(dialog.entity, {
                      message: MESSAGE_TEXT,
                      parseMode: "markdownv2",
                    });
                    
                    console.log(`✅ Успешно отправлено в: ${dialog.name}`);
                    sentCount++;
                } catch (error) {
                    if (error.message.includes('FLOOD')) {
                        console.log(`⏸️ Лимит отправки, делаем паузу...`);
                        await new Promise(resolve => setTimeout(resolve, 10000));
                        continue;
                    }
                    console.log(`❌ Ошибка отправки в ${dialog.name}:`, error.message);
                    errorCount++;
                }

								// Пауза между сообщениями чтобы избежать лимитов
                await new Promise(resolve => setTimeout(resolve, 10000));
            } else {
                skippedCount++;
            }
        }

        console.log(`\n📊 Итог рассылки:`);
        console.log(`✅ Успешно отправлено: ${sentCount}`);
        console.log(`❌ Ошибок: ${errorCount}`);
        console.log(`⏭️ Пропущено (не группы): ${skippedCount}`);
        console.log(`⏰ Следующая рассылка в: ${new Date(Date.now() + 3600000).toLocaleTimeString()}`);

    } catch (error) {
        console.log("❌ Критическая ошибка при рассылке:", error.message);
    }
}

const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const input = require("input");
const cron = require("node-cron");

const apiId = 28303926;
const apiHash = "7883d5805795b785fdde6f6f29546809";
const stringSession = new StringSession(""); // вставьте сохранённую сессию

// Сообщение с HTML-разметкой для жирного текста
const MESSAGE_TEXT = `
📣 *ПОДРАБОТКА ДЛЯ ВСЕХ*

💵 Скину на карту *5000 рублей*
✅ За выполнение простого задания
🕑 10 минут и деньги у тебя в кармане
👉 За подробностями [пиши в лс](https://t.me/+kheEgbgt_kgzMjA5)`;

let client = null;

// Функция для отправки сообщений
async function sendBroadcast() {
    if (!client) {
        console.log("❌ Клиент не инициализирован");
        return;
    }

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
                        parseMode: "markdown",
												linkPreview: false
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

// Основная функция инициализации
async function initializeClient() {
    console.log("🔄 Инициализация клиента Telegram...");
    
    client = new TelegramClient(stringSession, apiId, apiHash, {
        connectionRetries: 5,
    });

    try {
        await client.start({
            phoneNumber: async () => "+905483121192",
            password: async () => "nintendo27",
            phoneCode: async () =>
                await input.text("Пожалуйста, введите полученный код: "),
            onError: (err) => console.log("Ошибка:", err),
        });

        console.log("✅ Успешно подключились к Telegram");

        // Сохраняем сессию
        console.log("🔑 Сохраните эту сессию для будущего использования:");
        console.log(client.session.save());

        // Запускаем первую рассылку сразу
        console.log("🚀 Запуск первой рассылки...");
        await sendBroadcast();

        // Настраиваем cron на ежечасную рассылку
        cron.schedule('0 * * * *', async () => {
            await sendBroadcast();
        });

        console.log("⏰ Cron настроен на ежечасную рассылку (в 0 минут каждого часа)");

    } catch (error) {
        console.log("❌ Ошибка инициализации:", error);
        process.exit(1);
    }
}

// Обработка завершения программы
process.on('SIGINT', async () => {
    console.log("\n🛑 Остановка программы...");
    if (client) {
        await client.disconnect();
        console.log("🔌 Отключились от Telegram");
    }
    process.exit(0);
});

// Запуск программы
console.log("🤖 Бот рассылки запущен");
console.log("📅 Рассылка будет выполняться каждый час");
initializeClient();
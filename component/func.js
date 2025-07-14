async function sendMessageToGroups(client, groups, message) {
	let i = 0;
	console.log(groups.length);
	const interval = setInterval(async () => {
		if(i >= groups.length) {
			clearInterval(interval);
			console.log(`Messages have been sent to all groups!!! - ${getTodayDate()}`);
			return;
		}

		try {
			const chat = await client.getEntity(groups[i]);
			await client.sendMessage(chat, {message, parse_mode:"html"});
			console.log(`Message sent to ${groups[i]} - ${i}`);
		} catch (error) {
			console.error(`Failed to send message to ${groups[i]}:`, error);
		}

		i++;
	}, 1000 * 10);
};

function getTodayDate() {
	const today = new Date();
	const day = String(today.getDate()).padStart(2, '0');
	const month = String(today.getMonth() + 1).padStart(2, '0');
	const year = today.getFullYear();
	const hour = today.getHours();
	const minute = today.getMinutes();

	return `${day}.${month}.${year} ${hour}:${minute}`;
}
module.exports = {
	sendMessageToGroups,
	getTodayDate
};
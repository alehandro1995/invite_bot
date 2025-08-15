async function sendMessageToGroups(client, groups, message) {
	let i = 0;
	console.log(groups.length, message);
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

async function getContacts(client) {
  try {
    const result = await client.invoke(
      new Api.contacts.GetContacts({
        hash: 0, // 0 — чтобы получить полный список
      })
    );

    // result.users содержит список пользователей (контактов)
    const contacts = result.users.map(user => ({
      id: user.id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone
    }));

    return contacts;
  } catch (err) {
    console.error("Error getting contacts:", err);
    return [];
  }
}

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
	getContacts,
	sendMessageToGroups,
	getTodayDate
};
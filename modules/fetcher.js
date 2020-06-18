
// Find conversation ID using the conversations.list method
exports.fetchConversation = async (name) => {
	try {
		const result = await app.client.conversations.list({
			token: process.env.SLACK_BOT_TOKEN
		});

		for (var channel of result.channels) {
			if (channel.name === name) {
				var conversationId = channel.id;

				console.log('Found conversation ID: ' + conversationId);
				break;
			}
		}
		return conversationId;
	} catch (error) {
		console.error(error);
	}
};
/**
 * Scrapes a channel's messages
 * @param {string} channel_id - The id of the Slack channel to be scraped  
 * @returns {Array} the messages in the channel
 */
async function fetchHistory(channel_id) {
	let conversationHistory = [];
	let hasMore = true;
	let nextCursor = null;
	while (hasMore) {
		try {
			var result = await app.client.conversations.history({
				token: process.env.SLACK_BOT_TOKEN,
				channel: channel_id,
				cursor: nextCursor,
				limit: 100
			});
		} catch (error) {
			console.error(error);
		}
		hasMore = result.has_more;
		nextCursor = result.response_metadata.next_cursor;
		console.log(`has more: ${hasMore}`);
		conversationHistory = conversationHistory.concat(result.messages);
		console.log(`Appended ${result.messages.length} messages.
		Total size now ${conversationHistory.length}.`);
		
		console.log(conversationHistory.length + ' messages found in ' + channel_id);
	}
	return conversationHistory;
	
}

/**
 * Strips the user ID of Slack identifiers
 * @param {string} ID - the Slack user ID to be cleaned
 * @returns {string} - clean Slack user ID
 */
exports.cleanUserID = (ID) => {
	var cleanID = ID.substring (
		ID.lastIndexOf ('@') + 1 ,
		(ID.lastIndexOf ('|') == -1 ? ID.lastIndexOf ('>') : ID.lastIndexOf ('|') )   
	) ;
	return cleanID ;
};

/**
 * Filters Slack channel history on a per user basis 
 * @param {string} channel_id - ID of the Slack channel to be filtered
 * @param {string} user_id 	- ID of the Slack user
 * @returns {JSON} JSON object with keys: userID, userMessages, and messagesTimesamps
 */
exports.fetchMessagesForUser = async function fetchMessagesForUser ( channel_id, user_id ) {
	let conversation = await fetchHistory (channel_id);
	//console.log (conversation);
	let userJSON = {
		userID : user_id,
		userMessages : [],
		messagesTimestamps : []
	} ;
	for (let i = 0, n = conversation.length; i < n; i++) {
		let message = conversation[i] ;
		//console.log (JSON.stringify(message)) ;
		if (message.user === user_id && message.type === 'message' && !Object.prototype.hasOwnProperty.call(message , 'subtype')) {
			userJSON.userMessages.push(message.text) ; 
			userJSON.messagesTimestamps.push(message.ts);
		}
	}
	//console.log (JSON.stringify (userJSON));
	return userJSON ; 
};


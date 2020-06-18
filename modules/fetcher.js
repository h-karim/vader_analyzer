
// Find conversation ID using the conversations.list method
exports.fetchConversation = async (name) => {
	try {
		// Call the conversations.list method using the built-in WebClient
		const result = await app.client.conversations.list({
			// The token you used to initialize your app
			token: process.env.SLACK_BOT_TOKEN
		});

		for (var channel of result.channels) {
			if (channel.name === name) {
				var conversationId = channel.id;

				// Print result
				console.log('Found conversation ID: ' + conversationId);
				// Break from for loop
				break;
			}
		}
		return conversationId;
	} catch (error) {
		console.error(error);
	}
};

// Fetch conversation history using ID from last example
async function fetchHistory(channel_id) {
	let conversationHistory = [];
	let hasMore = true;
	let nextCursor = null;
	while (hasMore) {
		try {
			// Call the conversations.history method using the built-in WebClient
			var result = await app.client.conversations.history({
				// The token you used to initialize your app
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
		
		// Print results
		console.log(conversationHistory.length + ' messages found in ' + channel_id);
	}
	return conversationHistory;
	
}

exports.cleanUserID = (text) => {
	var userID = text.substring (
		text.lastIndexOf ('@') + 1 ,
		(text.lastIndexOf ('|') == -1 ? text.lastIndexOf ('>') : text.lastIndexOf ('|') )   
	) ;
	return userID ;
};

exports.fetchMessagesForUser = async function fetchMessagesForUser ( channel_id, user_id ) {
	let conversation = await fetchHistory (channel_id);
	//console.log (conversation);
	let userJSON = {
		userID : user_id,
		userMessages : [],
		messagesTimestamp : []
	} ;
	for (let i = 0, n = conversation.length; i < n; i++) {
		let message = conversation[i] ;
		//console.log (JSON.stringify(message)) ;
		if (message.user === user_id && message.type === 'message' && !Object.prototype.hasOwnProperty.call(message , 'subtype')) {
			userJSON.userMessages.push(message.text) ; 
			userJSON.messagesTimestamp.push(message.ts);
		}
	}
	//console.log (JSON.stringify (userJSON));
	return userJSON ; 
};


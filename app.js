require('dotenv').config();
const { cleanUserID, fetchMessagesForUser } = require('./modules/fetcher.js');
const { analyze } = require ('./modules/renderer.js');
const { App, ExpressReceiver } = require('@slack/bolt');

const receiver = new ExpressReceiver({ signingSecret: process.env.SLACK_SIGNING_SECRET });

// eslint-disable-next-line no-global-assign
app = new App({
	token: process.env.SLACK_BOT_TOKEN,
	receiver
});

receiver.router.get('/secret-page', (req, res) => {
	res.send('yay!');
});


app.command ('/vader_analyze', async ({payload, ack, say}) => {
	ack ();
	let analysisSubject = cleanUserID (payload.text.split()[0]) ;
	console.log(`analysis subject: ${analysisSubject}`);
	say ( `Sentiment analysis requested by <@${payload.user_id}> on <@${analysisSubject}>.` );
	let messages = await fetchMessagesForUser (payload.channel_id, analysisSubject);
	//console.log(`user messages: ${messages}`);
	messages = JSON.stringify(messages);
	console.log(messages);
	analyze(messages);
	


}); 





(async () => {
	// Start your app
	await app.start(3000);
	console.log('⚡️ Bolt app is running!');
  
})();

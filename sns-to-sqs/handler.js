// incoming events
// {
//   Records: [
//     {
//       ...
//       messageId: 'ff07301a-85d7-4e80-974f-021c729d1bb9',
//       messageAttributes: [Object],
//     }
//   ]
// }

function log(events) {
  const { Records = [] } = events;

  console.log(`received ${Records.length} event(s) from SNS`);
  console.log(events);
  
  Records.forEach(({ messageId, messageAttributes }) => {
    console.log({ messageId, messageAttributes });
  });
}

module.exports = {
  log,
};

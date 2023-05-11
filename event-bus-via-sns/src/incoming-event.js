/** incoming event

{
  Records: [
    {
      ...
      messageId: 'ff07301a-85d7-4e80-974f-021c729d1bb9',
      messageAttributes: {
        sourceSystem: {
          ...
          stringValue: 'order-service',
          dataType: 'String'
        },
      },
      body: { eventType: 'orderCancelled' },
    }
  ]
}

**/

export function handler(event) {
  const { Records } =  event;
  const [record] = Records; // lambda is configured to invoke the fn with one event at a time (batchSize = 1)
  const payload = JSON.parse(record.body)

  console.log(`Received the ${payload.eventType} event from order-service`);
  console.log(record)
}

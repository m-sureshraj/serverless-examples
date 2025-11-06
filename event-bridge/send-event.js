import {
  EventBridgeClient,
  PutEventsCommand,
} from "@aws-sdk/client-eventbridge";

const eventBridge = new EventBridgeClient();

const supportedEvent = {
  orderCreated: {
    orderId: "12345",
    amount: 99.99,
    currency: "USD",
  },
  transactionProcessed: {
    transactionId: "abcde",
    status: "SUCCESS",
    timestamp: "2024-01-01T12:00:00Z",
  },
  userSignedUp: {
    userId: "user789",
    signupMethod: "email",
    verified: true,
  },
  paymentFailed: {
    paymentId: "pay567",
    reason: "Insufficient funds",
    retryAvailable: false,
  },
}

export const handler = async (event) => {
  let data;
  try {
    data = JSON.parse(event.body ?? "{}");
  } catch (e) {
    return {
      statusCode: 400,
      body: "Invalid JSON in request body",
    };
  }

  const eventDetail = supportedEvent[data.eventType]
  if (!eventDetail) {
    return {
      statusCode: 400,
      body: `Unsupported event type: ${data.eventType}. Supported types are: [${Object.keys(supportedEvent).join(", ")}]`,
    };
  }

  const params = {
    Entries: [
      {
        Source: "prefix.myapp",
        DetailType: data.eventType, // What type of event it is
        Detail: JSON.stringify(eventDetail),
        EventBusName: process.env.EVENT_BUS_NAME,
      },
    ],
  };

  try {
    const result = await eventBridge.send(new PutEventsCommand(params));
    console.log("Event sent:", result);
    return { statusCode: 200, body: "Event sent successfully" };
  } catch (err) {
    console.error("Error sending event:", err);
    return { statusCode: 500, body: "Failed to send event" };
  }
};

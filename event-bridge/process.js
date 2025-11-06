export const handler = async (event) => {
  console.log("Event received:", event);

  if (event.detail.errorEvent) {
    throw new Error("Simulated error as per event detail.");
  }

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: "Go Serverless v4! Your function executed successfully!",
        input: event,
      },
    ),
  };
}

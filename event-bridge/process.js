export const handler = async (event) => {
  console.log("Event received:", event);

  if (event.detail.errorEvent) {
    throw new Error("Simulated error as per event detail.");
  }
}

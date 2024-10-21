export async function getDetailedErrors(parsedData) {
    console.log(parsedData)
  const errorDetails = parsedData.error.issues.map((issue) => ({
    field: issue.path[0],
    message: issue.message,
  }));
  return errorDetails;
}

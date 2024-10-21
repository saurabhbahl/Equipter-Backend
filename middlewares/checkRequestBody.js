export function verifyRequestBody(reqBody, requiredFields) {
  let missingFields = [];
  console.log(reqBody);

  requiredFields.forEach((field) => {
    if (
      !reqBody.hasOwnProperty(field) ||
      reqBody[field] === undefined ||
      reqBody[field] === null
    ) {
      missingFields.push(field);
    }
  });

  if (missingFields.length > 0) {
    return {
      msg: "These all feilds are required",
      missingFields,
    };
  } else {
    return null;
  }
}


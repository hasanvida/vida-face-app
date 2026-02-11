const { randomUUID } = require("crypto");

exports.handler = async (event) => {
  const { action, faceImage } = JSON.parse(event.body);

  // 1. Get token
  const tokenRes = await fetch(
    `${process.env.URL}/.netlify/functions/getToken`
  );
  const tokenData = await tokenRes.json();
  const token = tokenData.access_token;

  // 2. Build request body
  let body = {
    transactionId: randomUUID(),
    action: action,
    payload: { faceImage },
  };

  if (action === "search") {
    body.searchOptions = {
      threshold: 0.81,
      maxResult: 3,
    };
  }

  // 3. Call VIDA API
  const vidaRes = await fetch(
    "https://my-services-sandbox.np.vida.id/api/v1/face/blacklist",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    }
  );

  const result = await vidaRes.json();

  return {
    statusCode: 200,
    body: JSON.stringify(result),
  };
};

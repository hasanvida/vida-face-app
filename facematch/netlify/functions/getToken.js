exports.handler = async () => {
  const clientId = process.env.VIDA_CLIENT_ID;
  const clientSecret = process.env.VIDA_CLIENT_SECRET;

  const basicAuth = Buffer.from(
    `${clientId}:${clientSecret}`
  ).toString("base64");

  const response = await fetch(
    "https://qa-sso.vida.id/auth/realms/vida/protocol/openid-connect/token",
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${basicAuth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials&scope=roles",
    }
  );

  const data = await response.json();

  return {
    statusCode: 200,
    body: JSON.stringify(data),
  };
};

exports.handler = async function (event) {
  const params = new URLSearchParams(event.body);
  const email = params.get("email");
  const message = params.get("message") || "";

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const FROM_EMAIL = process.env.FROM_EMAIL;

  const askedAboutTracy =
    message.trim().toLowerCase() === "where is tracy maddison?";

  let emailPayload;

  if (askedAboutTracy) {
    emailPayload = {
      from: FROM_EMAIL,
      to: email,
      subject: "...",
      text: "You didn't hear this from me.",
      attachments: [
        {
          filename: "tracy.jpg",
          path: "https://ashbrookesparanormal.com/tracy.jpg",
        },
      ],
    };
  } else {
    emailPayload = {
      from: FROM_EMAIL,
      to: email,
      subject: "Re: Your Message",
      text: "You should not be talking to me.",
    };
  }

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(emailPayload),
  });

  return {
    statusCode: 200,
    body: "OK",
  };
};

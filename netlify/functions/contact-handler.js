exports.handler = async function (event) {
  console.log("=== FUNCTION TRIGGERED ===");
  console.log("Event body:", event.body);

  const params = new URLSearchParams(event.body);
  const email = params.get("email");
  const message = params.get("message") || "";

  console.log("Email:", email);
  console.log("Message:", message);

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const FROM_EMAIL = process.env.FROM_EMAIL;

  console.log("RESEND_API_KEY present:", !!RESEND_API_KEY);
  console.log("FROM_EMAIL:", FROM_EMAIL);

  const askedAboutTracy =
    message.trim().toLowerCase() === "where is tracy maddison?";

  console.log("Asked about Tracy:", askedAboutTracy);

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

  console.log("Sending email payload:", JSON.stringify(emailPayload));

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(emailPayload),
  });

  const responseText = await response.text();
  console.log("Resend status:", response.status);
  console.log("Resend response:", responseText);

  return {
    statusCode: 200,
    body: "OK",
  };
};

exports.handler = async function (event) {
  console.log("=== EMAIL REPLY TRIGGERED ===");
 
  const payload = JSON.parse(event.body);
  console.log("Event type:", payload.type);
 
  if (payload.type !== "email.received") {
    return { statusCode: 200, body: "OK" };
  }
 
  const replyToEmail = payload.data.from;
  console.log("Replying to:", replyToEmail);
 
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const FROM_EMAIL = process.env.FROM_EMAIL;
 
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: replyToEmail,
      subject: "NOTICE: Account Seized",
      text: `This email account has been seized by the Ashbrooke Police Department as part of an ongoing investigation.
 
Any further attempts to contact this address will be logged and may be used as evidence.
 
— Ashbrooke PD, Digital Crimes Unit`,
    }),
  });
 
  const responseText = await response.text();
  console.log("Resend status:", response.status);
  console.log("Resend response:", responseText);
 
  return { statusCode: 200, body: "OK" };
};
 

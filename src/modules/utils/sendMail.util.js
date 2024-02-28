import { createClient } from "redis";
import nodemailer from "nodemailer";

const publisher = createClient();
const subscriber = publisher.duplicate();

Promise.all([publisher.connect(), subscriber.connect()]);

// Send email using nodemailer
async function sendEmail(emailData) {
  try {
    // I am using ethereal site to create fake email
    // Link to the site - https://ethereal.email
    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: "harvey.kautzer56@ethereal.email",
        pass: "Uz6S9hEUQyQKRvrnTu",
      },
    });
    await transporter.sendMail(emailData);
    console.log("Email sent successfully:", emailData);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

// Listening to messages on the emailChannel
subscriber.subscribe("emailChannel", async (message) => {
  // console.log("message", message);
  const emailData = JSON.parse(message);
  await sendEmail(emailData);
});

export async function addToEmailQueue(emailDataArray) {
  try {
    const promises = emailDataArray.map((emailData) => {
      return new Promise((resolve, reject) => {
        publisher.publish("emailChannel", JSON.stringify(emailData), (err) => {
          if (err) reject(err);
          resolve();
        });
      });
    });
    await Promise.all(promises);
  } catch (error) {
    console.error("Error publishing messages to Redis:", error);
  }
}

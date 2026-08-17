// import nodemailer from "nodemailer";

// export const transporter = nodemailer.createTransport({
//   service: "gmail",

//   pool: true,
//   maxConnections: 5,
//   maxMessages: 100,

//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",

  pool: true,
  maxConnections: 5,
  maxMessages: 100,

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("❌ SMTP CONNECTION ERROR:", error);
  } else {
    console.log("✅ SMTP SERVER READY:", success);
  }
});

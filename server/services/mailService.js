export const sendMail = async ({ to, subject, text }) => {
  return {
    success: true,
    to,
    subject,
    text
  };
};

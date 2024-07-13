import React from "react";

const EmailTemplate = ({ firstName, message }) => (
  <div>
    <h1>Welcome, {firstName}!</h1>
    <p>{message}</p>
  </div>
);

export default EmailTemplate;

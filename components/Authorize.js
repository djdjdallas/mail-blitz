// components/Authorize.js
"use client";
import { useEffect, useState } from "react";

export default function Authorize() {
  const [authUrl, setAuthUrl] = useState("");

  useEffect(() => {
    const getAuthUrl = async () => {
      const response = await fetch("/api/auth-url");
      const data = await response.json();
      setAuthUrl(data.authorizationUrl);
    };

    getAuthUrl();
  }, []);

  const handleAuthorize = () => {
    if (authUrl) {
      window.location.href = authUrl;
    }
  };

  return (
    <div>
      <h1>Authorize Application</h1>
      <button onClick={handleAuthorize}>Authorize with Google</button>
    </div>
  );
}

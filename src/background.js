chrome.webRequest.onBeforeSendHeaders.addListener(
  (details) => {
    // 1. Find the Cookie header
    const cookieHeader = details.requestHeaders.find(
      (h) => h.name.toLowerCase() === 'cookie'
    );

    if (cookieHeader) {
      // 2. Parse the cookie string (format is "key1=val1; key2=val2")
      const cookies = cookieHeader.value.split('; ');
      const targetCookie = cookies.find(c => c.startsWith("TOKEN_NAME"));

      if (targetCookie) {
        const token = targetCookie.split('=')[1];
        console.log("Found Entra ID Token:", token);

        // 3. Save to storage
        chrome.storage.local.set({ lastToken: token });
      }
    }
  },
  { urls: ["PROTECTED_URL"] }, // Or put your specific URL here
  ["requestHeaders", "extraHeaders"] // 'extraHeaders' is CRITICAL to see cookies
);


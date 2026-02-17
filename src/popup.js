// popup.js
const copyBtn = document.getElementById('copyBtn');
const tokenBox = document.getElementById('tokenBox');
const status = document.getElementById('status');

// This function runs as soon as the popup opens
async function getEntraToken() {
  const targetUrl = "PROTECTED_URL"; // MUST match the domain the cookie belongs to

  chrome.cookies.get({ url: targetUrl, name: "TOKEN_NAME" }, (cookie) => {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
      status.innerText = "Error: " + chrome.runtime.lastError.message;
      return;
    }

    if (cookie) {
      tokenBox.value = cookie.value;
      status.innerText = "Token retrieved from cookies!";
      // Optionally save it to storage too
      chrome.storage.local.set({ lastToken: cookie.value });
    } else {
      status.innerText = "Cookie not found. Are you logged in?";
      status.style.color = "orange";
    }
  });
}

copyBtn.addEventListener('click', async () => {
  const textToCopy = tokenBox.value;

  if (!textToCopy) {
    status.innerText = "Nothing to copy!";
    return;
  }

  try {
    // The modern way to copy text
    await navigator.clipboard.writeText(textToCopy);
    
    // Visual feedback
    status.innerText = "Token Copied!";
    copyBtn.innerText = "✓ Copied";
    copyBtn.style.backgroundColor = "#4CAF50"; // Turn green
    
    // Reset button after 2 seconds
    setTimeout(() => {
      copyBtn.innerText = "Copy to Clipboard";
      copyBtn.style.backgroundColor = ""; 
    }, 2000);

  } catch (err) {
    console.error('Failed to copy: ', err);
    status.innerText = "Failed to copy.";
  }
});

// Initialize
getEntraToken();

// Add your Copy button logic here as well...
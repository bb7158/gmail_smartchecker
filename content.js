console.log("✅ Gmail Checker Loaded!");

// Track if confirmation is already shown
let confirmationShown = false;

document.addEventListener("click", async function (event) {
    let sendButton = event.target.closest("div[aria-label='Send ‪(Ctrl-Enter)‬']");
    
    if (sendButton && !confirmationShown) {
        event.preventDefault();  // Stop Gmail from instantly sending
        event.stopPropagation(); // Stop other scripts from interfering

        console.log("🚀 Send clicked! Checking email...");

        let emailBody = getEmailBody();
        if (!emailBody) {
            console.log("⚠️ No email body found!");
            return;
        }

        // Check spelling & grammar
        let { spellingMistakes, grammarMistakes } = await checkSpellingGrammar(emailBody);

        // Check for missing attachment
        let missingAttachment = checkForAttachments();

        // Show confirmation popup
        let userConfirmed = confirm(
            `📝 Spelling mistakes: ${spellingMistakes}\n🔤 Grammar mistakes: ${grammarMistakes}\n` +
            (missingAttachment ? "📎 No attachment detected!\n" : "") +
            "\nDo you want to send the email anyway?"
        );

        if (userConfirmed) {
            confirmationShown = true; // Prevent loop
            setTimeout(() => {
                sendButton.click(); // Let Gmail handle the send
                confirmationShown = false; // Reset for future emails
            }, 200); // Slight delay to prevent Gmail errors
        }
    }
}, true);

// Function to get email content
function getEmailBody() {
    let emailEditor = document.querySelector(".Am.Al.editable");
    return emailEditor ? emailEditor.innerText.trim() : "";
}

// Function to check spelling & grammar
async function checkSpellingGrammar(text) {
    let url = "https://api.languagetool.org/v2/check";
    let params = new URLSearchParams({ text: text, language: "en-US" });

    try {
        let response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: params.toString()
        });
        let data = await response.json();

        let spellingMistakes = data.matches.filter(match => match.rule.issueType === "misspelling").length;
        let grammarMistakes = data.matches.filter(match => match.rule.issueType === "grammar").length;

        return { spellingMistakes, grammarMistakes };
    } catch (error) {
        console.error("❌ Error checking grammar:", error);
        return { spellingMistakes: 0, grammarMistakes: 0 };
    }
}

// Function to check if an attachment is present
function checkForAttachments() {
    let attachmentIcons = document.querySelectorAll("[aria-label*='Attachment'], [title*='Attach']");
    return attachmentIcons.length === 0;
}

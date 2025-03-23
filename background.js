chrome.runtime.onInstalled.addListener(() => {
    console.log("🚀 Extension Installed and Running!");
});

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    if (request.action === "checkSpellingGrammar") {
        let url = "https://api.languagetool.org/v2/check";
        let params = new URLSearchParams({
            text: request.text,
            language: "en-US"
        });

        try {
            let response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: params.toString()
            });
            let data = await response.json();
            
            let spellingMistakes = data.matches.filter(match => match.rule.issueType === "misspelling").length;
            let grammarMistakes = data.matches.filter(match => match.rule.issueType === "grammar").length;

            sendResponse({ spellingMistakes, grammarMistakes });
        } catch (error) {
            console.error("❌ Error checking grammar:", error);
            sendResponse({ spellingMistakes: 0, grammarMistakes: 0 });
        }
        return true; // Keep the message channel open for async response
    }
});

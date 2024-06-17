export const translateText = async (text, targetLang) => {
  const response = await fetch("https://api.mymemory.translated.net/get", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    params: {
      q: text,
      langpair: `en|${targetLang}`,
    },
  });

  const data = await response.json();
  return data.responseData.translatedText;
};
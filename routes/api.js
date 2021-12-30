"use strict";

const Translator = require("../components/translator.js");

module.exports = function(app) {
  const translator = new Translator();

  app.route("/api/translate").post((req, res) => {
    const requiredFileds = ["text", "locale"];
    const availableTranslations = [
      "british-to-american",
      "american-to-british"
    ];
    //checking if all the fields exist
    requiredFileds.forEach(field => {
      if (!req.body.hasOwnProperty(field))
        return res.json({error: "Required field(s) missing"});
    });
    //extracting the values
    let {text, locale} = req.body;
    //checking if text and locale are valid
    if (typeof text !== "string" || text === "")
      return res.json({error: "No text to translate"});
    if (availableTranslations.indexOf(locale) === -1)
      return res.json({error: "Invalid value for locale field"});
    //rmv the space after the text
    if (/\s/.test(text[text.length - 1])) text = text.slice(0, text.length - 1);
    //translating from american to british
    let translation;
    if (locale === "american-to-british") {
      translation = translator.americanToBritish(text);
      translation = translator.highlightChange(translation);
    } else {
      translation = translator.britishToAmerican(text);
      translation = translator.highlightChange(translation);
    }
    //sending the response
    if (translation === text) translation = "Everything looks good to me!";
    else translation += "\n";
    return res.json({text: text + "\n", translation});
  });
};

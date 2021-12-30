const americanOnly = require("./american-only.js");
const americanToBritishSpelling = require("./american-to-british-spelling.js");
const americanToBritishTitles = require("./american-to-british-titles.js");
const britishOnly = require("./british-only.js");

class Translator {
  constructor() {
    this.changedWords = new Array();
  }
  /*
   *
   *                 translate from americanToBritish
   *
   */
  americanToBritish(text) {
    this.changedWords = [];
    const timepatt = /((\d)?\d\:\d\d)/;
    const ponctPatt = /(\.|\?|\!)/;

    let result = "";
    let tempRes = text;
    //rmv the . at the end
    let ptAtEnd = "";
    if (ponctPatt.test(tempRes[tempRes.length - 1])) {
      ptAtEnd = tempRes[tempRes.length - 1];

      tempRes = tempRes.slice(0, result.length - 1);
    }
    //checking if the word changes completly
    result = this.differentSpelling(americanOnly, tempRes);
    //cheking if the word has a different spelling
    const wordArr = result.split(" ");
    wordArr.forEach((word, index) => {
      const tempWord = word.toLowerCase();
      if (americanToBritishSpelling.hasOwnProperty(tempWord)) {
        wordArr[index] = americanToBritishSpelling[tempWord];
        this.changedWords.push(americanToBritishSpelling[tempWord]);
      } else if (americanToBritishTitles.hasOwnProperty(tempWord)) {
        const translatedWord = americanToBritishTitles[tempWord];
        this.changedWords.push(translatedWord);
        wordArr[index] =
          translatedWord[0].toUpperCase() + translatedWord.slice(1);
      }
      //cheking if the word represents time
      if (timepatt.test(word)) {
        wordArr[index] = word.replace(":", ".");
        this.changedWords.push(wordArr[index]);
      }
    });
    if (ptAtEnd.length > 0) result = wordArr.join(" ") + ptAtEnd;
    else result = wordArr.join(" ");
    return result;
  }

  /*
   *
   *                 translate from britishToAmerican
   *
   */
  britishToAmerican(text) {
    this.changedWords = [];
    let result = "";
    const timepatt = /((\d)?\d\.\d\d)/;
    const ponctPatt = /(\.|\?|\!)/;
    const britishWords = Object.values(americanToBritishSpelling);
    const britishTitles = Object.values(americanToBritishTitles);
    let tempRes = text;
    //rmv the . at the end
    let ptAtEnd = "";
    if (ponctPatt.test(tempRes[tempRes.length - 1])) {
      ptAtEnd = tempRes[tempRes.length - 1];
      tempRes = tempRes.slice(0, result.length - 1);
    }
    //checking if the word changes completly
    result = this.differentSpelling(britishOnly, tempRes);
    //cheking if the word has a different spelling
    const wordArr = result.split(" ");
    wordArr.forEach((word, i) => {
      word = word.toLowerCase();
      const tempword = word.toLowerCase();
      if (britishWords.indexOf(word) !== -1) {
        const translatedWord = Object.keys(americanToBritishSpelling).find(
          key => americanToBritishSpelling[key] === tempword
        );
        wordArr[i] = translatedWord;
        this.changedWords.push(word);
      }
      if (britishTitles.indexOf(word) !== -1) {
        const translatedWord = Object.keys(americanToBritishTitles).find(
          key => americanToBritishTitles[key] === tempword
        );
        wordArr[i] = translatedWord[0].toUpperCase() + translatedWord.slice(1);
        this.changedWords.push(word);
      }
      if (timepatt.test(word)) {
        const translatedWord = word.replace(".", ":");
        wordArr[i] = translatedWord;
        this.changedWords.push(translatedWord);
      }
    });
    if (ptAtEnd.length > 0) result = wordArr.join(" ") + ptAtEnd;
    else result = wordArr.join(" ");
    return result;
  }

  highlightChange(str) {
    this.changedWords.forEach(word => {
      const highlightWord = `<span class="highlight">${word}</span>`;
      str = str.replace(word, highlightWord);
    });
    return str;
  }

  differentSpelling(dict, tempRes) {
    let result = "";
    for (let word in dict) {
      if (tempRes.length === 0) break;
      const pattword = word + "(?!\\w)";
      const patt = new RegExp(pattword, "i");
      if (tempRes.search(patt) !== -1) {
        const indexOfChange = tempRes.search(word);
        this.changedWords.push(dict[word]);
        tempRes = tempRes.replace(patt, dict[word]);
        result += tempRes.slice(0, indexOfChange + dict[word].length);
        tempRes = tempRes.slice(indexOfChange + dict[word].length);
      }
    }
    if (tempRes.length > 0) result += tempRes;
    return result;
  }
}

module.exports = Translator;

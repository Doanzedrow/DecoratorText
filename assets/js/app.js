// Thay thế chuỗi thành 1 mảng riêng lẻ
String.prototype.unicodeAwareSplit = function () {
  let _arr = [];
  for (const _c of this.valueOf()) {
    _arr.push(_c);
  }
  return _arr;
};

class PseudoFont {
  constructor(fontName, fontLower, fontUpper, fontDigits) {
    this.fontName = fontName;

    this.fontLower = Array.isArray(fontLower)
      ? fontLower
      : fontLower.unicodeAwareSplit();
    this.fontUpper = Array.isArray(fontUpper)
      ? fontUpper
      : fontUpper.unicodeAwareSplit();
    this.fontDigits = Array.isArray(fontDigits)
      ? fontDigits
      : fontDigits.unicodeAwareSplit();

    this.referenceLower = "abcdefghijklmnopqrstuvwxyz";
    this.referenceUpper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    this.referenceDigits = "0123456789";
  }

  convert(rawText) {
    let _converted = "";
    for (const _char of rawText) {
      if (this.referenceLower.includes(_char)) {
        _converted += this.fontLower[this.referenceLower.indexOf(_char)];
      } else if (this.referenceUpper.includes(_char)) {
        _converted += this.fontUpper[this.referenceUpper.indexOf(_char)];
      } else if (this.referenceDigits.includes(_char)) {
        _converted += this.fontDigits[this.referenceDigits.indexOf(_char)];
      } else {
        _converted += _char;
      }
    }
    return _converted;
  }
}

var FONTGENERATOR = FONTGENERATOR || {};
var fonts = [];
var preInput = $("#pre-text");
var decoration = $("#decoration");
var beforeChecked = $("#beforeChecked");
var afterChecked = $("#afterChecked");
var multipleLine = $("#multiple_line");
var font = $("#font");
var inputText = $("#input-text");
var btnCopy = $(".btn-copy");
var btnCopyLink = $(".btn-copy-link");
var historyInput = $("#history");
var selectedValueDecoration = "";
var beforeSelectValue = "";
var afterSelectValue = "";
var newURL = "";
var selectedFont = "";
var preValue = "";
var convertValue = "";

$(document).ready(() => {
  FONTGENERATOR.fetchDataFont();

  btnCopyLink.on("click", function () {
    var currentHistory = historyInput.html();
    var urlToCopy = window.location.href;

    FONTGENERATOR.copyClipboard(urlToCopy);
    if (currentHistory !== "") {
      urlToCopy = "\n" + urlToCopy;
    }
    historyInput.html(currentHistory + urlToCopy);
  });

  btnCopy.on("click", function () {
    var currentHistory = historyInput.html();
    var preCopy = preInput.val();
    FONTGENERATOR.copyClipboard(preCopy);
    if (currentHistory !== "") {
      preCopy = "\n" + preCopy;
    }
    historyInput.html(currentHistory + preCopy);
  });

  inputText.on("input", function () {
    FONTGENERATOR.updateFontInput();
    FONTGENERATOR.updateInput();
    FONTGENERATOR.convertText();
    FONTGENERATOR.updateValues();
    FONTGENERATOR.updateURL();
  });

  decoration.on("change", function () {
    FONTGENERATOR.updateFontInput();
    FONTGENERATOR.updateInput();
    FONTGENERATOR.convertText();
    FONTGENERATOR.updateValues();
    FONTGENERATOR.updateURL();
  });
  font.on("change", function () {
    FONTGENERATOR.updateFontInput();
    FONTGENERATOR.updateInput();
    FONTGENERATOR.convertText();
    FONTGENERATOR.updateValues();
    FONTGENERATOR.updateURL();
  });

  beforeChecked.on("change", function () {
    FONTGENERATOR.updateFontInput();
    FONTGENERATOR.updateInput();
    FONTGENERATOR.convertText();
    FONTGENERATOR.updateValues();
    FONTGENERATOR.updateURL();
  });

  afterChecked.on("change", function () {
    FONTGENERATOR.updateFontInput();
    FONTGENERATOR.updateInput();
    FONTGENERATOR.convertText();
    FONTGENERATOR.updateValues();
    FONTGENERATOR.updateURL();
  });

  multipleLine.on("change", function () {
    FONTGENERATOR.updateFontInput();
    FONTGENERATOR.updateInput();
    FONTGENERATOR.convertText();
    FONTGENERATOR.updateValues();
    FONTGENERATOR.updateURL();
  });
});

FONTGENERATOR.initialValue = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const inputValueFromURL = urlParams.get("content");
  const fontStyleFromURL = urlParams.get("fontStyle");
  const decorationsFromURL = urlParams.get("decorations");
  const decorationsBeforeFromURL = urlParams.get("decorationsBefore");
  const decorationsAfterFromURL = urlParams.get("decorationsAfter");
  const multipleFromURL = urlParams.get("multiple");

  if (inputValueFromURL != null) {
    inputText.val(inputValueFromURL);
    font.val(fontStyleFromURL);

    if (decorationsFromURL != null) {
      decoration.val(decorationsFromURL);
    }
    beforeChecked.prop("checked", decorationsBeforeFromURL === "true");
    afterChecked.prop("checked", decorationsAfterFromURL === "true");
    multipleLine.prop("checked", multipleFromURL === "true");
  }
};

FONTGENERATOR.fetchDataFont = () => {
  fetch("assets/fonts/fonts.json")
    .then((response) => response.json())
    .then((_fontFiles) => {
      for (const _font of _fontFiles) {
        let _newFont = new PseudoFont(
          _font["fontName"],
          _font["fontLower"] || "abcdefghijklmnopqrstuvwxyz",
          _font["fontUpper"] || "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
          _font["fontDigits"] || "0123456789"
        );
        fonts.push(_newFont);
        let _newFontOption = document.createElement("option");
        _newFontOption.value = _newFont.fontName;
        _newFontOption.innerHTML = `${_newFont.fontName} (${_newFont.convert(
          _newFont.fontName
        )})  `;
        font.append(_newFontOption);
      }

      FONTGENERATOR.initialValue();
      FONTGENERATOR.updateFontInput();
      FONTGENERATOR.updateInput();
      FONTGENERATOR.convertText();
      FONTGENERATOR.updateValues();
    });
};
FONTGENERATOR.updateURL = () => {
  const inputValue = inputText.val();
  const decorationsBefore = beforeChecked.is(":checked");
  const decorationsAfter = afterChecked.is(":checked");
  if (inputValue.trim() !== "") {
    if (!decorationsBefore && !decorationsAfter) {
      newURL =
        window.location.href.split("?")[0] +
        `?content=${encodeURIComponent(inputValue)}` +
        `&fontStyle=${font.val()}`;
    } else {
      newURL =
        window.location.href.split("?")[0] +
        `?content=${encodeURIComponent(inputValue)}` +
        `&fontStyle=${font.val()}` +
        `&decorations=${decoration.val()}` +
        `&decorationsBefore=${decorationsBefore}` +
        `&decorationsAfter=${decorationsAfter}` +
        `&multiple=${multipleLine.is(":checked")}`;
    }
  } else {
    newURL = window.location.href.split("?")[0];
  }

  if (newURL !== window.location.href) {
    window.history.replaceState({}, document.title, newURL);
  }
};

FONTGENERATOR.updateFontInput = () => {
  selectedFont = fonts.find((fnt) => fnt.fontName === font.val());
};
FONTGENERATOR.convertText = () => {
  convertValue = selectedFont.convert(preValue);
};
FONTGENERATOR.updateInput = () => {
  let _preValue = inputText.val();
  preValue = _preValue;
};

FONTGENERATOR.updateValues = () => {
  selectedValueDecoration = decoration.find(":selected").text();
  beforeSelectValue = selectedValueDecoration + convertValue;
  afterSelectValue = convertValue + selectedValueDecoration;

  var lines = convertValue.split("\n");
  if (multipleLine.is(":checked")) {
    if (convertValue.trim() !== "") {
      var newData = lines.map(function (line) {
        var processedLine = line;
        if (beforeChecked.is(":checked") && afterChecked.is(":checked")) {
          processedLine =
            line !== null
              ? selectedValueDecoration + line + selectedValueDecoration
              : line;
        } else if (beforeChecked.is(":checked")) {
          processedLine = line !== null ? selectedValueDecoration + line : line;
        } else if (afterChecked.is(":checked")) {
          processedLine = line !== null ? line + selectedValueDecoration : line;
        }
        return processedLine !== null ? processedLine : null;
      });

      var finalData = newData.filter(function (item) {
        return item !== null && item !== undefined;
      });
      preInput.val(finalData.join("\n"));
    } else {
      preInput.val("");
    }
  } else {
    if (beforeChecked.is(":checked") && afterChecked.is(":checked")) {
      preInput.val(
        convertValue
          ? selectedValueDecoration + convertValue + selectedValueDecoration
          : ""
      );
    } else if (beforeChecked.is(":checked")) {
      preInput.val(convertValue ? beforeSelectValue : "");
    } else if (afterChecked.is(":checked")) {
      preInput.val(convertValue ? afterSelectValue : "");
    } else {
      preInput.val(convertValue ? convertValue : "");
    }
  }
};

FONTGENERATOR.copyClipboard = (valueCopy) => {
  navigator.clipboard
    .writeText(valueCopy)
    .then(function () {
      Toastify({
        text: `Copied ${valueCopy} to clipboard.`,
        duration: 3000,
        close: true,
        gravity: "bottom",
        positionLeft: false,
      }).showToast();
    })
    .catch(function (err) {
      console.error("Lỗi khi sao chép:", err);
    });
};

const assert = require("node:assert/strict");
const {readFileSync} = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const {runInNewContext} = require("node:vm");

const root = path.join(__dirname, "..");
const context = {window: {}};
runInNewContext(readFileSync(path.join(root, "dictionary.js"), "utf8"), context);
runInNewContext(readFileSync(path.join(root, "translator.js"), "utf8"), context);

const translator = context.window.NewspeakTranslator;

test("translates irregular English comparisons into Newspeak", () => {
  assert.equal(translator.enWordToNs("better"), "gooder");
  assert.equal(translator.enWordToNs("best"), "goodest");
  assert.equal(translator.enWordToNs("worse"), "ungooder");
  assert.equal(translator.enWordToNs("worst"), "ungoodest");
});

test("translates Newspeak comparisons back into English", () => {
  assert.equal(translator.nsWordToEn("gooder"), "better");
  assert.equal(translator.nsWordToEn("goodest"), "best");
  assert.equal(translator.nsWordToEn("ungooder"), "worse");
  assert.equal(translator.nsWordToEn("ungoodest"), "worst");
});

test("sentence translation uses the explicit comparative mappings", () => {
  const english = translator.translate("gooder, goodest, ungooder, ungoodest", "toEN");
  const newspeak = translator.translate("better, best, worse, worst", "toNS");

  assert.match(english.text, /^better, best, worse, worst\n/);
  assert.match(newspeak.text, /^gooder, goodest, ungooder, ungoodest\n/);
  assert.equal(english.unresolved.length, 0);
  assert.equal(newspeak.unresolved.length, 0);
});

test("translates Big Brother as the Newspeak abbreviation", () => {
  const result = translator.translate("Big Brother", "toNS");

  assert.match(result.text, /^BB\n/);
  assert.equal(result.unresolved.length, 0);
});

test("translates the sample sentence as compact Newspeak phrases", () => {
  const result = translator.translate(
    "i love english socialism, big brother protects me, i love big brother, i am a good party member, i do not commit thought crimes",
    "toNS"
  );

  assert.match(result.text, /^I love Ingsoc, BB protects me, I love BB, I goodthinker, I uncrimethink\n/);
  assert.equal(result.unresolved.length, 0);
});

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
const dictionary = context.window.NewspeakDictionary;

test("dictionary entries use coined Newspeak forms rather than English-identical labels", () => {
  const identityEntries = dictionary.ENTRIES.filter(entry =>
    entry.ns.trim().toLowerCase() === entry.en.trim().toLowerCase()
  );

  assert.equal(identityEntries.length, 0, JSON.stringify(identityEntries));
});

test("translates irregular English comparisons into Newspeak", () => {
  assert.equal(translator.enWordToNs("better"), "gooder");
  assert.equal(translator.enWordToNs("best"), "goodest");
  assert.equal(translator.enWordToNs("worse"), "ungooder");
  assert.equal(translator.enWordToNs("worst"), "ungoodest");
});

test("uses coined dictionary roots for irregular verbs and plurals", () => {
  assert.equal(translator.enWordToNs("run"), "speedgo");
  assert.equal(translator.enWordToNs("ran"), "speedgoed");
  assert.equal(translator.nsWordToEn("speedgoed"), "ran");
  assert.equal(translator.enWordToNs("think"), "mindwork");
  assert.equal(translator.enWordToNs("thought"), "mindworked");
  assert.equal(translator.nsWordToEn("mindworked"), "thought");
  assert.equal(translator.enWordToNs("people"), "humans");
  assert.equal(translator.nsWordToEn("humans"), "people");
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

test("preserves typographic punctuation while matching nearby phrases", () => {
  const result = translator.translate("Big Brother—privacy", "toNS");

  assert.match(result.text, /^BB—privacy\n/);
  assert.equal(result.unresolved.length, 1);
  assert.equal(result.unresolved[0], "privacy");
});

test("translates common vocabulary and regular -ies plurals", () => {
  const english = translator.translate("The people are happy because families matter.", "toNS");
  const newspeak = translator.translate("persons glad because kinsets happenstate.", "toEN");

  assert.match(english.text, /^The humans glad because kinsets happenstate\./);
  assert.equal(english.unresolved.length, 0);
  assert.match(newspeak.text, /^people happy because families \(plural\) matter\./);
  assert.equal(newspeak.unresolved.length, 0);
});

test("preserves sentence casing for translated words", () => {
  const english = translator.translate("Knowledge gives people power.", "toNS");
  const newspeak = translator.translate("Ingsoc protect persons.", "toEN");

  assert.match(english.text, /^Knowthink giftmakes humans commandforce\./);
  assert.match(newspeak.text, /^English Socialism protect people\./);
});

test("does not invent equivalents for deliberately removed concepts", () => {
  const result = translator.translate("Privacy and freedom are important.", "toNS");

  assert.match(result.text, /^Privacy and freedom bigmatter\./);
  assert.equal(result.unresolved.length, 2);
  assert.equal(result.unresolved[0], "Privacy");
  assert.equal(result.unresolved[1], "freedom");
});

test("translates the sample sentence as compact Newspeak phrases", () => {
  const result = translator.translate(
    "i love english socialism, big brother protects me, i love big brother, i am a good party member, i do not commit thought crimes",
    "toNS"
  );

  assert.match(result.text, /^I goodfeel Ingsoc, BB safekeeps me, I goodfeel BB, I goodthinker, I uncrimethink\n/);
  assert.equal(result.unresolved.length, 0);
});

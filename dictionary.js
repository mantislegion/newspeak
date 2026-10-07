window.NewspeakDictionary = (() => {
  const ENTRIES = [
    {ns:"ante", en:"before"},
    {ns:"artsem", en:"artificial insemination"},
    {ns:"BB / Big Brother", en:"supreme leader of Oceania / Party authority"},
    {ns:"bellyfeel", en:"blind, enthusiastic acceptance of an idea"},
    {ns:"blackwhite", en:"accepting something as true regardless of facts; accepting contradictory Party claims as true"},
    {ns:"crimestop", en:"stopping oneself from thinking unorthodox thoughts"},
    {ns:"crimethink", en:"thoughtcrime; anti-Party thought"},
    {ns:"dayorder", en:"order of the day"},
    {ns:"dep", en:"department"},
    {ns:"doubleplus", en:"extremely / superlatively (prefix)"},
    {ns:"doubleplusgood", en:"excellent / fantastic / extremely good"},
    {ns:"doubleplusungood", en:"terrible / horrible / extremely bad"},
    {ns:"doublethink", en:"simultaneously accepting contradictory beliefs"},
    {ns:"duckspeak", en:"automatic, unthinking political speech"},
    {ns:"equal", en:"equal in amount/quantity; NOT equal rights/freedom"},
    {ns:"facecrime", en:"facial expression suggesting disloyal thought"},
    {ns:"Ficdep", en:"Fiction Department of the Ministry of Truth"},
    {ns:"free", en:"without something; lacking/released from something, but not political or intellectual freedom"},
    {ns:"fullwise", en:"fully / completely / totally"},
    {ns:"goodthink", en:"politically orthodox thought"},
    {ns:"goodsex", en:"Party-approved sex for procreation within marriage"},
    {ns:"goodwise", en:"correctly / properly / in an orthodox manner"},
    {ns:"Ingsoc", en:"English Socialism; Party ideology"},
    {ns:"joycamp", en:"labor camp"},
    {ns:"malquoted", en:"inaccurately or treasonously represented Party words"},
    {ns:"malreported", en:"inaccurately reported / contradicting official truth"},
    {ns:"memory hole", en:"system for destroying inconvenient records"},
    {ns:"Miniluv", en:"Ministry of Love; law/order/compliance; Thought Police"},
    {ns:"Minipax", en:"Ministry of Peace; war/military operations"},
    {ns:"Miniplenty", en:"Ministry of Plenty; economic planning/rationing"},
    {ns:"Minitrue", en:"Ministry of Truth; propaganda and historical records"},
    {ns:"Newspeak", en:"official controlled language of Oceania"},
    {ns:"Oceania", en:"Party superstate"},
    {ns:"Oldspeak", en:"ordinary/standard English"},
    {ns:"oldthink", en:"ideas from before the Party / ideologically obsolete ideas"},
    {ns:"ownlife", en:"individualism or antisocial enjoyment of solitude"},
    {ns:"Party", en:"party / ruling political organization of Oceania"},
    {ns:"Pornosec", en:"pornography production section of Ficdep"},
    {ns:"privacy", en:"concept removed/revoked in Newspeak"},
    {ns:"prole", en:"proletarian / working-class person outside the Party"},
    {ns:"prolefeed", en:"entertainment/culture supplied to the proles"},
    {ns:"Recdep", en:"Records Department of Minitrue"},
    {ns:"rectify", en:"alter/correct a record to fit the official version"},
    {ns:"ref", en:"refer / reference"},
    {ns:"sec", en:"sector"},
    {ns:"sexcrime", en:"sex outside Party-approved rules"},
    {ns:"speakwrite", en:"machine that converts speech to writing"},
    {ns:"Teledep", en:"Telecommunications Department"},
    {ns:"telescreen", en:"two-way television/surveillance device"},
    {ns:"thinkpol / Thoughtpolice", en:"Thought Police"},
    {ns:"thoughtcrime", en:"same basic concept as crimethink"},
    {ns:"unperson", en:"person officially erased from history and memory"},
    {ns:"upsub", en:"submit upward to a higher authority"},
    {ns:"good", en:"good / positive / approved"},
    {ns:"ungood", en:"bad / negative"},
    {ns:"plusgood", en:"very good / great"},
    {ns:"plusungood", en:"very bad"},
    {ns:"goodthinkful", en:"orthodox in thought"},
    {ns:"goodthinking", en:"actively practicing orthodox thought"},
    {ns:"goodthinker", en:"person who practices goodthink"},
    {ns:"goodthinkwise", en:"in an orthodox manner"},
    {ns:"speedful", en:"fast / quick / rapid"},
    {ns:"unspeedful", en:"slow"},
    {ns:"speedwise", en:"quickly"},
    {ns:"unspeedwise", en:"slowly"},
    {ns:"carewise", en:"carefully"},
    {ns:"speedgo", en:"run"},
    {ns:"learnwork", en:"study"},
    {ns:"build", en:"make / create"},
    {ns:"giftmake", en:"give"},
    {ns:"herecarry", en:"bring"},
    {ns:"handget", en:"take"},
    {ns:"watergo", en:"swim"},
    {ns:"unlawtake", en:"steal"},
    {ns:"goodfeel", en:"love / affection"},
    {ns:"safekeep", en:"protect / guard"},
    {ns:"actdo", en:"commit / perform"},
    {ns:"groupperson", en:"member"},
    {ns:"human", en:"person"},
    {ns:"malehuman", en:"man"},
    {ns:"femalehuman", en:"woman"},
    {ns:"bodybase", en:"foot"},
    {ns:"mouthbone", en:"tooth"},
    {ns:"skybird", en:"goose"},
    {ns:"smallbeast", en:"mouse"},
    {ns:"workbeast", en:"ox"},
    {ns:"woolbeast", en:"sheep"},
    {ns:"deathcounter", en:"die"},
    {ns:"smallpest", en:"louse"},
    {ns:"kinset", en:"family / relatives"},
    {ns:"goodcomrade", en:"friend / companion"},
    {ns:"glad", en:"happy / glad"},
    {ns:"fearfeel", en:"afraid / fearful"},
    {ns:"bigmatter", en:"important / significant"},
    {ns:"happenstate", en:"matter / affair / situation"},
    {ns:"knowthink", en:"knowledge"},
    {ns:"commandforce", en:"power / authority"},
    {ns:"bigtown", en:"city"},
    {ns:"restplace", en:"home / house"},
    {ns:"earthrealm", en:"world"},
    {ns:"daycount", en:"time / duration"},
    {ns:"sunturn", en:"day"},
    {ns:"livestate", en:"life"},
    {ns:"labor", en:"work / job"},
    {ns:"eatstuff", en:"food"},
    {ns:"drinkstuff", en:"water / drink"},
    {ns:"youngperson", en:"child"},
    {ns:"kinmaker", en:"parent"},
    {ns:"kinmother", en:"mother"},
    {ns:"kinfather", en:"father"},
    {ns:"readslab", en:"book"},
    {ns:"saybit", en:"word"},
    {ns:"askthink", en:"question"},
    {ns:"reply", en:"answer"},
    {ns:"whycause", en:"reason"},
    {ns:"thinkseed", en:"idea"},
    {ns:"foreplan", en:"plan"},
    {ns:"law", en:"law / rule"},
    {ns:"pastmark", en:"record / document"},
    {ns:"partyfact", en:"truth / official fact"},
    {ns:"pastrecord", en:"history"},
    {ns:"saytone", en:"voice"},
    {ns:"pastthink", en:"memory / recollection"},
    {ns:"speakset", en:"language"},
    {ns:"learnhouse", en:"school"},
    {ns:"knowgain", en:"learn"},
    {ns:"mindhold", en:"know"},
    {ns:"mindwork", en:"think"},
    {ns:"mouthtalk", en:"say / speak"},
    {ns:"upsay", en:"tell / report"},
    {ns:"eyesee", en:"see"},
    {ns:"earfeel", en:"hear"},
    {ns:"wishfeel", en:"want / desire"},
    {ns:"musthave", en:"need / require"},
    {ns:"aid", en:"help / assist"},
    {ns:"rectify", en:"change / alter"},
    {ns:"eventcome", en:"happen / occur"},
    {ns:"mindagree", en:"believe / accept"},
    {ns:"pastrecall", en:"remember"},
    {ns:"memoryhole", en:"forget / erase from memory"},
    {ns:"inkmark", en:"write"},
    {ns:"eyeread", en:"read"},
    {ns:"lifehold", en:"live / exist"},
    {ns:"move", en:"go / travel"},
    {ns:"arrive", en:"come"},
    {ns:"locate", en:"find"},
    {ns:"fresh", en:"new"},
    {ns:"pretime", en:"old / earlier"},
    {ns:"large", en:"large / big"},
    {ns:"small", en:"small / little"},
    {ns:"right", en:"right / correct"},
    {ns:"wrong", en:"wrong / incorrect"},
    {ns:"plain", en:"clear"},
    {ns:"shortwise", en:"simple"},
    {ns:"canthink", en:"possible"},
    {ns:"factful", en:"real / genuine"},
    {ns:"guarded", en:"safe"},
    {ns:"forceful", en:"strong"}
  ];

  const PREFIXES = [
    {ns:"doubleplus", en:"extremely"}, {ns:"plus", en:"very"},
    {ns:"un", en:"not"}, {ns:"ante", en:"before"},
    {ns:"post", en:"after"}, {ns:"old", en:"old / pre-Party"},
    {ns:"mal", en:"wrongly / falsely"}, {ns:"good", en:"approved / orthodox"},
    {ns:"crime", en:"forbidden / unorthodox"}, {ns:"up", en:"upward"},
    {ns:"down", en:"downward"}
  ].sort((left, right) => right.ns.length - left.ns.length);

  function englishInflection(root, suffix) {
    if (suffix === "ing") {
      const base = /e$/i.test(root) && !/ee$/i.test(root) ? root.slice(0, -1) : root;
      if (/^[^aeiou]*[aeiou][^aeiouwxy]$/i.test(base)) return base + base.slice(-1) + "ing";
      return base + "ing";
    }
    if (suffix === "ed") {
      if (/[^aeiou]y$/i.test(root)) return root.slice(0, -1) + "ied";
      if (/e$/i.test(root)) return root + "d";
      return root + "ed";
    }
    if (suffix === "s" && /[^aeiou]y$/i.test(root)) return root.slice(0, -1) + "ies";
    if (suffix === "er" || suffix === "est") {
      if (/[^aeiou]y$/i.test(root)) return root.slice(0, -1) + (suffix === "er" ? "ier" : "iest");
      if (/e$/i.test(root)) return root + (suffix === "er" ? "r" : "st");
      if (/^[^aeiou]*[aeiou][^aeiouwxy]$/i.test(root)) return root + root.slice(-1) + suffix;
    }
    return root + suffix;
  }

  const SUFFIXES = [
    {ns:"wise", format:root => root + " (adverb)"},
    {ns:"ful", format:root => root + " (adjective)"},
    {ns:"est", format:root => englishInflection(root, "est") + " (superlative)"},
    {ns:"ing", format:root => englishInflection(root, "ing") + " (ongoing)"},
    {ns:"er", format:root => englishInflection(root, "er") + " (comparative/agent)"},
    {ns:"ed", format:root => englishInflection(root, "ed") + " (past tense)"},
    {ns:"es", format:root => root + "s (plural)"},
    {ns:"s", format:root => englishInflection(root, "s") + " (plural)"}
  ].sort((left, right) => right.ns.length - left.ns.length);

  const INTENSIFIER_PREFIX = {very:"plus", extremely:"doubleplus", not:"un"};
  const IRREGULARS = [
    ["thought","think","thinked"], ["gave","give","gived"], ["brought","bring","bringed"],
    ["spoke","speak","speaked"], ["took","take","taked"], ["swam","swim","swimmed"],
    ["stole","steal","stealed"], ["ran","run","runned"], ["drank","drink","drinked"]
  ];
  const IRREG_EN2NS = Object.create(null);
  const IRREG_NS2EN = Object.create(null);
  IRREGULARS.forEach(([englishPast, englishRoot, newspeakForm]) => {
    IRREG_EN2NS[englishPast] = newspeakForm;
    IRREG_NS2EN[newspeakForm] = englishPast;
    if (!IRREG_EN2NS[englishRoot]) IRREG_EN2NS[englishRoot] = englishRoot;
  });

  const IRREGULAR_COMPARATIVES = [
    ["better", "gooder"], ["best", "goodest"],
    ["worse", "ungooder"], ["worst", "ungoodest"]
  ];
  const COMPARATIVE_EN2NS = Object.create(null);
  const COMPARATIVE_NS2EN = Object.create(null);
  IRREGULAR_COMPARATIVES.forEach(([englishForm, newspeakForm]) => {
    COMPARATIVE_EN2NS[englishForm] = newspeakForm;
    COMPARATIVE_NS2EN[newspeakForm] = englishForm;
  });

  const STOPWORDS = new Set([
    "a","an","the","to","of","in","on","at","it","he","she","they","we","you","i",
    "that","this","and","or","but","for","with","as","his","her","its","me","him","them",
    "us","my","your","our","their","from","by","into","over","under","about","who","whom",
    "which","what","when","where","why","how","if","than","then","there","here","is","am",
    "are","was","were","be","being","been","do","does","did","have","has","had","can","could",
    "will","would","shall","should","may","might","must","not",
    "because","through","during","until","between","around","across",
    "against","among","within","without","while","although","since"
  ]);

  const IRREGULAR_NOUNS = [
    ["man","men","s"], ["woman","women","s"], ["child","children","s"],
    ["foot","feet","s"], ["tooth","teeth","s"], ["goose","geese","s"],
    ["mouse","mice","s"], ["ox","oxen","es"], ["sheep","sheep","s"],
    ["person","people","s"], ["die","dice","s"], ["louse","lice","s"]
  ];
  const IRREG_PLURAL_EN2NS = Object.create(null);
  const IRREG_PLURAL_NS2EN = Object.create(null);
  IRREGULAR_NOUNS.forEach(([root, englishPlural, suffix]) => {
    const newspeakPlural = root + suffix;
    IRREG_PLURAL_EN2NS[englishPlural] = newspeakPlural;
    IRREG_PLURAL_NS2EN[newspeakPlural] = englishPlural;
  });

  const ANTONYM_PAIRS = [
    ["hate","love"], ["enemy","friend"], ["dark","light"], ["weak","strong"],
    ["ugly","beautiful"], ["sad","glad"], ["stupid","smart"], ["coward","brave"], ["war","peace"]
  ];
  const ANTONYM_EN2NS = Object.create(null);
  const ANTONYM_NS2EN = Object.create(null);
  ANTONYM_PAIRS.forEach(([negative, positiveRoot]) => {
    const newspeakForm = "un" + positiveRoot;
    ANTONYM_EN2NS[negative] = newspeakForm;
    ANTONYM_NS2EN[newspeakForm] = negative;
  });

  const COPULAS = new Set(["is","am","are","was","were","be","being","been"]);
  const PHRASE_TRANSLATIONS = [
    ["big brother", "BB"],
    ["a good party member", "goodthinker"],
    ["good party member", "goodthinker"],
    ["thought crime", "thoughtcrime"],
    ["thought crimes", "crimethink"],
    ["commit thought crime", "crimethink"],
    ["commit thought crimes", "crimethink"]
  ];
  const RULES = [
    ["un-", "Negates a word.", "cold -> uncold; proceed -> unproceed (do not proceed)"],
    ["plus-", "Means 'very' or adds strong emphasis.", "good -> plusgood; ungood -> plusungood"],
    ["doubleplus-", "Means 'extremely' or replaces a superlative.", "good -> doubleplusgood; ungood -> doubleplusungood"],
    ["ante-", "Means 'before'.", "filing -> antefiling"],
    ["post-", "Means 'after'.", "filing -> postfiling"],
    ["up- / down-", "Indicates above or below a reference point, literally or figuratively.", "upsub = submit to a higher authority"],
    ["good- / crime-", "Marks ideological correctness or incorrectness.", "goodthink = orthodox thought; crimethink = anti-orthodox thought"],
    ["old-", "Marks things associated with the pre-Party era.", "oldspeak = English; oldthink = pre-Party ideas"],
    ["mal-", "Marks something the Party considers inaccurate or treasonous.", "malquote, malreport"],
    ["-ful", "Makes an adjective.", "goodthink -> goodthinkful; speed -> speedful"],
    ["-ed", "Regular past tense.", "think -> thinked; run -> runned"],
    ["-ing", "Present participle.", "think -> thinking; goodthink -> goodthinking"],
    ["-er", "Comparative, or a person who performs an action.", "good -> gooder; goodthink -> goodthinker"],
    ["-est", "Superlative.", "good -> goodest"],
    ["-s / -es", "Regular plural.", "man -> mans; ox -> oxes; life -> lifes"],
    ["-wise", "Forms an adverb.", "quick -> quickwise; careful -> carewise"]
  ];

  function buildIndices() {
    const newspeak = Object.create(null);
    const english = Object.create(null);
    ENTRIES.forEach(entry => {
      const newspeakForms = entry.ns.split("/").map(value => value.trim()).filter(Boolean);
      const newspeakKeys = newspeakForms.map(value => value.toLowerCase());
      const primaryGloss = entry.en.split(/[;]/)[0].split("/")[0].trim();
      newspeakKeys.forEach(key => {
        if (!Object.hasOwn(newspeak, key)) newspeak[key] = primaryGloss;
      });
      const glosses = entry.en.split(";").flatMap(clause => {
        if (/^\s*(?:not|no|never)\b/i.test(clause)) return [];
        return clause.split("/").map(value => value.trim().toLowerCase()).filter(Boolean);
      });
      glosses.forEach(gloss => {
        if (gloss.split(/\s+/).length <= 5 && !Object.hasOwn(english, gloss)) english[gloss] = newspeakForms[0];
      });
    });
    PHRASE_TRANSLATIONS.forEach(([phrase, newspeakForm]) => {
      english[phrase] = newspeakForm;
    });
    return {newspeak, english};
  }

  const indices = buildIndices();
  IRREGULARS.forEach(([englishPast, englishRoot, legacyNewspeakForm]) => {
    const newspeakRoot = indices.english[englishRoot] || englishRoot;
    const newspeakPast = englishInflection(newspeakRoot, "ed");
    delete IRREG_NS2EN[legacyNewspeakForm];
    IRREG_EN2NS[englishRoot] = newspeakRoot;
    IRREG_EN2NS[englishPast] = newspeakPast;
    IRREG_NS2EN[newspeakPast] = englishPast;
  });

  IRREGULAR_NOUNS.forEach(([englishRoot, englishPlural]) => {
    const newspeakRoot = indices.english[englishRoot] || englishRoot;
    const newspeakPlural = englishInflection(newspeakRoot, "s");
    IRREG_PLURAL_EN2NS[englishPlural] = newspeakPlural;
    IRREG_PLURAL_NS2EN[newspeakPlural] = englishPlural;
  });

  return {
    ENTRIES, PREFIXES, SUFFIXES, INTENSIFIER_PREFIX, IRREG_EN2NS, IRREG_NS2EN,
    STOPWORDS, IRREG_PLURAL_EN2NS, IRREG_PLURAL_NS2EN, ANTONYM_EN2NS,
    ANTONYM_NS2EN, COMPARATIVE_EN2NS, COMPARATIVE_NS2EN, COPULAS, RULES,
    NS_INDEX: indices.newspeak, EN_INDEX: indices.english
  };
})();

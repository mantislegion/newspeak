window.NewspeakTranslator = (() => {
  const dictionary = window.NewspeakDictionary;
  const {
    NS_INDEX, EN_INDEX, PREFIXES, SUFFIXES, IRREG_EN2NS, IRREG_NS2EN,
    IRREG_PLURAL_EN2NS, IRREG_PLURAL_NS2EN, ANTONYM_EN2NS, ANTONYM_NS2EN,
    COMPARATIVE_EN2NS, COMPARATIVE_NS2EN, STOPWORDS, COPULAS, INTENSIFIER_PREFIX
  } = dictionary;

  function nsWordToEn(word, depth = 0) {
    const lower = word.toLowerCase();
    if (IRREG_NS2EN[lower]) return IRREG_NS2EN[lower];
    if (ANTONYM_NS2EN[lower]) return ANTONYM_NS2EN[lower];
    if (COMPARATIVE_NS2EN[lower]) return COMPARATIVE_NS2EN[lower];
    if (IRREG_PLURAL_NS2EN[lower]) return IRREG_PLURAL_NS2EN[lower];
    if (NS_INDEX[lower]) return NS_INDEX[lower];
    if (depth >= 4) return null;

    for (const prefix of PREFIXES) {
      if (lower.startsWith(prefix.ns) && lower.length > prefix.ns.length) {
        const inner = nsWordToEn(lower.slice(prefix.ns.length), depth + 1);
        if (inner !== null) return prefix.en + " " + inner;
      }
    }
    for (const suffix of SUFFIXES) {
      if (lower.endsWith(suffix.ns) && lower.length > suffix.ns.length) {
        const stem = lower.slice(0, -suffix.ns.length);
        const candidates = [stem];
        if (["ing", "ed", "er", "est"].includes(suffix.ns) && /([b-df-hj-np-tv-z])\1$/i.test(stem)) {
          candidates.push(stem.slice(0, -1));
        }
        for (const candidate of candidates) {
          const inner = nsWordToEn(candidate, depth + 1);
          if (inner !== null) return suffix.format(inner);
        }
      }
    }
    return null;
  }

  function englishRootCandidates(stem, suffix) {
    const candidates = [stem];
    if (["ing", "ed", "er", "est"].includes(suffix)) {
      if (/([b-df-hj-np-tv-z])\1$/i.test(stem)) candidates.push(stem.slice(0, -1));
      if (/i$/i.test(stem)) candidates.push(stem.slice(0, -1) + "y");
      if (suffix === "ing" && !/e$/i.test(stem)) candidates.push(stem + "e");
      if (suffix === "ed" && !/e$/i.test(stem)) candidates.push(stem + "e");
    }
    return [...new Set(candidates)];
  }

  function inflectedNewspeak(root, suffix, englishStem, candidateRoot) {
    if (suffix === "ing" && candidateRoot !== englishStem && root === candidateRoot) {
      const match = englishStem.match(/([b-df-hj-np-tv-z])\1$/i);
      if (match && root.endsWith(match[1])) return root + match[1] + suffix;
    }
    return root + suffix;
  }

  function enWordToNs(word, depth = 0) {
    const lower = word.toLowerCase();
    if (IRREG_EN2NS[lower]) return IRREG_EN2NS[lower];
    if (ANTONYM_EN2NS[lower]) return ANTONYM_EN2NS[lower];
    if (COMPARATIVE_EN2NS[lower]) return COMPARATIVE_EN2NS[lower];
    if (IRREG_PLURAL_EN2NS[lower]) return IRREG_PLURAL_EN2NS[lower];
    if (EN_INDEX[lower]) return EN_INDEX[lower];
    if (depth >= 4) return null;

    if (lower.endsWith("ly") && lower.length > 2) {
      const inner = enWordToNs(lower.slice(0, -2), depth + 1);
      if (inner !== null) return inner + "wise";
    }

    for (const suffix of ["ing", "est", "ed", "er", "es", "s"]) {
      if (!lower.endsWith(suffix) || lower.length <= suffix.length) continue;
      const englishStem = lower.slice(0, -suffix.length);
      for (const candidateRoot of englishRootCandidates(englishStem, suffix)) {
        const inner = enWordToNs(candidateRoot, depth + 1);
        if (inner !== null) return inflectedNewspeak(inner, suffix, englishStem, candidateRoot);
      }
    }
    return null;
  }

  function nextWordIndex(tokens, index) {
    let cursor = index + 1;
    while (cursor < tokens.length && /^\s+$/.test(tokens[cursor])) cursor++;
    return cursor < tokens.length && /^[\p{L}\p{M}]+$/u.test(tokens[cursor]) ? cursor : -1;
  }

  function nextPredicateIndex(tokens, index) {
    let cursor = nextWordIndex(tokens, index);
    while (cursor >= 0 && ["a", "an", "the"].includes(tokens[cursor].toLowerCase())) {
      cursor = nextWordIndex(tokens, cursor);
    }
    return cursor;
  }

  function shouldDropCopula(tokens, index) {
    const predicateIndex = nextPredicateIndex(tokens, index);
    if (predicateIndex < 0) return false;
    const predicate = tokens[predicateIndex].toLowerCase();
    if (INTENSIFIER_PREFIX[predicate]) {
      const intensifiedIndex = nextWordIndex(tokens, predicateIndex);
      return intensifiedIndex >= 0 && enWordToNs(tokens[intensifiedIndex]) !== null;
    }
    return enWordToNs(predicate) !== null;
  }

  function translate(raw, direction) {
    if (!raw.trim()) return {text: "NO INPUT RECEIVED.", unresolved: []};
    const tokens = raw.match(/[\p{L}\p{M}]+|\s+|[^\p{L}\p{M}\s]/gu) || [];
    const isWord = token => /^[\p{L}\p{M}]+$/u.test(token);
    const unresolved = [];

    if (direction === "toNS") {
      const output = [];
      for (let index = 0; index < tokens.length; index++) {
        const token = tokens[index];
        if (!isWord(token)) {
          output.push(token);
          continue;
        }
        const lower = token.toLowerCase();
        let matchedPhrase = false;

        for (let span = 4; span >= 2; span--) {
          const phrase = tokens.slice(index, index + span * 2 - 1).join("").trim().toLowerCase().replace(/\s+/g, " ");
          if (EN_INDEX[phrase]) {
            output.push(EN_INDEX[phrase]);
            index += span * 2 - 2;
            matchedPhrase = true;
            break;
          }
        }
        if (matchedPhrase) continue;

        if (lower === "i") {
          output.push("I");
          continue;
        }

        if (["do", "does", "did"].includes(lower)) {
          const followingIndex = nextWordIndex(tokens, index);
          if (followingIndex >= 0 && tokens[followingIndex].toLowerCase() === "not") {
            if (tokens[index + 1] && /^\s+$/.test(tokens[index + 1])) index++;
            continue;
          }
        }

        if (COPULAS.has(lower) && shouldDropCopula(tokens, index)) {
          if (tokens[index + 1] && /^\s+$/.test(tokens[index + 1])) index++;
          continue;
        }

        if (lower === "not") {
          let matchedNegatedPhrase = false;
          for (let span = 4; span >= 2; span--) {
            const phrase = tokens.slice(index + 2, index + 2 + span * 2 - 1)
              .join("").trim().toLowerCase().replace(/\s+/g, " ");
            if (EN_INDEX[phrase]) {
              output.push("un" + EN_INDEX[phrase]);
              index += span * 2;
              matchedNegatedPhrase = true;
              break;
            }
          }
          if (matchedNegatedPhrase) continue;
        }

        if (INTENSIFIER_PREFIX[lower]) {
          const nextIndex = nextWordIndex(tokens, index);
          if (nextIndex === index + 2) {
            const nextWord = tokens[nextIndex];
            const inner = enWordToNs(nextWord);
            output.push(INTENSIFIER_PREFIX[lower] + (inner || nextWord.toLowerCase()));
            if (inner === null && !STOPWORDS.has(nextWord.toLowerCase())) unresolved.push(nextWord);
            index = nextIndex;
            continue;
          }
        }

        const translated = enWordToNs(token);
        if (translated !== null) {
          output.push(translated);
        } else {
          output.push(token);
          if (!STOPWORDS.has(lower)) unresolved.push(token);
        }
      }

      let result = output.join("");
      if (unresolved.length) result += "\n\n[UNRESOLVED - left as Oldspeak] " + [...new Set(unresolved)].join(", ");
      return {
        text: result + "\n\n[Note: word-by-word output from the reference. Adjust for Newspeak grammar as needed.]",
        unresolved: [...new Set(unresolved)]
      };
    }

    const output = tokens.map(token => {
      if (!isWord(token)) return token;
      const translated = nsWordToEn(token);
      if (translated !== null) return translated;
      if (!STOPWORDS.has(token.toLowerCase())) unresolved.push(token);
      return token;
    });
    let result = output.join("");
    if (unresolved.length) result += "\n\n[UNRESOLVED - left as Newspeak] " + [...new Set(unresolved)].join(", ");
    return {
      text: result + "\n\n[Note: unrecognized terms are left untouched. Context restores meaning.]",
      unresolved: [...new Set(unresolved)]
    };
  }

  return {enWordToNs, nsWordToEn, translate};
})();

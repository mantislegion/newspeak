(() => {
  const TAB_NAMES = ["lookup", "translate", "rules", "about"];
  const {ENTRIES, RULES} = window.NewspeakDictionary;

  function showTab(name, moveFocus = false) {
    TAB_NAMES.forEach(tab => {
      const button = document.getElementById("nav-" + tab);
      const panel = document.getElementById("tab-" + tab);
      const active = tab === name;
      button.classList.toggle("active", active);
      button.setAttribute("aria-selected", String(active));
      button.tabIndex = active ? 0 : -1;
      panel.hidden = !active;
    });
    if (moveFocus) document.getElementById("nav-" + name).focus();
  }

  function escapeHtml(value) {
    return value.replace(/[&<>\"]/g, character => ({"&":"&amp;", "<":"&lt;", ">":"&gt;", "\"":"&quot;"}[character]));
  }

  function highlight(text, query) {
    const index = text.toLowerCase().indexOf(query);
    if (!query || index < 0) return escapeHtml(text);
    return escapeHtml(text.slice(0, index)) + "<span class=\"hl\">" +
      escapeHtml(text.slice(index, index + query.length)) + "</span>" +
      escapeHtml(text.slice(index + query.length));
  }

  function addRow(entry, query, tbody) {
    const row = document.createElement("tr");
    row.innerHTML = "<td class=\"nsword\">" + (query ? highlight(entry.ns, query) : escapeHtml(entry.ns)) +
      "</td><td>" + (query ? highlight(entry.en, query) : escapeHtml(entry.en)) + "</td>";
    tbody.appendChild(row);
  }

  function ruleHint(query) {
    const hits = [];
    RULES.forEach(rule => {
      rule[0].replace(/ \/ /g, "|").split("|").forEach(key => {
        const affix = key.trim();
        if (affix.endsWith("-") && query.startsWith(affix.slice(0, -1)) && query.length > affix.length - 1) hits.push(rule[0] + ": " + rule[1]);
        if (affix.startsWith("-") && query.endsWith(affix.slice(1)) && query.length > affix.length - 1) hits.push(rule[0] + ": " + rule[1]);
      });
    });
    return hits.length ? "Possible affix match: " + escapeHtml(hits.slice(0, 3).join("  |  ")) : "";
  }

  function runSearch() {
    const query = document.getElementById("searchbox").value.trim().toLowerCase();
    const direction = document.getElementById("direction").value;
    const tbody = document.querySelector("#results tbody");
    tbody.replaceChildren();
    let count = 0;

    ENTRIES.forEach(entry => {
      const inNewspeak = entry.ns.toLowerCase().includes(query);
      const inEnglish = entry.en.toLowerCase().includes(query);
      const matches = !query || (direction === "both" && (inNewspeak || inEnglish)) ||
        (direction === "ns" && inNewspeak) || (direction === "en" && inEnglish);
      if (matches) {
        addRow(entry, query, tbody);
        count++;
      }
    });

    const hint = query ? ruleHint(query) : "";
    if (hint) {
      const row = document.createElement("tr");
      row.innerHTML = "<td colspan=\"2\" class=\"small\">" + hint + "</td>";
      tbody.appendChild(row);
    }
    if (query && count === 0 && !hint) {
      const row = document.createElement("tr");
      row.innerHTML = "<td colspan=\"2\">NO RECORD FOUND. The term may not exist in Newspeak, or it may have been rectified out of existence.</td>";
      tbody.appendChild(row);
    }
    document.getElementById("resultcount").textContent = query
      ? count + " match(es) found."
      : count + " entries in reference. Type to search.";
  }

  function renderRules() {
    const box = document.getElementById("rulelist");
    const rows = RULES.map(rule => "<tr><td class=\"nsword\">" + escapeHtml(rule[0]) +
      "</td><td>" + escapeHtml(rule[1]) + "</td><td>" + escapeHtml(rule[2]) + "</td></tr>").join("");
    box.innerHTML = "<table><thead><tr><th>AFFIX</th><th>MEANING</th><th>EXAMPLE</th></tr></thead><tbody>" + rows + "</tbody></table>";
  }

  async function translate() {
    const input = document.getElementById("transinput").value;
    const direction = document.getElementById("transdir").value;
    const mode = document.getElementById("transmode").value;
    const output = document.getElementById("output");
    const button = document.getElementById("translate-button");

    if (!input.trim()) {
      output.textContent = "NO INPUT RECEIVED.";
      renderUnresolved([]);
      return;
    }

    button.disabled = true;
    button.textContent = "TRANSLATING...";
    output.textContent = mode === "ai" ? "CONTACTING AI GATEWAY..." : "PROCESSING REFERENCE...";
    renderUnresolved([]);

    try {
      let result;
      if (mode === "reference") {
        result = window.NewspeakTranslator.translate(input, direction);
      } else {
        const response = await fetch("/api/translate", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({text: input, direction})
        });
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(payload.error || "The translation request failed.");
        result = payload;
      }

      if (typeof result.text !== "string" || !Array.isArray(result.unresolved)) {
        throw new Error("The translation service returned an invalid response.");
      }
      output.textContent = result.text;
      renderUnresolved(result.unresolved);
    } catch (error) {
      output.textContent = "TRANSLATION FAILED.\n" +
        (error instanceof Error ? error.message : "Check the connection and try again.");
    } finally {
      button.disabled = false;
      button.textContent = "TRANSLATE";
    }
  }

  function renderUnresolved(words) {
    const list = document.getElementById("unresolved-list");
    const container = document.getElementById("unresolved-words");
    list.replaceChildren();
    container.hidden = words.length === 0;
    words.forEach(word => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = 'Look up "' + word + '"';
      button.addEventListener("click", () => {
        showTab("lookup");
        document.getElementById("searchbox").value = word;
        runSearch();
        document.getElementById("searchbox").focus();
      });
      list.appendChild(button);
    });
  }

  async function copyOutput() {
    const output = document.getElementById("output").textContent;
    const status = document.getElementById("copy-status");
    if (!output) return;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(output);
      } else {
        const temporary = document.createElement("textarea");
        temporary.value = output;
        temporary.setAttribute("readonly", "");
        temporary.style.position = "fixed";
        temporary.style.opacity = "0";
        document.body.appendChild(temporary);
        temporary.select();
        const copied = document.execCommand("copy");
        temporary.remove();
        if (!copied) throw new Error("Clipboard unavailable");
      }
      status.textContent = "OUTPUT COPIED.";
    } catch {
      status.textContent = "COPY FAILED. Select and copy the output manually.";
    }
  }

  function initialize() {
    TAB_NAMES.forEach((name, index) => {
      const button = document.getElementById("nav-" + name);
      button.addEventListener("click", () => showTab(name));
      button.addEventListener("keydown", event => {
        let nextIndex = index;
        if (event.key === "ArrowRight") nextIndex = (index + 1) % TAB_NAMES.length;
        else if (event.key === "ArrowLeft") nextIndex = (index + TAB_NAMES.length - 1) % TAB_NAMES.length;
        else if (event.key === "Home") nextIndex = 0;
        else if (event.key === "End") nextIndex = TAB_NAMES.length - 1;
        else return;
        event.preventDefault();
        showTab(TAB_NAMES[nextIndex], true);
      });
    });

    document.getElementById("searchbox").addEventListener("input", runSearch);
    document.getElementById("direction").addEventListener("change", runSearch);
    document.getElementById("translate-button").addEventListener("click", translate);
    document.getElementById("swap-direction").addEventListener("click", () => {
      const direction = document.getElementById("transdir");
      direction.value = direction.value === "toNS" ? "toEN" : "toNS";
    });
    document.getElementById("copy-output").addEventListener("click", copyOutput);
    document.getElementById("clear-button").addEventListener("click", () => {
      document.getElementById("transinput").value = "";
      document.getElementById("output").textContent = "";
      document.getElementById("copy-status").textContent = "";
      renderUnresolved([]);
      document.getElementById("transinput").focus();
    });
    document.getElementById("transinput").addEventListener("keydown", event => {
      if ((event.ctrlKey || event.metaKey) && event.key === "Enter") translate();
    });

    showTab("lookup");
    runSearch();
    renderRules();
  }

  window.addEventListener("DOMContentLoaded", initialize);
})();

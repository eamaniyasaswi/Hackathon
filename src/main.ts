interface Topic {
  id: string;
  title: string;
  resource: string;
  url: string;
}

interface Phase {
  title: string;
  duration: string;
  description: string;
  topics: Topic[];
}

const phases: Phase[] = [
  {
    title: "Get comfortable with data",
    duration: "Weeks 1–3",
    description: "Build confidence with the tools you will use every day. Start with spreadsheets, then learn to think clearly about data.",
    topics: [
      { id: "spreadsheets", title: "Spreadsheets: formulas, sorting & filters", resource: "Google Sheets", url: "https://support.google.com/a/users/answer/9282959" },
      { id: "pivots", title: "Pivot tables & data cleaning", resource: "Excel training", url: "https://support.microsoft.com/en-us/excel" },
      { id: "data-types", title: "Data types, tables & tidy data", resource: "Tidy data", url: "https://vita.had.co.nz/papers/tidy-data.pdf" },
    ],
  },
  {
    title: "Ask better questions with SQL",
    duration: "Weeks 4–7",
    description: "Learn to retrieve and shape data from relational databases—the most transferable skill in an analyst's toolkit.",
    topics: [
      { id: "sql-select", title: "SELECT, WHERE, ORDER BY & LIMIT", resource: "SQLBolt", url: "https://sqlbolt.com/" },
      { id: "sql-joins", title: "Aggregations, GROUP BY & JOINs", resource: "Mode SQL", url: "https://mode.com/sql-tutorial/" },
      { id: "sql-advanced", title: "Subqueries, CTEs & window functions", resource: "PostgreSQL docs", url: "https://www.postgresql.org/docs/current/tutorial-window.html" },
    ],
  },
  {
    title: "Make sense of the numbers",
    duration: "Weeks 8–10",
    description: "Understand what the numbers can—and cannot—tell you. Focus on practical, decision-making statistics.",
    topics: [
      { id: "descriptive-stats", title: "Descriptive statistics & distributions", resource: "Khan Academy", url: "https://www.khanacademy.org/math/statistics-probability" },
      { id: "inference", title: "Sampling, confidence & hypothesis tests", resource: "StatQuest", url: "https://statquest.org/video-index/" },
      { id: "experiments", title: "Correlation, causation & A/B tests", resource: "Khan Academy", url: "https://www.khanacademy.org/math/statistics-probability/designing-studies" },
    ],
  },
  {
    title: "Let Python do the heavy lifting",
    duration: "Weeks 11–15",
    description: "Use Python to clean, explore, and repeat your analysis. You do not need to be a software engineer to get started.",
    topics: [
      { id: "python-basics", title: "Python basics, notebooks & functions", resource: "Kaggle Learn", url: "https://www.kaggle.com/learn/python" },
      { id: "pandas", title: "Pandas: load, clean & transform data", resource: "Pandas guide", url: "https://pandas.pydata.org/docs/getting_started/intro_tutorials/" },
      { id: "visualization", title: "Explore data with charts & plots", resource: "Seaborn", url: "https://seaborn.pydata.org/tutorial.html" },
    ],
  },
  {
    title: "Tell a story with dashboards",
    duration: "Weeks 16–19",
    description: "Turn analysis into clear visuals and useful dashboards. Choose one tool to start; the principles transfer.",
    topics: [
      { id: "visual-principles", title: "Chart choice, color & clear design", resource: "Data viz guide", url: "https://www.data-to-viz.com/" },
      { id: "powerbi", title: "Build a dashboard in Power BI", resource: "Microsoft Learn", url: "https://learn.microsoft.com/en-us/training/powerplatform/power-bi/" },
      { id: "tableau", title: "Explore Tableau Public & storytelling", resource: "Tableau training", url: "https://www.tableau.com/learn/training" },
    ],
  },
  {
    title: "Build proof, then make your move",
    duration: "Weeks 20–24",
    description: "Bring your skills together in projects that show how you think. Practice explaining your choices and findings.",
    topics: [
      { id: "portfolio-project", title: "Complete an end-to-end portfolio project", resource: "Kaggle datasets", url: "https://www.kaggle.com/datasets" },
      { id: "case-studies", title: "Practice business questions & case studies", resource: "StrataScratch", url: "https://www.stratascratch.com/" },
      { id: "career-ready", title: "Polish your portfolio, CV & interview stories", resource: "Forage", url: "https://www.theforage.com/" },
    ],
  },
];

const storageKey = "analyst-path-completed-topics";
function requiredElement<T extends Element>(selector: string): T {
  const element = document.querySelector<T>(selector);
  if (!element) throw new Error(`The roadmap page is missing ${selector}.`);  
  return element;  
}

const roadmapList = requiredElement<HTMLDivElement>("#roadmap-list");
const searchInput = requiredElement<HTMLInputElement>("#topic-search");
const emptyState = requiredElement<HTMLParagraphElement>("#empty-state");
const progressPercent = requiredElement<HTMLSpanElement>("#progress-percent");
const progressCaption = requiredElement<HTMLDivElement>("#progress-caption");
const progressBar = requiredElement<HTMLSpanElement>("#progress-bar");

function readCompletedTopics(): Set<string> {
  const saved = window.localStorage.getItem(storageKey);
  if (!saved) return new Set<string>();

  try {
    const parsed: unknown = JSON.parse(saved);
    if (!Array.isArray(parsed) || !parsed.every((item): item is string => typeof item === "string")) {
      throw new Error("Saved roadmap progress has an invalid format.");
    }
    return new Set(parsed);
  } catch (error) {
    if (error instanceof SyntaxError) {
      window.localStorage.removeItem(storageKey);
      return new Set<string>();
    }
    throw error;
  }
}

let completedTopics = readCompletedTopics();

function renderRoadmap(): void {
  roadmapList.innerHTML = phases.map((phase, phaseIndex) => {
    const phaseTopics = phase.topics.map((topic) => {
      const checked = completedTopics.has(topic.id);
      return `<label class="topic-item${checked ? " completed" : ""}">
        <input class="topic-check" type="checkbox" data-topic-id="${topic.id}"${checked ? " checked" : ""} aria-label="Mark ${topic.title} complete" />
        <span class="topic-name">${topic.title}</span>
        <a class="topic-resource" href="${topic.url}" target="_blank" rel="noreferrer" aria-label="Learn ${topic.title} with ${topic.resource}">${topic.resource} ↗</a>
      </label>`;
    }).join("");
    const completedInPhase = phase.topics.filter((topic) => completedTopics.has(topic.id)).length;
    const isOpen = phaseIndex === 0 ? " open" : "";

    return `<details class="phase-card"${isOpen} data-phase-index="${phaseIndex}">
      <summary class="phase-header">
        <span class="phase-number">${String(phaseIndex + 1).padStart(2, "0")}</span>
        <span class="phase-title-wrap">
          <span class="phase-overline">PHASE ${String(phaseIndex + 1).padStart(2, "0")} · ${phase.duration.toUpperCase()}</span>
          <span class="phase-title">${phase.title}</span>
          <span class="phase-meta">${phase.topics.length} topics · Free learning resources</span>
        </span>
        <span class="phase-progress"><strong>${completedInPhase}/${phase.topics.length}</strong> complete</span>
        <span class="phase-chevron" aria-hidden="true">⌄</span>
      </summary>
      <div class="phase-body">
        <p class="phase-description">${phase.description}</p>
        <div class="topic-list">${phaseTopics}</div>
      </div>
    </details>`;
  }).join("");

  updateProgress();
  filterRoadmap(searchInput.value);
}

function updateProgress(): void {
  const total = phases.reduce((count, phase) => count + phase.topics.length, 0);
  const completed = phases.reduce((count, phase) => (
    count + phase.topics.filter((topic) => completedTopics.has(topic.id)).length
  ), 0);
  const percent = Math.round((completed / total) * 100);
  progressPercent.textContent = String(percent);
  progressCaption.textContent = `${completed} of ${total} topics completed`;
  progressBar.style.width = `${percent}%`;

  document.querySelectorAll<HTMLDetailsElement>(".phase-card").forEach((card, phaseIndex) => {
    const phase = phases[phaseIndex];
    const count = phase?.topics.filter((topic) => completedTopics.has(topic.id)).length ?? 0;
    const progress = card.querySelector<HTMLElement>(".phase-progress strong");
    if (progress) progress.textContent = `${count}/${phase?.topics.length ?? 0}`;
  });
}

function filterRoadmap(query: string): void {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  let visibleCount = 0;

  document.querySelectorAll<HTMLDetailsElement>(".phase-card").forEach((card, phaseIndex) => {
    const phase = phases[phaseIndex];
    if (!phase) return;
    const matches = !normalizedQuery
      || phase.title.toLocaleLowerCase().includes(normalizedQuery)
      || phase.description.toLocaleLowerCase().includes(normalizedQuery)
      || phase.topics.some((topic) => topic.title.toLocaleLowerCase().includes(normalizedQuery)
        || topic.resource.toLocaleLowerCase().includes(normalizedQuery));
    card.hidden = !matches;
    if (normalizedQuery && matches) card.open = true;
    if (matches) visibleCount += 1;
  });
  emptyState.hidden = visibleCount > 0;
}

roadmapList.addEventListener("change", (event: Event) => {
  const target = event.target;
  if (!(target instanceof HTMLInputElement) || target.type !== "checkbox") return;

  const topicId = target.dataset.topicId;
  if (!topicId) return;
  if (target.checked) completedTopics.add(topicId);
  else completedTopics.delete(topicId);

  window.localStorage.setItem(storageKey, JSON.stringify([...completedTopics]));
  const topicItem = target.closest<HTMLElement>(".topic-item");
  topicItem?.classList.toggle("completed", target.checked);
  updateProgress();
});

searchInput.addEventListener("input", () => filterRoadmap(searchInput.value));
document.addEventListener("keydown", (event: KeyboardEvent) => {
  if (event.key === "/" && !(event.target instanceof HTMLInputElement) && !(event.target instanceof HTMLTextAreaElement)) {
    event.preventDefault();
    searchInput.focus();
  }
  if (event.key === "Escape" && document.activeElement === searchInput) {
    searchInput.value = "";
    filterRoadmap("");
    searchInput.blur();
  }
});

renderRoadmap();

const { useState, useEffect, useMemo, useCallback } = React;

const STORAGE_KEY = "notes-app-data";
const THEME_KEY = "notes-app-theme";

function createNote(title = "Untitled Note", content = "") {
  return {
    id: crypto.randomUUID(),
    title,
    content,
    updatedAt: Date.now(),
  };
}

function loadNotes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [createNote("Welcome", "Start writing your first note here.")];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0
      ? parsed
      : [createNote("Welcome", "Start writing your first note here.")];
  } catch {
    return [createNote("Welcome", "Start writing your first note here.")];
  }
}

function loadTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === "dark" || saved === "light") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

function formatDate(timestamp) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(timestamp);
}

function Icon({ name, className = "w-5 h-5" }) {
  const paths = {
    plus: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 4.5v15m7.5-7.5h-15"
      />
    ),
    trash: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
      />
    ),
    search: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
      />
    ),
    sun: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
      />
    ),
    moon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
      />
    ),
    menu: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
      />
    ),
    close: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18 18 6M6 6l12 12"
      />
    ),
    note: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
      />
    ),
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={className}
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

function NoteListItem({ note, isActive, onSelect }) {
  const preview = note.content.trim() || "No additional text";

  return (
    <button
      type="button"
      onClick={() => onSelect(note.id)}
      className={`w-full rounded-xl px-3 py-3 text-left transition-colors ${
        isActive
          ? "bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900"
          : "hover:bg-stone-100 dark:hover:bg-stone-800/80"
      }`}
    >
      <div className="flex items-start gap-2">
        <Icon
          name="note"
          className={`mt-0.5 h-4 w-4 shrink-0 ${
            isActive ? "opacity-80" : "text-stone-400 dark:text-stone-500"
          }`}
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{note.title || "Untitled Note"}</p>
          <p
            className={`note-preview mt-1 text-xs leading-relaxed ${
              isActive ? "opacity-75" : "text-stone-500 dark:text-stone-400"
            }`}
          >
            {preview}
          </p>
          <p
            className={`mt-2 text-[11px] ${
              isActive ? "opacity-60" : "text-stone-400 dark:text-stone-500"
            }`}
          >
            {formatDate(note.updatedAt)}
          </p>
        </div>
      </div>
    </button>
  );
}

function App() {
  const [notes, setNotes] = useState(loadNotes);
  const [activeId, setActiveId] = useState(() => loadNotes()[0]?.id ?? null);
  const [search, setSearch] = useState("");
  const [theme, setTheme] = useState(loadTheme);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const activeNote = notes.find((note) => note.id === activeId) ?? null;

  const filteredNotes = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return notes;

    return notes.filter(
      (note) =>
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query)
    );
  }, [notes, search]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    if (activeId && !notes.some((note) => note.id === activeId)) {
      setActiveId(notes[0]?.id ?? null);
    }
  }, [notes, activeId]);

  const updateActiveNote = useCallback((updates) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === activeId
          ? { ...note, ...updates, updatedAt: Date.now() }
          : note
      )
    );
  }, [activeId]);

  const handleCreate = () => {
    const note = createNote();
    setNotes((prev) => [note, ...prev]);
    setActiveId(note.id);
    setSearch("");
    setSidebarOpen(false);
  };

  const handleDelete = () => {
    if (!activeId || notes.length === 0) return;

    const index = notes.findIndex((note) => note.id === activeId);
    const nextNotes = notes.filter((note) => note.id !== activeId);

    if (nextNotes.length === 0) {
      const fresh = createNote();
      setNotes([fresh]);
      setActiveId(fresh.id);
      return;
    }

    const nextIndex = index >= nextNotes.length ? nextNotes.length - 1 : index;
    setNotes(nextNotes);
    setActiveId(nextNotes[nextIndex].id);
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <div className="flex h-full min-h-screen">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 z-30 bg-stone-900/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-80 max-w-[85vw] flex-col border-r border-stone-200 bg-white transition-transform duration-200 dark:border-stone-800 dark:bg-stone-900 lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="border-b border-stone-200 p-4 dark:border-stone-800">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold tracking-tight">Notes</h1>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                {notes.length} saved
              </p>
            </div>
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              className="rounded-lg border border-stone-200 p-2 text-stone-600 transition hover:bg-stone-100 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800"
            >
              <Icon name={theme === "dark" ? "sun" : "moon"} className="h-5 w-5" />
            </button>
          </div>

          <div className="relative">
            <Icon
              name="search"
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400"
            />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search notes..."
              className="w-full rounded-xl border border-stone-200 bg-stone-50 py-2.5 pl-10 pr-3 text-sm outline-none ring-stone-400 transition focus:border-stone-400 focus:ring-2 dark:border-stone-700 dark:bg-stone-950 dark:focus:border-stone-500"
            />
          </div>

          <button
            type="button"
            onClick={handleCreate}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-stone-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white"
          >
            <Icon name="plus" className="h-4 w-4" />
            Create New Note
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          {filteredNotes.length === 0 ? (
            <div className="rounded-xl border border-dashed border-stone-200 px-4 py-8 text-center text-sm text-stone-500 dark:border-stone-700 dark:text-stone-400">
              No notes match your search.
            </div>
          ) : (
            <div className="space-y-1">
              {filteredNotes.map((note) => (
                <NoteListItem
                  key={note.id}
                  note={note}
                  isActive={note.id === activeId}
                  onSelect={(id) => {
                    setActiveId(id);
                    setSidebarOpen(false);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-stone-200 px-4 py-3 dark:border-stone-800 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen((open) => !open)}
              aria-label="Toggle sidebar"
              className="rounded-lg border border-stone-200 p-2 text-stone-600 transition hover:bg-stone-100 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800 lg:hidden"
            >
              <Icon name={sidebarOpen ? "close" : "menu"} className="h-5 w-5" />
            </button>
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-stone-400 dark:text-stone-500">
                Editor
              </p>
              {activeNote && (
                <p className="text-sm text-stone-500 dark:text-stone-400">
                  Last edited {formatDate(activeNote.updatedAt)}
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={handleDelete}
            disabled={!activeNote}
            className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-red-900/60 dark:text-red-400 dark:hover:bg-red-950/40"
          >
            <Icon name="trash" className="h-4 w-4" />
            <span className="hidden sm:inline">Delete</span>
          </button>
        </header>

        {activeNote ? (
          <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-6 lg:px-8">
            <input
              type="text"
              value={activeNote.title}
              onChange={(e) => updateActiveNote({ title: e.target.value })}
              placeholder="Note title"
              className="mb-4 w-full border-none bg-transparent text-3xl font-semibold tracking-tight outline-none placeholder:text-stone-300 dark:placeholder:text-stone-600"
            />
            <textarea
              value={activeNote.content}
              onChange={(e) => updateActiveNote({ content: e.target.value })}
              placeholder="Start typing your note..."
              className="min-h-[420px] w-full flex-1 resize-none border-none bg-transparent text-base leading-7 text-stone-700 outline-none placeholder:text-stone-300 dark:text-stone-200 dark:placeholder:text-stone-600"
            />
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center px-6 text-center">
            <div>
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-100 text-stone-500 dark:bg-stone-900 dark:text-stone-400">
                <Icon name="note" className="h-7 w-7" />
              </div>
              <h2 className="text-lg font-medium">Select or create a note</h2>
              <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                Your notes are saved automatically in this browser.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

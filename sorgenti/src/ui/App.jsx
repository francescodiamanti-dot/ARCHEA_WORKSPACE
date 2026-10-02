// Ricostruito dal bundle fornito; comportamento originale conservato.
import { APP_VERSION } from "../config/version.js";
import * as jsxRuntime from "react/jsx-runtime";
import {
  CalendarIcon,
  FolderIcon,
  NoteIcon,
  ClockIcon,
} from "./components/icons.jsx";
import { useApp, AppProvider } from "./context.jsx";
import { SOURCE_LABELS, ProfileDialog } from "./dialogs/Profile.jsx";
import { Avatar } from "./components/common.jsx";
import { TodayScreen } from "./screens/Today.jsx";
import { ProjectsScreen } from "./screens/Projects.jsx";
import { NotesScreen } from "./screens/Notes.jsx";
import { HoursScreen } from "./screens/Hours.jsx";
import { TaskDetail } from "./dialogs/TaskDetail.jsx";
import { ProjectDetail } from "./dialogs/ProjectDetail.jsx";
import { NoteDetail } from "./dialogs/NoteDetail.jsx";
const APP_TABS = [
  ["oggi", "Oggi", CalendarIcon],
  ["progetti", "Progetti", FolderIcon],
  ["note", "Note", () => <NoteIcon />],
  ["ore", "Ore", ClockIcon],
];
function AppLayout() {
  const {
    data: data,
    viewer: viewer,
    tab: tab,
    setTab: setTab,
    overlay: overlay,
    open: open,
    loading: loading,
    error: error,
    reload: reload,
  } = useApp();
  return (
    <div className="app">
      <header className="top">
        <div className="brand">
          <span className="wordmark">{"ARCHEA"}</span>
          {data && (
            <span className={`src src-${data.meta.source}`}>
              {SOURCE_LABELS[data.meta.source]}
            </span>
          )}
        </div>
        {viewer && (
          <Avatar
            name={viewer.nome}
            size={44}
            onClick={() =>
              open({
                kind: "profile",
              })
            }
            label="Persona e origine dei dati"
          />
        )}
      </header>
      <main className="main">
        {error && (
          <div className="banner error" role="alert">
            {"Impossibile caricare i dati: "}
            {error}{" "}
            <button className="link" onClick={() => void reload()}>
              {"Riprova"}
            </button>
          </div>
        )}
        {data && (
          <div className="dataset-summary" role="status">
            <strong>{data.meta.source === 'excel' ? 'Il tuo Excel' : 'Dati dimostrativi'}</strong>
            <span>{data.progetti.length} progetti · {data.progetti.filter(project => project.stato === 'Attivo').length} attivi</span>
            {data.meta.source === 'excel' && <small>{data.meta.label.replace('Importazione statica: ', '')}</small>}
          </div>
        )}
        {loading && !data && <p className="empty">{"Caricamento…"}</p>}
        {data &&
          viewer &&
          (tab === "oggi" ? (
            <TodayScreen key={viewer.id} />
          ) : tab === "progetti" ? (
            <ProjectsScreen />
          ) : tab === "note" ? (
            <NotesScreen />
          ) : (
            <HoursScreen key={viewer.id} />
          ))}
        {data && (
          <p className="foot">
            {`v${APP_VERSION} · `}
            {data.meta.source === "demo"
              ? "Dati dimostrativi"
              : data.meta.label}
            {" · aggiornati alle "}
            {new Date(data.meta.loadedAt).toLocaleTimeString("it-IT", {
              hour: "2-digit",
              minute: "2-digit",
              timeZone: "Europe/Rome",
            })}
            {loading ? " · aggiornamento…" : ""}
          </p>
        )}
      </main>
      <nav className="tabbar" aria-label="Sezioni">
        {APP_TABS.map(([c, f, v]) => (
          <button
            className={tab === c ? "on" : ""}
            aria-current={tab === c ? "page" : void 0}
            onClick={() => setTab(c)}
            key={c}
          >
            {jsxRuntime.jsx(v, {})}
            <span>{f}</span>
          </button>
        ))}
      </nav>
      {(overlay == null ? void 0 : overlay.kind) === "task" && (
        <TaskDetail id={overlay.id} />
      )}
      {(overlay == null ? void 0 : overlay.kind) === "project" && (
        <ProjectDetail code={overlay.id} />
      )}
      {(overlay == null ? void 0 : overlay.kind) === "note" && (
        <NoteDetail id={overlay.id} />
      )}
      {(overlay == null ? void 0 : overlay.kind) === "profile" && (
        <ProfileDialog />
      )}
    </div>
  );
}
function App() {
  return (
    <AppProvider>
      <AppLayout />
    </AppProvider>
  );
}
export { APP_TABS, AppLayout, App };

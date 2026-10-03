// Ricostruito dal bundle fornito; comportamento originale conservato.
import { APP_VERSION } from "../config/version.js";
import * as jsxRuntime from "react/jsx-runtime";
import {
  CalendarIcon,
  FolderIcon,
  NoteIcon,
  ClockIcon,
  HelmetIcon,
  MoreIcon,
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
import { SiteScreen } from "./screens/Site.jsx";
import { CalendarScreen } from "./screens/Calendar.jsx";
import { BookingsScreen } from "./screens/Bookings.jsx";
import { InArcheaScreen } from "./screens/InArchea.jsx";
import { MoreScreen } from "./screens/More.jsx";
import { AccountingScreen } from "./screens/Accounting.jsx";
const APP_TABS = [
  ["oggi", "today", CalendarIcon],
  ["progetti", "projects", FolderIcon],
  ["note", "notes", () => <NoteIcon />],
  ["ore", "hours", ClockIcon],
  ["cantiere", "site", HelmetIcon],
  ["altro", "more", MoreIcon],
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
    t: t,
    language: language,
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
        {loading && !data && <p className="empty">{t('loading')}</p>}
        {data &&
          viewer &&
          (tab === "oggi" ? (
            <TodayScreen key={viewer.id} />
          ) : tab === "progetti" ? (
            <ProjectsScreen />
          ) : tab === "note" ? (
            <NotesScreen />
          ) : tab === "ore" ? (
            <HoursScreen key={viewer.id} />
          ) : tab === "cantiere" ? (
            <SiteScreen />
          ) : tab === "calendario" ? (
            <CalendarScreen />
          ) : tab === "prenota" ? (
            <BookingsScreen />
          ) : tab === "inarchea" ? (
            <InArcheaScreen />
          ) : tab === "contabilita" ? (
            <AccountingScreen />
          ) : (
            <MoreScreen />
          ))}
        {data && (
          <div className="dataset-summary dataset-summary-bottom" role="status">
            <strong>{data.meta.source === 'excel' ? t('yourExcel') : t('demoData')}</strong>
            <span>{data.progetti.length} {t('projects').toLowerCase()} · {data.progetti.filter(project => project.stato === 'Attivo').length} {t('active')}</span>
            {data.meta.source === 'excel' && <small>{data.meta.label.replace('Importazione statica: ', '')}</small>}
          </div>
        )}
        {data && (
          <p className="foot">
            {`v${APP_VERSION} · `}
            {data.meta.source === "demo"
              ? "Dati dimostrativi"
              : data.meta.label}
            {` · ${t('updated')} `}
            {new Date(data.meta.loadedAt).toLocaleTimeString(language === 'en' ? "en-GB" : "it-IT", {
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
            className={tab === c || (c === 'altro' && ['calendario','prenota','inarchea','contabilita'].includes(tab)) ? "on" : ""}
            aria-current={tab === c || (c === 'altro' && ['calendario','prenota','inarchea','contabilita'].includes(tab)) ? "page" : void 0}
            onClick={() => setTab(c)}
            key={c}
          >
            {jsxRuntime.jsx(v, {})}
            <span>{t(f)}</span>
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

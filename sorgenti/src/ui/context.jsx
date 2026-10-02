import React from "react";
import { todayInRome } from "../domain/dates.js";
import { demoAdapter } from "../data/adapters/demo.js";
import { importExcel } from "../data/adapters/excel.js";

const AppContext = React.createContext(null);
const useApp = () => React.useContext(AppContext);

function AppProvider({ children }) {
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [viewerId, setViewerId] = React.useState("fdiamanti");
  const [today, setToday] = React.useState(todayInRome());
  const [tab, setCurrentTab] = React.useState(location.hash.slice(2) || "oggi");
  const [overlay, setOverlay] = React.useState(null);
  const [noteProject, setNoteProject] = React.useState(null);

  const load = React.useCallback(async (loader) => {
    setLoading(true);
    setError(null);
    try {
      setData(await loader());
      setToday(todayInRome());
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    load(() => demoAdapter.load());
  }, [load]);
  React.useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible") setToday(todayInRome());
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, []);
  React.useEffect(() => {
    const closeOverlay = () => setOverlay(null);
    window.addEventListener("hashchange", closeOverlay);
    return () => window.removeEventListener("hashchange", closeOverlay);
  }, []);

  const viewer = React.useMemo(
    () =>
      data?.persone.find((person) => person.id === viewerId) ??
      data?.persone[0] ??
      null,
    [data, viewerId],
  );
  const value = {
    data,
    loading,
    error,
    viewer,
    setViewerId,
    today,
    tab,
    overlay,
    noteProject,
    setNoteProject,
    setTab(nextTab) {
      setCurrentTab(nextTab);
      setOverlay(null);
      history.replaceState(null, "", `#/${nextTab}`);
      window.scrollTo(0, 0);
    },
    open: setOverlay,
    close: () => setOverlay(null),
    // Excel remains a static in-memory snapshot, as in the supplied application.
    reload: () =>
      load(() =>
        !data || data.meta.source === "demo"
          ? demoAdapter.load()
          : Promise.resolve(data),
      ),
    importExcel: (file) => load(() => importExcel(file)),
    backToDemo: () => load(() => demoAdapter.load()),
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
export { AppContext, useApp, AppProvider };

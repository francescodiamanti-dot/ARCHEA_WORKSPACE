// Ricostruito dal bundle fornito; comportamento originale conservato.

const PERMISSIONS = {
  membersSeeAllProjects: true,
  membersSeeAllNotes: true,
  membersSeeOthersHours: false,
  membersSeeOthersTasks: false,
};
const PENDING_ACCESS_DECISIONS = [
  "Visibilità di progetti e note per i membri (ora: tutti, solo in demo).",
  'Se la colonna "Shared" debba avere un ruolo di autorizzazione (ora: nessuno).',
  "Se i membri possano vedere le task assegnate ad altri (ora: no).",
];
const EDITOR_ROLES = new Set(["senior_architect", "partner_architect"]);
const isManager = (e) => e.ruolo === "responsabile" || e.ruolo === "partner_architect" || e.appRole === "partner_architect";
const canEdit = (e) => Boolean(e && EDITOR_ROLES.has(e.appRole ?? e.ruolo));
function canSeeHours(e, t) {
  return isManager(e) || e.id === t.id || PERMISSIONS.membersSeeOthersHours;
}
function visibleTasks(e, t, n) {
  return isManager(e) || PERMISSIONS.membersSeeOthersTasks
    ? t
    : t.filter((r) => n(r, e));
}
const visibleProjects = (e, t) =>
  isManager(e) || PERMISSIONS.membersSeeAllProjects ? t : [];
const visibleNotes = (e, t) =>
  isManager(e) || PERMISSIONS.membersSeeAllNotes ? t : [];
export {
  PERMISSIONS,
  PENDING_ACCESS_DECISIONS,
  isManager,
  canSeeHours,
  visibleTasks,
  visibleProjects,
  visibleNotes,
  canEdit,
};

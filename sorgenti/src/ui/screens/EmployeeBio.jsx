import React from 'react';
import { useApp } from '../context.jsx';
import { EMPLOYEES, STUDIOS } from '../../data/property.js';
import { isProperty } from '../../config/permissions.js';
import { FileIcon, IdentityIcon } from '../components/icons.jsx';

function EmployeeBioScreen() {
  const { viewer, language, selectedEmployeeId, setSelectedEmployeeId } = useApp(); const en=language==='en';
  if(!isProperty(viewer))return <div className="access-denied"><h1>{en?'Restricted area':'Area riservata'}</h1></div>;
  const employees=Object.values(EMPLOYEES); const person=EMPLOYEES[selectedEmployeeId] ?? employees[0]; const studio=STUDIOS.find(item=>item.id===person.studio);
  const money=value=>value==null?'—':new Intl.NumberFormat(en?'en-GB':'it-IT',{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(value);
  return <><div className="property-title"><div><small>ARCHEA PROPERTY</small><h1>{en?'Employee bios':'Bio dipendenti'}</h1></div></div><label className="field-label">{en?'Employee':'Dipendente'}<select className="select-field" value={person.id} onChange={event=>setSelectedEmployeeId(event.target.value)}>{employees.map(item=><option value={item.id} key={item.id}>{item.name} · {STUDIOS.find(st=>st.id===item.studio)?.name}</option>)}</select></label><section className="bio-card"><div className="bio-head"><span><IdentityIcon /></span><div><h2>{person.name}</h2><p>{person.role} · {studio?.name}</p></div></div><dl><div><dt>{en?'Years at Archea':'Anni in Archea'}</dt><dd>{person.years ?? (en?'To be connected':'Da collegare')}</dd></div><div><dt>{en?'Role':'Ruolo ricoperto'}</dt><dd>{person.role}</dd></div><div><dt>{en?'Annual compensation':'Compenso annuo'}</dt><dd>{money(person.annualCompensation)}</dd></div><div><dt>{en?'Contract expiry':'Scadenza contratto'}</dt><dd>{person.expiresAt ?? '—'}</dd></div></dl><div className="bio-contract"><span><FileIcon /></span><div><b>{person.contract}</b><small>{en?'Employment contract · PDF':'Contratto di lavoro · PDF'}</small></div><button>{en?'Open':'Apri'}</button></div></section><p className="hint accounting-note">{en?'Demo profile: compensation and contract data are not real and must be connected to the protected HR source.':'Profilo dimostrativo: compensi e contratti non sono dati reali e dovranno essere collegati alla fonte HR protetta.'}</p></>;
}
export { EmployeeBioScreen };

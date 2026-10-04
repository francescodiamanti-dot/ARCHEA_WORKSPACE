import React from 'react';
import { useApp } from '../context.jsx';
import { EMPLOYEES, STUDIOS, PROJECT_GROUPS } from '../../data/property.js';
import { isProperty } from '../../config/permissions.js';
import { BottomSheet, SearchBox } from '../components/common.jsx';
import { FileIcon, IdentityIcon, ChevronDownIcon } from '../components/icons.jsx';
import { normalizeText } from '../../domain/normalize.js';

const roleKey = role => /partner/i.test(role) ? 'partner' : /senior/i.test(role) ? 'senior' : 'architect';
const ROLE_OPTIONS = [['architect','Architect'],['senior','Senior Architect'],['partner','Partner Architect']];

function EmployeeProfileCard({data,person,en=false,showHint=false}) {
  if(!person)return null;
  const studio=STUDIOS.find(item=>item.id===person.studio);
  const followedCodes=Object.entries(PROJECT_GROUPS).filter(([,groups])=>groups.some(group=>group.members.includes(person.id))).map(([code])=>code);
  const followedProjects=data.progetti.filter(project=>followedCodes.includes(project.codice));
  const showProjects=['senior','partner'].includes(roleKey(person.role));
  const money=value=>value==null?'—':new Intl.NumberFormat(en?'en-GB':'it-IT',{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(value);
  return <>
    <section className="bio-card"><div className="bio-head"><span><IdentityIcon /></span><div><h2>{person.name}</h2><p>{person.role} · {studio?.name}</p></div></div><dl><div><dt>{en?'Years at Archea':'Anni in Archea'}</dt><dd>{person.years??(en?'To be connected':'Da collegare')}</dd></div><div><dt>{en?'Role':'Ruolo ricoperto'}</dt><dd>{person.role}</dd></div><div><dt>{en?'Annual compensation':'Compenso annuo'}</dt><dd>{money(person.annualCompensation)}</dd></div><div><dt>{en?'Contract expiry':'Scadenza contratto'}</dt><dd>{person.expiresAt??'—'}</dd></div></dl><div className="bio-contract"><span><FileIcon /></span><div><b>{person.contract}</b><small>{en?'Employment contract · PDF':'Contratto di lavoro · PDF'}</small></div><button>{en?'Open':'Apri'}</button></div></section>
    {showProjects&&<section className="followed-projects"><div className="section-head"><h2>{en?'Projects followed':'Progetti seguiti'}</h2><span className="count">{followedProjects.length}</span></div><div>{followedProjects.map(project=><article key={project.codice}><b>{project.codice}</b><span>{project.nome}</span><small>{project.stato}</small></article>)}{!followedProjects.length&&<p className="empty">{en?'No assigned projects.':'Nessun progetto assegnato.'}</p>}</div></section>}
    {showHint&&<p className="hint accounting-note">{en?'Demo profile: compensation and contract data are not real and must be connected to the protected HR source.':'Profilo dimostrativo: compensi e contratti non sono dati reali e dovranno essere collegati alla fonte HR protetta.'}</p>}
  </>;
}

function EmployeeBioScreen() {
  const {data,viewer,language,selectedEmployeeId,setSelectedEmployeeId}=useApp(); const en=language==='en';
  const initialRole=roleKey(EMPLOYEES[selectedEmployeeId]?.role||'Architect');
  const [roleFilter,setRoleFilter]=React.useState(initialRole);
  const [rolePickerOpen,setRolePickerOpen]=React.useState(false);
  const [personPickerOpen,setPersonPickerOpen]=React.useState(false);
  const [search,setSearch]=React.useState('');
  if(!isProperty(viewer))return <div className="access-denied"><h1>{en?'Restricted area':'Area riservata'}</h1></div>;
  const filtered=Object.values(EMPLOYEES).filter(item=>roleKey(item.role)===roleFilter);
  const person=filtered.find(item=>item.id===selectedEmployeeId)??filtered[0];
  const roleLabel=ROLE_OPTIONS.find(([value])=>value===roleFilter)?.[1]??'Architect';
  const searchKey=normalizeText(search);
  const changeRole=value=>{setRoleFilter(value);const first=Object.values(EMPLOYEES).find(item=>roleKey(item.role)===value);if(first)setSelectedEmployeeId(first.id);setRolePickerOpen(false);};
  return <>
    <div className="property-title"><div><small>ARCHEA PROPERTY</small><h1>{en?'Staff':'Organico'}</h1></div></div>
    <label className="field-label">{en?'Role':'Ruolo'}</label>
    <button className="picker" onClick={()=>setRolePickerOpen(true)} aria-haspopup="dialog"><span>{roleLabel}</span><ChevronDownIcon /></button>
    <label className="field-label">{en?'Employee':'Dipendente'}</label>
    <button className="picker" onClick={()=>setPersonPickerOpen(true)} aria-haspopup="dialog"><span>{person.name} · {STUDIOS.find(studio=>studio.id===person.studio)?.name}</span><ChevronDownIcon /></button>
    <div className="bio-profile-content"><EmployeeProfileCard data={data} person={person} en={en} showHint /></div>
    {rolePickerOpen&&<BottomSheet title={en?'Filter by role':'Filtra per ruolo'} onClose={()=>setRolePickerOpen(false)}><div className="list tight">{ROLE_OPTIONS.map(([value,label])=><button className={`pick-row${value===roleFilter?' on':''}`} onClick={()=>changeRole(value)} key={value}><b>{label}</b><span>{Object.values(EMPLOYEES).filter(item=>roleKey(item.role)===value).length} {en?'people':'persone'}</span></button>)}</div></BottomSheet>}
    {personPickerOpen&&<BottomSheet title={en?'Choose employee':'Scegli dipendente'} onClose={()=>{setPersonPickerOpen(false);setSearch('');}}><SearchBox value={search} onChange={setSearch} placeholder={en?'Search employee or studio':'Cerca dipendente o studio'}/><div className="list tight">{filtered.filter(item=>!searchKey||normalizeText(`${item.name} ${STUDIOS.find(studio=>studio.id===item.studio)?.name}`).includes(searchKey)).map(item=><button className={`pick-row${item.id===person.id?' on':''}`} onClick={()=>{setSelectedEmployeeId(item.id);setPersonPickerOpen(false);setSearch('');}} key={item.id}><b>{item.name}</b><span>{item.role}</span><small>{STUDIOS.find(studio=>studio.id===item.studio)?.name}</small></button>)}</div></BottomSheet>}
  </>;
}
export { ROLE_OPTIONS, roleKey, EmployeeProfileCard, EmployeeBioScreen };

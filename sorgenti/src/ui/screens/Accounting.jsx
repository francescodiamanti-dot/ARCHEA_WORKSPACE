import React from 'react';
import { useApp } from '../context.jsx';
import { canEdit } from '../../config/permissions.js';
import { accountingFor } from '../../data/accounting.js';
import { FileIcon, PlusIcon } from '../components/icons.jsx';

const HOURLY_COST = 10;
const isoDate = value => value ? new Intl.DateTimeFormat('it-IT', { day:'2-digit', month:'short', year:'numeric' }).format(new Date(`${value}T12:00:00`)) : '—';
const paymentStatus = payment => payment.paid >= payment.expected ? 'complete' : payment.paid > 0 ? 'partial' : 'pending';

function AccountingScreen() {
  const { data, viewer, language } = useApp();
  const en = language === 'en';
  const activeProjects = data.progetti.filter(project => project.stato.toLowerCase() === 'attivo');
  const [projectCode, setProjectCode] = React.useState(activeProjects[0]?.codice || '');
  const project = activeProjects.find(item => item.codice === projectCode) ?? activeProjects[0];
  const [records, setRecords] = React.useState({});
  if (!canEdit(viewer)) return <div className="access-denied"><h1>{en ? 'Restricted area' : 'Area riservata'}</h1><p>{en ? 'Accounting is available to Senior Architects and Partner Architects.' : 'La contabilità è disponibile da Senior Architect in su.'}</p></div>;
  if (!project) return <p className="empty">{en ? 'No active project.' : 'Nessun progetto attivo.'}</p>;
  const accounting = records[project.codice] ?? accountingFor(project.codice);
  const formatMoney = value => new Intl.NumberFormat(en ? 'en-GB' : 'it-IT', { style:'currency', currency:'EUR', maximumFractionDigits:0 }).format(value);
  const projectHours = data.ore.filter(row => row.progettoCodice === project.codice).reduce((sum,row) => sum + (Number(row.ore) || 0), 0);
  const hoursCost = projectHours * HOURLY_COST;
  const paid = accounting.payments.reduce((sum,payment) => sum + payment.paid, 0);
  const receivable = Math.max(0, accounting.contract.value - paid);
  const totalExpenses = accounting.consultantExpenses + hoursCost;
  const expectedProfit = accounting.contract.value - totalExpenses;
  const cashBalance = paid - totalExpenses;
  const addPayment = () => {
    const amount = Number(prompt(en ? 'Payment amount (€)' : 'Importo pagamento (€)'));
    if (!(amount > 0)) return;
    const payment = { id: crypto.randomUUID(), label: en ? 'New payment' : 'Nuovo pagamento', dueAt: new Date().toISOString().slice(0,10), paidAt: null, expected: amount, paid: 0 };
    setRecords(current => ({ ...current, [project.codice]: { ...accounting, payments:[...accounting.payments, payment] } }));
  };
  return <>
    <div className="title-action"><div><h1 className="big title-row">{en ? 'Accounting' : 'Contabilità'}</h1><p className="sub">{en ? 'Contracts, payments and project margin' : 'Contratti, pagamenti e margine di commessa'}</p></div></div>
    <label className="field-label">{en ? 'Active project' : 'Progetto attivo'}<select className="select-field" value={project.codice} onChange={event => setProjectCode(event.target.value)}>{activeProjects.map(item => <option value={item.codice} key={item.codice}>{item.codice} · {item.nome}</option>)}</select></label>
    <section className="account-total"><small>{en ? 'PROJECT VALUE' : 'VALORE COMMESSA'}</small><b>{formatMoney(accounting.contract.value)}</b><span>{project.codice} · {project.nome}</span></section>
    <div className="account-kpis"><div><small>{en ? 'Collected' : 'Incassato'}</small><b>{formatMoney(paid)}</b></div><div><small>{en ? 'To collect' : 'Da incassare'}</small><b>{formatMoney(receivable)}</b></div><div><small>{en ? 'Expected margin' : 'Margine previsto'}</small><b className={expectedProfit < 0 ? 'negative' : ''}>{formatMoney(expectedProfit)}</b></div></div>
    <div className="section-head"><h2>{en ? 'Contract and client' : 'Contratto e cliente'}</h2></div>
    <article className="contract-card"><div className="contract-file"><span><FileIcon /></span><div><b>{accounting.contract.fileName}</b><small>{accounting.contract.signedAt ? `${en ? 'Signed' : 'Firmato'} ${isoDate(accounting.contract.signedAt)}` : (en ? 'Contract not uploaded' : 'Contratto non caricato')}</small></div><button>{en ? 'Open' : 'Apri'}</button></div><dl><div><dt>{en ? 'Client' : 'Cliente'}</dt><dd>{accounting.client.name}</dd></div><div><dt>{en ? 'VAT no.' : 'P. IVA'}</dt><dd>{accounting.client.vat}</dd></div><div><dt>Email</dt><dd>{accounting.client.contact}</dd></div><div><dt>{en ? 'Address' : 'Sede'}</dt><dd>{accounting.client.address}</dd></div></dl></article>
    <div className="section-head"><h2>{en ? 'Payment schedule' : 'Scadenziario pagamenti'}</h2><button className="link inline-add" onClick={addPayment}><PlusIcon />{en ? 'Add' : 'Aggiungi'}</button></div>
    <div className="payment-list">{accounting.payments.map(payment => { const status=paymentStatus(payment); const missing=Math.max(0,payment.expected-payment.paid); return <article className="payment-row" key={payment.id}><div className="payment-main"><span><b>{payment.label}</b><small>{en ? 'Due' : 'Scadenza'} · {isoDate(payment.dueAt)}</small></span><span className={`payment-status ${status}`}>{status === 'complete' ? (en?'Paid':'Pagato') : status === 'partial' ? (en?'Partial':'Parziale') : (en?'Due':'Da pagare')}</span></div><div className="payment-values"><span><small>{en?'Amount':'Importo'}</small><b>{formatMoney(payment.expected)}</b></span><span><small>{en?'Paid':'Pagato'}</small><b>{formatMoney(payment.paid)}</b></span><span><small>{en?'Missing':'Manca'}</small><b>{formatMoney(missing)}</b></span></div>{payment.paidAt && <small className="paid-date">{en?'Payment date':'Data pagamento'} · {isoDate(payment.paidAt)}</small>}</article>; })}{!accounting.payments.length && <p className="empty">{en ? 'No payment schedule entered.' : 'Nessuna scadenza inserita.'}</p>}</div>
    <div className="section-head"><h2>{en ? 'Costs and resources' : 'Costi e risorse'}</h2></div>
    <div className="cost-list"><div><span>{en ? 'Consultants and external expenses' : 'Consulenti e spese esterne'}</span><b>{formatMoney(accounting.consultantExpenses)}</b></div>{accounting.expenses.map(expense => <div className="cost-detail" key={expense.label}><span>{expense.label}</span><b>{formatMoney(expense.amount)}</b></div>)}<div><span>{en ? 'Team hours' : 'Ore lavorate dalle risorse'}<small>{projectHours.toLocaleString(en?'en-GB':'it-IT',{maximumFractionDigits:1})} h × {formatMoney(HOURLY_COST)}/h</small></span><b>{formatMoney(hoursCost)}</b></div></div>
    <section className="grand-total"><h2>{en ? 'Project total' : 'Totale commessa'}</h2><div><span>{en ? 'Turnover' : 'Fatturato'}</span><b>{formatMoney(accounting.contract.value)}</b></div><div><span>{en ? 'Total expenses' : 'Spese totali'}</span><b>− {formatMoney(totalExpenses)}</b></div><div className="grand-profit"><span>{en ? 'Expected profit' : 'Guadagno previsto'}</span><b>{formatMoney(expectedProfit)}</b></div><footer><span>{en ? 'Collected cash balance' : 'Saldo di cassa sugli incassi'}</span><b>{formatMoney(cashBalance)}</b></footer></section>
    <p className="hint accounting-note">{en ? `Demo accounting data. Hourly cost: ${formatMoney(HOURLY_COST)}/h. VAT and taxes excluded.` : `Dati contabili dimostrativi. Costo orario: ${formatMoney(HOURLY_COST)}/h. IVA e imposte escluse.`}</p>
  </>;
}
export { HOURLY_COST, paymentStatus, AccountingScreen };

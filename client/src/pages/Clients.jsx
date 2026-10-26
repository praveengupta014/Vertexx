import { Fragment } from 'react';
import { Testimonials } from '../components/home/Testimonials';
import { Card, PH, Sec } from '../ui';

export function Clients() {
  const CL = [['Karna Foods', 'Retail'], ['Nordvik Steel', 'Manufacturing'], ['Jaipur Logistics', 'Logistics'], ['Bluefin Retail', 'Retail'], ['Orbis Energy', 'Energy'], ['Apex Auto', 'Manufacturing'], ['Sahyadri Pharma', 'Manufacturing'], ['Meridian Freight', 'Logistics'], ['Solis Power', 'Energy'], ['Urbanleaf Stores', 'Retail'], ['Kestrel Cargo', 'Logistics'], ['Anvil Metals', 'Manufacturing']];
  return (<Fragment><PH t="Clients and achievements" s="The teams that trust us, and the results we have delivered together."/>
  <Sec><div className="grid grid-cols-2 gap-6 md:grid-cols-4">{[['450+', 'projects delivered'], ['98%', 'client retention'], ['36', 'countries'], ['12', 'industry awards']].map(([v, l]) => (<div key={l} className={Card + ' text-center'}><div className="font-head text-4xl font-extrabold text-brand">{v}</div><div className="text-mut">{l}</div></div>))}</div></Sec>
  <Sec t="Client portfolio" tint><div className="grid grid-cols-2 gap-4 md:grid-cols-4">{CL.map(([c, i]) => (<div key={c} className={Card + ' p-5'}><b className="font-head text-lg">{c}</b><p className="text-sm text-mut">{i}</p></div>))}</div></Sec>
  <Sec t="Awards and recognition"><div className="grid gap-4 md:grid-cols-3">{['Best Automation Partner, Logistics Forum India 2025', 'Green Operations Award 2024', 'Top 50 Industrial Innovators 2023'].map(a => (<div key={a} className={Card + ' flex gap-3'}><span className="text-2xl text-sig">★</span><b>{a}</b></div>))}</div></Sec>
  <Testimonials/></Fragment>);
}

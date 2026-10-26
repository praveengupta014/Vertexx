export const NAV = [['Services','services'],['Company','company'],['Clients','clients'],['AI Insights','insights'],['News','news'],['About','about']];

export const HIGHLIGHTS = [
  ['Engineered for uptime','Redundancy built in from day one, watched around the clock.','M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z'],
  ['One accountable partner','Design, delivery and support under a single team and contract.','M16 11a4 4 0 10-8 0M4 21a8 8 0 0116 0'],
  ['Built to scale','Modular platforms that grow from one site to a global network.','M4 17l5-5 4 4 7-8M15 8h5v5'],
];

export const SERVICES = [
  ['Automation consulting','Audit your operations and find the changes that pay back fastest.','M4 17l5-5 4 4 7-8'],
  ['System integration','Connect warehouse, plant and ERP data into one working picture.','M5 12h14M12 5v14'],
  ['Managed operations','We run and tune your systems so your team can focus on growth.','M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z'],
  ['Analytics and reporting','Dashboards that show cost, throughput and risk in plain terms.','M5 20V10M12 20V4M19 20v-7'],
];

export const STATS = [[28,'','years in operation',0],[450,'+','projects delivered',0],[36,'','countries served',0],[99.8,'%','average system uptime',1]];

export const SOLUTIONS = [
  ['Vertexx Flow','Warehouse automation','Orchestrates robots, conveyors and pickers to cut order cycle time.','Up to 38% faster fulfilment'],
  ['Vertexx Grid','Energy management','Tracks and balances power use across plants in real time.','Typical 17% lower energy cost'],
  ['Vertexx Trace','Supply chain visibility','Follows every shipment and flags delays before customers notice.','Exceptions found 3 days earlier'],
];

export const QUOTES = [
  ['Vertexx rebuilt our distribution network without a single day of lost shipments. The team felt like part of ours.','Priya Nambiar','COO, Karna Foods'],
  ['We cut energy spend across eleven plants in the first year. The reporting made it easy to prove to the board.','Martin Eklund','Head of Operations, Nordvik Steel'],
  ['Clear plans, honest timelines, and support that picks up on the first ring. That is rare.','Aarav Mehta','CTO, Jaipur Logistics'],
];

export const IND = ['Manufacturing', 'Retail', 'Logistics', 'Energy'];

export const mkI = (id, n, type, inds, p, wk, x, f) => ({ id, n, type, inds, p, wk, x, f: f.split('|') });

export const CAT = [
  mkI('audit', 'Automation consulting', 'Service', [0, 1, 2, 3], 6, 4, 'Audit your operations and map the changes that pay back fastest.', 'Process mapping|ROI model|90-day roadmap'),
  mkI('integration', 'System integration', 'Service', [0, 2], 18, 12, 'Connect warehouse, plant and ERP data into one working picture.', 'ERP connectors|API gateway|Data cleanup'),
  mkI('managed', 'Managed operations', 'Service', [0, 1, 2, 3], 12, 2, 'We run and tune your systems so your team can focus on growth.', '24/7 monitoring|Monthly tuning|On-call engineers'),
  mkI('analytics', 'Analytics and reporting', 'Service', [1, 2, 3], 8, 6, 'Dashboards that show cost, throughput and risk in plain terms.', 'Live dashboards|Forecasting|Board-ready reports'),
  mkI('flow', 'Vertexx Flow', 'Solution', [1, 2], 45, 16, 'Orchestrates robots, conveyors and pickers to cut order cycle time.', 'Robot orchestration|Pick optimisation|Up to 38% faster fulfilment'),
  mkI('grid', 'Vertexx Grid', 'Solution', [0, 3], 38, 14, 'Tracks and balances power use across plants in real time.', 'Live energy map|Load balancing|Typical 17% lower energy cost'),
  mkI('trace', 'Vertexx Trace', 'Solution', [1, 2], 28, 10, 'Follows every shipment and flags delays before customers notice.', 'Shipment tracking|Delay alerts|Exceptions found 3 days earlier'),
  mkI('vision', 'Vertexx Vision', 'Solution', [0, 1], 32, 12, 'Camera-based quality checks that catch defects on the line.', 'Defect detection|Line integration|Audit-ready reports'),
];

export const byId = id => CAT.find(c => c.id === id);

export const SEED = [['visit'], ['service', 'audit'], ['service', 'audit'], ['service', 'managed'], ['solution', 'grid'], ['industry', 'Energy']];

export const STAGES = ['New', 'Contacted', 'Proposal sent', 'Won'];

export const POSTS = [
  { id: 'robots', t: 'How robot-assisted picking cut cycle time by 38%', c: 'Case study', d: '12 Sep 2026', r: 5, x: 'Inside the Vertexx Flow rollout at a busy retail fulfilment hub.', b: ['The hub handled over 40,000 orders a day with manual picking and long walking routes. We mapped every route and found the slowest 15 percent of picks caused most delays.', 'Vertexx Flow now assigns work between robots and pickers in real time. Cycle time fell by 38 percent within one quarter, with no extra shifts.'] },
  { id: 'energy', t: 'Five ways plants waste power without knowing', c: 'Insights', d: '28 Aug 2026', r: 4, x: 'Idle motors, peak tariffs and other quiet costs worth checking first.', b: ['Most plants only see energy as a monthly bill. Live metering by line shows idle motors, compressed-air leaks and avoidable peak loads.', 'Starting with a one-week audit is usually enough to find savings of 10 to 20 percent without new machinery.'] },
  { id: 'iso', t: 'Vertexx renews ISO 27001 certification', c: 'Company news', d: '3 Aug 2026', r: 2, x: 'Our information security practices pass another independent audit.', b: ['Independent auditors reviewed our access controls, incident response and data handling across Jaipur, Pune and Rotterdam.', 'The renewal covers all managed operations and analytics services delivered to clients.'] },
  { id: 'intent', t: 'Why visitor intent matters for B2B sales teams', c: 'Insights', d: '15 Jul 2026', r: 4, x: 'Reading the path a buyer takes helps you follow up at the right moment.', b: ['A visitor who reads a service page, explores a solution and then opens the company profile is behaving very differently from one who bounces after the home page.', 'Tracking these steps lets sales teams reach out with the right offer while interest is high.'] },
];

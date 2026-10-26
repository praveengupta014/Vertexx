import { useEffect, useState, Fragment } from 'react';
import { track } from '../store';
import { Card, PH, Sec } from '../ui';

import controlRoomImg from '../assets/gallery/control_room.jpg';
import robotFloorImg from '../assets/gallery/robot_floor.jpg';
import teamOffsiteImg from '../assets/gallery/team_offsite.jpg';
import clientHandoverImg from '../assets/gallery/client_handover.jpg';
import testLabImg from '../assets/gallery/test_lab.jpg';
import awardNightImg from '../assets/gallery/award_night.jpg';

export function Company() {
  useEffect(() => { track('company'); }, []);
  const [activeImg, setActiveImg] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setActiveImg(null);
    };
    if (activeImg !== null) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeImg]);

  const L = [['Rajesh Mehra', 'Founder and Chairman', 'Built Vertexx from a six-person workshop into a global group.'], ['Meera Iyer', 'Chief Executive Officer', 'Leads strategy and delivery across 36 countries.'], ['Dr. Arjun Rao', 'Chief Technology Officer', 'Heads the Flow, Grid, Trace and Vision labs.'], ['Neha Sharma', 'Chief Operating Officer', 'Runs the 24/7 managed operations centre.']];
  const M = [['1998', 'Founded in Jaipur'], ['2006', 'First international project in Dubai'], ['2012', 'Launched managed operations'], ['2018', 'Vertexx Flow released'], ['2022', 'Crossed 300 projects'], ['2025', '450+ projects in 36 countries']];
  
  const G = [
    {
      title: 'Control room',
      tag: 'Telemetry & Ops',
      location: 'Austin, TX',
      desc: '24/7 operations and real-time automation telemetry monitored by our US operations engineers.',
      img: controlRoomImg,
    },
    {
      title: 'Robot floor',
      tag: 'Robotics Engineering',
      location: 'Detroit, MI',
      desc: 'Robotics engineers and automation specialists programming high-speed articulated assembly arms.',
      img: robotFloorImg,
    },
    {
      title: 'Team offsite',
      tag: 'Culture & Strategy',
      location: 'Aspen, CO',
      desc: 'US engineering leads and strategic planners collaborating during our annual team offsite.',
      img: teamOffsiteImg,
    },
    {
      title: 'Client handover',
      tag: 'Executive Delivery',
      location: 'Chicago, IL',
      desc: 'Client executives and project directors celebrating successful system delivery and handover.',
      img: clientHandoverImg,
    },
    {
      title: 'Test lab',
      tag: 'Hardware R&D',
      location: 'Boston, MA',
      desc: 'R&D specialists and electronics engineers inspecting sensor prototypes and robotic subsystems.',
      img: testLabImg,
    },
    {
      title: 'Award night',
      tag: 'Recognition',
      location: 'New York, NY',
      desc: 'Vertexx corporate and technical team honored at the American Industry Excellence Awards gala.',
      img: awardNightImg,
    },
  ];

  return (
    <Fragment>
      <PH t="Company profile and leadership" s="Who we are, what we stand for and the people who lead Vertexx."/>
      
      <Sec>
        <div className="grid gap-6 md:grid-cols-2">
          {[['Our vision', 'To be the most trusted automation partner for operations that cannot afford to stop.'], ['Our mission', 'Deliver systems that make every operation faster, safer and cheaper to run, and stay accountable for the result.']].map(([t, x]) => (
            <div key={t} className={Card + ' bg-gradient-to-br from-[#0a3a3e] to-[#0f5257] text-white'}>
              <h2 className="font-head text-2xl font-bold">{t}</h2>
              <p className="mt-3 text-teal-50">{x}</p>
            </div>
          ))}
        </div>
      </Sec>

      <Sec t="Leadership" tint>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {L.map(([n, r, x]) => (
            <article key={n} className={Card}>
              <div className="grid h-16 w-16 place-items-center rounded-full bg-brand font-head text-2xl font-bold text-white">
                {n.replace('Dr. ', '')[0]}
              </div>
              <h3 className="mt-4 font-head text-lg font-bold">{n}</h3>
              <p className="text-sm font-semibold text-brand">{r}</p>
              <p className="mt-2 text-sm text-mut">{x}</p>
            </article>
          ))}
        </div>
      </Sec>

      <Sec t="Certifications">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {['ISO 9001:2015 Quality', 'ISO 14001 Environment', 'ISO 27001 Information security', 'ISO 45001 Health and safety'].map(x => (
            <div key={x} className={Card + ' flex items-center gap-3 p-5'}>
              <span className="grid h-9 w-9 place-items-center rounded-full bg-emerald-500/15 text-emerald-600">✓</span>
              <b>{x}</b>
            </div>
          ))}
        </div>
      </Sec>

      <Sec t="Infrastructure" tint>
        <div className="grid gap-6 md:grid-cols-3">
          {[['Engineering centre, Jaipur', '220 engineers and a full test floor'], ['Operations centre, Pune', '24/7 monitoring for 140 live sites'], ['Innovation lab, Rotterdam', 'Robotics and vision prototyping']].map(([t, x]) => (
            <div key={t} className={Card}>
              <h3 className="font-head text-xl font-bold">{t}</h3>
              <p className="mt-2 text-mut">{x}</p>
            </div>
          ))}
        </div>
      </Sec>

      <Sec t="Business milestones">
        <ol className="max-w-2xl border-l-2 border-line pl-6">
          {M.map(([y, x]) => (
            <li key={y} className="relative pb-7">
              <span className="absolute -left-[31px] top-1.5 h-3 w-3 rounded-full bg-sig ring-4 ring-bg"></span>
              <b className="font-head text-xl">{y}</b>
              <p className="text-mut">{x}</p>
            </li>
          ))}
        </ol>
      </Sec>

      <Sec t="Media gallery" tint>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {G.map((item, idx) => (
            <figure
              key={item.title}
              onClick={() => setActiveImg(idx)}
              className="group relative flex h-60 cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border border-line/70 bg-surface shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-sig"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setActiveImg(idx); }}
              role="button"
              aria-label={`View ${item.title}`}
            >
              <img
                src={item.img}
                alt={`${item.title} - ${item.location}`}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/20 transition-opacity duration-300 group-hover:from-black/95 group-hover:via-black/55" />

              {/* Top tag and expand indicator */}
              <div className="relative z-10 flex items-center justify-between p-4">
                <span className="inline-flex items-center rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-medium text-white backdrop-blur-md border border-white/20 shadow-sm">
                  📍 {item.location}
                </span>
                <span className="rounded-full bg-black/40 p-1.5 text-white/90 opacity-0 transition-opacity duration-300 group-hover:opacity-100 backdrop-blur-md">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                  </svg>
                </span>
              </div>

              {/* Bottom caption */}
              <figcaption className="relative z-10 p-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-sig">{item.tag}</span>
                <h3 className="font-head text-lg font-bold tracking-tight text-white drop-shadow-sm">{item.title}</h3>
                <p className="mt-1 text-xs text-white/80 line-clamp-2 leading-relaxed group-hover:text-white transition-colors">{item.desc}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </Sec>

      {/* Lightbox Modal */}
      {activeImg !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          onClick={() => setActiveImg(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative max-h-[92vh] max-w-4xl w-full overflow-hidden rounded-2xl bg-surface shadow-2xl border border-line"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveImg(null)}
              className="absolute right-4 top-4 z-20 grid h-9 w-9 place-items-center rounded-full bg-black/70 text-white backdrop-blur-md hover:bg-black/90 transition-colors"
              aria-label="Close modal"
            >
              ✕
            </button>

            <div className="relative aspect-video w-full bg-black">
              <img
                src={G[activeImg].img}
                alt={G[activeImg].title}
                className="h-full w-full object-cover sm:object-contain"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImg((activeImg + G.length - 1) % G.length);
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full bg-black/60 text-white backdrop-blur-md hover:bg-black/85 transition"
                aria-label="Previous image"
              >
                ‹
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImg((activeImg + 1) % G.length);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full bg-black/60 text-white backdrop-blur-md hover:bg-black/85 transition"
                aria-label="Next image"
              >
                ›
              </button>
            </div>

            <div className="p-5 bg-surface">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-brand/15 text-brand px-2.5 py-0.5 text-xs font-semibold">
                      {G[activeImg].tag}
                    </span>
                    <span className="text-xs text-mut font-medium">📍 {G[activeImg].location}</span>
                  </div>
                  <h3 className="mt-1 font-head text-2xl font-bold">{G[activeImg].title}</h3>
                </div>
                <span className="text-xs font-medium text-mut">{activeImg + 1} / {G.length}</span>
              </div>
              <p className="mt-2 text-sm text-mut leading-relaxed">{G[activeImg].desc}</p>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
}

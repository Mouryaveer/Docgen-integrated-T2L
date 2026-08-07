"use client";

import React, { useState } from 'react';
import { showToast } from '../ToastContainer';

const EVENT_DATA = [
  {
    id: 1, title: "India Legal Tech Summit 2026", groups: ["featured", "trending"], mode: "offline", price: "paid", aud: ["lawyer", "founder"], cat: "conference",
    tags: "legaltech conference summit ai law bengaluru",
    bannerClass: "", catDisplay: "Conference", day: "14", month: "Aug",
    org: "SFLC.in & NALSAR", loc: "Bengaluru",
    dateMeta: "14 Aug 2026 · <b>9:30 AM IST</b>", locMeta: "Taj MG Road, Bengaluru",
    desc: "A full-day summit on AI in legal practice, contract automation, and the future of dispute resolution in India.",
    speakersHTML: '<span className="av">RS</span><span className="av">MK</span><span className="av">AP</span><span className="more">+9 speakers</span>',
    deadline: "Registration closes 07 Aug 2026", bmCode: "ev-legaltech", hidden: false
  },
  {
    id: 2, title: "Startup Law & Fundraising 101", groups: ["trending", "week", "new"], mode: "online", price: "free", aud: ["founder"], cat: "webinar",
    tags: "startup fundraising term sheet esop webinar online",
    bannerClass: "b2", catDisplay: "Webinar", day: "11", month: "Jul",
    org: "Turn2Law & Founder's Office", loc: "Free",
    dateMeta: "11 Jul 2026 · <b>6:00 PM IST</b>", locMeta: "Zoom · Link on registration",
    desc: "Term sheets, ESOP pools, and cap tables, explained for first-time founders. Live Q&A with our legal team.",
    speakersHTML: '<span className="av">VS</span><span className="av">HM</span><span className="more">+2 speakers</span>',
    deadline: "Registration closes 11 Jul 2026", bmCode: "ev-startuplaw", hidden: false
  },
  {
    id: 3, title: "National Constitutional Law Moot 2026", groups: ["featured", "deadline", "new"], mode: "offline", price: "paid", aud: ["student"], cat: "moot",
    tags: "moot court competition law student constitutional delhi",
    bannerClass: "b3", catDisplay: "Moot Court", day: "22", month: "Sep",
    org: "NLU Delhi", loc: "New Delhi",
    dateMeta: "22 - 24 Sep 2026", locMeta: "NLU Delhi Campus",
    desc: "India's premier constitutional law moot for law students, with cash prizes and internship offers for finalists.",
    speakersHTML: '<span className="av">JD</span><span className="av">SC</span><span className="more">Judges panel</span>',
    deadline: "Team registration closes 15 Jul 2026", bmCode: "ev-moot", hidden: false
  },
  {
    id: 4, title: "Build for Justice: LegalTech Hackathon", groups: ["trending", "new"], mode: "online", price: "free", aud: ["student", "founder"], cat: "hackathon",
    tags: "hackathon legaltech developers ai online",
    bannerClass: "b4", catDisplay: "Hackathon", day: "02", month: "Aug",
    org: "Agami & ThoughtWorks", loc: "Free",
    dateMeta: "02 - 04 Aug 2026", locMeta: "Online · Devfolio",
    desc: "48 hours to build tools that improve access to justice. Open to students, developers, and founders.",
    speakersHTML: '<span className="av">AG</span><span className="av">TW</span><span className="more">Mentors</span>',
    deadline: "Applications close 28 Jul 2026", bmCode: "ev-hack", hidden: true
  },
  {
    id: 5, title: "Founder x Investor Legal Meetup", groups: ["week", "new"], mode: "offline", price: "free", aud: ["founder"], cat: "meetup",
    tags: "meetup networking founder investor mumbai",
    bannerClass: "b2", catDisplay: "Meetup", day: "13", month: "Jul",
    org: "Turn2Law Community", loc: "Free",
    dateMeta: "13 Jul 2026 · <b>5:00 PM IST</b>", locMeta: "WeWork BKC, Mumbai",
    desc: "An informal evening connecting founders with investors and legal advisors over term-sheet clinics.",
    speakersHTML: '<span className="av">T2</span><span className="av">IN</span><span className="more">+30 attending</span>',
    deadline: "RSVP by 12 Jul 2026", bmCode: "ev-meetup", hidden: true
  },
  {
    id: 6, title: "Corporate Law & M&A Workshop", groups: ["featured"], mode: "offline", price: "paid", aud: ["lawyer", "student"], cat: "conference",
    tags: "workshop corporate law compliance offline hyderabad",
    bannerClass: "", catDisplay: "Workshop", day: "05", month: "Sep",
    org: "ICSI Hyderabad Chapter", loc: "Hyderabad",
    dateMeta: "05 Sep 2026 · <b>10:00 AM IST</b>", locMeta: "ICSI Bhavan, Hyderabad",
    desc: "Hands-on workshop on due diligence, share purchase agreements, and regulatory approvals in M&A deals.",
    speakersHTML: '<span className="av">CS</span><span className="av">PK</span><span className="more">+4 speakers</span>',
    deadline: "Seats limited · closes 30 Aug 2026", bmCode: "ev-workshop", hidden: true
  }
];

export default function Events() {
  const [activeTab, setActiveTab] = useState('all');
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const [isExpanded, setIsExpanded] = useState(false);
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());

  const toggleFilter = (key: string, value: string) => {
    setFilters(prev => {
      const next = { ...prev };
      if (!next[key]) next[key] = [];
      if (next[key].includes(value)) {
        next[key] = next[key].filter(v => v !== value);
      } else {
        next[key].push(value);
      }
      return next;
    });
    setIsExpanded(true);
  };

  const resetFilters = () => {
    setFilters({});
    setActiveTab('all');
    setIsExpanded(false);
  };

  const toggleBookmark = (code: string) => {
    setBookmarks(prev => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
  };

  const filteredEvents = EVENT_DATA.filter(ev => {
    if (activeTab !== 'all' && !ev.groups.includes(activeTab)) return false;
    
    for (const key of Object.keys(filters)) {
      if (filters[key].length === 0) continue;
      
      let evVal: string | string[] = (ev as any)[key];
      if (key === 'aud' && Array.isArray(evVal)) {
        const matches = filters[key].some(v => evVal.includes(v));
        if (!matches) return false;
      } else {
        if (!filters[key].includes(evVal as string)) return false;
      }
    }
    return true;
  });

  const displayEvents = isExpanded ? filteredEvents : filteredEvents.filter(ev => !ev.hidden);
  const hasHidden = !isExpanded && filteredEvents.some(ev => ev.hidden);

  return (
    <>
      <section id="events" className="pad"><div className="wrap">
  <div className="shead reveal in"><div className="st"><div className="sicon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg></div><div><h2>Legal events &amp; opportunities</h2><div className="sdesc">Conferences, summits, webinars, moots, hackathons &amp; meetups across India</div></div></div><a href="#events" className="slink" id="allEventsLink">Submit an event<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 5v14M5 12h14" /></svg></a></div>

  <div className="events-hero reveal in">
    <div className="eg"></div>
    <div className="ev-tabs" id="evTabs" role="tablist">
      {[{k:'all',v:'All events', n:18}, {k:'featured',v:'Featured', n:4}, {k:'trending',v:'Trending', n:5}, {k:'week',v:'This week', n:3}, {k:'deadline',v:'Closing soon', n:4}, {k:'new',v:'Recently added', n:6}].map(t => (
        <button key={t.k} className={`ev-tab ${activeTab === t.k ? 'on' : ''}`} onClick={() => { setActiveTab(t.k); setIsExpanded(true); }} role="tab">{t.v} <span className="n">{t.n}</span></button>
      ))}
    </div>
    <div className="ev-filters">
      <div className="ev-fgroup"><span className="flabel">Mode</span>
        <button className={`ev-f ${filters['mode']?.includes('online') ? 'on' : ''}`} onClick={() => toggleFilter('mode', 'online')}>Online</button>
        <button className={`ev-f ${filters['mode']?.includes('offline') ? 'on' : ''}`} onClick={() => toggleFilter('mode', 'offline')}>Offline</button>
      </div>
      <div className="ev-fgroup"><span className="flabel">Price</span>
        <button className={`ev-f ${filters['price']?.includes('free') ? 'on' : ''}`} onClick={() => toggleFilter('price', 'free')}>Free</button>
        <button className={`ev-f ${filters['price']?.includes('paid') ? 'on' : ''}`} onClick={() => toggleFilter('price', 'paid')}>Paid</button>
      </div>
      <div className="ev-fgroup"><span className="flabel">For</span>
        <button className={`ev-f ${filters['aud']?.includes('student') ? 'on' : ''}`} onClick={() => toggleFilter('aud', 'student')}>Students</button>
        <button className={`ev-f ${filters['aud']?.includes('founder') ? 'on' : ''}`} onClick={() => toggleFilter('aud', 'founder')}>Founders</button>
        <button className={`ev-f ${filters['aud']?.includes('lawyer') ? 'on' : ''}`} onClick={() => toggleFilter('aud', 'lawyer')}>Lawyers</button>
      </div>
      <div className="ev-fgroup"><span className="flabel">Category</span>
        {['conference', 'webinar', 'moot', 'hackathon', 'meetup'].map(c => (
           <button key={c} className={`ev-f ${filters['cat']?.includes(c) ? 'on' : ''}`} onClick={() => toggleFilter('cat', c)}>{c.charAt(0).toUpperCase() + c.slice(1)}</button>
        ))}
      </div>
      <button className="ev-f" onClick={resetFilters} style={{ marginLeft: "auto", color: "var(--gold-deep)", borderColor: "var(--gold)" }}>Reset filters</button>
    </div>
  </div>

  <div className="events-grid" id="eventsGrid">
    {displayEvents.map((ev, idx) => (
      <article key={ev.id} className="eventcard reveal in js-card" style={idx > 0 ? { "--d": `${idx * 70}ms` } as React.CSSProperties : {}}>
        <div className={`ev-banner ${ev.bannerClass}`}><span className="ev-cat">{ev.catDisplay}</span><div className="ev-date-badge"><div className="d">{ev.day}</div><div className="m">{ev.month}</div></div></div>
        <div className="ev-body">
          <h3>{ev.title}</h3>
          <div className="ev-org"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4" /></svg>{ev.org}</div>
          <div className="ev-modes"><span className={`ev-mode ${ev.mode}`}>{ev.mode.charAt(0).toUpperCase() + ev.mode.slice(1)}</span><span className={`ev-mode ${ev.loc === 'Free' ? 'free' : ''}`}>{ev.loc}</span></div>
          <div className="ev-meta"><div className="row"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg><span dangerouslySetInnerHTML={{ __html: ev.dateMeta }}></span></div><div className="row"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 21s-7-6.3-7-11a7 7 0 0 1 14 0c0 4.7-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></svg><span dangerouslySetInnerHTML={{ __html: ev.locMeta }}></span></div></div>
          <p className="ev-desc">{ev.desc}</p>
          <div className="ev-speakers" dangerouslySetInnerHTML={{ __html: ev.speakersHTML }}></div>
          <div className="ev-deadline"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>{ev.deadline}</div>
          <div className="ev-actions"><a href="/#contact" className="btn btn-gold btn-sm" style={{ flex: 1 }}>Register</a><button className="iconbtn cal" onClick={() => showToast('Added to calendar reminders')} aria-label="Add to calendar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18M12 14v4M10 16h4" /></svg></button><button className={`iconbtn bm ${bookmarks.has(ev.bmCode) ? 'saved' : ''}`} onClick={() => toggleBookmark(ev.bmCode)} aria-label="Bookmark event"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg></button></div>
        </div>
      </article>
    ))}
  </div>
  {hasHidden && (
    <div className="loadmore"><button className="btn btn-ghost" onClick={() => setIsExpanded(true)}>Show more events <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg></button></div>
  )}
</div></section>
    </>
  );
}

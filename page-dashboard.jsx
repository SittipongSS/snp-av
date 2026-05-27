// SNP AV — Pages (Dashboard + Information)
const { useState, useMemo, useRef, useEffect } = React;

/* ============ DASHBOARD ============ */
function Dashboard({ onNav, auth = {role:'public'} }) {
  const isAdmin = auth.role === 'admin';
  return isAdmin ? <AdminDashboard onNav={onNav} auth={auth}/> : <PublicHome onNav={onNav} auth={auth}/>;
}

/* Admin-only full dashboard */
function AdminDashboard({ onNav, auth }) {
  return (
    <div className="page">
      <div className="page-head">
        <div>
          <div className="title">แดชบอร์ด Admin</div>
          <div className="sub">ภาคเรียนที่ ๑/๒๕๖๘ · สัปดาห์ที่ ๓ · เข้าสู่ระบบในฐานะ {auth.name}</div>
        </div>
        <div className="actions">
          <button className="btn"><I.download size={14}/> รายงานประจำเดือน</button>
        </div>
      </div>

      <div className="stat-grid">
        <div className="stat">
          <div className="label">รออนุมัติ</div>
          <div className="value">3</div>
          <div className="meta">2 การจองห้อง · 1 ใบยืมพัสดุ</div>
        </div>
        <div className="stat">
          <div className="label">พัสดุยืมค้าง</div>
          <div className="value">12</div>
          <div className="meta"><span className="down">2 รายการ</span> เกินกำหนด</div>
        </div>
        <div className="stat">
          <div className="label">ครุภัณฑ์ในระบบ</div>
          <div className="value">{INVENTORY.length}</div>
          <div className="meta">86% พร้อมใช้งาน</div>
        </div>
        <div className="stat">
          <div className="label">สมาชิกชมรม</div>
          <div className="value">{STUDENTS.length}</div>
          <div className="meta">{TEACHERS.length} ครู · ๑๐ ฝ่ายงาน</div>
        </div>
      </div>

      <div className="two-col" style={{gridTemplateColumns: '1fr 340px'}}>
        <div className="card">
          <div className="card-head">
            <h3>ไทม์ไลน์งานที่จะถึง</h3>
            <span className="badge gold">{TIMELINE.length} กิจกรรม</span>
            <button className="btn ghost sm" style={{marginLeft:'auto'}} onClick={() => onNav('info')}>
              ดูทั้งหมด <I.chevR size={12}/>
            </button>
          </div>
          <div className="timeline">
            {TIMELINE.map((t, i) => (
              <div key={i} className={"tl-item " + t.state}>
                <div className="head">
                  <span className="date">{t.date}</span>
                  <span className="what">{t.what}</span>
                  {t.state === 'gold' && <span className="badge gold" style={{marginLeft:4}}><span className="dot"/>งานหลัก</span>}
                </div>
                <div className="desc">{t.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="col" style={{gap:'var(--gap)'}}>
          <div className="card">
            <div className="card-head">
              <h3>ประกาศด่วน</h3>
              <button className="btn ghost sm" style={{marginLeft:'auto'}} onClick={() => onNav('info')}>
                ทั้งหมด <I.chevR size={12}/>
              </button>
            </div>
            <div className="col" style={{gap:10}}>
              {ANNOUNCES.slice(0,3).map((a,i) => (
                <div key={i} style={{
                  display:'flex', gap:10, alignItems:'flex-start',
                  padding:'10px 12px',
                  background: a.pin ? 'var(--gold-50)' : 'var(--bg-sunken)',
                  borderRadius:'var(--r)',
                  border:`1px solid ${a.pin ? 'var(--gold-200)' : 'var(--border)'}`,
                  borderLeft:`4px solid ${a.pin ? 'var(--gold-400)' : 'var(--navy-500)'}`,
                }}>
                  <div style={{color: a.pin ? 'var(--gold-500)' : 'var(--navy-500)', marginTop:2, flexShrink:0}}>
                    {a.pin ? <I.pin size={14}/> : <I.info size={14}/>}
                  </div>
                  <div>
                    <div style={{fontSize:13, fontWeight:600, lineHeight:1.3, color:'var(--navy-700)'}}>{a.title}</div>
                    <div style={{fontSize:11.5, color:'var(--text-subtle)', marginTop:3, fontFamily:'var(--font-mono)'}}>{a.when.split('·')[0].trim()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card plain" style={{borderLeft:'4px solid var(--navy-600)'}}>
            <div className="card-head"><h3>การเข้าถึงด่วน</h3></div>
            <div className="col" style={{gap:6}}>
              {[
                {ico:'cal',    label:'จองห้องโสตฯ',   page:'system'},
                {ico:'box',    label:'ยืม-คืนพัสดุ',  page:'system'},
                {ico:'users',  label:'รายชื่อบุคลากร', page:'personnel'},
                {ico:'gallery',label:'แกลเลอรีผลงาน',  page:'gallery'},
              ].map((item,i) => {
                const Ico = I[item.ico];
                return (
                  <button key={i} onClick={() => onNav(item.page)} className="btn ghost" style={{
                    justifyContent:'flex-start', height:40,
                    border:'1px solid var(--border)', borderRadius:'var(--r)',
                  }}>
                    <Ico size={14} style={{color:'var(--navy-500)'}}/>
                    <span>{item.label}</span>
                    <I.chevR size={12} style={{marginLeft:'auto', color:'var(--text-subtle)'}}/>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Public/Private home page — inspired by travel.lamphunpao.go.th */
function PublicHome({ onNav, auth = {role:'public'} }) {
  const eventData = [
    { day: '30', month: 'พ.ค.', title: 'ประชุมเตรียมงาน วันสุนทรภู่', desc: 'รวมพลชมรมโสตฯ ห้องโสตทัศนศึกษา เวลา 15:30 น. แบ่งทีมเสียง แสง กล้อง ไลฟ์ และเอกสาร', cat: 'โสตทัศน์', hue: 40 },
    { day: '5',  month: 'มิ.ย.', title: 'ติดตั้งอุปกรณ์ฉากและไฟเวที', desc: 'ทีมเทคนิคเสียง-แสง เตรียมระบบเวทีสำหรับงานวันสุนทรภู่ เริ่มเวลา 13:00 น.', cat: 'เทคนิค', hue: 210 },
    { day: '14', month: 'มิ.ย.', title: 'อบรมกล้อง Sony A7 III รุ่น 2', desc: 'เปิดรับสมัครนักเรียนชมรม อบรมการใช้กล้องและพื้นฐานการจัดองค์ประกอบภาพ', cat: 'วิชาการ', hue: 150 },
    { day: '26', month: 'มิ.ย.', title: 'วันสุนทรภู่ (Main Event)', desc: 'พิธีเปิด 08:30 น. · การแสดง 09:30 น. · ไลฟ์สตรีมตลอดทั้งงาน', cat: 'กิจกรรม', hue: 350 },
  ];

  return (
    <>
      {/* ── 1. Hero ── */}
      <div className="hero">
        <div className="hero-gov-strip"/>
        <div className="hero-inner">
          <div className="hero-text">
            <div className="hero-patron">ในพระอุปถัมภ์ สมเด็จพระเจ้าภคินีเธอ เจ้าฟ้าเพชรรัตนราชสุดา สิริโสภาพัณณวดี</div>
            <div className="hero-title">
              ฝ่าย<span className="accent">โสตทัศนศึกษา</span>
            </div>
            <div className="hero-en">SAINAMPEUNG SCHOOL — AUDIO-VISUAL DEPARTMENT</div>
            <div className="hero-desc">
              ดูแลระบบเสียง แสง ถ่ายภาพ วีดิทัศน์ ไลฟ์สตรีม และสื่อประชาสัมพันธ์
              สำหรับทุกกิจกรรมของโรงเรียนสายน้ำผึ้ง
            </div>
            <div className="hero-actions">
              <button className="btn-pill gold" onClick={() => onNav('system')}>
                <I.cal size={16}/> ดูปฏิทินห้อง
              </button>
              <button className="btn-pill outline" onClick={() => onNav('info')}>
                <I.info size={16}/> ข่าวสารล่าสุด
              </button>
            </div>
          </div>
          <div className="hero-seal">
            <div className="hero-seal-mark">สนผ<small>SNP</small></div>
          </div>
        </div>
        <div className="hero-meta">
          <div>ภาคเรียนที่ ๑/๒๕๖๘</div>
          <div style={{fontSize:11, color:'var(--gold-300)', marginTop:2}}>สัปดาห์ที่ ๓</div>
        </div>
        <div className="hero-dots">
          <span className="active"/><span/><span/><span/><span/>
        </div>
      </div>

      {/* ── 2. Featured grid — ข่าวสารยอดนิยม ── */}
      <div className="land-section light">
        <div className="land-inner">
          <div className="section-head section-head-row">
            <div>
              <div className="section-title">ข่าวสาร<span className="accent">ฝ่ายโสตฯ</span></div>
              <div className="section-sub">ข่าวประชาสัมพันธ์ ประกาศ และกิจกรรมที่ไม่ควรพลาด</div>
            </div>
            <button className="btn-pill gold" onClick={() => onNav('info')}>
              ข่าวสารทั้งหมด <I.chevR size={14}/>
            </button>
          </div>
          <div className="featured-grid">
            <div className="feat-card feat-main" style={{background:`hsl(30,20%,88%)`}}>
              <div className="stripes"/>
              <div className="glyph" style={{color:`hsl(30,15%,70%)`}}>AV</div>
              <div className="feat-card-overlay">
                <div className="title">{ANNOUNCES[0].title}</div>
                <div className="sub">{ANNOUNCES[0].when}</div>
              </div>
            </div>
            <div className="feat-card-white">
              <div className="title">ข่าวสาร<span className="accent">ยอดนิยม</span></div>
              <div className="desc">
                ติดตามประกาศ ระเบียบใหม่ และตารางกิจกรรมของฝ่ายโสตทัศนศึกษา
                พร้อมความเคลื่อนไหวล่าสุดจากชมรมโสตฯ
              </div>
              <div style={{marginTop:16}}>
                <button className="btn-pill gold" onClick={() => onNav('info')}>
                  ดูข่าวทั้งหมด <I.chevR size={14}/>
                </button>
              </div>
            </div>
            {ANNOUNCES.slice(1, 3).map((a, i) => (
              <div key={i} className="feat-card" style={{minHeight:160, background:`hsl(${[210,150][i]},20%,88%)`}}>
                <div className="stripes"/>
                <div className="glyph" style={{color:`hsl(${[210,150][i]},15%,70%)`, fontSize:36}}>
                  {i === 0 ? <I.box size={40}/> : <I.cam size={40}/>}
                </div>
                <div className="feat-card-overlay">
                  <div className="title" style={{fontSize:15}}>{a.title}</div>
                  <div className="sub">{a.when.split('·')[0].trim()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 3. กิจกรรมที่กำลังจะมาถึง ── */}
      <div className="land-section" style={{background:'var(--surface)', borderTop:'1px solid var(--border)', borderBottom:'1px solid var(--border)'}}>
        <div className="land-inner">
          <div className="section-head section-head-row">
            <div>
              <div className="section-title">กิจกรรมน่าสนใจ<span className="accent">ฝ่ายโสตฯ</span></div>
              <div className="section-sub">รวมกิจกรรมที่กำลังจะมาถึง เตรียมตัวให้พร้อม!</div>
            </div>
            <button className="btn-pill gold" onClick={() => onNav('info')}>
              กิจกรรมทั้งหมด <I.chevR size={14}/>
            </button>
          </div>
          <div className="event-list">
            {eventData.map((ev, i) => (
              <div key={i} className="event-row">
                <div className="event-date">
                  <div className="event-date-day">{ev.day}</div>
                  <div className="event-date-month">{ev.month}</div>
                </div>
                <div className="event-body">
                  <div className="event-body-title">{ev.title}</div>
                  <div className="event-body-desc">{ev.desc}</div>
                </div>
                <div className="event-arrow"><I.chevR size={16}/></div>
                <div className="event-img" style={{background:`hsl(${ev.hue},20%,88%)`}}>
                  <div className="stripes"/>
                  <div className="glyph" style={{color:`hsl(${ev.hue},15%,70%)`, fontSize:28}}>
                    {['AV','T','C','E'][i]}
                  </div>
                  <div className="cat-badge">{ev.cat}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 4. ปฏิทินการใช้ห้อง (navy section) ── */}
      <div className="land-section navy">
        <div className="land-inner">
          <div className="section-head section-head-row">
            <div>
              <div className="section-title">ปฏิทินการใช้<span className="accent">ห้อง</span></div>
              <div className="section-sub">ตารางการจองห้องโสตฯ ห้องประชุม และห้อง 8103 ประจำสัปดาห์</div>
            </div>
          </div>
          <Booking embedded={true} canApprove={false} auth={auth}/>
        </div>
      </div>

      {/* ── 5. แนะนำห้อง ── */}
      <div className="land-section light">
        <div className="land-inner">
          <div className="section-head section-head-row">
            <div>
              <div className="section-title">ห้องบริการ<span className="accent">ฝ่ายโสตฯ</span></div>
              <div className="section-sub">ห้องบริการ 3 ห้อง พร้อมอุปกรณ์ครบครัน รองรับกิจกรรมทุกรูปแบบ</div>
            </div>
          </div>
          <div className="room-showcase">
            {ROOMS.map((r, i) => {
              const hues = [40, 210, 280];
              const glyphs = ['AV', 'M', '83'];
              return (
                <div key={r.id} className="room-card">
                  <div className="room-card-img" style={{background:`hsl(${hues[i]},20%,30%)`}}>
                    <div className="stripes"/>
                    <div className="glyph" style={{color:`hsl(${hues[i]},30%,50%)`}}>{glyphs[i]}</div>
                    <div className="overlay"/>
                  </div>
                  <div className="room-card-body">
                    <div className="room-card-name">{r.name}</div>
                    <div className="room-card-meta">{r.floor}</div>
                    <div className="room-card-cap">
                      <I.users size={13}/> จุได้ {r.cap} คน
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── 6. Facebook & ข่าวสาร (light section) ── */}
      <div className="land-section" style={{background:'var(--surface)', borderTop:'1px solid var(--border)'}}>
        <div className="land-inner">
          <div className="section-head">
            <div className="section-title">ติดตาม<span className="accent">ข่าวสาร</span></div>
            <div className="section-sub">ติดตามความเคลื่อนไหวผ่าน Facebook ของโรงเรียนและชมรมโสตฯ</div>
          </div>
          <div className="fb-grid">
            <FBCard
              page="โรงเรียนสายน้ำผึ้ง ในพระอุปถัมภ์ฯ"
              handle="@SainampeungSchool"
              href="https://www.facebook.com/share/1Ap8RkkfLM/?mibextid=wwXIfr"
              desc="ข่าวสาร กิจกรรม และความภาคภูมิใจของนักเรียนสายน้ำผึ้ง"
              likes="12,408" followers="13,920"
              posts={[
                {text:"ขอแสดงความยินดีกับนักเรียน ม.6 สอบติดมหาวิทยาลัย TCAS รอบ 1 จำนวน 127 คน", time:"2 ชม.ที่แล้ว", likes:284},
                {text:"ประกาศ: วันจันทร์ที่ 26 พ.ค. ให้นักเรียนทุกระดับชั้นแต่งกายชุดนักเรียน", time:"เมื่อวาน", likes:156},
              ]}
              color="var(--navy-600)"
            />
            <FBCard
              page="ชมรมโสตทัศนศึกษา สายน้ำผึ้ง"
              handle="@SNP.AVclub"
              href="https://www.facebook.com/share/1ajdqCeT9X/?mibextid=wwXIfr"
              desc="ชมรมโสตฯ ผลิตสื่อ ถ่ายภาพ ไลฟ์สด ดูแลระบบเสียง-แสง"
              likes="3,847" followers="4,210"
              posts={[
                {text:"Behind the scenes: ทีมชมรมเตรียมพร้อมระบบไลฟ์สตรีม งานวันสุนทรภู่ 26 มิ.ย.", time:"3 ชม.ที่แล้ว", likes:98},
                {text:"ผลงานภาพถ่ายจากกิจกรรมไหว้ครูปีการศึกษา 2568 ชมรูปเพิ่มที่แกลเลอรี", time:"3 วันที่แล้ว", likes:201},
              ]}
              color="var(--gold-500)"
            />
          </div>
        </div>
      </div>
    </>
  );
}

/* ============ INFORMATION ============ */
function Information({ auth = {role:'public'} }) {
  const isAdmin = auth.role === 'admin';
  return (
    <div className="page">
      <div className="page-head">
        <div>
          <div className="title">ข่าวสารและประกาศ</div>
          <div className="sub">ฝ่ายโสตทัศนศึกษา · ไทม์ไลน์ · ข่าวสาร · Facebook · เอกสาร</div>
        </div>
        <div className="actions">
          {isAdmin && <button className="btn primary"><I.plus size={14}/> สร้างประกาศ</button>}
        </div>
      </div>

      {/* 1. ไทม์ไลน์ฝ่ายโสตฯ */}
      <div className="card">
        <div className="card-head">
          <h3>ไทม์ไลน์ฝ่ายโสตฯ</h3>
          <span className="badge gold">{TIMELINE.length} กิจกรรม</span>
          {isAdmin && <button className="btn ghost sm" style={{marginLeft:'auto'}}><I.plus size={13}/> เพิ่มกิจกรรม</button>}
        </div>
        <div className="timeline">
          {TIMELINE.map((t, i) => (
            <div key={i} className={"tl-item " + t.state}>
              <div className="head">
                <span className="date">{t.date}</span>
                <span className="what">{t.what}</span>
                {t.state === 'gold' && <span className="badge gold" style={{marginLeft:4}}><span className="dot"/>งานหลัก</span>}
              </div>
              <div className="desc">{t.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. ข่าวประชาสัมพันธ์ */}
      <div className="card">
        <div className="card-head">
          <h3>ข่าวประชาสัมพันธ์</h3>
          <a href="https://www.sainampeung.ac.th/prpublic/" target="_blank" rel="noopener noreferrer"
            className="btn ghost sm" style={{marginLeft:'auto'}}>
            เว็บไซต์โรงเรียน <I.chevR size={12}/>
          </a>
          {isAdmin && <button className="btn primary sm"><I.plus size={13}/> สร้างประกาศ</button>}
        </div>
        <div className="col" style={{gap:10}}>
          {ANNOUNCES.map((a,i) => (
            <div key={i} className={"announce " + (a.pin ? 'pin' : '')}>
              <div className="ico">{a.pin ? <I.pin size={18}/> : <I.info size={18}/>}</div>
              <div className="grow">
                <div className="head">
                  <span className="title">{a.title}</span>
                  {a.pin && <span className="badge gold"><span className="dot"/>ปักหมุด</span>}
                  <span className="when" style={{marginLeft:'auto', fontFamily:'var(--font-mono)', fontSize:11, color:'var(--text-subtle)'}}>{a.when}</span>
                </div>
                <div className="body">{a.body}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Facebook cards */}
      <div className="fb-grid">
        <FBCard
          page="โรงเรียนสายน้ำผึ้ง ในพระอุปถัมภ์ฯ"
          handle="@SainampeungSchool"
          href="https://www.facebook.com/share/1Ap8RkkfLM/?mibextid=wwXIfr"
          desc="ข่าวสาร กิจกรรม และความภาคภูมิใจของนักเรียนสายน้ำผึ้ง อัปเดตทุกวัน"
          likes="12,408" followers="13,920"
          posts={[
            {text:"ขอแสดงความยินดีกับนักเรียน ม.6 ที่สอบติดมหาวิทยาลัย TCAS รอบ 1 ประจำปีการศึกษา 2568 จำนวน 127 คน 🎓", time:"2 ชม.ที่แล้ว", likes:284},
            {text:"📢 ประกาศ: วันจันทร์ที่ 26 พ.ค. ให้นักเรียนทุกระดับชั้นแต่งกายชุดนักเรียน", time:"เมื่อวาน", likes:156},
          ]}
          color="var(--navy-600)"
        />
        <FBCard
          page="ชมรมโสตทัศนศึกษา สายน้ำผึ้ง"
          handle="@SNP.AVclub"
          href="https://www.facebook.com/share/1ajdqCeT9X/?mibextid=wwXIfr"
          desc="ชมรมโสตทัศนศึกษา โรงเรียนสายน้ำผึ้ง ผลิตสื่อ ถ่ายภาพ ไลฟ์สด และดูแลระบบเสียง-แสง"
          likes="3,847" followers="4,210"
          posts={[
            {text:"🎬 Behind the scenes: ทีมชมรมเตรียมพร้อมระบบไลฟ์สตรีมสำหรับงานวันสุนทรภู่ 26 มิ.ย. นี้", time:"3 ชม.ที่แล้ว", likes:98},
            {text:"📸 ผลงานภาพถ่ายจากกิจกรรมไหว้ครูปีการศึกษา 2568 ชมรูปเพิ่มเติมได้ที่แกลเลอรีฝ่ายโสตฯ", time:"3 วันที่แล้ว", likes:201},
          ]}
          color="var(--gold-500)"
        />
      </div>

      {/* 4. เอกสาร & ระเบียบ */}
      <div className="card">
        <div className="card-head">
          <h3>เอกสาร &amp; ระเบียบ</h3>
          <span className="badge">PDF · DOCX</span>
          {isAdmin && <button className="btn ghost sm" style={{marginLeft:'auto'}}><I.plus size={13}/> เพิ่มเอกสาร</button>}
        </div>
        <div className="col" style={{gap:6}}>
          {[
            ["ระเบียบการใช้ห้องโสตทัศนศึกษา ปีการศึกษา 2568", "230 KB · PDF", "อ.สมพร"],
            ["แบบฟอร์มขอใช้ห้องประชุม", "85 KB · DOCX", "ฝ่ายธุรการ"],
            ["คู่มือการใช้กล้อง Sony A7 III ฉบับย่อ", "1.2 MB · PDF", "อ.ศุภลักษณ์"],
            ["แบบฟอร์มยืม-คืนพัสดุ (ฉบับแก้ไข พ.ค. 68)", "120 KB · PDF", "อ.พิมพ์ชนก"],
            ["รายชื่อสมาชิกชมรมโสตฯ ภาคเรียน 1/2568", "65 KB · PDF", "อ.ฐิติมา"],
          ].map((row, i) => (
            <div key={i} className="row" style={{padding:'10px 4px', borderBottom:'1px dashed var(--border)'}}>
              <div className="row" style={{gap:10, flex:1}}>
                <div style={{
                  width:32, height:32, borderRadius:'var(--r)',
                  background:'var(--navy-50)', color:'var(--navy-600)',
                  display:'grid', placeItems:'center',
                }}><I.info size={15}/></div>
                <div>
                  <div style={{fontSize:13, fontWeight:500}}>{row[0]}</div>
                  <div className="mono" style={{fontSize:10.5, color:'var(--text-subtle)'}}>{row[1]} · {row[2]}</div>
                </div>
              </div>
              <button className="btn ghost sm"><I.download size={13}/></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* Facebook card mockup */
function FBCard({ page, handle, href, desc, likes, followers, posts, color }) {
  return (
    <div className="card plain" style={{border:'1px solid var(--border)', overflow:'hidden'}}>
      <div style={{
        height:80,
        background:`linear-gradient(135deg, ${color}, color-mix(in srgb, ${color} 60%, #000))`,
        margin:'calc(-1 * var(--pad-card))', marginBottom:0,
        position:'relative', display:'flex', alignItems:'flex-end', padding:'10px 16px',
      }}>
        <div style={{display:'flex', alignItems:'flex-end', gap:10, marginBottom:-24}}>
          <div style={{
            width:52, height:52, borderRadius:8,
            background:'#fff', border:'3px solid #fff',
            display:'grid', placeItems:'center',
            fontSize:20, fontWeight:700, color, boxShadow:'var(--shadow-sm)',
          }}>f</div>
          <div style={{color:'#fff', paddingBottom:2}}>
            <div style={{fontWeight:700, fontSize:14, textShadow:'0 1px 3px rgba(0,0,0,0.5)'}}>{page}</div>
            <div style={{fontSize:11, opacity:0.85}}>{handle}</div>
          </div>
        </div>
        <a href={href} target="_blank" rel="noopener noreferrer" style={{
          marginLeft:'auto', marginBottom:4,
          background:'rgba(255,255,255,0.2)', color:'#fff',
          border:'1px solid rgba(255,255,255,0.5)',
          padding:'4px 10px', borderRadius:4, fontSize:12, fontWeight:600,
          textDecoration:'none', whiteSpace:'nowrap',
        }}>↗ เปิด Facebook</a>
      </div>
      <div style={{marginTop:28, paddingTop:6}}>
        <div style={{fontSize:12.5, color:'var(--text-muted)', marginBottom:8}}>{desc}</div>
        <div className="row" style={{gap:16, marginBottom:12, fontSize:12}}>
          <span><b style={{color:'var(--navy-700)'}}>{likes}</b> ถูกใจ</span>
          <span><b style={{color:'var(--navy-700)'}}>{followers}</b> ผู้ติดตาม</span>
        </div>
        <div style={{height:1, background:'var(--border)', margin:'10px 0'}}/>
        <div className="col" style={{gap:10}}>
          {posts.map((p,i) => (
            <div key={i} style={{
              background:'var(--bg-sunken)', borderRadius:'var(--r)', padding:10,
              fontSize:13, lineHeight:1.5, border:'1px solid var(--border)',
            }}>
              <div>{p.text}</div>
              <div className="row" style={{gap:10, marginTop:6, fontSize:11.5}}>
                <span className="subtle" style={{fontFamily:'var(--font-mono)'}}>{p.time}</span>
                <span style={{marginLeft:'auto', color:'var(--navy-500)'}}>👍 {p.likes}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

window.Dashboard = Dashboard;
window.Information = Information;
window.FBCard = FBCard;

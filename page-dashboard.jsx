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

      {/* ── 2. ห้องบริการฝ่ายโสตฯ ── */}
      <div className="land-section light">
        <div className="land-inner">
          <div className="section-head section-head-row">
            <div>
              <div className="section-title">ห้องบริการ<span className="accent">ฝ่ายโสตฯ</span></div>
              <div className="section-sub">ห้องบริการ 3 ห้อง พร้อมอุปกรณ์ครบครัน กดเพื่อดูข้อมูลและรูปภาพรายละเอียด</div>
            </div>
          </div>
          <div className="room-showcase">
            {ROOMS.map((r, i) => {
              const hues = [40, 210, 280];
              const glyphs = ['AV', 'M', '83'];
              return (
                <div key={r.id} className="room-card interactive" onClick={() => onNav('room-' + r.id)} style={{cursor: 'pointer'}}>
                  <div className="room-card-img" style={{background:`hsl(${hues[i]},20%,30%)`}}>
                    <div className="stripes"/>
                    <div className="glyph" style={{color:`hsl(${hues[i]},30%,50%)`}}>{glyphs[i]}</div>
                    <div className="overlay"/>
                    <div className="room-card-badge">รายละเอียดเพิ่มเติม <I.chevR size={12}/></div>
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

      {/* ── 3. ภาพเบื้องหลังการทำงาน (แนวแกลลอรี) ── */}
      <div className="land-section" style={{background:'var(--surface)', borderTop:'1px solid var(--border)', borderBottom:'1px solid var(--border)'}}>
        <div className="land-inner">
          <div className="section-head section-head-row">
            <div>
              <div className="section-title">เบื้องหลัง<span className="accent">การทำงาน</span></div>
              <div className="section-sub">ภาพการปฏิบัติงานเบื้องหลังความสำเร็จของกิจกรรมต่างๆ ในโรงเรียนสายน้ำผึ้ง</div>
            </div>
            <button className="btn-pill gold" onClick={() => onNav('gallery')} style={{border:'none', display:'inline-flex', alignItems:'center', gap:6, cursor:'pointer'}}>
              ดูแกลเลอรีทั้งหมด <I.chevR size={14}/>
            </button>
          </div>
          <div className="gallery" style={{marginTop:24}}>
            {[
              { label: "จัดเตรียมตำแหน่งมุมกล้อง & ขาตั้ง", date: "งานพิธีไหว้ครู 2568", hue: 30, h: 200 },
              { label: "เซ็ตอัพมิกเซอร์และระบบเสียงห้องประชุม", date: "ประชุมผู้ปกครองภาคเรียนที่ 1", hue: 210, h: 240 },
              { label: "มอนิเตอร์สัญญาณและภาพการถ่ายทอดสด", date: "งานวันสุนทรภู่ประจำปี", hue: 150, h: 180 },
              { label: "ติดตั้งระบบไฟเวที LED และบอร์ดควบคุม", date: "การประกวดดนตรีสายน้ำผึ้ง", hue: 280, h: 260 },
              { label: "ถ่ายภาพนิ่งบรรยากาศขอบสนาม", date: "งานกรีฑาสีและกีฬาสีภายใน", hue: 40, h: 210 },
              { label: "ตรวจเช็คสายสัญญาณและไมค์ประชุม", date: "การสัมมนาครูและกลุ่มวิชาการ", hue: 350, h: 230 }
            ].map((g, i) => (
              <div key={i} className="pic interactive-pic" onClick={() => onNav('gallery')} style={{cursor: 'pointer'}}>
                <div style={{
                  height: g.h,
                  background: `linear-gradient(135deg, oklch(0.72 0.08 ${g.hue}), oklch(0.55 0.10 ${g.hue + 30}))`,
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div className="stripes"/>
                  <div style={{
                    position: 'absolute', top: 12, right: 12,
                    fontFamily: 'var(--font-mono)', fontSize: 9.5,
                    color: '#fff', opacity: 0.7,
                    background: 'rgba(15,31,58,0.4)',
                    padding: '2px 6px', borderRadius: 4,
                    backdropFilter: 'blur(4px)',
                  }}>AV_BTS_{(i+1).toString().padStart(3,'0')}.jpg</div>
                  <div className="label" style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    padding: '30px 12px 12px',
                    background: 'linear-gradient(to top, rgba(8,29,62,0.85), transparent)',
                    color: '#fff',
                    fontSize: '13px',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 600
                  }}>
                    <div style={{fontWeight: 700, fontSize: 13.5}}>{g.label}</div>
                    <div className="date" style={{fontSize: 11, color: 'var(--gold-300)', marginTop: 4, fontWeight: 500}}>{g.date}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 4. ข่าวประชาสัมพันธ์ ── */}
      <div className="land-section" style={{background:'var(--surface)', borderTop:'1px solid var(--border)', borderBottom:'1px solid var(--border)'}}>
        <div className="land-inner">
          <div className="section-head section-head-row">
            <div>
              <div className="section-title">ข่าวประชาสัมพันธ์</div>
              <div className="section-sub">ข่าวประกาศ ล่าสุด และลิงก์ไปยังข้อมูลประชาสัมพันธ์ของโรงเรียน</div>
            </div>
            <a href="https://www.sainampeung.ac.th/prpublic/" target="_blank" rel="noopener noreferrer" className="btn-pill gold" style={{textDecoration:'none', display:'inline-flex', alignItems:'center', gap:6}}>
              ข่าวสารบนเว็บโรงเรียน <I.chevR size={14}/>
            </a>
          </div>
          <div className="pr-news-grid">
            {ANNOUNCES.slice(0, 3).map((a, i) => (
              <div key={i} className="pr-news-card">
                <div className="pr-news-icon" style={{color: a.pin ? 'var(--gold-500)' : 'var(--navy-500)'}}>
                  {a.pin ? <I.pin size={18}/> : <I.info size={18}/>}
                </div>
                <div className="pr-news-body">
                  <div className="pr-news-title-row">
                    <span className="pr-news-title">{a.title}</span>
                    {a.pin && <span className="badge gold" style={{fontSize:10, padding:'2px 6px'}}><span className="dot"/>ปักหมุด</span>}
                  </div>
                  <div className="pr-news-meta" style={{fontSize:11, color:'var(--text-subtle)', marginTop:4, fontFamily:'var(--font-mono)'}}>{a.when}</div>
                  <div className="pr-news-desc" style={{fontSize:13, color:'var(--text-muted)', marginTop:8, lineHeight:1.5}}>{a.body}</div>
                  <div style={{marginTop:12}}>
                    <a href="https://www.sainampeung.ac.th/prpublic/" target="_blank" rel="noopener noreferrer" className="pr-news-link" style={{fontSize:12.5, fontWeight:600, color:'var(--navy-600)', textDecoration:'none', display:'inline-flex', alignItems:'center', gap:4}}>
                      อ่านรายละเอียด <I.chevR size={12}/>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 4. ช่องทางโซเชียลมีเดีย ── */}
      <div className="land-section light">
        <div className="land-inner">
          <div className="section-head">
            <div className="section-title">โซเชียล<span className="accent">มีเดีย</span></div>
            <div className="section-sub">กดลิงก์ติดตามข่าวสารและการถ่ายทอดสดผ่านช่องทางออนไลน์ต่างๆ</div>
          </div>
          <div className="social-links-grid">
            {/* Facebook โรงเรียน */}
            <a href="https://www.facebook.com/share/1Ap8RkkfLM/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="social-link-card fb">
              <div className="social-icon">f</div>
              <div className="social-info">
                <div className="social-name">โรงเรียนสายน้ำผึ้ง ในพระอุปถัมภ์ฯ</div>
                <div className="social-handle">@SainampeungSchool</div>
                <div className="social-desc">ติดตามข่าวกิจกรรมวิชาการ ข่าวประกาศโรงเรียน และเรื่องราวต่างๆ ของชาวสายน้ำผึ้ง</div>
              </div>
              <div className="social-action">
                <span>ไปยัง Facebook</span> <I.chevR size={14}/>
              </div>
            </a>

            {/* Facebook ฝ่ายโสตฯ */}
            <a href="https://www.facebook.com/share/1ajdqCeT9X/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="social-link-card fb-av">
              <div className="social-icon">f</div>
              <div className="social-info">
                <div className="social-name">ชมรมโสตทัศนศึกษา สายน้ำผึ้ง</div>
                <div className="social-handle">@SNP.AVclub</div>
                <div className="social-desc">ภาพเบื้องหลังการจัดกิจกรรม ภาพถ่ายสวยๆ จากช่างภาพชมรมโสตฯ และข่าวประชาสัมพันธ์ชมรม</div>
              </div>
              <div className="social-action">
                <span>ไปยัง Facebook</span> <I.chevR size={14}/>
              </div>
            </a>

            {/* YouTube ฝ่ายโสตฯ */}
            <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" className="social-link-card yt">
              <div className="social-icon yt-icon"><I.youtube size={22}/></div>
              <div className="social-info">
                <div className="social-name">ชมรมโสตทัศนศึกษา สายน้ำผึ้ง Channel</div>
                <div className="social-handle">@SNP.AV.Channel</div>
                <div className="social-desc">ช่องทางหลักสำหรับการถ่ายทอดสด (Live Stream) พิธีการ กิจกรรมโรงเรียน และวิดีโอชมรม</div>
              </div>
              <div className="social-action">
                <span>ไปยัง YouTube</span> <I.chevR size={14}/>
              </div>
            </a>
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
          <div className="sub">ฝ่ายโสตทัศนศึกษา · ไทม์ไลน์กิจกรรม · ข่าวประชาสัมพันธ์</div>
        </div>
        <div className="actions">
          {isAdmin && <button className="btn primary"><I.plus size={14}/> สร้างประกาศ</button>}
        </div>
      </div>

      {/* 1. ไทม์ไลน์กิจกรรม */}
      <div className="card">
        <div className="card-head">
          <h3>ไทม์ไลน์กิจกรรม (อัพเดท 1 ครั้งจะครอบคลุม 1 เทอม)</h3>
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

      {/* 2. ข่าวประชาสัมพันธ์โรงเรียน */}
      <div className="card">
        <div className="card-head">
          <h3>ข่าวประชาสัมพันธ์</h3>
          <a href="https://www.sainampeung.ac.th/prpublic/" target="_blank" rel="noopener noreferrer"
            className="btn ghost sm" style={{marginLeft:'auto', display:'inline-flex', alignItems:'center', gap:4}}>
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

/* Room detail page */
function RoomDetail({ roomId, onNav, auth }) {
  const room = ROOMS_DETAIL[roomId] || ROOMS_DETAIL.av;

  // Filter bookings for this room
  // day: 0..6 (Mon..Sun). Let's convert day index to Thai day names.
  const THAI_DAYS = ["วันจันทร์", "วันอังคาร", "วันพุธ", "วันพฤหัสบดี", "วันศุกร์", "วันเสาร์", "วันอาทิตย์"];
  const roomBookings = useMemo(() => {
    return BOOKINGS.filter(b => b.room === roomId).sort((a, b) => a.day - b.day || a.h - b.h);
  }, [roomId]);

  return (
    <div className="page room-detail-page">
      <div className="room-detail-back">
        <button className="btn outline sm" onClick={() => onNav('dashboard')} style={{display:'inline-flex', alignItems:'center', gap:6, padding:'6px 12px', border:'1px solid var(--border)', borderRadius:'var(--r)', background:'var(--surface)', cursor:'pointer'}}>
          <I.chevL size={14}/> กลับหน้าหลัก
        </button>
      </div>

      <div className="room-detail-hero" style={{background: `linear-gradient(135deg, hsl(${room.hue},30%,20%), hsl(${room.hue},40%,10%))`, padding:'40px 32px', borderRadius:'var(--r-lg)', color:'#fff', position:'relative', overflow:'hidden', marginTop:16}}>
        <div className="stripes" style={{position:'absolute', inset:0, backgroundImage:'repeating-linear-gradient(135deg, transparent 0 12px, rgba(255,255,255,0.02) 12px 13px)'}}/>
        <div className="room-detail-hero-content" style={{display:'flex', alignItems:'center', gap:24, position:'relative', zIndex:2}}>
          <div className="room-detail-glyph" style={{width:80, height:80, background:`rgba(255,255,255,0.1)`, borderRadius:'var(--r)', display:'grid', placeItems:'center', fontSize:32, fontWeight:700, fontFamily:'var(--font-display)', color:`hsl(${room.hue},60%,75%)`}}>{room.glyph}</div>
          <div className="room-detail-main-info">
            <span className="room-detail-tag" style={{fontSize:11, fontWeight:600, color:'var(--gold-300)', textTransform:'uppercase', letterSpacing:1}}>ข้อมูลห้องบริการ</span>
            <h1 className="room-detail-title" style={{fontSize:28, fontWeight:700, color:'#fff', marginTop:4, fontFamily:'var(--font-display)'}}>{room.name}</h1>
            <div className="room-detail-meta-row" style={{display:'flex', gap:16, marginTop:8, fontSize:13, color:'rgba(255,255,255,0.8)'}}>
              <span className="room-detail-meta-item" style={{display:'inline-flex', alignItems:'center', gap:6}}><I.info size={14}/> {room.location}</span>
              <span className="room-detail-meta-item" style={{display:'inline-flex', alignItems:'center', gap:6}}><I.users size={14}/> {room.capacity}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="room-detail-container two-col" style={{gridTemplateColumns: '1fr 340px', marginTop: 24, display:'grid', gap:'var(--gap)'}}>
        {/* Left Column: Desc & Equipments */}
        <div className="col" style={{gap: '24px', display:'flex', flexDirection:'column'}}>
          <div className="card plain room-desc-card">
            <h3 style={{fontFamily:'var(--font-display)', fontSize:18, color:'var(--navy-800)'}}>รายละเอียดห้อง</h3>
            <p className="room-desc-text" style={{fontSize:14.5, color:'var(--text-muted)', lineHeight:1.6, marginTop:8}}>{room.desc}</p>
            <div style={{marginTop: 20, display: 'flex', gap: 12}}>
              <button className="btn primary" onClick={() => onNav('system')} style={{display:'inline-flex', alignItems:'center', gap:6}}>
                <I.cal size={14}/> จองใช้ห้องนี้
              </button>
              <button className="btn outline" onClick={() => onNav('system')}>
                ดูตารางเวลาจอง
              </button>
            </div>
          </div>

          <div className="card plain">
            <h3 style={{fontFamily:'var(--font-display)', fontSize:18, color:'var(--navy-800)'}}>รายการอุปกรณ์ประจำห้อง</h3>
            <div className="equip-list" style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:12, marginTop:12}}>
              {room.equipment.map((item, idx) => (
                <div key={idx} className="equip-item" style={{display:'flex', gap:10, alignItems:'flex-start', background:'var(--bg-sunken)', padding:10, borderRadius:'var(--r)', border:'1px solid var(--border)'}}>
                  <div className="equip-bullet" style={{color:'var(--gold-500)', marginTop:2}}><I.check size={14}/></div>
                  <span className="equip-text" style={{fontSize:13.5, color:'var(--text-muted)'}}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card plain">
            <h3 style={{fontFamily:'var(--font-display)', fontSize:18, color:'var(--navy-800)'}}>ระเบียบการใช้งานห้อง</h3>
            <div className="rules-list" style={{display:'flex', flexDirection:'column', gap:10, marginTop:12}}>
              {room.rules.map((item, idx) => (
                <div key={idx} className="rules-item" style={{display:'flex', gap:12, alignItems:'flex-start'}}>
                  <div className="rules-num" style={{width:20, height:20, borderRadius:99, background:'var(--navy-50)', color:'var(--navy-600)', display:'grid', placeItems:'center', fontSize:11.5, fontWeight:700, flexShrink:0, marginTop:2}}>{idx + 1}</div>
                  <span className="rules-text" style={{fontSize:13.5, color:'var(--text-muted)', lineHeight:1.5}}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Week Bookings */}
        <div className="col" style={{gap: '24px', display:'flex', flexDirection:'column'}}>
          <div className="card plain">
            <h3 style={{fontFamily:'var(--font-display)', fontSize:18, color:'var(--navy-800)', marginBottom: 12}}>ตารางการใช้งานสัปดาห์นี้</h3>
            {roomBookings.length === 0 ? (
              <div className="no-bookings" style={{padding:'32px 16px', textAlign:'center', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
                <I.cal size={24} style={{color: 'var(--text-subtle)', marginBottom: 8}}/>
                <div style={{fontSize:13, color:'var(--text-subtle)'}}>ไม่มีการใช้งานในสัปดาห์นี้</div>
              </div>
            ) : (
              <div className="room-bookings-list" style={{display:'flex', flexDirection:'column', gap:10}}>
                {roomBookings.map((b, idx) => {
                  const formatTime = (h) => {
                    const hrs = Math.floor(h);
                    const mins = Math.round((h - hrs) * 60);
                    return `${String(hrs).padStart(2,'0')}:${String(mins).padStart(2,'0')}`;
                  };
                  return (
                    <div key={idx} className={"room-booking-item " + b.status} style={{padding:12, borderRadius:'var(--r)', borderLeft:'4px solid ' + (b.status === 'confirmed' ? 'var(--navy-500)' : b.status === 'pinned' ? 'var(--gold-500)' : '#cbd5e1'), background:'var(--bg-sunken)', display:'flex', gap:10, alignItems:'flex-start'}}>
                      <div className="room-booking-day-badge" style={{background:'var(--surface)', padding:'2px 8px', borderRadius:4, fontSize:10.5, fontWeight:700, color:'var(--navy-700)', border:'1px solid var(--border)', textTransform:'uppercase'}}>{THAI_DAYS[b.day].replace("วัน", "")}</div>
                      <div className="room-booking-details" style={{flex:1}}>
                        <div className="room-booking-title" style={{fontSize:13, fontWeight:600, color:'var(--navy-800)'}}>{b.title}</div>
                        <div className="room-booking-time" style={{fontSize:11, color:'var(--navy-600)', fontWeight:500, marginTop:2}}>{formatTime(b.h)} - {formatTime(b.h + b.dur)} น.</div>
                        <div className="room-booking-who" style={{fontSize:11, color:'var(--text-subtle)', marginTop:2}}>{b.who}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="card plain room-contact-card" style={{borderLeft: '4px solid var(--gold-400)'}}>
            <h3 style={{fontFamily:'var(--font-display)', fontSize:18, color:'var(--navy-800)'}}>ติดต่อสอบถาม</h3>
            <p style={{fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5, marginTop:8}}>
              หากต้องการคำแนะนำเกี่ยวกับการใช้อุปกรณ์ หรือต้องการขอความช่วยเหลือเรื่องเสียงและแสงติดต่อได้ที่:
            </p>
            <div style={{marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12.5}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
                <I.users size={13} style={{color: 'var(--navy-500)', flexShrink:0}}/>
                <span><b>อาจารย์สมพร วัฒนากุล</b> (หัวหน้าฝ่ายโสตฯ)</span>
              </div>
              <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
                <I.phone size={13} style={{color: 'var(--navy-500)', flexShrink:0}}/>
                <span>เบอร์โทรศัพท์ภายใน: 1208</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

window.Dashboard = Dashboard;
window.Information = Information;
window.FBCard = FBCard;
window.RoomDetail = RoomDetail;

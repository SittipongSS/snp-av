// SNP AV — Personnel, Inventory, Gallery pages
const { useState: pUseState, useMemo: pUseMemo, useRef: pUseRef } = React;

/* ============ PERSONNEL ============ */
function Personnel({ auth = {role:'public'} }) {
  const isPublic = auth.role === 'public';
  const [tab, setTab] = pUseState('teachers');
  const [search, setSearch] = pUseState('');

  const teachers = TEACHERS.filter(t =>
    !search || t.name.includes(search) || t.role.includes(search) || t.subj.includes(search)
  );
  const students = STUDENTS.filter(s =>
    !search || s.name.includes(search) || s.role.includes(search) || s.cls.includes(search) || s.div.includes(search)
  );

  // Group students by div
  const divs = [...new Set(STUDENTS.map(s => s.div))];

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <div className="title">บุคลากร</div>
          <div className="sub">คณะครู {TEACHERS.length} ท่าน · นักเรียนชมรมโสตฯ {STUDENTS.length} คน · ปีการศึกษา 2568</div>
        </div>
        {!isPublic && (
          <div className="actions">
            <button className="btn ghost"><I.download size={14}/> ส่งออกรายชื่อ</button>
            <button className="btn primary"><I.plus size={14}/> เพิ่มสมาชิก</button>
          </div>
        )}
      </div>

      <div className="tabs">
        <button className={"tab" + (tab === 'teachers' ? ' active' : '')} onClick={() => setTab('teachers')}>
          ครู <span style={{color: 'var(--text-subtle)', marginLeft: 4}}>{TEACHERS.length}</span>
        </button>
        <button className={"tab" + (tab === 'students' ? ' active' : '')} onClick={() => setTab('students')}>
          นักเรียนชมรม <span style={{color: 'var(--text-subtle)', marginLeft: 4}}>{STUDENTS.length}</span>
        </button>
        <button className={"tab" + (tab === 'org' ? ' active' : '')} onClick={() => setTab('org')}>
          ผังโครงสร้าง
        </button>
        <div className="search" style={{marginLeft: 'auto', marginBottom: 4}}>
          <I.search size={14}/>
          <input placeholder="ค้นหาชื่อ ตำแหน่ง ฝ่าย…" value={search} onChange={e => setSearch(e.target.value)}/>
        </div>
      </div>

      {tab === 'teachers' && (
        <div className="person-grid">
          {teachers.map(t => (
            <div className="person" key={t.id}>
              <div className="person-photo">
                <div className="stripes"/>
                <div className="glyph">{t.initial}</div>
                <span className="badge gold badge-pos"><I.crown size={10}/> ครู</span>
                <span className="photo-tag">{t.id}</span>
              </div>
              <div>
                <div className="name">{t.name}</div>
                <div className="role">{t.role}</div>
              </div>
              <div className="row" style={{gap: 6, marginTop: 4, flexWrap: 'wrap'}}>
                <span className="badge navy">{t.subj}</span>
                <span className="badge"><I.clock size={10}/> {t.years} ปี</span>
              </div>
              <div className="meta">
                <span>ภายใน {t.ext}</span>
                <span>{t.id}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'students' && (
        <div className="col" style={{gap: 24}}>
          {divs.map(div => {
            const dStudents = students.filter(s => s.div === div);
            if (dStudents.length === 0) return null;
            return (
              <div key={div}>
                <div className="row" style={{gap: 10, marginBottom: 12, alignItems: 'baseline'}}>
                  <div style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 17, fontWeight: 600,
                  }}>{div}</div>
                  <span className="badge">{dStudents.length} คน</span>
                  <div style={{flex: 1, height: 1, background: 'var(--border)', marginLeft: 8}}/>
                </div>
                <div className="person-grid">
                  {dStudents.map(s => (
                    <div className="person" key={s.id}>
                      <div className="person-photo">
                        <div className="stripes"/>
                        <div className="glyph" style={{color: 'var(--gold-300)'}}>{s.initial}</div>
                        {s.role.includes('ประธาน') && (
                          <span className="badge gold badge-pos"><I.star size={10}/> {s.role}</span>
                        )}
                        <span className="photo-tag">{s.id}</span>
                      </div>
                      <div>
                        <div className="name" style={{fontSize: 13}}>{s.name}</div>
                        <div className="role">{s.role}</div>
                      </div>
                      <div className="meta">
                        <span>{s.cls}</span>
                        <span>{s.id}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab === 'org' && <OrgChart/>}
    </div>
  );
}

function OrgChart() {
  const head = TEACHERS[0];
  const sub = TEACHERS[1];
  const room = TEACHERS.slice(2, 5); // 3 room-keepers
  const tech = TEACHERS.slice(5, 8);
  const admin = TEACHERS.slice(8, 10);

  const Node = ({ p, gold }) => (
    <div className="card" style={{
      padding: 12, minWidth: 200, maxWidth: 240,
      borderColor: gold ? 'var(--gold-300)' : 'var(--border)',
      background: gold ? 'var(--gold-50)' : 'var(--surface)',
    }}>
      <div className="row" style={{gap: 10}}>
        <div className="avatar" style={{
          background: gold ? 'var(--gold-400)' : 'var(--navy-100)',
          color: gold ? 'var(--navy-800)' : 'var(--navy-700)',
        }}>{p.initial}</div>
        <div>
          <div style={{fontSize: 12.5, fontWeight: 600, lineHeight: 1.2}}>{p.name}</div>
          <div style={{fontSize: 11, color: 'var(--text-muted)'}}>{p.role}</div>
        </div>
      </div>
    </div>
  );

  const Group = ({ title, members, color }) => (
    <div style={{display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center'}}>
      <div className="badge" style={{background: color || 'var(--navy-50)', color: 'var(--navy-700)'}}>{title}</div>
      <div className="col" style={{gap: 8}}>
        {members.map(m => <Node key={m.id} p={m}/>)}
      </div>
    </div>
  );

  return (
    <div className="card" style={{padding: 28}}>
      <div className="col" style={{alignItems: 'center', gap: 24}}>
        <Node p={head} gold/>
        <div style={{width: 2, height: 24, background: 'var(--border)'}}/>
        <Node p={sub}/>
        <div style={{width: 2, height: 24, background: 'var(--border)'}}/>
        <div style={{height: 2, background: 'var(--border)', width: '100%', maxWidth: 900}}/>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 36, width: '100%', maxWidth: 900,
        }}>
          <Group title="ดูแลห้อง" members={room}/>
          <Group title="งานเทคนิค / ผลิตสื่อ" members={tech}/>
          <Group title="ธุรการ / ประชาสัมพันธ์" members={admin}/>
        </div>
        <div style={{height: 2, background: 'var(--border)', width: '100%', maxWidth: 900, marginTop: 12}}/>
        <div className="row" style={{gap: 12, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 900}}>
          <span className="badge plum">{STUDENTS.length} นักเรียนชมรม — 10 ฝ่ายงาน</span>
          <span className="badge">กล้อง · ตัดต่อ · เสียง · แสง · กราฟิก · ไลฟ์ · เอกสาร · ต้อนรับ · ไอที · โซเชียล</span>
        </div>
      </div>
    </div>
  );
}

/* ============ INVENTORY ============ */
function Inventory({ embedded = false, canApprove = false }) {
  const [cat, setCat] = pUseState('all');
  const [status, setStatus] = pUseState('all');
  const [search, setSearch] = pUseState('');
  const [showQR, setShowQR] = pUseState(false);
  const [showItem, setShowItem] = pUseState(null);

  const cats = ['all', ...new Set(INVENTORY.map(i => i.cat))];
  const statuses = [
    { id: 'all', label: 'ทั้งหมด' },
    { id: 'available', label: 'พร้อมใช้' },
    { id: 'borrowed',  label: 'ถูกยืม' },
    { id: 'low',       label: 'ใกล้หมด' },
    { id: 'out',       label: 'หมด' },
  ];

  const filtered = INVENTORY.filter(i =>
    (cat === 'all' || i.cat === cat) &&
    (status === 'all' || i.status === status) &&
    (!search || i.name.includes(search) || i.id.includes(search))
  );

  const totalValue = INVENTORY.reduce((s, i) => s + i.price * i.total, 0);

  return (
    <div className={embedded ? '' : 'page'}>
      <div className="page-head" style={embedded ? {paddingTop: 0} : {}}>
        <div>
          <div className="title">พัสดุ &amp; ครุภัณฑ์</div>
          <div className="sub">ระบบสต็อกเข้า-ออก ยืม/เบิก ครุภัณฑ์โสตทัศนูปกรณ์ · มูลค่ารวม {(totalValue/1000).toLocaleString('th-TH')} K บาท</div>
        </div>
        <div className="actions">
          <button className="btn ghost" onClick={() => setShowQR(true)}><I.qr size={14}/> สแกน QR</button>
          <button className="btn ghost"><I.in size={14}/> รับเข้าสต็อก</button>
          <button className="btn primary"><I.out size={14}/> ใบยืม-เบิก</button>
        </div>
      </div>

      <div className="stat-grid">
        <div className="stat">
          <div className="label">รายการในระบบ</div>
          <div className="value">{INVENTORY.length}</div>
          <div className="meta">{cats.length - 1} หมวดหมู่</div>
        </div>
        <div className="stat">
          <div className="label">พร้อมให้ยืม</div>
          <div className="value">{INVENTORY.filter(i => i.status === 'available').length}</div>
          <div className="meta"><span className="up" style={{color:'var(--green-500)'}}>{Math.round(INVENTORY.filter(i => i.status === 'available').length / INVENTORY.length * 100)}%</span> ของทั้งหมด</div>
        </div>
        <div className="stat">
          <div className="label">กำลังถูกยืม</div>
          <div className="value">{INVENTORY.filter(i => i.status === 'borrowed').length}</div>
          <div className="meta">2 รายการเลยกำหนด</div>
        </div>
        <div className="stat">
          <div className="label">ใกล้หมด / หมด</div>
          <div className="value" style={{color: 'var(--red-500)'}}>{INVENTORY.filter(i => i.status === 'low' || i.status === 'out').length}</div>
          <div className="meta">ต้องเพิ่มสต็อก</div>
        </div>
      </div>

      <div className="table-wrap">
        <div className="table-tools">
          <div className="row" style={{gap: 4}}>
            {cats.map(c => (
              <button key={c}
                className={"filter-chip" + (cat === c ? ' active' : '')}
                onClick={() => setCat(c)}>
                {c === 'all' ? 'ทุกหมวดหมู่' : c}
              </button>
            ))}
          </div>
          <div style={{width: 1, height: 22, background: 'var(--border)', margin: '0 4px'}}/>
          <div className="row" style={{gap: 4}}>
            {statuses.map(s => (
              <button key={s.id}
                className={"filter-chip" + (status === s.id ? ' active' : '')}
                onClick={() => setStatus(s.id)}>
                {s.label}
              </button>
            ))}
          </div>
          <div className="search" style={{marginLeft: 'auto', width: 220}}>
            <I.search size={13}/>
            <input placeholder="รหัส / ชื่อพัสดุ…" value={search} onChange={e => setSearch(e.target.value)}/>
          </div>
        </div>

        <table className="tbl">
          <thead>
            <tr>
              <th>รหัส</th>
              <th>รายการ</th>
              <th>หมวดหมู่</th>
              <th>สถานะ</th>
              <th style={{textAlign: 'right'}}>คงเหลือ</th>
              <th>การใช้งาน</th>
              <th style={{textAlign: 'right'}}>มูลค่า</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(i => {
              const pct = (i.stock / i.total) * 100;
              const tone = pct === 0 ? 'red' : pct < 40 ? 'amber' : 'gold';
              const statusBadge = {
                available: ['green', 'พร้อมใช้'],
                borrowed:  ['blue', 'ถูกยืม'],
                low:       ['amber', 'ใกล้หมด'],
                out:       ['red', 'หมด'],
              }[i.status];
              const IcoComp = I[i.ico] || I.box;
              return (
                <tr key={i.id} onClick={() => setShowItem(i)} style={{cursor: 'pointer'}}>
                  <td className="mono" style={{color: 'var(--text-muted)'}}>{i.id}</td>
                  <td>
                    <div className="row" style={{gap: 10}}>
                      <div style={{
                        width: 32, height: 32, borderRadius: 7,
                        background: 'var(--bg-sunken)', color: 'var(--navy-600)',
                        display: 'grid', placeItems: 'center', flexShrink: 0,
                      }}><IcoComp size={15}/></div>
                      <div style={{fontWeight: 500}}>{i.name}</div>
                    </div>
                  </td>
                  <td><span className="badge">{i.cat}</span></td>
                  <td><span className={"badge " + statusBadge[0]}><span className="dot"/>{statusBadge[1]}</span></td>
                  <td className="mono" style={{textAlign: 'right'}}>{i.stock}/{i.total}</td>
                  <td style={{width: 140}}>
                    <div className={"bar " + tone}><i style={{width: `${pct}%`}}/></div>
                  </td>
                  <td className="mono" style={{textAlign: 'right', color: 'var(--text-muted)'}}>{i.price.toLocaleString('th-TH')} ฿</td>
                  <td><button className="icon-btn"><I.more size={16}/></button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="card">
        <div className="card-head">
          <h3>รายการยืม-คืนล่าสุด</h3>
          <button className="btn ghost sm more">ดูประวัติทั้งหมด <I.chevR size={12}/></button>
        </div>
        <table className="tbl" style={{margin: '-8px -2px'}}>
          <thead>
            <tr>
              <th>เวลา</th>
              <th>ประเภท</th>
              <th>รหัสพัสดุ</th>
              <th>ผู้ทำรายการ</th>
              <th>หมายเหตุ</th>
              <th>กำหนดคืน</th>
            </tr>
          </thead>
          <tbody>
            {TRANSACTIONS.map((t, i) => {
              const typeChip = {
                out:   ['amber', 'ยืม'],
                in:    ['green', 'คืน'],
                stock: ['blue',  'รับเข้า'],
              }[t.type];
              return (
                <tr key={i}>
                  <td className="mono" style={{color: 'var(--text-subtle)'}}>{t.ts}</td>
                  <td><span className={"badge " + typeChip[0]}><span className="dot"/>{typeChip[1]}</span></td>
                  <td className="mono">{t.item}</td>
                  <td>{t.by}</td>
                  <td style={{color: 'var(--text-muted)'}}>{t.note}</td>
                  <td className="mono" style={{color: t.due !== '-' && t.due.includes('26') ? 'var(--red-500)' : 'var(--text-subtle)'}}>{t.due}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showQR && <QRModal onClose={() => setShowQR(false)}/>}
      {showItem && <ItemModal item={showItem} onClose={() => setShowItem(null)}/>}
    </div>
  );
}

function QRModal({ onClose }) {
  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" style={{maxWidth: 520}} onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <h2>สแกน QR เพื่อยืม-คืนพัสดุ</h2>
          <button className="icon-btn" style={{marginLeft: 'auto'}} onClick={onClose}><I.x size={16}/></button>
        </div>
        <div className="modal-body">
          <div className="qr-box">
            <div className="qr-frame">
              <div className="qr-corner tl"/>
              <div className="qr-corner tr"/>
              <div className="qr-corner bl"/>
              <div className="qr-corner br"/>
              <div className="qr-scanline"/>
              <I.qr size={80} stroke={1} style={{color: 'var(--navy-300)', opacity: 0.4}}/>
            </div>
            <div>
              <div style={{fontWeight: 600, fontSize: 14, marginBottom: 8}}>วางบาร์โค้ดในกรอบ</div>
              <div className="qr-hint">รอตรวจจับรหัสครุภัณฑ์…</div>
              <div className="col" style={{gap: 6, marginTop: 14, fontSize: 12.5}}>
                <div className="row" style={{gap: 8}}><I.check size={14} style={{color: 'var(--green-500)'}}/> ใช้กับรหัส AV-XXX-NNN</div>
                <div className="row" style={{gap: 8}}><I.check size={14} style={{color: 'var(--green-500)'}}/> รองรับการยืม คืน และตรวจสต็อก</div>
                <div className="row" style={{gap: 8}}><I.check size={14} style={{color: 'var(--green-500)'}}/> บันทึกอัตโนมัติเข้าระบบ</div>
              </div>
              <button className="btn ghost sm" style={{marginTop: 12}}>กรอกรหัสด้วยตนเอง</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ItemModal({ item, onClose }) {
  const IcoComp = I[item.ico] || I.box;
  const statusBadge = {
    available: ['green', 'พร้อมใช้'],
    borrowed:  ['blue',  'ถูกยืม'],
    low:       ['amber', 'ใกล้หมด'],
    out:       ['red',   'หมด'],
  }[item.status];

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" style={{maxWidth: 560}} onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <h2>{item.name}</h2>
          <button className="icon-btn" style={{marginLeft: 'auto'}} onClick={onClose}><I.x size={16}/></button>
        </div>
        <div className="modal-body">
          <div className="row" style={{gap: 16, alignItems: 'flex-start'}}>
            <div style={{
              width: 100, height: 100, borderRadius: 12,
              background: 'var(--bg-sunken)', color: 'var(--navy-600)',
              display: 'grid', placeItems: 'center', flexShrink: 0,
              border: '1px solid var(--border)',
            }}>
              <IcoComp size={48} stroke={1.2}/>
            </div>
            <div className="grow col" style={{gap: 6}}>
              <div className="row" style={{gap: 6, flexWrap: 'wrap'}}>
                <span className="badge"><span className="mono">{item.id}</span></span>
                <span className="badge navy">{item.cat}</span>
                <span className={"badge " + statusBadge[0]}><span className="dot"/>{statusBadge[1]}</span>
              </div>
              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8,
                fontSize: 12.5, marginTop: 6,
              }}>
                <div><span className="muted">คงเหลือ:</span> <b className="mono">{item.stock}/{item.total}</b></div>
                <div><span className="muted">มูลค่าต่อหน่วย:</span> <b className="mono">{item.price.toLocaleString('th-TH')} ฿</b></div>
                <div><span className="muted">หมวดหมู่:</span> {item.cat}</div>
                <div><span className="muted">มูลค่ารวม:</span> <b className="mono">{(item.price * item.total).toLocaleString('th-TH')} ฿</b></div>
              </div>
            </div>
          </div>

          <div className="divider"/>

          <div>
            <div style={{fontSize: 11.5, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8}}>ประวัติยืม-คืนล่าสุด</div>
            <div className="col" style={{gap: 6}}>
              {TRANSACTIONS.filter(t => t.item === item.id).slice(0, 3).map((t, i) => (
                <div key={i} className="row" style={{gap: 8, fontSize: 12.5, padding: '6px 0', borderBottom: '1px dashed var(--border)'}}>
                  <span className="mono" style={{color: 'var(--text-subtle)', width: 90}}>{t.ts}</span>
                  <span className={"badge " + ({out:'amber',in:'green',stock:'blue'}[t.type])}>{({out:'ยืม',in:'คืน',stock:'รับเข้า'}[t.type])}</span>
                  <span>{t.by}</span>
                </div>
              ))}
              {TRANSACTIONS.filter(t => t.item === item.id).length === 0 && (
                <div className="muted" style={{fontSize: 12.5, fontStyle: 'italic'}}>ยังไม่มีประวัติ</div>
              )}
            </div>
          </div>
        </div>
        <div className="modal-foot">
          <button className="btn ghost"><I.edit size={14}/> แก้ไข</button>
          <button className="btn ghost"><I.qr size={14}/> พิมพ์ QR</button>
          <button className="btn primary"><I.out size={14}/> สร้างใบยืม</button>
        </div>
      </div>
    </div>
  );
}

/* ============ GALLERY ============ */
function Gallery({ auth = {role:'public'} }) {
  const isPublic = auth.role === 'public';
  return (
    <div className="page">
      <div className="page-head">
        <div>
          <div className="title">แกลเลอรีผลงาน</div>
          <div className="sub">ภาพถ่ายและวีดิทัศน์จากกิจกรรมของโรงเรียน · ผลงานจากชมรมโสตทัศนศึกษา</div>
        </div>
        <div className="actions">
          <button className="btn ghost"><I.filter size={14}/> ปีการศึกษา</button>
          {!isPublic && <button className="btn primary"><I.plus size={14}/> อัปโหลดผลงาน</button>}
        </div>
      </div>

      <div className="row" style={{gap: 6, flexWrap: 'wrap'}}>
        {["ทั้งหมด", "พิธีการ", "กิจกรรมนักเรียน", "วิชาการ", "ดนตรี-กีฬา", "ภาพนิ่ง", "วีดิทัศน์"].map((c, i) => (
          <button key={c} className={"filter-chip" + (i === 0 ? ' active' : '')}>{c}</button>
        ))}
      </div>

      <div className="gallery">
        {GALLERY.map((g, i) => (
          <div key={i} className="pic">
            <div style={{
              height: g.h,
              background: `linear-gradient(135deg, oklch(0.72 0.08 ${g.hue}), oklch(0.55 0.10 ${g.hue + 30}))`,
              position: 'relative',
            }}>
              <div className="stripes"/>
              <div style={{
                position: 'absolute', top: 12, right: 12,
                fontFamily: 'var(--font-mono)', fontSize: 9.5,
                color: '#fff', opacity: 0.7,
                background: 'rgba(15,31,58,0.4)',
                padding: '2px 6px', borderRadius: 4,
                backdropFilter: 'blur(4px)',
              }}>IMG_{(i+1).toString().padStart(3,'0')}.jpg</div>
              <div className="label">
                <div style={{fontWeight: 600}}>{g.label}</div>
                <div className="date">{g.date}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

window.Personnel = Personnel;
window.Inventory = Inventory;
window.Gallery = Gallery;

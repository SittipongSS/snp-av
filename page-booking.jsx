// SNP AV — Booking calendar page
const { useState: bUseState, useRef: bUseRef, useEffect: bUseEffect, useMemo: bUseMemo } = React;

const WEEK_DAYS = ["จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์", "อาทิตย์"];
const WEEK_DATES = [26, 27, 28, 29, 30, 31, 1];
const HOURS = [8,9,10,11,12,13,14,15,16,17]; // 10 hours
const HOUR_H = 48;

function Booking({ viewMode = 'week', embedded = false, canApprove = false, auth = {role:'public'}, onGoLogin }) {
  const isPublic = auth.role === 'public';
  const [roomFilter, setRoomFilter] = bUseState({ av: true, meeting: true, '8103': true });
  const [showModal, setShowModal] = bUseState(null); // { day, room, h, dur }
  const [pendingSel, setPendingSel] = bUseState(null);
  const [bookings, setBookings] = bUseState(BOOKINGS);
  const colRefs = bUseRef({});
  const drag = bUseRef(null);
  const [dragRect, setDragRect] = bUseState(null);

  const fmt = (h) => `${Math.floor(h).toString().padStart(2,'0')}:${(Math.round((h%1)*60)).toString().padStart(2,'0')}`;

  function onSlotMouseDown(e, day) {
    if (isPublic) return;
    if (e.target.closest('.cal-event')) return;
    const col = colRefs.current[day];
    if (!col) return;
    const rect = col.getBoundingClientRect();
    const startY = e.clientY - rect.top;
    drag.current = { day, startY, rect };
    e.preventDefault();
  }

  function onMouseMove(e) {
    if (!drag.current) return;
    const { day, startY, rect } = drag.current;
    const curY = Math.min(Math.max(e.clientY - rect.top, 0), HOURS.length * HOUR_H);
    const top = Math.min(startY, curY);
    const height = Math.max(8, Math.abs(curY - startY));
    setDragRect({ day, top, height });
  }

  function onMouseUp() {
    if (!drag.current || !dragRect) {
      drag.current = null;
      setDragRect(null);
      return;
    }
    const { day, top, height } = dragRect;
    // snap to 30-min
    const snapStart = Math.round(top / (HOUR_H/2)) * (HOUR_H/2);
    const snapEnd = Math.round((top + height) / (HOUR_H/2)) * (HOUR_H/2);
    const h = HOURS[0] + snapStart / HOUR_H;
    const dur = Math.max(0.5, (snapEnd - snapStart) / HOUR_H);
    setShowModal({ day, h, dur, room: 'av' });
    drag.current = null;
    setDragRect(null);
  }

  bUseEffect(() => {
    if (!drag.current) return;
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [dragRect]);

  function confirmBooking(detail) {
    setBookings([...bookings, { ...detail, status: 'pending' }]);
    setShowModal(null);
  }

  return (
    <div className={embedded ? '' : 'page'}>

      <div className="page-head" style={embedded ? {paddingTop: 0} : {}}>
        <div>
          <div className="title">ปฏิทินการใช้ห้อง</div>
          <div className="sub">{isPublic ? 'ห้องโสตฯ · ห้องประชุม · ห้อง 8103' : 'ลากเลือกช่วงเวลาในตารางเพื่อจอง · ห้องโสตฯ · ห้องประชุม · ห้อง 8103'}</div>
        </div>
        <div className="actions">
          <button className="btn ghost"><I.filter size={14}/> ตัวกรอง</button>
          <button className="btn primary" onClick={() => {
            if (isPublic) {
              alert('กรุณาเข้าสู่ระบบด้วยสิทธิ์ผู้ใช้ระบบเพื่อดำเนินการจองห้อง');
              if (onGoLogin) onGoLogin();
            } else {
              setShowModal({ day: 0, h: 9, dur: 1, room: 'av' });
            }
          }}>
            <I.plus size={14}/> จองใหม่
          </button>
        </div>
      </div>

      {/* Room cards summary — hidden for non-admins */}
      {auth.role === 'admin' && <div className="stat-grid" style={{gridTemplateColumns: 'repeat(3, 1fr)'}}>
        {ROOMS.map(r => {
          const used = bookings.filter(b => b.room === r.id).reduce((s,b) => s + b.dur, 0);
          const total = 7 * 10;
          return (
            <div key={r.id} className="stat" style={{display: 'flex', gap: 14, alignItems: 'flex-start'}}>
              <div style={{
                width: 44, height: 44, borderRadius: 10,
                background: r.swatch, color: 'var(--navy-800)',
                display: 'grid', placeItems: 'center',
                fontFamily: 'var(--font-serif)', fontWeight: 600, fontSize: 18,
                flexShrink: 0,
              }}>{r.id === 'av' ? 'AV' : r.id === 'meeting' ? 'M' : '83'}</div>
              <div className="grow">
                <div style={{fontSize: 14, fontWeight: 600}}>{r.name}</div>
                <div className="mono" style={{fontSize: 11, color: 'var(--text-subtle)', marginTop: 2}}>{r.floor} · จุได้ {r.cap} คน</div>
                <div className="row" style={{gap: 10, marginTop: 10}}>
                  <div className="bar gold" style={{flex: 1}}><i style={{width: `${(used/total)*100}%`}}/></div>
                  <span className="mono" style={{fontSize: 11}}>{Math.round((used/total)*100)}%</span>
                </div>
                <div style={{fontSize: 11.5, color: 'var(--text-muted)', marginTop: 4}}>
                  ใช้งาน {used.toFixed(1)} ชม. / สัปดาห์
                </div>
              </div>
            </div>
          );
        })}
      </div>}

      <div className="cal">
        <div className="cal-head">
          <button className="icon-btn"><I.chevL size={16}/></button>
          <button className="icon-btn"><I.chevR size={16}/></button>
          <div className="now">26 พ.ค. — 1 มิ.ย. 2568</div>
          <span className="badge">สัปดาห์ที่ 3</span>
          <div className="cal-room-filter">
            {ROOMS.map(r => (
              <button key={r.id}
                className={"room-chip " + (roomFilter[r.id] ? 'active' : 'muted')}
                onClick={() => setRoomFilter({...roomFilter, [r.id]: !roomFilter[r.id]})}
              >
                <span className="swatch" style={{background: r.swatch}}/>
                {r.short}
              </button>
            ))}
          </div>
        </div>

        <div className="cal-grid">
          {/* hour gutter */}
          <div className="col" style={{borderRight: '1px solid var(--border)'}}>
            <div className="day-head" style={{visibility: 'hidden'}}>
              <span style={{fontSize: 11}}>·</span>
              <span className="num">·</span>
            </div>
            {HOURS.map(h => (
              <div key={h} className="time-label">{h.toString().padStart(2,'0')}:00</div>
            ))}
          </div>

          {WEEK_DAYS.map((d, di) => (
            <div className="col" key={di}>
              <div className={"day-head" + (di === 0 ? " today" : "")}>
                <span>{d}</span>
                <span className="num">{WEEK_DATES[di]}</span>
              </div>
              <div
                style={{position: 'relative', height: HOURS.length * HOUR_H}}
                ref={el => { colRefs.current[di] = el; }}
                onMouseDown={(e) => onSlotMouseDown(e, di)}
              >
                {/* hour grid lines */}
                {HOURS.map((_, hi) => <div key={hi} className="slot" style={{height: HOUR_H}}/>)}

                {/* events */}
                {bookings.filter(b => b.day === di && roomFilter[b.room]).map((b, bi) => {
                  const top = (b.h - HOURS[0]) * HOUR_H;
                  const height = b.dur * HOUR_H - 2;
                  return (
                    <div key={bi}
                      className={"cal-event room-" + b.room + (b.status === 'pending' ? ' ghost' : '')}
                      style={{top, height}}
                      onMouseDown={(e) => e.stopPropagation()}
                    >
                      <div style={{fontWeight: 600}}>{b.title}</div>
                      <div className="who">{ROOMS.find(r => r.id === b.room).short}</div>
                      <div className="who">{fmt(b.h)}–{fmt(b.h + b.dur)}</div>
                    </div>
                  );
                })}

                {/* drag rectangle */}
                {dragRect && dragRect.day === di && (
                  <div className="drag-sel" style={{top: dragRect.top, height: dragRect.height}}/>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* legend + tips */}
      <div className="row" style={{gap: 16, padding: '0 4px', fontSize: 12, color: 'var(--text-muted)'}}>
        <span className="row" style={{gap: 6}}><span className="swatch" style={{width: 10, height: 10, borderRadius: 99, background: 'var(--gold-400)'}}/> ห้องโสตฯ</span>
        <span className="row" style={{gap: 6}}><span className="swatch" style={{width: 10, height: 10, borderRadius: 99, background: '#6ab2e4'}}/> ห้องประชุม</span>
        <span className="row" style={{gap: 6}}><span className="swatch" style={{width: 10, height: 10, borderRadius: 99, background: '#c895d8'}}/> ห้อง 8103</span>
        {!isPublic && (
          <span className="row" style={{gap: 6, marginLeft: 'auto'}}>
            <span className="mono" style={{
              border: '1px solid var(--border)', padding: '1px 6px', borderRadius: 4,
              fontSize: 10.5, background: 'var(--bg-sunken)',
            }}>คลิกลาก</span>
            เลือกช่วงเวลาในตารางเพื่อจอง
          </span>
        )}
      </div>

      {/* BOOKING MODAL — private/admin only */}
      {!isPublic && showModal && (
        <BookingModal
          init={showModal}
          onClose={() => setShowModal(null)}
          onConfirm={confirmBooking}
        />
      )}
    </div>
  );
}

function BookingModal({ init, onClose, onConfirm }) {
  const [room, setRoom] = bUseState(init.room);
  const [day, setDay] = bUseState(init.day);
  const [h, setH] = bUseState(init.h);
  const [dur, setDur] = bUseState(init.dur);
  const [title, setTitle] = bUseState("");
  const [who, setWho] = bUseState("ฝ่ายโสตทัศนศึกษา");

  const fmt = (x) => `${Math.floor(x).toString().padStart(2,'0')}:${(Math.round((x%1)*60)).toString().padStart(2,'0')}`;

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <h2>จองห้อง</h2>
          <button className="icon-btn" style={{marginLeft: 'auto'}} onClick={onClose}><I.x size={16}/></button>
        </div>
        <div className="modal-body">
          <div className="field">
            <label>หัวข้อกิจกรรม</label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="เช่น ประชุมเตรียมงานวันสุนทรภู่" autoFocus/>
          </div>

          <div className="field">
            <label>ห้อง</label>
            <div className="row" style={{gap: 8}}>
              {ROOMS.map(r => (
                <button key={r.id}
                  className={"room-chip" + (room === r.id ? " active" : "")}
                  style={{flex: 1, justifyContent: 'center', padding: '8px 10px'}}
                  onClick={() => setRoom(r.id)}>
                  <span className="swatch" style={{background: r.swatch}}/>
                  {r.short}
                </button>
              ))}
            </div>
          </div>

          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10}}>
            <div className="field">
              <label>วัน</label>
              <select value={day} onChange={e => setDay(+e.target.value)}>
                {WEEK_DAYS.map((d, i) => <option key={i} value={i}>{d} {WEEK_DATES[i]}</option>)}
              </select>
            </div>
            <div className="field">
              <label>เริ่ม</label>
              <input className="mono" value={fmt(h)} onChange={e => {
                const [hh, mm] = e.target.value.split(':').map(Number);
                if (!isNaN(hh)) setH(hh + (mm||0)/60);
              }}/>
            </div>
            <div className="field">
              <label>ระยะเวลา</label>
              <select value={dur} onChange={e => setDur(+e.target.value)}>
                <option value="0.5">30 นาที</option>
                <option value="1">1 ชม.</option>
                <option value="1.5">1 ชม. 30 นาที</option>
                <option value="2">2 ชม.</option>
                <option value="3">3 ชม.</option>
                <option value="4">4 ชม.</option>
                <option value="8">เต็มวัน</option>
              </select>
            </div>
          </div>

          <div className="field">
            <label>ผู้จอง / หน่วยงาน</label>
            <input value={who} onChange={e => setWho(e.target.value)}/>
          </div>

          <div className="field">
            <label>อุปกรณ์เพิ่มเติม</label>
            <div className="row" style={{gap: 6, flexWrap: 'wrap'}}>
              {["ไมโครโฟน", "โปรเจกเตอร์", "ไฟสตูดิโอ", "กล้องถ่ายภาพ", "ไลฟ์สตรีม"].map(eq => (
                <span key={eq} className="filter-chip" style={{cursor: 'pointer'}}>+ {eq}</span>
              ))}
            </div>
          </div>

          <div style={{
            padding: 12, background: 'var(--gold-50)',
            border: '1px solid var(--gold-200)', borderRadius: 8,
            fontSize: 12.5, color: 'var(--gold-600)',
          }}>
            <b>หมายเหตุ:</b> การจองนี้จะ <b>รอการอนุมัติ</b>จากผู้ดูแลห้องก่อน — สถานะจะแสดงเป็น "รอตรวจ"
            ในตารางสัปดาห์จนกว่าจะได้รับการยืนยัน
          </div>
        </div>
        <div className="modal-foot">
          <button className="btn ghost" onClick={onClose}>ยกเลิก</button>
          <button className="btn primary" onClick={() => onConfirm({ day, room, h, dur, title: title || "(ยังไม่ระบุ)", who })}>
            <I.check size={14}/> ส่งคำขอจอง
          </button>
        </div>
      </div>
    </div>
  );
}

window.Booking = Booking;

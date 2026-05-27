// SNP AV — 3-tier System Page (Public/Private/Admin)
const { useState: sUseState, useRef: sUseRef } = React;

/* Auth roles:
   public  — ดูทั่วไปได้ (nav ไม่มี ระบบจัดการ)
   private — จองห้อง + ยืม/คืนได้
   admin   — ทุกอย่าง + เพิ่ม/ลบ/อนุมัติ            */

function SystemPage({ auth, setAuth, onGoLogin }) {
  const [subTab, setSubTab] = sUseState('booking');
  const [isLoggingIn, setIsLoggingIn] = sUseState(false);

  if (auth.role === 'public' && isLoggingIn) {
    return <LoginPage setAuth={setAuth} onCancel={() => setIsLoggingIn(false)}/>;
  }

  const roleColor = auth.role === 'admin' ? 'var(--crimson-500)' : 'var(--navy-600)';
  const roleBadge = auth.role === 'admin' ? ['red', 'ผู้ดูแลระบบ'] : ['navy', 'ผู้ใช้ระบบ'];

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <div className="title">ระบบจัดการภายใน</div>
          <div className="sub">
            {auth.role === 'public' ? 'บุคคลทั่วไป · ตรวจสอบตารางการจองห้อง' : `เข้าสู่ระบบในฐานะ ${auth.name} · ${auth.email}`}
          </div>
        </div>
        <div className="actions">
          {auth.role === 'public' ? (
            <>
              <span className="badge" style={{height: 28, fontSize: 13, background:'var(--navy-50)', color:'var(--navy-600)', display:'inline-flex', alignItems:'center', gap:4}}>
                <I.info size={12}/> โหมดบุคคลทั่วไป (ดูเท่านั้น)
              </span>
              <button className="btn primary sm" onClick={() => setIsLoggingIn(true)} style={{display:'inline-flex', alignItems:'center', gap:4}}>
                <I.bolt size={12}/> เข้าสู่ระบบ
              </button>
            </>
          ) : (
            <>
              <span className={"badge " + roleBadge[0]} style={{height: 28, fontSize: 13}}>
                {auth.role === 'admin' ? <I.crown size={12}/> : <I.bolt size={12}/>}
                {roleBadge[1]}
              </span>
              <button className="btn ghost" onClick={() => setAuth({role:'public',name:'',email:'',phone:''})}>
                <I.x size={14}/> ออกจากระบบ
              </button>
            </>
          )}
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="tabs" style={{marginBottom: 0}}>
        <button className={"tab"+(subTab==='booking'?' active':'')} onClick={()=>setSubTab('booking')}>
          <span className="row" style={{gap:6}}><I.cal size={14}/> จองห้อง</span>
        </button>
        <button className={"tab"+(subTab==='inventory'?' active':'')} onClick={()=>setSubTab('inventory')}>
          <span className="row" style={{gap:6}}><I.box size={14}/> พัสดุ / ครุภัณฑ์</span>
        </button>
        {auth.role === 'admin' && (
          <button className={"tab"+(subTab==='manage'?' active':'')} onClick={()=>setSubTab('manage')}>
            <span className="row" style={{gap:6}}><I.setting size={14}/> จัดการ (Admin)</span>
          </button>
        )}
        {auth.role !== 'public' && (
          <div style={{marginLeft:'auto', display:'flex', alignItems:'center', gap:8, paddingBottom:4}}>
            <div style={{
              width:28, height:28, borderRadius:99,
              background: roleColor, color:'#fff',
              display:'grid', placeItems:'center',
              fontWeight:700, fontSize:12,
            }}>
              {auth.name.slice(-2)}
            </div>
            <span style={{fontSize:13, color:'var(--text-muted)'}}>{auth.name}</span>
          </div>
        )}
      </div>

      <div style={{marginTop:'var(--gap)'}}>
        {subTab==='booking'   && <Booking   embedded canApprove={auth.role==='admin'} auth={auth} onGoLogin={() => setIsLoggingIn(true)}/>}
        {subTab==='inventory' && <Inventory embedded canApprove={auth.role==='admin'} auth={auth} onGoLogin={() => setIsLoggingIn(true)}/>}
        {subTab==='manage' && auth.role==='admin' && <AdminPanel auth={auth}/>}
      </div>
    </div>
  );
}

/* ── Login Page ─────────────────────────────────────── */
function LoginPage({ setAuth, onCancel }) {
  const [email,    setEmail]    = sUseState('');
  const [phone,    setPhone]    = sUseState('');
  const [error,    setError]    = sUseState('');
  const [loading,  setLoading]  = sUseState(false);

  function validate() {
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    const phoneOk = /^0[0-9]{8,9}$/.test(phone.replace(/[-\s]/g,''));
    if (!emailOk) return 'กรุณากรอกอีเมลให้ถูกต้อง';
    if (!phoneOk) return 'กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง (10 หลัก เริ่มด้วย 0)';
    return '';
  }

  function handleLogin(e) {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setLoading(true);
    setError('');
    // Mock async — 800ms
    setTimeout(() => {
      const cleanEmail = email.trim().toLowerCase();
      const isAdmin = cleanEmail.includes('admin') ||
                      cleanEmail.endsWith('@sainampeung.ac.th') && cleanEmail.includes('av');
      const role = isAdmin ? 'admin' : 'private';
      const name = isAdmin ? 'อ.สมพร วัฒนากุล' : 'ผู้ใช้ระบบ';
      setAuth({ role, name, email: cleanEmail, phone: phone.replace(/[-\s]/g,'') });
      setLoading(false);
    }, 800);
  }

  return (
    <div className="page" style={{alignItems:'center', paddingTop:32}}>
      {/* Access tiers info */}
      <div style={{
        maxWidth:760, width:'100%', marginBottom:24,
        display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12,
      }}>
        {[
          { role:'Public',  ico:'users',  color:'var(--navy-200)',  label:'สาธารณะ',
            items:['ดูข่าวสารประกาศ','ดูรายชื่อบุคลากร','ดูแกลเลอรีผลงาน','ข้อมูลทั่วไป'] },
          { role:'Private', ico:'bolt',   color:'var(--navy-500)',  label:'ผู้ใช้ระบบ',
            items:['จองห้องโสตฯ','จองห้องประชุม','ยืม-คืนพัสดุ','ดูสถานะการจอง'] },
          { role:'Admin',   ico:'crown',  color:'var(--gold-400)',  label:'ผู้ดูแลระบบ',
            items:['อนุมัติ/ปฏิเสธการจอง','เพิ่ม/ลบพัสดุ','จัดการบัญชีผู้ใช้','ดูรายงานทั้งหมด'] },
        ].map(tier => {
          const Ico = I[tier.ico];
          return (
            <div key={tier.role} className="card plain" style={{border:'1px solid var(--border)'}}>
              <div className="row" style={{gap:8, marginBottom:10}}>
                <div style={{
                  width:32, height:32, borderRadius:'var(--r)',
                  background:tier.color, color: tier.color===('var(--gold-400)') ? 'var(--navy-900)' : '#fff',
                  display:'grid', placeItems:'center',
                }}>
                  <Ico size={15}/>
                </div>
                <div style={{fontWeight:700, fontFamily:'var(--font-display)', color:'var(--navy-700)'}}>
                  {tier.label}
                </div>
              </div>
              <div className="col" style={{gap:5}}>
                {tier.items.map((item,i) => (
                  <div key={i} style={{fontSize:12.5, color:'var(--text-muted)', display:'flex', gap:6}}>
                    <I.check size={12} style={{color:'var(--green-500)', flexShrink:0, marginTop:2}}/> {item}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Login card */}
      <div style={{
        maxWidth:420, width:'100%',
        background:'var(--surface)',
        border:'1px solid var(--border)',
        borderTop:'4px solid var(--gold-400)',
        borderRadius:'var(--r-md)',
        boxShadow:'var(--shadow-lg)',
        overflow:'hidden',
      }}>
        <div style={{
          background:'linear-gradient(180deg, var(--navy-700) 0%, var(--navy-800) 100%)',
          padding:'26px 32px 22px',
          textAlign:'center', color:'#fff',
        }}>
          <div style={{
            width:56, height:56, borderRadius:99,
            background:'radial-gradient(circle, var(--gold-300), var(--gold-500))',
            display:'grid', placeItems:'center', margin:'0 auto 12px',
            boxShadow:'inset 0 0 0 2px var(--gold-600), 0 4px 12px rgba(0,0,0,0.3)',
          }}>
            <I.bolt size={24} style={{color:'var(--navy-900)'}}/>
          </div>
          <div style={{fontFamily:'var(--font-display)', fontSize:19, fontWeight:700}}>เข้าสู่ระบบจัดการ</div>
          <div style={{fontSize:12.5, color:'var(--gold-200)', marginTop:4}}>
            ฝ่ายโสตทัศนศึกษา · โรงเรียนสายน้ำผึ้ง
          </div>
        </div>

        <form onSubmit={handleLogin} style={{padding:'22px 28px 26px', display:'flex', flexDirection:'column', gap:14}}>
          <div className="field">
            <label>อีเมล</label>
            <input
              type="email"
              placeholder="yourname@sainampeung.ac.th"
              value={email}
              onChange={e=>setEmail(e.target.value)}
              autoFocus
            />
          </div>
          <div className="field">
            <label>เบอร์โทรศัพท์</label>
            <input
              type="tel"
              placeholder="0812345678"
              value={phone}
              onChange={e=>setPhone(e.target.value)}
            />
          </div>

          {error && (
            <div style={{
              background:'var(--red-50)', border:'1px solid var(--red-500)',
              borderRadius:'var(--r)', padding:'8px 12px',
              color:'var(--red-500)', fontSize:13,
            }}>
              <I.x size={13} style={{marginRight:6}}/>{error}
            </div>
          )}

          <button type="submit" className="btn primary"
            style={{height:42, fontSize:15, fontWeight:600, marginTop:4, justifyContent:'center', opacity: loading ? 0.7 : 1}}>
            {loading ? '⏳ กำลังตรวจสอบ…' : <><I.bolt size={15}/> เข้าสู่ระบบ</>}
          </button>

          {onCancel && (
            <button type="button" className="btn ghost" onClick={onCancel}
              style={{height:42, fontSize:14, fontWeight:600, justifyContent:'center', border:'1px solid var(--border)'}}>
              <I.chevL size={14}/> กลับไปโหมดบุคคลทั่วไป (ดูปฏิทิน)
            </button>
          )}

          <div style={{
            borderTop:'1px dashed var(--border)', paddingTop:12,
            fontSize:12, color:'var(--text-subtle)', lineHeight:1.8,
          }}>
            <div style={{fontWeight:600, color:'var(--text-muted)', marginBottom:2}}>หมายเหตุ:</div>
            <div>· อีเมลที่มี <span className="mono">admin</span> หรือ <span className="mono">av@sainampeung</span> → <b>Admin</b></div>
            <div>· อีเมลอื่นๆ ที่ถูกต้อง → <b>Private (ผู้ใช้ระบบ)</b></div>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Admin Panel ────────────────────────────────────── */
function AdminPanel({ auth }) {
  const [pendingBookings] = sUseState([
    { id:'BK-2568-041', room:'ห้องโสตฯ', day:'พุธ 28 พ.ค.', time:'14:00–16:00', who:'ด.ญ.นภัสสร S401', title:'ซ้อมไลฟ์สตรีม', status:'pending' },
    { id:'BK-2568-042', room:'ห้องประชุม', day:'พฤหัส 29 พ.ค.', time:'09:00–10:00', who:'อ.วราภรณ์ T04', title:'ประชุมผู้ปกครอง', status:'pending' },
    { id:'BK-2568-043', room:'ห้อง 8103', time:'11:00–12:30', day:'ศุกร์ 30 พ.ค.', who:'อ.ณัฐวุฒิ T05', title:'ติว O-NET', status:'pending' },
  ]);
  const [pendingBorrow] = sUseState([
    { id:'LN-2568-021', item:'กล้อง Sony A7 III × 1', who:'ด.ญ.ธัญพร S403', due:'27 พ.ค.', status:'pending' },
    { id:'LN-2568-022', item:'ไมค์ไร้สาย Shure × 2', who:'อ.ชาญวิทย์ T07', due:'28 พ.ค.', status:'pending' },
  ]);
  const [approved, setApproved] = sUseState({});

  function act(id, verdict) {
    setApproved(prev => ({...prev, [id]: verdict}));
  }

  return (
    <div className="col" style={{gap:'var(--gap)'}}>
      {/* Stats */}
      <div className="stat-grid">
        <div className="stat">
          <div className="label">รออนุมัติ (จอง)</div>
          <div className="value">{pendingBookings.length}</div>
          <div className="meta">สัปดาห์นี้</div>
        </div>
        <div className="stat">
          <div className="label">รออนุมัติ (ยืม)</div>
          <div className="value">{pendingBorrow.length}</div>
          <div className="meta">รอดำเนินการ</div>
        </div>
        <div className="stat">
          <div className="label">ผู้ใช้ระบบ</div>
          <div className="value">24</div>
          <div className="meta">ครู 10 · นร. 14</div>
        </div>
        <div className="stat">
          <div className="label">สิทธิ์ Admin</div>
          <div className="value">3</div>
          <div className="meta">T01 T03 T06</div>
        </div>
      </div>

      {/* Pending bookings */}
      <div className="card">
        <div className="card-head">
          <h3>อนุมัติการจองห้อง</h3>
          <span className="badge amber">{pendingBookings.filter(b=>!approved[b.id]).length} รอดำเนินการ</span>
        </div>
        <div className="col" style={{gap:8}}>
          {pendingBookings.map(b => (
            <div key={b.id} style={{
              display:'grid', gridTemplateColumns:'auto 1fr auto', gap:12,
              alignItems:'center', padding:'12px 14px',
              background: approved[b.id]==='approved' ? 'var(--green-50)'
                        : approved[b.id]==='rejected' ? 'var(--red-50)' : 'var(--bg-sunken)',
              borderRadius:'var(--r)',
              border:`1px solid ${approved[b.id]==='approved' ? 'var(--green-500)'
                              : approved[b.id]==='rejected' ? 'var(--red-500)' : 'var(--border)'}`,
            }}>
              <div className="mono" style={{fontSize:11, color:'var(--text-subtle)', minWidth:90}}>{b.id}</div>
              <div>
                <div style={{fontWeight:600, fontSize:13.5}}>{b.title}</div>
                <div style={{fontSize:12, color:'var(--text-muted)'}}>
                  {b.room} · {b.day} {b.time} · {b.who}
                </div>
              </div>
              {approved[b.id] ? (
                <span className={"badge "+(approved[b.id]==='approved'?'green':'red')}>
                  <span className="dot"/>{approved[b.id]==='approved'?'อนุมัติแล้ว':'ปฏิเสธแล้ว'}
                </span>
              ) : (
                <div className="row" style={{gap:6}}>
                  <button className="btn sm primary" onClick={()=>act(b.id,'approved')} style={{background:'var(--green-500)', borderColor:'var(--green-500)'}}>
                    <I.check size={12}/> อนุมัติ
                  </button>
                  <button className="btn sm" onClick={()=>act(b.id,'rejected')} style={{color:'var(--red-500)', borderColor:'var(--red-500)'}}>
                    <I.x size={12}/> ปฏิเสธ
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Pending borrow */}
      <div className="card">
        <div className="card-head">
          <h3>อนุมัติการยืมพัสดุ</h3>
          <span className="badge amber">{pendingBorrow.filter(b=>!approved[b.id]).length} รอดำเนินการ</span>
        </div>
        <div className="col" style={{gap:8}}>
          {pendingBorrow.map(b => (
            <div key={b.id} style={{
              display:'grid', gridTemplateColumns:'auto 1fr auto', gap:12,
              alignItems:'center', padding:'12px 14px',
              background: approved[b.id]==='approved' ? 'var(--green-50)'
                        : approved[b.id]==='rejected' ? 'var(--red-50)' : 'var(--bg-sunken)',
              borderRadius:'var(--r)',
              border:`1px solid ${approved[b.id]==='approved'?'var(--green-500)':approved[b.id]==='rejected'?'var(--red-500)':'var(--border)'}`,
            }}>
              <div className="mono" style={{fontSize:11, color:'var(--text-subtle)', minWidth:90}}>{b.id}</div>
              <div>
                <div style={{fontWeight:600, fontSize:13.5}}>{b.item}</div>
                <div style={{fontSize:12, color:'var(--text-muted)'}}>{b.who} · กำหนดคืน {b.due}</div>
              </div>
              {approved[b.id] ? (
                <span className={"badge "+(approved[b.id]==='approved'?'green':'red')}>
                  <span className="dot"/>{approved[b.id]==='approved'?'อนุมัติแล้ว':'ปฏิเสธแล้ว'}
                </span>
              ) : (
                <div className="row" style={{gap:6}}>
                  <button className="btn sm primary" onClick={()=>act(b.id,'approved')} style={{background:'var(--green-500)', borderColor:'var(--green-500)'}}>
                    <I.check size={12}/> อนุมัติ
                  </button>
                  <button className="btn sm" onClick={()=>act(b.id,'rejected')} style={{color:'var(--red-500)', borderColor:'var(--red-500)'}}>
                    <I.x size={12}/> ปฏิเสธ
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

window.SystemPage = SystemPage;

// SNP AV — Formal/School Shell (ราชการ) — Top-bar layout
const { useState: fUseState, useEffect: fUseEffect, useCallback: fUseCallback } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "light",
  "density": "default",
  "accent": "#c08e10",
  "fontPair": "ibm-plex"
}/*EDITMODE-END*/;

const NAV_PUBLIC = [
  { id: 'dashboard', th: 'หน้าหลัก',  ico: 'home',    count: null },
  { id: 'info',      th: 'ข่าวสาร',   ico: 'info',    count: 4 },
  { id: 'personnel', th: 'บุคลากร',   ico: 'users',   count: null },
  { id: 'gallery',   th: 'แกลเลอรี',  ico: 'gallery', count: null },
];
const NAV_SYSTEM = { id: 'system', th: 'ระบบโสตฯ', ico: 'setting', count: null };

function adjustHex(hex, factor) {
  const v = parseInt(hex.slice(1), 16);
  const r = Math.min(255, Math.round(((v >> 16) & 255) * factor));
  const g = Math.min(255, Math.round(((v >> 8)  & 255) * factor));
  const b = Math.min(255, Math.round(( v        & 255) * factor));
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}

function toThaiNum(s) {
  const map = ['๐','๑','๒','๓','๔','๕','๖','๗','๘','๙'];
  return String(s).replace(/[0-9]/g, d => map[+d]);
}

function App() {
  const [page,        setPage]        = fUseState('dashboard');
  const [showNotif,   setShowNotif]   = fUseState(false);
  const [menuOpen,    setMenuOpen]    = fUseState(false);
  const [t,           setTweak]       = useTweaks(TWEAK_DEFAULTS);
  const [auth,        setAuth]        = fUseState({
    role: 'public', name: '', email: '', phone: ''
  });


  fUseEffect(() => {
    document.documentElement.dataset.theme   = t.theme;
    document.documentElement.dataset.density = t.density;
    document.documentElement.style.setProperty('--gold-400', t.accent);
    document.documentElement.style.setProperty('--gold-300', adjustHex(t.accent, 1.15));
    document.documentElement.style.setProperty('--gold-500', adjustHex(t.accent, 0.85));
    const fonts = {
      'ibm-plex':        { body: '"IBM Plex Sans Thai","IBM Plex Sans","Helvetica",sans-serif', display: '"IBM Plex Sans Thai","IBM Plex Sans",Georgia,serif' },
      'sarabun-niramit': { body: '"Sarabun","TH Sarabun PSK","Helvetica",sans-serif', display: '"Niramit","Sarabun",Georgia,serif' },
      'sarabun':         { body: '"Sarabun","Helvetica",sans-serif',                  display: '"Sarabun",Georgia,serif' },
      'prompt':          { body: '"Prompt","Helvetica",sans-serif',                   display: '"Prompt",Georgia,serif' },
      'mitr':            { body: '"Mitr","Helvetica",sans-serif',                     display: '"Mitr",Georgia,serif' },
    }[t.fontPair] || {};
    if (fonts.body)    document.documentElement.style.setProperty('--font',         fonts.body);
    if (fonts.display) {
      document.documentElement.style.setProperty('--font-serif',   fonts.display);
      document.documentElement.style.setProperty('--font-display', fonts.display);
    }
  }, [t]);

  const navigate = fUseCallback((id) => {
    setPage(id);
    setMenuOpen(false);
  }, []);

  const isLoggedIn = auth.role !== 'public';
  const isAdmin    = auth.role === 'admin';
  const navItems   = [...NAV_PUBLIC, NAV_SYSTEM];
  const curr       = navItems.find(n => n.id === page || (n.id === 'system' && page === 'system-login')) || NAV_PUBLIC[0];

  return (
    <div className="app-shell" data-screen-label={curr?.th}>
      {/* ── Top navbar ── */}
      <header className="topnav">
        <div className="topnav-inner">
          {/* Hamburger — mobile only, left side */}
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <I.x size={20}/> : <I.more size={20}/>}
          </button>

          {/* Brand */}
          <div className="topnav-brand" onClick={() => navigate('dashboard')}>
            <div className="seal seal-xs">
              <div className="seal-mark" style={{fontSize:9}}>สนผ</div>
            </div>
            <div className="topnav-brand-text">
              <span className="topnav-school">สายน้ำผึ้ง</span>
              <span className="topnav-dept">โสตฯ</span>
            </div>
          </div>

          {/* Desktop nav links */}
          <nav className="topnav-links">
            {navItems.map(n => {
              const Ico = I[n.ico];
              return (
                <button key={n.id}
                  className={"topnav-item" + (page === n.id || (n.id === 'system' && page === 'system-login') ? ' active' : '')}
                  onClick={() => navigate(n.id)}
                >
                  <Ico size={15}/>
                  <span>{n.th}</span>
                  {n.count && <span className="nav-count">{n.count}</span>}
                  {n.id === 'system' && isAdmin && (
                    <span className="nav-count nav-count-gold">A</span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right actions */}
          <div className="topnav-actions">
            <div className="search">
              <I.search size={13}/>
              <input placeholder="ค้นหา…"/>
            </div>
            <button className="icon-btn" onClick={() => setShowNotif(!showNotif)}>
              <I.bell size={16}/>
              <span className="dot"/>
            </button>
            {isLoggedIn ? (
              <div className="user-pill" style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer' }}>
                <div className={"avatar " + (isAdmin ? "avatar-admin" : "avatar-user")}>
                  {auth.name.slice(-2)}
                </div>
                <span className="user-pill-name">{auth.name}</span>
              </div>
            ) : (
              <button className="btn sm topnav-login" onClick={() => navigate('system-login')}>
                <I.bolt size={13}/> <span className="login-text">เข้าสู่ระบบ</span>
              </button>
            )}

          </div>
        </div>
      </header>

      {/* ── Mobile drawer ── */}
      {menuOpen && <div className="drawer-overlay" onClick={() => setMenuOpen(false)}/>}
      <div className={"drawer" + (menuOpen ? ' open' : '')}>
        <nav className="drawer-nav">
          {navItems.map(n => {
            const Ico = I[n.ico];
            return (
              <button key={n.id}
                className={"drawer-item" + (page === n.id || (n.id === 'system' && page === 'system-login') ? ' active' : '')}
                onClick={() => navigate(n.id)}
              >
                <Ico size={18}/>
                <span>{n.th}</span>
                {n.count && <span className="nav-count">{n.count}</span>}
              </button>
            );
          })}
        </nav>
        <div className="drawer-divider"/>
        <button className="drawer-item" onClick={() => { setShowNotif(!showNotif); setMenuOpen(false); }}>
          <I.bell size={18}/>
          <span>แจ้งเตือน</span>
          <span className="nav-count">{NOTIFS.filter(n=>n.unread).length}</span>
        </button>
        {isLoggedIn ? (
          <div className="drawer-user">
            <div className={"drawer-avatar " + (isAdmin ? "avatar-admin" : "avatar-user")}>
              {auth.name.slice(-2)}
            </div>
            <div className="drawer-user-info">
              <div className="drawer-user-name">{auth.name}</div>
              <div className="drawer-user-role">{isAdmin ? 'ผู้ดูแลระบบ' : 'ผู้ใช้ระบบ'}</div>
            </div>
            <button className="icon-btn" onClick={() => { setAuth({role:'public',name:'',email:'',phone:''}); setMenuOpen(false); }}
              title="ออกจากระบบ">
              <I.x size={14}/>
            </button>
          </div>
        ) : (
          <button className="drawer-item" onClick={() => navigate('system-login')}>
            <I.bolt size={18}/>
            <span>เข้าสู่ระบบ</span>
          </button>
        )}
      </div>

      {/* ── Access banner ── */}



      {/* ── Page content ── */}
      <main>
        {page === 'dashboard' && <Dashboard onNav={setPage} auth={auth}/>}
        {page === 'info'      && <Information auth={auth}/>}
        {(page === 'system' || page === 'system-login') && <SystemPage auth={auth} setAuth={setAuth} initialLogin={page === 'system-login'}/>}
        {page === 'personnel' && <Personnel auth={auth}/>}
        {page === 'gallery'   && <Gallery auth={auth}/>}
        {page.startsWith('room-') && <RoomDetail roomId={page.replace('room-', '')} onNav={navigate} auth={auth}/>}
      </main>

      {/* Footer */}
      <footer className="gov-footer">
        <div className="gov-footer-inner">
          <div>
            <h4>โรงเรียนสายน้ำผึ้ง ในพระอุปถัมภ์ฯ</h4>
            <div>๑๘๖ ถนนสุขุมวิท ๒๓ แขวงคลองเตยเหนือ<br/>เขตวัฒนา กรุงเทพมหานคร ๑๐๑๑๐</div>
            <div style={{marginTop:8}}>โทรศัพท์ {toThaiNum('0-2251-1116')} · โทรสาร {toThaiNum('0-2251-1118')}</div>
          </div>
          <div>
            <h4>ฝ่ายโสตทัศนศึกษา</h4>
            <div>อาคาร ๘ ชั้น ๑ ห้อง ๘๑๐๔</div>
            <div>เวลาทำการ {toThaiNum('07:30')}–{toThaiNum('17:00')} น.</div>
            <div>ภายใน {toThaiNum(1208)}</div>
          </div>
          <div>
            <h4>ลิงก์ที่เกี่ยวข้อง</h4>
            <a href="https://www.sainampeung.ac.th" target="_blank" style={{display:'block',marginBottom:4}}>· เว็บไซต์หลักของโรงเรียน</a>
            <a href="https://www.facebook.com/share/1Ap8RkkfLM/" target="_blank" style={{display:'block',marginBottom:4}}>· Facebook โรงเรียน</a>
            <a href="https://www.facebook.com/share/1ajdqCeT9X/" target="_blank" style={{display:'block',marginBottom:4}}>· Facebook ฝ่ายโสตฯ</a>
            <div>· กระทรวงศึกษาธิการ</div>
          </div>
        </div>
        <div className="copyright">
          © พุทธศักราช {toThaiNum(2568)} · ฝ่ายโสตทัศนศึกษา โรงเรียนสายน้ำผึ้ง ในพระอุปถัมภ์ฯ · สงวนลิขสิทธิ์
        </div>
      </footer>

      {/* Notifications panel */}
      {showNotif && (
        <>
          <div style={{position:'fixed',inset:0,zIndex:25}} onClick={() => setShowNotif(false)}/>
          <div className="notif-panel">
            <div className="h">
              <I.bell size={15} style={{marginRight:8,color:'var(--gold-500)'}}/>
              การแจ้งเตือน
              <span className="badge gold" style={{marginLeft:8}}>{NOTIFS.filter(n=>n.unread).length} ใหม่</span>
              <button className="btn ghost sm" style={{marginLeft:'auto'}}>อ่านทั้งหมด</button>
            </div>
            <div className="notif-list">
              {NOTIFS.map((n,i) => {
                const Ico = I[n.ico];
                return (
                  <div key={i} className={"notif-item"+(n.unread?' unread':'')}>
                    <div className="ico"><Ico size={14}/></div>
                    <div className="grow">
                      <div className="what">{n.what}</div>
                      <div className="when">{n.when}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Tweaks */}
      <TweaksPanel title="Tweaks">
        <TweakSection label="ธีม"/>
        <TweakRadio label="โหมด" value={t.theme} options={['light','dark']}
                    onChange={v => setTweak('theme',v)}/>
        <TweakColor label="สีหลัก" value={t.accent}
                    options={['#c08e10','#8b1e1e','#1d3f7a','#426a2a']}
                    onChange={v => setTweak('accent',v)}/>
        <TweakSection label="ฟอนต์"/>
        <TweakSelect label="คู่ฟอนต์" value={t.fontPair}
                     options={['ibm-plex','sarabun-niramit','sarabun','prompt','mitr']}
                     onChange={v => setTweak('fontPair',v)}/>
        <TweakSection label="เลย์เอาต์"/>
        <TweakRadio label="ความหนาแน่น" value={t.density}
                    options={['compact','default','spacious']}
                    onChange={v => setTweak('density',v)}/>
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);

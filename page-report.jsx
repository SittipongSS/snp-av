// SNP AV — Report Problem Page
const { useState } = React;

function ReportProblem({ auth = {role:'public'}, onSubmit, onGoLogin }) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [reporter, setReporter] = useState(auth.name || "");
  const [department, setDepartment] = useState("กลุ่มสาระการเรียนรู้วิทยาศาสตร์และเทคโนโลยี");
  const [location, setLocation] = useState("");
  const [item, setItem] = useState("");
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const departments = [
    "กลุ่มสาระการเรียนรู้วิทยาศาสตร์และเทคโนโลยี",
    "กลุ่มสาระการเรียนรู้คณิตศาสตร์",
    "กลุ่มสาระการเรียนรู้ภาษาไทย",
    "กลุ่มสาระการเรียนรู้ภาษาต่างประเทศ",
    "กลุ่มสาระการเรียนรู้สังคมศึกษา ศาสนา และวัฒนธรรม",
    "กลุ่มสาระการเรียนรู้สุขศึกษาและพลศึกษา",
    "กลุ่มสาระการเรียนรู้ศิลปะ",
    "กลุ่มสาระการเรียนรู้การงานอาชีพ",
    "ฝ่ายบริหาร",
    "อื่นๆ"
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!date || !reporter || !department || !location || !item || !description) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }
    
    if (onSubmit) {
      onSubmit({ date, reporter, department, location, item, description });
    }
    setSubmitted(true);
  };

  if (auth.role === 'public') {
    return (
      <div className="page" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', textAlign: 'center'}}>
        <div style={{width: 64, height: 64, borderRadius: '50%', background: 'var(--gold-100)', color: 'var(--gold-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24}}>
          <I.alert size={32} />
        </div>
        <h2 style={{fontFamily: 'var(--font-display)', color: 'var(--navy-800)', marginBottom: 8}}>เฉพาะสมาชิกที่สามารถแจ้งปัญหาได้</h2>
        <p style={{color: 'var(--text-muted)', maxWidth: 400, lineHeight: 1.6, marginBottom: 24}}>
          กรุณาเข้าสู่ระบบด้วยสิทธิ์ผู้ใช้ระบบเพื่อดำเนินการแจ้งปัญหาอุปกรณ์โสตฯ หรือแจ้งปัญหาการใช้งานห้องบริการ
        </p>
        <button className="btn primary" onClick={onGoLogin} style={{padding: '8px 24px'}}>
          <I.bolt size={14}/> เข้าสู่ระบบเพื่อทำรายการ
        </button>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="page" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center'}}>
        <div style={{width: 64, height: 64, borderRadius: '50%', background: 'var(--green-100)', color: 'var(--green-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24}}>
          <I.check size={32} />
        </div>
        <h2 style={{fontFamily: 'var(--font-display)', color: 'var(--navy-800)', marginBottom: 8}}>ส่งรายงานแจ้งปัญหาเรียบร้อยแล้ว</h2>
        <p style={{color: 'var(--text-muted)', maxWidth: 400, lineHeight: 1.6, marginBottom: 24}}>
          ฝ่ายโสตทัศนศึกษาได้รับข้อมูลการแจ้งปัญหาของคุณแล้ว และจะดำเนินการตรวจสอบแก้ไขโดยเร็วที่สุด
        </p>
        <button className="btn primary" onClick={() => {
          setSubmitted(false);
          setItem("");
          setDescription("");
        }}>
          แจ้งปัญหาเพิ่มเติม
        </button>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <div className="title">แจ้งปัญหาอุปกรณ์โสตฯ</div>
          <div className="sub">รายงานปัญหาการใช้งานอุปกรณ์ หรือห้องบริการของฝ่ายโสตทัศนศึกษา</div>
        </div>
      </div>

      <div className="card" style={{maxWidth: 600, margin: '0 auto', marginTop: 16}}>
        <div className="card-head" style={{borderBottom: '1px solid var(--border)', paddingBottom: 16, marginBottom: 16}}>
          <h3 style={{fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--navy-800)'}}>แบบฟอร์มแจ้งปัญหา</h3>
        </div>
        
        <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: 16}}>
          <div className="field">
            <label>วันที่แจ้ง <span style={{color: 'var(--red-500)'}}>*</span></label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
          </div>

          <div className="field">
            <label>ผู้แจ้ง <span style={{color: 'var(--red-500)'}}>*</span></label>
            <input type="text" value={reporter} onChange={e => setReporter(e.target.value)} placeholder="ชื่อ-นามสกุล" required />
          </div>

          <div className="field">
            <label>กลุ่มสาระการเรียนรู้ / หน่วยงาน <span style={{color: 'var(--red-500)'}}>*</span></label>
            <select value={department} onChange={e => setDepartment(e.target.value)} required>
              {departments.map(dep => (
                <option key={dep} value={dep}>{dep}</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label>สถานที่พบปัญหา <span style={{color: 'var(--red-500)'}}>*</span></label>
            <input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="เช่น อาคาร 8 ชั้น 1 ห้องโสตฯ, ห้อง 8103" required />
          </div>

          <div className="field">
            <label>รายการ / ชื่ออุปกรณ์ <span style={{color: 'var(--red-500)'}}>*</span></label>
            <input type="text" value={item} onChange={e => setItem(e.target.value)} placeholder="เช่น ไมโครโฟนไร้สาย, โปรเจกเตอร์, คอมพิวเตอร์" required />
          </div>

          <div className="field">
            <label>รายละเอียดปัญหา <span style={{color: 'var(--red-500)'}}>*</span></label>
            <textarea 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              placeholder="อธิบายลักษณะปัญหา หรืออาการที่พบ"
              rows={4} 
              style={{resize: 'vertical'}}
              required 
            />
          </div>

          <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: 12}}>
            <button type="submit" className="btn primary" style={{padding: '8px 24px'}}>
              <I.check size={14} /> ส่งข้อมูลแจ้งปัญหา
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

window.ReportProblem = ReportProblem;

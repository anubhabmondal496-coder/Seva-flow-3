import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Phone, Lock, MapPin, GraduationCap, ChevronRight } from 'lucide-react';

const STATES = ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi','Jammu & Kashmir'];

const Field = ({ label, children }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">{label}</label>
    {children}
  </div>
);

const inputCls = "w-full px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-sm transition";

const LoginPage = ({ setCurrentUser }) => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '', phone: '', password: '', age: '', state: '', education: '', occupation: '',
    isPwd: false, disabilityType: '', udidNumber: '', disabilityPercentage: ''
  });

  const set = (field, val) => setForm(f => ({ ...f, [field]: val }));
  const handleChange = e => set(e.target.name, e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (isLogin) {
      const saved = JSON.parse(localStorage.getItem('govschemes_user') || 'null');
      if (!saved) { setError('No account found. Please register first.'); return; }
      if (saved.phone !== form.phone || saved.password !== form.password) {
        setError('Incorrect phone number or password.'); return;
      }
      setCurrentUser(saved);
      navigate('/');
    } else {
      if (!form.name || !form.phone || !form.password) { setError('Name, Phone and Password are required.'); return; }
      if (form.phone.length !== 10 || isNaN(form.phone)) { setError('Please enter a valid 10-digit mobile number.'); return; }
      if (form.isPwd && !form.disabilityType) { setError('Please select your disability type.'); return; }
      const user = { ...form, bookmarkedSchemes: [], id: Date.now().toString() };
      localStorage.setItem('govschemes_user', JSON.stringify(user));
      setCurrentUser(user);
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full shadow-xl mb-4 overflow-hidden bg-white border-4 border-green-100">
            <img src="/logo.png" alt="Seva Flow" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900">Seva Flow</h1>
          <p className="text-gray-500 mt-1">Your gateway to government benefits</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Tabs */}
          <div className="flex" role="tablist">
            <button role="tab" aria-selected={isLogin} onClick={() => { setIsLogin(true); setError(''); }}
              className={`flex-1 py-4 text-sm font-bold transition-all ${isLogin ? 'bg-green-700 text-white' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}>
              Login
            </button>
            <button role="tab" aria-selected={!isLogin} onClick={() => { setIsLogin(false); setError(''); }}
              className={`flex-1 py-4 text-sm font-bold transition-all ${!isLogin ? 'bg-green-700 text-white' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}>
              Register
            </button>
          </div>

          <div className="p-6 md:p-8 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex gap-2" role="alert">
                <span aria-hidden>⚠️</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* === Common Fields === */}
              {!isLogin && (
                <Field label="Full Name *">
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden />
                    <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Ramesh Kumar"
                      aria-label="Full Name" autoComplete="name"
                      className={`${inputCls} pl-9`} />
                  </div>
                </Field>
              )}

              <Field label="Mobile Number *">
                <div className="relative">
                  <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden />
                  <input name="phone" value={form.phone} onChange={handleChange} placeholder="10-digit mobile number"
                    maxLength={10} inputMode="numeric" aria-label="Mobile Number" autoComplete="tel"
                    className={`${inputCls} pl-9`} />
                </div>
              </Field>

              <Field label="Password *">
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden />
                  <input name="password" value={form.password} onChange={handleChange}
                    type={showPassword ? 'text' : 'password'} placeholder="Create a strong password"
                    aria-label="Password" autoComplete={isLogin ? 'current-password' : 'new-password'}
                    className={`${inputCls} pl-9 pr-10`} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </Field>

              {/* === Registration Extra Fields === */}
              {!isLogin && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Age">
                      <input name="age" value={form.age} onChange={handleChange} placeholder="e.g. 25"
                        type="number" aria-label="Your age" className={inputCls} />
                    </Field>
                    <Field label="Occupation">
                      <select name="occupation" value={form.occupation} onChange={handleChange}
                        aria-label="Select occupation" className={`${inputCls} bg-white`}>
                        <option value="">Select</option>
                        {['Student','Farmer','Business Owner','Salaried','Self Employed','Homemaker','Unemployed'].map(o => (
                          <option key={o}>{o}</option>
                        ))}
                      </select>
                    </Field>
                  </div>

                  <Field label="State">
                    <div className="relative">
                      <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden />
                      <select name="state" value={form.state} onChange={handleChange}
                        aria-label="Select your state" className={`${inputCls} pl-9 bg-white`}>
                        <option value="">Select your state</option>
                        {STATES.map(s => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                  </Field>

                  <Field label="Education">
                    <div className="relative">
                      <GraduationCap size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden />
                      <select name="education" value={form.education} onChange={handleChange}
                        aria-label="Select education level" className={`${inputCls} pl-9 bg-white`}>
                        <option value="">Select education level</option>
                        {['No formal education','Primary (Up to 5th)','Middle (6th–8th)','Secondary (9th–10th)','Higher Secondary (11th–12th)','Diploma','Graduate','Post Graduate'].map(e => (
                          <option key={e}>{e}</option>
                        ))}
                      </select>
                    </div>
                  </Field>

                  {/* === PWD / Disability Section === */}
                  <div className="border-2 border-blue-100 rounded-2xl p-4 bg-blue-50">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl" aria-hidden>♿</span>
                      <div className="flex-1">
                        <p className="font-bold text-gray-800 text-sm">Person with Disability (PWD)?</p>
                        <p className="text-xs text-gray-500 mt-0.5">Unlock special government schemes for disabled persons</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => set('isPwd', !form.isPwd)}
                        aria-pressed={form.isPwd}
                        aria-label="Toggle: I am a Person with Disability"
                        className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${form.isPwd ? 'bg-blue-600' : 'bg-gray-300'}`}
                      >
                        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.isPwd ? 'translate-x-5' : ''}`} />
                      </button>
                    </div>

                    {form.isPwd && (
                      <div className="space-y-3 mt-4 pt-4 border-t border-blue-200">

                        <Field label="Type of Disability *">
                          <select
                            value={form.disabilityType}
                            onChange={e => set('disabilityType', e.target.value)}
                            aria-label="Select type of disability"
                            className={`${inputCls} bg-white border-blue-200 focus:ring-blue-500`}
                          >
                            <option value="">-- Select disability type --</option>
                            <optgroup label="🟦 Visual Impairment">
                              <option value="Blind">👁️ Blind — Total vision loss</option>
                              <option value="Low Vision">👁️ Low Vision — Partial sight</option>
                            </optgroup>
                            <optgroup label="🟧 Hearing / Speech">
                              <option value="Deaf">👂 Deaf — Total hearing loss</option>
                              <option value="Hard of Hearing">👂 Hard of Hearing — Partial</option>
                              <option value="Speech Impairment">🗣️ Speech / Language Disability</option>
                              <option value="Deaf-Blind">Deaf-Blind — Combined</option>
                            </optgroup>
                            <optgroup label="🟩 Physical / Locomotor">
                              <option value="Locomotor Disability">🦽 Locomotor / Physical Disability</option>
                              <option value="Cerebral Palsy">Cerebral Palsy</option>
                              <option value="Dwarfism">Dwarfism</option>
                              <option value="Muscular Dystrophy">Muscular Dystrophy</option>
                              <option value="Acid Attack Victim">Acid Attack Victim</option>
                            </optgroup>
                            <optgroup label="🟪 Neurological / Mental">
                              <option value="Intellectual Disability">Intellectual Disability</option>
                              <option value="Autism Spectrum Disorder">Autism Spectrum Disorder (ASD)</option>
                              <option value="Mental Illness">Mental Illness</option>
                              <option value="Specific Learning Disability">Specific Learning Disability (SLD)</option>
                            </optgroup>
                            <optgroup label="🟥 Chronic Conditions">
                              <option value="Chronic Neurological">Chronic Neurological Condition</option>
                              <option value="Haemophilia">Haemophilia / Blood Disorder</option>
                              <option value="Thalassemia">Thalassemia / Sickle Cell Disease</option>
                            </optgroup>
                            <option value="Multiple Disabilities">♿ Multiple Disabilities</option>
                          </select>
                        </Field>

                        <Field label="UDID Number (Unique Disability ID — optional)">
                          <input
                            value={form.udidNumber}
                            onChange={e => set('udidNumber', e.target.value)}
                            placeholder="e.g. UP/2023/0012345"
                            aria-label="UDID — Unique Disability Identification Number"
                            className={`${inputCls} border-blue-200 focus:ring-blue-500`}
                          />
                          <p className="text-xs text-blue-600 mt-1">
                            📌 Don't have UDID? Apply at{' '}
                            <a href="https://swavlambancard.gov.in" target="_blank" rel="noopener noreferrer" className="underline">swavlambancard.gov.in</a>
                          </p>
                        </Field>

                        <Field label="Disability Percentage (%) — from Medical Certificate">
                          <input
                            value={form.disabilityPercentage}
                            onChange={e => set('disabilityPercentage', e.target.value)}
                            placeholder="e.g. 40"
                            type="number" min="1" max="100"
                            aria-label="Disability percentage from medical board certificate"
                            className={`${inputCls} border-blue-200 focus:ring-blue-500`}
                          />
                          <p className="text-xs text-gray-400 mt-1">Most schemes require ≥ 40% disability</p>
                        </Field>

                        {/* Document checklist */}
                        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-xl" role="note">
                          <p className="text-xs text-yellow-800 font-bold mb-1">📋 Documents needed for PWD schemes:</p>
                          <ul className="text-xs text-yellow-700 space-y-0.5 list-disc list-inside">
                            <li>Disability Certificate (from Government Medical Board)</li>
                            <li>UDID Card / Swavlamban Card (if issued)</li>
                            <li>Aadhar Card + Passport Size Photo</li>
                            <li>Bank Passbook (for DBT transfers)</li>
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}

              <button type="submit"
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-green-700 hover:bg-green-800 text-white rounded-xl font-bold text-base transition-all shadow-lg mt-2">
                {isLogin ? 'Login to My Account' : 'Create My Account'} <ChevronRight size={20} aria-hidden />
              </button>
            </form>

            <p className="text-center text-xs text-gray-400 mt-6">
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="text-green-700 font-semibold hover:underline">
                {isLogin ? 'Register here' : 'Login here'}
              </button>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6" role="note">
          🔒 Your data is stored securely on your device only
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

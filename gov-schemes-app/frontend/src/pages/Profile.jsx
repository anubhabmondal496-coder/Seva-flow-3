import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Phone, MapPin, GraduationCap, Briefcase, BookmarkIcon, LogOut, Edit3, Check, X, ChevronRight } from 'lucide-react';
import axios from 'axios';

const STATES = ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi','Jammu & Kashmir'];

const categoryColors = {
  'Education': 'bg-blue-100 text-blue-700',
  'Agriculture': 'bg-green-100 text-green-700',
  'Business': 'bg-purple-100 text-purple-700',
  'Health': 'bg-red-100 text-red-700',
  'Housing': 'bg-orange-100 text-orange-700',
  'Finance': 'bg-yellow-100 text-yellow-700',
  'Social Welfare': 'bg-pink-100 text-pink-700',
  'Women & Child Development': 'bg-rose-100 text-rose-700',
  'Skill Development': 'bg-indigo-100 text-indigo-700',
};

const ProfileStat = ({ label, value, icon }) => (
  <div className="flex flex-col items-center bg-gray-50 rounded-xl p-3 text-center">
    <span className="text-2xl mb-1">{icon}</span>
    <span className="text-lg font-bold text-gray-900">{value || '—'}</span>
    <span className="text-xs text-gray-500 mt-0.5">{label}</span>
  </div>
);

const Profile = ({ currentUser, setCurrentUser }) => {
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(currentUser || {});
  const [bookmarks, setBookmarks] = useState([]);
  const [loadedBookmarks, setLoadedBookmarks] = useState(false);

  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-6 animate-in fade-in duration-300">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
          <User size={40} className="text-green-600" />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">You are not logged in</h2>
          <p className="text-gray-500 mb-6">Create a free account to save schemes and track your applications</p>
          <Link to="/login"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-green-700 text-white rounded-full font-bold hover:bg-green-800 transition shadow-lg">
            Login / Register <ChevronRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    const updated = { ...currentUser, ...form };
    localStorage.setItem('govschemes_user', JSON.stringify(updated));
    setCurrentUser(updated);
    setEditing(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    navigate('/login');
  };

  const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';
  const completionFields = ['name', 'phone', 'age', 'state', 'education', 'occupation'];
  const completion = Math.round((completionFields.filter(f => currentUser[f]).length / completionFields.length) * 100);

  return (
    <div className="max-w-3xl mx-auto pb-20 animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <button onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 px-4 py-2 rounded-full transition">
          <LogOut size={16} /> Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: User card */}
        <div className="md:col-span-1 space-y-5">
          {/* Avatar + name */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-700 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3 shadow-md">
              {getInitials(currentUser.name)}
            </div>
            <h2 className="text-xl font-bold text-gray-900">{currentUser.name}</h2>
            <p className="text-sm text-gray-500 mt-1">{currentUser.occupation || 'No occupation set'} • {currentUser.state || 'No state set'}</p>

            {/* Profile completion */}
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Profile Completion</span>
                <span className="font-bold text-green-600">{completion}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full transition-all duration-500" style={{ width: `${completion}%` }}></div>
              </div>
            </div>

            <button onClick={() => setEditing(!editing)}
              className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 border border-green-300 text-green-700 hover:bg-green-50 rounded-xl font-medium text-sm transition">
              <Edit3 size={16} /> {editing ? 'Cancel Editing' : 'Edit Profile'}
            </button>
          </div>

          {/* Stats */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <h3 className="text-sm font-bold text-gray-700 mb-3">My Details</h3>
            <div className="grid grid-cols-2 gap-3">
              <ProfileStat label="Age" value={currentUser.age} icon="🎂" />
              <ProfileStat label="State" value={currentUser.state?.split(' ')[0]} icon="📍" />
              <ProfileStat label="Education" value={currentUser.education?.split(' ')[0]} icon="🎓" />
              <ProfileStat label="Mobile" value={currentUser.phone ? `***${currentUser.phone.slice(-3)}` : null} icon="📱" />
            </div>
          </div>
        </div>

        {/* Right: Edit form + saved schemes */}
        <div className="md:col-span-2 space-y-5">
          {editing ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Edit3 size={18} className="text-green-600" /> Edit Your Details
              </h3>
              <div className="space-y-4">
                {[
                  { name: 'name', label: 'Full Name', type: 'text', placeholder: 'Your full name' },
                  { name: 'age', label: 'Age', type: 'number', placeholder: 'Your age' },
                ].map(({ name, label, type, placeholder }) => (
                  <div key={name}>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">{label}</label>
                    <input name={name} type={type} value={form[name] || ''} placeholder={placeholder}
                      onChange={e => setForm({ ...form, [e.target.name]: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none text-sm transition" />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Occupation</label>
                  <select name="occupation" value={form.occupation || ''} onChange={e => setForm({ ...form, occupation: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none text-sm transition bg-white">
                    <option value="">Select</option>
                    {['Student','Farmer','Business Owner','Salaried','Self Employed','Homemaker','Unemployed'].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">State</label>
                  <select name="state" value={form.state || ''} onChange={e => setForm({ ...form, state: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none text-sm transition bg-white">
                    <option value="">Select state</option>
                    {STATES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Education</label>
                  <select name="education" value={form.education || ''} onChange={e => setForm({ ...form, education: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none text-sm transition bg-white">
                    <option value="">Select education</option>
                    {['No formal education','Primary (Up to 5th)','Middle (6th–8th)','Secondary (9th–10th)','Higher Secondary (11th–12th)','Diploma','Graduate','Post Graduate'].map(e => <option key={e}>{e}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-5">
                <button onClick={handleSave}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-700 text-white rounded-xl font-bold hover:bg-green-800 transition">
                  <Check size={18} /> Save Changes
                </button>
                <button onClick={() => setEditing(false)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition">
                  <X size={18} /> Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <BookmarkIcon size={18} className="text-yellow-500" fill="currentColor" /> Saved Schemes
              </h3>

              {/* Show any bookmarked scheme IDs stored in localStorage + link to ALL Schemes */}
              <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-100 text-center">
                <p className="text-yellow-700 font-medium text-sm mb-3">
                  Browse schemes and click the bookmark icon to save them here!
                </p>
                <Link to="/schemes"
                  className="inline-flex items-center gap-1.5 text-sm text-green-700 font-semibold hover:underline">
                  Browse All Schemes →
                </Link>
              </div>

              <div className="mt-4 space-y-2">
                <div className="grid grid-cols-2 gap-3 mt-4">
                  {[
                    { cat: 'Education', icon: '🎓', desc: 'Scholarships & loans' },
                    { cat: 'Agriculture', icon: '🌾', desc: 'Farmer schemes' },
                    { cat: 'Business', icon: '💼', desc: 'MSME & startup' },
                    { cat: 'Health', icon: '🏥', desc: 'Insurance & hospitals' },
                  ].map(({ cat, icon, desc }) => (
                    <Link to={`/schemes?category=${cat}`} key={cat}
                      className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-green-50 border border-gray-100 hover:border-green-200 rounded-xl transition cursor-pointer">
                      <span className="text-2xl">{icon}</span>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{cat}</p>
                        <p className="text-xs text-gray-500">{desc}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Quick access */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h3 className="text-base font-bold text-gray-800 mb-3">Quick Access</h3>
            <div className="space-y-2">
              {[
                { label: 'Find My Schemes via AI Chat', link: '/chat', emoji: '🤖' },
                { label: 'Browse All Government Schemes', link: '/schemes', emoji: '📋' },
              ].map(({ label, link, emoji }) => (
                <Link to={link} key={link}
                  className="flex items-center justify-between p-3 bg-gray-50 hover:bg-green-50 rounded-xl border border-gray-100 hover:border-green-200 transition">
                  <span className="flex items-center gap-3 text-sm font-medium text-gray-700">
                    <span>{emoji}</span>{label}
                  </span>
                  <ChevronRight size={16} className="text-gray-400" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

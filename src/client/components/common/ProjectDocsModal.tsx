import React, { useState } from 'react';
import {
  BookOpen,
  X,
  Server,
  Database,
  Code2,
  Terminal,
  Layers,
  HelpCircle,
  Copy,
  Check,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectDocsModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'schema' | 'apis' | 'setup' | 'viva'>('architecture');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-3 md:p-6 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden text-slate-800">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 text-white p-5 md:p-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/15 rounded-xl">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-xs font-bold uppercase tracking-wider bg-blue-500/30 text-blue-200 rounded-md border border-blue-400/30">
                  B.Tech Engineering Project Portfolio
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-bold tracking-tight mt-0.5">
                Senior Citizen Assistance Portal — System Architecture & Viva Guide
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-xl transition text-white"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto border-b border-slate-200 bg-slate-50 px-4 shrink-0 text-sm font-semibold">
          <button
            onClick={() => setActiveTab('architecture')}
            className={`py-3.5 px-4 flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'architecture'
                ? 'border-blue-600 text-blue-700 font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" /> System Architecture
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`py-3.5 px-4 flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'schema'
                ? 'border-blue-600 text-blue-700 font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Database className="w-4 h-4" /> MongoDB / Mongoose ER Schema
          </button>
          <button
            onClick={() => setActiveTab('apis')}
            className={`py-3.5 px-4 flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'apis'
                ? 'border-blue-600 text-blue-700 font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Server className="w-4 h-4" /> REST API Endpoints
          </button>
          <button
            onClick={() => setActiveTab('setup')}
            className={`py-3.5 px-4 flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'setup'
                ? 'border-blue-600 text-blue-700 font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Terminal className="w-4 h-4" /> Windows & VS Code Setup
          </button>
          <button
            onClick={() => setActiveTab('viva')}
            className={`py-3.5 px-4 flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'viva'
                ? 'border-blue-600 text-blue-700 font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <HelpCircle className="w-4 h-4" /> Viva Voce Q&A Guide
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6 flex-1 text-slate-700 text-sm leading-relaxed">
          {activeTab === 'architecture' && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
                <h3 className="text-lg font-bold text-blue-900 mb-2">Project Summary & Objective</h3>
                <p className="text-slate-700">
                  The <strong>Senior Citizen Assistance Portal</strong> is an enterprise-grade full-stack web application developed for final-year engineering review. It addresses elderly isolation, mobility challenges, and digital disparity by connecting senior citizens needing daily errands (groceries, medicine pickups, hospital escorts, technology guidance) with vetted community volunteers and administrative oversight.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl">
                  <div className="flex items-center gap-2 font-bold text-slate-900 mb-2 text-base">
                    <Code2 className="w-5 h-5 text-blue-600" />
                    Frontend Tier
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-600 list-disc list-inside">
                    <li>React 19 + TypeScript (SPA)</li>
                    <li>Vite 8 Build & Development Tooling</li>
                    <li>Tailwind CSS Modern Styling</li>
                    <li>Lucide Icons Library</li>
                    <li>Context API (Auth, Accessibility, Alerts)</li>
                    <li>Browser Web Speech API (TTS)</li>
                  </ul>
                </div>

                <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl">
                  <div className="flex items-center gap-2 font-bold text-slate-900 mb-2 text-base">
                    <Server className="w-5 h-5 text-indigo-600" />
                    Backend API Tier
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-600 list-disc list-inside">
                    <li>Node.js + Express.js REST Framework</li>
                    <li>JWT (JSON Web Token) Auth</li>
                    <li>Bcrypt.js Password Hashing (10 Salt Rounds)</li>
                    <li>Role-Based Access Control (RBAC)</li>
                    <li>Axios HTTP Client Interceptors</li>
                    <li>Vite Middleware Integration</li>
                  </ul>
                </div>

                <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl">
                  <div className="flex items-center gap-2 font-bold text-slate-900 mb-2 text-base">
                    <Database className="w-5 h-5 text-emerald-600" />
                    Database Tier
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-600 list-disc list-inside">
                    <li>MongoDB with Mongoose ODM</li>
                    <li>Strict Schema Validation & Timestamps</li>
                    <li>Indexed Relationships & References</li>
                    <li>Fallback Embedded Store (Zero Config Demo)</li>
                    <li>Automatic Seeding & Reset Capability</li>
                  </ul>
                </div>
              </div>

              <div className="border border-slate-200 rounded-2xl p-5 bg-white shadow-xs">
                <h4 className="font-bold text-slate-900 mb-3 text-base">State Machine / Assistance Request Lifecycle</h4>
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                  <span className="px-3 py-1.5 bg-amber-100 text-amber-800 rounded-lg border border-amber-300">
                    1. Requested (Senior Creates)
                  </span>
                  <span>&rarr;</span>
                  <span className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-lg border border-blue-300">
                    2. Accepted (Volunteer or Admin assigns)
                  </span>
                  <span>&rarr;</span>
                  <span className="px-3 py-1.5 bg-indigo-100 text-indigo-800 rounded-lg border border-indigo-300">
                    3. In Progress (Volunteer starts task)
                  </span>
                  <span>&rarr;</span>
                  <span className="px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-lg border border-emerald-300">
                    4. Completed (Delivered)
                  </span>
                  <span>&rarr;</span>
                  <span className="px-3 py-1.5 bg-pink-100 text-pink-800 rounded-lg border border-pink-300">
                    5. Feedback (Senior ratings 1-5 & reviews)
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'schema' && (
            <div className="space-y-5">
              <p className="text-slate-600">
                The database follows a clean normalized relational schema designed with Mongoose models:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs overflow-x-auto">
                  <div className="text-blue-400 font-bold mb-2">// 1. User Collection</div>
                  {`User {
  _id: ObjectId / String,
  name: String (required),
  email: String (unique, required),
  password: String (bcrypt hashed),
  role: 'senior' | 'volunteer' | 'admin',
  phone: String,
  address: String,
  city: String,
  status: 'active' | 'suspended',
  avatarUrl: String,
  createdAt: Date,
  updatedAt: Date
}`}
                </div>

                <div className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs overflow-x-auto">
                  <div className="text-emerald-400 font-bold mb-2">// 2. SeniorProfile Collection</div>
                  {`SeniorProfile {
  _id: ObjectId,
  userId: Ref<User> (required, unique),
  age: Number,
  emergencyContactName: String,
  emergencyContactPhone: String,
  emergencyContactRelation: String,
  medicalConditions: [String],
  mobilityNeeds: String,
  preferredLanguage: String,
  timestamps: true
}`}
                </div>

                <div className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs overflow-x-auto">
                  <div className="text-indigo-400 font-bold mb-2">// 3. VolunteerProfile Collection</div>
                  {`VolunteerProfile {
  _id: ObjectId,
  userId: Ref<User> (required, unique),
  skills: [String],
  serviceAreas: [String],
  availability: 'weekdays' | 'weekends' | 'flexible',
  isVerified: Boolean,
  tasksCompleted: Number,
  averageRating: Number,
  bio: String,
  emergencyContact: String,
  timestamps: true
}`}
                </div>

                <div className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs overflow-x-auto">
                  <div className="text-amber-400 font-bold mb-2">// 4. AssistanceRequest Collection</div>
                  {`AssistanceRequest {
  _id: ObjectId,
  requestId: String (e.g. "REQ-2026-001"),
  seniorId: Ref<User>,
  category: String,
  title: String,
  description: String,
  specialInstructions: String,
  urgency: 'Normal' | 'Urgent' | 'Emergency',
  scheduledDate: String,
  scheduledTime: String,
  location: String,
  assignedVolunteerId: Ref<User>,
  status: 'Requested' | 'Accepted' | 'In Progress' | 'Completed' | 'Cancelled',
  statusHistory: [{ status, changedBy, timestamp, comment }],
  volunteerNotes: String,
  hasFeedback: Boolean
}`}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'apis' && (
            <div className="space-y-4">
              <p className="text-slate-600">
                All endpoints follow standard REST principles with JSON payload formats and Bearer JWT authorization.
              </p>
              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 text-slate-700 uppercase font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Method</th>
                      <th className="p-3">Endpoint</th>
                      <th className="p-3">Access</th>
                      <th className="p-3">Purpose</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono text-slate-700">
                    <tr>
                      <td className="p-3 font-bold text-emerald-600">POST</td>
                      <td className="p-3">/api/auth/register</td>
                      <td className="p-3 font-sans">Public</td>
                      <td className="p-3 font-sans">Registers senior citizen or volunteer with tailored profile</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-emerald-600">POST</td>
                      <td className="p-3">/api/auth/login</td>
                      <td className="p-3 font-sans">Public</td>
                      <td className="p-3 font-sans">Validates credentials and returns JWT bearer token</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-blue-600">GET</td>
                      <td className="p-3">/api/requests</td>
                      <td className="p-3 font-sans">Auth (All)</td>
                      <td className="p-3 font-sans">Lists requests based on user role and query filters</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-emerald-600">POST</td>
                      <td className="p-3">/api/requests</td>
                      <td className="p-3 font-sans">Senior / Admin</td>
                      <td className="p-3 font-sans">Creates a new assistance errand with urgency & schedule</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-amber-600">PUT</td>
                      <td className="p-3">/api/requests/:id/accept</td>
                      <td className="p-3 font-sans">Volunteer</td>
                      <td className="p-3 font-sans">Volunteer accepts an available open request</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-amber-600">PUT</td>
                      <td className="p-3">/api/requests/:id/status</td>
                      <td className="p-3 font-sans">Volunteer / Admin</td>
                      <td className="p-3 font-sans">Progresses status: In Progress &rarr; Completed with notes</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-amber-600">PUT</td>
                      <td className="p-3">/api/requests/:id/assign</td>
                      <td className="p-3 font-sans">Admin</td>
                      <td className="p-3 font-sans">Administrator assigns or reassigns volunteer</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-emerald-600">POST</td>
                      <td className="p-3">/api/feedback</td>
                      <td className="p-3 font-sans">Senior</td>
                      <td className="p-3 font-sans">Submits ratings (1-5) and testimonial for completed task</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-blue-600">GET</td>
                      <td className="p-3">/api/stats</td>
                      <td className="p-3 font-sans">Public / Auth</td>
                      <td className="p-3 font-sans">Dashboard aggregates, counts, and category breakdown</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'setup' && (
            <div className="space-y-5">
              <div className="bg-slate-900 text-slate-100 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="font-bold text-slate-300">Quick Local Run Commands (Terminal / VS Code)</span>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        '# 1. Install dependencies\nnpm install\n\n# 2. Run full-stack development server\nnpm run dev\n\n# 3. Open browser at:\nhttp://localhost:3000',
                        'commands'
                      )
                    }
                    className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-lg text-slate-300 transition"
                  >
                    {copiedText === 'commands' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedText === 'commands' ? 'Copied!' : 'Copy Code'}
                  </button>
                </div>
                <pre className="font-mono text-xs text-blue-300 leading-relaxed overflow-x-auto">
{`# 1. Clone or extract project repository
cd senior-assistance-portal

# 2. Install all required dependencies
npm install

# 3. Start full-stack Node.js + Express + Vite dev server
npm run dev

# 4. Open browser at:
http://localhost:3000`}
                </pre>
              </div>

              <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50 space-y-3">
                <h4 className="font-bold text-slate-900 text-base">Connecting MongoDB Atlas (Optional)</h4>
                <p className="text-slate-600 text-xs">
                  The application is configured to run out-of-the-box with zero setup via an intelligent persistent fallback database. To connect real MongoDB Atlas:
                </p>
                <div className="bg-white p-3 rounded-xl border border-slate-200 font-mono text-xs text-slate-800">
                  MONGODB_URI="mongodb+srv://&lt;username&gt;:&lt;password&gt;@cluster0.mongodb.net/senior_assistance_portal"
                </div>
                <p className="text-slate-500 text-xs">
                  Create a <code>.env</code> file in the project root with the string above. The server automatically detects and connects to MongoDB with Mongoose ODM!
                </p>
              </div>
            </div>
          )}

          {activeTab === 'viva' && (
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 text-base">Key Viva Voce Questions & High-Scoring Answers</h3>
              <div className="space-y-3 text-xs">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <p className="font-bold text-blue-900 text-sm mb-1">
                    Q1: How is authentication and role-based access control (RBAC) secured?
                  </p>
                  <p className="text-slate-700">
                    <strong>Ans:</strong> Passwords are encrypted using <code>bcryptjs</code> with salt rounds of 10. Upon login, an authenticated JSON Web Token (JWT) is signed with an HMAC-SHA256 secret key. Protected routes verify the token via <code>authenticateToken</code> middleware, while <code>requireRole(['admin', 'volunteer'])</code> guards authorized operations.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <p className="font-bold text-blue-900 text-sm mb-1">
                    Q2: What accessibility features were incorporated specifically for elderly users?
                  </p>
                  <p className="text-slate-700">
                    <strong>Ans:</strong> Senior citizens frequently face visual impairments and motor control limitations. The portal incorporates high-contrast palette modes, dynamic font-size enlargement (up to 20px base), large click targets (minimum 48px), voice text-to-speech read-aloud via the Web Speech API, and a prominent 1-click Emergency SOS hotline trigger.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <p className="font-bold text-blue-900 text-sm mb-1">
                    Q3: How does the assistance request state machine prevent race conditions?
                  </p>
                  <p className="text-slate-700">
                    <strong>Ans:</strong> When a volunteer clicks "Accept Request", the server validates that the request status is strictly <code>'Requested'</code> and unassigned before transitioning it to <code>'Accepted'</code> and recording an audit trail in <code>statusHistory</code>. This prevents duplicate volunteer commitments.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-100 px-6 py-4 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500 shrink-0">
          <span>Department of Computer Science & Engineering &bull; B.Tech Final Project</span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl transition cursor-pointer"
          >
            Done Reading
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './client/context/AuthContext.tsx';
import { AccessibilityProvider, useAccessibility } from './client/context/AccessibilityContext.tsx';
import { NotificationProvider } from './client/context/NotificationContext.tsx';

// Common Components
import { Navbar } from './client/components/common/Navbar.tsx';
import { Footer } from './client/components/common/Footer.tsx';
import { SosModal } from './client/components/common/SosModal.tsx';
import { ProjectDocsModal } from './client/components/common/ProjectDocsModal.tsx';

// Pages
import { LandingPage } from './client/pages/LandingPage.tsx';
import { LoginPage } from './client/pages/auth/LoginPage.tsx';
import { RegisterPage } from './client/pages/auth/RegisterPage.tsx';
import { ProfilePage } from './client/pages/ProfilePage.tsx';
import { FeedbackPage } from './client/pages/FeedbackPage.tsx';

// Senior Pages
import { SeniorDashboard } from './client/pages/senior/SeniorDashboard.tsx';
import { CreateRequestPage } from './client/pages/senior/CreateRequestPage.tsx';
import { MyRequestsPage } from './client/pages/senior/MyRequestsPage.tsx';

// Volunteer Pages
import { VolunteerDashboard } from './client/pages/volunteer/VolunteerDashboard.tsx';
import { AvailableTasksPage } from './client/pages/volunteer/AvailableTasksPage.tsx';
import { MyAssignedTasksPage } from './client/pages/volunteer/MyAssignedTasksPage.tsx';

// Admin Pages
import { AdminDashboard } from './client/pages/admin/AdminDashboard.tsx';
import { UserManagementPage } from './client/pages/admin/UserManagementPage.tsx';
import { VolunteerManagementPage } from './client/pages/admin/VolunteerManagementPage.tsx';
import { CategoryManagementPage } from './client/pages/admin/CategoryManagementPage.tsx';
import { RequestManagementPage } from './client/pages/admin/RequestManagementPage.tsx';

function MainApp() {
  const { user, isLoading } = useAuth();
  const [currentView, setCurrentView] = useState<string>('home');
  const [docsModalOpen, setDocsModalOpen] = useState<boolean>(false);

  // Sync hash routing if present
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      setCurrentView(hash);
    }
  }, []);

  const navigateTo = (view: string) => {
    setCurrentView(view);
    window.location.hash = view;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Redirect to dashboard on user login if viewing auth page
  useEffect(() => {
    if (user && (currentView === 'login' || currentView === 'register')) {
      if (user.role === 'senior') setCurrentView('senior-dashboard');
      else if (user.role === 'volunteer') setCurrentView('volunteer-dashboard');
      else if (user.role === 'admin') setCurrentView('admin-dashboard');
    }
  }, [user, currentView]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 transition-colors">
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={navigateTo}
        onOpenDocs={() => setDocsModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {isLoading ? (
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Loading Portal System...
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* View Switching */}
            {currentView === 'home' && (
              <LandingPage onNavigate={navigateTo} onOpenDocs={() => setDocsModalOpen(true)} />
            )}
            {currentView === 'login' && <LoginPage onNavigate={navigateTo} />}
            {currentView === 'register' && <RegisterPage onNavigate={navigateTo} />}
            {currentView === 'profile' && <ProfilePage />}
            {currentView === 'feedback' && <FeedbackPage onNavigate={navigateTo} />}

            {/* Senior Citizen Views */}
            {currentView === 'senior-dashboard' && <SeniorDashboard onNavigate={navigateTo} />}
            {currentView === 'create-request' && <CreateRequestPage onNavigate={navigateTo} />}
            {currentView === 'my-requests' && <MyRequestsPage onNavigate={navigateTo} />}

            {/* Volunteer Views */}
            {currentView === 'volunteer-dashboard' && <VolunteerDashboard onNavigate={navigateTo} />}
            {currentView === 'available-tasks' && <AvailableTasksPage onNavigate={navigateTo} />}
            {currentView === 'my-assigned-tasks' && <MyAssignedTasksPage onNavigate={navigateTo} />}

            {/* Admin Views */}
            {currentView === 'admin-dashboard' && (
              <AdminDashboard onNavigate={navigateTo} onOpenDocs={() => setDocsModalOpen(true)} />
            )}
            {currentView === 'user-management' && <UserManagementPage />}
            {currentView === 'volunteer-management' && <VolunteerManagementPage />}
            {currentView === 'category-management' && <CategoryManagementPage />}
            {currentView === 'request-management' && <RequestManagementPage />}
          </>
        )}
      </main>

      {/* Global Modals */}
      <SosModal />
      <ProjectDocsModal isOpen={docsModalOpen} onClose={() => setDocsModalOpen(false)} />

      {/* Global Footer */}
      <Footer onNavigate={navigateTo} onOpenDocs={() => setDocsModalOpen(true)} />
    </div>
  );
}

export default function App() {
  return (
    <AccessibilityProvider>
      <NotificationProvider>
        <AuthProvider>
          <MainApp />
        </AuthProvider>
      </NotificationProvider>
    </AccessibilityProvider>
  );
}

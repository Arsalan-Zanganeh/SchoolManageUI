import React from "react";
import LandingPage from "./welcomepage/welcomepage";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import SignUpLogin from './signup-login/signup-login'
import LoginPrincipal from './login-page/principal';
import LoginStudent from './login-page/student';
import LoginTeacher from './login-page/Teacher';
import Dashboard from './Dashboard/Dashboard';
import StuDashboard from './Dashboard/StudentDashboard';
import TeacherDashboard from './Dashboard/TeacherDashboard';
import ResetPasswordAdmin from './signup-login/ResetPasswordAdmin'; 
import ResetPasswordStudent from './signup-login/ResetPasswordStudent';
import ResetPasswordTeacher from './signup-login/ResetPasswordTeacher';
import PasswordResetAdmin from './signup-login/PasswordResetAdmin';
import PasswordResetStudent from './signup-login/PasswordResetStudent';
import PasswordResetTeacher from './signup-login/PasswordResetTeacher';
import SignUpStudent from './Dashboard/add-student/add-student';
import SignUpTeacher from './Dashboard/add-teacher/add-teacher';
import AddClass from './Dashboard/add-class/AddClass';
import AdminSchoolPage from './Dashboard/AdminSchoolPage'; 
import StudentClassList from './Dashboard/show-classes/student'
import TeacherClassList from './Dashboard/show-classes/teacher'
import SchoolDashboard from './Dashboard/SchoolDashboard';
import ProfileAdmin from './Dashboard/ProfileAdmin';
import ProfileStudent from './Dashboard/ProfileStudent';
import ProfileTeacher from './Dashboard/ProfileTeacher';
import EditProfileAdmin from './Dashboard/EditProfileAdmin';
import EditProfileStudent from './Dashboard/EditProfileStudent';
import EditProfileTeacher from './Dashboard/EditProfileTeacher';
import ManageStudents from './Dashboard/ManageStudents'; 
import { PrincipalProvider } from './context/PrincipalContext';
import { StudentProvider } from './context/StudentContext';
import { TeacherProvider } from './context/TeacherContext'; 
import { ClassProvider } from './context/ClassContext';
import PrivateRoute from './components/PrivateRoute';
import { SchoolProvider } from './context/SchoolContext';  
import HollandTest from './HollandTest/HollandTest'; 
import HollandQuestion from './HollandTest/HollandQuestions'; 
import HollandAnalysis from './HollandTest/HollandAnalysis'; 
import StuClass from './classes/ClassDetail' ;
import TeacherClass from './classes/TClassDetail' ;
import AssignmentDetail from './assignment/stuassignment' ;
import TAssignmentDetail from './assignment/teacherassignment' ;
import PreviousResults from "./HollandTest/PreviousResults";
import QuizPage from "./quiz/QuizPage";
import QuizPageStudent from "./quiz/QuizPageStudent";
import ResultsPage from "./quiz/ResultsPage";
import TeacherResult from "./quiz/TeacherResult";
import Discipline from "./discipline/Discipline"
import { ParentProvider } from './context/ParentContext';
import ParentDashboard from "./Dashboard/ParentDashboard";
import SubmittedAssignmentsPage from './assignment/SubmittedAssignmentsPage'
import ManageQuestionsPage from "./quiz/ManageQuestionsPage";
import DescriptiveQuizPage from "./quiz/DescriptiveQuizPage";
import DescriptiveQuizResultsPage from "./quiz/DescriptiveQuizResultsPage";
import TeacherQuizResults from "./quiz/TeacherQuizResults";
import StudentAnswersPage from "./quiz/StudentAnswersPage";
import './App.css';

function App() {
  return (
    <Router>
      <ParentProvider>
      <PrincipalProvider>
        <StudentProvider>
          <TeacherProvider>
            <SchoolProvider>
              <ClassProvider>
              <Routes>
                <Route path="/" element={<LandingPage/>} />
                <Route path="/signup-login" element={<SignUpLogin/>} />
                <Route path="/principal-login" element={<LoginPrincipal />} />
                <Route path="/student-login" element={<LoginStudent />} />
                <Route path="/teacher-login" element={<LoginTeacher />} />
                <Route path="/ResetPasswordAdmin" element={<ResetPasswordAdmin />} /> 
                <Route path="/ResetPasswordStudent" element={<ResetPasswordStudent />} /> 
                <Route path="/ResetPasswordTeacher" element={<ResetPasswordTeacher />} />
                <Route path="/PasswordResetAdmin/:uidb64/:token/" element={<PasswordResetAdmin />} /> {}
                <Route path="/PasswordResetStudent/:uidb64/:token/" element={<PasswordResetStudent />} /> {}
                <Route path="/PasswordResetTeacher/:uidb64/:token/" element={<PasswordResetTeacher />} /> {}
                <Route
                  path="/admin-school"
                  element={
                    <PrivateRoute role="principal">
                      <AdminSchoolPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <PrivateRoute role="principal">
                      <Dashboard />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/dashboard/profile-admin"
                  element={
                    <PrivateRoute role="principal">
                      <ProfileAdmin />
                    </PrivateRoute>
                  }
                />
                 <Route
                  path="/dashboard/profile-student"
                  element={
                    <PrivateRoute role="student">
                      <ProfileStudent />
                    </PrivateRoute>
                  }
                />
                 <Route
                  path="/dashboard/profile-teacher"
                  element={
                    <PrivateRoute role="teacher">
                      <ProfileTeacher />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/dashboard/edit-admin"
                  element={
                    <PrivateRoute role="principal">
                      <EditProfileAdmin />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/dashboard/edit-student"
                  element={
                    <PrivateRoute role="student">
                      <EditProfileStudent />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/dashboard/edit-teacher"
                  element={
                    <PrivateRoute role="teacher">
                      <EditProfileTeacher />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/dashboard/school/:schoolId/add-student"
                  element={
                    <PrivateRoute role="principal">
                      <SignUpStudent />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/dashboard/school/:schoolId/add-teacher"
                  element={
                    <PrivateRoute role="principal">
                      <SignUpTeacher />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/student-dashboard"
                  element={
                    <PrivateRoute role="student">
                      <StuDashboard />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/student-dashboard/student-classes"
                  element={
                    <PrivateRoute role="student">
                      <StudentClassList />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/teacher-dashboard"
                  element={
                    <PrivateRoute role="teacher">
                      <TeacherDashboard />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/teacher-dashboard/teacher-classes"
                  element={
                    <PrivateRoute role="teacher">
                      <TeacherClassList />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/dashboard/school/:schoolId"
                  element={
                    <PrivateRoute role="principal">
                      <SchoolDashboard />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/dashboard/school/:schoolId/classes"
                  element={
                    <PrivateRoute role="principal">
                      <AddClass />
                    </PrivateRoute>
                  }
                />
                {/* اضافه کردن مسیر برای مدیریت دانش‌آموزان */}
                <Route
                  path="/dashboard/school/:schoolId/classes/manage_students/:clsId"
                  element={
                    <PrivateRoute role="principal">
                      <ManageStudents />
                    </PrivateRoute>
                  }
                />
               <Route
                    path="/student-dashboard/holland-test"
                    element={
                      <PrivateRoute role="student">
                        <HollandTest />
                      </PrivateRoute>
                    }
                />
                 <Route
                    path="/holland-test/questions"
                    element={
                      <PrivateRoute role="student">
                        <HollandQuestion/>
                      </PrivateRoute>
                    }
                />
                 <Route
                    path="/holland-test/analysis"
                    element={
                      <PrivateRoute role="student">
                        <HollandAnalysis/>
                      </PrivateRoute>
                    }
                />
                  <Route
                  path="/student-dashboard/student-classes/:cid"
                  element={
                    <PrivateRoute role="student">
                      <StuClass />
                    </PrivateRoute>
                    }
              />
               <Route
                  path="/teacher-dashboard/teacher-classes/:tcid"
                  element={
                    <PrivateRoute role="teacher">
                      <TeacherClass/>
                    </PrivateRoute>
                    }
              />
                <Route
                path="/student-dashboard/student-classes/:cid/assignment/:aid"
                element={
                  <PrivateRoute role="student">
                    <AssignmentDetail />
                  </PrivateRoute>
                }
              />
              <Route
              path="/teacher-dashboard/class/:tcid/assignment/:assignmentId"
              element={
                <PrivateRoute role="teacher">
                  <TAssignmentDetail />
                </PrivateRoute>
                }
              />
              <Route
              path="/holland-test/previous-results"
              element={
                <PrivateRoute role="student">
                  <PreviousResults />
                </PrivateRoute>
              }
              />
              <Route
            path="/teacher-dashboard/teacher-classes/:tcid/quiz/:qid"
            element={
              <PrivateRoute role="teacher">
                <QuizPage />
              </PrivateRoute>
            }
            />
            <Route
            path="/student-dashboard/student-classes/:cid/quiz/:quizId"
            element={
              <PrivateRoute role="student">
                <QuizPageStudent/>
              </PrivateRoute>
            }
            />
            <Route
              path="/student-dashboard/student-classes/:cid/quiz/:quizId/results"
              element={
                <PrivateRoute role="student">
                  <ResultsPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/teacher-dashboard/teacher-classes/:tcid/quiz/:qid/results"
              element={
                <PrivateRoute role="teacher">
                  <TeacherResult />
                </PrivateRoute>
              }
            />
          <Route
                path="/dashboard/school/:schoolId/disciplinary-management"
                element={
                  <PrivateRoute role="principal">
                    <Discipline/>
                  </PrivateRoute>
                }
          />
          <Route
                  path="/parent-dashboard"
                  element={
                    <PrivateRoute role="parent">
                      <ParentDashboard/>
                    </PrivateRoute>
                  }
          />
          <Route
                path="/teacher-dashboard/teacher-classes/:tcid/submitted-assignments/:homeworkId"
                element={
                  <PrivateRoute role="teacher">
                    <SubmittedAssignmentsPage/>
                  </PrivateRoute>
                }
          />
          <Route
  path="/teacher-dashboard/teacher-classes/:tcid/essay-quizzes/:quizId"
  element={
    <PrivateRoute role="teacher">
      <ManageQuestionsPage />
    </PrivateRoute>
  }
/>
<Route
  path="/student-dashboard/student-classes/:cid/descriptive-quiz/:quizId"
  element={
    <PrivateRoute role="student">
      <DescriptiveQuizPage />
    </PrivateRoute>
  }
/>
<Route
  path="/student-dashboard/student-classes/:cid/descriptive-quiz/:quizId/results"
  element={
    <PrivateRoute role="student">
      <DescriptiveQuizResultsPage />
    </PrivateRoute>
  }
/>
<Route
  path="/teacher-dashboard/teacher-classes/:tcid/essay-quizzes/:quizId/results"
  element={
    <PrivateRoute role="teacher">
      <TeacherQuizResults />
    </PrivateRoute>
  }
/>

<Route
  path="/teacher-dashboard/teacher-classes/:tcid/essay-quizzes/:quizId/student-records/:recordId"
  element={
    <PrivateRoute role="teacher">
      <StudentAnswersPage />
    </PrivateRoute>
  }
/>



              </Routes>
              </ClassProvider>
            </SchoolProvider> 
          </TeacherProvider>
        </StudentProvider>
      </PrincipalProvider>
      </ParentProvider>
    </Router>
  );
}

export default App;

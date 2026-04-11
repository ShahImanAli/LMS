import "./App.css";
import Login from "./pages/Login.jsx";
import HeroSection from "./pages/student/HeroSection";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Courses from "./pages/student/Courses";
import MyLearning from "./pages/student/MyLearning";
import Profile from "./pages/student/Profile";
import Sidebar from "./pages/admin/Sidebar";
import Dashboard from "./pages/admin/Dashboard";
import CourseTable from "./pages/admin/course/CourseTable";
import AddCourse from "./pages/admin/course/AddCourse";
import EditCourse from "./pages/admin/course/EditCourse";
import CreateLecture from "./pages/admin/lecture/CreateLecture";
import EditLecture from "./pages/admin/lecture/EditLecture";
import CourseDetail from "./pages/student/CourseDetail";
import CourseProgress from "./pages/student/CourseProgress";
import SearchPage from "./pages/student/SearchPage";
import {
  ProtectedRoutes,
  AuthenticatedRoute,
  AdminRoute,
} from "./components/ProtectedRoutes";
import { PurchaseCourseProtectedRoute } from "./components/PurchaseCourseProtectedRoute";
import { ThemeProvider } from "./components/ThemeProvider";

function App() {
  const appRouter = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
      children: [
        {
          path: "/",
          element: (
            <>
              <HeroSection />
              <Courses />
            </>
          ),
        },
        {
          path: "login",
          element: (
            <AuthenticatedRoute>
              <Login />
            </AuthenticatedRoute>
          ),
        },
        {
          path: "my-learning",
          element: (
            <ProtectedRoutes>
              <MyLearning />
            </ProtectedRoutes>
          ),
        },
        {
          path: "profile",
          element: (
            <ProtectedRoutes>
              <Profile />
            </ProtectedRoutes>
          ),
        },
        {
          path: "course/search",
          element: (
            <ProtectedRoutes>
              <SearchPage />
            </ProtectedRoutes>
          ),
        },
        {
          path: "course-detail/:courseId",
          element: (
            <ProtectedRoutes>
              <CourseDetail />
            </ProtectedRoutes>
          ),
        },
        {
          path: "course-progress/:courseId",
          element: (
            <PurchaseCourseProtectedRoute>
              <ProtectedRoutes>
                <CourseProgress />
              </ProtectedRoutes>
            </PurchaseCourseProtectedRoute>
          ),
        },

        {
          path: "admin",
          element: (
            <AdminRoute>
              <Sidebar />
            </AdminRoute>
          ),
          children: [
            {
              path: "dashboard",
              element: <Dashboard />,
            },
            {
              path: "course",
              element: <CourseTable />,
            },
            {
              path: "course/create",
              element: <AddCourse />,
            },
            {
              path: "course/:courseId",
              element: <EditCourse />,
            },
            {
              path: "course/:courseId/lecture",
              element: <CreateLecture />,
            },
            {
              path: "course/:courseId/lecture/:lectureId",
              element: <EditLecture />,
            },
          ],
        },
      ],
    },
  ]);
  return (
    <main>
      <ThemeProvider>
        <RouterProvider router={appRouter} />
      </ThemeProvider>
    </main>
  );
}

export default App;

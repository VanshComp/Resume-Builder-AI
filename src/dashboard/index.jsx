import React, { useEffect, useState } from "react";
import AddResume from "./components/AddResume";
import { useUser } from "@clerk/clerk-react";
import GlobalApi from "./../../service/GlobalApi";
import ResumeCardItem from "./components/ResumeCardItem";

function Dashboard() {
  const { user, isLoaded } = useUser();
  const [resumeList, setResumeList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && user) {
      GetResumesList();
    }
  }, [user, isLoaded]);

  /** Fetch Resumes for Logged-in User */
  const GetResumesList = async () => {
    try {
      setLoading(true);
      const response = await GlobalApi.GetUserResumes(
        user?.primaryEmailAddress?.emailAddress
      );

      const fetchedData = response?.data?.data ?? [];
      setResumeList(fetchedData);
    } catch (err) {
      console.error("Error fetching resumes:", err);
      setResumeList([]); // avoids undefined
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 md:px-20 lg:px-32">
      <h2 className="font-bold text-3xl">My Resume</h2>
      <p>Start Creating AI resume to your next Job role</p>

      <div
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 mt-10"
      >
        {/* Add new resume button */}
        <AddResume />

        {/* Loading skeleton */}
        {loading && (
          [1, 2, 3, 4].map((item, index) => (
            <div
              key={index}
              className="h-[280px] rounded-lg bg-slate-200 animate-pulse"
            ></div>
          ))
        )}

        {/* Resume List */}
        {!loading && resumeList?.length > 0 &&
          resumeList.map((resume, index) => (
            <ResumeCardItem
              resume={resume}
              key={index}
              refreshData={GetResumesList}
            />
          ))}

        {/* No Resume Found */}
        {!loading && resumeList?.length === 0 && (
          <p className="col-span-full text-gray-500">
            No resumes found. Click "+" to create your first resume.
          </p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;

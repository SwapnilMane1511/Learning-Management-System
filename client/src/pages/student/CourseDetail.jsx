import BuyCourseButton from "@/components/BuyCourseButton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useGetCourseDetailWithStatusQuery } from "@/features/api/purchaseApi";
import { BadgeInfo, Lock, PlayCircle } from "lucide-react";
import React from "react";
import ReactPlayer from "react-player";
import { useNavigate, useParams } from "react-router-dom";

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetCourseDetailWithStatusQuery(courseId);

  if (isLoading) return <h1 className="text-center mt-10">Loading...</h1>;
  if (isError) return <h1 className="text-center mt-10 text-red-500">Failed to load course details</h1>;

  const { course, purchased } = data;
  const lectures = course?.lectures || [];

  const handleContinueCourse = () => {
    if (purchased) {
      navigate(`/course-progress/${courseId}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#2D2F31] text-white">
        <div className="max-w-7xl mx-auto py-8 px-4 md:px-8 flex flex-col gap-2">
          <h1 className="text-3xl font-bold">{course?.courseTitle || "No Title Found"}</h1>
          <p className="text-base md:text-lg">
            {course?.subTitle || "No subtitle available"}
          </p>

          <p>
            Created by{" "}
            <span className="text-[#C0C4FC] underline italic">
              {course?.creator?.name || "Unknown"}
            </span>
          </p>
          <div className="flex items-center gap-2 text-sm">
            <BadgeInfo size={16} />
            <p>Last updated: {course?.createdAt?.split("T")[0] || "N/A"}</p>
          </div>
          <p>Students enrolled: {course?.enrolledStudents?.length || 0}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto my-5 px-4 md:px-8 flex flex-col lg:flex-row justify-between gap-10">
        {/* Left Side - Description + Lectures */}
        <div className="w-full lg:w-2/3 space-y-5">
          <h1 className="font-bold text-xl md:text-2xl">Description</h1>
          {course?.description ? (
            <p
              className="text-sm"
              dangerouslySetInnerHTML={{ __html: course.description }}
            />
          ) : (
            <p className="text-sm italic text-gray-500">No description available.</p>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Course Content</CardTitle>
              <CardDescription>{lectures.length} lecture(s)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {lectures.length === 0 ? (
                <p className="text-gray-500 italic">No lectures found.</p>
              ) : (
                lectures.map((lecture, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm">
                    <span>{purchased ? <PlayCircle size={14} /> : <Lock size={14} />}</span>
                    <p>{lecture.lectureTitle}</p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Side - Video Preview + Purchase */}
        <div className="w-full lg:w-1/3">
          <Card>
            <CardContent className="p-4 flex flex-col">
              <div className="w-full aspect-video mb-4">
                {lectures[0]?.videoUrl ? (
                  <ReactPlayer
                    width="100%"
                    height="100%"
                    url={lectures[0].videoUrl}
                    controls
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-sm text-gray-600">
                    No preview video
                  </div>
                )}
              </div>
              <h1 className="font-medium text-sm mb-2">
                {lectures[0]?.lectureTitle || "First Lecture Title"}
              </h1>

              <Separator className="my-2" />
              <h1 className="text-lg md:text-xl font-semibold">₹{course.coursePrice || 0}</h1>
            </CardContent>
            <CardFooter className="flex justify-center p-4">
              {purchased ? (
                <Button onClick={handleContinueCourse} className="w-full">
                  Continue Course
                </Button>
              ) : (
                <BuyCourseButton courseId={courseId} />
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;

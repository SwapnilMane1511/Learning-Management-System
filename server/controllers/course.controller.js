 
import { Course } from "../models/course.model.js";
import { Lecture } from "../models/lecture.model.js";
import {deleteMediaFromCloudinary, deleteVideoFromCloudinary, uploadMedia} from "../utils/cloudinary.js";
import { CoursePurchase } from "../models/coursePurchase.model.js"; // Ensure this import is correct
export const createCourse = async (req,res) => {
    try {
        const {courseTitle, category, subTitle} = req.body;
        if(!courseTitle || !category) {
            return res.status(400).json({
                message:"Course title and category is required."
            })
        }

        const course = await Course.create({
            courseTitle,
            category,
            subTitle, 
            creator:req.id
        });

        return res.status(201).json({
            course,
            message:"Course created."
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to create course"
        })
    }
}


export const searchCourse = async (req, res) => {
  try {
    let { query = "", categories = "", sortByPrice = "" } = req.query;

    // ✅ Don't lowercase here — keep the original case
    const categoryList = categories
      ? categories.split(",").map((cat) => cat.trim())
      : [];

    // ✅ Build search criteria object
    const searchCriteria = {
      isPublished: true,
    };

    // ✅ Text search on courseTitle, subTitle, or category
    if (query) {
      searchCriteria.$or = [
        { courseTitle: { $regex: query, $options: "i" } },
        { subTitle: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
      ];
    }

    // ✅ Case-insensitive category filtering using regex
    if (categoryList.length > 0) {
      const categoryRegexFilters = categoryList.map((cat) => ({
        category: { $regex: new RegExp(`^${cat}$`, "i") },
      }));

      // Combine using $and to narrow down with category filter
      searchCriteria.$or = [{ $or: categoryRegexFilters }];
    }

    // ✅ Handle sorting logic
    const sortOptions = {};
    if (sortByPrice === "low") sortOptions.coursePrice = 1;
    else if (sortByPrice === "high") sortOptions.coursePrice = -1;

    // ✅ Query database
    const courses = await Course.find(searchCriteria)
      .populate({ path: "creator", select: "name photoUrl" })
      .sort(sortOptions);

    return res.status(200).json({
      success: true,
      courses: courses || [],
    });

  } catch (error) {
    console.error("Search Error:", error);
    return res.status(500).json({
      message: "Failed to search courses",
    });
  }
};


export const getPublishedCourse = async (_,res) => {
    try {
        const courses = await Course.find({isPublished:true}).populate({path:"creator", select:"name photoUrl"});
        if(!courses){
            return res.status(404).json({
                message:"Course not found"
            })
        }
        return res.status(200).json({
            courses,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to get published courses"
        })
    }
}
export const getCreatorCourses = async (req,res) => {
    try {
        const userId = req.id;
        const courses = await Course.find({creator:userId});
        if(!courses){
            return res.status(404).json({
                courses:[],
                message:"Course not found"
            })
        };
        return res.status(200).json({
            courses,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to create course"
        })
    }
}
export const editCourse = async (req,res) => {
    try {
        const courseId = req.params.courseId;
        const {courseTitle, subTitle, description, category, courseLevel, coursePrice} = req.body;
        const thumbnail = req.file;

        let course = await Course.findById(courseId);
        if(!course){
            return res.status(404).json({
                message:"Course not found!"
            })
        }
        let courseThumbnail;
        if(thumbnail){
            if(course.courseThumbnail){
                const publicId = course.courseThumbnail.split("/").pop().split(".")[0];
                await deleteMediaFromCloudinary(publicId); // delete old image
            }
            // upload a thumbnail on clourdinary
            courseThumbnail = await uploadMedia(thumbnail.path);
        }

 
        const updateData = {courseTitle, subTitle, description, category, courseLevel, coursePrice, courseThumbnail:courseThumbnail?.secure_url};

        course = await Course.findByIdAndUpdate(courseId, updateData, {new:true});

        return res.status(200).json({
            course,
            message:"Course updated successfully."
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to create course"
        })
    }
}
export const getCourseById = async (req,res) => {
    try {
        const {courseId} = req.params;

        const course = await Course.findById(courseId);

        if(!course){
            return res.status(404).json({
                message:"Course not found!"
            })
        }
        return res.status(200).json({
            course
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to get course by id"
        })
    }
}// In course.controller.js


// import { Purchase } from "../models/purchase.model.js"; // Make sure this is correct

export const removeCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    console.log("[CONTROLLER] removeCourse hit with ID:", courseId);

    const course = await Course.findById(courseId);

    if (!course) {
      console.log("[ERROR] Course not found in DB.");
      return res.status(404).json({ message: "Course not found" });
    }

    // ✅ Delete the course
    await course.deleteOne();

    // ✅ Delete associated purchased records
    await CousePurchase.deleteMany({ courseId });

    console.log("[SUCCESS] Course and related purchases deleted.");
    return res.status(200).json({ message: "Course and related purchases deleted successfully" });

  } catch (err) {
    console.error("[ERROR] removeCourse failed:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const createLecture = async (req,res) => {
    try {
        const {lectureTitle} = req.body;
        const {courseId} = req.params;

        if(!lectureTitle || !courseId){
            return res.status(400).json({
                message:"Lecture title is required"
            })
        };

        // create lecture
        const lecture = await Lecture.create({lectureTitle});

        const course = await Course.findById(courseId);
        if(course){
            course.lectures.push(lecture._id);
            await course.save();
        }

        return res.status(201).json({
            lecture,
            message:"Lecture created successfully."
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to create lecture"
        })
    }
}
export const getCourseLecture = async (req,res) => {
    try {
        const {courseId} = req.params;
        const course = await Course.findById(courseId).populate("lectures");
        if(!course){
            return res.status(404).json({
                message:"Course not found"
            })
        }
        return res.status(200).json({
            lectures: course.lectures
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to get lectures"
        })
    }
}
export const editLecture = async (req,res) => {
    try {
        const {lectureTitle, videoInfo, isPreviewFree} = req.body;
        
        const {courseId, lectureId} = req.params;
        const lecture = await Lecture.findById(lectureId);
        if(!lecture){
            return res.status(404).json({
                message:"Lecture not found!"
            })
        }

        // update lecture
        if(lectureTitle) lecture.lectureTitle = lectureTitle;
        // if(videoInfo?.videoUrl) lecture.videoUrl = videoInfo.videoUrl;
        if (videoInfo?.videoUrl) lecture.videoUrl = videoInfo.videoUrl;

        if(videoInfo?.publicId) lecture.publicId = videoInfo.publicId;
        lecture.isPreviewFree = isPreviewFree;

        await lecture.save();

        // Ensure the course still has the lecture id if it was not aleardy added;
        const course = await Course.findById(courseId);
        if(course && !course.lectures.includes(lecture._id)){
            course.lectures.push(lecture._id);
            await course.save();
        };
        return res.status(200).json({
            lecture,
            message:"Lecture updated successfully."
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to edit lectures"
        })
    }
}
export const removeLecture = async (req,res) => {
    try {
        const {lectureId} = req.params;
        const lecture = await Lecture.findByIdAndDelete(lectureId);
        if(!lecture){
            return res.status(404).json({
                message:"Lecture not found!"
            });
        }
        // delete the lecture from couldinary as well
        if(lecture.publicId){
            await deleteVideoFromCloudinary(lecture.publicId);
        }

        // Remove the lecture reference from the associated course
        await Course.updateOne(
            {lectures:lectureId}, // find the course that contains the lecture
            {$pull:{lectures:lectureId}} // Remove the lectures id from the lectures array
        );

        return res.status(200).json({
            message:"Lecture removed successfully."
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to remove lecture"
        })
    }
}
export const getLectureById = async (req,res) => {
    try {
        const {lectureId} = req.params;
        const lecture = await Lecture.findById(lectureId);
        if(!lecture){
            return res.status(404).json({
                message:"Lecture not found!"
            });
        }
        return res.status(200).json({
            lecture
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to get lecture by id"
        })
    }
}


// publich unpublish course logic

export const togglePublishCourse = async (req,res) => {
    try {
        const {courseId} = req.params;
        const {publish} = req.query; // true, false
        const course = await Course.findById(courseId);
        if(!course){
            return res.status(404).json({
                message:"Course not found!"
            });
        }
        // publish status based on the query paramter
        course.isPublished = publish === "true";
        await course.save();

        const statusMessage = course.isPublished ? "Published" : "Unpublished";
        return res.status(200).json({
            message:`Course is ${statusMessage}`
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to update status"
        })
    }
}
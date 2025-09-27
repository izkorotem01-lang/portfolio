import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Lock,
  Plus,
  Edit,
  Trash2,
  Video,
  Folder,
  Save,
  X,
  Upload,
  Image,
} from "lucide-react";
import { remoteConfig, storage } from "@/lib/firebase";
import { fetchAndActivate, getValue } from "firebase/remote-config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  PortfolioCategory,
  PortfolioVideo,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getVideos,
  createVideo,
  updateVideo,
  deleteVideo,
} from "@/lib/portfolioService";

const Admin = () => {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [remotePassword, setRemotePassword] = useState("");

  // Portfolio management state
  const [categories, setCategories] = useState<PortfolioCategory[]>([]);
  const [videos, setVideos] = useState<PortfolioVideo[]>([]);
  const [activeTab, setActiveTab] = useState<"categories" | "videos">(
    "categories"
  );
  const [editingCategory, setEditingCategory] =
    useState<PortfolioCategory | null>(null);
  const [editingVideo, setEditingVideo] = useState<PortfolioVideo | null>(null);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showVideoForm, setShowVideoForm] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);

  useEffect(() => {
    const fetchRemoteConfig = async () => {
      try {
        await fetchAndActivate(remoteConfig);
        const adminPasswordValue = getValue(remoteConfig, "admin_password");
        setRemotePassword(adminPasswordValue.asString());
      } catch (error) {
        console.error("Error fetching remote config:", error);
        setError("Failed to load configuration");
      }
    };

    fetchRemoteConfig();
  }, []);

  // Load portfolio data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadPortfolioData();
    }
  }, [isAuthenticated]);

  const loadPortfolioData = async () => {
    try {
      const [categoriesData, videosData] = await Promise.all([
        getCategories(),
        getVideos(),
      ]);
      setCategories(categoriesData);
      setVideos(videosData);
    } catch (error) {
      console.error("Error loading portfolio data:", error);
      setError("Failed to load portfolio data");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Fetch latest remote config
      await fetchAndActivate(remoteConfig);
      const adminPasswordValue = getValue(remoteConfig, "admin_password");
      const currentRemotePassword = adminPasswordValue.asString();

      if (password === currentRemotePassword) {
        setIsAuthenticated(true);
        setError("");
      } else {
        setError("Invalid password");
        setPassword("");
      }
    } catch (error) {
      console.error("Error validating password:", error);
      setError("Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Category management functions
  const handleCreateCategory = async (categoryData: {
    name: string;
    nameHe: string;
    order: number;
  }) => {
    try {
      await createCategory(categoryData);
      await loadPortfolioData();
      setShowCategoryForm(false);
    } catch (error) {
      console.error("Error creating category:", error);
      setError("Failed to create category");
    }
  };

  const handleUpdateCategory = async (
    id: string,
    updates: Partial<PortfolioCategory>
  ) => {
    try {
      await updateCategory(id, updates);
      await loadPortfolioData();
      setEditingCategory(null);
    } catch (error) {
      console.error("Error updating category:", error);
      setError("Failed to update category");
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteCategory(id);
        await loadPortfolioData();
      } catch (error) {
        console.error("Error deleting category:", error);
        setError("Failed to delete category");
      }
    }
  };

  // Video management functions
  const handleCreateVideo = async (
    videoData: Omit<PortfolioVideo, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      await createVideo(videoData);
      await loadPortfolioData();
      setShowVideoForm(false);
    } catch (error) {
      console.error("Error creating video:", error);
      setError("Failed to create video");
    }
  };

  const handleUpdateVideo = async (
    id: string,
    updates: Partial<PortfolioVideo>
  ) => {
    try {
      await updateVideo(id, updates);
      await loadPortfolioData();
      setEditingVideo(null);
    } catch (error) {
      console.error("Error updating video:", error);
      setError("Failed to update video");
    }
  };

  const handleDeleteVideo = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this video?")) {
      try {
        await deleteVideo(id);
        await loadPortfolioData();
      } catch (error) {
        console.error("Error deleting video:", error);
        setError("Failed to delete video");
      }
    }
  };

  // File upload functions
  const uploadFile = async (file: File, path: string): Promise<string> => {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
  };

  const handleVideoUpload = async (file: File): Promise<string> => {
    setUploadingVideo(true);
    try {
      const fileName = `videos/${Date.now()}-${file.name}`;
      const url = await uploadFile(file, fileName);
      return url;
    } catch (error) {
      console.error("Error uploading video:", error);
      setError("Failed to upload video");
      throw error;
    } finally {
      setUploadingVideo(false);
    }
  };

  const handleThumbnailUpload = async (file: File): Promise<string> => {
    setUploadingThumbnail(true);
    try {
      const fileName = `thumbnails/${Date.now()}-${file.name}`;
      const url = await uploadFile(file, fileName);
      return url;
    } catch (error) {
      console.error("Error uploading thumbnail:", error);
      setError("Failed to upload thumbnail");
      throw error;
    } finally {
      setUploadingThumbnail(false);
    }
  };

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Admin Panel
              </h1>
              <p className="text-gray-300">Manage your portfolio content</p>
            </div>
            <Button
              onClick={() => setIsAuthenticated(false)}
              variant="outline"
              className="text-white border-gray-600 hover:bg-gray-700"
            >
              Logout
            </Button>
          </div>

          {/* Tabs */}
          <div className="flex space-x-4 mb-8">
            <Button
              onClick={() => setActiveTab("categories")}
              className={
                activeTab === "categories" ? "bg-blue-600" : "bg-gray-700"
              }
            >
              <Folder className="w-4 h-4 mr-2" />
              Categories
            </Button>
            <Button
              onClick={() => setActiveTab("videos")}
              className={activeTab === "videos" ? "bg-blue-600" : "bg-gray-700"}
            >
              <Video className="w-4 h-4 mr-2" />
              Videos
            </Button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {/* Categories Tab */}
          {activeTab === "categories" && (
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Categories</h2>
                <Button
                  onClick={() => setShowCategoryForm(true)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Category
                </Button>
              </div>

              {/* Category Form */}
              {showCategoryForm && (
                <CategoryForm
                  onSubmit={handleCreateCategory}
                  onCancel={() => setShowCategoryForm(false)}
                />
              )}

              {/* Categories List */}
              <div className="space-y-4">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="bg-gray-700 rounded-lg p-4 flex justify-between items-center"
                  >
                    <div>
                      <h3 className="text-white font-semibold">
                        {category.name}
                      </h3>
                      <p className="text-gray-300 text-sm">{category.nameHe}</p>
                      <p className="text-gray-400 text-xs">
                        Order: {category.order}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => setEditingCategory(category)}
                        size="sm"
                        variant="outline"
                        className="text-blue-400 border-blue-400 hover:bg-blue-900"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => handleDeleteCategory(category.id)}
                        size="sm"
                        variant="outline"
                        className="text-red-400 border-red-400 hover:bg-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Videos Tab */}
          {activeTab === "videos" && (
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Videos</h2>
                <Button
                  onClick={() => setShowVideoForm(true)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Video
                </Button>
              </div>

              {/* Video Form */}
              {showVideoForm && (
                <VideoForm
                  categories={categories}
                  onSubmit={
                    editingVideo
                      ? (data) => handleUpdateVideo(editingVideo.id, data)
                      : handleCreateVideo
                  }
                  onCancel={() => {
                    setShowVideoForm(false);
                    setEditingVideo(null);
                  }}
                  onVideoUpload={handleVideoUpload}
                  onThumbnailUpload={handleThumbnailUpload}
                  uploadingVideo={uploadingVideo}
                  uploadingThumbnail={uploadingThumbnail}
                  initialData={editingVideo}
                />
              )}

              {/* Videos List */}
              <div className="space-y-4">
                {videos.map((video) => {
                  const category = categories.find(
                    (c) => c.id === video.categoryId
                  );
                  return (
                    <div
                      key={video.id}
                      className="bg-gray-700 rounded-lg p-4 flex justify-between items-center"
                    >
                      <div className="flex-1">
                        <h3 className="text-white font-semibold">
                          {video.title}
                        </h3>
                        <p className="text-gray-300 text-sm">{video.titleHe}</p>
                        <p className="text-gray-400 text-sm">
                          {video.subtitle}
                        </p>
                        <p className="text-gray-400 text-sm">
                          {video.subtitleHe}
                        </p>
                        <p className="text-gray-500 text-xs">
                          Category: {category?.name || "Unknown"}
                        </p>
                        <p className="text-gray-500 text-xs">
                          Order: {video.order}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => {
                            setEditingVideo(video);
                            setShowVideoForm(true);
                          }}
                          size="sm"
                          variant="outline"
                          className="text-blue-400 border-blue-400 hover:bg-blue-900"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleDeleteVideo(video.id)}
                          size="sm"
                          variant="outline"
                          className="text-red-400 border-red-400 hover:bg-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-gray-800 rounded-lg p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Admin Access</h1>
            <p className="text-gray-400 mt-2">Enter password to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                required
              />
              {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
            >
              {isLoading ? "Authenticating..." : "Access Admin Panel"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

// Category Form Component
const CategoryForm = ({
  onSubmit,
  onCancel,
  initialData,
}: {
  onSubmit: (data: { name: string; nameHe: string; order: number }) => void;
  onCancel: () => void;
  initialData?: PortfolioCategory;
}) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    nameHe: initialData?.nameHe || "",
    order: initialData?.order || 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-gray-700 rounded-lg p-6 mb-6">
      <h3 className="text-xl font-bold text-white mb-4">
        {initialData ? "Edit Category" : "Add New Category"}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              English Name
            </label>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Category name in English"
              className="bg-gray-600 border-gray-500 text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Hebrew Name
            </label>
            <Input
              value={formData.nameHe}
              onChange={(e) =>
                setFormData({ ...formData, nameHe: e.target.value })
              }
              placeholder="Category name in Hebrew"
              className="bg-gray-600 border-gray-500 text-white"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Order
          </label>
          <Input
            type="number"
            value={formData.order}
            onChange={(e) =>
              setFormData({ ...formData, order: parseInt(e.target.value) || 0 })
            }
            placeholder="Display order"
            className="bg-gray-600 border-gray-500 text-white"
            required
          />
        </div>
        <div className="flex space-x-4">
          <Button type="submit" className="bg-green-600 hover:bg-green-700">
            <Save className="w-4 h-4 mr-2" />
            {initialData ? "Update" : "Create"}
          </Button>
          <Button
            type="button"
            onClick={onCancel}
            variant="outline"
            className="border-gray-500 text-gray-300"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

// Video Form Component
const VideoForm = ({
  categories,
  onSubmit,
  onCancel,
  initialData,
  onVideoUpload,
  onThumbnailUpload,
  uploadingVideo,
  uploadingThumbnail,
}: {
  categories: PortfolioCategory[];
  onSubmit: (
    data: Omit<PortfolioVideo, "id" | "createdAt" | "updatedAt">
  ) => void;
  onCancel: () => void;
  initialData?: PortfolioVideo;
  onVideoUpload: (file: File) => Promise<string>;
  onThumbnailUpload: (file: File) => Promise<string>;
  uploadingVideo: boolean;
  uploadingThumbnail: boolean;
}) => {
  const [formData, setFormData] = useState({
    categoryId: initialData?.categoryId || "",
    title: initialData?.title || "",
    titleHe: initialData?.titleHe || "",
    subtitle: initialData?.subtitle || "",
    subtitleHe: initialData?.subtitleHe || "",
    videoUrl: initialData?.videoUrl || "",
    thumbnailUrl: initialData?.thumbnailUrl || "",
    order: initialData?.order || 0,
  });
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let finalVideoUrl = formData.videoUrl;
    let finalThumbnailUrl = formData.thumbnailUrl;

    try {
      // Upload video file if selected
      if (videoFile) {
        finalVideoUrl = await onVideoUpload(videoFile);
      }

      // Upload thumbnail file if selected
      if (thumbnailFile) {
        finalThumbnailUrl = await onThumbnailUpload(thumbnailFile);
      }

      // Submit with uploaded URLs
      onSubmit({
        ...formData,
        videoUrl: finalVideoUrl,
        thumbnailUrl: finalThumbnailUrl,
      });
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      setFormData({ ...formData, videoUrl: "" }); // Clear URL when file is selected
    }
  };

  const handleThumbnailFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      setFormData({ ...formData, thumbnailUrl: "" }); // Clear URL when file is selected
    }
  };

  return (
    <div className="bg-gray-700 rounded-lg p-6 mb-6">
      <h3 className="text-xl font-bold text-white mb-4">
        {initialData ? "Edit Video" : "Add New Video"}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Category
            </label>
            <select
              value={formData.categoryId}
              onChange={(e) =>
                setFormData({ ...formData, categoryId: e.target.value })
              }
              className="w-full bg-gray-600 border border-gray-500 text-white rounded-md px-3 py-2"
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Order
            </label>
            <Input
              type="number"
              value={formData.order}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  order: parseInt(e.target.value) || 0,
                })
              }
              placeholder="Display order"
              className="bg-gray-600 border-gray-500 text-white"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              English Title
            </label>
            <Input
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Video title in English (optional)"
              className="bg-gray-600 border-gray-500 text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Hebrew Title
            </label>
            <Input
              value={formData.titleHe}
              onChange={(e) =>
                setFormData({ ...formData, titleHe: e.target.value })
              }
              placeholder="Video title in Hebrew (optional)"
              className="bg-gray-600 border-gray-500 text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              English Subtitle
            </label>
            <Input
              value={formData.subtitle}
              onChange={(e) =>
                setFormData({ ...formData, subtitle: e.target.value })
              }
              placeholder="Video subtitle in English (optional)"
              className="bg-gray-600 border-gray-500 text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Hebrew Subtitle
            </label>
            <Input
              value={formData.subtitleHe}
              onChange={(e) =>
                setFormData({ ...formData, subtitleHe: e.target.value })
              }
              placeholder="Video subtitle in Hebrew (optional)"
              className="bg-gray-600 border-gray-500 text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Video
          </label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="file"
                accept="video/*"
                onChange={handleVideoFileChange}
                className="hidden"
                id="video-upload"
              />
              <label
                htmlFor="video-upload"
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md cursor-pointer transition-colors"
              >
                <Upload className="w-4 h-4" />
                <span>{videoFile ? videoFile.name : "Upload Video"}</span>
              </label>
              {uploadingVideo && (
                <div className="flex items-center space-x-2 text-blue-400">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                  <span className="text-sm">Uploading...</span>
                </div>
              )}
            </div>
            <div className="text-sm text-gray-400">OR</div>
            <Input
              value={formData.videoUrl}
              onChange={(e) => {
                setFormData({ ...formData, videoUrl: e.target.value });
                setVideoFile(null); // Clear file when URL is entered
              }}
              placeholder="https://example.com/video.mp4"
              className="bg-gray-600 border-gray-500 text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Thumbnail (Optional)
          </label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleThumbnailFileChange}
                className="hidden"
                id="thumbnail-upload"
              />
              <label
                htmlFor="thumbnail-upload"
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md cursor-pointer transition-colors"
              >
                <Image className="w-4 h-4" />
                <span>
                  {thumbnailFile ? thumbnailFile.name : "Upload Thumbnail"}
                </span>
              </label>
              {uploadingThumbnail && (
                <div className="flex items-center space-x-2 text-green-400">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-400"></div>
                  <span className="text-sm">Uploading...</span>
                </div>
              )}
            </div>
            <div className="text-sm text-gray-400">OR</div>
            <Input
              value={formData.thumbnailUrl}
              onChange={(e) => {
                setFormData({ ...formData, thumbnailUrl: e.target.value });
                setThumbnailFile(null); // Clear file when URL is entered
              }}
              placeholder="https://example.com/thumbnail.jpg"
              className="bg-gray-600 border-gray-500 text-white"
            />
          </div>
        </div>

        <div className="flex space-x-4">
          <Button
            type="submit"
            disabled={uploadingVideo || uploadingThumbnail}
            className="bg-green-600 hover:bg-green-700 disabled:opacity-50"
          >
            <Save className="w-4 h-4 mr-2" />
            {uploadingVideo || uploadingThumbnail
              ? "Uploading..."
              : initialData
              ? "Update"
              : "Create"}
          </Button>
          <Button
            type="button"
            onClick={onCancel}
            variant="outline"
            className="border-gray-500 text-gray-300"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Admin;

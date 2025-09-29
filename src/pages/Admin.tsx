import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Lock,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  GripVertical,
  Upload,
  Video,
  Folder,
  FileVideo,
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

// Helper functions for localStorage authentication
const ADMIN_SESSION_KEY = "admin_session";
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

const saveAdminSession = () => {
  const sessionData = {
    timestamp: Date.now(),
    authenticated: true,
  };
  localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(sessionData));
};

const checkAdminSession = (): boolean => {
  try {
    const sessionData = localStorage.getItem(ADMIN_SESSION_KEY);
    if (!sessionData) return false;

    const parsed = JSON.parse(sessionData);
    const now = Date.now();

    // Check if session is still valid (within 24 hours)
    if (now - parsed.timestamp < SESSION_DURATION) {
      return true;
    } else {
      // Session expired, remove it
      localStorage.removeItem(ADMIN_SESSION_KEY);
      return false;
    }
  } catch (error) {
    console.error("Error checking admin session:", error);
    localStorage.removeItem(ADMIN_SESSION_KEY);
    return false;
  }
};

const clearAdminSession = () => {
  localStorage.removeItem(ADMIN_SESSION_KEY);
};

const Admin = () => {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [remotePassword, setRemotePassword] = useState("");

  // Category management state
  const [categories, setCategories] = useState<PortfolioCategory[]>([]);
  const [editingCategory, setEditingCategory] =
    useState<PortfolioCategory | null>(null);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  // Video management state
  const [selectedCategory, setSelectedCategory] =
    useState<PortfolioCategory | null>(null);
  const [videos, setVideos] = useState<PortfolioVideo[]>([]);
  const [draggedVideo, setDraggedVideo] = useState<string | null>(null);
  const [batchUploading, setBatchUploading] = useState(false);
  const [sessionExpiry, setSessionExpiry] = useState<Date | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // All Work section state
  const [showAllWork, setShowAllWork] = useState(false);
  const [allVideos, setAllVideos] = useState<PortfolioVideo[]>([]);
  const [draggedAllWorkVideo, setDraggedAllWorkVideo] = useState<string | null>(
    null
  );

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

  // Check for existing admin session on component mount
  useEffect(() => {
    const hasValidSession = checkAdminSession();
    if (hasValidSession) {
      setIsAuthenticated(true);
      // Set session expiry time for display
      const sessionData = localStorage.getItem(ADMIN_SESSION_KEY);
      if (sessionData) {
        const parsed = JSON.parse(sessionData);
        const expiryTime = new Date(parsed.timestamp + SESSION_DURATION);
        setSessionExpiry(expiryTime);
      }
    }
  }, []);

  // Load categories when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadCategories();
    }
  }, [isAuthenticated]);

  // Periodic session check to auto-logout when expired
  useEffect(() => {
    if (!isAuthenticated) return;

    const checkSession = () => {
      const hasValidSession = checkAdminSession();
      if (!hasValidSession) {
        setIsAuthenticated(false);
        setSessionExpiry(null);
        setError("Session expired. Please log in again.");
      }
    };

    // Check every 5 minutes
    const interval = setInterval(checkSession, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const loadCategories = async () => {
    try {
      const categoriesData = await getCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error loading categories:", error);
      setError("Failed to load categories");
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
        saveAdminSession(); // Save session to localStorage
        const expiryTime = new Date(Date.now() + SESSION_DURATION);
        setSessionExpiry(expiryTime);
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
      await loadCategories();
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
      await loadCategories();
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
        await loadCategories();
      } catch (error) {
        console.error("Error deleting category:", error);
        setError("Failed to delete category");
      }
    }
  };

  // Drag and drop functions
  const handleDragStart = (e: React.DragEvent, categoryId: string) => {
    setDraggedItem(categoryId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e: React.DragEvent, targetCategoryId: string) => {
    e.preventDefault();

    if (!draggedItem || draggedItem === targetCategoryId) {
      setDraggedItem(null);
      return;
    }

    const draggedCategory = categories.find((c) => c.id === draggedItem);
    const targetCategory = categories.find((c) => c.id === targetCategoryId);

    if (!draggedCategory || !targetCategory) {
      setDraggedItem(null);
      return;
    }

    try {
      // Create a new array with updated orders
      const sortedCategories = [...categories].sort(
        (a, b) => a.order - b.order
      );
      const draggedIndex = sortedCategories.findIndex(
        (c) => c.id === draggedItem
      );
      const targetIndex = sortedCategories.findIndex(
        (c) => c.id === targetCategoryId
      );

      // Remove the dragged item from its current position
      const [movedCategory] = sortedCategories.splice(draggedIndex, 1);

      // Insert it at the target position
      sortedCategories.splice(targetIndex, 0, movedCategory);

      // Update all categories with new order values
      const updatePromises = sortedCategories.map((category, index) =>
        updateCategory(category.id, { order: index + 1 })
      );

      await Promise.all(updatePromises);
      await loadCategories();
    } catch (error) {
      console.error("Error updating category order:", error);
      setError("Failed to update category order");
    }

    setDraggedItem(null);
  };

  // Video management functions
  const loadVideos = async (categoryId: string) => {
    try {
      const allVideos = await getVideos();
      const categoryVideos = allVideos.filter(
        (video) => video.categoryId === categoryId
      );
      setVideos(categoryVideos);
    } catch (error) {
      console.error("Error loading videos:", error);
      setError("Failed to load videos");
    }
  };

  const loadAllVideos = async () => {
    try {
      const allVideosData = await getVideos();
      // Sort by a separate "allWorkOrder" field if it exists, otherwise by order
      const sortedVideos = allVideosData.sort((a, b) => {
        const aOrder = (a as any).allWorkOrder || a.order;
        const bOrder = (b as any).allWorkOrder || b.order;
        return aOrder - bOrder;
      });
      setAllVideos(sortedVideos);
    } catch (error) {
      console.error("Error loading all videos:", error);
      setError("Failed to load all videos");
    }
  };

  const handleCategorySelect = async (category: PortfolioCategory) => {
    setSelectedCategory(category);
    setEditingCategory(null);
    setShowCategoryForm(false);
    await loadVideos(category.id);
  };

  const uploadFile = async (file: File, path: string): Promise<string> => {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
  };

  const handleBatchVideoUpload = async (files: File[], categoryId: string) => {
    setBatchUploading(true);
    try {
      const uploadPromises = files.map(async (file, index) => {
        const fileName = `videos/${Date.now()}-${index}-${file.name}`;
        const videoUrl = await uploadFile(file, fileName);

        // Extract name from filename
        const { title, titleHe } = extractNameFromFileName(file.name);

        const videoData: Omit<
          PortfolioVideo,
          "id" | "createdAt" | "updatedAt"
        > = {
          categoryId,
          title,
          titleHe,
          subtitle: "",
          subtitleHe: "",
          videoUrl,
          thumbnailUrl: "",
          order: videos.length + index + 1,
        };

        return createVideo(videoData);
      });

      await Promise.all(uploadPromises);
      await loadVideos(categoryId);
    } catch (error) {
      console.error("Error in batch upload:", error);
      setError("Failed to upload videos");
    } finally {
      setBatchUploading(false);
    }
  };

  const handleDeleteVideo = async (videoId: string) => {
    if (window.confirm("Are you sure you want to delete this video?")) {
      try {
        await deleteVideo(videoId);
        if (selectedCategory) {
          await loadVideos(selectedCategory.id);
        }
      } catch (error) {
        console.error("Error deleting video:", error);
        setError("Failed to delete video");
      }
    }
  };

  // Video drag and drop functions
  const handleVideoDragStart = (e: React.DragEvent, videoId: string) => {
    setDraggedVideo(videoId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleVideoDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleVideoDrop = async (e: React.DragEvent, targetVideoId: string) => {
    e.preventDefault();

    if (!draggedVideo || draggedVideo === targetVideoId || !selectedCategory) {
      setDraggedVideo(null);
      return;
    }

    try {
      const sortedVideos = [...videos].sort((a, b) => a.order - b.order);
      const draggedIndex = sortedVideos.findIndex((v) => v.id === draggedVideo);
      const targetIndex = sortedVideos.findIndex((v) => v.id === targetVideoId);

      const [movedVideo] = sortedVideos.splice(draggedIndex, 1);
      sortedVideos.splice(targetIndex, 0, movedVideo);

      const updatePromises = sortedVideos.map((video, index) =>
        updateVideo(video.id, { order: index + 1 })
      );

      await Promise.all(updatePromises);
      await loadVideos(selectedCategory.id);
    } catch (error) {
      console.error("Error updating video order:", error);
      setError("Failed to update video order");
    }

    setDraggedVideo(null);
  };

  // All Work drag and drop functions
  const handleAllWorkDragStart = (e: React.DragEvent, videoId: string) => {
    setDraggedAllWorkVideo(videoId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleAllWorkDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleAllWorkDrop = async (
    e: React.DragEvent,
    targetVideoId: string
  ) => {
    e.preventDefault();

    if (!draggedAllWorkVideo || draggedAllWorkVideo === targetVideoId) {
      setDraggedAllWorkVideo(null);
      return;
    }

    try {
      const sortedVideos = [...allVideos];
      const draggedIndex = sortedVideos.findIndex(
        (v) => v.id === draggedAllWorkVideo
      );
      const targetIndex = sortedVideos.findIndex((v) => v.id === targetVideoId);

      const [movedVideo] = sortedVideos.splice(draggedIndex, 1);
      sortedVideos.splice(targetIndex, 0, movedVideo);

      // Update allWorkOrder for all videos
      const updatePromises = sortedVideos.map((video, index) =>
        updateVideo(video.id, { allWorkOrder: index + 1 })
      );

      await Promise.all(updatePromises);
      await loadAllVideos();
    } catch (error) {
      console.error("Error updating all work video order:", error);
      setError("Failed to update all work video order");
    }

    setDraggedAllWorkVideo(null);
  };

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Category Management
              </h1>
              <p className="text-gray-300">Manage your portfolio categories</p>
              {sessionExpiry && (
                <p className="text-sm text-gray-400 mt-1">
                  Session expires: {sessionExpiry.toLocaleString()}
                </p>
              )}
            </div>
            <Button
              onClick={() => {
                setIsAuthenticated(false);
                clearAdminSession(); // Clear session from localStorage
                setSessionExpiry(null);
              }}
              variant="outline"
              className="text-white border-gray-600 hover:bg-gray-700"
            >
              Logout
            </Button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {/* All Work Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">All Work</h2>
                <p className="text-gray-300">
                  Manage global video alignment across all categories
                </p>
              </div>
              <Button
                onClick={() => {
                  setShowAllWork(!showAllWork);
                  if (!showAllWork) {
                    loadAllVideos();
                  }
                }}
                className={
                  showAllWork
                    ? "bg-orange-600 hover:bg-orange-700"
                    : "bg-orange-600 hover:bg-orange-700"
                }
              >
                {showAllWork ? "Hide All Work" : "Show All Work"}
              </Button>
            </div>

            {/* All Work Videos Grid */}
            {showAllWork && (
              <div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => e.preventDefault()}
              >
                {allVideos.map((video) => {
                  const category = categories.find(
                    (c) => c.id === video.categoryId
                  );
                  return (
                    <AllWorkVideoCard
                      key={video.id}
                      video={video}
                      category={category}
                      onDragStart={(e) => handleAllWorkDragStart(e, video.id)}
                      onDragOver={handleAllWorkDragOver}
                      onDrop={(e) => handleAllWorkDrop(e, video.id)}
                      isDragging={draggedAllWorkVideo === video.id}
                      isDropTarget={
                        draggedAllWorkVideo && draggedAllWorkVideo !== video.id
                      }
                    />
                  );
                })}
              </div>
            )}

            {/* All Work Drag Instructions */}
            {draggedAllWorkVideo && showAllWork && (
              <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-orange-600 text-white px-6 py-3 rounded-lg shadow-lg z-50">
                Drag to reorder all work videos
              </div>
            )}
          </div>

          {/* Add Category Button */}
          <div className="mb-6">
            <Button
              onClick={() => setShowCategoryForm(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </div>

          {/* Video Management Section - Above Categories */}
          {selectedCategory && !editingCategory && !showCategoryForm && (
            <div className="mb-12">
              <div className="mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Videos in "{selectedCategory.name}"
                  </h2>
                  <p className="text-gray-300">
                    Manage videos for this category
                  </p>
                </div>
              </div>

              {/* Hidden file input for immediate folder selection */}
              <input
                type="file"
                accept="video/*"
                multiple
                onChange={async (e) => {
                  const files = Array.from(e.target.files || []);
                  if (files.length > 0) {
                    await handleBatchVideoUpload(files, selectedCategory.id);
                  }
                }}
                className="hidden"
                id="video-upload-input"
              />

              {/* Upload Progress - Always visible when uploading */}
              {batchUploading && (
                <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-400"></div>
                      <span className="text-blue-200 font-medium">
                        Uploading videos...
                      </span>
                    </div>
                    <div className="text-blue-300 text-sm">
                      Please wait while videos are being processed
                    </div>
                  </div>
                  <div className="mt-3 bg-blue-800/30 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-blue-400 h-full animate-pulse rounded-full"
                      style={{ width: "100%" }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Upload Area - Always visible for adding more videos */}
              <div
                className={`text-center py-8 rounded-lg border-2 border-dashed transition-colors group mb-6 ${
                  batchUploading
                    ? "cursor-not-allowed opacity-50 border-gray-600 bg-gray-800"
                    : "cursor-pointer border-purple-400 bg-purple-900/10 hover:border-purple-500 hover:bg-purple-900/20"
                }`}
                onClick={() => {
                  if (!batchUploading) {
                    const fileInput = document.getElementById(
                      "video-upload-input"
                    ) as HTMLInputElement;
                    fileInput?.click();
                  }
                }}
                onDragEnter={(e) => {
                  if (!batchUploading) {
                    e.preventDefault();
                    setIsDragOver(true);
                  }
                }}
                onDragLeave={(e) => {
                  if (!batchUploading) {
                    e.preventDefault();
                    setIsDragOver(false);
                  }
                }}
                onDragOver={(e) => {
                  if (!batchUploading) {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = "copy";
                  }
                }}
                onDrop={async (e) => {
                  if (!batchUploading) {
                    e.preventDefault();
                    setIsDragOver(false);
                    const files = Array.from(e.dataTransfer.files).filter(
                      (file) => file.type.startsWith("video/")
                    );
                    if (files.length > 0) {
                      await handleBatchVideoUpload(files, selectedCategory.id);
                    }
                  }
                }}
              >
                <Upload
                  className={`w-8 h-8 mx-auto mb-3 transition-colors ${
                    batchUploading
                      ? "text-gray-500"
                      : isDragOver
                      ? "text-purple-400"
                      : "text-purple-400 group-hover:text-purple-300"
                  }`}
                />
                <div
                  className={`text-lg font-medium mb-2 transition-colors ${
                    batchUploading
                      ? "text-gray-500"
                      : isDragOver
                      ? "text-white"
                      : "text-purple-300 group-hover:text-white"
                  }`}
                >
                  {batchUploading
                    ? "Uploading..."
                    : isDragOver
                    ? "Drop videos here"
                    : "Add More Videos"}
                </div>
                <p
                  className={`text-sm transition-colors ${
                    batchUploading
                      ? "text-gray-600"
                      : isDragOver
                      ? "text-purple-200"
                      : "text-gray-400 group-hover:text-purple-200"
                  }`}
                >
                  {batchUploading
                    ? "Please wait for current upload to complete"
                    : isDragOver
                    ? "Release to upload videos"
                    : "Click here or drag and drop video files"}
                </p>
              </div>

              {/* Videos Grid - Show when videos exist OR when uploading */}
              {(videos.length > 0 || batchUploading) && (
                <div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => e.preventDefault()}
                >
                  {videos.map((video) => (
                    <VideoCard
                      key={video.id}
                      video={video}
                      onDelete={() => handleDeleteVideo(video.id)}
                      onDragStart={(e) => handleVideoDragStart(e, video.id)}
                      onDragOver={handleVideoDragOver}
                      onDrop={(e) => handleVideoDrop(e, video.id)}
                      isDragging={draggedVideo === video.id}
                      isDropTarget={draggedVideo && draggedVideo !== video.id}
                    />
                  ))}
                </div>
              )}

              {/* Video Drag Instructions */}
              {draggedVideo && (
                <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white px-6 py-3 rounded-lg shadow-lg z-50">
                  Drag to reorder videos
                </div>
              )}
            </div>
          )}

          {/* Category Form */}
          {(showCategoryForm || editingCategory) && (
            <CategoryForm
              onSubmit={
                editingCategory
                  ? (data) => handleUpdateCategory(editingCategory.id, data)
                  : handleCreateCategory
              }
              onCancel={() => {
                setShowCategoryForm(false);
                setEditingCategory(null);
              }}
              initialData={editingCategory}
            />
          )}

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                onEdit={() => setEditingCategory(category)}
                onDelete={() => handleDeleteCategory(category.id)}
                onSelect={() => handleCategorySelect(category)}
                onDragStart={(e) => handleDragStart(e, category.id)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, category.id)}
                isDragging={draggedItem === category.id}
                isDropTarget={draggedItem && draggedItem !== category.id}
                isSelected={selectedCategory?.id === category.id}
              />
            ))}
          </div>

          {/* Drag and Drop Instructions */}
          {draggedItem && (
            <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg z-50">
              Drag to reorder categories
            </div>
          )}

          {categories.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-4">
                No categories yet
              </div>
              <p className="text-gray-500">
                Click "Add Category" to create your first category
              </p>
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

// Category Card Component
const CategoryCard = ({
  category,
  onEdit,
  onDelete,
  onSelect,
  onDragStart,
  onDragOver,
  onDrop,
  isDragging,
  isDropTarget,
  isSelected,
}: {
  category: PortfolioCategory;
  onEdit: () => void;
  onDelete: () => void;
  onSelect: () => void;
  onDragStart: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  isDragging: boolean;
  isDropTarget?: boolean;
  isSelected?: boolean;
}) => {
  return (
    <div
      className={`bg-gray-800 rounded-lg p-6 border-2 transition-all duration-200 cursor-pointer hover:bg-gray-700 ${
        isDragging
          ? "border-blue-500 opacity-50"
          : isDropTarget
          ? "border-green-500 bg-green-900/20"
          : isSelected
          ? "border-purple-500 bg-purple-900/20"
          : "border-transparent hover:border-gray-600"
      }`}
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white mb-2">{category.name}</h3>
          <p className="text-gray-300 text-sm mb-2">{category.nameHe}</p>
          <div className="flex items-center text-gray-400 text-xs">
            <span className="bg-gray-700 px-2 py-1 rounded">
              Order: {category.order}
            </span>
          </div>
        </div>
        <div className="flex flex-col space-y-2">
          <div className="cursor-grab active:cursor-grabbing">
            <GripVertical className="w-5 h-5 text-gray-400 hover:text-gray-300" />
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          size="sm"
          variant="outline"
          className="text-blue-400 border-blue-400 hover:bg-blue-900"
        >
          <Edit className="w-4 h-4" />
        </Button>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          size="sm"
          variant="outline"
          className="text-red-400 border-red-400 hover:bg-red-900"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
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

  // Update form data when initialData changes (for editing)
  React.useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        nameHe: initialData.nameHe || "",
        order: initialData.order || 0,
      });
    } else {
      setFormData({
        name: "",
        nameHe: "",
        order: 0,
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 mb-6 border border-gray-600">
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
              className="bg-gray-700 border-gray-500 text-white"
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
              className="bg-gray-700 border-gray-500 text-white"
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
            className="bg-gray-700 border-gray-500 text-white"
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

// Helper functions for video display
const getVideoFileName = (url: string) => {
  try {
    const urlParts = url.split("/");
    const fileName = urlParts[urlParts.length - 1];
    return fileName.split("?")[0]; // Remove query parameters
  } catch {
    return "video.mp4";
  }
};

const extractNameFromFileName = (
  fileName: string
): { title: string; titleHe: string } => {
  try {
    // Remove file extension
    const nameWithoutExt = fileName.replace(/\.[^/.]+$/, "");

    // Decode URL encoding if present
    const decodedName = decodeURIComponent(nameWithoutExt);

    // Remove timestamp prefix if present (format: timestamp-index-filename)
    const nameWithoutTimestamp = decodedName.replace(/^\d+-\d+-/, "");

    // Split by common separators and clean up
    const cleanName = nameWithoutTimestamp
      .replace(/[-_]/g, " ") // Replace dashes and underscores with spaces
      .replace(/\s+/g, " ") // Replace multiple spaces with single space
      .trim();

    // Capitalize first letter of each word
    const title = cleanName
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

    // For Hebrew title, we'll use the same for now (can be enhanced later)
    const titleHe = title;

    return { title, titleHe };
  } catch (error) {
    console.error("Error extracting name from filename:", error);
    // Fallback to original filename
    const fallback = fileName.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
    return { title: fallback, titleHe: fallback };
  }
};

const getDisplayTitle = (video: PortfolioVideo) => {
  // If title exists and is not empty, use it
  if (video.title && video.title.trim()) {
    return video.title;
  }

  // Otherwise, try to extract from filename
  try {
    const fileName = getVideoFileName(video.videoUrl);
    const { title } = extractNameFromFileName(fileName);
    return title;
  } catch {
    return "Untitled Video";
  }
};

const getDisplayTitleHe = (video: PortfolioVideo) => {
  // If Hebrew title exists and is not empty, use it
  if (video.titleHe && video.titleHe.trim()) {
    return video.titleHe;
  }

  // Otherwise, try to extract from filename
  try {
    const fileName = getVideoFileName(video.videoUrl);
    const { titleHe } = extractNameFromFileName(fileName);
    return titleHe;
  } catch {
    return "";
  }
};

// Video Card Component
const VideoCard = ({
  video,
  onDelete,
  onDragStart,
  onDragOver,
  onDrop,
  isDragging,
  isDropTarget,
}: {
  video: PortfolioVideo;
  onDelete: () => void;
  onDragStart: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  isDragging: boolean;
  isDropTarget?: boolean;
}) => {
  return (
    <div
      className={`bg-gray-700 rounded-lg p-4 border-2 transition-all duration-200 cursor-move hover:bg-gray-600 ${
        isDragging
          ? "border-purple-500 opacity-50"
          : isDropTarget
          ? "border-green-500 bg-green-900/20"
          : "border-transparent hover:border-gray-500"
      }`}
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <FileVideo className="w-4 h-4 text-gray-400" />
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-white truncate">
              {getDisplayTitle(video)}
            </h4>
            {getDisplayTitleHe(video) && (
              <p className="text-xs text-gray-300 truncate">
                {getDisplayTitleHe(video)}
              </p>
            )}
          </div>
        </div>
        <div className="cursor-grab active:cursor-grabbing">
          <GripVertical className="w-4 h-4 text-gray-400 hover:text-gray-300" />
        </div>
      </div>

      <div className="space-y-1 mb-3">
        {video.subtitle && (
          <p className="text-xs text-gray-400 truncate">{video.subtitle}</p>
        )}
        {video.subtitleHe && (
          <p className="text-xs text-gray-400 truncate">{video.subtitleHe}</p>
        )}
      </div>

      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-500 bg-gray-600 px-2 py-1 rounded">
          #{video.order}
        </span>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          size="sm"
          variant="outline"
          className="text-red-400 border-red-400 hover:bg-red-900 h-6 w-6 p-0"
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
};

// All Work Video Card Component
const AllWorkVideoCard = ({
  video,
  category,
  onDragStart,
  onDragOver,
  onDrop,
  isDragging,
  isDropTarget,
}: {
  video: PortfolioVideo;
  category?: PortfolioCategory;
  onDragStart: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  isDragging: boolean;
  isDropTarget?: boolean;
}) => {
  return (
    <div
      className={`bg-orange-900/20 border-2 rounded-lg p-4 transition-all duration-200 cursor-move hover:bg-orange-900/30 ${
        isDragging
          ? "border-orange-400 opacity-50"
          : isDropTarget
          ? "border-green-500 bg-green-900/20"
          : "border-orange-500 hover:border-orange-400"
      }`}
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <FileVideo className="w-4 h-4 text-orange-400" />
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-white truncate">
              {getDisplayTitle(video)}
            </h4>
            {getDisplayTitleHe(video) && (
              <p className="text-xs text-orange-200 truncate">
                {getDisplayTitleHe(video)}
              </p>
            )}
          </div>
        </div>
        <div className="cursor-grab active:cursor-grabbing">
          <GripVertical className="w-4 h-4 text-orange-400 hover:text-orange-300" />
        </div>
      </div>

      <div className="space-y-1 mb-3">
        {category && (
          <p className="text-xs text-orange-300 truncate">
            Category: {category.name}
          </p>
        )}
        {video.subtitle && (
          <p className="text-xs text-orange-200 truncate">{video.subtitle}</p>
        )}
        {video.subtitleHe && (
          <p className="text-xs text-orange-200 truncate">{video.subtitleHe}</p>
        )}
      </div>

      <div className="flex justify-between items-center">
        <span className="text-xs text-orange-400 bg-orange-800/30 px-2 py-1 rounded">
          All Work #{video.allWorkOrder || video.order}
        </span>
        <div className="flex items-center space-x-1">
          <span className="text-xs text-orange-300">
            Category #{video.order}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Admin;

'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "lightbox2/dist/css/lightbox.min.css";
import DataTable from '@/matt/DataTable';
import Button from '@/matt/Button';
import SeeMoreText from '@/matt/SeeMoreText';

interface BlogPost {
  id: number;
  title: string;
  content: string;
  authorName: string;
  image: string;
  date: string;
}

interface BlogPostFormData extends Partial<BlogPost> {
  imageFile?: File | null;
}

const LatestBlog = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [formData, setFormData] = useState<BlogPostFormData>({});
  const [editMode, setEditMode] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState<string | null>(null);
  const tableRef = useRef<HTMLTableElement | null>(null);
  const [isSaving, setIsSaving] = useState(false);


  const fetchBlogPosts = async () => {
    try {
      const response = await fetch('/api/LatestBlog');
      const data: BlogPost[] = await response.json();

      const updatedBlogPosts = await Promise.all(data.map(async (post: BlogPost) => {
        if (post.image) {
          const imageRes = await fetch(post.image);
          const imageBlob = await imageRes.blob();
          post.image = URL.createObjectURL(imageBlob);
        }
        return post;
      }));

      setBlogPosts(updatedBlogPosts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      setBlogPosts([]);
      toast.error("Error fetching blog posts.");
    }
  };

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setFormData((prev) => ({ ...prev, imageFile: file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const method = editMode ? 'PUT' : 'POST';
    const id = editMode ? formData.id : null;

    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title || '');
    formDataToSend.append('content', formData.content || '');
    formDataToSend.append('authorName', formData.authorName || '');
    formDataToSend.append('date', formData.date || '');
    if (formData.imageFile) {
      formDataToSend.append('imageFile', formData.imageFile);
    }

    try {
      const response = await fetch('/api/LatestBlog' + (id ? `?id=${id}` : ''), {
        method,
        body: formDataToSend,
      });

      if (response.ok) {
        const newPost = await response.json();
        setBlogPosts((prev) => editMode
          ? prev.map(post => (post.id === newPost.id ? newPost : post))
          : [...prev, newPost]
        );
        setFormData({});
        setEditMode(false);
        setModalOpen(false);
        toast.success(editMode ? 'Blog post updated successfully!' : 'Blog post added successfully!');
      } else {
        toast.error('Failed to add/update the blog post.');
      }
    } catch (error) {
      toast.error('An error occurred while adding/updating the blog post.');
    } finally {
      setIsSaving(false);
    }
  };


  const handleEdit = (post: BlogPost) => {
    setFormData(post);
    setEditMode(true);
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    const response = await fetch(`/api/LatestBlog?id=${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      setBlogPosts((prev) => prev.filter(post => post.id !== id));
      toast.success('Blog post deleted successfully!');
    } else {
      toast.error('Failed to delete the blog post.');
    }
  };

  const handleImageClick = (image: string) => {
    setModalImage(image);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalImage(null);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      require("lightbox2");
    }
  }, []);


  const columns = [
    { key: 'title', header: 'Blog' },
     {
          key: "description",
          header: "Description",
          renderCell: (row: BlogPost) => <SeeMoreText text={row.content} maxLength={100} />,
        },
    { key: 'authorName', header: 'Author' },
    {
      key: 'image', header: 'Image', renderCell: (row: BlogPost) => (
        <div className="mx-auto">
          <a
            data-lightbox="gallery"
            data-title={row.title}
            href={row.image}
          >
            <img
              src={row.image}
              alt={row.title}
              className="h-full w-full max-h-12 object-contain"
            />
          </a>
        </div>
      ),
    },
    {
      key: 'date', header: 'Date', renderCell: (row: BlogPost) => (
        new Date(row.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
      ),
    },
    {
      key: 'actions', header: 'Actions', renderCell: (row: BlogPost) => (
        <>
          <Button onClick={() => handleEdit(row)} color="blue">
            Edit
          </Button>
          <Button onClick={() => handleDelete(row.id)} color="red">
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center py-6 w-full">
      <h1 className="mb-4 text-3xl font-serif font-semibold text-gray-800">Latest News</h1>
      <div className="w-full max-w-5xl mx-auto sm:mx-4 md:mx-auto flex justify-end mb-6">
        <button
          onClick={() => { setModalOpen(true); setEditMode(false); }}
          className="mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add New Post
        </button>
      </div>

      <div className="w-full max-w-5xl mx-auto overflow-x-auto">
        <DataTable columns={columns} data={blogPosts} />
      </div>

      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-11/12 max-w-md">
            <h2 className="mb-4 text-lg font-bold">{editMode ? 'Edit' : 'Add'} Blog Post</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={formData.title || ''}
                onChange={handleInputChange}
                required
                className="w-full p-2 mb-4 border border-gray-400 rounded shadow-sm focus:outline-none"
              />
              <textarea
                name="content"
                placeholder="Content"
                value={formData.content || ''}
                onChange={handleInputChange}
                required
                className="w-full p-2 mb-4 border border-gray-400 rounded shadow-sm focus:outline-none"
              />
              <input
                type="text"
                name="authorName"
                placeholder="Author Name"
                value={formData.authorName || ''}
                onChange={handleInputChange}
                required
                className="w-full p-2 mb-4 border border-gray-400 rounded shadow-sm focus:outline-none"
              />
              <input
                type="date"
                name="date"
                value={formData.date || ''}
                onChange={handleInputChange}
                required
                className="w-full p-2 mb-4 border border-gray-400 rounded shadow-sm focus:outline-none"
              />
              <input
                type="file"
                name="imageFile"
                onChange={handleFileChange}
                className="mb-4"
              />
              <div className="flex justify-between">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center"
                  disabled={isSaving}
                >
                  {isSaving && <span className="animate-spin h-4 w-4 border-t-2 border-white border-solid rounded-full mr-2"></span>}
                  {editMode ? 'Update' : 'Add'} Post
                </button>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-gray-400 rounded hover:bg-gray-200 transition duration-200"
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modalImage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="relative">
            <button onClick={closeModal} className="absolute top-0 right-1 p-3 text-white text-2xl">x</button>
            <Image src={modalImage} alt="Large View" width={500} height={500} className="object-contain" />
          </div>
        </div>
      )}
      <ToastContainer autoClose={1500} />
    </div>
  );
};

export default LatestBlog;

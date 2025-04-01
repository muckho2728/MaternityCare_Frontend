import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import api from '../../config/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import './Blog.css';

const CreateBlog = () => {
    const [tags, setTags] = useState([]);
    const userId = localStorage.getItem('userId');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const response = await api.get('tags');
                setTags(response.data);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách tag:', error);
            }
        };
        fetchTags();
    }, []);

    const validationSchema = yup.object({
        title: yup.string().trim().required('Không được để trống Tiêu đề'),
        content: yup.string().trim().required('Không được để trống Nội dung'),
        tagId: yup.string().required('Hãy chọn Tag'),
    });

    const formik = useFormik({
        initialValues: {
            title: '',
            content: '',
            image: null,
            tagId: '',
        },
        validationSchema,
        onSubmit: async (values) => {
            setLoading(true);
            const formData = new FormData();
            formData.append('title', values.title);
            formData.append('content', values.content);
            if (values.image) {
                formData.append('image', values.image);
            }
            formData.append('tagId', values.tagId);

            try {
                const response = await api.post(`users/${userId}/blogs`, formData);
                console.log("API Response:", response.data);
                toast.success('Tạo bài viết thành công, đang chờ duyệt bài');
                setTimeout(() => navigate("/community"), 2000);
            } catch (error) {
                console.error('Lỗi khi tạo blog:', error);
                toast.error('Lỗi khi tạo bài viết!');
            } finally {
                setLoading(false);
            }
        },
    });

    return (
        <div className="blog-form-container">
            <h1>Tạo Bài Viết Mới</h1>
            <div className='blog-form'>
                <form onSubmit={formik.handleSubmit}>
                    <input 
                        type="text" 
                        name="title" 
                        placeholder="Tiêu Đề" 
                        value={formik.values.title} 
                        onChange={formik.handleChange} 
                        onBlur={formik.handleBlur} 
                    />
                    {formik.touched.title && formik.errors.title && <p className="error" style={{ color: 'red' }}>{formik.errors.title}</p>}
                    
                    <textarea 
                        name="content" 
                        placeholder="Nội Dung" 
                        value={formik.values.content} 
                        onChange={formik.handleChange} 
                        onBlur={formik.handleBlur} 
                    />
                    {formik.touched.content && formik.errors.content && <p className="error" style={{ color: 'red' }}>{formik.errors.content}</p>}
                    
                    <input 
                        type="file" 
                        name="image" 
                        accept="image/*" 
                        onChange={(event) => formik.setFieldValue("image", event.currentTarget.files[0])} 
                    />
                    
                    <select 
                        name="tagId" 
                        value={formik.values.tagId} 
                        onChange={formik.handleChange} 
                        onBlur={formik.handleBlur} 
                    >
                        <option value="">Chọn Tag</option>
                        {tags.map((tag) => (
                            <option key={tag.id} value={tag.id}>{tag.name}</option>
                        ))}
                    </select>
                    {formik.touched.tagId && formik.errors.tagId && <p className="error" style={{ color: 'red' }}>{formik.errors.tagId}</p>}
                    
                    <div className="button-group">
                        <button type="submit" disabled={loading}>{loading ? "Đang Tạo..." : "Tạo Bài Viết"}</button>
                        <button type="button" className="cancel-btn" onClick={() => window.history.back()}>Hủy</button>
                    </div>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
};

export default CreateBlog;

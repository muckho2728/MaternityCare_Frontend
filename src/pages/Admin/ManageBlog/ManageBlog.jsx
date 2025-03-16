import { useState, useEffect } from "react";
import { Button, Modal, Table, message, Select } from "antd";
import { EyeOutlined, StopOutlined, CheckCircleOutlined } from "@ant-design/icons";
import api from "../../../config/api";

const { Option } = Select;

const ManageBlog = () => {
    const [blogs, setBlogs] = useState([]);
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [viewOpen, setViewOpen] = useState(false);
    const [filterStatus, setFilterStatus] = useState(null); // Bộ lọc trạng thái

    useEffect(() => {
        fetchBlogs();
    }, [filterStatus]);

    const fetchBlogs = async () => {
        try {
            const response = await api.get("blogs", {
                params: { isActive: filterStatus }
            });
            setBlogs(response.data);
        } catch (error) {
            message.error("Lỗi khi tải danh sách blog!");
        }
    };

    const handleToggleStatus = async (blog) => {
        Modal.confirm({
            title: `Xác nhận ${blog.isActive ? "vô hiệu hóa" : "kích hoạt lại"}?`,
            content: `Bạn có chắc chắn muốn ${blog.isActive ? "vô hiệu hóa" : "kích hoạt lại"} bài blog này?`,
            onOk: async () => {
                try {
                    await api.put(`blogs/${blog.id}/activation`, { isActive: !blog.isActive });
                    message.success(`Đã ${blog.isActive ? "vô hiệu hóa" : "kích hoạt lại"} bài blog!`);
                    fetchBlogs();
                } catch (error) {
                    message.error("Lỗi khi cập nhật trạng thái bài blog!");
                }
            },
        });
    };

    const showDrawer = (blog) => {
        setSelectedBlog(blog);
        setViewOpen(true);
    };

    const columns = [
        { title: "Tiêu đề", dataIndex: "title", key: "title" },
        { 
            title: "Trạng thái", 
            dataIndex: "isActive", 
            key: "isActive", 
            render: (isActive) => (
                <span style={{ color: isActive ? "green" : "red" }}>
                    {isActive ? "Hoạt động" : "Vô hiệu hóa"}
                </span>
            ),
        },
        { title: "Tag", dataIndex: "tag", key: "tag", render: (tag) => tag?.name || "Không có tag" },
        { 
            title: "Hành động", 
            render: (_, record) => (
                <>
                    <Button type="link" icon={<EyeOutlined />} onClick={() => showDrawer(record)}>
                        Xem
                    </Button>
                    <Button 
                        danger={record.isActive} 
                        type={record.isActive ? "default" : "primary"} 
                        icon={record.isActive ? <StopOutlined /> : <CheckCircleOutlined />} 
                        onClick={() => handleToggleStatus(record)}
                    >
                        {record.isActive ? "Vô hiệu hóa" : "Bật lại"}
                    </Button>
                </>
            ),
        },
    ];

    return (
        <div>
            <div style={{ marginBottom: 16 }}>
                <span style={{ marginRight: 8 }}>Lọc theo trạng thái:</span>
                <Select 
                    style={{ width: 200 }} 
                    onChange={setFilterStatus} 
                    allowClear
                    placeholder="Chọn trạng thái"
                >
                    <Option value={true}>Hoạt động</Option>
                    <Option value={false}>Vô hiệu hóa</Option>
                </Select>
            </div>
            <Table dataSource={blogs} columns={columns} rowKey="id" />

            <Modal
                title="Chi tiết Blog"
                open={viewOpen}
                onCancel={() => setViewOpen(false)}
                footer={null}
            >
                {selectedBlog && (
                    <div>
                        <p><strong>Tiêu đề:</strong> {selectedBlog.title}</p>
                        <p><strong>Nội dung:</strong> {selectedBlog.content}</p>
                        <p><strong>Image:</strong> {selectedBlog.image}</p>
                        <p><strong>Tag:</strong> {selectedBlog.tag?.name || "Không có tag"}</p>
                        <p><strong>Trạng thái:</strong> 
                            <span style={{ color: selectedBlog.isActive ? "green" : "red" }}>
                                {selectedBlog.isActive ? "Hoạt động" : "Vô hiệu hóa"}
                            </span>
                        </p>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default ManageBlog;

import { useState, useEffect } from "react";
import { Button, Modal, Form, Input, Table, Upload, message } from "antd";
import { EyeOutlined, UploadOutlined } from "@ant-design/icons";
import api from "../../../config/api";

const Doctor = () => {
    const [doctors, setDoctors] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [viewOpen, setViewOpen] = useState(false);
    const [file, setFile] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            const response = await api.get("doctors/active-doctors");
            setDoctors(response.data);
        } catch (error) {
            message.error("Lỗi khi tải danh sách bác sĩ!");
        }
    };

    const handleAddDoctor = () => {
        setOpen(true);
        setSelectedDoctor(null);
        form.resetFields();
    };

    const handleEditDoctor = (doctor) => {
        setOpen(true);  
        console.log(doctor)
        setSelectedDoctor(doctor);
        form.setFieldsValue({ ...doctor ,avatar : null });
        setFile(null);
    };

    const handleDeleteDoctor = async (doctorId) => {
        Modal.confirm({
            title: "Xác nhận xóa",
            content: "Bạn có chắc chắn muốn xóa bác sĩ này?",
            onOk: async () => {
                try {
                    await api.delete(`doctors/${doctorId}`);
                    message.success("Xóa bác sĩ thành công!");
                    fetchDoctors();
                } catch (error) {
                    message.error("Lỗi khi xóa bác sĩ!");
                }
            },
        });
    };

    const handleSubmit = async (values) => {
        try {
            const formData = new FormData();
            formData.append("fullName", values.fullName);
            formData.append("specialization", values.specialization);
            formData.append("yearsOfExperience", values.yearsOfExperience);
            formData.append("email", values.email);
            formData.append("phoneNumber", values.phoneNumber);

            
    
            // Check if a new file is uploaded
            if (file) {
                formData.append("avatar", file);
            } else if (selectedDoctor && selectedDoctor.avatar) {
                formData.append("avatar", selectedDoctor.avatar); // Keep existing avatar if no new file
            }
    
            if (selectedDoctor) {
                console.log(selectedDoctor)
                await api.put(`doctors/${selectedDoctor.id}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                message.success("Cập nhật bác sĩ thành công!");
            } else {
                await api.post("doctors", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                message.success("Thêm bác sĩ thành công!");
            }
            setOpen(false);
            fetchDoctors();
        } catch (error) {
            message.error(error.response?.data?.message || "Lỗi khi lưu bác sĩ!");
        }
    };

    const showDrawer = (doctor) => {
        setSelectedDoctor(doctor);
        setViewOpen(true);
    };

    const columns = [
        { title: "Tên", dataIndex: "fullName", key: "fullName" },
        { title: "Chuyên khoa", dataIndex: "specialization", key: "specialization" },
        { title: "Kinh nghiệm", dataIndex: "yearsOfExperience", key: "yearsOfExperience" },
        { title: "Hành động", render: (_, record) => (
            <>
                <Button type="link" icon={<EyeOutlined />} onClick={() => showDrawer(record)}>Xem</Button>
                <Button onClick={() => handleEditDoctor(record)}>Cập nhật</Button>
                <Button danger onClick={() => handleDeleteDoctor(record.id)}>Xóa</Button>
            </>
        )},
    ];

    return (
        <div>
            <Button type="primary" onClick={handleAddDoctor}>Thêm bác sĩ</Button>
            <Table dataSource={doctors} columns={columns} rowKey="id" />
            <Modal
                title={selectedDoctor ? "Cập nhật bác sĩ" : "Thêm bác sĩ"}
                open={open}
                onCancel={() => setOpen(false)}
                footer={null}
            >
                <Form form={form} onFinish={handleSubmit} layout="vertical">
                    <Form.Item name="fullName" label="Tên" rules={[{ required: true, message: "Vui lòng nhập tên!" }]}> 
                        <Input />
                    </Form.Item>
                    <Form.Item name="specialization" label="Chuyên khoa" rules={[{ required: true, message: "Vui lòng nhập chuyên khoa!" }]}> 
                        <Input />
                    </Form.Item>
                    <Form.Item name="yearsOfExperience" label="Kinh nghiệm" rules={[{ required: true, message: "Vui lòng nhập kinh nghiệm!" }]}> 
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item name="email" label="Email" rules={[{ required: true, message: "Vui lòng nhập email!" }]}> 
                        <Input />
                    </Form.Item>
                    <Form.Item name="phoneNumber" label="Số điện thoại" rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}> 
                        <Input />
                    </Form.Item>
                    <Form.Item name="avatar" label="Ảnh">
                        {selectedDoctor && <img src={selectedDoctor.avatar} alt="avatar" width={100}  />}
                        <Upload 
                            listType="picture"
                            beforeUpload={(newFile) => {
                                setFile(newFile);
                                form.setFieldsValue({ avatar: newFile });
                                return false; 
                            }}
                            onRemove={() => {
                                setFile(null); 
                                form.setFieldsValue({ avatar: null });
                            }}>
                            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item>
                    
                        <Button type="primary" htmlType="submit">{selectedDoctor ? "Cập nhật" : "Thêm"}</Button>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="Thông tin bác sĩ"
                open={viewOpen}
                onCancel={() => setViewOpen(false)}
                footer={null}
            >
                {selectedDoctor && (
                    <div>
                        <p><strong>Tên:</strong> {selectedDoctor.fullName}</p>
                        <p><strong>Chuyên khoa:</strong> {selectedDoctor.specialization}</p>
                        <p><strong>Kinh nghiệm:</strong> {selectedDoctor.yearsOfExperience} năm</p>
                        <p><strong>Email:</strong> {selectedDoctor.email}</p>
                        <p><strong>Số điện thoại:</strong> {selectedDoctor.phoneNumber}</p>
                        <p><strong>Ảnh:</strong></p>
                        <img src={selectedDoctor.avatar} alt="avatar" width={100} />
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Doctor;

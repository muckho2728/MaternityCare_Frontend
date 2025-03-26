import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Search, MessageCircle } from "lucide-react";
import api from '../../constants/axios';
import { Modal, Button, Card } from "antd";
import "./ViewSlot.css";

const ViewSlot = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [specialtyFilter, setSpecialtyFilter] = useState("all");
    const [doctors, setDoctors] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const pageSize = 100;
    const [specialties, setSpecialties] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [slots, setSlots] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [loadingSlot, setLoadingSlot] = useState(false); // Thêm state để theo dõi trạng thái loading

    useEffect(() => {
        const fetchCurrentUser = async (url) => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found');
                return;
            }

            try {
                const response = await api.get(url, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log('Current user data:', response.data);
                setCurrentUser(response.data);
                console.log('User ID:', response.data.id);
            } catch (error) {
                console.error('Failed to fetch current user:', error.response ? error.response.data : error.message);
                throw error;
            }
        };

        fetchCurrentUser('https://maternitycare.azurewebsites.net/api/authentications/current-user');
    }, []);

    useEffect(() => {
        const fetchDoctors = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found');
                return;
            }

            try {
                const response = await api.get(`https://maternitycare.azurewebsites.net/api/doctors/active-doctors?PageNumber=${pageNumber}&PageSize=${pageSize}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setDoctors(response.data);
                extractSpecialties(response.data);
            } catch (error) {
                console.error("Error fetching doctors:", error.response?.data || error.message);
                toast.error("Error fetching doctors: " + (error.response?.data?.message || error.message));
            }
        };

        fetchDoctors();
    }, [pageNumber]);

    const fetchSlots = async (doctor) => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found');
            return;
        }

        try {
            const response = await api.get(`https://maternitycare.azurewebsites.net/api/doctors/${doctor.id}/slots?PageNumber=1&PageSize=10`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setSlots(response.data);
            setSelectedDoctor(doctor);
            setIsModalOpen(true);
            console.log(response.data);
        } catch (error) {
            console.error("Error fetching slots:", error);
            toast.error("Error fetching slots: " + (error.response?.data?.message || error.message));
        }
    };

    const confirmBooking = async (doctorId, slotId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found');
            return;
        }

        setLoadingSlot(true); // Bắt đầu loading
        try {
            const response = await api.get(`https://maternitycare.azurewebsites.net/api/doctors/${doctorId}/slots/${slotId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setSelectedSlot(response.data);
            console.log(response.data);
        } catch (error) {
            console.error("Error confirming slot:", error);
            toast.error("Error confirming slot: " + (error.response?.data?.message || error.message));
        } finally {
            setLoadingSlot(false); // Kết thúc loading
        }
    };

    const showConfirmModal = async (doctorId, slotId) => {
        setSelectedDoctor({ id: doctorId });
        setSelectedSlot({ id: slotId });
        await confirmBooking(doctorId, slotId); // Gọi API để lấy thông tin slot ngay lập tức
        setIsConfirmModalOpen(true);
    };

    const bookAppointments = async (userId, slotId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found');
            return;
        }
        try {
            const response = await api.post(`https://maternitycare.azurewebsites.net/api/users/${userId}/slots/${slotId}/appointments`, {}, {
                headers: {
                    accept: `*/*`,
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success("Đăng ký lịch khám thành công");
            console.log("Đăng ký thành công");
            setIsConfirmModalOpen(false);
            setIsModalOpen(false);
        } catch (error) {
            console.log(error.response);
            toast.error("Đăng ký thất bại: " + (error.response?.data?.message || error.message));
        }
    };

    const handleConfirmBooking = () => {
        console.log('handleConfirmBooking triggered');
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found');
            return;
        }
        if (currentUser && selectedSlot && selectedDoctor) {
            bookAppointments(currentUser.id, selectedSlot.id);
            console.log('Token:', token);
        }
    };

    const extractSpecialties = (doctorsList) => {
        const uniqueSpecialties = [...new Set(doctorsList.map(doctor => doctor.specialization))];
        setSpecialties(uniqueSpecialties);
    };

    const handlePageChange = (newPage) => {
        setPageNumber(newPage);
    };

    const filteredDoctors = doctors.filter(doctor =>
        doctor.fullName.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (specialtyFilter === "all" || doctor.specialization === specialtyFilter)
    );

    return (
        <div className="view-slot-container">
            <header className="hero-section">
            <h1 className="view-slot-header">Đội ngũ bác sĩ tận tâm – Hãy chọn người phù hợp nhất cho bạn</h1>
            
            <p className="view-slot-description">
                Chúng tôi hiểu rằng sức khỏe của bạn là ưu tiên hàng đầu. Dưới đây là danh sách các bác sĩ chuyên khoa hàng đầu, 
                sẵn sàng hỗ trợ bạn. Hãy tìm kiếm và chọn một bác sĩ phù hợp để bắt đầu hành trình chăm sóc sức khỏe ngay hôm nay!
            </p>
            </header>
            <div className="search-bar">
                <div className="blog-search">
                    <input
                        type="text"
                        placeholder="Tìm kiếm bác sĩ..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="blog-search-input"
                    />
                    <button className="blog-search-btn">
                        <Search size={18} />
                    </button>
                </div>
                <select value={specialtyFilter} onChange={(e) => setSpecialtyFilter(e.target.value)}>
                    <option value="all">Toàn bộ</option>
                    {specialties.map((specialty, index) => (
                        <option key={index} value={specialty}>{specialty}</option>
                    ))}
                </select>
            </div>

            <div className="doctor-list">
                {filteredDoctors.map((doctor) => (
                    <div key={doctor.id} className="doctor-card" onClick={() => fetchSlots(doctor)}>
                        <img src={doctor.avatar} alt={doctor.fullName} />
                        <h3>{doctor.fullName}</h3>
                        <p>Chuyên môn: {doctor.specialization}</p>
                    </div>
                ))}
            </div>


            {/* Pagination */}
            <div className="pagination">
                <button onClick={() => handlePageChange(pageNumber - 1)} disabled={pageNumber === 1}>
                    Trước
                </button>
                <button onClick={() => handlePageChange(pageNumber + 1)}>Sau</button>
            </div>

            {/* Modal lịch khám */}
            <Modal
                title={selectedDoctor ? `Lịch khám của ${selectedDoctor.fullName}` : "Lịch khám"}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                className="custom-modal"
            >
                <div className="slot-container">
                    {slots.length > 0 ? (
                        slots
                            .filter(slot => {
                                const currentDate = new Date();
                                const slotDate = new Date(slot.date);
                                return !slot.isBooked && slotDate >= currentDate;
                            })
                            .sort((a, b) => {
                                const dateA = new Date(a.date);
                                const dateB = new Date(b.date);
                                return dateA - dateB || a.startTime.localeCompare(b.startTime);
                            })
                            .map(slot => (
                                <Card className="slot-card" key={slot.id}>
                                    <p>📅 Ngày: {slot.date}</p>
                                    <p>⏰ Giờ bắt đầu: {slot.startTime}</p>
                                    <p>⏳ Giờ kết thúc: {slot.endTime}</p>
                                    <Button className="book-btn" onClick={() => showConfirmModal(selectedDoctor.id, slot.id)}>
                                        Đặt lịch hẹn
                                    </Button>
                                </Card>
                            ))
                    ) : (
                        <p>Không có lịch hẹn nào</p>
                    )}
                </div>
            </Modal>

            {/* Modal xác nhận đặt lịch */}
            <Modal
                title="Xác nhận lịch hẹn"
                open={isConfirmModalOpen}
                onCancel={() => setIsConfirmModalOpen(false)}
                footer={
                    <Button className="confirm-btn" onClick={handleConfirmBooking} disabled={loadingSlot}>
                        Xác nhận
                    </Button>
                }
            >
                {loadingSlot ? (
                    <p>Đang tải thông tin...</p>
                ) : selectedSlot && selectedSlot.date ? (
                    <div>
                        <p>📅 Ngày: {selectedSlot.date}</p>
                        <p>⏰ Giờ bắt đầu: {selectedSlot.startTime}</p>
                        <p>⏳ Giờ kết thúc: {selectedSlot.endTime}</p>
                    </div>
                ) : (
                    <p>Không thể tải thông tin slot.</p>
                )}
            </Modal>
        </div>

    );
};

export default ViewSlot;
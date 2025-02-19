import React, { useEffect, useState } from 'react';
import { Carousel } from 'antd';
import './Home.css';
import slide1 from '../../assets/Slide1.png';
import slide2 from '../../assets/Slide2.jpg';
import slide3 from '../../assets/Slide3.jpg';
import slide4 from '../../assets/Slide4.jpg';
import { fetchCurrentUserAction, fetchUserByIdAction } from '../../store/redux/action/userAction';

const Home = () => {

    


    return (
        <div className="home">
            <main className="main-content">
                <section className="introduction">
                    <div className="slide-container">
                        <Carousel autoplay>
                            <div>
                                <img src={slide1} alt="Slide 1" style={{width: '100%', height: 'auto', maxHeight: '400px'}} />
                            </div>
                            <div>
                                <img src={slide2} alt="Slide 1" style={{width: '100%', height: 'auto', maxHeight: '400px'}} />
                            </div>
                            <div>
                                <img src={slide3} alt="Slide 1" style={{width: '100%', height: 'auto', maxHeight: '400px'}} />
                            </div>
                            <div>
                                <img src={slide4} alt="Slide 1" style={{width: '100%', height: 'auto', maxHeight: '400px'}} />
                            </div>
                        </Carousel>
                    </div>
                    <div className="introduction-text">
                        <h2>INTRODUCTION</h2>
                        <p>
                            Chào mừng bạn đến với Maternity Care, nơi đồng hành cùng mẹ bầu trong hành trình mang thai đầy kỳ diệu. Trang web của chúng tôi cung cấp thông tin chi tiết, 
                            khoa học và dễ hiểu về sự phát triển của thai nhi qua từng tuần, cùng với các lời khuyên chăm sóc sức khỏe cho mẹ bầu.
                            Từ việc giải đáp những thắc mắc thường gặp, đến hướng dẫn dinh dưỡng, luyện tập, và chuẩn bị tâm lý, 
                            Maternity Care mong muốn trở thành người bạn đáng tin cậy giúp bạn và bé yêu có một thai kỳ khỏe mạnh và hạnh phúc.
                            Hãy cùng khám phá hành trình phát triển kỳ diệu của bé ngay hôm nay!
                        </p>
                    </div>
                </section>
            </main>

        </div>
    );
};

export default Home;

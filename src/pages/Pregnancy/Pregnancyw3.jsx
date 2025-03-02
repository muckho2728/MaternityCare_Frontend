import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './Pregnancy.css';
import img1 from '../../assets/3-1.png';
import img2 from '../../assets/3-2.png';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const data = [
  { name: 'Chu vi đầu', standard: 0, user: 0 },
  { name: 'Chiều dài đầu mông', standard: 0, user: 0 },
  { name: 'Đường kính lưỡng đỉnh', standard: 0, user: 0 },
  { name: 'Chiều dài xương đùi', standard: 0, user: 0 },
  { name: 'Chu vi bụng', standard: 0, user: 0 },
  { name: 'Đường kính túi thai', standard: 0, user: 0 },
];

const Pregnancyw3 = () => {
  const calculateDueDate = (conceptionDate) => {
    const date = new Date(conceptionDate);
    date.setMonth(date.getMonth() + 9);
    date.setDate(date.getDate() + 10);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const dueDate = calculateDueDate('2025-02-28');

  const navigate = useNavigate(); 

    const handleButton2Click = () => {
        navigate('/pregnancy'); 
    };

  return (
    <div className='pregnancy-container'>
      <h1 className='text-2xl font-bold mb-4 text-center'>Theo Dõi Thai Kỳ</h1>
      <h2>Ngày dự sinh: {dueDate}</h2>
      
      <div className='rectangle-box'>
        <Button style={{backgroundColor: '#4CAF50', color: 'white', float: 'left', marginLeft: '-20px', marginTop: '50px'}} onClick={handleButton2Click}>2</Button>
        <Button style={{backgroundColor: '#4CAF50', color: 'white', float: 'right', marginRight: '-20px', marginTop: '50px'}}>4</Button>
        <div className='circle-box'>
          <h3>3 tuần mang thai</h3>
        </div>
      </div>
      
      <div className='chart-container'>
        <h3>Biểu đồ tăng trưởng</h3>
        <ResponsiveContainer width='96%' height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='name' />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Line type='monotone' dataKey='standard' stroke='#ff0000' name='Dữ liệu chuẩn' />
            <Line type='monotone' dataKey='user' stroke='#0000ff' name='Dữ liệu người dùng' />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className='weight-table'>
        <div className='weight-box'>
          <div className='weight-section'>
            <h4>Trọng lượng thai người dùng</h4>
            <p className='weight-value'> 0 g</p>
          </div>
          <div className='divider'></div>
          <div className='weight-section'>
            <h4>Trọng lượng thai tiêu chuẩn</h4>
            <p className='weight-value'> 0 g</p>
          </div>
        </div>
      </div>
            <div className="info-section">
              <h3>Điểm nổi bật trong tuần này</h3>
              <p>Chờ đợi hai tuần</p>
              <p>Nếu bạn đã sẵn sàng mang thai, những tuần tiếp theo có thể sẽ là khoảng thời gian dài nhất trong cuộc đời bạn. Bạn đang trong cái gọi là thời  gian chờ đợi hai tuần (TWW), khoảng thời gian giữa thời điểm bạn có thể thụ thai và thời điểm bạn có thể có kết quả xét nghiệm thai dương tính . Que thử thai tại nhà chỉ chính xác vào (hoặc sau) ngày đầu tiên của  kỳ kinh nguyệt bị chậm , vì vậy hãy hoãn lại việc thử que.</p>
              <p>Cấy ghép
              </p>
                <p>Phôi nang đang phát triển của bạn đã di chuyển xuống ống dẫn trứng đến tử cung của bạn - và vào cuối tuần hoặc đầu tuần tiếp theo, nó có thể tự cấy ghép vào niêm mạc tử cung tươi tốt. (Trước khi cấy ghép, phôi nang sẽ lột lớp vỏ ngoài trong suốt của nó trong một quá trình gọi là "nở"!) Bạn có thể sẽ không nhận thức được tất cả những điều này đang xảy ra, mặc dù một số phụ nữ bị chảy máu nhẹ do cấy ghép hoặc chuột rút do cấy ghép .</p> 
              <p>Triệu chứng mang thai sớm</p>
              <p>Hầu hết phụ nữ không cảm thấy gì cho đến khi họ trễ kinh, nhưng bạn có thể nhận thấy đầy hơi, chuột rút hoặc ra máu trong tuần này. Ngực của bạn cũng có thể mềm hơn bình thường và bạn có thể có khứu giác nhạy hơn , một trong những triệu chứng mang thai sớm nhất . Vì vậy, nếu bạn đời, ngôi nhà hoặc chú chó của bạn đột nhiên có mùi khác với bạn, hãy cảm ơn hormone đang tăng vọt của bạn.</p>
                <h3>Sự phát triển của bé ở tuần thứ 3</h3>
                <p>Các tế bào đang nhân lên</p>
                <p>Em bé đang phát triển của bạn là một quả bóng nhỏ gồm hàng trăm tế bào đang nhân lên và đào sâu vào niêm mạc tử cung của bạn. Các tế bào ở giữa sẽ trở thành phôi thai. Các tế bào ở bên ngoài sẽ trở thành nhau thai , cơ quan hình bánh kếp cung cấp oxy và chất dinh dưỡng cho em bé của bạn và mang chất thải đi.</p>
                <p>Kết nối với bạn
                </p>
                <p>Em bé tương lai của bạn đang nhận oxy và chất dinh dưỡng (và thải chất thải) thông qua hệ thống tuần hoàn nguyên thủy được tạo thành từ các đường hầm cực nhỏ kết nối với các mạch máu trong thành tử cung của bạn. Cuối cùng, nhau thai sẽ đảm nhiệm nhiệm vụ này vào khoảng cuối tam cá nguyệt đầu tiên .</p>
                  <img src={img1} alt="Quá trình rụng trứng" className="ovulation-image" />
                <h3>Cơ thể mang thai 3 tuần</h3>
                <p>Hormone thai kỳ sớm</p>
                <p>Các tế bào sẽ trở thành nhau thai đang bơm ra hormone thai kỳ hCG. Nó ra lệnh cho buồng trứng của bạn ngừng giải phóng trứng và tiếp tục sản xuất progesterone, ngăn không cho tử cung của bạn bong lớp niêm mạc – và cả hành khách nhỏ bé của nó. Khi có đủ hCG trong nước tiểu, bạn sẽ nhận được kết quả xét nghiệm thai kỳ dương tính .</p>
                <p>Nước ối
                </p>
                <p>Nước ối bắt đầu tích tụ bên trong túi ối. Chất lỏng này sẽ bảo vệ em bé của bạn trong những tuần và tháng tới, và cuối cùng có thể chảy ra ngoài nếu nước ối vỡ trước hoặc trong khi chuyển dạ.</p>
                <h3>Các triệu chứng mang thai trong tuần thứ 3</h3>
                <p>Không có triệu chứng mang thai?</p>
                <p>Một số phụ nữ cảm thấy có thai ngay cả trước khi xét nghiệm có kết quả dương tính, nhưng hầu hết thì không. Nếu bạn có các triệu chứng mang thai trong tuần này, chúng có thể giống như PMS. Nhưng đừng lo lắng nếu bạn vẫn chưa cảm thấy bất kỳ điều gì khác biệt. Ngay cả khi mang thai 5 tuần , chỉ một nửa số phụ nữ cảm thấy các triệu chứng mang thai.</p>
                <p>Đầy hơi và chướng bụng</p>
                <p>Hormone progesterone làm giãn cơ khắp cơ thể bạn, bao gồm cả đường tiêu hóa. Những cơ giãn này làm chậm quá trình tiêu hóa của bạn, có thể dẫn đến đầy hơi và chướng bụng và tạo ra cảm giác khó chịu trong ruột. Khoảng một nửa số phụ nữ mang thai bị táo bón vào một thời điểm nào đó trong thai kỳ. Để mọi thứ diễn ra suôn sẻ, hãy giữ đủ nước và ăn các loại thực phẩm giàu chất xơ như ngũ cốc nguyên hạt , trái cây và rau.</p>
                <p>Đau ngực</p>
                <p>Một số phụ nữ cho biết tình trạng đau ngực của họ trong giai đoạn đầu mang thai giống như một phiên bản phóng đại của cảm giác trước kỳ kinh nguyệt. Ngực của bạn có thể sưng, mềm hoặc ngứa ran - và núm vú của bạn có thể nhạy cảm và khó chịu hơn. Vào giai đoạn sau của thai kỳ, bạn có thể nhận thấy núm vú của mình sẫm màu hơn .</p>
                <p>Phát hiệnc</p>
                <p>Bạn có thể bị chảy máu nhẹ (đốm máu) trong tuần này. Đây là chảy máu do làm tổ – có thể xảy ra vào thời điểm trứng đã thụ tinh làm tổ trong tử cung của bạn . Nó nhẹ hơn nhiều so với kỳ kinh nguyệt thông thường và chỉ kéo dài từ một đến ba ngày. (Nếu bạn bị đau kèm theo chảy máu, hãy gọi ngay cho bác sĩ chăm sóc sức khỏe của bạn. Đây có thể là dấu hiệu của thai ngoài tử cung .)</p>
                <p>Nhiệt độ cơ thể cơ bản vẫn cao</p>
                <p>Nếu bạn đang theo dõi nhiệt độ của mình, nhiệt độ sẽ duy trì ở mức cao trong tuần này. Để theo dõi, hãy sử dụng nhiệt kế cơ thể và đo nhiệt độ sau khi bạn thức dậy vào buổi sáng, trước khi ra khỏi giường.</p>
                  <img src={img2} alt="Quá trình rụng trứng" className="ovulation-image" />
                <h3>Danh sách kiểm tra thai kỳ ở tuần thứ 3</h3>
                <p>Hãy chú ý đến cảm xúc của bạn</p>
                <p>Khi bạn đang chờ đợi để biết mình có thai hay không, hoặc chỉ mới biết, thì việc lo lắng là bình thường . Nếu bạn cảm thấy căng thẳng hoặc lo lắng, hãy nói chuyện với đối tác hoặc một người bạn đáng tin cậy. Hoặc, hãy thử viết ra mọi thứ đang làm phiền bạn. Viết nhật ký có thể cải thiện sức khỏe cảm xúc, sự minh mẫn về tinh thần và thậm chí là sức khỏe thể chất của bạn.</p>
                  <p>Tránh quá nóng</p>
                  <p>Tắm nước nóng là tốt trong thời kỳ mang thai miễn là không quá nóng. Nhưng tránh tắm hơi, bồn tắm nước nóng và phòng xông hơi khô. Nhiệt độ cơ thể tăng cao, đặc biệt là vào đầu thai kỳ, có liên quan đến nguy cơ mắc các khuyết tật ống thần kinh ở trẻ sơ sinh.</p>
                  <p>Ăn các bữa ăn và đồ ăn nhẹ bổ dưỡng</p>
                  <p>Ăn các loại thực phẩm tốt cho thai kỳ như trái cây và rau quả, cá ít thủy ngân và ngũ cốc nguyên hạt. Chọn các loại thực phẩm có chứa vitamin C (như dâu tây, trái cây họ cam quýt, ớt chuông và cà chua), sắt (như thịt bò, thịt gia cầm, các sản phẩm từ đậu nành và rau bina) và canxi (như sữa chua Hy Lạp, ngũ cốc tăng cường và phô mai tiệt trùng). Để biết ý tưởng về đồ ăn nhẹ, hãy xem 10 món ăn nhẹ lành mạnh yêu thích của chúng tôi dành cho các bà mẹ tương lai .</p>
                  <p>Cắt giảm cà phê</p>
                  <p>Trong khi bạn đang cố gắng thụ thai và sau khi bạn mang thai, các chuyên gia khuyên bạn nên hạn chế caffeine ở mức khoảng một tách cà phê mỗi ngày. Điều quan trọng là phải theo dõi lượng caffeine nạp vào cơ thể vì nếu nạp quá nhiều có thể ảnh hưởng đến thai kỳ và em bé của bạn. Hãy xem lượng caffeine có trong các loại thực phẩm và đồ uống khác nhau để bạn có thể duy trì ở mức dưới mức khuyến nghị hàng ngày.</p>
                  <p>Nhận trợ giúp để bỏ thuốc lá</p>
                  <p>Nếu bạn cần giúp đỡ để cai thuốc lá , rượu bia hoặc ma túy , hãy trao đổi với nhà cung cấp dịch vụ chăm sóc sức khỏe và yêu cầu giới thiệu đến một chương trình hoặc chuyên gia tư vấn.</p>
                  <p>Cải thiện giấc ngủ của bạn</p>
                  <p>Khi các vấn đề về giấc ngủ liên quan đến thai kỳ xuất hiện trong vài tháng, hãy chuẩn bị sẵn sàng. Tạo thói quen tốt hơn về giấc ngủ và thực hiện các biện pháp ngủ tốt như thiết lập thói quen đi ngủ thường xuyên và biến phòng ngủ của bạn thành nơi trú ẩn cho giấc ngủ.</p>  
                  <p>Hãy đảm bảo công việc và nhà của bạn được an toàn</p>
                  <p>Một số công việc có thể gây nguy hiểm cho bạn và em bé của bạn. Nếu bạn thường xuyên tiếp xúc với hóa chất, tiếng ồn lớn hoặc bức xạ tại nơi làm việc, hoặc nếu bạn phải đứng liên tục hoặc nâng vật nặng, hãy trao đổi với bác sĩ về cách giữ an toàn khi làm việc trong thời kỳ mang thai . Ngoài ra, hãy nhớ rằng một số thứ trong nhà bạn có thể gây nguy hiểm cho em bé đang phát triển của bạn. Chì (trong nước uống từ đường ống cũ), thủy ngân (trong một số loại cá ), một số loại thuốc trừ sâu và phân bón, và chất độn chuồng mèo có chứa phân đều có khả năng gây hại.</p>
            </div>
        </div>
  );  
};

export default Pregnancyw3;
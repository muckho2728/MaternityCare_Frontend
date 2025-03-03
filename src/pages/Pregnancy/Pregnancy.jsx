import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './Pregnancy.css';
import img1 from '../../assets/2-1.png';
import img2 from '../../assets/2-2.png';
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

const Pregnancy = () => {
  const calculateDueDate = (conceptionDate) => {
    const date = new Date(conceptionDate);
    date.setMonth(date.getMonth() + 9);
    date.setDate(date.getDate() + 10);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate('/Pregnancyw3');
  };

  const dueDate = calculateDueDate('2025-02-28');

  return (
    <div className='pregnancy-container'>
      <h1 className='text-2xl font-bold mb-4 text-center'>Theo Dõi Thai Kỳ</h1>
      <h2>Ngày dự sinh: {dueDate}</h2>
      
      <div className='rectangle-box'>
        <Button style={{backgroundColor: '#4CAF50', color: 'white', float: 'right', marginRight: '-20px', marginTop: '50px'}} onClick={handleButtonClick}>3</Button>
        <div className='circle-box'>
          <h3>2 tuần mang thai</h3>
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
              <p>Bạn có mang thai trong tuần này không?</p>
              <p>Bạn vẫn chưa mang thai, nhưng nếu bạn thụ thai tuần này, 
                bạn sẽ mang thai được hai tuần. Đó là vì các nhà cung cấp dịch vụ
                chăm sóc sức khỏe sử dụng kỳ kinh nguyệt cuối cùng của bạn để xác định
                ngày dự sinh , vì vậy về mặt kỹ thuật, ngày đầu tiên của kỳ kinh nguyệt
                cũng là ngày đầu tiên của thai kỳ. Vì bạn rụng trứng khoảng
                hai tuần trong chu kỳ kinh nguyệt, nên việc thụ thai xảy ra
                vào khoảng thời gian bạn mang thai được hai tuần.</p>
              <p>Thời điểm tốt nhất để thụ thai</p>
                <p>Bạn dễ thụ thai nhất trong ba ngày trước khi rụng trứng. 
                  Các dấu hiệu cho thấy bạn có thể đang rụng trứng bao gồm thay đổi nhiệt độ cơ thể, 
                  đau ngực, chuột rút nhẹ và tăng tiết dịch âm đạo.</p> 
              <p>Phát hiện rụng trứng</p>
              <p>Bạn cũng có thể sử dụng que thử rụng trứng để tìm ra những ngày 
                quan hệ tình dục (hoặc thụ tinh) có khả năng mang thai cao nhất.</p>
                <h3>Sự phát triển của bé ở tuần thứ 2</h3>
                <p>Chuẩn bị để nuôi con</p>
                <p>Trong vài ngày qua, sự gia tăng estrogen và progesterone 
                  đã thúc đẩy niêm mạc tử cung của bạn dày lên để hỗ trợ trứng đã thụ tinh. 
                  Đồng thời, trong buồng trứng của bạn, trứng đã "chín" trong các tố chứa đầy chất lỏng gọi là nang trứng.</p>
                <p>Một quả trứng được giải phóng</p>
                <p>Khi bạn rụng trứng, một quả trứng sẽ phun ra từ nang trứng và được đưa từ buồng trứng vào ống dẫn trứng. 
                  Rụng trứng không nhất thiết phải xảy ra ngay giữa chu kỳ của bạn. 
                  Ví dụ, nó có thể xảy ra bất kỳ lúc nào giữa ngày 9 và ngày 21 đối với phụ nữ có chu kỳ 28 ngày.</p>
                  <img src={img1} alt="Quá trình rụng trứng" className="ovulation-image" />
                <h3>Thụ tinh</h3>
                <p>Tinh trùng gặp trứng</p>
                <p>Trong vòng 24 giờ sau khi rụng trứng, trứng của bạn sẽ được thụ tinh nếu một tinh trùng khỏe mạnh bơi từ AXM đạo qua cổ tử cung, 
                  sau đó qua tử cung vào ống dẫn trứng và thâm nhập vào trứng. 
                  Có gần 250 triệu tinh trùng trong một lần xuất tinh, và khoảng 400 tinh trùng sống sốt sau hành trình 10 giờ đến trứng. 
                  Nhưng thường chỉ có một tinh trùng thành công trong việc đào hang qua màng ngoai của trứng.</p>
                <p>Các gen kết hợp</p>
                <p>Trong 10 đến 30 giờ tiếp theo, nhân của tinh trùng thành công sẽ hợp nhất với trứng và chúng kết hợp vật liệu di truyền của mình. 
                  Nếu tinh trùng mang nhiễm sắc thể Y, em bé của bạn sẽ là con trai. 
                  Nếu nó có nhiễm sắc thể X, bạn sẽ thụ thai là con gái. Trứng đã thụ tinh được gọi là hợp tử .</p>
                <p>Cấy ghép</p>
                <p>Trứng mất ba hoặc bốn ngày để di chuyển từ ống dẫn trứng đến tử cung của bạn, 
                  phân chia thành 100 hoặc nhiều tế bào giống hệt nhau trên đường đi. 
                  Khi vào tử cung, nó được gọi là phôi nang. Một hoặc hai ngày sau, 
                  nó sẽ bắt đầu đào sâu vào lớp niêm mạc tưới tốt của tử cung, nơi nó tiếp tục phát triển và phân chia</p>
                <h3>Các triệu chứng mang thai trong tuần thứ 2</h3>
                <p>Chất nhầy cổ tử cung trơn</p>
                <p>Chất nhầy cổ tử cung là dịch tiết âm đạo mà đôi khi bạn thấy trong đồ lót. 
                  Vào những ngày rụng trứng, chất nhầy sẽ trong, trơn và co giãn – giống như lí trắng trứng sống.</p>
                <p>Chuót rút nhẹ</p>
                <p>Một số phụ nữ nhận thấy những cơn đau quặn nhẹ hoặc đau nhói ở bụng, 
                  hoặc đau lưng một bên, vào thời điểm rụng trứng. Điều này được gọi là 
                  mittelschmerz – tiếng Đức có nghĩa là "đau giữa kỳ".</p>
                <p>Tăng ham muốn tình dục</p>
                <p>Ham muốn tình dục của bạn có thể tăng cao và mùi cơ thể của bạn 
                  có thể hấp dẫn đàn ông hơn vào thời điểm bạn dễ thụ thai.</p>
                <p>Tăng cường khứu giác</p>
                <p>Một số nghiên cứu đã phát hiện ra rằng khứu giác của phụ nữ trở nên
                   mạnh hơn khi gần đến thời điểm rụng trứng – và có thể đặc biệt nhạy cảm với pheromone nam.</p>
                <p>Ngực mềm mại</p>
                <p>Những thay đổi về hormone xung quanh thời kỳ rụng trứng có thể khiến ngực bạn hơi căng hoặc đau. 
                  Để tìm hiểu thêm về những điều có thể xảy ra trong những tuần tới</p>
                <p>Thay đổi cổ tử cung</p>
                <p>Trong thời gian rụng trứng, cổ tử cung của bạn mềm hơn, cao hơn, ướt hơn và mở hơn. 
                  Bạn có thể cảm thấy những thay đổi này nếu bạn đưa ngón tay vào bên trong âm đạo để kiểm tra cổ tử cung, 
                  mặc dù bạn có thể phải kiểm tra hàng ngày để nhận ra sự khác biệt.</p>
                <p>Tăng nhiệt độ cơ thể cơ bản (BBT)</p>
                <p>Bạn có thể sử dụng nhiệt kế đặc biệt để đo BBT mỗi sáng. Vào ngày sau khi rụng trứng, 
                  nhiệt độ sẽ tăng lên một chút và duy trì ở mức cao cho đến kỳ kinh tiếp theo.</p>
                  <img src={img2} alt="Quá trình rụng trứng" className="ovulation-image" />
                <h3>Danh sách kiểm tra thai kỳ ở tuần thứ 2</h3>
                <p>Sử dụng vitamin</p>
                <p>Nếu bạn chưa uống, hãy bắt đầu uống vitamin trước khi sinh có ít nhất 400 microgam (mcg) axit folic mỗi ngày. 
                  Vitamin trước khi sinh cung cấp các chất dinh dụng thiết yếu cho bạn và em bé, bao gồm sắt, 
                  vitamin D và canxi. Axit folic làm giảm nguy cơ mắc một số dị tật băm sinh ở em bé và việc 
                  bổ sung đủ axit folic là rất quan trọng – đặc biệt là trong giai đoạn đầu của thai kỳ 
                  khi ống thần kinh của em bé đang phát triển.</p>
                  <p>Xem nhà cung cấp dịch vụ chăm sóc sức khỏe của bạn</p>
                  <p>Kiểm tra trước khi thụ thai là một ý tưởng hay để đảm bảo cơ thể bạn ở trạng thái tốt nhất 
                    có thể để sinh con. Tìm hiểu xem bạn có nên ngừng dùng bất kỳ loại thuốc theo toa hoặc không 
                    kê đơn hoặc thực phẩm bổ sung nào không. Ngoài ra, hãy sử dụng thời gian này để nói về bất kỳ 
                    vấn đề hoặc mối quan tâm nào bạn có về thai kỳ hoặc việc làm cha mẹ.</p>
                  <p>Hãy xem xét xét nghiệm máu này</p>
                  <p>Bạn và đối tác của bạn có thể muốn sàng lọc người mang gen để xem liệu bạn có mang gen khiến 
                    em bé của bạn có nguy cơ mắc các bệnh di truyền nghiêm trọng hay không. Mặc dù nhiều tình trạng 
                    này rất hiếm gặp, một nghiên cứu lớn đã phát hiện ra rằng 24 phần trăm những người được xét 
                    nghiệm là người mang ít nhất một đột biến gen. Trao đổi với một cố vấn di truyền sẽ giúp bạn 
                    luôn cập nhật thông tin về các lựa chọn sinh sản của mình.</p>
                  <p>Quan hệ tình dục thường xuyên</p>
                  <p>Bạn có thắc mắc nên quan hệ tình dục bao lâu một lần để có thai không? Các nghiên cứu cho thấy 
                    tỷ lệ mang thai cao nhất là ở những cặp đôi quan hệ tình dục hàng ngày hoặc cách ngày. 
                    Nhưng bạn không cần phải bận rộn thường xuyên như vậy: Một nguyên tắc chung là hãy thử ít nhất 
                    hai đến ba ngày một lần ngay sau khi kết thúc kỳ kinh nguyệt. Tinh trùng có thể sống trong 
                    cơ thể bạn trong khoảng 72 giờ, vì vậy nếu bạn quan hệ tình dục trong khoảng thời gian ba 
                    ngày trước khi rụng trứng, sẽ có tinh trùng chờ đợi để chào đón trứng vừa rụng của bạn.</p>
                  <p>Dành thời gian để chăm sóc bản thân</p>
                  <p>Khi bạn chăm sóc sức khỏe tinh thần và thể chất của mình, bạn có thể chăm sóc người khác tốt hơn. 
                    Hãy bắt đầu lấp đầy cốc của bạn ngay bây giờ bằng cách ăn những thực phẩm hỗ trợ thai kỳ , ngủ đủ giấc, 
                    tập thể dục và kiểm soát căng thẳng . Hãy thử mát-xa, yoga hoặc hít thở sâu: Giảm mức độ căng thẳng có 
                    thể tăng khả năng thụ thai và có một thai kỳ khỏe mạnh .</p>
                  <p>Chuẩn bị cơ thể cho việc mang thai</p>
                  <p>Dành thời gian để tăng cường sức mạnh cho bụng và lưng trước (hoặc trong khi) cơ thể bạn thay đổi 
                    sẽ có lợi cho bạn trong suốt thai kỳ và sau đó. Một lõi khỏe hơn sẽ ngăn ngừa các vấn đề về lưng khi 
                    bụng bạn lớn lên và thậm chí rút ngắn thời gian phục hồi sau khi sinh. Tập tạ và yoga là hai hoạt động 
                    tốt giúp bạn khỏe hơn.</p>
                  <p>Biết những gì cần tránh</p>
                  <p>Khi bạn đang cố gắng thụ thai và mới mang thai, bạn sẽ muốn tránh xa thuốc là , cần sa, ma túy bất hợp 
                    pháp, rượu và quá nhiều caffeine .</p>  
            </div>
        </div>
  );  
};

export default Pregnancy;
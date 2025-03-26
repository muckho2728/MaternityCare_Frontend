import { Collapse } from "antd";
import { useState } from "react";

const FAQSection = () => {
  const [activeKey, setActiveKey] = useState(["1"]);

  const faqData = [
    {
      key: "1",
      question: "📌 Gói cao cấp có thể hủy không?",
      answer: "✅ Có! Bạn có thể hủy gói cao cấp bất kỳ lúc nào. Nếu đã thanh toán, bạn vẫn có thể sử dụng dịch vụ đến hết thời gian đã đăng ký.",
    },
    {
      key: "2",
      question: "🔄 Sau khi đăng ký có thể nâng cấp không?",
      answer: "✅ Hoàn toàn có thể! Bạn có thể nâng cấp lên gói cao cấp bất kỳ lúc nào. Chỉ cần chọn 'Nâng cấp ngay' và hoàn tất thanh toán.",
    },
    {
      key: "3",
      question: "🎁 Tôi có thể dùng thử gói cao cấp không?",
      answer: "✅ Có! Chúng tôi có chương trình dùng thử 7 ngày để bạn trải nghiệm các tính năng cao cấp.",
    },
    {
      key: "4",
      question: "💳 Phương thức thanh toán được hỗ trợ là gì?",
      answer: "✅ Chúng tôi hỗ trợ thanh toán qua thẻ ngân hàng, ví điện tử (Momo, ZaloPay) và chuyển khoản.",
    },
  ];

  return (
    <section className="faq-section">
      <h2>❓ Câu Hỏi Thường Gặp</h2>
      <p className="faq-intro">Dưới đây là một số câu hỏi phổ biến mà chúng tôi thường nhận được. Nếu bạn có thêm thắc mắc, đừng ngần ngại liên hệ với chúng tôi!</p>
      <Collapse
        activeKey={activeKey}
        onChange={setActiveKey}
        accordion
        className="faq-collapse"
      >
        {faqData.map((faq) => (
          <Collapse.Panel header={faq.question} key={faq.key}>
            <p>{faq.answer}</p>
          </Collapse.Panel>
        ))}
      </Collapse>
    </section>
  );
};

export default FAQSection;

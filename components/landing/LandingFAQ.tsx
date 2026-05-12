import * as React from "react";

const LandingFAQ: React.FC = () => {
  const faqs = [
    {
      question: "What is CommonPlace?",
      answer: "CommonPlace is a community-driven platform where creators and hobbyists exchange honest feedback on their work. Whether you're into art, music, writing, or any other craft, CommonPlace helps you understand how others perceive your creations."
    },
    {
      question: "How does the review system work?",
      answer: "CommonPlace operates on a 'Review to Upload' model. To keep the community active and balanced, you earn 1 credit for every post you review. Once you have 3 credits, you can upload your own creation for others to feedback on."
    },
    {
      question: "Is CommonPlace free to use?",
      answer: "Yes! CommonPlace is completely free. The 'currency' of the platform is your participation. By helping others with feedback, you earn the right to get feedback on your own work."
    },
    {
      question: "What kind of content can I upload?",
      answer: "We support a wide range of formats including images (paintings, sketches, digital art), videos (performances, animations), audio (music, podcasts), and text (poetry, essays, research papers)."
    },
    {
      question: "How does this help me grow my audience?",
      answer: "Every piece of feedback starts a conversation. By networking with other creators in your niche, you can build meaningful connections, find collaborators, and gain visibility within a community that cares about your craft."
    }
  ];

  return (
    <section className="landingFAQ">
      <div className="contain">
        <h2>Frequently Asked Questions</h2>
        <div className="faqGrid">
          {faqs.map((faq, i) => (
            <div key={i} className="faqItem">
              <h5>{faq.question}</h5>
              <p>{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LandingFAQ;

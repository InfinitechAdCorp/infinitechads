import React from 'react';

function PrivacyandPolicy() {
  return (
    <div className="container mx-auto p-8 mt-20">
      <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">Infinitech Advertising Corporation</h1>
      <h2 className="text-xl font-semibold text-gray-700 mb-6">Privacy Policy</h2>

      <p className="text-gray-700 mb-4">
        At Infinitech Advertising Corporation, we respect and value your privacy. This privacy policy outlines how we collect, use, and protect your personal information.
      </p>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800">1. Information We Collect (Email Inquiry):</h3>
        <p className="text-gray-700">
          Your name, email address, website URL, and mobile phone number for the purpose of communication and service delivery.
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800">2. Use of Collected Information:</h3>
        <p className="text-gray-700">
          The information we collect is used solely to enhance your experience with Infinitech Advertising Corporation and provide you with the best possible services. This includes, but is not limited to:
        </p>
        <ul className="list-disc list-inside text-gray-700 mt-2">
          <li>Contacting you with updates or information relevant to your inquiries or orders.</li>
          <li>Responding to your queries or providing you with requested services.</li>
        </ul>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800">3. Data Security:</h3>
        <p className="text-gray-700">
          We are committed to ensuring that your information is secure. In order to prevent unauthorized access or disclosure, we have put in place suitable physical, electronic, and managerial procedures to safeguard and secure the information we collect online.
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800">4. Sharing Your Information:</h3>
        <p className="text-gray-700">
          We do not share, sell, or distribute your personal information to third parties unless required by law.
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800">5. Changes to the Privacy Policy:</h3>
        <p className="text-gray-700">
          Infinitech Advertising Corporation may revise this Privacy Policy from time to time. Continued use of this website after any changes to the Privacy Policy implies your acceptance of those changes.
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800">6. Contact Us:</h3>
        <p className="text-gray-700">
          If you have any questions about this Privacy Policy, please contact us at <a href="mailto:infinitechcorp.ph@gmail.com" className="text-blue-600 hover:underline">infinitechcorp.ph@gmail.com</a>.
        </p>
      </div>
    </div>
  );
}

export default PrivacyandPolicy;

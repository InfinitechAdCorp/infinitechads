import React from 'react';

function TermsAndCondition() {
  return (
    <div className="container mx-auto p-8 mt-20">
      <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center" >Infinitech Advertising Corporation</h1>
      <h2 className="text-xl font-semibold text-gray-700 mb-6">Terms & Conditions</h2>

      <p className="text-gray-700 mb-4">
        Welcome to Infinitech Advertising Corporation! These terms and conditions outline the rules and regulations for the use of our website.
      </p>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800">1. Acceptance of Terms:</h3>
        <p className="text-gray-700">
          By accessing this website, you accept these terms and conditions in full. Do not continue to use the Infinitech Advertising Corporation website if you do not accept all of the terms and conditions stated on this page.
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800">2. License to Use Website:</h3>
        <p className="text-gray-700">
          Unless otherwise stated, Infinitech Advertising Corporation owns the intellectual property rights for all material on this website. You may view and/or print pages from <a href="https://infinitechphil.com" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">https://infinitechphil.com</a> for your personal use subject to the restrictions outlined below:
        </p>
        <ul className="list-disc list-inside text-gray-700 mt-2">
          <li>Do not republish material from this website.</li>
          <li>Do not sell, rent, or sub-license material from the website.</li>
          <li>Do not reproduce, duplicate, or copy material for commercial purposes.</li>
        </ul>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800">3. Information We Collect (Email Inquiry):</h3>
        <p className="text-gray-700">
          We collect basic information such as your name, email, website, and mobile phone to ensure seamless communication and service delivery. This information will not be used for any purpose other than the intended services.
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800">4. Limitation of Liability:</h3>
        <p className="text-gray-700">
          Infinitech Advertising Corporation shall not be held liable for any damages arising from the use or inability to use the materials on this website, even if Infinitech or its authorized representative has been notified orally or in writing of the possibility of such damage.
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800">5. Governing Law:</h3>
        <p className="text-gray-700">
          These terms and conditions are governed by and construed in accordance with the laws of the Philippines, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
        </p>
      </div>
    </div>
  );
}

export default TermsAndCondition;

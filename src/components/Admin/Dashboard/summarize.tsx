import React, { useEffect, useState } from 'react';

const fetchSummaryData = async () => {
  try {
    const employeeResponse = await fetch('/api/team');
    const partnersResponse = await fetch('/api/partners');
    const servicesResponse = await fetch('/api/services');
    
    const employeeData = await employeeResponse.json();
    const partnersData = await partnersResponse.json();
    const servicesData = await servicesResponse.json();

    return {
      totalEmployees: employeeData.length,
      totalPartners: partnersData.length,
      totalServices: servicesData.length
    };
  } catch (error) {
    console.error('Error fetching summary data:', error);
    return {
      totalEmployees: 0,
      totalPartners: 0,
      totalServices: 0
    };
  }
};

function Summarizedata() {
  const [summaryData, setSummaryData] = useState({
    totalEmployees: 0,
    totalPartners: 0,
    totalServices: 0
  });

  useEffect(() => {
    const getData = async () => {
      const data = await fetchSummaryData();
      setSummaryData(data);
    };

    getData();
  }, []);

  return (
    <div className="container-dashboard mx-auto p-10">
      <div  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 ml-20">
        <div className="col-span-1">
          <div className="p-6 bg-white shadow-lg rounded-lg text-center text-gray-800 transition-all duration-200 hover:shadow-xl hover:bg-gray-50">
            <h4 className="text-lg sm:text-xl font-semibold mb-4">All Employees</h4>
            <h2 className="text-2xl sm:text-3xl font-bold">{summaryData.totalEmployees}</h2>
          </div>
        </div>
        <div className="col-span-1">
          <div className="p-6 bg-white shadow-lg rounded-lg text-center text-gray-800 transition-all duration-200 hover:shadow-xl hover:bg-gray-50">
            <h4 className="text-lg sm:text-xl font-semibold mb-4">All Partners</h4>
            <h2 className="text-2xl sm:text-3xl font-bold">{summaryData.totalPartners}</h2>
          </div>
        </div>
        <div className="col-span-1">
          <div className="p-6 bg-white shadow-lg rounded-lg text-center text-gray-800 transition-all duration-200 hover:shadow-xl hover:bg-gray-50">
            <h4 className="text-lg sm:text-xl font-semibold mb-4">Services Offered</h4>
            <h2 className="text-2xl sm:text-3xl font-bold">{summaryData.totalServices}</h2>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Summarizedata;
